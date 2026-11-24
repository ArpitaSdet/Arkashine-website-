"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, PresentationControls } from "@react-three/drei";
import type { MotionValue } from "motion/react";
import * as THREE from "three";
import { GlbModel, ProceduralSoilLenz, SOILLENZ_HALF_HEIGHT } from "./soillenz-model";
import { ProceduralBottle } from "./bottle-model";
import { bottleAt, clamp01, easeOutBack, glowAt, lerp, paperAt, poseAt } from "./timeline";

const DEG = Math.PI / 180;
const FLOOR_Y = -SOILLENZ_HALF_HEIGHT - 0.02;
const BASE_DIST = 7.8;

export type StageMode = "scroll" | "auto";

type SceneProps = {
  /** Spring-smoothed scroll progress of the pinned section (scroll mode). */
  progress: MotionValue<number>;
  /** 0 → 1 once on load: bottle docks then paper prints (auto mode). */
  intro: MotionValue<number>;
  mode: StageMode;
  animate: boolean;
  compact: boolean;
  hasSoilGlb: boolean;
  hasBottleGlb: boolean;
};

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

function Floor({ floatRef }: { floatRef: React.RefObject<number> }) {
  const shadow = useRef<THREE.Group>(null);
  useFrame(() => {
    // Shadow tightens as the device floats up and spreads as it comes down.
    if (shadow.current) shadow.current.scale.setScalar(1 - (floatRef.current ?? 0) * 2.5);
  });
  return (
    <group position={[0, FLOOR_Y, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
        <ringGeometry args={[1.6, 1.612, 160]} />
        <meshBasicMaterial color="#0a1236" transparent opacity={0.12} toneMapped={false} />
      </mesh>
      <group ref={shadow}>
        <ContactShadows position={[0, 0.004, 0]} opacity={0.55} scale={7} blur={2.2} far={3} resolution={512} color="#0a1236" />
      </group>
    </group>
  );
}

function Rig({ progress, intro, mode, animate, compact, hasSoilGlb, hasBottleGlb, floatRef }: SceneProps & { floatRef: React.RefObject<number> }) {
  const device = useRef<THREE.Group>(null);
  const bottle = useRef<THREE.Group>(null);
  const bottleRing = useRef<THREE.Mesh>(null);
  const sweep = useRef<THREE.PointLight>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const auto = useRef(0);
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const bottleX = compact ? 1.5 : 1.85;

  // Progress-driven values the model reads each frame.
  const getPaper = () => (mode === "scroll" ? paperAt(progress.get()) : clamp01(intro.get() * 2 - 1));
  const getGlow = () => (mode === "scroll" ? glowAt(progress.get()) : 0);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const dt = Math.min(delta, 0.05);
    const p = progress.get();
    const pose = poseAt(mode === "scroll" ? p : 0);

    // Cursor tilt (5–8°), eased.
    const tx = animate ? -pointer.y * 6 * DEG : 0;
    const ty = animate ? pointer.x * 8 * DEG : 0;
    tilt.current.x += (tx - tilt.current.x) * Math.min(1, dt * 4);
    tilt.current.y += (ty - tilt.current.y) * Math.min(1, dt * 4);

    if (mode === "auto" && animate) auto.current += dt * 0.35;

    // Breathing float: ±0.03 units over ~4 s.
    const float = animate ? Math.sin((t * Math.PI * 2) / 4) * 0.03 : 0;
    floatRef.current = float;

    if (device.current) {
      const lift = Math.max(0, (pose.rx - 10 * DEG) / (35 * DEG)) * 0.15;
      device.current.rotation.set(pose.rx + tilt.current.x, pose.ry + auto.current + tilt.current.y, pose.rz);
      device.current.position.y = float + lift;
    }

    // Bottle: flies in from the right spinning like a coin, lands with a spring bounce.
    const b = mode === "scroll" ? bottleAt(p) : clamp01(intro.get() * 2);
    if (bottle.current) {
      bottle.current.visible = b > 0;
      const land = easeOutBack(b, 1.6);
      bottle.current.position.set(lerp(6.5, bottleX, land), FLOOR_Y + Math.sin(b * Math.PI) * 0.6 + float * 0.6, 0.35);
      bottle.current.rotation.y = (1 - b) * (1 - b) * Math.PI * 14;
    }
    if (bottleRing.current) {
      // Ring pulse right after landing: expands and fades.
      const phase = mode === "scroll" ? clamp01((p - 0.765) / 0.06) : clamp01((intro.get() - 0.45) / 0.25);
      const on = phase > 0 && phase < 1;
      bottleRing.current.visible = on;
      bottleRing.current.scale.setScalar(1 + phase * 1.8);
      (bottleRing.current.material as THREE.MeshBasicMaterial).opacity = on ? (1 - phase) * 0.9 : 0;
    }

    // Light sweep: a bright point light glides across the body during each turn.
    if (sweep.current) {
      const s = mode === "scroll" ? pose.t : (t * 0.25) % 1;
      sweep.current.position.set(lerp(-2.6, 2.6, s), 0.9, 2.3);
      sweep.current.intensity = (mode === "scroll" ? pose.turning : Math.sin(s * Math.PI)) * 22;
    }

    // Camera: distance per pose, fitted so the docked bottle always stays in frame.
    const aspect = size.width / Math.max(1, size.height);
    const need = bottleX + 0.6 + (compact ? 0 : Math.abs(pose.cx));
    const fit = Math.max(1, need / (BASE_DIST * Math.tan(15 * DEG) * aspect));
    const dist = BASE_DIST * pose.dist * fit;
    const cx = compact ? 0 : pose.cx;
    camera.position.set(cx, 0.55 * pose.dist + 0.25, dist);
    look.set(cx, compact ? 0.15 : 0.3, 0);
    camera.lookAt(look);
  });

  return (
    <>
      <pointLight ref={sweep} color="#ffffff" distance={6} decay={1.4} intensity={0} />
      <PresentationControls global={false} cursor snap speed={1.4} polar={[-0.25, 0.25]} azimuth={[-Infinity, Infinity]}>
        <group ref={device}>
          <Suspense fallback={null}>
            {hasSoilGlb ? <GlbModel path="/models/soillenz.glb" /> : <ProceduralSoilLenz getPaper={getPaper} getGlow={getGlow} />}
          </Suspense>
        </group>
      </PresentationControls>
      <group ref={bottle} visible={false}>
        <Suspense fallback={null}>{hasBottleGlb ? <GlbModel path="/models/ph-bottle.glb" /> : <ProceduralBottle />}</Suspense>
      </group>
      <mesh ref={bottleRing} rotation={[-Math.PI / 2, 0, 0]} position={[bottleX, FLOOR_Y + 0.01, 0.35]}>
        <ringGeometry args={[0.32, 0.345, 64]} />
        <meshBasicMaterial color="#2f9e44" transparent opacity={0} toneMapped={false} depthWrite={false} />
      </mesh>
    </>
  );
}

function Ready({ onReady }: { onReady?: () => void }) {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      onReady?.();
    }
  });
  return null;
}

export default function StageCanvas(props: SceneProps & { active: boolean; onReady?: () => void }) {
  usePointer();
  const floatRef = useRef(0);
  const { active, onReady, compact } = props;

  return (
    <Canvas
      className="!absolute inset-0"
      style={{ touchAction: "pan-y" }}
      dpr={[1, compact ? 1.5 : 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.8, 7], fov: 30, near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping }}
      aria-hidden="true"
    >
      {/* Studio reflections built from light panels (no network fetch) */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 2]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.6} position={[5, 1, 3]} scale={[2, 5, 1]} rotation-y={-Math.PI / 2.5} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 1, 2]} scale={[2, 5, 1]} rotation-y={Math.PI / 2.5} />
        <Lightformer form="ring" color="#2f9e44" intensity={0.8} position={[-4, 2, -4]} scale={3} />
      </Environment>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-3, 2, -5]} intensity={0.3} color="#4fbf65" />

      <Rig {...props} floatRef={floatRef} />
      <Floor floatRef={floatRef} />
      <Ready onReady={onReady} />
    </Canvas>
  );
}
