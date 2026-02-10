// Dashboard Overview Mock Data

export const overviewStats = [
    { label: 'Threat Actors', value: 20, change: 5, trend: 'up' as const, period: '24 hours' },
    { label: 'Intrusion Sets', value: 903, change: 12, trend: 'up' as const, period: '24 hours' },
    { label: 'Campaigns', value: 750, change: -3, trend: 'down' as const, period: '24 hours' },
    { label: 'Malware', value: 6620, change: 8, trend: 'up' as const, period: '24 hours' },
    { label: 'Indicators', value: 430620, change: 17, trend: 'up' as const, period: '24 hours' },
    { label: 'Observables', value: 460650, change: -2, trend: 'down' as const, period: '24 hours' },
];

export const targetedRegions = [
    { name: 'Northern America', value: 1720 },
    { name: 'Western Europe', value: 1540 },
    { name: 'Eastern Asia', value: 1180 },
    { name: 'Southern Asia', value: 890 },
    { name: 'South-Eastern Asia', value: 750 },
    { name: 'Eastern Europe', value: 620 },
    { name: 'Middle East', value: 580 },
    { name: 'Latin America', value: 430 },
    { name: 'Northern Europe', value: 380 },
    { name: 'Central Asia', value: 290 },
    { name: 'Oceania', value: 210 },
    { name: 'Sub-Saharan Africa', value: 160 },
];

export const targetedCountries = [
    { name: 'United States', value: 1820 },
    { name: 'Japan', value: 980 },
    { name: 'United Kingdom', value: 870 },
    { name: 'Republic of Korea', value: 720 },
    { name: 'Germany', value: 680 },
    { name: 'France', value: 620 },
    { name: 'India', value: 580 },
    { name: 'Brazil', value: 450 },
    { name: 'Canada', value: 420 },
    { name: 'Australia', value: 380 },
    { name: 'Israel', value: 340 },
    { name: 'Pakistan', value: 290 },
];

export const worldMapMarkers = [
    { id: 'm1', lat: 38.9, lng: -77.0, label: 'United States', count: 1820, color: '#06b6d4' },
    { id: 'm2', lat: 35.7, lng: 139.7, label: 'Japan', count: 980, color: '#06b6d4' },
    { id: 'm3', lat: 51.5, lng: -0.1, label: 'United Kingdom', count: 870, color: '#06b6d4' },
    { id: 'm4', lat: 37.6, lng: 127.0, label: 'South Korea', count: 720, color: '#06b6d4' },
    { id: 'm5', lat: 52.5, lng: 13.4, label: 'Germany', count: 680, color: '#06b6d4' },
    { id: 'm6', lat: 48.9, lng: 2.3, label: 'France', count: 620, color: '#f97316' },
    { id: 'm7', lat: 28.6, lng: 77.2, label: 'India', count: 580, color: '#f97316' },
    { id: 'm8', lat: -15.8, lng: -47.9, label: 'Brazil', count: 450, color: '#f97316' },
    { id: 'm9', lat: 45.4, lng: -75.7, label: 'Canada', count: 420, color: '#22c55e' },
    { id: 'm10', lat: -33.9, lng: 151.2, label: 'Australia', count: 380, color: '#22c55e' },
    { id: 'm11', lat: 31.8, lng: 35.2, label: 'Israel', count: 340, color: '#f97316' },
    { id: 'm12', lat: 55.8, lng: 37.6, label: 'Russia', count: 520, color: '#ef4444' },
    { id: 'm13', lat: 39.9, lng: 116.4, label: 'China', count: 480, color: '#ef4444' },
    { id: 'm14', lat: 35.7, lng: 51.4, label: 'Iran', count: 310, color: '#ef4444' },
    { id: 'm15', lat: 39.0, lng: 125.8, label: 'North Korea', count: 280, color: '#ef4444' },
];

export const activeIntrusionSets = [
    { name: 'APT28', value: 420, color: '#ef4444' },
    { name: 'APT41', value: 380, color: '#f97316' },
    { name: 'Lazarus', value: 350, color: '#eab308' },
    { name: 'APT29', value: 310, color: '#06b6d4' },
    { name: 'Sandworm', value: 280, color: '#8b5cf6' },
    { name: 'Turla', value: 240, color: '#ec4899' },
    { name: 'APT10', value: 210, color: '#22c55e' },
    { name: 'UNC2452', value: 190, color: '#64748b' },
];

export const activeMalware = [
    { name: 'Cobalt Strike', count: 890, trend: 'up' as const },
    { name: 'Emotet', count: 720, trend: 'down' as const },
    { name: 'QakBot', count: 650, trend: 'up' as const },
    { name: 'BlackCat', count: 540, trend: 'up' as const },
    { name: 'PlugX', count: 480, trend: 'down' as const },
    { name: 'Raccoon Stealer', count: 410, trend: 'up' as const },
    { name: 'IcedID', count: 380, trend: 'down' as const },
    { name: 'Agent Tesla', count: 320, trend: 'up' as const },
];

