'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Plus, Minus, RotateCw, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import { useTwinStore } from '@/lib/store/twinStore';
import * as THREE from 'three';

// Shared global bridge for camera operations
export const cameraActions = {
  zoomIn: () => {},
  zoomOut: () => {},
  rotate: (_deltaTheta: number, _deltaPhi: number) => {},
  reset: () => {},
};

export const RotateBallControls: React.FC = () => {
  const setIsUserInteracting = useTwinStore((s) => s.setIsUserInteracting);
  const setFocusedTarget = useTwinStore((s) => s.setFocusedTarget);
  const setSelectedMachineId = useTwinStore((s) => s.setSelectedMachineId);

  const ballRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const [pivotOffset, setPivotOffset] = useState({ x: 0, y: 0 });

  // Pointer drag on trackball
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setIsUserInteracting(true);
    setFocusedTarget(null);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.stopPropagation();

    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    // Move visual pivot dot inside ball
    const rect = ballRef.current?.getBoundingClientRect();
    if (rect) {
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const ox = Math.max(-18, Math.min(18, e.clientX - centerX));
      const oy = Math.max(-18, Math.min(18, e.clientY - centerY));
      setPivotOffset({ x: ox, y: oy });
    }

    // Sensitivity for smooth orbiting
    const sensitivity = 0.015;
    cameraActions.rotate(-dx * sensitivity, dy * sensitivity);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;
    e.stopPropagation();
    isDragging.current = false;
    setPivotOffset({ x: 0, y: 0 });
    setIsUserInteracting(false);
  };

  // Step rotation helper
  const handleStepRotate = (dir: 'left' | 'right' | 'up' | 'down') => {
    setIsUserInteracting(true);
    setFocusedTarget(null);
    const stepTheta = Math.PI / 14; // ~12.8 deg
    const stepPhi = Math.PI / 18;

    if (dir === 'left') cameraActions.rotate(-stepTheta, 0);
    else if (dir === 'right') cameraActions.rotate(stepTheta, 0);
    else if (dir === 'up') cameraActions.rotate(0, -stepPhi);
    else if (dir === 'down') cameraActions.rotate(0, stepPhi);

    setTimeout(() => setIsUserInteracting(false), 200);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    setIsUserInteracting(true);
    cameraActions.zoomIn();
    setTimeout(() => setIsUserInteracting(false), 200);
  };

  const handleZoomOut = () => {
    setIsUserInteracting(true);
    cameraActions.zoomOut();
    setTimeout(() => setIsUserInteracting(false), 200);
  };

  const handleReset = () => {
    setSelectedMachineId(null);
    setFocusedTarget(null);
    cameraActions.reset();
  };

  return (
    <div className="flex items-center space-x-2.5 rounded-xl border border-cyan-500/40 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-md select-none font-sans">
      {/* 1. Trackball / Rotate Ball Sphere */}
      <div className="flex flex-col items-center">
        <div className="relative flex items-center justify-center">
          {/* Compass & Quick Direction Buttons around the sphere */}
          <button
            onClick={() => handleStepRotate('up')}
            className="absolute -top-1.5 z-20 h-4 w-6 rounded bg-slate-900/90 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 flex items-center justify-center transition-colors shadow"
            title="Tilt Up"
          >
            <ChevronUp className="h-3 w-3" />
          </button>

          <button
            onClick={() => handleStepRotate('down')}
            className="absolute -bottom-1.5 z-20 h-4 w-6 rounded bg-slate-900/90 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 flex items-center justify-center transition-colors shadow"
            title="Tilt Down"
          >
            <ChevronDown className="h-3 w-3" />
          </button>

          <button
            onClick={() => handleStepRotate('left')}
            className="absolute -left-1.5 z-20 h-6 w-4 rounded bg-slate-900/90 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 flex items-center justify-center transition-colors shadow"
            title="Rotate Left"
          >
            <ChevronLeft className="h-3 w-3" />
          </button>

          <button
            onClick={() => handleStepRotate('right')}
            className="absolute -right-1.5 z-20 h-6 w-4 rounded bg-slate-900/90 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-500/40 flex items-center justify-center transition-colors shadow"
            title="Rotate Right"
          >
            <ChevronRight className="h-3 w-3" />
          </button>

          {/* Interactive Sphere Surface */}
          <div
            ref={ballRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="relative h-14 w-14 rounded-full border-2 border-cyan-400/80 cursor-grab active:cursor-grabbing shadow-[inset_0_0_15px_rgba(0,210,255,0.4),0_0_12px_rgba(0,210,255,0.3)] overflow-hidden flex items-center justify-center transition-transform active:scale-95"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, rgba(0,210,255,0.35) 0%, rgba(15,23,42,0.95) 60%, rgba(5,8,17,1) 100%)',
            }}
            title="Drag in any direction to rotate 3D view 360°"
          >
            {/* Gimbal crosshair rings */}
            <div className="pointer-events-none absolute inset-1.5 rounded-full border border-cyan-500/30 border-dashed" />
            <div className="pointer-events-none absolute h-full w-[1px] bg-cyan-400/30" />
            <div className="pointer-events-none absolute h-[1px] w-full bg-cyan-400/30" />

            {/* Glowing Pivot Indicator that moves with mouse drag */}
            <div
              className="pointer-events-none h-3 w-3 rounded-full bg-cyan-300 shadow-[0_0_8px_#00d2ff] transition-transform duration-75"
              style={{
                transform: `translate(${pivotOffset.x}px, ${pivotOffset.y}px)`,
              }}
            />
          </div>
        </div>

        <span className="mt-1 text-[9px] text-cyan-300 uppercase font-bold tracking-wider font-sans">
          ROTATE
        </span>
      </div>

      {/* Divider */}
      <div className="h-14 w-[1px] bg-slate-800" />

      {/* 2. Zoom Controls (+ and -) */}
      <div className="flex flex-col items-center space-y-1">
        <button
          onClick={handleZoomIn}
          className="flex h-6 w-7 items-center justify-center rounded-md border border-cyan-500/50 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors active:scale-90 shadow"
          title="Zoom In (+)"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>

        <button
          onClick={handleZoomOut}
          className="flex h-6 w-7 items-center justify-center rounded-md border border-cyan-500/50 bg-cyan-950/60 text-cyan-300 hover:bg-cyan-500 hover:text-slate-950 transition-colors active:scale-90 shadow"
          title="Zoom Out (-)"
        >
          <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
        </button>

        <span className="text-[9px] text-slate-300 uppercase font-bold font-sans">
          ZOOM
        </span>
      </div>

      {/* Divider */}
      <div className="h-14 w-[1px] bg-slate-800" />

      {/* 3. Reset / Fit button */}
      <button
        onClick={handleReset}
        className="flex flex-col items-center justify-center h-14 w-8 rounded-lg border border-slate-800 bg-slate-900/60 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors p-1"
        title="Reset Camera View"
      >
        <Maximize className="h-3.5 w-3.5 mb-1" />
        <span className="text-[9px] font-bold uppercase leading-none font-sans">FIT</span>
      </button>
    </div>
  );
};
