'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useTwinStore } from '@/lib/store/twinStore';

interface MeshProps {
  height?: number;
  isMini?: boolean;
}

interface MeshVertex {
  c: number;
  r: number;
  px: number;
  py: number;
  intensity: number;
  wCoord: number; // 4th coordinate
  region: string;
  telemetry: {
    kpi1: string;
    kpi2: string;
    status: string;
  };
  desc: string;
}

export const AdaptiveIntelligenceMesh: React.FC<MeshProps> = ({
  height = 240,
  isMini = false,
}) => {
  const appliedPlan = useTwinStore((s) => s.appliedPlan);
  const setFocusedTarget = useTwinStore((s) => s.setFocusedTarget);
  const addMessage = useTwinStore((s) => s.addMessage);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const [selectedVertex, setSelectedVertex] = useState<MeshVertex | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<MeshVertex | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    // Grid resolution matching the 1,024 nodes from reference image
    const cols = isMini ? 24 : 32;
    const rows = isMini ? 16 : 24;

    const render = () => {
      const w = (canvas.width = canvas.parentElement?.clientWidth || 400);
      const h = (canvas.height = canvas.parentElement?.clientHeight || height);

      ctx.clearRect(0, 0, w, h);
      time += 0.01;

      // 4-Dimensional Hyper-Plane Rotation Angles
      // Continuous hyper-rotations smoothly morph inner & outer manifold topology
      const thetaXW = time * 0.22 + (mouseRef.current.active ? mouseRef.current.x * 0.35 : 0);
      const thetaZW = time * 0.18 + (mouseRef.current.active ? mouseRef.current.y * 0.25 : 0);

      // 3D Camera Projection parameters
      const fov = 340;
      const cameraY = -65 + (mouseRef.current.active ? mouseRef.current.y * 25 : 0);
      const cameraZ = -190;
      const cameraAngleX = 0.54 + (mouseRef.current.active ? mouseRef.current.y * 0.12 : 0);
      const cameraAngleY = mouseRef.current.active ? mouseRef.current.x * 0.22 : 0;

      const spacingX = w / (cols * 0.82);
      const spacingZ = isMini ? 18 : 22;

      // Distance for 4D-to-3D stereographic hyper-perspective divide
      const d4 = 280;

      // Compute 4D manifold vertex coordinates: (x, y, z, w) -> (x', y', z') -> (px, py)
      const grid: MeshVertex[][] = [];

      for (let r = 0; r < rows; r++) {
        const rowArr: MeshVertex[] = [];
        for (let c = 0; c < cols; c++) {
          // Spatial 3D coordinates
          const origX = (c - cols / 2) * spacingX;
          const origZ = (r - rows / 2) * spacingZ;

          // Dual peak elevation harmonics matching Card 5 in reference image
          // Left Peak (Cyan/Blue): Isobaric filling & carbonation
          const d1 = Math.hypot(c - cols * 0.35, r - rows * 0.45);
          const peak1 = Math.exp(-d1 * 0.28) * (isMini ? 46 : 78);

          // Right Peak (Amber/Violet): Thermal pasteurization & chilling
          const d2 = Math.hypot(c - cols * 0.70, r - rows * 0.55);
          const peak2 = Math.exp(-d2 * 0.32) * (isMini ? 42 : 68);

          const yBase = -(peak1 + peak2);

          // 4th Dimensional Coordinate (w) representing live operational phase & temporal flux
          const normC = (c / cols) * Math.PI * 2;
          const normR = (r / rows) * Math.PI * 2;
          const origW =
            Math.sin(normC + time * 0.7) * Math.cos(normR + time * 0.5) * (isMini ? 35 : 55);

          // --- 4D Euclidean Hyper-Plane Rotations ---
          // 1. Rotation in X-W hyper-plane
          const x1 = origX * Math.cos(thetaXW) - origW * Math.sin(thetaXW);
          const w1 = origX * Math.sin(thetaXW) + origW * Math.cos(thetaXW);

          // 2. Rotation in Z-W hyper-plane
          const z1 = origZ * Math.cos(thetaZW) - w1 * Math.sin(thetaZW);
          const w4 = origZ * Math.sin(thetaZW) + w1 * Math.cos(thetaZW);

          // --- 4D to 3D Hyper-Perspective Projection ---
          const scale4 = d4 / Math.max(1, d4 - w4);
          const x3d = x1 * scale4;
          const y3d = (yBase + Math.sin(w4 * 0.04) * (isMini ? 6 : 10)) * scale4;
          const z3d = z1 * scale4;

          // --- 3D Camera Rotation (Yaw & Pitch) ---
          const rotX = x3d * Math.cos(cameraAngleY) - z3d * Math.sin(cameraAngleY);
          const rotZ = x3d * Math.sin(cameraAngleY) + z3d * Math.cos(cameraAngleY);

          const finalY =
            (y3d - cameraY) * Math.cos(cameraAngleX) - (rotZ - cameraZ) * Math.sin(cameraAngleX);
          const finalZ =
            (y3d - cameraY) * Math.sin(cameraAngleX) + (rotZ - cameraZ) * Math.cos(cameraAngleX);

          // --- 3D to 2D Perspective Divide ---
          const depth = Math.max(1, finalZ + fov);
          const scale3d = fov / depth;
          const px = w / 2 + rotX * scale3d;
          const py = h * 0.62 + finalY * scale3d;

          const intensity = Math.min(1, Math.max(0, -y3d / 72));

          // Map factory operational zone
          let region = 'General Infeed Corridor';
          let kpi1 = 'Flow: 920 cpm';
          let kpi2 = 'Temp: 4.2°C';
          let status = 'Nominal';
          let desc = 'Conveyor buffer accumulator transfer between filling lines.';

          if (d1 < 4.5) {
            region = 'Line 3 Isobaric Filling Zone (M07)';
            kpi1 = appliedPlan ? 'Temp: 4.0°C (Stable)' : 'Temp: 14.8°C (Foam Alert)';
            kpi2 = appliedPlan ? 'Pressure: 4.2 bar' : 'Pressure: 3.85 bar (-0.35 bar)';
            status = appliedPlan ? 'Synchronized' : 'Critical Bottleneck';
            desc = 'M07 Rotary Isobaric Filler: Counter-pressure micro-leak on Valve #7.';
          } else if (d2 < 4.5) {
            region = 'Line 2 Pasteurization & Chilling (M05)';
            kpi1 = 'Chiller Load: 456.2 kW';
            kpi2 = 'Holding Buffer: +25% Capacity';
            status = 'Available';
            desc = 'M05 Tubular Pasteurizer holding tanks available for batch bypass.';
          } else if (r < rows * 0.3) {
            region = 'Infeed Deaeration & Blending (M01-M04)';
            kpi1 = 'Syrup Brix: 12.4°';
            kpi2 = 'Accumulator: 94% Full';
            status = 'Accumulating';
            desc = 'Cold-brew syrup staging buffer and carbonation injection.';
          } else if (r > rows * 0.7) {
            region = 'Downstream Packaging & Dispatch (PACK01/SHIP01)';
            kpi1 = 'Line Pacing: 820 cans/min';
            kpi2 = appliedPlan ? 'Delay: 0.8h (Preserved)' : 'Delay: 5.5h (Walmart Risk)';
            status = appliedPlan ? 'On Track' : 'SLA Jeopardy';
            desc = 'Case packing & cold-chain pallet staging for Walmart Order #8921.';
          }

          rowArr.push({
            c,
            r,
            px,
            py,
            intensity,
            wCoord: w4,
            region,
            telemetry: { kpi1, kpi2, status },
            desc,
          });
        }
        grid.push(rowArr);
      }

      // --- Draw Mesh Wireframe Lines ---
      ctx.lineWidth = 1;

      // 1. Horizontal row curves
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const p1 = grid[r][c];
          const p2 = grid[r][c + 1];

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);

          const avgIntensity = (p1.intensity + p2.intensity) / 2;
          const colRatio = c / cols;

          if (appliedPlan) {
            ctx.strokeStyle = `rgba(0, 240, 118, ${0.15 + avgIntensity * 0.65})`;
          } else if (colRatio < 0.52) {
            // Left Peak: Cyan to Crimson on M07
            ctx.strokeStyle =
              avgIntensity > 0.42
                ? `rgba(255, 42, 95, ${0.35 + avgIntensity * 0.65})`
                : `rgba(0, 210, 255, ${0.12 + avgIntensity * 0.55})`;
          } else {
            // Right Peak: Radiant Amber & Violet
            ctx.strokeStyle =
              avgIntensity > 0.38
                ? `rgba(251, 191, 36, ${0.3 + avgIntensity * 0.6})`
                : `rgba(168, 85, 247, ${0.12 + avgIntensity * 0.5})`;
          }
          ctx.stroke();
        }
      }

      // 2. Vertical depth columns
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 1; r++) {
          const p1 = grid[r][c];
          const p2 = grid[r + 1][c];

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);

          const avgIntensity = (p1.intensity + p2.intensity) / 2;
          const depthFade = 1 - r / rows;

          if (appliedPlan) {
            ctx.strokeStyle = `rgba(0, 240, 118, ${depthFade * (0.12 + avgIntensity * 0.55)})`;
          } else {
            ctx.strokeStyle =
              c / cols < 0.52 && avgIntensity > 0.4
                ? `rgba(255, 42, 95, ${depthFade * (0.25 + avgIntensity * 0.65)})`
                : `rgba(56, 189, 248, ${depthFade * (0.1 + avgIntensity * 0.42)})`;
          }
          ctx.stroke();
        }
      }

      // 3. Draw vertex starlight nodes matching Card 5
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = grid[r][c];
          if (p.intensity > 0.22 || (r % 2 === 0 && c % 2 === 0)) {
            const nodeRadius = isMini ? 1.4 : 1.8 + p.intensity * 1.6;
            ctx.beginPath();
            ctx.arc(p.px, p.py, nodeRadius, 0, Math.PI * 2);

            const colRatio = c / cols;
            if (appliedPlan) {
              ctx.fillStyle = p.intensity > 0.6 ? '#ffffff' : '#00f076';
            } else if (colRatio < 0.52 && p.intensity > 0.4) {
              ctx.fillStyle = p.intensity > 0.6 ? '#ffffff' : '#ff2a5f';
            } else if (colRatio >= 0.52 && p.intensity > 0.38) {
              ctx.fillStyle = p.intensity > 0.6 ? '#ffffff' : '#fbbf24';
            } else {
              ctx.fillStyle = '#00d2ff';
            }

            ctx.shadowBlur = p.intensity > 0.45 ? 8 : 3;
            ctx.shadowColor = ctx.fillStyle;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [appliedPlan, isMini, height]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    mouseRef.current = {
      x: (mx / rect.width) - 0.5,
      y: (my / rect.height) - 0.5,
      active: true,
    };

    // Determine hovered region
    const normX = mx / rect.width;
    const normY = my / rect.height;

    if (normX < 0.5 && normY < 0.6) {
      setHoveredVertex({
        c: 12,
        r: 10,
        px: mx,
        py: my,
        intensity: 0.85,
        wCoord: 12,
        region: 'Line 3 Isobaric Filling Zone (M07)',
        telemetry: {
          kpi1: appliedPlan ? 'Temp: 4.0°C' : 'Temp: 14.8°C (Elevated)',
          kpi2: appliedPlan ? 'Pressure: 4.2 bar' : 'Pressure: 3.85 bar (-0.35 bar)',
          status: appliedPlan ? 'Optimal' : 'Active Anomaly',
        },
        desc: 'Rotary Isobaric Filler Valve #7 counter-pressure micro-leak inducing violent headspace foaming.',
      });
    } else if (normX >= 0.5 && normY < 0.6) {
      setHoveredVertex({
        c: 24,
        r: 12,
        px: mx,
        py: my,
        intensity: 0.78,
        wCoord: -8,
        region: 'Line 2 Pasteurization & Chilling Loop (M05)',
        telemetry: {
          kpi1: 'Thermal Load: 72.0°C / 4.0°C',
          kpi2: 'Holding Capacity: +25% Surplus',
          status: 'Ready',
        },
        desc: 'Tubular pasteurizer buffer tanks able to absorb diverted volume without product degradation.',
      });
    } else {
      setHoveredVertex({
        c: 16,
        r: 20,
        px: mx,
        py: my,
        intensity: 0.45,
        wCoord: 4,
        region: 'Packaging & Warehouse Logistics (SHIP01)',
        telemetry: {
          kpi1: 'Throughput: 820 cans/min',
          kpi2: appliedPlan ? 'SLA Delay: 0.8h (Protected)' : 'SLA Delay: 5.5h (At Risk)',
          status: appliedPlan ? 'Nominal' : 'Delayed',
        },
        desc: 'Walmart Order #8921 cold-chain pallet staging bay.',
      });
    }
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
    setHoveredVertex(null);
  };

  const handleClick = () => {
    if (hoveredVertex) {
      setSelectedVertex(hoveredVertex);
      if (hoveredVertex.region.includes('Line 3')) {
        setFocusedTarget('M07');
        addMessage({
          sender: 'agent',
          text: `[Mesh Focus]: Inspected ${hoveredVertex.region}. ${hoveredVertex.desc} (${hoveredVertex.telemetry.kpi1}, ${hoveredVertex.telemetry.kpi2}).`,
          actions: ['Show affected area', 'Compare scenarios', 'Optimize beverage flow'],
        });
      } else if (hoveredVertex.region.includes('Line 2')) {
        setFocusedTarget('M05');
        addMessage({
          sender: 'agent',
          text: `[Mesh Focus]: Inspected ${hoveredVertex.region}. ${hoveredVertex.desc} (${hoveredVertex.telemetry.kpi2}).`,
          actions: ['Compare scenarios', 'Optimize beverage flow'],
        });
      } else {
        setFocusedTarget('SHIP01');
        addMessage({
          sender: 'agent',
          text: `[Mesh Focus]: Inspected ${hoveredVertex.region}. ${hoveredVertex.desc} (${hoveredVertex.telemetry.kpi2}).`,
          actions: ['Show affected area', 'Compare scenarios'],
        });
      }
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden font-sans select-none">
      {/* Canvas Area */}
      <div className="relative flex-1 w-full min-h-0 bg-[#050813]">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          className="block h-full w-full cursor-crosshair"
        />

        {/* Card Header and Telemetry Stats (only in full view) */}
        {!isMini && (
          <>


            <div className="pointer-events-none absolute top-2.5 right-3 flex items-center space-x-2 text-xs rounded-md border border-slate-800 bg-slate-950/90 px-2.5 py-1 text-slate-300 backdrop-blur font-sans">
              <div>
                <span className="text-slate-400">Nodes: </span>
                <span className="text-cyan-300 font-bold font-mono">1,024</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-700" />
              <div>
                <span className="text-slate-400">Connections: </span>
                <span className="text-cyan-300 font-bold font-mono">3,812</span>
              </div>
              <div className="h-3 w-[1px] bg-slate-700" />
              <div>
                <span className="text-slate-400">Activity: </span>
                <span
                  className={appliedPlan ? 'text-twin-green font-bold' : 'text-cyan-300 font-bold'}
                >
                  {appliedPlan ? 'OPTIMAL' : 'HIGH'}
                </span>
              </div>
            </div>

            <div className="pointer-events-none absolute bottom-2 left-3 text-xs text-slate-300 font-medium">
              Interactive Terrain: Drag cursor to navigate manifold coordinates • Click peak to inspect
            </div>
          </>
        )}
      </div>

      {/* Relatable Operations Output Drawer */}
      {!isMini && (
        <div className="border-t border-slate-800/80 bg-slate-950/95 p-3 shrink-0 font-sans">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    appliedPlan
                      ? 'bg-twin-green'
                      : (hoveredVertex || selectedVertex)?.region.includes('Line 3')
                      ? 'bg-twin-red animate-pulse'
                      : 'bg-cyan-400'
                  }`}
                />
                <h4 className="text-xs font-bold text-white tracking-wide">
                  {(hoveredVertex || selectedVertex)?.region ||
                    'Line 3 Isobaric Filling Zone (M07)'}
                </h4>
                <span className="rounded border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] text-slate-300 font-medium">
                  {(hoveredVertex || selectedVertex)?.telemetry.status || 'Active Bottleneck'}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs">
                <span className="text-slate-300">
                  Parameter 1:{' '}
                  <strong className="text-cyan-300 font-mono">
                    {(hoveredVertex || selectedVertex)?.telemetry.kpi1 ||
                      (appliedPlan ? 'Temp: 4.0°C' : 'Temp: 14.8°C')}
                  </strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-300">
                  Parameter 2:{' '}
                  <strong className="text-amber-300 font-mono">
                    {(hoveredVertex || selectedVertex)?.telemetry.kpi2 ||
                      (appliedPlan ? 'Pressure: 4.2 bar' : 'Pressure: 3.85 bar')}
                  </strong>
                </span>
              </div>
              <p className="text-xs leading-relaxed text-slate-200">
                <strong className="text-cyan-300 font-semibold">Desire Response Result: </strong>
                {(hoveredVertex || selectedVertex)?.desc ||
                  'M07 Rotary Isobaric Filler Valve #7 counter-pressure micro-leak flashing dissolved CO2 into foam. Diverting 20% batch flow to Line 2 normalizes backpressure.'}
              </p>
            </div>
            <button
              onClick={() => {
                const target = (hoveredVertex || selectedVertex)?.region.includes('Line 2')
                  ? 'M05'
                  : (hoveredVertex || selectedVertex)?.region.includes('Packaging')
                  ? 'SHIP01'
                  : 'M07';
                setFocusedTarget(target);
                addMessage({
                  sender: 'agent',
                  text: `[Focus Target]: Synchronized 3D live twin camera with ${(hoveredVertex || selectedVertex)?.region || 'M07'}.`,
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
