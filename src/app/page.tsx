'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { TrafficLight } from '@/components/TrafficLight';
import { BentoGrid } from '@/components/BentoGrid';

gsap.registerPlugin(ScrollTrigger);

type LightState = 'green' | 'yellow' | 'red';

export default function LandingPage() {
    const [lightState, setLightState] = useState<LightState>('green');
    const [isOverridden, setIsOverridden] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const heroRef = useRef<HTMLDivElement>(null);
    const overrideTimerRef = useRef<ReturnType<typeof setTimeout>>();

    // Lenis smooth scroll
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        function raf(time: number) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        // Sync Lenis with GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);

        return () => {
            lenis.destroy();
        };
    }, []);

    // GSAP ScrollTrigger for traffic light
    useEffect(() => {
        if (!containerRef.current) return;

        ScrollTrigger.create({
            trigger: containerRef.current,
            start: 'top top',
            end: 'bottom bottom',
            onUpdate: (self) => {
                if (isOverridden) return;

                const progress = self.progress;
                if (progress < 0.3) {
                    setLightState('green');
                } else if (progress < 0.6) {
                    setLightState('yellow');
                } else {
                    setLightState('red');
                }
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [isOverridden]);

    // Manual override handler
    const handleNeutralize = useCallback(() => {
        setIsOverridden(true);
        setLightState('green');

        // Resume scroll control after 3 seconds
        if (overrideTimerRef.current) clearTimeout(overrideTimerRef.current);
        overrideTimerRef.current = setTimeout(() => {
            setIsOverridden(false);
        }, 3000);
    }, []);

    useEffect(() => {
        return () => {
            if (overrideTimerRef.current) clearTimeout(overrideTimerRef.current);
        };
    }, []);

    const isRed = lightState === 'red';

    return (
        <div
            ref={containerRef}
            className={`transition-colors duration-700 ${isRed ? 'state-red' : ''}`}
            style={{ background: isRed ? '#0A0A0A' : '#F4F4F4' }}
        >
            {/* ===== NAVIGATION ===== */}
            <nav
                className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-700"
                style={{
                    borderColor: isRed ? '#FF4500' : '#E5E5E5',
                    background: isRed ? 'rgba(10,10,10,0.95)' : 'rgba(244,244,244,0.95)',
                    backdropFilter: 'blur(8px)',
                }}
            >
                <div className="max-w-[1400px] mx-auto flex items-center justify-between h-14 px-6">
                    <div className="flex items-center gap-4">
                        <span
                            className="text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-700"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                color: isRed ? '#F4F4F4' : '#0A0A0A',
                            }}
                        >
                            SEC_CMD
                        </span>
                        <div
                            className="h-4 w-px transition-colors duration-700"
                            style={{ background: isRed ? '#333' : '#E5E5E5' }}
                        />
                        <span
                            className="text-[10px] tracking-[0.15em] uppercase transition-colors duration-700"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                color: isRed ? '#666' : '#999',
                            }}
                        >
                            Security Operations Platform
                        </span>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Status indicator */}
                        <div className="flex items-center gap-2">
                            <div
                                className="w-1.5 h-1.5 rounded-full transition-colors duration-700"
                                style={{
                                    background: lightState === 'green' ? '#22c55e' :
                                        lightState === 'yellow' ? '#eab308' : '#FF4500',
                                    boxShadow: `0 0 6px ${lightState === 'green' ? '#22c55e' :
                                            lightState === 'yellow' ? '#eab308' : '#FF4500'
                                        }`,
                                }}
                            />
                            <span
                                className="text-[10px] tracking-[0.15em] uppercase transition-colors duration-700"
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    color: isRed ? '#FF4500' : '#666',
                                }}
                            >
                                {lightState === 'green' ? 'SYS_NOMINAL' :
                                    lightState === 'yellow' ? 'SYS_SCANNING' : 'THREAT_ACTIVE'}
                            </span>
                        </div>

                        <div
                            className="h-4 w-px transition-colors duration-700"
                            style={{ background: isRed ? '#333' : '#E5E5E5' }}
                        />

                        <Link
                            href="/dashboard"
                            className="text-[10px] tracking-[0.15em] uppercase px-4 py-1.5 border transition-colors duration-300"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                borderColor: isRed ? '#FF4500' : '#0A0A0A',
                                color: isRed ? '#FF4500' : '#0A0A0A',
                            }}
                        >
                            Enter Dashboard →
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section
                ref={heroRef}
                className="min-h-screen flex flex-col items-center justify-center relative pt-14"
            >
                {/* Background grid overlay */}
                <div
                    className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                    style={{
                        backgroundImage: `
                            linear-gradient(${isRed ? '#FF450015' : '#E5E5E5'} 1px, transparent 1px),
                            linear-gradient(90deg, ${isRed ? '#FF450015' : '#E5E5E5'} 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px',
                        opacity: 0.5,
                    }}
                />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Traffic Light */}
                    <TrafficLight state={lightState} onNeutralize={handleNeutralize} />

                    <div className="mt-16 text-center max-w-3xl px-6">
                        <h1
                            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-6 transition-colors duration-700"
                            style={{
                                fontFamily: 'var(--font-display)',
                                color: isRed ? '#F4F4F4' : '#0A0A0A',
                            }}
                        >
                            SECURITY<br />
                            <span style={{ color: '#FF4500' }}>COMMAND</span>
                        </h1>

                        <p
                            className="text-sm md:text-base leading-relaxed mb-10 max-w-lg mx-auto transition-colors duration-700"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                color: isRed ? '#666' : '#666',
                            }}
                        >
                            Advanced threat detection and automated response
                            for modern security operations centers.
                        </p>

                        <div className="flex items-center justify-center gap-4">
                            <Link
                                href="/dashboard"
                                className="text-xs tracking-[0.15em] uppercase px-8 py-3 transition-all duration-300 font-medium"
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    background: isRed ? '#FF4500' : '#0A0A0A',
                                    color: isRed ? '#0A0A0A' : '#F4F4F4',
                                }}
                            >
                                View Live Demo
                            </Link>
                            <button
                                onClick={() => {
                                    const el = document.getElementById('capabilities');
                                    el?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="text-xs tracking-[0.15em] uppercase px-8 py-3 border transition-all duration-300 font-medium"
                                style={{
                                    fontFamily: 'var(--font-mono)',
                                    borderColor: isRed ? '#FF4500' : '#0A0A0A',
                                    color: isRed ? '#FF4500' : '#0A0A0A',
                                }}
                            >
                                Explore Capabilities
                            </button>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
                        <span
                            className="text-[9px] tracking-[0.2em] uppercase transition-colors duration-700"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                color: isRed ? '#444' : '#aaa',
                            }}
                        >
                            Scroll to activate
                        </span>
                        <div
                            className="w-px h-8 transition-colors duration-700"
                            style={{ background: isRed ? '#333' : '#ccc' }}
                        />
                    </div>
                </div>
            </section>

            {/* ===== BENTO GRID ===== */}
            <section
                id="capabilities"
                className="max-w-[1400px] mx-auto px-6 py-32"
            >
                <div className="mb-16 flex items-end justify-between">
                    <div>
                        <span
                            className="text-[10px] tracking-[0.2em] uppercase mb-3 block transition-colors duration-700"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                color: isRed ? '#FF4500' : '#999',
                            }}
                        >
                            System Capabilities
                        </span>
                        <h2
                            className="text-3xl md:text-5xl font-bold tracking-tighter transition-colors duration-700"
                            style={{
                                fontFamily: 'var(--font-display)',
                                color: isRed ? '#F4F4F4' : '#0A0A0A',
                            }}
                        >
                            Built for<br />
                            the Modern SOC
                        </h2>
                    </div>
                    <span
                        className="text-[10px] tracking-[0.15em] uppercase hidden md:block transition-colors duration-700"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            color: isRed ? '#444' : '#999',
                        }}
                    >
                        [06 MODULES]
                    </span>
                </div>

                <BentoGrid isRedState={isRed} />
            </section>

            {/* ===== CTA SECTION ===== */}
            <section
                className="border-t transition-colors duration-700"
                style={{ borderColor: isRed ? '#FF4500' : '#E5E5E5' }}
            >
                <div className="max-w-[1400px] mx-auto px-6 py-32 text-center">
                    <h2
                        className="text-3xl md:text-5xl font-bold tracking-tighter mb-6 transition-colors duration-700"
                        style={{
                            fontFamily: 'var(--font-display)',
                            color: isRed ? '#F4F4F4' : '#0A0A0A',
                        }}
                    >
                        Ready to Deploy?
                    </h2>
                    <p
                        className="text-sm max-w-md mx-auto mb-10 transition-colors duration-700"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            color: isRed ? '#666' : '#666',
                        }}
                    >
                        Connect your existing SIEM infrastructure and start monitoring in minutes.
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <Link
                            href="/dashboard"
                            className="text-xs tracking-[0.15em] uppercase px-8 py-3 transition-all duration-300 font-medium"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                background: isRed ? '#FF4500' : '#0A0A0A',
                                color: isRed ? '#0A0A0A' : '#F4F4F4',
                            }}
                        >
                            Enter Dashboard
                        </Link>
                        <Link
                            href="/dashboard"
                            className="text-xs tracking-[0.15em] uppercase px-8 py-3 border transition-all duration-300 font-medium"
                            style={{
                                fontFamily: 'var(--font-mono)',
                                borderColor: isRed ? '#FF4500' : '#0A0A0A',
                                color: isRed ? '#FF4500' : '#0A0A0A',
                            }}
                        >
                            Connect Data
                        </Link>
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer
                className="border-t transition-colors duration-700"
                style={{ borderColor: isRed ? '#333' : '#E5E5E5' }}
            >
                <div className="max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between">
                    <span
                        className="text-[10px] tracking-[0.15em] uppercase transition-colors duration-700"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            color: isRed ? '#444' : '#999',
                        }}
                    >
                        Security Command v2.0
                    </span>
                    <span
                        className="text-[10px] tracking-[0.15em] uppercase transition-colors duration-700"
                        style={{
                            fontFamily: 'var(--font-mono)',
                            color: isRed ? '#444' : '#999',
                        }}
                    >
                        © 2026 — All Systems Monitored
                    </span>
                </div>
            </footer>
        </div>
    );
}
