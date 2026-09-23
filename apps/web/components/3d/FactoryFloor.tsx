'use client';

import React from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useTwinStore } from '@/lib/store/twinStore';

export const FactoryFloor: React.FC = () => {
  const appliedPlan = useTwinStore((s) => s.appliedPlan);

  return (
    <group>
      {/* 1. Polished Concrete Industrial Floor Slab with PBR Sheen */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[52, 40]} />
        <meshStandardMaterial
          color="#060b17"
          roughness={0.4}
          metalness={0.6}
          envMapIntensity={0.8}
        />
      </mesh>

      {/* 2. Cyber-Industrial Laser Grid Helper */}
      <gridHelper
        args={[52, 52, '#00d2ff', '#0f172a']}
        position={[0, 0.005, 0]}
      />

      {/* 3. Safety Hazard AGV Walkways (Yellow / Amber Striped Lanes) */}
      {/* Main Longitudinal Transport Arterial */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.5, 0.015, 0]}>
        <planeGeometry args={[1.6, 32]} />
        <meshBasicMaterial color="#eab308" transparent opacity={0.15} />
      </mesh>
      {/* Lateral Feeder Walkways */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.015, -3]}>
        <planeGeometry args={[20, 0.8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.015, 3]}>
        <planeGeometry args={[20, 0.8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.1} />
      </mesh>

      {/* 4. Production Line Zone Pads */}
      {/* Line 1: CSD & Sparkling Seltzers Canning */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.01, -6]}>
        <planeGeometry args={[18, 5.2]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.06} roughness={0.9} />
      </mesh>
      <Text
        position={[-14, 0.03, -8.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.45}
        color="#38bdf8"
      >
        LINE 1 — CSD & SPARKLING SELTZERS CANNING (M01-M03)
      </Text>

      {/* Line 2: Aseptic Juices & Wellness Bottling */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.01, 0]}>
        <planeGeometry args={[18, 5.2]} />
        <meshStandardMaterial color="#0284c7" transparent opacity={0.06} roughness={0.9} />
      </mesh>
      <Text
        position={[-14, 0.03, -2.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.45}
        color="#38bdf8"
      >
        LINE 2 — ASEPTIC JUICES & WELLNESS BOTTLING (M04-M06)
      </Text>

      {/* Line 3: Cold Brew & Kombucha Canning (M07 Isobaric Bottleneck) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-6, 0.01, 6]}>
        <planeGeometry args={[18, 5.2]} />
        <meshStandardMaterial
          color={appliedPlan ? '#00f076' : '#ff2a5f'}
          transparent
          opacity={appliedPlan ? 0.08 : 0.14}
          roughness={0.9}
        />
      </mesh>
      <Text
        position={[-14, 0.03, 3.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.45}
        color={appliedPlan ? '#00f076' : '#ff2a5f'}
      >
        {appliedPlan
          ? 'LINE 3 — BALANCED & CIP SANITIZED [M07-M08]'
          : 'LINE 3 — ISOBARIC FOAMING & PRESSURE CONSTRAINT [M07]'}
      </Text>

      {/* Quality Control & Packaging Bay */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[10, 0.01, 0]}>
        <planeGeometry args={[9.5, 17]} />
        <meshStandardMaterial color="#00f076" transparent opacity={0.06} roughness={0.9} />
      </mesh>
      <Text
        position={[6, 0.03, -8.2]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.45}
        color="#00f076"
      >
        HIGH-SPEED VISION, GAMMA INSPECTION & PACKAGING (QC01-QC02, PACK01)
      </Text>

      {/* 5. Structural Factory Perimeter Columns & Overhead Crane Rails */}
      {[-24, 0, 24].map((x, i) => (
        <group key={`col-${i}`} position={[x, 0, -18]}>
          {/* Steel H-Beam Column */}
          <mesh position={[0, 4, 0]} castShadow>
            <boxGeometry args={[0.6, 8, 0.6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Overhead Crane Rail Gantry */}
          <mesh position={[0, 7.8, 0]}>
            <boxGeometry args={[0.8, 0.4, 0.8]} />
            <meshStandardMaterial color="#eab308" />
          </mesh>
        </group>
      ))}
      {[-24, 0, 24].map((x, i) => (
        <group key={`col-s-${i}`} position={[x, 0, 18]}>
          <mesh position={[0, 4, 0]} castShadow>
            <boxGeometry args={[0.6, 8, 0.6]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
        </group>
      ))}

      {/* Overhead Crane Longitudinal Rails */}
      <mesh position={[0, 7.8, -18]}>
        <boxGeometry args={[52, 0.3, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
      <mesh position={[0, 7.8, 18]}>
        <boxGeometry args={[52, 0.3, 0.4]} />
        <meshStandardMaterial color="#334155" metalness={0.9} />
      </mesh>
    </group>
  );
};
