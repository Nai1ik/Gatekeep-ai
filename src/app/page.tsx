'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { FortressScene } from '@/components/fortress/FortressScene';
import { HUDOverlay } from '@/components/fortress/HUDOverlay';

gsap.registerPlugin(ScrollTrigger);

export default function DigitalFortress() {
    const containerRef = useRef<HTMLDivElement>(null!);
    const [progress, setProgress] = useState(0);

    // Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.8,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
        };
    }, []);

    // Master ScrollTrigger for HUD progress
    useEffect(() => {
        if (!containerRef.current) return;

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2,
            onUpdate: (self) => {
                setProgress(self.progress);
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    const phase = progress < 0.25 ? 1 : progress < 0.5 ? 2 : progress < 0.75 ? 3 : 4;

    const statusText = phase === 1 ? 'THREAT_ACTIVE' :
        phase === 2 ? 'MITIGATING' :
            phase === 3 ? 'DEPLOYING' : 'SECURE';

    const statusColor = phase === 1 ? '#FF0000' :
        phase === 2 ? '#FFBF00' :
            phase === 3 ? '#00FF88' : '#00F2FF';

    return (
        <div ref={containerRef} className="bg-black" style={{ height: '500vh' }}>
            {/* Three.js Canvas */}
            <FortressScene containerRef={containerRef} />

            {/* Scanline + Grain overlays */}
            <div className="scanline-overlay" />
            <div className="grain-overlay" />

            {/* ===== FIXED NAVIGATION ===== */}
            <nav className="fortress-nav">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/80 font-mono">
                        GATEKEEP_AI
                    </span>
                    <div className="h-3 w-px bg-white/10" />
                    <span className="text-[9px] tracking-[0.12em] uppercase text-white/30 font-mono">
                        Digital Fortress v3.0
                    </span>
                </div>

                <div className="flex items-center gap-5">
                    {/* Live status indicator */}
                    <div className="flex items-center gap-2">
                        <div
                            className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
                            style={{
                                background: statusColor,
                                boxShadow: `0 0 8px ${statusColor}`,
                                animation: 'pulse 1.5s ease infinite',
                            }}
                        />
                        <span
                            className="text-[9px] tracking-[0.15em] uppercase font-mono transition-colors duration-300"
                            style={{ color: statusColor }}
                        >
                            {statusText}
                        </span>
                    </div>

                    <div className="h-3 w-px bg-white/10" />

                    {/* Progress bar */}
                    <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                                width: `${progress * 100}%`,
                                background: statusColor,
                            }}
                        />
                    </div>

                    <div className="h-3 w-px bg-white/10" />

                    <Link
                        href="/dashboard"
                        className="text-[9px] tracking-[0.12em] uppercase font-mono px-3 py-1 border text-cyan-400/80 border-cyan-400/20 hover:bg-cyan-400/10 hover:border-cyan-400/40 transition-all"
                    >
                        Dashboard →
                    </Link>
                </div>
            </nav>

            {/* ===== HUD OVERLAY (Scrollable HTML) ===== */}
            <HUDOverlay progress={progress} />

            {/* ===== SCROLL INDICATOR ===== */}
            <div
                className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 transition-opacity duration-500"
                style={{ opacity: progress < 0.05 ? 1 : 0 }}
            >
                <span className="text-[8px] tracking-[0.25em] uppercase text-white/20 font-mono">
                    Scroll to enter
                </span>
                <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
            </div>
        </div>
    );
}
