'use client';

import { SeverityLevel } from '@/types/types';

interface KeyTakeawayProps {
    message: string;
    severity: SeverityLevel;
}

export function KeyTakeaway({ message, severity }: KeyTakeawayProps) {
    return (
        <div className="glass-card p-6 border-l-4 border-l-indigo-500">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Executive Summary
            </h3>
            <p className="text-base text-gray-200 leading-relaxed font-light">
                {message}
            </p>
        </div>
    );
}
