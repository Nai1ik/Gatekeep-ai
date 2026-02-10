#!/usr/bin/env node

/**
 * ═══════════════════════════════════════════════════════════════
 *  Security Alert Simulator
 *  ─────────────────────────────────────────────────────────────
 *  Sends a realistic test alert to the dashboard's API endpoint.
 *
 *  Usage:
 *    node simulate_alert.js                 # Send a full sample alert
 *    node simulate_alert.js --minimal       # Send a minimal alert
 *    node simulate_alert.js --clear         # Clear all live alerts
 *
 *  The dashboard at http://localhost:3000 will automatically
 *  pick up the new alert within 5 seconds.
 * ═══════════════════════════════════════════════════════════════
 */

const API_URL = 'http://localhost:3000/api/alerts';

const args = process.argv.slice(2);

// ── Clear all alerts ─────────────────────────────────────────
if (args.includes('--clear')) {
    fetch(API_URL, { method: 'DELETE' })
        .then(res => res.json())
        .then(data => {
            console.log('🗑️  All live alerts cleared.');
            console.log(data);
        })
        .catch(err => {
            console.error('❌ Failed to connect. Is the dashboard running? (npm run dev)');
            console.error(err.message);
        });
    return;
}

// ── Sample Alerts ────────────────────────────────────────────
const fullAlert = {
    severity: 'CRITICAL',
    keyTakeaway: 'A ransomware payload was detected trying to encrypt files on BACKUP-SRV-01. Immediate action is required to prevent data loss.',
    technicalSummary: 'Process \"svchost_update.exe\" (SHA256: a3f2...) was detected encrypting files in C:\\Backups with AES-256. This matches the signature of LockBit 3.0 ransomware. The process was spawned by a scheduled task created 2 hours ago.',
    mitreAttackTechnique: 'T1486',
    mitreAttackName: 'Data Encrypted for Impact',
    sourceIp: '10.0.5.22',
    sourceLocation: 'Internal Network (Workstation)',
    targetAsset: 'BACKUP-SRV-01',
    affectedUser: 'NT AUTHORITY\\SYSTEM',
    rawLog: 'Feb 09 16:35:00 BACKUP-SRV-01 sysmon[9876]: File creation detected: C:\\Backups\\*.locked - Process: svchost_update.exe PID:4521 - User: SYSTEM',
    timeline: [
        {
            id: 'evt-live-1',
            timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
            title: 'Suspicious Scheduled Task Created',
            description: 'Task "SystemUpdate" created to run svchost_update.exe',
            severity: 'WARNING',
            source: '10.0.5.22'
        },
        {
            id: 'evt-live-2',
            timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
            title: 'Lateral Movement Detected',
            description: 'svchost_update.exe copied to BACKUP-SRV-01 via SMB',
            severity: 'WARNING',
            source: '10.0.5.22'
        },
        {
            id: 'evt-live-3',
            timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
            title: 'File Encryption Started',
            description: '150 files encrypted in C:\\Backups in 3 minutes',
            severity: 'CRITICAL',
            source: 'BACKUP-SRV-01'
        },
        {
            id: 'evt-live-4',
            timestamp: new Date().toISOString(),
            title: 'Ransom Note Dropped',
            description: 'README_RESTORE.txt created in encrypted directories',
            severity: 'CRITICAL',
            source: 'BACKUP-SRV-01'
        }
    ],
    blastRadius: {
        nodes: [
            { id: 'ws-attacker', label: '10.0.5.22\n(Patient Zero)', type: 'workstation', severity: 'CRITICAL' },
            { id: 'backup-srv', label: 'BACKUP-SRV-01', type: 'server', severity: 'CRITICAL' },
            { id: 'system-user', label: 'NT AUTHORITY\\SYSTEM', type: 'user', severity: 'WARNING' },
            { id: 'files', label: 'C:\\Backups\n(150+ files)', type: 'file', severity: 'CRITICAL' }
        ],
        links: [
            { source: 'ws-attacker', target: 'backup-srv', label: 'SMB Lateral Move' },
            { source: 'backup-srv', target: 'system-user', label: 'Running As' },
            { source: 'system-user', target: 'files', label: 'Encrypting' }
        ]
    },
    remediationActions: [
        {
            id: 'action-live-1',
            label: 'Isolate BACKUP-SRV-01',
            icon: 'wifi-off',
            reasoning: 'Immediately disconnect the backup server from the network to stop the encryption from spreading to other systems and prevent the attacker from exfiltrating data.',
            priority: 'high',
            status: 'pending'
        },
        {
            id: 'action-live-2',
            label: 'Kill Ransomware Process',
            icon: 'x-circle',
            reasoning: 'Terminate svchost_update.exe (PID 4521) on BACKUP-SRV-01 to halt the file encryption immediately.',
            priority: 'high',
            status: 'pending'
        },
        {
            id: 'action-live-3',
            label: 'Quarantine Patient Zero',
            icon: 'shield-off',
            reasoning: 'Workstation 10.0.5.22 is the source of the lateral movement. Isolate it to prevent further spread across the network.',
            priority: 'high',
            status: 'pending'
        }
    ],
    behaviorComparisons: [
        {
            metric: 'File Modifications',
            normalValue: 10,
            currentValue: 150,
            unit: 'files/min',
            description: 'Normal backup operations modify ~10 files per minute. Current rate: 150 files/min with .locked extension.'
        },
        {
            metric: 'CPU Usage',
            normalValue: 15,
            currentValue: 98,
            unit: '%',
            description: 'Backup server normally uses 15% CPU. Current: 98% from encryption operations.'
        }
    ]
};

const minimalAlert = {
    severity: 'WARNING',
    keyTakeaway: 'An unknown USB device was plugged into a workstation in the finance department.',
    technicalSummary: 'USB mass storage device (VID:0x1234 PID:0x5678) connected to FIN-WS-03. Device not in approved device whitelist.',
    sourceIp: '10.0.3.15',
    sourceLocation: 'Finance Department',
    targetAsset: 'FIN-WS-03',
    affectedUser: 'jdoe@company.com',
};

// ── Send the alert ───────────────────────────────────────────
const alertToSend = args.includes('--minimal') ? minimalAlert : fullAlert;
const label = args.includes('--minimal') ? 'Minimal' : 'Full (Ransomware)';

console.log(`\n🚀 Sending ${label} alert to ${API_URL}...\n`);

fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(alertToSend),
})
    .then(res => res.json())
    .then(data => {
        console.log('✅ Alert sent successfully!');
        console.log(`   Alert ID:  ${data.alertId}`);
        console.log(`   Total Live: ${data.totalAlerts}`);
        console.log('\n👀 Check the dashboard at http://localhost:3000');
        console.log('   The new alert will appear in the sidebar with a green "LIVE" badge.\n');
    })
    .catch(err => {
        console.error('❌ Failed to connect. Is the dashboard running? (npm run dev)');
        console.error(`   Error: ${err.message}\n`);
    });
