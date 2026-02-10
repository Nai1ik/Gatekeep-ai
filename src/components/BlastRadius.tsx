'use client';

import { BlastRadiusData } from '@/types/types';
import { useEffect, useRef, useCallback } from 'react';

interface BlastRadiusProps {
    data: BlastRadiusData;
}

export function BlastRadius({ data }: BlastRadiusProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number>();
    const nodesRef = useRef<Array<{
        id: string;
        label: string;
        type: string;
        severity?: string;
        x: number;
        y: number;
        vx: number;
        vy: number;
    }>>([]);

    const getNodeColor = (type: string, severity?: string) => {
        if (severity === 'CRITICAL') return '#ef4444'; // red-500
        if (severity === 'WARNING') return '#f59e0b'; // amber-500
        switch (type) {
            case 'ip': return '#f87171'; // red-400
            case 'server': return '#60a5fa'; // blue-400
            case 'user': return '#a78bfa'; // violet-400
            case 'workstation': return '#34d399'; // emerald-400
            case 'file': return '#fbbf24'; // amber-400
            default: return '#9ca3af'; // gray-400
        }
    };
    const draggedNodeRef = useRef<any>(null);

    const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const pos = getMousePos(e);
        const nodes = nodesRef.current;

        for (let i = nodes.length - 1; i >= 0; i--) {
            const node = nodes[i];
            const dx = pos.x - node.x;
            const dy = pos.y - node.y;
            if (Math.sqrt(dx * dx + dy * dy) < 25) {
                draggedNodeRef.current = node;
                break;
            }
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (draggedNodeRef.current) {
            const pos = getMousePos(e);
            draggedNodeRef.current.x = pos.x;
            draggedNodeRef.current.y = pos.y;
            draggedNodeRef.current.vx = 0;
            draggedNodeRef.current.vy = 0;
        }
    };

    const handleMouseUp = () => {
        draggedNodeRef.current = null;
    };

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;

        // Clear
        ctx.clearRect(0, 0, width, height);

        const nodes = nodesRef.current;
        const nodeMap = new Map(nodes.map(n => [n.id, n]));

        // Apply forces
        nodes.forEach(node => {
            if (node === draggedNodeRef.current) return;

            // Attract to center
            node.vx += (centerX - node.x) * 0.001;
            node.vy += (centerY - node.y) * 0.001;

            // Repel from other nodes
            nodes.forEach(other => {
                if (node.id !== other.id) {
                    const dx = node.x - other.x;
                    const dy = node.y - other.y;
                    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
                    const force = 1000 / (dist * dist);
                    node.vx += (dx / dist) * force;
                    node.vy += (dy / dist) * force;
                }
            });

            // Apply velocity with damping
            node.x += node.vx * 0.1;
            node.y += node.vy * 0.1;
            node.vx *= 0.9;
            node.vy *= 0.9;

            // Boundary constraints
            node.x = Math.max(60, Math.min(width - 60, node.x));
            node.y = Math.max(30, Math.min(height - 30, node.y));
        });

        // Draw links
        data.links.forEach((link, i) => {
            const source = nodeMap.get(link.source);
            const target = nodeMap.get(link.target);
            if (!source || !target) return;

            ctx.beginPath();
            ctx.moveTo(source.x, source.y);
            ctx.lineTo(target.x, target.y);
            ctx.strokeStyle = 'rgba(75, 85, 99, 0.4)'; // gray-600
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Draw nodes
        nodes.forEach(node => {
            const color = getNodeColor(node.type, node.severity);
            const isDragged = node === draggedNodeRef.current;

            // Node circle
            ctx.beginPath();
            ctx.arc(node.x, node.y, isDragged ? 8 : 6, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();

            // Border
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#18181b'; // zinc-900 (bg color)
            ctx.stroke();

            // Selected/Highlights state
            if (isDragged) {
                ctx.beginPath();
                ctx.arc(node.x, node.y, 12, 0, Math.PI * 2);
                ctx.fillStyle = color + '33'; // 20% opacity
                ctx.fill();
            }

            // Label
            const lines = node.label.split('\n');
            ctx.font = isDragged ? 'bold 10px Inter, sans-serif' : '10px Inter, sans-serif';
            ctx.fillStyle = '#a1a1aa'; // zinc-400
            ctx.textAlign = 'center';
            lines.forEach((line, i) => {
                ctx.fillText(line, node.x, node.y + 20 + (i * 12));
            });
        });

        animationRef.current = requestAnimationFrame(draw);
    }, [data]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = canvas.width;
        const height = canvas.height;

        nodesRef.current = data.nodes.map((node) => ({
            ...node,
            x: width / 2 + (Math.random() - 0.5) * 200,
            y: height / 2 + (Math.random() - 0.5) * 150,
            vx: 0,
            vy: 0,
        }));

        draw();

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [data, draw]);

    return (
        <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                Blast Radius
            </h3>

            <div className="relative rounded-lg bg-black/20 overflow-hidden border border-white/5">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={300}
                    className="w-full h-[300px] cursor-grab active:cursor-grabbing"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                />
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-[10px] text-gray-500 uppercase tracking-wide">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-400"></div> Malicious IP
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div> Server
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-violet-400"></div> User
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Workstation
                </div>
            </div>
        </div>
    );
}
