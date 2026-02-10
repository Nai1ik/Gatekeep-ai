'use client';

import Link from 'next/link';
import { StatCard } from '@/components/dashboard/StatCard';
import { WorldMap } from '@/components/dashboard/WorldMap';
import { HorizontalBarChart } from '@/components/dashboard/HorizontalBarChart';
import { AreaLineChart } from '@/components/dashboard/AreaLineChart';
import { DonutChart } from '@/components/dashboard/DonutChart';
import { CVEList } from '@/components/dashboard/CVEList';
import { CampaignFeed } from '@/components/dashboard/CampaignFeed';
import { ReportFeed } from '@/components/dashboard/ReportFeed';
import { IndicatorSources } from '@/components/dashboard/IndicatorSources';
import { ActiveMalware } from '@/components/dashboard/ActiveMalware';
import {
    overviewStats,
    targetedRegions,
    targetedCountries,
    worldMapMarkers,
    activeIntrusionSets,
    activeMalware,
    targetedSectors,
    targetedVectors,
    activeCVEs,
    actorTools,
    latestCampaigns,
    latestReports,
    indicatorSources,
    sectorColors,
    vectorColors,
} from '@/data/dashboardData';

export default function DashboardOverview() {
    return (
        <div className="min-h-screen bg-[#09090b] text-gray-200">
            {/* Top Nav */}
            <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-md flex items-center px-6 justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-sm tracking-tight text-white">Gatekeep AI</span>
                </div>

                {/* Search */}
                <div className="flex-1 max-w-md mx-8">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search the platform..."
                            className="w-full bg-white/5 border border-white/5 rounded-lg text-xs px-9 py-2 text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/30 transition-colors"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="text-[10px] font-medium px-3 py-1.5 rounded-md border border-white/10 hover:bg-white/5 transition-colors text-gray-400 hover:text-white uppercase tracking-wider"
                    >
                        ← Landing
                    </Link>
                    <Link
                        href="/dashboard/alerts"
                        className="text-[10px] font-medium px-3 py-1.5 rounded-md bg-cyan-500/10 border border-cyan-500/20 hover:bg-cyan-500/20 transition-colors text-cyan-400 uppercase tracking-wider"
                    >
                        Alert Analyst →
                    </Link>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">LIVE</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-indigo-500 border border-white/10" />
                </div>
            </header>

            {/* Sidebar Nav Rail */}
            <aside className="fixed left-0 top-14 bottom-0 w-12 border-r border-white/5 bg-[#09090b]/80 z-40 flex flex-col items-center py-4 gap-3">
                {[
                    { icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', label: 'Overview', active: true },
                    { icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z', label: 'Alerts' },
                    { icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z', label: 'Analytics' },
                    { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064', label: 'Map' },
                    { icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z', label: 'Settings' },
                ].map((item, i) => (
                    <button
                        key={i}
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${item.active
                                ? 'bg-cyan-500/10 text-cyan-400'
                                : 'text-gray-600 hover:text-gray-400 hover:bg-white/5'
                            }`}
                        title={item.label}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </svg>
                    </button>
                ))}
            </aside>

            {/* Main Content */}
            <main className="pt-[70px] pl-14 pr-4 pb-6">
                <div className="max-w-[1800px] mx-auto space-y-4">

                    {/* Row 1: KPI Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {overviewStats.map((stat, i) => (
                            <StatCard key={i} {...stat} />
                        ))}
                    </div>

                    {/* Row 2: Geographic Overview */}
                    <div className="grid grid-cols-12 gap-3">
                        {/* Targeted Regions */}
                        <div className="col-span-12 md:col-span-3 lg:col-span-2">
                            <HorizontalBarChart title="Targeted Regions" data={targetedRegions} color="#06b6d4" maxItems={8} />
                        </div>
                        {/* Targeted Countries */}
                        <div className="col-span-12 md:col-span-3 lg:col-span-2">
                            <HorizontalBarChart title="Targeted Countries" data={targetedCountries} color="#06b6d4" maxItems={8} />
                        </div>
                        {/* World Map */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-4">
                            <WorldMap markers={worldMapMarkers} />
                        </div>
                        {/* Active Intrusion Sets */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-2">
                            <HorizontalBarChart title="Active Intrusion Sets" data={activeIntrusionSets} maxItems={8} />
                        </div>
                        {/* Active Malware */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-2">
                            <ActiveMalware data={activeMalware} />
                        </div>
                    </div>

                    {/* Row 3: Analytics */}
                    <div className="grid grid-cols-12 gap-3">
                        {/* Targeted Sectors */}
                        <div className="col-span-12 lg:col-span-3">
                            <AreaLineChart
                                title="Targeted Sectors"
                                data={targetedSectors}
                                dataKeys={['Finance', 'Energy', 'Transport', 'Government', 'Health']}
                                colors={sectorColors}
                            />
                        </div>
                        {/* Targeted Vectors */}
                        <div className="col-span-12 lg:col-span-3">
                            <AreaLineChart
                                title="Targeted Vectors"
                                data={targetedVectors}
                                dataKeys={['Phishing', 'Exploit', 'SupplyChain', 'ZeroDay']}
                                colors={vectorColors}
                            />
                        </div>
                        {/* Active CVEs */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-3">
                            <CVEList title="Active Vulnerability CVEs" data={activeCVEs} />
                        </div>
                        {/* Actor Tools */}
                        <div className="col-span-12 md:col-span-6 lg:col-span-3">
                            <DonutChart title="Actor Tools" data={actorTools} />
                        </div>
                    </div>

                    {/* Row 4: Feeds */}
                    <div className="grid grid-cols-12 gap-3">
                        {/* Latest Campaigns */}
                        <div className="col-span-12 md:col-span-4 lg:col-span-3">
                            <CampaignFeed data={latestCampaigns} />
                        </div>
                        {/* Latest Reports */}
                        <div className="col-span-12 md:col-span-4 lg:col-span-6">
                            <ReportFeed data={latestReports} />
                        </div>
                        {/* Indicator Sources */}
                        <div className="col-span-12 md:col-span-4 lg:col-span-3">
                            <IndicatorSources data={indicatorSources} />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
