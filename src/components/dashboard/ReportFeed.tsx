'use client';

interface Report {
    name: string;
    date: string;
    group: string;
    tags: string[];
    tagColors: string[];
}

interface ReportFeedProps {
    data: Report[];
}

export function ReportFeed({ data }: ReportFeedProps) {
    return (
        <div className="glass-card p-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
                Latest Reports
            </h3>
            <div className="space-y-3">
                {data.map((report, i) => (
                    <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-gray-300 truncate font-medium">{report.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] text-gray-600 font-mono">{report.date}</span>
                                <span className="text-[9px] text-gray-500">{report.group}</span>
                            </div>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                            {report.tags.map((tag, j) => (
                                <span
                                    key={j}
                                    className="text-[8px] px-1.5 py-0.5 rounded font-medium"
                                    style={{
                                        background: `${report.tagColors[j]}20`,
                                        color: report.tagColors[j],
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
