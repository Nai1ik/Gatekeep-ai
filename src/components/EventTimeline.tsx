'use client';

import { TimelineEvent } from '@/types/types';
import { motion } from 'framer-motion';

interface EventTimelineProps {
    events: TimelineEvent[];
}

export function EventTimeline({ events }: EventTimelineProps) {
    const sortedEvents = [...events].sort(
        (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            second: '2-digit'
        });
    };

    return (
        <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Event Timeline
            </h3>

            <div className="relative pl-4 space-y-8">
                {/* Vertical Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-gray-800" />

                {sortedEvents.map((event, index) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex gap-4"
                    >
                        {/* Dot */}
                        <div className={`
                            relative z-10 w-2.5 h-2.5 rounded-full mt-1.5 ring-4 ring-black
                            ${event.severity === 'CRITICAL' ? 'bg-red-500' :
                                event.severity === 'WARNING' ? 'bg-amber-500' : 'bg-blue-500'}
                        `} />

                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-mono text-gray-500">
                                    {formatTime(event.timestamp)}
                                </span>
                                <span className={`text-[10px] uppercase font-bold tracking-wide
                                    ${event.severity === 'CRITICAL' ? 'text-red-400' :
                                        event.severity === 'WARNING' ? 'text-amber-400' : 'text-blue-400'}
                                `}>
                                    {event.severity}
                                </span>
                            </div>

                            <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02]">
                                <h4 className="text-sm font-medium text-gray-200 mb-1">
                                    {event.title}
                                </h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {event.description}
                                </p>
                                {event.source && (
                                    <div className="mt-2 text-xs font-mono text-gray-600">
                                        Source: {event.source}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