export const targetedSectors = [
    { date: 'Jan', Finance: 820, Energy: 340, Transport: 280, Government: 520, Health: 190 },
    { date: 'Mar', Finance: 910, Energy: 420, Transport: 310, Government: 480, Health: 230 },
    { date: 'May', Finance: 780, Energy: 510, Transport: 350, Government: 560, Health: 270 },
    { date: 'Jul', Finance: 1050, Energy: 480, Transport: 290, Government: 620, Health: 310 },
    { date: 'Sep', Finance: 920, Energy: 560, Transport: 380, Government: 710, Health: 340 },
    { date: 'Nov', Finance: 1180, Energy: 620, Transport: 420, Government: 780, Health: 290 },
    { date: 'Jan\'26', Finance: 1320, Energy: 580, Transport: 450, Government: 850, Health: 360 },
];

export const targetedVectors = [
    { date: 'Feb 5, 2025', Phishing: 420, Exploit: 280, SupplyChain: 120, ZeroDay: 80 },
    { date: 'Apr 16, 2023', Phishing: 520, Exploit: 310, SupplyChain: 150, ZeroDay: 95 },
    { date: 'Jun 21, 2023', Phishing: 480, Exploit: 340, SupplyChain: 180, ZeroDay: 110 },
    { date: 'Sep 6, 2023', Phishing: 610, Exploit: 290, SupplyChain: 200, ZeroDay: 130 },
    { date: 'Nov 26, 2023', Phishing: 720, Exploit: 380, SupplyChain: 160, ZeroDay: 150 },
];

export const activeCVEs = [
    { id: 'CVE-2017-11882', score: 214, severity: 'CRITICAL' as const },
    { id: 'CVE-2023-0158', score: 157, severity: 'CRITICAL' as const },
    { id: 'CVE-2017-0199', score: 145, severity: 'HIGH' as const },
    { id: 'CVE-2021-27865', score: 138, severity: 'HIGH' as const },
    { id: 'CVE-2017-3M84A', score: 131, severity: 'HIGH' as const },
    { id: 'CVE-2019-11510', score: 128, severity: 'CRITICAL' as const },
    { id: 'CVE-2018-0798', score: 122, severity: 'HIGH' as const },
];

export const actorTools = [
    { name: 'Cobalt Strike', value: 28, color: '#ef4444' },
    { name: 'Mimikatz', value: 22, color: '#f97316' },
    { name: 'PowerShell Empire', value: 16, color: '#eab308' },
    { name: 'Metasploit', value: 12, color: '#22c55e' },
    { name: 'BloodHound', value: 8, color: '#06b6d4' },
    { name: 'Impacket', value: 7, color: '#8b5cf6' },
    { name: 'Other', value: 7, color: '#64748b' },
];

export const latestCampaigns = [
    {
        date: 'May 24, 2023 at 05:18:27 AM',
        name: 'FATA MORGANA',
        description: 'Turla-backed N-campaign which focuses on shipping and logistics companies based in Israel, shipping.',
        icon: '🎯',
    },
    {
        date: 'Apr 12, 2023 at 11:42:00 AM',
        name: 'DARK BASIN',
        description: 'State-sponsored espionage campaign targeting critical infrastructure in Northern Europe via supply chain.',
        icon: '🔴',
    },
];

export const latestReports = [
    { name: 'Fanton Ransomware — Quar...', date: 'Feb 18...', group: 'AlienVault', tags: ['malware', 'ransomware'], tagColors: ['#8b5cf6', '#ef4444'] },
    { name: 'Iranian APT Imperial Kitten Ru...', date: 'Feb 18...', group: 'Orange Cyber...', tags: ['apt', 'nation-state'], tagColors: ['#06b6d4', '#f97316'] },
    { name: 'CARBON SPIDER Embraces Bl...', date: 'Feb 18...', group: 'AlienVault', tags: ['evolution', 'fin-crime'], tagColors: ['#22c55e', '#eab308'] },
];

export const indicatorSources = [
    { name: 'IDS / IPS', icon: '🛡️', count: 170490, trend: 'up' as const },
    { name: 'IC / IntSvr', icon: '🔍', count: 94500, trend: 'up' as const },
    { name: 'IC / alternati', icon: '📡', count: 56350, trend: 'down' as const },
];

export const sectorColors: Record<string, string> = {
    Finance: '#06b6d4',
    Energy: '#f97316',
    Transport: '#22c55e',
    Government: '#8b5cf6',
    Health: '#ec4899',
};

export const vectorColors: Record<string, string> = {
    Phishing: '#06b6d4',
    Exploit: '#f97316',
    SupplyChain: '#22c55e',
    ZeroDay: '#ef4444',
};
