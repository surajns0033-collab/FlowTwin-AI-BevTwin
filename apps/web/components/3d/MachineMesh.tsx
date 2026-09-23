'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { Machine } from '@/lib/types';
import { useTwinStore } from '@/lib/store/twinStore';
import { RealisticCan, RealisticBottle } from './BeverageContainers';

interface MachineMeshProps {
  machine: Machine;
}

export const MachineMesh: React.FC<MachineMeshProps> = ({ machine }) => {
  const groupRef = useRef<THREE.Group>(null);
  const carouselRef = useRef<THREE.Group>(null);
  const agitatorRef = useRef<THREE.Mesh>(null);
  const qcLaserRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);

  const selectedMachineId = useTwinStore((s) => s.selectedMachineId);
  const setSelectedMachineId = useTwinStore((s) => s.setSelectedMachineId);
  const focusedTarget = useTwinStore((s) => s.focusedTarget);
  const setFocusedTarget = useTwinStore((s) => s.setFocusedTarget);
  const activeCausalChain = useTwinStore((s) => s.activeCausalChain);
  const appliedPlan = useTwinStore((s) => s.appliedPlan);

  const isSelected = selectedMachineId === machine.id;
  const isFocused = focusedTarget === machine.id;
  const isInCausalChain = activeCausalChain.includes(machine.id);

  // Machine Roles in Beverage Bottling / Canning
  const isFiller = machine.id === 'M07';
  const isTank = machine.id === 'M01';
  const isCarbonator = machine.id === 'M02';
  const isRinser = machine.id === 'M03' || machine.id === 'M06';
  const isHomogenizer = machine.id === 'M04';
  const isPasteurizer = machine.id === 'M05';
  const isSeamer = machine.id === 'M08';
  const isQC = machine.id.startsWith('QC');
  const isPack = machine.id.startsWith('PACK');

  // Status Colors
  let statusColor = '#00f076'; // nominal green
  let statusEmissive = 1.0;
  if (machine.status === 'critical_warning' && !appliedPlan) {
    statusColor = '#ff2a5f'; // critical red
    statusEmissive = 2.8;
  } else if (machine.status === 'constrained' && !appliedPlan) {
    statusColor = '#ffb703'; // constrained amber
    statusEmissive = 2.0;
  } else if (appliedPlan) {
    statusColor = '#00f076';
    statusEmissive = 1.2;
  }

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // Subtle highlight bobbing when focused or in causal chain
    if (groupRef.current && (isFocused || isInCausalChain)) {
      groupRef.current.position.y = machine.position_3d[1] + Math.sin(t * 3.5) * 0.04;
    }

    // Rotating 64-valve filler carousel
    if (carouselRef.current && machine.status !== 'offline') {
      const speed = machine.status === 'critical_warning' && !appliedPlan ? 0.8 : 2.2;
      carouselRef.current.rotation.y += delta * speed;
    }

    // High-shear agitator impeller for syrup blending tank M01
    if (agitatorRef.current) {
      agitatorRef.current.rotation.y += delta * 6.0;
    }

    // QC Laser scanning sweep
    if (qcLaserRef.current) {
      qcLaserRef.current.position.z = Math.sin(t * 2.8) * 0.65;
    }

    // Dynamic rotation for holographic selection target reticle
    if (ringRef.current && (isSelected || isFocused || isHovered)) {
      ringRef.current.rotation.z += delta * 0.75;
    }
  });

  return (
    <group
      ref={groupRef}
      position={machine.position_3d}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedMachineId(machine.id);
        setFocusedTarget(machine.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setIsHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setIsHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
      {/* 1. Sanitary Machine Base / Pedestal with Bevel */}
      <mesh position={[0, 0.12, 0]} receiveShadow>
        <boxGeometry args={[3.2, 0.24, 2.8]} />
        <meshStandardMaterial color="#090d16" metalness={0.8} roughness={0.4} />
      </mesh>

      {/* Perimeter Safety Zone Decal around machine */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 3.2]} />
        <meshBasicMaterial
          color={isSelected || isFocused ? '#00d2ff' : isHovered ? '#38bdf8' : statusColor}
          wireframe
          transparent
          opacity={isSelected || isFocused ? 0.75 : isHovered ? 0.5 : 0.18}
        />
      </mesh>

      {/* Modern Highlight Feature (Clean Rotating Floor Reticle & Focused Overhead Spotlight) */}
      {(isSelected || isFocused || isHovered) && (
        <group position={[0, 0.03, 0]}>
          <pointLight
            position={[0, 4.0, 0]}
            color={isSelected || isFocused ? '#00d2ff' : '#38bdf8'}
            intensity={isSelected || isFocused ? 3.0 : 1.2}
            distance={6.5}
          />
          <group ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
            <mesh>
              <ringGeometry args={[2.0, 2.08, 48]} />
              <meshBasicMaterial
                color={isSelected || isFocused ? '#00d2ff' : '#38bdf8'}
                transparent
                opacity={isSelected || isFocused ? 0.85 : 0.45}
                side={THREE.DoubleSide}
              />
            </mesh>
            <mesh>
              <ringGeometry args={[1.5, 1.55, 36]} />
              <meshBasicMaterial
                color={isSelected || isFocused ? '#00d2ff' : '#38bdf8'}
                transparent
                opacity={isSelected || isFocused ? 0.6 : 0.25}
                side={THREE.DoubleSide}
              />
            </mesh>
          </group>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[2.2, 32]} />
            <meshBasicMaterial
              color={isSelected || isFocused ? '#00d2ff' : '#38bdf8'}
              transparent
              opacity={isSelected || isFocused ? 0.12 : 0.04}
            />
          </mesh>
        </group>
      )}

      {/* ======================================================== */}
      {/* 2. SPECIALIZED BEVERAGE MACHINE ARCHITECTURES           */}
      {/* ======================================================== */}

      {/* BEVERAGE TYPE 1: ROTARY ISOBARIC COUNTER-PRESSURE FILLER (M07 - HERO BOTTLENECK) */}
      {isFiller && (
        <group>
          {/* Stainless Steel Sanitary Base Plinth */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <cylinderGeometry args={[1.45, 1.55, 0.8, 32]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.9}
              roughness={0.2}
              emissive={isSelected || isFocused ? '#00d2ff' : '#000000'}
              emissiveIntensity={isSelected || isFocused ? 0.2 : 0}
            />
          </mesh>

          {/* Transparent Polycarbonate Hygiene Enclosure Glass */}
          <mesh position={[0, 1.65, 0]}>
            <cylinderGeometry args={[1.42, 1.42, 1.3, 32, 1, true]} />
            <meshStandardMaterial
              color="#38bdf8"
              transparent
              opacity={0.25}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>

          {/* Rotating 64-Head Isobaric Carousel & Distribution Bowl */}
          <group ref={carouselRef} position={[0, 1.55, 0]}>
            {/* Central Liquid Bowl */}
            <mesh position={[0, 0.25, 0]}>
              <cylinderGeometry args={[1.0, 1.0, 0.35, 24]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
            </mesh>
            {/* Stainless Valves & Realistic Cans array */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((val, idx) => {
              const angle = (idx / 8) * Math.PI * 2;
              const vx = Math.cos(angle) * 1.15;
              const vz = Math.sin(angle) * 1.15;
              const isValve7Fault = idx === 7 && machine.status === 'critical_warning' && !appliedPlan;

              return (
                <group key={idx} position={[vx, 0, vz]}>
                  {/* Valve Dispense Nozzle */}
                  <mesh position={[0, 0.08, 0]}>
                    <cylinderGeometry args={[0.035, 0.02, 0.2, 12]} />
                    <meshStandardMaterial
                      color={isValve7Fault ? '#ff2a5f' : '#f8fafc'}
                      metalness={0.95}
                      roughness={0.1}
                    />
                  </mesh>

                  {/* Can Lift Pedestal Plate */}
                  <mesh position={[0, -0.36, 0]}>
                    <cylinderGeometry args={[0.13, 0.13, 0.03, 16]} />
                    <meshStandardMaterial color="#64748b" metalness={0.88} />
                  </mesh>

                  {/* Realistic Aluminum Can in Filling Position */}
                  <group position={[0, -0.34, 0]}>
                    <RealisticCan
                      itemColor="#ff2a5f"
                      isFoaming={isValve7Fault}
                      scale={0.9}
                    />
                  </group>
                </group>
              );
            })}
          </group>

          {/* Top Sanitary CIP Dome & Header Manifold */}
          <mesh position={[0, 2.45, 0]}>
            <cylinderGeometry args={[1.35, 1.45, 0.3, 32]} />
            <meshStandardMaterial color="#334155" metalness={0.85} />
          </mesh>
          <mesh position={[0, 2.75, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.35, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>

          {/* Internal Chamber Fill Glow (Red when foaming/leaking, green when nominal) */}
          <pointLight
            position={[0, 1.6, 0]}
            color={statusColor}
            intensity={machine.status === 'critical_warning' ? 3.5 : 1.2}
            distance={3.2}
          />
        </group>
      )}

      {/* BEVERAGE TYPE 2: CONTINUOUS SYRUP & FLAVOR BLENDING TANK (M01) */}
      {isTank && (
        <group>
          {/* Cylindrical 316L Sanitary Mixing Tank */}
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[1.1, 1.1, 2.1, 32]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={0.92}
              roughness={0.15}
              emissive={isSelected || isFocused ? '#00d2ff' : '#000000'}
              emissiveIntensity={isSelected || isFocused ? 0.2 : 0}
            />
          </mesh>
          {/* Top Sanitary Dished Head */}
          <mesh position={[0, 2.5, 0]}>
            <sphereGeometry args={[1.1, 24, 12, 0, Math.PI * 2, 0, Math.PI / 4]} />
            <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Electric Agitator Motor on Top */}
          <group position={[0, 2.85, 0]}>
            <mesh ref={agitatorRef}>
              <cylinderGeometry args={[0.22, 0.22, 0.45, 16]} />
              <meshStandardMaterial color="#0284c7" metalness={0.8} />
            </mesh>
          </group>
          {/* Sight Glass Tube on front */}
          <mesh position={[0, 1.35, 1.12]}>
            <cylinderGeometry args={[0.03, 0.03, 1.4, 12]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.6} />
          </mesh>
        </group>
      )}

      {/* BEVERAGE TYPE 3: CHILLED ISOBARIC CO2 CARBONATOR (M02) */}
      {isCarbonator && (
        <group>
          {/* Dual Pressurized CO2 Saturation Columns */}
          <mesh position={[-0.55, 1.45, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 2.2, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          <mesh position={[0.55, 1.45, 0]} castShadow>
            <cylinderGeometry args={[0.45, 0.45, 2.2, 24]} />
            <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Cryogenic Insulated Pipe Connection */}
          <mesh position={[0, 2.3, 0]}>
            <boxGeometry args={[1.3, 0.12, 0.12]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.95} />
          </mesh>
          {/* Digital Pressure Indicator Panel */}
          <mesh position={[0, 1.6, 0.65]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[0.45, 0.35, 0.08]} />
            <meshStandardMaterial color="#0284c7" />
          </mesh>
        </group>
      )}

      {/* BEVERAGE TYPE 4: TUBULAR UHT FLASH PASTEURIZER & HEAT EXCHANGER (M05) */}
      {isPasteurizer && (
        <group>
          {/* Multi-Pass Stainless Tube Bundle Rack */}
          <mesh position={[0, 1.35, 0]} castShadow>
            <boxGeometry args={[2.5, 1.8, 1.6]} />
            <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Horizontal Stainless Heat Pipes visible on front */}
          {[-0.5, -0.15, 0.2, 0.55].map((y, idx) => (
            <mesh key={idx} position={[0, 1.35 + y, 0.82]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.08, 0.08, 2.3, 16]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.1} />
            </mesh>
          ))}
          {/* Steam Modulating Valve Loop */}
          <mesh position={[1.1, 2.4, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.35, 16]} />
            <meshStandardMaterial color="#ff2a5f" metalness={0.8} />
          </mesh>
        </group>
      )}

      {/* BEVERAGE TYPE 5: ROTARY CAN SEAMER & N2 DOSING (M08) */}
      {isSeamer && (
        <group>
          {/* Sanitary Stainless Enclosure */}
          <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.5, 1.9, 2.0]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.88}
              roughness={0.25}
              emissive={isSelected || isFocused ? '#00d2ff' : '#000000'}
              emissiveIntensity={isSelected || isFocused ? 0.2 : 0}
            />
          </mesh>
          {/* Viewing Window */}
          <mesh position={[0, 1.25, 1.02]}>
            <planeGeometry args={[1.5, 0.85]} />
            <meshStandardMaterial color="#38bdf8" transparent opacity={0.3} />
          </mesh>
          {/* Liquid Nitrogen Dosing Lance (vacuum insulated tube) */}
          <mesh position={[-0.9, 1.8, 0.8]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.035, 0.035, 0.6, 12]} />
            <meshStandardMaterial color="#e0e7ff" metalness={0.95} roughness={0.05} />
          </mesh>
          {/* 6-Head Seaming Rotary Turret */}
          <mesh position={[0, 1.4, 0.1]}>
            <cylinderGeometry args={[0.4, 0.4, 0.25, 16]} />
            <meshStandardMaterial color="#64748b" metalness={0.95} />
          </mesh>
        </group>
      )}

      {/* BEVERAGE TYPE 6: RINSERS & STERILIZATION TUNNELS (M03, M06) & HOMOGENIZER (M04) */}
      {(isRinser || isHomogenizer) && (
        <group>
          <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.6, 1.85, 2.0]} />
            <meshStandardMaterial
              color="#1e293b"
              metalness={0.85}
              roughness={0.3}
              emissive={isSelected || isFocused ? '#00d2ff' : '#000000'}
              emissiveIntensity={isSelected || isFocused ? 0.2 : 0}
            />
          </mesh>
          {/* Stainless Roof & HEPA Vent */}
          <mesh position={[0, 2.15, 0]}>
            <boxGeometry args={[2.2, 0.2, 1.7]} />
            <meshStandardMaterial color="#334155" metalness={0.8} />
          </mesh>
          <mesh position={[0, 2.32, 0]}>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
            <meshStandardMaterial color="#475569" metalness={0.7} />
          </mesh>
        </group>
      )}

      {/* BEVERAGE TYPE 7: HIGH-SPEED OPTICAL & GAMMA INSPECTION BAY (QC01, QC02) */}
      {isQC && (
        <group>
          {/* Stainless Gantry Arch Frame */}
          <mesh position={[-1.2, 1.3, 0]} castShadow>
            <boxGeometry args={[0.22, 2.3, 0.25]} />
            <meshStandardMaterial color="#0284c7" metalness={0.85} />
          </mesh>
          <mesh position={[1.2, 1.3, 0]} castShadow>
            <boxGeometry args={[0.22, 2.3, 0.25]} />
            <meshStandardMaterial color="#0284c7" metalness={0.85} />
          </mesh>
          <mesh position={[0, 2.35, 0]} castShadow>
            <boxGeometry args={[2.62, 0.22, 0.3]} />
            <meshStandardMaterial color="#0369a1" metalness={0.9} />
          </mesh>
          {/* High-Speed Line-Scan Inspection Head */}
          <mesh position={[0, 2.1, 0]}>
            <cylinderGeometry args={[0.2, 0.16, 0.4, 16]} />
            <meshStandardMaterial color="#0f172a" metalness={0.95} />
          </mesh>
          {/* Sweeping Laser Fill-Height Level Line */}
          <mesh ref={qcLaserRef} position={[0, 1.0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[2.0, 0.06]} />
            <meshBasicMaterial color="#00f076" transparent opacity={0.85} />
          </mesh>
          <pointLight position={[0, 1.1, 0]} color="#00f076" intensity={2.0} distance={2.5} />
        </group>
      )}

      {/* BEVERAGE TYPE 8: SLEEVE LABELER, SHRINK TUNNEL & ROBOTIC PALLETIZER (PACK01) */}
      {isPack && (
        <group>
          {/* Continuous Steam Shrink Sleeve Tunnel */}
          <mesh position={[0, 1.25, 0]} castShadow receiveShadow>
            <boxGeometry args={[2.9, 2.0, 2.3]} />
            <meshStandardMaterial color="#1e1b4b" metalness={0.85} roughness={0.25} />
          </mesh>
          {/* Top Exhaust Canopy */}
          <mesh position={[0, 2.25, 0]}>
            <boxGeometry args={[2.5, 0.25, 1.9]} />
            <meshStandardMaterial color="#312e81" metalness={0.8} />
          </mesh>
          {/* Tray Infeed Discharge Guides */}
          <mesh position={[-0.7, 1.2, 1.16]}>
            <cylinderGeometry args={[0.1, 0.1, 0.8, 12]} />
            <meshStandardMaterial color="#e0e7ff" metalness={0.95} />
          </mesh>
          <mesh position={[0.7, 1.2, 1.16]}>
            <cylinderGeometry args={[0.1, 0.1, 0.8, 12]} />
            <meshStandardMaterial color="#e0e7ff" metalness={0.95} />
          </mesh>
        </group>
      )}

      {/* 3. Status Signal Tower (Tri-Color Stack Light) */}
      <group position={[1.15, 2.65, 0.85]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.5, 8]} />
          <meshStandardMaterial color="#475569" metalness={0.9} />
        </mesh>
        <mesh position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial
            color={statusColor}
            emissive={statusColor}
            emissiveIntensity={statusEmissive}
          />
        </mesh>
        <pointLight
          color={statusColor}
          intensity={isInCausalChain || isFocused ? 3.0 : 1.2}
          distance={3.0}
        />
      </group>

      {/* 4. 3D Floating Equipment Label & HUD (Always faces camera with Billboard) */}
      <Billboard position={[0, 3.4, 0]} follow={true} lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.44}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.035}
          outlineColor="#020617"
        >
          {machine.id}
        </Text>

        <group position={[0, -0.38, 0]}>
          <mesh position={[0, 0, -0.02]}>
            <planeGeometry args={[1.6, 0.28]} />
            <meshBasicMaterial
              color={machine.status === 'critical_warning' && !appliedPlan ? '#450a0a' : '#020617'}
              transparent
              opacity={0.92}
            />
          </mesh>
          <Text
            position={[0, 0, 0]}
            fontSize={0.16}
            color={statusColor}
            anchorX="center"
            anchorY="middle"
          >
            {`${machine.temperature_c}°C • ${Math.round(machine.utilization * 100)}%`}
          </Text>
        </group>
      </Billboard>
    </group>
  );
};
