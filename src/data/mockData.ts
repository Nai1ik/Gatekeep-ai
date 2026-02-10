import { SecurityAlert } from '@/types/types';

export const mockAlerts: SecurityAlert[] = [
    {
        id: 'alert-001',
        timestamp: new Date('2026-02-09T10:15:00'),
        severity: 'CRITICAL',
        keyTakeaway: "Someone tried to guess the 'Admin' password 50 times in 2 minutes from an IP in Russia.",
        technicalSummary: "Detected Event ID 4625 with Status 0xC000006D. Multiple failed authentication attempts targeting the Administrator account from external IP 185.143.223.42.",
        mitreAttackTechnique: 'T1110',
        mitreAttackName: 'Brute Force',
        sourceIp: '185.143.223.42',
        sourceLocation: 'Moscow, Russia',
        targetAsset: 'DC-PROD-01',
        affectedUser: 'Administrator',
        rawLog: 'Feb 09 10:15:00 DC-PROD-01 sshd[28934]: Failed password for invalid user admin from 185.143.223.42 port 50211 ssh2 (attempt 50 of 50)',
        timeline: [
            {
                id: 'evt-001',
                timestamp: new Date('2026-02-09T10:01:00'),
                title: 'Initial Port Scan Detected',
                description: 'Port scanning activity from 185.143.223.42 targeting ports 22, 3389, 445',
                severity: 'WARNING',
                source: '185.143.223.42'
            },
            {
                id: 'evt-002',
                timestamp: new Date('2026-02-09T10:05:00'),
                title: 'First Authentication Attempt',
                description: 'Failed SSH login attempt for user "root"',
                severity: 'WARNING',
                source: '185.143.223.42'
            },
            {
                id: 'evt-003',
                timestamp: new Date('2026-02-09T10:10:00'),
                title: 'Brute Force Attack Escalation',
                description: '25 failed login attempts in 5 minutes',
                severity: 'CRITICAL',
                source: '185.143.223.42'
            },
            {
                id: 'evt-004',
                timestamp: new Date('2026-02-09T10:15:00'),
                title: 'Attack Threshold Exceeded',
                description: '50 failed attempts - automated lockout triggered',
                severity: 'CRITICAL',
                source: '185.143.223.42'
            }
        ],
        blastRadius: {
            nodes: [
                { id: 'ip-1', label: '185.143.223.42\n(Moscow, RU)', type: 'ip', severity: 'CRITICAL' },
                { id: 'server-1', label: 'DC-PROD-01\n(Domain Controller)', type: 'server', severity: 'WARNING' },
                { id: 'user-1', label: 'Administrator', type: 'user', severity: 'WARNING' },
                { id: 'server-2', label: 'FILE-SRV-01', type: 'server' },
                { id: 'server-3', label: 'APP-SRV-01', type: 'server' }
            ],
            links: [
                { source: 'ip-1', target: 'server-1', label: 'SSH Brute Force' },
                { source: 'server-1', target: 'user-1', label: 'Target Account' },
                { source: 'user-1', target: 'server-2', label: 'Has Access' },
                { source: 'user-1', target: 'server-3', label: 'Has Access' }
            ]
        },
        remediationActions: [
            {
                id: 'action-1',
                label: 'Block IP on Firewall',
                icon: 'shield-off',
                reasoning: 'This IP (185.143.223.42) has made 50+ failed authentication attempts in 2 minutes, showing clear signs of automated brute force attack. Blocking immediately prevents further attempts.',
                priority: 'high',
                status: 'pending'
            },
            {
                id: 'action-2',
                label: 'Reset Admin Password',
                icon: 'key',
                reasoning: 'As a precaution, the Administrator password should be rotated since it was the target of the attack. Even though no successful auth occurred, this reduces risk.',
                priority: 'medium',
                status: 'pending'
            },
            {
                id: 'action-3',
                label: 'Enable MFA',
                icon: 'smartphone',
                reasoning: 'Multi-factor authentication would prevent successful login even if credentials were compromised. This is a critical security hardening measure.',
                priority: 'high',
                status: 'pending'
            }
        ],
        behaviorComparisons: [
            {
                metric: 'Failed Login Attempts',
                normalValue: 3,
                currentValue: 50,
                unit: 'per hour',
                description: 'Typically, this account sees 3 failed logins per hour from password typos.'
            },
            {
                metric: 'Unique Source IPs',
                normalValue: 2,
                currentValue: 1,
                unit: 'sources',
                description: 'Usually logins come from 2 known office IPs. This attack came from a single foreign IP.'
            },
            {
                metric: 'Geographic Distance',
                normalValue: 0,
                currentValue: 8000,
                unit: 'km',
                description: 'Normal logins are from New York. This attempt originated 8,000km away in Moscow.'
            }
        ]
    },
    {
        id: 'alert-002',
        timestamp: new Date('2026-02-09T09:30:00'),
        severity: 'CRITICAL',
        keyTakeaway: "A user account that normally works 9-5 in New York just logged in at 3 AM from London and started downloading gigabytes of data.",
        technicalSummary: "Anomalous login detected for user jsmith@company.com from UK IP followed by bulk data access to sensitive file shares. Potential data exfiltration in progress.",
        mitreAttackTechnique: 'T1048',
        mitreAttackName: 'Exfiltration Over Alternative Protocol',
        sourceIp: '81.2.69.142',
        sourceLocation: 'London, UK',
        targetAsset: 'FILE-SRV-01',
        affectedUser: 'jsmith@company.com',
        rawLog: 'Feb 09 03:30:00 FILE-SRV-01 audit[12345]: User jsmith accessed 2847 files (2.3GB) from share \\\\FILE-SRV-01\\Confidential',
        timeline: [
            {
                id: 'evt-010',
                timestamp: new Date('2026-02-09T03:25:00'),
                title: 'Suspicious VPN Login',
                description: 'User jsmith authenticated via VPN from London, UK',
                severity: 'WARNING',
                source: '81.2.69.142'
            },
            {
                id: 'evt-011',
                timestamp: new Date('2026-02-09T03:27:00'),
                title: 'Directory Enumeration',
                description: 'Rapid enumeration of network shares detected',
                severity: 'WARNING',
                source: 'jsmith-laptop'
            },
            {
                id: 'evt-012',
                timestamp: new Date('2026-02-09T03:30:00'),
                title: 'Mass File Access Started',
                description: 'Bulk access to Confidential share initiated',
                severity: 'CRITICAL',
                source: 'jsmith-laptop'
            },
            {
                id: 'evt-013',
                timestamp: new Date('2026-02-09T03:45:00'),
                title: 'Large Data Transfer Detected',
                description: '2.3GB transferred to external destination',
                severity: 'CRITICAL',
                source: 'jsmith-laptop'
            }
        ],
        blastRadius: {
            nodes: [
                { id: 'ip-2', label: '81.2.69.142\n(London, UK)', type: 'ip', severity: 'CRITICAL' },
                { id: 'user-2', label: 'jsmith@company.com', type: 'user', severity: 'CRITICAL' },
                { id: 'ws-1', label: 'jsmith-laptop', type: 'workstation', severity: 'CRITICAL' },
                { id: 'server-4', label: 'FILE-SRV-01', type: 'server', severity: 'WARNING' },
                { id: 'file-1', label: 'Confidential\n(2847 files)', type: 'file', severity: 'CRITICAL' }
            ],
            links: [
                { source: 'ip-2', target: 'ws-1', label: 'VPN Connection' },
                { source: 'ws-1', target: 'user-2', label: 'Logged In As' },
                { source: 'user-2', target: 'server-4', label: 'Accessed' },
                { source: 'server-4', target: 'file-1', label: 'Contains' }
            ]
        },
        remediationActions: [
            {
                id: 'action-4',
                label: 'Disable User Account',
                icon: 'user-x',
                reasoning: 'Account jsmith shows signs of compromise - logging in from impossible travel distance at unusual hours. Immediate disable prevents further damage.',
                priority: 'high',
                status: 'pending'
            },
            {
                id: 'action-5',
                label: 'Kill Active Sessions',
                icon: 'log-out',
                reasoning: 'Terminate all active sessions for jsmith to immediately stop any ongoing data exfiltration.',
                priority: 'high',
                status: 'pending'
            },
            {
                id: 'action-6',
                label: 'Isolate Workstation',
                icon: 'wifi-off',
                reasoning: 'Quarantine jsmith-laptop from the network to preserve forensic evidence and prevent lateral movement.',
                priority: 'high',
                status: 'pending'
            }
        ],
        behaviorComparisons: [
            {
                metric: 'Login Time',
                normalValue: 9,
                currentValue: 3,
                unit: 'AM',
                description: 'This user typically logs in at 9 AM EST. Today they logged in at 3 AM.'
            },
            {
                metric: 'Files Accessed',
                normalValue: 45,
                currentValue: 2847,
                unit: 'files/day',
                description: 'Normal daily file access is ~45 files. Today: 2,847 files in 15 minutes.'
            },
            {
                metric: 'Data Volume',
                normalValue: 50,
                currentValue: 2300,
                unit: 'MB',
                description: 'Typical daily data access: 50MB. Current session: 2.3GB (46x normal).'
            }
        ]
    },
    {
        id: 'alert-003',
        timestamp: new Date('2026-02-09T14:22:00'),
        severity: 'WARNING',
        keyTakeaway: "A scheduled task was created on a server to run PowerShell every hour - this is how attackers maintain access after initial compromise.",
        technicalSummary: "Suspicious scheduled task 'WindowsUpdate' created with encoded PowerShell payload. Task configured to run as SYSTEM every 60 minutes. Matches known persistence technique.",
        mitreAttackTechnique: 'T1053.005',
        mitreAttackName: 'Scheduled Task/Job',
        sourceIp: '10.0.1.50',
        sourceLocation: 'Internal Network',
        targetAsset: 'WEB-SRV-02',
        affectedUser: 'SYSTEM',
        rawLog: 'Feb 09 14:22:00 WEB-SRV-02 TaskScheduler[5678]: Task "WindowsUpdate" created by NT AUTHORITY\\SYSTEM with action: powershell.exe -enc SQBFAFgA...',
        timeline: [
            {
                id: 'evt-020',
                timestamp: new Date('2026-02-09T14:15:00'),
                title: 'Initial Web Shell Access',
                description: 'Suspicious POST request to /upload.aspx',
                severity: 'WARNING',
                source: '10.0.1.50'
            },
            {
                id: 'evt-021',
                timestamp: new Date('2026-02-09T14:18:00'),
                title: 'Privilege Escalation',
                description: 'Web application service escalated to SYSTEM',
                severity: 'WARNING',
                source: 'WEB-SRV-02'
            },
            {
                id: 'evt-022',
                timestamp: new Date('2026-02-09T14:22:00'),
                title: 'Persistence Mechanism Created',
                description: 'Scheduled task "WindowsUpdate" registered',
                severity: 'WARNING',
                source: 'WEB-SRV-02'
            }
        ],
        blastRadius: {
            nodes: [
                { id: 'ws-3', label: '10.0.1.50\n(Compromised Host)', type: 'workstation', severity: 'WARNING' },
                { id: 'server-5', label: 'WEB-SRV-02', type: 'server', severity: 'WARNING' },
                { id: 'user-3', label: 'SYSTEM', type: 'user', severity: 'WARNING' }
            ],
            links: [
                { source: 'ws-3', target: 'server-5', label: 'Web Shell' },
                { source: 'server-5', target: 'user-3', label: 'Escalated To' }
            ]
        },
        remediationActions: [
            {
                id: 'action-7',
                label: 'Remove Scheduled Task',
                icon: 'trash-2',
                reasoning: 'The suspicious "WindowsUpdate" scheduled task should be immediately deleted to remove the persistence mechanism.',
                priority: 'high',
                status: 'pending'
            },
            {
                id: 'action-8',
                label: 'Isolate Server',
                icon: 'wifi-off',
                reasoning: 'WEB-SRV-02 shows signs of compromise. Isolate from network while investigation continues.',
                priority: 'medium',
                status: 'pending'
            }
        ],
        behaviorComparisons: [
            {
                metric: 'Scheduled Tasks Created',
                normalValue: 0,
                currentValue: 1,
                unit: 'per month',
                description: 'This server typically has no new scheduled tasks. Any new task is suspicious.'
            },
            {
                metric: 'PowerShell Executions',
                normalValue: 5,
                currentValue: 23,
                unit: 'per hour',
                description: 'Normal: 5 PS executions/hour for monitoring. Current: 23 executions with encoded commands.'
            }
        ]
    }
];
