"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";

// pH/EC Bottle: clear cylinder, amber liquid, white collar, blue push-button cap. Origin at the bottle's base.

export const BOTTLE_HEIGHT = 1.05;

export function ProceduralBottle() {
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#eaf3ff",
        roughness: 0.05,
        metalness: 0,
        transparent: true,
        opacity: 0.32,
        clearcoat: 1,
        clearcoatRoughness: 0.05,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [],
  );
  const amber = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#c98a2b", roughness: 0.15, transparent: true, opacity: 0.88, clearcoat: 0.6 }), []);
  const collar = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f5f6f7", roughness: 0.35 }), []);
  const cap = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#1d5fe0", roughness: 0.25, clearcoat: 0.8 }), []);
  useEffect(
    () => () => {
      for (const m of [glass, amber, collar, cap]) m.dispose();
    },
    [glass, amber, collar, cap],
  );

  return (
    <group dispose={null}>
      {/* base ring */}
      <mesh position={[0, 0.025, 0]} material={collar} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.05, 48]} />
      </mesh>
      {/* amber liquid */}
      <mesh position={[0, 0.28, 0]} material={amber}>
        <cylinderGeometry args={[0.205, 0.205, 0.46, 48]} />
      </mesh>
      {/* inner tube */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.62, 24]} />
        <meshStandardMaterial color="#d9dee3" roughness={0.3} transparent opacity={0.7} />
      </mesh>
      {/* glass */}
      <mesh position={[0, 0.39, 0]} material={glass}>
        <cylinderGeometry args={[0.22, 0.22, 0.72, 48, 1, true]} />
      </mesh>
      {/* white collar */}
      <mesh position={[0, 0.8, 0]} material={collar} castShadow>
        <cylinderGeometry args={[0.235, 0.235, 0.16, 48]} />
      </mesh>
      {/* blue push-button cap */}
      <mesh position={[0, 0.93, 0]} material={cap} castShadow>
        <cylinderGeometry args={[0.2, 0.225, 0.1, 48]} />
      </mesh>
      <mesh position={[0, 1.0, 0]} material={cap}>
        <cylinderGeometry args={[0.09, 0.1, 0.05, 32]} />
      </mesh>
    </group>
  );
}
