'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';

interface ClusterDef {
  id: string;
  name: string;
  code: string;
  xRatio: number;
  yRatio: number;
  color: string;
  numNodes: number;
  radius: number;
  kpi: string;
  nominalKpi: string;
  detail: string;
}

const DOMAIN_CLUSTERS: ClusterDef[] = [
  {
    id: 'production',
    name: 'Production',
    code: 'Cluster A',
    xRatio: 0.24,
    yRatio: 0.44,
    color: '#00d2ff', // Blue/Cyan
    numNodes: 9,
    radius: 38,
    kpi: '8,200 cases/hr (68% pacing)',
    nominalKpi: '9,600 cases/hr (98% pacing)',
    detail: 'Lines 1, 2, 3 • M01-M08 • Valve #7 Throttled',
  },
  {
    id: 'quality',
    name: 'Quality',
    code: 'Cluster B',
    xRatio: 0.64,
    yRatio: 0.26,
    color: '#00f076', // Emerald / Teal
    numNodes: 7,
    radius: 34,
    kpi: '6.40% Underfill Rejects',
    nominalKpi: '0.12% Rejects (Nominal)',
    detail: 'QC01 Vision • QC02 Acoustic Leak Check',
  },
  {
    id: 'supply',
    name: 'Supply Chain',
    code: 'Cluster C',
    xRatio: 0.84,
    yRatio: 0.46,
    color: '#6366f1', // Indigo / Violet
    numNodes: 7,
    radius: 34,
    kpi: 'Walmart #8921: 5.5h Delay Risk',
    nominalKpi: 'Walmart #8921: On Time',
    detail: 'Inbound Syrup • Can Packaging Inventory',
  },
  {
    id: 'energy',
    name: 'Energy',
    code: 'Cluster D',
    xRatio: 0.42,
    yRatio: 0.78,
    color: '#fbbf24', // Warm Amber
    numNodes: 7,
    radius: 34,
    kpi: '456.2 kW • Chiller COP 2.8',
    nominalKpi: '412.0 kW • Chiller COP 3.4',
    detail: 'CO2 Chiller • High-Pressure Air • CIP Steam',
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    code: 'Cluster E',
    xRatio: 0.74,
    yRatio: 0.78,
    color: '#c084fc', // Magenta / Purple
    numNodes: 6,
    radius: 32,
    kpi: 'Valve #7 Seal Degradation Alert',
    nominalKpi: 'All Seals Within Tolerance',
    detail: 'M07 Valve Seal Life • CIP Sanitization Health',
  },
];

interface ClusterProps {
  height?: number;
  isMini?: boolean;
}

