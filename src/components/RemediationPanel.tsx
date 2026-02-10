'use client';

import { RemediationAction } from '@/types/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface RemediationPanelProps {
    actions: RemediationAction[];
}

export function RemediationPanel({ actions }: RemediationPanelProps) {
    const [actionStates, setActionStates] = useState<Record<string, string>>(
        actions.reduce((acc, action) => ({ ...acc, [action.id]: action.status }), {})
    );

    const handleAction = (actionId: string) => {
        setActionStates((prev) => ({
            ...prev,
            [actionId]: prev[actionId] === 'pending' ? 'in-progress' : 'completed',
        }));
    };

    const getIcon = (iconName: string) => {
        const icons: Record<string, JSX.Element> = {
            'shield-off': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01" />
                </svg>
            ),
            'user-x': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a6 6 0 00-6 6v1h12v-1a6 6 0 00-6-6zM21 12l-4-4m0 8l4-4" />
                </svg>
            ),
            'wifi-off': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
                </svg>
            ),
            'key': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
            ),
            'smartphone': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
            ),
            'trash-2': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            ),
            'log-out': (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
            ),
        };
        return icons[iconName] || icons['shield-off'];
    };

    return (
        <div className="glass-card p-5 h-full">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Response Plan
            </h3>

            <div className="space-y-3">
                <AnimatePresence>
                    {actions.map((action, index) => (
                        <motion.div
                            key={action.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            <button
                                onClick={() => handleAction(action.id)}
                                disabled={actionStates[action.id] === 'completed'}
                                className={twMerge(
                                    "w-full flex items-center gap-3 p-3 rounded-lg border text-sm transition-all text-left",
                                    actionStates[action.id] === 'completed'
                                        ? "bg-green-500/10 border-green-500/20 text-green-400 opacity-70"
                                        : actionStates[action.id] === 'in-progress'
                                            ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
                                            : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20"
                                )}
                            >
                                <span className={twMerge(
                                    "p-2 rounded-md",
                                    action.priority === 'high' ? "bg-red-500/20 text-red-400" : "bg-gray-700 text-gray-400"
                                )}>
                                    {getIcon(action.icon)}
                                </span>

                                <div className="flex-1">
                                    <span className="block font-medium">{action.label}</span>
                                    <span className="text-xs text-gray-500 font-light mt-0.5">{action.reasoning}</span>
                                </div>

                                {actionStates[action.id] === 'completed' && (
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}

                                {actionStates[action.id] === 'in-progress' && (
                                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                )}
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
