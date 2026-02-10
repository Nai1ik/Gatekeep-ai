'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DataItem {
    name: string;
    value: number;
    color?: string;
}

interface HorizontalBarChartProps {
    title: string;
    data: DataItem[];
    color?: string;
    maxItems?: number;
}

export function HorizontalBarChart({ title, data, color = '#06b6d4', maxItems = 10 }: HorizontalBarChartProps) {
    const sliced = data.slice(0, maxItems);

    return (
        <div className="glass-card p-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
                {title}
            </h3>
            <ResponsiveContainer width="100%" height={sliced.length * 28 + 10}>
                <BarChart data={sliced} layout="vertical" margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis
                        type="category"
                        dataKey="name"
                        width={110}
                        tick={{ fontSize: 10, fill: '#9ca3af', fontFamily: 'monospace' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <Tooltip
                        contentStyle={{
                            background: '#18181b',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '6px',
                            fontSize: 11,
                            fontFamily: 'monospace',
                        }}
                        cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    />
                    <Bar dataKey="value" radius={[0, 3, 3, 0]} barSize={14}>
                        {sliced.map((entry, i) => (
                            <Cell key={i} fill={entry.color || color} fillOpacity={0.7} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
