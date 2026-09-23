'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';

interface GraphNode {
  id: string;
  name: string;
  category: string;
  rx: number; // Canonical X ratio (0 to 1)
  ry: number; // Canonical Y ratio (0 to 1)
  color: string;
  radius: number;
  labelPos: 'top' | 'right' | 'bottom' | 'left';
  desc: string;
  relatedResponse: string;
}

interface GraphEdge {
  source: string;
  target: string;
  isCausalChain?: boolean;
}

// Exact Hexagram / Star-Hexagon Geometry matching Card 8 in reference image
const GRAPH_NODES: GraphNode[] = [
  {
    id: 'm07',
    name: 'Machine M07',
    category: 'Root Bottleneck',
    rx: 0.50,
    ry: 0.16,
    color: '#ff2a5f',
    radius: 11,
    labelPos: 'top',
    desc: 'Rotary Isobaric Filler: Valve #7 seal leak causing 14.8°C thermal rise & foaming.',
    relatedResponse:
      'Machine M07 (Rotary Isobaric Filler) is the root bottleneck: Valve #7 pressure micro-leak allows dissolved CO2 to flash into foam at 1,150 cans/min.',
  },
  {
    id: 'qc',
    name: 'QC Station',
    category: 'Fill Inspection',
    rx: 0.77,
    ry: 0.33,
    color: '#a855f7',
    radius: 10,
    labelPos: 'right',
    desc: 'QC01 optical vision inspector rejecting 6.4% cans for erratic headspace.',
    relatedResponse:
      'QC01 Vision Inspector: Rejecting 6.40% cans due to foam-induced false headspace levels. Normal threshold is <0.20%.',
  },
  {
    id: 'energy',
    name: 'Energy',
    category: 'Thermal Loop',
    rx: 0.77,
    ry: 0.67,
    color: '#f59e0b',
    radius: 10,
    labelPos: 'right',
    desc: 'CO2 flash refrigeration unit drawing continuous 456 kW electrical load.',
    relatedResponse:
      'Chilling Energy: Heat exchanger running at peak 456.2 kW attempting to pull product temperature down from 14.8°C to 4.0°C.',
  },
  {
    id: 'shipment',
    name: 'Shipment',
    category: 'SLA Delivery',
    rx: 0.50,
    ry: 0.84,
    color: '#00f076',
    radius: 11,
    labelPos: 'bottom',
    desc: 'Walmart Order #8921 (10,000 cases): 5.5h delay risk if unmitigated.',
    relatedResponse:
      'Walmart Pallet Order #8921: 5.5-hour delay risk on truck dispatch. Applying the mitigation plan recovers schedule to 0.8h delay window.',
  },
  {
    id: 'inventory',
    name: 'Inventory',
    category: 'Accumulation Queue',
    rx: 0.23,
    ry: 0.67,
    color: '#00d2ff',
    radius: 10,
    labelPos: 'left',
    desc: 'Inflow beverage accumulator tanks running at 94% buffer threshold.',
    relatedResponse:
      'Inventory Buffer: Cold-brew syrup accumulation tank at 94% capacity. Upstream blending must be throttled if M07 is not relieved.',
  },
  {
    id: 'l3',
    name: 'Line 3',
    category: 'Pacing Constraint',
    rx: 0.23,
    ry: 0.33,
    color: '#38bdf8',
    radius: 10,
    labelPos: 'left',
    desc: 'Line 3 canning track speed throttled to 820 cpm to avoid liquid overflow.',
    relatedResponse:
      'Line 3 Conveyor speed has been automatically choked to 68% (820 cans/min) by PLC interlocks to prevent can brim spills.',
  },
  {
    id: 'center',
    name: 'Process Flow Hub',
    category: 'Central Bus',
    rx: 0.50,
    ry: 0.50,
    color: '#6366f1',
    radius: 9,
    labelPos: 'top',
    desc: 'Central PLC & SCADA bus coordinating backpressure across lines.',
    relatedResponse:
      'Process Flow Hub: Real-time PLC communication bus coordinating mass-flow balance between Line 1, Line 2 and Line 3.',
  },
];

// Exact network edges forming Hexagon + Hexagram Star chords from reference image Card 8
const GRAPH_EDGES: GraphEdge[] = [
  // 1. Outer Perimeter Hexagon
  { source: 'm07', target: 'qc', isCausalChain: true },
  { source: 'qc', target: 'energy' },
  { source: 'energy', target: 'shipment' },
  { source: 'shipment', target: 'inventory' },
  { source: 'inventory', target: 'l3' },
  { source: 'l3', target: 'm07', isCausalChain: true },

  // 2. Central Diametric Spokes
  { source: 'm07', target: 'center', isCausalChain: true },
  { source: 'center', target: 'shipment', isCausalChain: true },
  { source: 'l3', target: 'center' },
  { source: 'center', target: 'energy' },
  { source: 'inventory', target: 'center' },
  { source: 'center', target: 'qc', isCausalChain: true },

  // 3. Hexagram Star Cross-Chords (exact geometric shape from Card 8)
  { source: 'm07', target: 'energy' },
  { source: 'm07', target: 'inventory', isCausalChain: true },
  { source: 'shipment', target: 'qc', isCausalChain: true },
  { source: 'shipment', target: 'l3' },
  { source: 'l3', target: 'qc' },
  { source: 'inventory', target: 'energy' },
];

