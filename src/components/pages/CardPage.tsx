'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { ArrowUpRight, Download } from 'lucide-react';
import Link from 'next/link';
import { CardPageConfig } from '@/types/page';

const markdownComponents = {
    p: ({ children }: React.ComponentProps<'p'>) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }: React.ComponentProps<'ul'>) => <ul className="mb-3 list-disc space-y-2 pl-5 marker:text-accent">{children}</ul>,
    ol: ({ children }: React.ComponentProps<'ol'>) => <ol className="mb-3 list-decimal space-y-2 pl-5 marker:text-accent">{children}</ol>,
    li: ({ children }: React.ComponentProps<'li'>) => <li>{children}</li>,
    a: ({ ...props }) => (
        <a
            {...props}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
        />
    ),
    blockquote: ({ children }: React.ComponentProps<'blockquote'>) => (
        <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
            {children}
        </blockquote>
    ),
    strong: ({ children }: React.ComponentProps<'strong'>) => <strong className="font-semibold text-primary">{children}</strong>,
    em: ({ children }: React.ComponentProps<'em'>) => <em className="italic">{children}</em>,
    code: ({ children }: React.ComponentProps<'code'>) => (
        <code className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[0.95em]">{children}</code>
    ),
};

export default function CardPage({ config, embedded = false }: { config: CardPageConfig; embedded?: boolean }) {
    const columnClass = config.columns === 2 ? 'md:grid-cols-2' : 'grid-cols-1';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <div className={embedded ? "mb-6" : "mb-10"}>
                <h1 className={`${embedded ? "text-3xl" : "text-4xl"} mb-3 font-serif font-bold tracking-tight text-primary`}>{config.title}</h1>
                {config.description && (
                    <div className={`${embedded ? "text-base" : "text-lg"} max-w-3xl leading-relaxed text-neutral-600 dark:text-neutral-500`}>
                        <ReactMarkdown components={markdownComponents}>
                            {config.description}
                        </ReactMarkdown>
                    </div>
                )}
            </div>

            <div className={`grid ${columnClass} ${embedded ? "gap-4" : "gap-6"}`}>
                {config.items.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.1 * index }}
                        className={`group relative overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 ${embedded ? "p-5 sm:p-6" : "p-6 sm:p-7"}`}
                    >
                        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <h3 className={`${embedded ? "text-xl" : "text-2xl"} max-w-2xl font-semibold leading-snug text-primary`}>{item.title}</h3>
                            {item.date && (
                                <span className="w-fit shrink-0 rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent-dark dark:text-accent-light">
                                    {item.date}
                                </span>
                            )}
                        </div>
                        {item.subtitle && (
                            <p className={`${embedded ? "text-sm" : "text-base"} mb-4 font-semibold text-accent`}>{item.subtitle}</p>
                        )}
                        {item.content && (
                            <div className={`${embedded ? "text-sm" : "text-base"} leading-relaxed text-neutral-600 dark:text-neutral-500`}>
                                <ReactMarkdown components={markdownComponents}>
                                    {item.content}
                                </ReactMarkdown>
                            </div>
                        )}
                        {item.tags && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {item.tags.map(tag => (
                                    <span key={tag} className="rounded-full border border-neutral-200 bg-neutral-50 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800/60 dark:text-neutral-500">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        {item.download_url && (
                            <Link
                                href={item.download_url}
                                download={item.download_url.split('/').pop()}
                                className="mt-5 mr-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-dark"
                            >
                                <Download className="h-4 w-4" aria-hidden="true" />
                                {item.download_label || 'Download workbook'}
                            </Link>
                        )}
                        {item.link && (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-dark"
                            >
                                {item.link_label || 'View details'}
                                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                            </a>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
