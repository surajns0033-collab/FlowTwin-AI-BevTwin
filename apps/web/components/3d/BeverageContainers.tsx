'use client';

import React from 'react';
import * as THREE from 'three';

interface ContainerProps {
  itemColor?: string;
  isFoaming?: boolean;
  scale?: number;
}

/**
 * Highly Realistic 330ml Aluminum Beverage Can (Sleek Profile)
 * Authentic beverage packaging engineering:
 * 1. Concave bottom chime (beveled aluminum base)
 * 2. Metallic lacquer coated body with printed brand sleeve wrap & pinstripes
 * 3. Double-tapered neck-in
 * 4. Rolled double-seam chime lip
 * 5. Countersunk lid end plate
 * 6. B64 stay-on pull tab mechanism with center rivet boss and finger loop
 * 7. Optional frothing foam head (for Valve #7 anomaly)
 */
export const RealisticCan: React.FC<ContainerProps> = ({
  itemColor = '#be123c',
  isFoaming = false,
  scale = 1.0,
}) => {
  // Label color tuning
  const isLine3 = itemColor.includes('ff2a5f') || itemColor.includes('be123c');
  const isLine1 = itemColor.includes('00d2ff') || itemColor.includes('0284c7');
  const sleeveColor = isLine3 ? '#881337' : isLine1 ? '#0369a1' : '#065f46';

  return (
    <group scale={scale}>
      {/* 1. Bottom Chime & Inverted Concave Base */}
      <mesh position={[0, 0.015, 0]} castShadow>
        <cylinderGeometry args={[0.115, 0.098, 0.03, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.96} roughness={0.15} />
      </mesh>

      {/* 2. Main Can Body (Metallic Beverage Lacquer) */}
      <mesh position={[0, 0.145, 0]} castShadow>
        <cylinderGeometry args={[0.115, 0.115, 0.23, 24]} />
        <meshStandardMaterial
          color={itemColor}
          metalness={0.88}
          roughness={0.2}
          envMapIntensity={1.3}
        />
      </mesh>

      {/* 3. Printed Wrap-Around Label Sleeve */}
      <group position={[0, 0.145, 0]}>
        {/* Sleeve Background */}
        <mesh>
          <cylinderGeometry args={[0.1158, 0.1158, 0.148, 24]} />
          <meshStandardMaterial color={sleeveColor} roughness={0.32} metalness={0.4} />
        </mesh>

        {/* Crisp Top & Bottom Silver Foil Pinstripes */}
        <mesh position={[0, 0.072, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.116, 0.0025, 6, 24]} />
          <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.08} />
        </mesh>
        <mesh position={[0, -0.072, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.116, 0.0025, 6, 24]} />
          <meshStandardMaterial color="#ffffff" metalness={0.95} roughness={0.08} />
        </mesh>

        {/* Front Brand Emblem Plate */}
        <mesh position={[0, 0, 0.1165]}>
          <boxGeometry args={[0.08, 0.065, 0.003]} />
          <meshStandardMaterial color="#ffffff" roughness={0.15} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0, 0.1182]}>
          <boxGeometry args={[0.065, 0.045, 0.002]} />
          <meshStandardMaterial color={itemColor} roughness={0.25} metalness={0.6} />
        </mesh>
      </group>

      {/* 4. Upper Taper (Neck-in Cone) */}
      <mesh position={[0, 0.275, 0]}>
        <cylinderGeometry args={[0.098, 0.115, 0.03, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.96} roughness={0.14} />
      </mesh>

      {/* 5. Rolled Double-Seam Chime Lip */}
      <mesh position={[0, 0.295, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.097, 0.006, 8, 24]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.99} roughness={0.08} />
      </mesh>

      {/* 6. Countersunk Lid End Plate */}
      <mesh position={[0, 0.292, 0]}>
        <cylinderGeometry args={[0.095, 0.095, 0.004, 24]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.18} />
      </mesh>

      {/* 7. B64 Stay-On Pull Tab Mechanism */}
      <group position={[0, 0.296, 0]}>
        {/* Center Rivet Boss */}
        <mesh position={[0, 0.003, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.006, 12]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.98} roughness={0.1} />
        </mesh>
        {/* Pull-Tab Lever Plate */}
        <mesh position={[0, 0.003, 0.024]}>
          <boxGeometry args={[0.036, 0.0035, 0.058]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.98} roughness={0.15} />
        </mesh>
        {/* Finger Ring Hole */}
        <mesh position={[0, 0.004, 0.036]}>
          <cylinderGeometry args={[0.011, 0.011, 0.005, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.4} />
        </mesh>
        {/* Scored Mouth Opening Aperture */}
        <mesh position={[0, 0.001, -0.03]}>
          <cylinderGeometry args={[0.028, 0.028, 0.002, 16]} />
          <meshStandardMaterial color="#64748b" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>

      {/* 8. Foaming Anomaly (Turbulent Micro-Bubbles from Valve #7 Leak) */}
      {isFoaming && (
        <group position={[0, 0.31, 0]}>
          <mesh position={[0, 0.03, 0]}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshStandardMaterial
              color="#fff7ed"
              roughness={0.8}
              transparent
              opacity={0.88}
              emissive="#fed7aa"
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[0.03, 0.05, 0.02]}>
            <sphereGeometry args={[0.035, 10, 10]} />
            <meshStandardMaterial color="#ffffff" roughness={0.7} transparent opacity={0.9} />
          </mesh>
          <mesh position={[-0.03, 0.04, -0.02]}>
            <sphereGeometry args={[0.032, 10, 10]} />
            <meshStandardMaterial color="#ffffff" roughness={0.7} transparent opacity={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
};

/**
 * Highly Realistic 500ml Contoured PET / Glass Beverage Bottle
 * Authentic bottling line engineering:
 * 1. Chamfered petaloid base
 * 2. Rich translucent liquid core inside (85% fill with visible air headspace)
 * 3. Clear transparent PET plastic shell with specular glass reflections
 * 4. Ergonomic grip waist indentation
 * 5. High-gloss wrap-around branded label sleeve
 * 6. Tapered neck with molded conveyor support collar ring (flange)
 * 7. Tamper-evident safety ring & knurled closure cap
 */
export const RealisticBottle: React.FC<ContainerProps> = ({
  itemColor = '#d97706',
  scale = 1.0,
}) => {
  return (
    <group scale={scale}>
      {/* 1. Beverage Liquid Core Inside (Filled to 85% line with headspace) */}
      <group position={[0, 0, 0]}>
        {/* Lower Liquid Volume */}
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.092, 0.092, 0.14, 20]} />
          <meshStandardMaterial
            color={itemColor}
            transparent
            opacity={0.88}
            roughness={0.12}
            metalness={0.15}
          />
        </mesh>
        {/* Waist Liquid Volume */}
        <mesh position={[0, 0.175, 0]}>
          <cylinderGeometry args={[0.084, 0.092, 0.03, 20]} />
          <meshStandardMaterial
            color={itemColor}
            transparent
            opacity={0.88}
            roughness={0.12}
          />
        </mesh>
        {/* Shoulder Liquid Volume */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.045, 0.084, 0.06, 20]} />
          <meshStandardMaterial
            color={itemColor}
            transparent
            opacity={0.88}
            roughness={0.12}
          />
        </mesh>
        {/* Liquid Surface Meniscus */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.003, 16]} />
          <meshStandardMaterial color={itemColor} roughness={0.1} />
        </mesh>
      </group>

      {/* 2. Clear Translucent PET Bottle Shell (Outer Container) */}
      <group>
        {/* Base with chamfered rim */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.098, 0.088, 0.04, 24]} />
          <meshStandardMaterial
            color="#f0f9ff"
            transparent
            opacity={0.42}
            roughness={0.06}
            metalness={0.18}
          />
        </mesh>
        {/* Lower Body Cylinder */}
        <mesh position={[0, 0.095, 0]} castShadow>
          <cylinderGeometry args={[0.098, 0.098, 0.11, 24]} />
          <meshStandardMaterial
            color="#f0f9ff"
            transparent
            opacity={0.42}
            roughness={0.06}
            metalness={0.18}
          />
        </mesh>
        {/* Ergonomic Waist Contour Inward */}
        <mesh position={[0, 0.165, 0]}>
          <cylinderGeometry args={[0.090, 0.098, 0.03, 24]} />
          <meshStandardMaterial
            color="#f0f9ff"
            transparent
            opacity={0.42}
            roughness={0.06}
            metalness={0.18}
          />
        </mesh>
        {/* Upper Body Flaring Outward */}
        <mesh position={[0, 0.195, 0]}>
          <cylinderGeometry args={[0.098, 0.090, 0.03, 24]} />
          <meshStandardMaterial
            color="#f0f9ff"
            transparent
            opacity={0.42}
            roughness={0.06}
            metalness={0.18}
          />
        </mesh>
        {/* Tapered Parabolic Shoulder */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.042, 0.098, 0.08, 24]} />
          <meshStandardMaterial
            color="#f0f9ff"
            transparent
            opacity={0.42}
            roughness={0.06}
            metalness={0.18}
          />
        </mesh>
        {/* Slender Cylindrical Neck */}
        <mesh position={[0, 0.315, 0]}>
          <cylinderGeometry args={[0.038, 0.042, 0.05, 20]} />
          <meshStandardMaterial
            color="#f0f9ff"
            transparent
            opacity={0.48}
            roughness={0.06}
            metalness={0.18}
          />
        </mesh>
      </group>

      {/* 3. Printed Wrap-Around Label Sleeve (Center Graphic Band) */}
      <group position={[0, 0.095, 0]}>
        <mesh>
          <cylinderGeometry args={[0.0995, 0.0995, 0.085, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.3} metalness={0.05} />
        </mesh>
        {/* Contrasting Brand Color Block */}
        <mesh position={[0, 0, 0.0998]}>
          <boxGeometry args={[0.075, 0.06, 0.003]} />
          <meshStandardMaterial color={itemColor} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0.1018]}>
          <boxGeometry args={[0.05, 0.035, 0.002]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} />
        </mesh>
      </group>

      {/* 4. Molded Neck Support Collar Flange (Conveyor Gripper Ring) */}
      <mesh position={[0, 0.33, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.043, 0.005, 8, 20]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.65} roughness={0.2} />
      </mesh>

      {/* 5. Tamper-Evident Safety Ring Band */}
      <mesh position={[0, 0.345, 0]}>
        <cylinderGeometry args={[0.044, 0.044, 0.01, 20]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.25} />
      </mesh>

      {/* 6. Knurled Polypropylene Closure Cap */}
      <group position={[0, 0.362, 0]}>
        <mesh>
          <cylinderGeometry args={[0.046, 0.046, 0.024, 24]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.25} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.013, 0]}>
          <cylinderGeometry args={[0.042, 0.046, 0.004, 24]} />
          <meshStandardMaterial color="#2563eb" roughness={0.2} />
        </mesh>
      </group>
    </group>
  );
};
