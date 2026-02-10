'use client';

interface Source {
    name: string;
    icon: string;
    count: number;
    trend: 'up' | 'down';
}

interface IndicatorSourcesProps {
    data: Source[];
}

function formatCount(n: number): string {
    if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 1 : 2) + 'K';
    return n.toString();
}

export function IndicatorSources({ data }: IndicatorSourcesProps) {
    return (
        <div className="glass-card p-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
                Indicator Sources
            </h3>
            <div className="space-y-3">
                {data.map((source, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm">{source.icon}</span>
                            <span className="text-xs text-gray-400">{source.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold font-mono text-white">{formatCount(source.count)}</span>
                            <span className={`text-[10px] ${source.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                                {source.trend === 'up' ? '↑' : '↓'}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
