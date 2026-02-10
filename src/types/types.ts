export type SeverityLevel = 'CRITICAL' | 'WARNING' | 'INFO';

export interface TimelineEvent {
    id: string;
    timestamp: Date;
    title: string;
    description: string;
    severity: SeverityLevel;
    source?: string;
}

export interface GraphNode {
    id: string;
    label: string;
    type: 'workstation' | 'server' | 'ip' | 'user' | 'file';
    severity?: SeverityLevel;
}

export interface GraphLink {
    source: string;
    target: string;
    label?: string;
}

export interface BlastRadiusData {
    nodes: GraphNode[];
    links: GraphLink[];
}

export interface RemediationAction {
    id: string;
    label: string;
    icon: string;
    reasoning: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in-progress' | 'completed';
}

export interface BehaviorComparison {
    metric: string;
    normalValue: number;
    currentValue: number;
    unit: string;
    description: string;
}

export interface SecurityAlert {
    id: string;
    timestamp: Date;
    severity: SeverityLevel;
    keyTakeaway: string;
    technicalSummary: string;
    mitreAttackTechnique: string;
    mitreAttackName: string;
    sourceIp: string;
    sourceLocation: string;
    targetAsset: string;
    affectedUser: string;
    rawLog: string;
    timeline: TimelineEvent[];
    blastRadius: BlastRadiusData;
    remediationActions: RemediationAction[];
    behaviorComparisons: BehaviorComparison[];
}
