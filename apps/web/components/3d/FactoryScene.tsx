'use client';

import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { ContactShadows, OrbitControls } from '@react-three/drei';
import { useTwinStore } from '@/lib/store/twinStore';
import { MachineMesh } from './MachineMesh';
import { Conveyor } from './Conveyor';
import { FactoryFloor } from './FactoryFloor';
import { CameraRig } from './CameraRig';
import { CameraControlsBridge } from './CameraControlsBridge';
import { RotateBallControls } from './RotateBallControls';
import { MachineDetailCard } from './MachineDetailCard';
import { CausalRibbon } from '@/components/particles/CausalRibbon';

export const FactoryScene: React.FC<{ isMini?: boolean; onExpand?: () => void }> = ({
  isMini = false,
  onExpand,
}) => {
  const machines = useTwinStore((s) => s.machines);
  const setFocusedTarget = useTwinStore((s) => s.setFocusedTarget);
  const selectedMachineId = useTwinStore((s) => s.selectedMachineId);
  const setSelectedMachineId = useTwinStore((s) => s.setSelectedMachineId);
  const setIsUserInteracting = useTwinStore((s) => s.setIsUserInteracting);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div
      onClick={isMini ? onExpand : undefined}
      className={`relative h-full w-full overflow-hidden rounded-xl border border-twin-panelBorder bg-[#050811] shadow-2xl ${
        isMini ? 'cursor-pointer hover:border-cyan-400/80 transition-colors group' : ''
      }`}
    >
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 18, 24], fov: 42 }}
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onPointerMissed={() => {
          setFocusedTarget(null);
          setSelectedMachineId(null);
        }}
      >
        <color attach="background" args={['#050811']} />
        <fog attach="fog" args={['#050811', 25, 65]} />

        {/* Studio Industrial Lighting Setup */}
        <ambientLight intensity={0.65} color="#c7d2fe" />
        <directionalLight
          position={[16, 28, 16]}
          intensity={1.4}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0001}
          shadow-radius={4}
        />
        {/* Fill Lights from High-Bay Fixtures */}
        <pointLight position={[-14, 15, -6]} intensity={0.9} color="#38bdf8" distance={22} />
        <pointLight position={[-14, 15, 6]} intensity={0.9} color="#ff2a5f" distance={22} />
        <pointLight position={[12, 15, 0]} intensity={0.9} color="#00f076" distance={22} />

        <Suspense fallback={null}>
          <CameraRig />
          <CameraControlsBridge />
          <FactoryFloor />
          <ContactShadows
            position={[0, 0.02, 0]}
            opacity={0.7}
            scale={45}
            blur={2.0}
            far={8}
            resolution={512}
            color="#000000"
          />

          {/* Machine Entities with cursor interactions */}
          {machines.map((m) => (
            <group
              key={m.id}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredNode(m.id);
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                setHoveredNode(null);
                document.body.style.cursor = 'auto';
              }}
            >
              <MachineMesh machine={m} />
            </group>
          ))}

          {/* Line 1 CSD & Seltzer Cans (M01 Blending -> M02 Carbonator -> M03 Rinser -> QC01) */}
          <Conveyor start={[-10.4, 0, -6]} end={[-7.6, 0, -6]} speed={1.2} itemColor="#00d2ff" isBottles={false} />
          <Conveyor start={[-4.4, 0, -6]} end={[-1.6, 0, -6]} speed={1.2} itemColor="#00d2ff" isBottles={false} />
          <Conveyor start={[1.6, 0, -6]} end={[4.4, 0, -2]} speed={1.2} itemColor="#00d2ff" isBottles={false} />

          {/* Line 2 Aseptic Juice & Tea Bottles (M04 Homogenizer -> M05 Pasteurizer -> M06 Rinser -> QC02) */}
          <Conveyor start={[-10.4, 0, 0]} end={[-7.6, 0, 0]} speed={1.0} itemColor="#f59e0b" isBottles={true} />
          <Conveyor start={[-4.4, 0, 0]} end={[-1.6, 0, 0]} speed={1.0} itemColor="#f59e0b" isBottles={true} />
          <Conveyor start={[1.6, 0, 0]} end={[4.4, 0, 3]} speed={1.0} itemColor="#f59e0b" isBottles={true} />

          {/* Line 3 Cold Brew & Kombucha Cans (M07 Rotary Filler -> M08 Seamer -> QC01) */}
          <Conveyor start={[-8.4, 0, 6]} end={[-5.6, 0, 6]} speed={0.7} itemColor="#ff2a5f" isBottles={false} />
          <Conveyor start={[-2.4, 0, 6]} end={[4.4, 0, -1.5]} speed={0.7} itemColor="#ff2a5f" isBottles={false} />

          {/* Downstream Packaging Conveyors (QC -> PACK01 Palletizer) */}
          <Conveyor start={[7.6, 0, -2]} end={[10.4, 0, 0]} speed={1.4} itemColor="#00f076" isBottles={false} />
          <Conveyor start={[7.6, 0, 3]} end={[10.4, 0, 0]} speed={1.4} itemColor="#00f076" isBottles={true} />

          {/* Smooth, Unconstrained Orbit Controls with unrestricted 360° rotation and responsive zoom */}
          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.08}
            maxPolarAngle={Math.PI / 2 - 0.02}
            minDistance={3}
            maxDistance={60}
            rotateSpeed={0.85}
            zoomSpeed={1.25}
            panSpeed={0.85}
            enablePan={true}
            enableZoom={true}
            onStart={() => setIsUserInteracting(true)}
            onEnd={() => setIsUserInteracting(false)}
          />
        </Suspense>
      </Canvas>

      {/* Interactive Machine Inspector HUD */}
      {/* Conditional Overlays based on isMini */}
      {isMini ? (
        <div className="absolute inset-0 z-30 flex flex-col justify-between p-2.5 bg-slate-950/40 group-hover:bg-slate-950/15 pointer-events-none transition-all">
          <div className="flex items-center justify-between pointer-events-auto">
            <span className="flex items-center space-x-1.5 rounded bg-slate-950/90 px-2 py-0.5 text-[10px] font-mono text-cyan-300 border border-cyan-500/40 shadow">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>3D LIVE TWIN</span>
            </span>
            <button
              onClick={onExpand}
              className="rounded bg-cyan-500/20 border border-cyan-500/50 px-2 py-0.5 text-[10px] font-mono text-cyan-300 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all font-bold flex items-center gap-1 shadow"
            >
              <span>⤢ Expand to Main View</span>
            </button>
          </div>
          <div className="pointer-events-none text-center font-mono text-[10px] text-slate-300 bg-slate-950/80 rounded py-1 border border-slate-800/80 backdrop-blur shadow">
            Click anywhere to swap 3D Twin to primary viewport
          </div>
        </div>
      ) : (
        <>
          <MachineDetailCard />

          {/* 3D Viewport Top HUD Overlays */}
          <div className="pointer-events-none absolute top-3 left-3 right-3 flex items-center justify-between font-sans z-20">
            <div className="flex items-center space-x-2 pointer-events-auto">
              <span className="flex items-center space-x-2 rounded-lg border border-cyan-500/40 bg-slate-950/85 px-3 py-1.5 text-xs font-semibold text-cyan-300 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>3D LIVE TWIN • GIGAFACTORY ALPHA</span>
              </span>
              {selectedMachineId && (
                <span className="flex items-center space-x-1.5 rounded-lg border border-cyan-500/50 bg-cyan-950/85 px-3 py-1.5 text-xs font-bold text-cyan-200 backdrop-blur">
                  <span>FOCUSED: {selectedMachineId}</span>
                </span>
              )}
            </div>

            {/* Causal Propagation Ribbon on Top Right */}
            <div className="pointer-events-auto hidden md:flex items-center">
              <CausalRibbon />
            </div>
          </div>

          {/* Interactive Camera Angle Toolbar */}
          <div className="absolute bottom-3 right-3 z-30 flex items-center space-x-1 rounded-xl border border-cyan-500/40 bg-slate-950/90 p-1.5 text-xs font-sans font-medium backdrop-blur-md shadow-2xl">
            <button
              onClick={() => {
                setSelectedMachineId(null);
                setFocusedTarget('iso');
              }}
              className="rounded-lg px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
              title="Isometric Perspective View"
            >
              Isometric
            </button>
            <button
              onClick={() => {
                setSelectedMachineId(null);
                setFocusedTarget('top');
              }}
              className="rounded-lg px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
              title="Direct Top Overhead Blueprint View"
            >
              Top 90°
            </button>
            <button
              onClick={() => {
                setSelectedMachineId(null);
                setFocusedTarget('front');
              }}
              className="rounded-lg px-3 py-1.5 text-slate-300 hover:bg-slate-800 hover:text-cyan-300 transition-colors"
              title="Front Elevation View"
            >
              Front
            </button>
            <button
              onClick={() => {
                setSelectedMachineId('M07');
                setFocusedTarget('L3');
              }}
              className="rounded-lg px-3 py-1.5 text-cyan-200 bg-cyan-950/70 border border-cyan-500/50 hover:bg-cyan-900/80 hover:text-white transition-colors font-bold"
              title="Line 3 Canning Focus (M07/M08)"
            >
              Line 3 Focus
            </button>
            <button
              onClick={() => {
                setSelectedMachineId(null);
                setFocusedTarget(null);
              }}
              className="rounded-lg px-3 py-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              title="Reset Camera to Wide Overview"
            >
              Reset View
            </button>
          </div>

          {/* Rotate Ball & Zoom Controls (Bottom Left Corner) */}
          <div className="absolute bottom-3 left-3 z-30 pointer-events-auto">
            <RotateBallControls />
          </div>

          {hoveredNode && !selectedMachineId && (
            <div className="pointer-events-none absolute top-14 left-3 z-30 flex items-center space-x-2 rounded-xl border border-cyan-500/50 bg-slate-950/95 px-3.5 py-2 text-xs font-sans text-white shadow-2xl backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-400 font-bold">{hoveredNode}:</span>
              <span className="text-slate-100 font-medium">
                {machines.find((m) => m.id === hoveredNode)?.name}
              </span>
              <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-xs text-cyan-300 font-semibold border border-cyan-500/30">
                Click to inspect
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};
