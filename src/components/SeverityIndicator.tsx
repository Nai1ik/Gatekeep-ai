'use client';

import { SeverityLevel } from '@/types/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface SeverityIndicatorProps {
    severity: SeverityLevel;
    size?: 'sm' | 'md' | 'lg';
    className?: string; // Allow custom classes
}

export function SeverityIndicator({ severity, size = 'md', className }: SeverityIndicatorProps) {
    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs gap-1.5',
        md: 'px-3 py-1 text-sm gap-2',
        lg: 'px-4 py-1.5 text-base gap-2.5',
    };

    const styles = {
        CRITICAL: {
            container: 'bg-red-500/10 text-red-400 border-red-500/20',
            dot: 'bg-red-500',
        },
        WARNING: {
            container: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            dot: 'bg-amber-500',
        },
        INFO: {
            container: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            dot: 'bg-blue-500',
        },
    };

    const config = styles[severity] || styles.INFO;

    return (
        <div
            className={cn(
                'inline-flex items-center font-medium rounded-full border',
                config.container,
                sizeClasses[size],
                className
            )}
        >
            <div className={cn("rounded-full", config.dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
            <span className="tracking-wide uppercase">{severity}</span>
        </div>
    );
}
