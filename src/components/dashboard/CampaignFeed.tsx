'use client';

interface Campaign {
    date: string;
    name: string;
    description: string;
    icon: string;
}

interface CampaignFeedProps {
    data: Campaign[];
}

export function CampaignFeed({ data }: CampaignFeedProps) {
    return (
        <div className="glass-card p-4">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-3">
                Latest Campaigns
            </h3>
            <div className="space-y-4">
                {data.map((campaign, i) => (
                    <div key={i} className="border-l-2 border-red-500/40 pl-3">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] text-gray-600 font-mono">{campaign.date}</span>
                            <span>{campaign.icon}</span>
                        </div>
                        <p className="text-sm font-bold text-white tracking-tight mb-1">{campaign.name}</p>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{campaign.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
