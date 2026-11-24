"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import * as THREE from "three";
import { SoilLenzModel, GlbModel, SOILLENZ_HALF_HEIGHT } from "./SoilLenzModel";
import { PhBottleModel, BottleGlbModel } from "./PhBottleModel";

const DEG = Math.PI / 180;
const FLOOR_Y = -SOILLENZ_HALF_HEIGHT - 0.05;

interface SceneProps {
  animate?: boolean;
  compact?: boolean;
  hasSoilGlb?: boolean;
  hasBottleGlb?: boolean;
  modelView?: "both" | "soillenz" | "bottle";
  curatedView?: "front" | "top" | "knob" | "printer" | "auto";
  rotationSpeed?: number;
  isPaused?: boolean;
}

const CURATED_ANGLES = {
  front: { yaw: 24 * DEG, pitch: 8 * DEG },
  top: { yaw: 0 * DEG, pitch: 42 * DEG },
  knob: { yaw: 88 * DEG, pitch: 5 * DEG },
  printer: { yaw: 0 * DEG, pitch: 1 * DEG },
};

const VIEW_KEYS: Array<keyof typeof CURATED_ANGLES> = ["front", "top", "knob", "printer"];

const pointer = { x: 0, y: 0 };

function usePointer() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);
}

function Particles({ count = 260 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const amber = new THREE.Color("#E8B15D");
    const warmAmber = new THREE.Color("#E0A458");
    const blue = new THREE.Color("#6FA898");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 8 - 3;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;

      const r = Math.random();
      const c = r > 0.6 ? amber : r > 0.3 ? warmAmber : blue;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += delta * 0.3;
      if (pos[i * 3 + 1] > 5.5) {
        pos[i * 3 + 1] = -3;
      }
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

function Floor({ floatRef }: { floatRef: React.RefObject<number> }) {
  const shadow = useRef<THREE.Group>(null);
  useFrame(() => {
    if (shadow.current) {
      shadow.current.scale.setScalar(1 - (floatRef.current ?? 0) * 2.2);
    }
  });

  return (
    <group position={[0, FLOOR_Y, 0]}>
      {/* Soft warm amber glow disc on the floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <circleGeometry args={[3.2, 64]} />
        <meshBasicMaterial
          color="#E8B15D"
          transparent
          opacity={0.06}
          toneMapped={false}
        />
      </mesh>

      {/* Turntable guidelines in highlight blue and amber */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[1.75, 1.77, 160]} />
        <meshBasicMaterial
          color="#6FA898"
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[2.3, 2.315, 160]} />
        <meshBasicMaterial
          color="#E8B15D"
          transparent
          opacity={0.16}
          toneMapped={false}
        />
      </mesh>

      {/* Contact Shadow */}
      <group ref={shadow}>
        <ContactShadows
          position={[0, 0.004, 0]}
          opacity={0.75}
          scale={9}
          blur={2.4}
          far={3.5}
          resolution={512}
          color="#0A1236"
        />
      </group>
    </group>
  );
}

function ContinuousRig({
  compact = false,
  hasSoilGlb = false,
  hasBottleGlb = false,
  modelView = "both",
  curatedView = "auto",
  rotationSpeed = 1,
  isPaused = false,
  floatRef,
}: {
  compact?: boolean;
  hasSoilGlb?: boolean;
  hasBottleGlb?: boolean;
  modelView?: "both" | "soillenz" | "bottle";
  curatedView?: "front" | "top" | "knob" | "printer" | "auto";
  rotationSpeed?: number;
  isPaused?: boolean;
  floatRef: React.RefObject<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const device = useRef<THREE.Group>(null);
  const bottle = useRef<THREE.Group>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const currentYaw = useRef(24 * DEG);
  const currentPitch = useRef(8 * DEG);
  const { camera } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);

  const isDragging = useRef(false);
  const previousPointerX = useRef(0);
  const autoTimer = useRef(0);
  const autoIndex = useRef(0);

  // Allow manual drag to spin anywhere on canvas
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      isDragging.current = true;
      previousPointerX.current = e.clientX;
    };
    const onPointerUp = () => {
      isDragging.current = false;
    };
    const onPointerMove = (e: PointerEvent) => {
      if (isDragging.current) {
        const deltaX = e.clientX - previousPointerX.current;
        currentYaw.current += deltaX * 0.008;
        previousPointerX.current = e.clientX;
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);

    // Curated staged showcase: cycles through key views, pausing 1.8-2s at each view
    if (!isPaused && !isDragging.current) {
      if (curatedView === "auto") {
        autoTimer.current += dt * rotationSpeed;
        if (autoTimer.current > 3.0) {
          autoTimer.current = 0;
          autoIndex.current = (autoIndex.current + 1) % VIEW_KEYS.length;
        }
        const activeKey = VIEW_KEYS[autoIndex.current];
        const target = CURATED_ANGLES[activeKey];
        currentYaw.current += (target.yaw - currentYaw.current) * Math.min(1, dt * 2.8);
        currentPitch.current += (target.pitch - currentPitch.current) * Math.min(1, dt * 2.8);
      } else {
        const target = CURATED_ANGLES[curatedView] || CURATED_ANGLES.front;
        currentYaw.current += (target.yaw - currentYaw.current) * Math.min(1, dt * 3.5);
        currentPitch.current += (target.pitch - currentPitch.current) * Math.min(1, dt * 3.5);
      }
    }

    // Cursor tilt reaction
    const tx = -pointer.y * 5 * DEG;
    const ty = pointer.x * 6 * DEG;
    tilt.current.x += (tx - tilt.current.x) * Math.min(1, dt * 4);
    tilt.current.y += (ty - tilt.current.y) * Math.min(1, dt * 4);

    // Breathing float: ±0.035 units
    const float = Math.sin((t * Math.PI * 2) / 4) * 0.035;
    floatRef.current = float;

    if (group.current) {
      group.current.rotation.y = currentYaw.current + tilt.current.y * 0.3;
      group.current.rotation.x = currentPitch.current + tilt.current.x * 0.4;
      group.current.position.y = float;
    }

    if (bottle.current) {
      bottle.current.rotation.y = -currentYaw.current * 0.4;
    }

    // Light sweep highlight moving across body
    if (sweep.current) {
      sweep.current.position.set(
        Math.sin(currentYaw.current) * 3.8,
        1.8,
        Math.cos(currentYaw.current) * 3.8
      );
      sweep.current.intensity = 8 + Math.sin(t * 3) * 3;
    }

    // Camera positioning
    const baseDist = compact ? 9.2 : 7.6;
    const targetCx = compact ? 0 : -1.55;

    camera.position.set(targetCx, 0.4, baseDist);
    look.set(targetCx * 0.5, 0.1, 0);
    camera.lookAt(look);
  });

  const showSoilLenz = modelView === "both" || modelView === "soillenz";
  const showBottle = modelView === "both" || modelView === "bottle";

  return (
    <>
      <pointLight ref={sweep} color="#FFFFFF" intensity={8} distance={8} />

      <group ref={group} position={[0, 0, 0]}>
        {showSoilLenz && (
          <group ref={device} position={showBottle ? [-0.25, 0, 0] : [0, 0, 0]}>
            {hasSoilGlb ? (
              <GlbModel url="/models/soillenz.glb" />
            ) : (
              <SoilLenzModel />
            )}
          </group>
        )}

        {showBottle && (
          <group
            ref={bottle}
            position={showSoilLenz ? [1.6, FLOOR_Y, 0] : [0, FLOOR_Y, 0]}
          >
            {hasBottleGlb ? (
              <BottleGlbModel url="/models/ph-bottle.glb" />
            ) : (
              <PhBottleModel />
            )}
          </group>
        )}
      </group>
    </>
  );
}

