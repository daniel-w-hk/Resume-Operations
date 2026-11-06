import service from '../../download-service.json';

export function downloadServiceOrigin(endpoint: string = service.endpoint): string | null {
  if (!endpoint.trim()) return null;
  try {
    const url = new URL(endpoint.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null;
    return url.origin;
  } catch {
    return null;
  }
}

export function trackedDownloadHref(
  path: string,
  site: string,
  locale: string,
  endpoint: string = service.endpoint,
): string | null {
  const origin = downloadServiceOrigin(endpoint);
  if (!origin || !path.startsWith('/downloads/')) return null;
  const url = new URL('/download', origin);
  url.searchParams.set('site', site);
  url.searchParams.set('locale', site === 'ResumeCN' ? 'zh-cn' : locale);
  url.searchParams.set('file', path);
  return url.toString();
}
