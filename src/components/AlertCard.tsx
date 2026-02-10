'use client';

import { SecurityAlert } from '@/types/types';
import { SeverityIndicator } from './SeverityIndicator';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AlertCardProps {
    alert: SecurityAlert;
    isSelected: boolean;
    onClick: () => void;
}

export function AlertCard({ alert, isSelected, onClick }: AlertCardProps) {
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <motion.div
            layoutId={`alert-${alert.id}`}
            onClick={onClick}
            className={twMerge(
                "group relative p-4 rounded-xl cursor-pointer border transition-all duration-200",
                isSelected
                    ? "bg-white/10 border-indigo-500/50 shadow-sm"
                    : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/10"
            )}
        >
            <div className="flex items-start justify-between mb-3">
                <SeverityIndicator severity={alert.severity} size="sm" />
                <span className="text-xs text-gray-400 font-mono">
                    {formatTime(alert.timestamp)}
                </span>
            </div>

            <h3 className="text-sm font-medium text-gray-200 mb-2 line-clamp-2">
                {alert.keyTakeaway}
            </h3>

            <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                    <div className={twMerge(
                        "w-1.5 h-1.5 rounded-full",
                        isSelected ? "bg-indigo-400" : "bg-gray-600 group-hover:bg-gray-500"
                    )} />
                    {alert.sourceIp}
                </span>
                <span>•</span>
                <span>{alert.mitreAttackTechnique}</span>
            </div>

            {/* Active Indicator Line */}
            {isSelected && (
                <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 top-3 bottom-3 w-1 rounded-r-full bg-indigo-500"
                />
            )}
        </motion.div>
    );
}
