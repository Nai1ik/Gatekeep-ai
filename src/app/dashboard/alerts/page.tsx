'use client';

import { useState, useEffect, useCallback } from 'react';
import { mockAlerts } from '@/data/mockData';
import { SecurityAlert } from '@/types/types';
import { AlertCard } from '@/components/AlertCard';
import { SeverityIndicator } from '@/components/SeverityIndicator';
import { KeyTakeaway } from '@/components/KeyTakeaway';
import { BlastRadius } from '@/components/BlastRadius';
import { EventTimeline } from '@/components/EventTimeline';
import { RemediationPanel } from '@/components/RemediationPanel';
import { BehaviorComparison } from '@/components/BehaviorComparison';
import { AnimatePresence, motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

function parseApiAlert(raw: Record<string, unknown>): SecurityAlert {
    return {
        ...raw,
        timestamp: new Date(raw.timestamp as string),
        timeline: ((raw.timeline as Record<string, unknown>[]) || []).map((evt) => ({
            ...evt,
            timestamp: new Date(evt.timestamp as string),
        })),
    } as SecurityAlert;
}

export default function Dashboard() {
    const [allAlerts, setAllAlerts] = useState<SecurityAlert[]>(mockAlerts);
    const [selectedAlert, setSelectedAlert] = useState<SecurityAlert>(mockAlerts[0]);
    const [isLive, setIsLive] = useState(true);
    const [liveCount, setLiveCount] = useState(0);

    const pollAlerts = useCallback(async () => {
        try {
            const res = await fetch('/api/alerts');
            const data = await res.json();
            if (data.alerts && data.alerts.length > 0) {
                const liveAlerts: SecurityAlert[] = data.alerts.map(parseApiAlert);
                setLiveCount(liveAlerts.length);
                setAllAlerts([...liveAlerts, ...mockAlerts]);
            } else {
                setLiveCount(0);
                setAllAlerts(mockAlerts);
            }
        } catch {
            // Silently fail
        }
    }, []);

    useEffect(() => {
        if (!isLive) return;
        pollAlerts();
        const interval = setInterval(pollAlerts, 5000);
        return () => clearInterval(interval);
    }, [isLive, pollAlerts]);

    return (
        <div className="min-h-screen bg-[#09090b] text-gray-200">
            {/* Navbar */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-md flex items-center px-6 justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-lg tracking-tight">Security Command</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <span className={twMerge(
                            "relative flex h-2.5 w-2.5",
                            isLive ? "" : "opacity-50"
                        )}>
                            {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                            <span className={twMerge(
                                "relative inline-flex rounded-full h-2.5 w-2.5",
                                isLive ? "bg-emerald-500" : "bg-gray-500"
                            )}></span>
                        </span>
                        <div className="flex flex-col">
                            <span className="text-xs font-medium leading-none">
                                {isLive ? 'Live Stream' : 'Paused'}
                            </span>
                            {liveCount > 0 && (
                                <span className="text-[10px] text-gray-500 leading-none mt-1">
                                    {liveCount} updates
                                </span>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={() => setIsLive(!isLive)}
                        className="text-xs font-medium px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5 transition-colors"
                    >
                        {isLive ? 'Pause' : 'Resume'}
                    </button>
                    <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700" />
                </div>
            </header>

            <main className="pt-24 px-6 pb-6 max-w-[1920px] mx-auto">
                <div className="grid grid-cols-12 gap-6">

                    {/* Sidebar Alert List */}
                    <div className="col-span-12 lg:col-span-3">
                        <div className="sticky top-24">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <h2 className="text-sm font-semibold text-gray-400">Incoming Alerts</h2>
                                <span className="text-xs bg-white/5 px-2 py-0.5 rounded-full text-gray-500">
                                    {allAlerts.length}
                                </span>
                            </div>

                            <div className="space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
                                <AnimatePresence initial={false}>
                                    {allAlerts.map((alert) => (
                                        <AlertCard
                                            key={alert.id}
                                            alert={alert}
                                            isSelected={selectedAlert.id === alert.id}
                                            onClick={() => setSelectedAlert(alert)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-12 lg:col-span-6 space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedAlert.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                {/* Header Card */}
                                <div className="glass-card p-6">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <SeverityIndicator severity={selectedAlert.severity} size="md" />
                                                <span className="text-lg font-medium text-white">
                                                    {selectedAlert.severity} Incident Detected
                                                </span>
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                {selectedAlert.mitreAttackName} • {selectedAlert.timestamp.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    <KeyTakeaway
                                        message={selectedAlert.keyTakeaway}
                                        severity={selectedAlert.severity}
                                    />

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-3 gap-4 mt-6">
                                        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                            <p className="text-xs text-gray-500 mb-1">Source IP</p>
                                            <p className="font-mono text-gray-300">{selectedAlert.sourceIp}</p>
                                            <p className="text-xs text-gray-500 mt-1">{selectedAlert.sourceLocation}</p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                            <p className="text-xs text-gray-500 mb-1">Target</p>
                                            <p className="text-gray-300">{selectedAlert.targetAsset}</p>
                                        </div>
                                        <div className="p-4 rounded-lg bg-white/5 border border-white/5">
                                            <p className="text-xs text-gray-500 mb-1">User</p>
                                            <p className="text-gray-300">{selectedAlert.affectedUser}</p>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <p className="text-xs font-medium text-gray-500 uppercase tracking-widest mb-2">Technical Analysis</p>
                                        <p className="text-sm text-gray-400 leading-relaxed">
                                            {selectedAlert.technicalSummary}
                                        </p>
                                    </div>
                                </div>

                                {/* Visualizations */}
                                <BlastRadius data={selectedAlert.blastRadius} />
                                <EventTimeline events={selectedAlert.timeline} />

                                {/* Raw Log */}
                                <div className="glass-card p-6">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Raw Log</h3>
                                    <pre className="p-4 rounded-lg bg-black/40 text-xs font-mono text-gray-500 overflow-x-auto border border-white/5">
                                        {selectedAlert.rawLog}
                                    </pre>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Right Sidebar */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <RemediationPanel actions={selectedAlert.remediationActions} />
                            <BehaviorComparison comparisons={selectedAlert.behaviorComparisons} />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
