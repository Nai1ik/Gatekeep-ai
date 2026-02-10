'use client';

import { useEffect, useRef, useCallback, useState } from 'react';

interface BentoCardData {
    id: string;
    refId: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    colSpan: string;
    rowSpan?: string;
}

interface BentoGridProps {
    isRedState: boolean;
}

// Scramble effect
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*';

function useScrambleText(originalText: string, isHovering: boolean): string {
    const [displayText, setDisplayText] = useState(originalText);
    const frameRef = useRef<number>();

    useEffect(() => {
        if (!isHovering) {
            setDisplayText(originalText);
            return;
        }

        let iteration = 0;
        const maxIterations = originalText.length;

        const scramble = () => {
            setDisplayText(
                originalText
                    .split('')
                    .map((char, i) => {
                        if (char === ' ') return ' ';
                        if (i < iteration) return originalText[i];
                        return CHARS[Math.floor(Math.random() * CHARS.length)];
                    })
                    .join('')
            );

            iteration += 0.5;

            if (iteration < maxIterations) {
                frameRef.current = requestAnimationFrame(scramble);
            }
        };

        frameRef.current = requestAnimationFrame(scramble);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [isHovering, originalText]);

    return displayText;
}

function BentoCard({ card, isRedState }: { card: BentoCardData; isRedState: boolean }) {
    const [isHovering, setIsHovering] = useState(false);
    const [isDrawn, setIsDrawn] = useState(false);
    const [refVisible, setRefVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const scrambledTitle = useScrambleText(card.title, isHovering);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    // Stagger the draw
                    const delay = Math.random() * 400;
                    setTimeout(() => setIsDrawn(true), delay);
                    setTimeout(() => setRefVisible(true), delay + 300);
                }
            },
            { threshold: 0.2 }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={cardRef}
            className={`bento-card border-draw ${isDrawn ? 'drawn' : ''} ${card.colSpan} ${card.rowSpan || ''} relative group`}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            style={{
                padding: '24px',
                background: isRedState ? '#0A0A0A' : (isHovering ? '#ECECEC' : 'transparent'),
                transition: 'background 0.3s ease, color 0.3s ease',
                color: isRedState ? '#F4F4F4' : '#0A0A0A',
                borderColor: isRedState ? '#FF4500' : undefined,
                cursor: 'default',
            }}
        >
            {/* BOX_REF */}
            <span className={`box-ref absolute top-3 right-3 ${refVisible ? 'visible' : ''}`}>
                {card.refId}
            </span>

            {/* Icon */}
            <div className="mb-4 opacity-60" style={{ color: isRedState ? '#FF4500' : '#0A0A0A' }}>
                {card.icon}
            </div>

            {/* Title */}
            <h3
                className="text-lg font-bold mb-2 tracking-tight"
                style={{ fontFamily: 'var(--font-display)', minHeight: '1.5em' }}
            >
                {scrambledTitle}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ opacity: 0.6 }}>
                {card.description}
            </p>
        </div>
    );
}

// Blueprint-style SVG icons
const icons = {
    shield: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" strokeWidth="1.5" />
        </svg>
    ),
    network: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <circle cx="12" cy="5" r="2" />
            <circle cx="5" cy="19" r="2" />
            <circle cx="19" cy="19" r="2" />
            <path d="M12 7v4M7.5 17.5L10.5 13M16.5 17.5L13.5 13" />
            <rect x="9" y="11" width="6" height="4" rx="1" />
        </svg>
    ),
    eye: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
            <path d="M12 5v2M12 17v2M5 12H3M21 12h-2" strokeDasharray="2 2" />
        </svg>
    ),
    terminal: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M6 9l3 3-3 3M12 15h6" />
        </svg>
    ),
    lock: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
            <circle cx="12" cy="16" r="1.5" />
            <path d="M12 17.5V19" />
        </svg>
    ),
    chart: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M3 20h18M6 16v4M10 12v8M14 8v12M18 4v16" />
            <path d="M3 16l4-4 4 0 4-4 4-4" strokeDasharray="3 2" />
        </svg>
    ),
};

const cards: BentoCardData[] = [
    {
        id: '1',
        refId: 'BOX_REF_001',
        title: 'THREAT DETECTION',
        description: 'Real-time analysis of network traffic patterns and anomaly identification across distributed endpoints.',
        icon: icons.shield,
        colSpan: 'col-span-12 md:col-span-8',
        rowSpan: 'row-span-1',
    },
    {
        id: '2',
        refId: 'BOX_REF_002',
        title: 'BLAST RADIUS',
        description: 'Visual mapping of affected systems and lateral movement paths.',
        icon: icons.network,
        colSpan: 'col-span-12 md:col-span-4',
    },
    {
        id: '3',
        refId: 'BOX_REF_003',
        title: 'CONTINUOUS MONITORING',
        description: 'Always-on surveillance with configurable thresholds and alert policies.',
        icon: icons.eye,
        colSpan: 'col-span-12 md:col-span-4',
    },
    {
        id: '4',
        refId: 'BOX_REF_088',
        title: 'RESPONSE AUTOMATION',
        description: 'Automated playbooks for incident containment, evidence collection, and system recovery procedures.',
        icon: icons.terminal,
        colSpan: 'col-span-12 md:col-span-4',
    },
    {
        id: '5',
        refId: 'BOX_REF_044',
        title: 'ACCESS CONTROL',
        description: 'Granular permission management and zero-trust policy enforcement.',
        icon: icons.lock,
        colSpan: 'col-span-12 md:col-span-4',
    },
    {
        id: '6',
        refId: 'BOX_REF_112',
        title: 'BEHAVIOR ANALYTICS',
        description: 'Baseline profiling and deviation scoring for user and entity behavior analysis across your infrastructure.',
        icon: icons.chart,
        colSpan: 'col-span-12 md:col-span-8',
    },
];

export function BentoGrid({ isRedState }: BentoGridProps) {
    return (
        <div className="grid grid-cols-12 gap-0">
            {cards.map((card) => (
                <BentoCard key={card.id} card={card} isRedState={isRedState} />
            ))}
        </div>
    );
}
