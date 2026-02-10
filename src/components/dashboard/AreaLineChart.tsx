'use client';

import {
    AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

interface AreaLineChartProps {
    title: string;
    data: Record<string, string | number>[];
    dataKeys: string[];
    colors: Record<string, string>;
    height?: number;
}

export function AreaLineChart({ title, data, dataKeys, colors, height = 220 }: AreaLineChartProps) {
    return (
        <div className="glass-card p-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
                {title}
            </h3>
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                    <defs>
                        {dataKeys.map(key => (
                            <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={colors[key]} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={colors[key]} stopOpacity={0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 9, fill: '#6b7280', fontFamily: 'monospace' }}
                        axisLine={{ stroke: 'rgba(255,255,255,0.05)' }}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 9, fill: '#6b7280', fontFamily: 'monospace' }}
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
                    />
                    <Legend
                        iconSize={8}
                        wrapperStyle={{ fontSize: 10, fontFamily: 'monospace', paddingTop: 8 }}
                    />
                    {dataKeys.map(key => (
                        <Area
                            key={key}
                            type="monotone"
                            dataKey={key}
                            stroke={colors[key]}
                            fill={`url(#grad-${key})`}
                            strokeWidth={1.5}
                            dot={false}
                            activeDot={{ r: 3, strokeWidth: 0 }}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
