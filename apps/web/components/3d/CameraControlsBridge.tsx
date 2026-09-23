'use client';

import React, { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { cameraActions } from './RotateBallControls';

export const CameraControlsBridge: React.FC = () => {
  const { camera } = useThree();
  const controls = useThree((s) => s.controls as any);

  useEffect(() => {
    // 1. Zoom In: move camera closer to target
    cameraActions.zoomIn = () => {
      if (!controls) return;
      const target = controls.target || new THREE.Vector3(0, 1, 0);
      const offset = new THREE.Vector3().subVectors(camera.position, target);
      const currentDist = offset.length();

      if (currentDist > 4.0) {
        offset.multiplyScalar(0.82); // Move 18% closer
        camera.position.copy(target).add(offset);
        controls.update();
      }
    };

    // 2. Zoom Out: move camera further from target
    cameraActions.zoomOut = () => {
      if (!controls) return;
      const target = controls.target || new THREE.Vector3(0, 1, 0);
      const offset = new THREE.Vector3().subVectors(camera.position, target);
      const currentDist = offset.length();

      if (currentDist < 58.0) {
        offset.multiplyScalar(1.22); // Move 22% further
        camera.position.copy(target).add(offset);
        controls.update();
      }
    };

    // 3. Rotate: spherical orbit around target
    cameraActions.rotate = (deltaTheta: number, deltaPhi: number) => {
      if (!controls) return;
      const target = controls.target || new THREE.Vector3(0, 1, 0);
      const offset = new THREE.Vector3().subVectors(camera.position, target);
      const spherical = new THREE.Spherical().setFromVector3(offset);

      // Horizontal orbit (azimuth)
      spherical.theta += deltaTheta;

      // Vertical tilt (elevation), clamped to prevent flipping upside down or going below floor
      spherical.phi = Math.max(0.12, Math.min(Math.PI / 2 - 0.05, spherical.phi + deltaPhi));

      offset.setFromSpherical(spherical);
      camera.position.copy(target).add(offset);
      camera.lookAt(target);
      controls.update();
    };

    // 4. Reset to isometric overview
    cameraActions.reset = () => {
      if (!controls) return;
      controls.target.set(0, 1, 0);
      camera.position.set(0, 18, 24);
      camera.lookAt(0, 1, 0);
      controls.update();
    };
  }, [camera, controls]);

  return null;
};
