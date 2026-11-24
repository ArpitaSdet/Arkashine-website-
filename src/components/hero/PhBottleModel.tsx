"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

export const BOTTLE_HEIGHT = 1.35;

export function PhBottleModel() {
  // Real ArkaShine pH/EC Device Materials matching user photo:
  // 1. Glossy white top dome with ArkaShine blue lettering
  const whiteDomeMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#FFFFFF",
        roughness: 0.22,
        metalness: 0.05,
      }),
    []
  );

  // 2. High-gloss black lower cylindrical body
  const blackBodyMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0F1215",
        roughness: 0.15,
        metalness: 0.2,
      }),
    []
  );

  // 3. Clear electrode probe housing on side
  const probeGlassMat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#FFFFFF",
        roughness: 0.1,
        transparent: true,
        opacity: 0.5,
        clearcoat: 1,
      }),
    []
  );

  // 4. Black cable & connector
  const cableMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#18181B",
        roughness: 0.5,
      }),
    []
  );

  useEffect(() => {
    return () => {
      for (const m of [whiteDomeMat, blackBodyMat, probeGlassMat, cableMat]) m.dispose();
    };
  }, [whiteDomeMat, blackBodyMat, probeGlassMat, cableMat]);

  return (
    <group dispose={null} scale={0.72} position={[0, -0.15, 0]}>
      {/* Lower Glossy Black Cylinder Body */}
      <mesh material={blackBodyMat} position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.82, 36]} />
      </mesh>

      {/* Center Dividing Bezel Ring */}
      <mesh material={blackBodyMat} position={[0, 0.84, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 0.04, 36]} />
      </mesh>

      {/* Upper Glossy White Cylinder */}
      <mesh material={whiteDomeMat} position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.58, 36]} />
      </mesh>

      {/* Rounded Dome Top */}
      <mesh material={whiteDomeMat} position={[0, 1.44, 0]}>
        <sphereGeometry args={[0.34, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Side Electrochemical Sensor Probe (Attached on Left) */}
      <group position={[-0.42, 0.55, 0]}>
        {/* Sensor Body Tube */}
        <mesh material={probeGlassMat} position={[0, 0, 0]}>
          <cylinderGeometry args={[0.075, 0.075, 0.72, 20]} />
        </mesh>
        {/* Sensor Cap Collar */}
        <mesh material={cableMat} position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.12, 20]} />
        </mesh>
        {/* Cable running up */}
        <mesh material={cableMat} position={[0.04, 0.65, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.4, 12]} />
        </mesh>
      </group>
    </group>
  );
}

export function BottleGlbModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
