'use client';

import { useEffect, useRef, useState } from 'react';

interface TextScrambleProps {
    text: string;
    isActive: boolean;
    className?: string;
    staggerDelay?: number;
}

const HEX_CHARS = '0123456789ABCDEF';
const GLITCH_CHARS = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`αβγδεζηθ';

export function TextScramble({ text, isActive, className = '', staggerDelay = 0.02 }: TextScrambleProps) {
    const [displayText, setDisplayText] = useState('');
    const frameRef = useRef<number>();
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        if (!isActive) {
            setDisplayText('');
            hasAnimatedRef.current = false;
            return;
        }

        if (hasAnimatedRef.current) return;
        hasAnimatedRef.current = true;

        const chars = text.split('');
        const totalDuration = chars.length * staggerDelay * 1000;
        const charsPerFrame = 4; // HEX codes to cycle through before landing
        const startTime = Date.now();

        const scramble = () => {
            const elapsed = Date.now() - startTime;
            const result = chars.map((char, i) => {
                if (char === ' ') return ' ';
                if (char === '\n') return '\n';

                const charStartTime = i * staggerDelay * 1000;
                const charElapsed = elapsed - charStartTime;

                if (charElapsed < 0) return ' ';
                if (charElapsed > charsPerFrame * 50) return char;

                // Cycle through random HEX codes
                const cyclePhase = Math.floor(charElapsed / 50);
                if (cyclePhase % 2 === 0) {
                    return HEX_CHARS[Math.floor(Math.random() * HEX_CHARS.length)];
                }
                return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
            });

            setDisplayText(result.join(''));

            if (elapsed < totalDuration + charsPerFrame * 50 + 100) {
                frameRef.current = requestAnimationFrame(scramble);
            } else {
                setDisplayText(text);
            }
        };

        frameRef.current = requestAnimationFrame(scramble);
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [isActive, text, staggerDelay]);

    return (
        <span className={`font-mono ${className}`}>
            {displayText || (isActive ? '' : '')}
        </span>
    );
}