interface GraphProps {
  height?: number;
  isMini?: boolean;
}

export const CausalForceGraph: React.FC<GraphProps> = ({
  height = 240,
  isMini = false,
}) => {
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const setFocusedTarget = useTwinStore((s) => s.setFocusedTarget);
  const addMessage = useTwinStore((s) => s.addMessage);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode>(GRAPH_NODES[0]);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      const parentW = canvas.parentElement?.clientWidth || 360;
      const parentH = canvas.parentElement?.clientHeight || height;
      const w = (canvas.width = parentW);
      const h = (canvas.height = parentH);

      ctx.clearRect(0, 0, w, h);
      time += 0.02;

      // Compute exact node positions on canvas
      const nodePos = new Map<string, { x: number; y: number }>();
      GRAPH_NODES.forEach((n) => {
        nodePos.set(n.id, { x: n.rx * w, y: n.ry * h });
      });

      // 1. Draw Edges matching Card 8
      GRAPH_EDGES.forEach((edge, idx) => {
        const p1 = nodePos.get(edge.source);
        const p2 = nodePos.get(edge.target);
        if (!p1 || !p2) return;

        const isCausal = edge.isCausalChain;
        const isFaultActive = !appliedPlan && isCausal;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        if (isFaultActive) {
          ctx.strokeStyle = `rgba(255, 42, 95, ${0.45 + Math.sin(time * 3 + idx) * 0.2})`;
          ctx.lineWidth = isMini ? 1.5 : 2.0;
        } else if (appliedPlan && isCausal) {
          ctx.strokeStyle = 'rgba(0, 240, 118, 0.45)';
          ctx.lineWidth = isMini ? 1.4 : 1.8;
        } else {
          ctx.strokeStyle = 'rgba(79, 70, 229, 0.25)';
          ctx.lineWidth = isMini ? 1.0 : 1.2;
        }
        ctx.stroke();

        // Animated signal packet along edge
        const speed = isFaultActive ? 0.35 : 0.2;
        const t = (time * speed + idx * 0.18) % 1;
        const px = p1.x + (p2.x - p1.x) * t;
        const py = p1.y + (p2.y - p1.y) * t;

        ctx.beginPath();
        ctx.arc(px, py, isMini ? 1.8 : 2.2, 0, Math.PI * 2);
        ctx.fillStyle = isFaultActive ? '#ff2a5f' : appliedPlan ? '#00f076' : '#818cf8';
        ctx.shadowBlur = 6;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2. Draw Chord Intersection Micro-Dots (exact detail from Card 8)
      // Find intersections of key cross-chords
      const pM07 = nodePos.get('m07')!;
      const pShip = nodePos.get('shipment')!;
      const pL3 = nodePos.get('l3')!;
      const pEnergy = nodePos.get('energy')!;
      const pInv = nodePos.get('inventory')!;
      const pQC = nodePos.get('qc')!;

      // Intermediate intersection points along radial and cross chords
      const intersections = [
        { x: (pM07.x + pCenter(pM07, pShip, 0.33).x) / 2, y: pCenter(pM07, pShip, 0.33).y },
        { x: pCenter(pM07, pShip, 0.67).x, y: pCenter(pM07, pShip, 0.67).y },
        { x: (pL3.x + pQC.x) * 0.5, y: (pL3.y + pQC.y) * 0.5 },
        { x: (pInv.x + pEnergy.x) * 0.5, y: (pInv.y + pEnergy.y) * 0.5 },
        { x: (pL3.x + pInv.x) * 0.5 + 15, y: (pL3.y + pInv.y) * 0.5 },
        { x: (pQC.x + pEnergy.x) * 0.5 - 15, y: (pQC.y + pEnergy.y) * 0.5 },
      ];

      intersections.forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isMini ? 1.5 : 2.0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(165, 180, 252, 0.7)';
        ctx.fill();
      });

      // 3. Draw Nodes matching Card 8 in image
      GRAPH_NODES.forEach((node) => {
        const pos = nodePos.get(node.id);
        if (!pos) return;

        const isHovered = hoveredNode?.id === node.id;
        const isSelected = selectedNode.id === node.id;
        const isM07Fault = node.id === 'm07' && !appliedPlan;

        // Outer halo / glow ring
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, node.radius + (isHovered ? 6 : 4), 0, Math.PI * 2);
        ctx.strokeStyle = isM07Fault
          ? `rgba(255, 42, 95, ${0.4 + Math.sin(time * 4) * 0.3})`
          : isSelected
          ? 'rgba(0, 210, 255, 0.6)'
          : `${node.color}40`;
        ctx.lineWidth = isSelected ? 2 : 1.5;
        ctx.stroke();

        // Node circle body
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#0a0e1e';
        ctx.fill();

        // Inner glowing core
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, node.radius - 2.5, 0, Math.PI * 2);
        ctx.fillStyle = isM07Fault ? '#ff2a5f' : node.color;
        ctx.shadowBlur = isHovered || isSelected ? 12 : 6;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label placement matching Card 8
        if (node.id !== 'center') {
          ctx.font = isMini
            ? 'bold 10px Inter, -apple-system, sans-serif'
            : 'bold 12px Inter, -apple-system, sans-serif';
          ctx.fillStyle = isSelected ? '#ffffff' : '#e2e8f0';

          let tx = pos.x;
          let ty = pos.y;

          if (node.labelPos === 'top') {
            ctx.textAlign = 'center';
            ty = pos.y - node.radius - (isMini ? 6 : 9);
          } else if (node.labelPos === 'bottom') {
            ctx.textAlign = 'center';
            ty = pos.y + node.radius + (isMini ? 12 : 16);
          } else if (node.labelPos === 'left') {
            ctx.textAlign = 'right';
            tx = pos.x - node.radius - (isMini ? 6 : 10);
            ty = pos.y + 4;
          } else if (node.labelPos === 'right') {
            ctx.textAlign = 'left';
            tx = pos.x + node.radius + (isMini ? 6 : 10);
            ty = pos.y + 4;
          }

          ctx.fillText(node.name, tx, ty);
        }
      });

      animId = requestAnimationFrame(render);
    };

    function pCenter(
      p1: { x: number; y: number },
      p2: { x: number; y: number },
      ratio: number
    ) {
      return { x: p1.x + (p2.x - p1.x) * ratio, y: p1.y + (p2.y - p1.y) * ratio };
    }

    render();
    return () => cancelAnimationFrame(animId);
  }, [appliedPlan, isMini, height, selectedNode, hoveredNode]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;

    for (const node of GRAPH_NODES) {
      const nx = node.rx * w;
      const ny = node.ry * h;
      const dist = Math.hypot(clickX - nx, clickY - ny);
      if (dist < node.radius + 14) {
        setSelectedNode(node);
        if (node.id === 'm07') setFocusedTarget('M07');
        if (node.id === 'l3') setFocusedTarget('L3');
        if (node.id === 'qc') setFocusedTarget('QC01');
        if (node.id === 'shipment') setFocusedTarget('SHIP01');

        addMessage({
          sender: 'agent',
          text: `[Force-Directed Graph]: ${node.relatedResponse}`,
          actions: ['Show affected area', 'Compare scenarios', 'Optimize beverage flow'],
        });
        break;
      }
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;

    let found: GraphNode | null = null;
    for (const node of GRAPH_NODES) {
      const nx = node.rx * w;
      const ny = node.ry * h;
      const dist = Math.hypot(mouseX - nx, mouseY - ny);
      if (dist < node.radius + 12) {
        found = node;
        break;
      }
    }
    setHoveredNode(found);
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden font-sans select-none">
      {/* Canvas Area */}
      <div className="relative flex-1 w-full min-h-0 bg-[#050813]">
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredNode(null)}
          className="block h-full w-full cursor-pointer"
        />

        {/* Card Header and State Badge (only in full view) */}
        {!isMini && (
          <>


            <div className="pointer-events-none absolute top-2.5 right-3 flex items-center space-x-1.5 rounded-md border border-slate-800 bg-slate-950/80 px-2.5 py-1 text-xs text-slate-300 backdrop-blur">
              <span className="text-slate-400">Selected: </span>
              <span className="font-bold text-cyan-300">{selectedNode.name}</span>
            </div>
          </>
        )}
      </div>

      {/* Relatable Beverage Response Drawer */}
      {!isMini && (
        <div className="border-t border-slate-800/80 bg-slate-950/95 p-3 shrink-0 font-sans">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: selectedNode.color }}
                />
                <h4 className="text-xs font-bold text-white tracking-wide">
                  {selectedNode.name}
                </h4>
                <span className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300 font-medium">
                  {selectedNode.category}
                </span>
                {selectedNode.id === 'm07' && !appliedPlan && (
                  <span className="rounded border border-twin-red/40 bg-twin-red/20 px-2 py-0.5 text-[10px] font-bold text-twin-red animate-pulse">
                    ROOT FAULT NODE
                  </span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-slate-200">
                <strong className="text-cyan-300 font-semibold">Related Response: </strong>
                {selectedNode.relatedResponse}
              </p>
            </div>
            <button
              onClick={() => {
                if (selectedNode.id === 'm07') setFocusedTarget('M07');
                if (selectedNode.id === 'l3') setFocusedTarget('L3');
                if (selectedNode.id === 'qc') setFocusedTarget('QC01');
                if (selectedNode.id === 'shipment') setFocusedTarget('SHIP01');
                addMessage({
                  sender: 'agent',
                  text: `[Focus Target]: Inspected ${selectedNode.name}. ${selectedNode.desc}`,
                  actions: ['Show affected area', 'Compare scenarios', 'Optimize beverage flow'],
                });
              }}
              className="shrink-0 rounded-lg border border-cyan-500/40 bg-cyan-950/70 px-3 py-1.5 text-xs font-semibold text-cyan-200 hover:bg-cyan-900 hover:text-white transition-colors shadow-sm"
            >
              Focus in 3D Twin
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
