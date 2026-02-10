'use client';

interface StatCardProps {
    label: string;
    value: number;
    change: number;
    trend: 'up' | 'down';
    period: string;
}

function formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
    return num.toString();
}

export function StatCard({ label, value, change, trend, period }: StatCardProps) {
    return (
        <div className="glass-card p-4 flex flex-col justify-between min-h-[100px]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-2">{label}</p>
            <div className="flex items-end justify-between">
                <span className="text-2xl font-bold text-white font-mono tracking-tight">
                    {formatNumber(value)}
                </span>
                <div className="flex items-center gap-1.5">
                    <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${trend === 'up'
                                ? 'bg-emerald-500/10 text-emerald-400'
                                : 'bg-red-500/10 text-red-400'
                            }`}
                    >
                        {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}%
                    </span>
                    <span className="text-[9px] text-gray-600">{period}</span>
                </div>
            </div>
        </div>
    );
}
