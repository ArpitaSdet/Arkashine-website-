"use client";

// "How it works" 3D stage: the closed SoiLenz 2.0, the pH/EC bottle, a soil sample
// and a phone running the Soil Partner app. Each step re-poses the scene.
// SoiLenz never opens (CLAUDE.md §5) — only the exterior is shown.

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ProceduralSoilLenz } from "@/components/stage/soillenz-model";
import { ProceduralBottle } from "@/components/stage/bottle-model";

type V3 = [number, number, number];
type Pose = {
  device: { p: V3; ry: number; glow: number; paper: number; shake: number };
  phone: { p: V3; ry: number; rx: number; s: number; screen: 0 | 1 | 2 | 3 };
  bottle: { p: V3; s: number };
  soil: { p: V3; s: number };
  cam: V3;
};

const FLOOR = -0.9;

const POSES: Pose[] = [
  // 01 Connect — device pairs with the phone over Bluetooth
  {
    device: { p: [-0.55, 0, 0], ry: -0.42, glow: 1, paper: 0, shake: 0 },
    phone: { p: [1.15, -0.05, 0.95], ry: -0.38, rx: -0.06, s: 1, screen: 3 },
    bottle: { p: [-1.6, FLOOR, 1.2], s: 0 },
    soil: { p: [-0.6, FLOOR, 1.4], s: 0 },
    cam: [0.2, 0.75, 7.4],
  },
  // 02 Prepare — 5 g soil + extractant
  {
    device: { p: [0.55, 0, -0.5], ry: -0.28, glow: 0, paper: 0, shake: 0 },
    phone: { p: [2.6, -0.05, 0.6], ry: -0.5, rx: 0, s: 0, screen: 0 },
    bottle: { p: [-1.2, FLOOR, 0.85], s: 1 },
    soil: { p: [-0.25, FLOOR, 1.35], s: 1 },
    cam: [-0.25, 1.15, 7.2],
  },
  // 03 Analyze — automated mixing + filtering
  {
    device: { p: [0, 0, 0], ry: 0.3, glow: 0.45, paper: 0, shake: 1 },
    phone: { p: [1.25, -0.1, 1.0], ry: -0.32, rx: -0.05, s: 0.92, screen: 1 },
    bottle: { p: [-1.5, FLOOR, 0.4], s: 1 },
    soil: { p: [-0.6, FLOOR, 1.4], s: 0 },
    cam: [0, 0.6, 7.6],
  },
  // 04 Report — printed in the field, synced to the app
  {
    device: { p: [-0.45, 0, 0], ry: -0.12, glow: 0.2, paper: 1, shake: 0 },
    phone: { p: [1.2, -0.05, 0.95], ry: -0.35, rx: -0.06, s: 1, screen: 2 },
    bottle: { p: [-1.6, FLOOR, 0.4], s: 0 },
    soil: { p: [-0.6, FLOOR, 1.4], s: 0 },
    cam: [0.1, 0.55, 7.2],
  },
];

const SCREENS = ["/images/app/dashboard.webp", "/images/app/nutrients.webp", "/images/app/advisory.webp", "/images/app/connect.webp"];
const PHONE_W = 0.72;
const PHONE_H = 1.42;
const SCREEN_W = PHONE_W - 0.07;
const SCREEN_H = PHONE_H - 0.1;

const damp = THREE.MathUtils.damp;

function dampV(v: THREE.Vector3, t: V3, k: number, dt: number) {
  v.set(damp(v.x, t[0], k, dt), damp(v.y, t[1], k, dt), damp(v.z, t[2], k, dt));
}

function Phone({ stepRef }: { stepRef: React.RefObject<number> }) {
  const textures = useTexture(SCREENS);
  const screenAspect = SCREEN_W / SCREEN_H;
  useMemo(() => {
    for (const t of textures) {
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      const img = t.image as { width: number; height: number };
      const ia = img.width / img.height;
      // cover-fit, anchored to the top of the screenshot
      if (ia > screenAspect) {
        t.repeat.set(screenAspect / ia, 1);
        t.offset.set((1 - screenAspect / ia) / 2, 0);
      } else {
        t.repeat.set(1, ia / screenAspect);
        t.offset.set(0, 1 - ia / screenAspect);
      }
      t.needsUpdate = true;
    }
  }, [textures, screenAspect]);

  const group = useRef<THREE.Group>(null);
  const screen = useRef<THREE.MeshBasicMaterial>(null);
  const shown = useRef(-1);
  const body = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#121614", roughness: 0.25, metalness: 0.6, clearcoat: 1 }), []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const pose = POSES[stepRef.current ?? 0].phone;
    const t = state.clock.elapsedTime;
    dampV(g.position, [pose.p[0], pose.p[1] + Math.sin(t * 1.4) * 0.035, pose.p[2]], 4, dt);
    g.rotation.y = damp(g.rotation.y, pose.ry, 4, dt);
    g.rotation.x = damp(g.rotation.x, pose.rx, 4, dt);
    const s = damp(g.scale.x, pose.s, 6, dt);
    g.scale.setScalar(Math.max(0.0001, s));
    g.visible = s > 0.01;
    if (screen.current && shown.current !== pose.screen) {
      shown.current = pose.screen;
      screen.current.map = textures[pose.screen];
      screen.current.needsUpdate = true;
    }
  });

  return (
    <group ref={group} scale={0.0001}>
      <RoundedBox args={[PHONE_W, PHONE_H, 0.07]} radius={0.08} smoothness={6} material={body} castShadow />
      <mesh position={[0, 0, 0.0365]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial ref={screen} toneMapped={false} />
      </mesh>
      {/* camera notch */}
      <mesh position={[0, PHONE_H / 2 - 0.075, 0.038]}>
        <planeGeometry args={[0.16, 0.035]} />
        <meshBasicMaterial color="#0b0d0c" />
      </mesh>
    </group>
  );
}

