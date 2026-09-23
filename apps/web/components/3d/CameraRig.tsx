'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/store/twinStore';

export const CameraRig: React.FC = () => {
  const { camera } = useThree();
  const focusedTarget = useTwinStore((s) => s.focusedTarget);
  const machines = useTwinStore((s) => s.machines);
  const isUserInteracting = useTwinStore((s) => s.isUserInteracting);

  const targetLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const targetCamPos = useRef(new THREE.Vector3(0, 18, 24));
  const currentLookAt = useRef(new THREE.Vector3(0, 1, 0));
  const isTransitioning = useRef(false);
  const transitionProgress = useRef(1); // 1 = transition complete
  const prevFocusedTarget = useRef<string | null>(null);

  // When focusedTarget changes, smoothly transition camera to frame the target
  useEffect(() => {
    if (focusedTarget !== prevFocusedTarget.current) {
      prevFocusedTarget.current = focusedTarget;

      if (focusedTarget) {
        if (focusedTarget === 'top') {
          targetLookAt.current.set(0, 0, 0);
          targetCamPos.current.set(0, 36, 0.01);
        } else if (focusedTarget === 'front') {
          targetLookAt.current.set(0, 2, 0);
          targetCamPos.current.set(0, 5, 28);
        } else if (focusedTarget === 'iso') {
          targetLookAt.current.set(0, 1, 0);
          targetCamPos.current.set(18, 20, 24);
        } else if (focusedTarget === 'L3') {
          targetLookAt.current.set(-4, 1.2, 6);
          targetCamPos.current.set(-4, 6, 16);
        } else {
          const targetMachine = machines.find((m) => m.id === focusedTarget);
          if (targetMachine) {
            const [tx, ty, tz] = targetMachine.position_3d;
            // Offset slightly to the left so the machine and its right neighbor (e.g. M08) appear in the open right viewport area
            targetLookAt.current.set(tx + 1.2, ty + 1.0, tz);
            targetCamPos.current.set(tx + 4.0, ty + 6.0, tz + 9.5);
          }
        }
        isTransitioning.current = true;
        transitionProgress.current = 0;
      } else {
        targetLookAt.current.set(0, 1, 0);
        targetCamPos.current.set(0, 18, 24);
        isTransitioning.current = true;
        transitionProgress.current = 0;
      }
    }
  }, [focusedTarget, machines]);

  useFrame((_, delta) => {
    // If user is actively dragging, zooming, or orbiting with mouse, cancel automated transition immediately
    if (isUserInteracting) {
      isTransitioning.current = false;
      transitionProgress.current = 1;
      return;
    }

    // Only move the camera if an intentional focus transition is occurring
    if (isTransitioning.current && transitionProgress.current < 1) {
      transitionProgress.current += delta * 2.0; // ~0.5s smooth transition

      if (transitionProgress.current >= 1) {
        transitionProgress.current = 1;
        isTransitioning.current = false;
        // Final position
        camera.position.copy(targetCamPos.current);
        camera.lookAt(targetLookAt.current);
      } else {
        // Smooth ease-out cubic
        const t = Math.min(1, transitionProgress.current);
        const ease = 1 - Math.pow(1 - t, 3);
        camera.position.lerp(targetCamPos.current, ease * 0.18);
        currentLookAt.current.lerp(targetLookAt.current, ease * 0.22);
        camera.lookAt(currentLookAt.current);
      }
    }
    // When not transitioning, do NOT touch camera position or lookAt!
    // This allows OrbitControls to have 100% full, uninterrupted control of zoom and 360-degree rotation!
  });

  return null;
};
