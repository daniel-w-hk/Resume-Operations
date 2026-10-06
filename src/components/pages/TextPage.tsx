'use client';

import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { TextPageConfig } from '@/types/page';
import { useMessages } from '@/lib/i18n/useMessages';

interface TextPageProps {
    config: TextPageConfig;
    content: string;
    embedded?: boolean;
}

export default function TextPage({ config, content, embedded = false }: TextPageProps) {
    const messages = useMessages();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className={embedded ? "" : "resume-document mx-auto max-w-4xl"}
        >
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:mb-4">
                <h1 className={`${embedded ? "text-3xl" : "text-4xl"} font-serif font-bold tracking-tight text-primary`}>{config.title}</h1>
                {config.printable && !embedded && (
                    <Link
                        href={config.download_url || '/downloads/Mingkang-Wang-CV.pdf'}
                        download={config.download_filename || config.download_url?.split('/').pop() || 'Mingkang-Wang-CV.pdf'}
                        className="print-action inline-flex w-fit items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-primary shadow-sm transition-colors hover:border-accent hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent dark:border-neutral-700 dark:bg-neutral-900"
                    >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        {messages.resume.printOrSave}
                    </Link>
                )}
            </div>
            {config.description && (
                <p className={`${embedded ? "text-base" : "text-lg"} mb-8 max-w-2xl text-neutral-600 dark:text-neutral-500`}>
                    {config.description}
                </p>
            )}
            <div className="resume-content leading-relaxed text-neutral-700 dark:text-neutral-600">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => <h1 className="mb-4 mt-8 text-3xl font-serif font-bold text-primary">{children}</h1>,
                        h2: ({ children }) => <h2 className="mb-4 mt-9 border-b border-neutral-200 pb-2 text-2xl font-serif font-bold text-primary dark:border-neutral-800">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-xl font-semibold text-primary mt-6 mb-3">{children}</h3>,
                        p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-4 list-disc space-y-1.5 pl-5 marker:text-accent">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-4 list-decimal space-y-1.5 pl-5 marker:text-accent">{children}</ol>,
                        li: ({ children }) => <li>{children}</li>,
                        a: ({ ...props }) => (
                            <a
                                {...props}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent font-medium transition-all duration-200 rounded hover:bg-accent/10 hover:shadow-sm"
                            />
                        ),
                        blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-accent/50 pl-4 italic my-4 text-neutral-600 dark:text-neutral-500">
                                {children}
                            </blockquote>
                        ),
                        strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                        em: ({ children }) => <em className="italic text-neutral-600 dark:text-neutral-500">{children}</em>,
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </motion.div>
    );
}