export const DomainClusterNetwork: React.FC<ClusterProps> = ({
  height = 240,
  isMini = false,
}) => {
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCluster, setHoveredCluster] = useState<ClusterDef | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Procedural nodes per cluster
    const clusterNodes: Array<{
      clusterId: string;
      relX: number;
      relY: number;
      size: number;
    }> = [];

    DOMAIN_CLUSTERS.forEach((c) => {
      // Center node
      clusterNodes.push({ clusterId: c.id, relX: 0, relY: 0, size: 3.5 });
      // Orbiting nodes
      for (let i = 0; i < c.numNodes - 1; i++) {
        const angle = (i / (c.numNodes - 1)) * Math.PI * 2 + Math.random() * 0.5;
        const dist = c.radius * (0.45 + Math.random() * 0.55);
        clusterNodes.push({
          clusterId: c.id,
          relX: Math.cos(angle) * dist,
          relY: Math.sin(angle) * dist,
          size: 1.8 + Math.random() * 1.2,
        });
      }
    });

    // Inter-cluster flow conduits
    const conduits = [
      { from: 'production', to: 'quality' },
      { from: 'production', to: 'energy' },
      { from: 'production', to: 'maintenance' },
      { from: 'quality', to: 'supply' },
      { from: 'energy', to: 'supply' },
    ];

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 400);
      const h = (canvas.height = canvas.parentElement?.clientHeight || height);

      ctx.clearRect(0, 0, w, h);
      time += 0.025;

      // 1. Draw inter-cluster conduits with flowing pulses
      conduits.forEach((c) => {
        const c1 = DOMAIN_CLUSTERS.find((cl) => cl.id === c.from)!;
        const c2 = DOMAIN_CLUSTERS.find((cl) => cl.id === c.to)!;

        const x1 = c1.xRatio * w;
        const y1 = c1.yRatio * h;
        const x2 = c2.xRatio * w;
        const y2 = c2.yRatio * h;

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Flowing data packet
        const t = (time * 0.35 + (c1.numNodes % 3) * 0.3) % 1;
        const px = x1 + (x2 - x1) * t;
        const py = y1 + (y2 - y1) * t;

        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = appliedPlan ? '#00f076' : '#00d2ff';
        ctx.shadowBlur = 5;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2. Draw each cluster constellation
      DOMAIN_CLUSTERS.forEach((c) => {
        const cx = c.xRatio * w;
        const cy = c.yRatio * h;
        const isHovered = hoveredCluster?.id === c.id;
        const isFaultDomain = !appliedPlan && (c.id === 'production' || c.id === 'quality');
        const clusterColor = appliedPlan ? '#00f076' : isFaultDomain ? '#ff2a5f' : c.color;

        // Faint outer cluster boundary glow
        ctx.beginPath();
        ctx.arc(cx, cy, c.radius * (isHovered ? 1.25 : 1.1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${isFaultDomain ? '255, 42, 95' : '0, 210, 255'}, ${isHovered ? 0.08 : 0.03})`;
        ctx.fill();

        // Get this cluster's nodes
        const nodes = clusterNodes
          .filter((n) => n.clusterId === c.id)
          .map((n) => {
            // Gentle breathing orbit
            const wobbleX = Math.sin(time + n.relY * 0.1) * 2;
            const wobbleY = Math.cos(time + n.relX * 0.1) * 2;
            return {
              x: cx + n.relX + wobbleX,
              y: cy + n.relY + wobbleY,
              size: n.size + (isHovered ? 0.5 : 0),
            };
          });

        // Intra-cluster triangulated connecting lines
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dist = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
            if (dist < c.radius * 1.2) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(${isFaultDomain ? '255, 42, 95' : '56, 189, 248'}, ${
                isHovered ? 0.35 : 0.18
              })`;
              ctx.lineWidth = 0.9;
              ctx.stroke();
            }
          }
        }

        // Draw nodes
        nodes.forEach((n, idx) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
          ctx.fillStyle = idx === 0 ? '#ffffff' : clusterColor;
          ctx.shadowBlur = isHovered ? 10 : 4;
          ctx.shadowColor = clusterColor;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // Cluster Title Label
        if (!isMini) {
          ctx.font = 'bold 11px Inter, -apple-system, sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.fillText(c.name, cx, cy + c.radius + 14);

          ctx.font = '600 10px Inter, -apple-system, sans-serif';
          ctx.fillStyle = clusterColor;
          ctx.fillText(c.code, cx, cy + c.radius + 25);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [appliedPlan, isMini, height, hoveredCluster]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const w = canvas.width;
    const h = canvas.height;

    let found: ClusterDef | null = null;
    for (const c of DOMAIN_CLUSTERS) {
      const cx = c.xRatio * w;
      const cy = c.yRatio * h;
      if (Math.hypot(mx - cx, my - cy) < c.radius + 15) {
        found = c;
        break;
      }
    }
    setHoveredCluster(found);
  };

  return (
    <div className="relative h-full w-full overflow-hidden select-none font-sans">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredCluster(null)}
        className="block h-full w-full cursor-crosshair"
      />



      {/* Hovered Domain Details Drawer */}
      {hoveredCluster && (
        <div className="pointer-events-none absolute bottom-2 left-2 right-2 rounded-lg border border-cyan-500/40 bg-slate-950/95 p-2.5 text-xs backdrop-blur shadow-2xl z-30 font-sans">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1 mb-1">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: hoveredCluster.color }}
              />
              <span>{hoveredCluster.name}</span>
              <span className="text-xs text-cyan-300 font-medium">[{hoveredCluster.code}]</span>
            </span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                appliedPlan
                  ? 'bg-twin-green/20 text-twin-green border border-twin-green/40'
                  : hoveredCluster.id === 'production' || hoveredCluster.id === 'quality'
                  ? 'bg-twin-red/20 text-twin-red border border-twin-red/40'
                  : 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/30'
              }`}
            >
              {appliedPlan ? hoveredCluster.nominalKpi : hoveredCluster.kpi}
            </span>
          </div>
          <div className="text-xs text-slate-200 leading-normal">
            {hoveredCluster.detail}
          </div>
        </div>
      )}
    </div>
  );
};
