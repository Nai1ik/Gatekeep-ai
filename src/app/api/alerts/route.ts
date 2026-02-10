import { NextRequest, NextResponse } from 'next/server';

// ──────────────────────────────────────────────────────────────────────
// In-Memory Alert Store
// In production, this would be a database (Supabase, PostgreSQL, etc.)
// ──────────────────────────────────────────────────────────────────────

interface StoredAlert {
    id: string;
    timestamp: string;
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    keyTakeaway: string;
    technicalSummary: string;
    mitreAttackTechnique: string;
    mitreAttackName: string;
    sourceIp: string;
    sourceLocation: string;
    targetAsset: string;
    affectedUser: string;
    rawLog: string;
    timeline: {
        id: string;
        timestamp: string;
        title: string;
        description: string;
        severity: 'CRITICAL' | 'WARNING' | 'INFO';
        source?: string;
    }[];
    blastRadius: {
        nodes: { id: string; label: string; type: string; severity?: string }[];
        links: { source: string; target: string; label?: string }[];
    };
    remediationActions: {
        id: string;
        label: string;
        icon: string;
        reasoning: string;
        priority: 'high' | 'medium' | 'low';
        status: 'pending' | 'in-progress' | 'completed';
    }[];
    behaviorComparisons: {
        metric: string;
        normalValue: number;
        currentValue: number;
        unit: string;
        description: string;
    }[];
}

// Global in-memory store (persists across requests during dev server lifetime)
const alertStore: StoredAlert[] = [];

// ──────────────────────────────────────────────────────────────────────
// GET /api/alerts – Returns all live alerts
// ──────────────────────────────────────────────────────────────────────
export async function GET() {
    return NextResponse.json({
        count: alertStore.length,
        alerts: alertStore,
    });
}

// ──────────────────────────────────────────────────────────────────────
// POST /api/alerts – Receive a new alert from an external tool
// ──────────────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation
        const requiredFields = [
            'severity', 'keyTakeaway', 'technicalSummary',
            'sourceIp', 'targetAsset', 'affectedUser'
        ];

        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                );
            }
        }

        // Build the full alert with sensible defaults
        const newAlert: StoredAlert = {
            id: body.id || `live-alert-${Date.now()}`,
            timestamp: body.timestamp || new Date().toISOString(),
            severity: body.severity,
            keyTakeaway: body.keyTakeaway,
            technicalSummary: body.technicalSummary,
            mitreAttackTechnique: body.mitreAttackTechnique || 'Unknown',
            mitreAttackName: body.mitreAttackName || 'Unknown Technique',
            sourceIp: body.sourceIp,
            sourceLocation: body.sourceLocation || 'Unknown',
            targetAsset: body.targetAsset,
            affectedUser: body.affectedUser,
            rawLog: body.rawLog || `Raw log data for alert ${body.id || 'N/A'}`,
            timeline: body.timeline || [
                {
                    id: `evt-${Date.now()}`,
                    timestamp: new Date().toISOString(),
                    title: 'Alert Generated',
                    description: body.technicalSummary,
                    severity: body.severity,
                    source: body.sourceIp,
                }
            ],
            blastRadius: body.blastRadius || {
                nodes: [
                    { id: 'src-ip', label: body.sourceIp, type: 'ip', severity: body.severity },
                    { id: 'target', label: body.targetAsset, type: 'server', severity: 'WARNING' },
                    { id: 'user', label: body.affectedUser, type: 'user' },
                ],
                links: [
                    { source: 'src-ip', target: 'target', label: 'Attack Vector' },
                    { source: 'target', target: 'user', label: 'Affected' },
                ]
            },
            remediationActions: body.remediationActions || [
                {
                    id: `action-${Date.now()}`,
                    label: `Block ${body.sourceIp}`,
                    icon: 'shield-off',
                    reasoning: `Automated recommendation: Block source IP ${body.sourceIp} based on detected ${body.severity} alert.`,
                    priority: body.severity === 'CRITICAL' ? 'high' : 'medium',
                    status: 'pending',
                }
            ],
            behaviorComparisons: body.behaviorComparisons || [],
        };

        alertStore.unshift(newAlert); // Add to front (newest first)

        return NextResponse.json(
            {
                success: true,
                message: 'Alert received and stored',
                alertId: newAlert.id,
                totalAlerts: alertStore.length,
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: 'Invalid JSON payload', details: String(error) },
            { status: 400 }
        );
    }
}

// ──────────────────────────────────────────────────────────────────────
// DELETE /api/alerts – Clear all live alerts (for testing)
// ──────────────────────────────────────────────────────────────────────
export async function DELETE() {
    alertStore.length = 0;
    return NextResponse.json({ success: true, message: 'All live alerts cleared' });
}
