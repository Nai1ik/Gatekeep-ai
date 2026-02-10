'use client';

interface MapMarker {
    id: string;
    lat: number;
    lng: number;
    label: string;
    count: number;
    color: string;
}

interface WorldMapProps {
    markers: MapMarker[];
}

function latLngToXY(lat: number, lng: number, width: number, height: number) {
    const x = ((lng + 180) / 360) * width;
    const y = ((90 - lat) / 180) * height;
    return { x, y };
}

export function WorldMap({ markers }: WorldMapProps) {
    const W = 800;
    const H = 420;

    return (
        <div className="glass-card p-4 relative overflow-hidden">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
                Targeted Countries
            </h3>
            <div className="relative" style={{ aspectRatio: `${W}/${H}` }}>
                <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
                    {/* Background grid */}
                    <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                        </pattern>
                        <radialGradient id="pulse-glow">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                        </radialGradient>
                    </defs>
                    <rect width={W} height={H} fill="url(#grid)" />

                    {/* World landmasses (simplified paths) */}
                    <g opacity="0.15" fill="#06b6d4" stroke="#06b6d4" strokeWidth="0.5">
                        {/* North America */}
                        <path d="M120,80 L140,60 L180,55 L220,65 L240,80 L235,100 L230,120 L225,140 L210,160 L200,170 L190,165 L180,175 L160,180 L140,170 L130,150 L120,130 L110,110 L115,90 Z" />
                        {/* South America */}
                        <path d="M190,200 L210,185 L225,190 L230,210 L235,240 L230,270 L220,300 L210,320 L195,335 L185,320 L180,290 L175,260 L178,230 L185,210 Z" />
                        {/* Europe */}
                        <path d="M370,60 L390,55 L410,60 L430,65 L440,80 L435,95 L425,105 L410,110 L395,115 L380,110 L370,100 L365,85 Z" />
                        {/* Africa */}
                        <path d="M380,130 L400,120 L420,125 L435,140 L440,170 L435,200 L425,230 L415,260 L400,275 L390,270 L380,250 L375,220 L370,190 L372,160 Z" />
                        {/* Asia */}
                        <path d="M450,50 L500,45 L560,50 L620,55 L660,70 L680,90 L670,110 L650,125 L620,135 L580,140 L540,135 L500,125 L470,110 L455,90 L445,70 Z" />
                        {/* Oceania */}
                        <path d="M620,260 L650,250 L680,255 L700,270 L695,285 L675,295 L650,290 L630,280 Z" />
                        <path d="M710,300 L725,295 L735,310 L720,315 Z" />
                    </g>

                    {/* Connection lines from attack sources */}
                    {markers.filter(m => m.color === '#ef4444').map(source => {
                        const from = latLngToXY(source.lat, source.lng, W, H);
                        // Connect to Washington DC as target
                        const to = latLngToXY(38.9, -77.0, W, H);
                        const midX = (from.x + to.x) / 2;
                        const midY = Math.min(from.y, to.y) - 30;
                        return (
                            <path
                                key={`line-${source.id}`}
                                d={`M${from.x},${from.y} Q${midX},${midY} ${to.x},${to.y}`}
                                fill="none"
                                stroke="rgba(239,68,68,0.25)"
                                strokeWidth="1"
                                strokeDasharray="4 3"
                            >
                                <animate attributeName="stroke-dashoffset" from="0" to="14" dur="2s" repeatCount="indefinite" />
                            </path>
                        );
                    })}

                    {/* Markers */}
                    {markers.map(marker => {
                        const { x, y } = latLngToXY(marker.lat, marker.lng, W, H);
                        const r = Math.max(3, Math.min(8, marker.count / 300));
                        return (
                            <g key={marker.id}>
                                {/* Pulse ring */}
                                <circle cx={x} cy={y} r={r * 3} fill="none" stroke={marker.color} strokeWidth="0.5" opacity="0.3">
                                    <animate attributeName="r" from={r} to={r * 3} dur="2s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                                </circle>
                                {/* Core dot */}
                                <circle cx={x} cy={y} r={r} fill={marker.color} opacity="0.8" />
                                <circle cx={x} cy={y} r={r * 0.4} fill="white" opacity="0.9" />
                                {/* Tooltip area */}
                                <title>{`${marker.label}: ${marker.count} incidents`}</title>
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
}
