'use client';

import { useState, useEffect, useCallback } from 'react';

interface TrafficLightProps {
    state: 'green' | 'yellow' | 'red';
    onNeutralize?: () => void;
}

export function TrafficLight({ state, onNeutralize }: TrafficLightProps) {
    const [isNeutralizing, setIsNeutralizing] = useState(false);
    const [neutralizeProgress, setNeutralizeProgress] = useState(0);

    const handleRedClick = useCallback(() => {
        if (state !== 'red' || isNeutralizing) return;
        setIsNeutralizing(true);
        setNeutralizeProgress(0);

        // Animate progress
        const start = Date.now();
        const duration = 1500;
        const tick = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            setNeutralizeProgress(progress);
            if (progress < 1) {
                requestAnimationFrame(tick);
            } else {
                setIsNeutralizing(false);
                setNeutralizeProgress(0);
                onNeutralize?.();
            }
        };
        requestAnimationFrame(tick);
    }, [state, isNeutralizing, onNeutralize]);

    return (
        <div className="relative flex flex-col items-center">
            {/* Housing */}
            <div className="traffic-light-housing">
                {/* Red */}
                <div
                    className={`traffic-lens cursor-pointer transition-all ${state === 'red' && !isNeutralizing ? 'active-red' : ''
                        } ${isNeutralizing ? 'neutralize' : ''}`}
                    onClick={handleRedClick}
                    title={state === 'red' ? 'Click to neutralize' : ''}
                />

                {/* Yellow */}
                <div
                    className={`traffic-lens ${state === 'yellow' ? 'active-yellow' : ''
                        }`}
                />

                {/* Green */}
                <div
                    className={`traffic-lens ${state === 'green' ? 'active-green' : ''
                        }`}
                />

                {/* Neutralize progress bar */}
                {isNeutralizing && (
                    <div
                        className="absolute bottom-0 left-0 h-[3px] bg-green-500 transition-none"
                        style={{ width: `${neutralizeProgress * 100}%` }}
                    />
                )}
            </div>

            {/* THREAT DETECTED overlay */}
            {state === 'red' && !isNeutralizing && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                        className="glitch-text text-[#FF4500] text-xs tracking-[0.25em]"
                        data-text="THREAT DETECTED"
                    >
                        THREAT DETECTED
                    </div>
                </div>
            )}

            {/* State label */}
            <div className="mt-6 font-mono text-[10px] tracking-[0.2em] uppercase text-center">
                {isNeutralizing ? (
                    <span className="text-green-600">NEUTRALIZING...</span>
                ) : state === 'green' ? (
                    <span className="text-green-700">SYSTEM SECURE</span>
                ) : state === 'yellow' ? (
                    <span className="text-yellow-700">SCANNING...</span>
                ) : (
                    <span className="text-[#FF4500]">THREAT ACTIVE</span>
                )}
            </div>
        </div>
    );
}
