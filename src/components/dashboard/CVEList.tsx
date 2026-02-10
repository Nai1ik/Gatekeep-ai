'use client';

interface CVE {
    id: string;
    score: number;
    severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

interface CVEListProps {
    title: string;
    data: CVE[];
}

const severityColors: Record<string, string> = {
    CRITICAL: '#ef4444',
    HIGH: '#f97316',
    MEDIUM: '#eab308',
    LOW: '#22c55e',
};

export function CVEList({ title, data }: CVEListProps) {
    return (
        <div className="glass-card p-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
                {title}
            </h3>
            <div className="space-y-2">
                {data.map((cve) => (
                    <div key={cve.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                        <span className="text-xs font-mono text-gray-300">{cve.id}</span>
                        <span
                            className="text-xs font-bold font-mono px-2 py-0.5 rounded"
                            style={{
                                color: severityColors[cve.severity],
                                background: `${severityColors[cve.severity]}15`,
                            }}
                        >
                            {cve.score}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
