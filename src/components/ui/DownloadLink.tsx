'use client';

import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';
import { downloadServiceOrigin, trackedDownloadHref } from '@/lib/downloads';
import { useLocaleStore } from '@/lib/stores/localeStore';

const site = process.env.NEXT_PUBLIC_SITE_REPOSITORY || '';

type DownloadLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export default function DownloadLink({ href, children, ...props }: DownloadLinkProps) {
  const locale = useLocaleStore(state => state.locale);
  const trackedHref = trackedDownloadHref(href, site, locale);
  if (trackedHref) {
    const language = site === 'ResumeCN' ? 'zh-cn' : locale;
    const backup = backupMessages[language] || backupMessages.en;
    return (
      <span className="inline-flex w-fit flex-wrap items-baseline gap-x-3 gap-y-1 print:hidden">
        <a {...props} href={trackedHref} referrerPolicy="no-referrer">{children}</a>
        <Link
          href={href}
          download={props.download}
          prefetch={false}
          title={backup.title}
          className="text-xs text-neutral-500 underline decoration-neutral-300 underline-offset-2 transition-colors hover:text-accent"
        >
          {backup.label}
        </Link>
      </span>
    );
  }
  // Keep Next.js basePath handling while logging is disabled. Never prefetch downloads.
  return <Link {...props} href={href} prefetch={false}>{children}</Link>;
}

const backupMessages: Record<string, { label: string; title: string }> = {
  en: { label: 'Backup download', title: 'Use the original file link if the main download is unavailable. Backup downloads are not logged.' },
  zh: { label: '備用下載', title: '主下載入口無法使用時，可由此下載原檔；備用下載不記錄日誌。' },
  'zh-cn': { label: '备用下载', title: '主下载入口不可用时，可由此下载原文件；备用下载不记录日志。' },
};

const notices: Record<string, string> = {
  en: 'Main downloads are logged for security (IP address, time and file version; about 30 days). Backup downloads are not logged.',
  zh: '主下載入口會記錄 IP 位址、時間及檔案版本，僅供安全稽核，保留約 30 天；備用下載不記錄。',
  'zh-cn': '主下载入口记录 IP 地址、时间及文件版本，仅用于安全审计，保留约 30 天；备用下载不记录。',
};

export function DownloadPrivacyNotice({ className = '' }: { className?: string }) {
  const locale = useLocaleStore(state => state.locale);
  if (!downloadServiceOrigin()) return null;
  const language = site === 'ResumeCN' ? 'zh-cn' : locale;
  return <p className={'print:hidden text-xs leading-relaxed text-neutral-500 ' + className}>{notices[language] || notices.en}</p>;
}