function SoilSample({ stepRef }: { stepRef: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const soilGeo = useMemo(() => {
    const g = new THREE.SphereGeometry(0.3, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
      const n = 1 + Math.sin(x * 23) * 0.05 + Math.cos(z * 19 + y * 9) * 0.05;
      pos.setXYZ(i, x * n, y * 0.62 * n, z * n);
    }
    g.computeVertexNormals();
    return g;
  }, []);
  const soilMat = useMemo(() => new THREE.MeshStandardMaterial({ color: "#5a3a22", roughness: 0.95 }), []);
  const dishMat = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#f4f5f2", roughness: 0.2, clearcoat: 0.8 }), []);

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const pose = POSES[stepRef.current ?? 0].soil;
    dampV(g.position, pose.p, 4, dt);
    const s = damp(g.scale.x, pose.s, 6, dt);
    g.scale.setScalar(Math.max(0.0001, s));
    g.visible = s > 0.01;
  });

  return (
    <group ref={group} scale={0.0001}>
      <mesh material={dishMat} position={[0, 0.03, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.38, 0.06, 48]} />
      </mesh>
      <mesh geometry={soilGeo} material={soilMat} position={[0, 0.06, 0]} castShadow />
    </group>
  );
}

function Rig({ stepRef }: { stepRef: React.RefObject<number> }) {
  const device = useRef<THREE.Group>(null);
  const bottle = useRef<THREE.Group>(null);
  const glow = useRef(0);
  const paper = useRef(0);
  const shake = useRef(0);
  const look = useMemo(() => new THREE.Vector3(0, -0.15, 0), []);

  useFrame((state, dt) => {
    const pose = POSES[stepRef.current ?? 0];
    const t = state.clock.elapsedTime;
    const d = device.current;
    if (d) {
      dampV(d.position, pose.device.p, 3.5, dt);
      shake.current = damp(shake.current, pose.device.shake, 4, dt);
      const ptr = state.pointer;
      d.rotation.y = damp(d.rotation.y, pose.device.ry + ptr.x * 0.12 + Math.sin(t * 0.5) * 0.04, 3.5, dt);
      d.rotation.x = damp(d.rotation.x, -ptr.y * 0.05, 3.5, dt);
      // gentle float + a fine mixing vibration during "Analyze"
      d.position.y += Math.sin(t * 1.6) * 0.012 + Math.sin(t * 46) * 0.006 * shake.current;
      d.rotation.z = Math.sin(t * 38) * 0.004 * shake.current;
    }
    glow.current = damp(glow.current, pose.device.glow, 3, dt);
    paper.current = damp(paper.current, pose.device.paper, pose.device.paper ? 1.3 : 6, dt);

    const b = bottle.current;
    if (b) {
      dampV(b.position, pose.bottle.p, 4, dt);
      const s = damp(b.scale.x, pose.bottle.s, 5, dt);
      b.scale.setScalar(Math.max(0.0001, s));
      b.visible = s > 0.01;
      b.rotation.y += dt * 0.35;
    }

    dampV(state.camera.position, pose.cam, 2.2, dt);
    state.camera.lookAt(look);
  });

  return (
    <>
      <group ref={device}>
        <ProceduralSoilLenz getGlow={() => glow.current} getPaper={() => paper.current} />
      </group>
      <group ref={bottle} scale={0.0001}>
        <group scale={1.15}>
          <ProceduralBottle />
        </group>
      </group>
      <SoilSample stepRef={stepRef} />
      <Phone stepRef={stepRef} />
    </>
  );
}

export default function ProcessStage3D({ step, active }: { step: number; active: boolean }) {
  const stepRef = useRef(step);
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 1.75]}
      frameloop={active ? "always" : "never"}
      camera={{ position: POSES[0].cam, fov: 30, near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
      shadows
      aria-hidden="true"
    >
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, 2]} scale={[8, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer form="rect" intensity={1.6} position={[5, 1, 3]} scale={[2, 5, 1]} rotation-y={-Math.PI / 2.5} />
        <Lightformer form="rect" intensity={1.2} position={[-5, 1, 2]} scale={[2, 5, 1]} rotation-y={Math.PI / 2.5} />
        <Lightformer form="ring" color="#8cbf5f" intensity={1} position={[-4, 2, -4]} scale={3} />
      </Environment>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 6, 4]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-3, 2, -5]} intensity={0.8} color="#8cbf5f" />
      <Suspense fallback={null}>
        <Rig stepRef={stepRef} />
      </Suspense>
      <ContactShadows position={[0, FLOOR - 0.005, 0]} opacity={0.55} scale={9} blur={2.6} far={3} color="#020806" />
    </Canvas>
  );
}