export default function Scene(props: SceneProps) {
  usePointer();
  const floatRef = useRef(0);

  return (
    <div className="w-full h-full relative select-none">
      <Canvas
        frameloop="always"
        shadows
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0.4, 7.6], fov: 32 }}
      >
        <ambientLight intensity={0.5} />

        {/* Studio Key Light */}
        <directionalLight
          position={[5, 6, 4]}
          intensity={2.0}
          castShadow
          shadow-mapSize={1024}
          shadow-bias={-0.0001}
        />

        {/* Blue rim light behind-left */}
        <directionalLight
          position={[-6, 2, -4]}
          intensity={3.2}
          color="#6FA898"
        />

        {/* Warm amber accent rim light behind-right */}
        <directionalLight
          position={[6, 1, -4]}
          intensity={1.8}
          color="#E8B15D"
        />

        {/* Ambient floating particles */}
        <Particles count={props.compact ? 120 : 260} />

        {/* Floor & Contact Shadow */}
        <Floor floatRef={floatRef} />

        {/* Studio reflections */}
        <Environment resolution={256} frames={1}>
          <Lightformer form="rect" intensity={3.5} position={[0, 5, 2]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
          <Lightformer form="rect" intensity={1.8} position={[5, 1, 3]} scale={[2, 5, 1]} rotation-y={-Math.PI / 2.5} />
          <Lightformer form="rect" intensity={1.4} position={[-5, 1, 2]} scale={[2, 5, 1]} rotation-y={Math.PI / 2.5} />
          <Lightformer form="ring" color="#6FA898" intensity={1.5} position={[-4, 2, -4]} scale={3} />
        </Environment>

        <ContinuousRig
          compact={props.compact}
          hasSoilGlb={props.hasSoilGlb}
          hasBottleGlb={props.hasBottleGlb}
          modelView={props.modelView ?? "both"}
          curatedView={props.curatedView ?? "auto"}
          rotationSpeed={props.rotationSpeed ?? 1}
          isPaused={props.isPaused ?? false}
          floatRef={floatRef}
        />
      </Canvas>
    </div>
  );
}
