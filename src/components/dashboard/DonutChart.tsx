'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DonutItem {
    name: string;
    value: number;
    color: string;
}

interface DonutChartProps {
    title: string;
    data: DonutItem[];
}

export function DonutChart({ title, data }: DonutChartProps) {
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="glass-card p-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
                {title}
            </h3>
            <div className="flex items-center gap-4">
                <div className="w-[120px] h-[120px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={32}
                                outerRadius={55}
                                dataKey="value"
                                strokeWidth={1}
                                stroke="#09090b"
                            >
                                {data.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    background: '#18181b',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '6px',
                                    fontSize: 11,
                                    fontFamily: 'monospace',
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-1.5 min-w-0">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[10px]">
                            <div
                                className="w-2 h-2 rounded-sm flex-shrink-0"
                                style={{ background: item.color }}
                            />
                            <span className="text-gray-400 truncate">{item.name}</span>
                            <span className="text-gray-500 ml-auto font-mono">
                                {((item.value / total) * 100).toFixed(0)}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
