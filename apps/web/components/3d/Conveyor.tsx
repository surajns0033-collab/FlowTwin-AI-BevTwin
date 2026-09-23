'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { RealisticCan, RealisticBottle } from './BeverageContainers';

interface ConveyorProps {
  start: [number, number, number];
  end: [number, number, number];
  speed?: number;
  itemColor?: string;
  isBottles?: boolean;
}

export const Conveyor: React.FC<ConveyorProps> = ({
  start,
  end,
  speed = 1.3,
  itemColor = '#00d2ff',
  isBottles = false,
}) => {
  const itemsRef = useRef<THREE.Group>(null);

  const startV = new THREE.Vector3(...start);
  const endV = new THREE.Vector3(...end);
  const dir = new THREE.Vector3().subVectors(endV, startV);
  const length = dir.length();
  const midPoint = new THREE.Vector3().addVectors(startV, endV).multiplyScalar(0.5);

  useFrame((state) => {
    if (!itemsRef.current) return;
    const numItems = itemsRef.current.children.length;
    itemsRef.current.children.forEach((child, index) => {
      const progress = (state.clock.elapsedTime * speed * 0.22 + index / numItems) % 1;
      child.position.lerpVectors(startV, endV, progress);
      // Place base of can/bottle directly on top of the conveyor slat chain (y = 0.24)
      child.position.y += 0.24;
    });
  });

  return (
    <group>
      {/* 1. Sanitary Stainless Steel Conveyor Bed (Table-Top Slat Chain) */}
      <mesh position={[midPoint.x, 0.18, midPoint.z]} castShadow receiveShadow>
        <boxGeometry args={[length, 0.1, 0.55]} />
        <meshStandardMaterial color="#1e293b" metalness={0.92} roughness={0.18} />
      </mesh>

      {/* Center Stainless Slat Chain Track */}
      <mesh position={[midPoint.x, 0.232, midPoint.z]}>
        <boxGeometry args={[length, 0.015, 0.38]} />
        <meshStandardMaterial color="#475569" metalness={0.96} roughness={0.1} />
      </mesh>

      {/* 2. Low-Friction Stainless Steel Side Guide Rails */}
      <mesh position={[midPoint.x, 0.35, midPoint.z + 0.26]}>
        <boxGeometry args={[length, 0.035, 0.02]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
      </mesh>
      <mesh position={[midPoint.x, 0.35, midPoint.z - 0.26]}>
        <boxGeometry args={[length, 0.035, 0.02]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.1} />
      </mesh>

      {/* 3. Sanitary Support Stanchion Tripods to Floor */}
      <mesh position={[startV.x + (endV.x - startV.x) * 0.3, 0.09, midPoint.z]}>
        <cylinderGeometry args={[0.03, 0.03, 0.18, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.88} />
      </mesh>
      <mesh position={[startV.x + (endV.x - startV.x) * 0.7, 0.09, midPoint.z]}>
        <cylinderGeometry args={[0.03, 0.03, 0.18, 12]} />
        <meshStandardMaterial color="#475569" metalness={0.88} />
      </mesh>

      {/* 4. IP69K Waterproof Sanitary Drive Motor */}
      <mesh position={[startV.x + 0.15, 0.2, midPoint.z + 0.34]}>
        <cylinderGeometry args={[0.09, 0.09, 0.2, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.85} />
      </mesh>

      {/* 5. High-Speed Moving Realistic Beverage Cans & Bottles */}
      <group ref={itemsRef}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <group key={i}>
            {!isBottles ? (
              <RealisticCan itemColor={itemColor} />
            ) : (
              <RealisticBottle itemColor={itemColor} />
            )}
          </group>
        ))}
      </group>
    </group>
  );
};
