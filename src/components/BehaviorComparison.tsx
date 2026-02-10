'use client';

import { BehaviorComparison as BehaviorComparisonType } from '@/types/types';
import { motion } from 'framer-motion';

interface BehaviorComparisonProps {
    comparisons: BehaviorComparisonType[];
}

export function BehaviorComparison({ comparisons }: BehaviorComparisonProps) {
    const getMaxValue = (comparison: BehaviorComparisonType) => {
        return Math.max(comparison.normalValue, comparison.currentValue);
    };

    const getNormalizedHeight = (value: number, max: number) => {
        if (max === 0) return 0;
        return Math.min((value / max) * 100, 100);
    };

    return (
        <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Behavior Analysis
            </h3>

            <div className="space-y-8">
                {comparisons.map((comparison, index) => {
                    const maxVal = getMaxValue(comparison);
                    const normalHeight = getNormalizedHeight(comparison.normalValue, maxVal);
                    const currentHeight = getNormalizedHeight(comparison.currentValue, maxVal);
                    const isAnomaly = comparison.currentValue > comparison.normalValue * 1.5;

                    return (
                        <div key={index}>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-medium text-gray-300 uppercase tracking-wide">
                                    {comparison.metric}
                                </span>
                                {isAnomaly && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">
                                        ANOMALY
                                    </span>
                                )}
                            </div>

                            <div className="h-24 flex items-end gap-2 p-2 rounded-lg bg-black/20 mb-2">
                                {/* Normal Bar */}
                                <div className="flex-1 flex flex-col items-center gap-1 group">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${normalHeight}%` }}
                                        className="w-full bg-gray-700/50 rounded-t transition-all group-hover:bg-gray-700"
                                    />
                                    <span className="text-[10px] text-gray-500 font-mono">
                                        {comparison.normalValue} (Avg)
                                    </span>
                                </div>

                                {/* Current Bar */}
                                <div className="flex-1 flex flex-col items-center gap-1 group">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${currentHeight}%` }}
                                        className={`w-full rounded-t transition-all
                                            ${isAnomaly ? 'bg-red-500/50 group-hover:bg-red-500' : 'bg-indigo-500/50 group-hover:bg-indigo-500'}
                                        `}
                                    />
                                    <span className={`text-[10px] font-mono
                                        ${isAnomaly ? 'text-red-400' : 'text-indigo-400'}
                                    `}>
                                        {comparison.currentValue} (Now)
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-gray-500 leading-tight">
                                {comparison.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
