"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { SoilLenzModel } from "@/components/hero/SoilLenzModel";

interface StageProps {
  curatedAngle?: string;
  isPaused?: boolean;
}

// Camera Rig that smoothly animates camera position & focal point when views pop up
function CleanCameraRig({ curatedAngle = "hero" }: { curatedAngle?: string }) {
  const { camera, mouse } = useThree();
  const currentPos = useRef(new THREE.Vector3(0.0, 0.05, 5.8));
  const currentLookAt = useRef(new THREE.Vector3(0, -0.05, 0));

  useFrame((_, delta) => {
    const targetPos = new THREE.Vector3(0.0, 0.05, 5.8);
    const targetLookAt = new THREE.Vector3(0, -0.05, 0);

    // Subtle gentle mouse parallax (+/- 0.06 max)
    const px = mouse.x * 0.06;
    const py = mouse.y * 0.04;

    if (curatedAngle === "top") {
      targetPos.set(0, 3.0, 4.2);
      targetLookAt.set(0, 0.0, 0);
    } else if (curatedAngle === "back") {
      targetPos.set(0, 0.1, 5.8);
      targetLookAt.set(0, 0, 0);
    } else if (curatedAngle === "knob") {
      targetPos.set(-0.8, 0.1, 5.2);
      targetLookAt.set(0.2, 0, 0);
    } else if (curatedAngle === "printer" || curatedAngle === "front") {
      targetPos.set(0, -0.05, 5.0);
      targetLookAt.set(0, -0.15, 0);
    } else {
      targetPos.x += px;
      targetPos.y += py;
    }

    currentPos.current.lerp(targetPos, Math.min(1, delta * 3.8));
    currentLookAt.current.lerp(targetLookAt, Math.min(1, delta * 3.8));

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

// Centered SoiLenz 2.0 unit, proportioned so "SoiLenz 2.0" text is 100% visible above it
function ProductGroup({ curatedAngle = "hero" }: { curatedAngle?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  // Default Hero pose: Y ~22 degrees, slight X tilt forward ~8 degrees
  const targetRotation = useRef(new THREE.Euler(0.12, 0.38, 0));
  const targetPos = useRef(new THREE.Vector3(0, -0.22, 0));

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Organic gentle breathing float
    const floatY = Math.sin(state.clock.elapsedTime * 1.6) * 0.02;
    const mouseX = state.mouse.x * 0.08;
    const mouseY = state.mouse.y * 0.05;

    if (curatedAngle === "top") {
      targetRotation.current.set(0.7 - mouseY * 0.4, 0.05 + mouseX, 0);
      targetPos.current.set(0, -0.3 + floatY, 0);
    } else if (curatedAngle === "back") {
      targetRotation.current.set(0.08 - mouseY * 0.3, Math.PI + mouseX * 0.5, 0);
      targetPos.current.set(0, -0.22 + floatY, 0);
    } else if (curatedAngle === "knob") {
      targetRotation.current.set(0.1 - mouseY * 0.3, Math.PI * 0.45 + mouseX * 0.4, 0);
      targetPos.current.set(0.1, -0.22 + floatY, 0);
    } else if (curatedAngle === "printer" || curatedAngle === "front") {
      targetRotation.current.set(0.05 - mouseY * 0.2, 0 + mouseX * 0.2, 0);
      targetPos.current.set(0, -0.22 + floatY, 0);
    } else {
      // Default Hero 3/4 angle
      targetRotation.current.set(0.12 - mouseY * 0.25, 0.38 + mouseX * 0.35, 0);
      targetPos.current.set(0, -0.22 + floatY, 0);
    }

    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x,
      Math.min(1, delta * 3.8)
    );
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y,
      Math.min(1, delta * 3.8)
    );
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      targetRotation.current.z,
      Math.min(1, delta * 3.8)
    );

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetPos.current.x,
      Math.min(1, delta * 3.8)
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetPos.current.y,
      Math.min(1, delta * 3.8)
    );
  });

  return (
    <group ref={groupRef} scale={0.88} position={[0, -0.22, 0]}>
      {/* Closed SoiLenz 2.0 unit */}
      <SoilLenzModel />

      {/* Soft ground contact shadow */}
      <ContactShadows
        position={[0, -0.72, 0]}
        opacity={0.55}
        scale={7.5}
        blur={2.4}
        far={2.0}
        color="#000000"
      />
    </group>
  );
}

export function ProductCanvas({
  curatedAngle = "hero",
}: StageProps) {
  return (
    <div className="w-full h-full relative pointer-events-auto">
      <Canvas
        camera={{ position: [0.0, 0.05, 5.8], fov: 32 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} color="#FFFFFF" />
        <directionalLight position={[4, 6, 4]} intensity={2.6} color="#FFFFFF" castShadow />
        <directionalLight position={[-4, 4, -3]} intensity={1.2} color="#F1F5F9" />
        <directionalLight position={[0, 4, -4]} intensity={0.9} color="#E2E8F0" />
        <directionalLight position={[-4, -2, 2]} intensity={0.6} color="#FFFFFF" />

        {/* Studio Environment for reflections on the glossy lid */}
        <Environment preset="studio" />

        <CleanCameraRig curatedAngle={curatedAngle} />
        <ProductGroup curatedAngle={curatedAngle} />
      </Canvas>
    </div>
  );
}

export { ProductCanvas as ContinuousWorldCanvas };
export default ProductCanvas;
