import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export default function SectionHeader({ title, description, action, className }: SectionHeaderProps) {
    return (
        <div className={cn("flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 sm:mb-12", className)}>
            <div className="mb-4 sm:mb-0">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    {title}
                </h2>
                {description && (
                    <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="mt-2 sm:mt-0 flex-shrink-0">{action}</div>}
        </div>
    );
}
