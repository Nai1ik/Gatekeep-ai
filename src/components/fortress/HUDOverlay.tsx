'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { TextScramble } from './TextScramble';

interface HUDOverlayProps {
    progress: number;
}

function AttackCounter({ isActive }: { isActive: boolean }) {
    const [count, setCount] = useState(0);
    const targetRef = useRef(44847);

    useEffect(() => {
        if (!isActive) { setCount(0); return; }

        const start = Date.now();
        const duration = 2000;
        let frame: number;

        const tick = () => {
            const elapsed = Date.now() - start;
            const p = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(eased * targetRef.current));
            if (p < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [isActive]);

    return (
        <span className="font-mono text-red-500 tabular-nums">
            {count.toLocaleString()}+
        </span>
    );
}

export function HUDOverlay({ progress }: HUDOverlayProps) {
    const phase = progress < 0.25 ? 1 : progress < 0.5 ? 2 : progress < 0.75 ? 3 : 4;

    return (
        <div className="relative z-10 pointer-events-none">
            {/* ===== PHASE 1: RED ALERT ===== */}
            <section className="h-[125vh] flex items-center justify-center relative">
                <div
                    className="text-center transition-opacity duration-500"
                    style={{ opacity: phase === 1 ? 1 : 0 }}
                >
                    <div className="mb-6">
                        <TextScramble
                            text="[THREAT_DETECTED]"
                            isActive={phase === 1}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-red-500 tracking-[0.15em]"
                        />
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-8">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs tracking-[0.2em] uppercase text-red-500/60 font-mono">
                            Daily Global Cyber Attacks
                        </span>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    </div>

                    <div className="text-5xl md:text-7xl font-bold tracking-tight">
                        <AttackCounter isActive={phase === 1} />
                    </div>

                    <p className="mt-6 text-xs text-gray-600 font-mono tracking-[0.15em] max-w-md mx-auto">
                        Active threats detected across global infrastructure endpoints in the last 24 hours
                    </p>
                </div>
            </section>

            {/* ===== PHASE 2: AMBER PIVOT ===== */}
            <section className="h-[125vh] flex items-center justify-center relative">
                <div
                    className="text-center transition-opacity duration-500"
                    style={{ opacity: phase === 2 ? 1 : 0 }}
                >
                    <div className="mb-8">
                        <TextScramble
                            text="[MITIGATION_MODE]"
                            isActive={phase === 2}
                            className="text-4xl md:text-6xl lg:text-7xl font-bold text-amber-400 tracking-[0.15em]"
                        />
                    </div>

                    <div className="space-y-4 max-w-lg mx-auto text-left">
                        {[
                            { label: 'Anonymizing PII', delay: 0.3 },
                            { label: 'Sanitizing Prompts', delay: 0.6 },
                            { label: 'Neutralizing Injection', delay: 0.9 },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 transition-all duration-500"
                                style={{
                                    opacity: phase === 2 ? 1 : 0,
                                    transform: phase === 2 ? 'translateX(0)' : 'translateX(-20px)',
                                    transitionDelay: `${item.delay}s`,
                                }}
                            >
                                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
                                <span className="text-sm md:text-base text-gray-300 font-mono tracking-wider">
                                    {item.label}
                                </span>
                                <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent" />
                                <span className="text-[10px] text-cyan-400/60 font-mono">ACTIVE</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 flex items-center justify-center gap-2">
                        <div className="w-8 h-px bg-amber-500/40" />
                        <span className="text-[10px] text-amber-500/60 font-mono tracking-[0.2em]">
                            SENTINEL-LLM PROCESSING
                        </span>
                        <div className="w-8 h-px bg-amber-500/40" />
                    </div>
                </div>
            </section>

            {/* ===== PHASE 3: SENTINEL TAKEOFF ===== */}
            <section className="h-[125vh] flex items-center justify-center relative">
                <div
                    className="text-center transition-opacity duration-700"
                    style={{ opacity: phase === 3 ? 1 : 0 }}
                >
                    <TextScramble
                        text="[SENTINEL_DEPLOYED]"
                        isActive={phase === 3}
                        className="text-3xl md:text-5xl font-bold text-green-400 tracking-[0.15em]"
                    />

                    <div className="mt-6 flex items-center justify-center gap-6">
                        <div className="text-[10px] text-gray-600 font-mono">
                            <span className="text-green-500">●</span> BEACON: ACTIVE
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono">
                            VECTOR: 045°
                        </div>
                        <div className="text-[10px] text-gray-600 font-mono">
                            VELOCITY: 0.98c
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PHASE 4: FIREWALL HOLOGRAM ===== */}
            <section className="h-[125vh] flex items-center justify-center relative">
                <div
                    className="text-center transition-opacity duration-700 pointer-events-auto"
                    style={{ opacity: phase === 4 ? 1 : 0 }}
                >
                    <TextScramble
                        text="[SYSTEM_SECURE]"
                        isActive={phase === 4}
                        className="text-4xl md:text-6xl font-bold text-cyan-400 tracking-[0.15em]"
                    />

                    <p className="mt-4 text-sm text-gray-500 font-mono tracking-wider max-w-md mx-auto">
                        Firewall integrity verified. All threat vectors neutralized.
                    </p>

                    {/* HUD Panels */}
                    <div className="mt-10 flex items-center justify-center gap-6">
                        <Link
                            href="/dashboard"
                            className="hud-panel group"
                        >
                            <span className="hud-bracket tl" />
                            <span className="hud-bracket tr" />
                            <span className="hud-bracket bl" />
                            <span className="hud-bracket br" />
                            <span className="text-xs font-mono tracking-[0.15em] text-cyan-400 group-hover:text-white transition-colors">
                                [PROCEED TO DASHBOARD]
                            </span>
                        </Link>

                        <Link
                            href="/dashboard/alerts"
                            className="hud-panel group"
                        >
                            <span className="hud-bracket tl" />
                            <span className="hud-bracket tr" />
                            <span className="hud-bracket bl" />
                            <span className="hud-bracket br" />
                            <span className="text-xs font-mono tracking-[0.15em] text-cyan-400 group-hover:text-white transition-colors">
                                [INITIALIZE DATA_STREAM]
                            </span>
                        </Link>
                    </div>

                    {/* Corner Metadata */}
                    <div className="fixed bottom-6 left-6 text-left pointer-events-none"
                        style={{ opacity: phase === 4 ? 0.6 : 0 }}
                    >
                        <div className="text-[9px] font-mono text-cyan-500/50 space-y-1">
                            <div>ENCRYPTION: <span className="text-cyan-400">AES-256</span></div>
                            <div>PROTOCOL: <span className="text-cyan-400">TLS 1.3</span></div>
                        </div>
                    </div>

                    <div className="fixed bottom-6 right-6 text-right pointer-events-none"
                        style={{ opacity: phase === 4 ? 0.6 : 0 }}
                    >
                        <div className="text-[9px] font-mono text-cyan-500/50 space-y-1">
                            <div>GATEWAY: <span className="text-green-400">ACTIVE</span></div>
                            <div>LATENCY: <span className="text-cyan-400">12ms</span></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
