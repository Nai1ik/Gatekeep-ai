import { NextResponse } from 'next/server';

// In-memory store for live alerts
let liveAlerts: Record<string, unknown>[] = [];

export async function GET() {
    return NextResponse.json({ alerts: liveAlerts });
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        if (body.alert) {
            liveAlerts.unshift(body.alert);
            // Keep only the last 20 alerts
            if (liveAlerts.length > 20) {
                liveAlerts = liveAlerts.slice(0, 20);
            }
        }
        return NextResponse.json({ success: true, count: liveAlerts.length });
    } catch {
        return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
}
