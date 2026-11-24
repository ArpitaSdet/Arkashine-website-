"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// SoiLenz 2.0 — exterior only. Strictly closed and solid (Part B & E strict rule).
const W = 2.2;
const H = 2.0;
const D = 2.0;
const FRONT = D / 2;

export const SOILLENZ_HALF_HEIGHT = (H + 0.26) / 2;

function useCanvasTexture(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  w: number,
  h: number
) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d")!, w, h);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, h]);
  useEffect(() => () => tex.dispose(), [tex]);
  return tex;
}

function drawLeaf(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  ctx.fillStyle = "#2f9e44";
  ctx.beginPath();
  ctx.ellipse(cx + s * 0.55, cy, s * 0.42, s * 0.8, 0.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1e6fd9";
  ctx.beginPath();
  ctx.ellipse(cx - s * 0.55, cy, s * 0.42, s * 0.8, -0.6, 0, Math.PI * 2);
  ctx.fill();
}

type Props = {
  getPaper?: () => number;
  getGlow?: () => number;
};

export function SoilLenzModel({ getPaper, getGlow }: Props) {
  const paper = useRef<THREE.Group>(null);
  const logoMat = useRef<THREE.MeshBasicMaterial>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const glintRef = useRef<THREE.Mesh>(null);

  const logo = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = "#4F86FF";
      ctx.font = "italic 700 150px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ArkaShine", w / 2, h / 2 + 6);
    },
    1024,
    256
  );

  const label = useCanvasTexture(
    (ctx, w) => {
      drawLeaf(ctx, w / 2, 70, 56);
      ctx.textAlign = "center";
      ctx.fillStyle = "#0f1b4c";
      ctx.font = "800 88px Arial, sans-serif";
      ctx.fillText("SOILENZ", w / 2, 215);
      ctx.fillStyle = "#2f9e44";
      ctx.font = "800 100px Arial, sans-serif";
      ctx.fillText("2.0", w / 2, 318);
    },
    512,
    340
  );

  const badge = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#3B82F6";
      ctx.lineWidth = 8;
      ctx.strokeRect(4, 4, w - 8, h - 8);
      ctx.fillStyle = "#1D4ED8";
      ctx.font = "italic 800 88px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ArkaShine", w / 2, h / 2 + 6);
    },
    512,
    160
  );

  const plate = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = "#eef1f4";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#0f1b4c";
      ctx.font = "700 38px Arial, sans-serif";
      ctx.fillText("SoiLenz 2.0", 28, 60);
      ctx.font = "500 24px Arial, sans-serif";
      ctx.fillStyle = "#5b6575";
      ctx.fillText("Designed & made in India", 28, 102);
      ctx.fillText("ArkaShine Innovations Pvt Ltd · Bengaluru", 28, 138);
      drawLeaf(ctx, w - 70, 90, 26);
    },
    512,
    192
  );

  const receipt = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      // Header
      ctx.fillStyle = "#0f1b4c";
      ctx.font = "bold 24px Arial, sans-serif";
      ctx.fillText("SOIL REPORT", 30, 45);
      ctx.fillStyle = "#2f9e44";
      ctx.font = "18px Arial, sans-serif";
      ctx.fillText("ArkaShine Verified", 30, 72);
      // Lines
      ctx.fillStyle = "#9aa3ad";
      for (let y = 100; y < h - 20; y += 32) {
        ctx.fillRect(30, y, (w - 60) * (0.45 + ((y * 7) % 50) / 100), 8);
      }
    },
    256,
    512
  );

  const white = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#F3F5F8",
        roughness: 0.32,
        clearcoat: 0.4,
        clearcoatRoughness: 0.3,
      }),
    []
  );

  const black = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0c0d10",
        roughness: 0.12,
        metalness: 0.2,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
      }),
    []
  );

  const matteBlack = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#16171b", roughness: 0.55 }),
    []
  );
  const metal = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#c9ced6", metalness: 1, roughness: 0.22 }),
    []
  );
  const vent = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#c3c9cf", roughness: 0.6 }),
    []
  );

  useEffect(() => {
    return () => {
      for (const m of [white, black, matteBlack, metal, vent]) m.dispose();
    };
  }, [white, black, matteBlack, metal, vent]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = getGlow?.() ?? 0;
    if (logoMat.current) {
      logoMat.current.color.setScalar(1 + g * (1.8 + Math.sin(t * 6) * 0.5));
    }
    for (let i = 0; i < rings.current.length; i++) {
      const r = rings.current[i];
      if (!r) continue;
      const phase = (t * 0.8 + i / 3) % 1;
      r.scale.setScalar(0.6 + phase * 2.8);
      (r.material as THREE.MeshBasicMaterial).opacity = g * (1 - phase) * 0.95;
    }
    if (glintRef.current) {
      // Slow glint travelling across the black lid
      const glintX = ((t * 0.35) % 3.6) - 1.8;
      glintRef.current.position.x = glintX;
      (glintRef.current.material as THREE.MeshBasicMaterial).opacity = Math.sin(((glintX + 1.8) / 3.6) * Math.PI) * 0.45;
    }
    if (paper.current) {
      const p = getPaper?.() ?? 0;
      paper.current.scale.y = 0.02 + p * 0.98;
      paper.current.visible = p > 0.001;
    }
  });

  const vents = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);

  return (
    <group dispose={null}>
      {/* 100% Solid Body */}
      <RoundedBox
        args={[W, H, D]}
        radius={0.25}
        smoothness={6}
        material={white}
        castShadow
        receiveShadow
      />

      {/* Glossy Black Lid */}
      <RoundedBox
        args={[W + 0.06, 0.26, D + 0.06]}
        radius={0.12}
        smoothness={5}
        position={[0, H / 2 + 0.08, 0]}
        material={black}
        castShadow
      />

      {/* Travelling Glint streak across lid */}
      <mesh
        ref={glintRef}
        position={[0, H / 2 + 0.215, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 6]}
      >
        <planeGeometry args={[0.08, 1.8]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.3}
          toneMapped={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Logo on top lid */}
      <group position={[0, H / 2 + 0.212, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.75, 0.44]} />
          <meshBasicMaterial ref={logoMat} map={logo} transparent toneMapped={false} />
        </mesh>
      </group>

      {/* Bluetooth pulse rings (around top stop) */}
      {[0, 1, 2].map((i) => (
        <mesh
          key={i}
          ref={(m) => {
            rings.current[i] = m;
          }}
          position={[0, H / 2 + 0.22, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.38, 0.41, 64]} />
          <meshBasicMaterial
            color="#3b82f6"
            transparent
            opacity={0}
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Front: Printer Slot, Paper, Metal Knob, Label, Drawer */}
      <mesh position={[-0.32, 0.72, FRONT + 0.003]}>
        <planeGeometry args={[0.68, 0.19]} />
        <meshBasicMaterial map={badge} toneMapped={false} />
      </mesh>
      <RoundedBox
        args={[1.05, 0.84, 0.06]}
        radius={0.05}
        position={[-0.32, 0.1, FRONT]}
        material={matteBlack}
      />
      <mesh position={[-0.32, 0.14, FRONT + 0.032]}>
        <planeGeometry args={[0.9, 0.62]} />
        <meshStandardMaterial color="#060608" roughness={0.9} />
      </mesh>
      <mesh position={[-0.32, -0.2, FRONT + 0.034]}>
        <boxGeometry args={[0.66, 0.035, 0.01]} />
        <meshStandardMaterial color="#2b2d33" />
      </mesh>

      {/* Paper tongue sliding out */}
      <group ref={paper} position={[-0.32, -0.2, FRONT + 0.05]} rotation={[-0.45, 0, 0]}>
        <mesh position={[0, -0.26, 0]}>
          <planeGeometry args={[0.56, 0.52]} />
          <meshStandardMaterial map={receipt} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Metal Knob top-right */}
      <mesh
        position={[0.68, 0.5, FRONT + 0.035]}
        rotation={[Math.PI / 2, 0, 0]}
        material={metal}
        castShadow
      >
        <cylinderGeometry args={[0.16, 0.16, 0.08, 48]} />
      </mesh>
      <mesh position={[0.68, 0.5, FRONT + 0.078]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.01, 32]} />
        <meshStandardMaterial color="#9aa2ad" metalness={0.9} roughness={0.35} />
      </mesh>

      {/* Label SOILENZ 2.0 */}
      <mesh position={[0.68, -0.06, FRONT + 0.003]}>
        <planeGeometry args={[0.66, 0.44]} />
        <meshBasicMaterial map={label} transparent toneMapped={false} />
      </mesh>

      {/* Bottom Drawer */}
      <RoundedBox
        args={[1.4, 0.36, 0.06]}
        radius={0.04}
        position={[-0.2, -0.68, FRONT]}
        material={matteBlack}
      />
      <mesh position={[-0.2, -0.64, FRONT + 0.035]}>
        <boxGeometry args={[0.75, 0.04, 0.02]} />
        <meshStandardMaterial color="#33363d" />
      </mesh>

      {/* Left side (knob/grip side facing camera at 90°) */}
      <group position={[-W / 2 - 0.001, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <RoundedBox args={[1.0, 0.52, 0.03]} radius={0.06} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#e3e7ea" roughness={0.5} />
        </RoundedBox>
        {/* Green dot removed per strict rule */}
      </group>

      {/* Right side vents */}
      <group position={[W / 2 + 0.001, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        {vents.map((i) => (
          <mesh key={i} position={[0, 0.38 - i * 0.1, 0]} material={vent}>
            <boxGeometry args={[0.95, 0.035, 0.012]} />
          </mesh>
        ))}
      </group>

      {/* Back: rating plate + vents (NO patents!) */}
      <group position={[0, 0, -FRONT - 0.001]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.42, 0]}>
          <planeGeometry args={[0.95, 0.36]} />
          <meshBasicMaterial map={plate} toneMapped={false} />
        </mesh>
        {vents.slice(0, 6).map((i) => (
          <mesh key={i} position={[0, -0.06 - i * 0.09, 0]} material={vent}>
            <boxGeometry args={[1.25, 0.03, 0.012]} />
          </mesh>
        ))}
      </group>

      {/* 4 Rubber Feet */}
      {[
        [-W / 2 + 0.28, -H / 2 - 0.04, -D / 2 + 0.28],
        [W / 2 - 0.28, -H / 2 - 0.04, -D / 2 + 0.28],
        [-W / 2 + 0.28, -H / 2 - 0.04, D / 2 - 0.28],
        [W / 2 - 0.28, -H / 2 - 0.04, D / 2 - 0.28],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} material={matteBlack}>
          <cylinderGeometry args={[0.1, 0.11, 0.08, 24]} />
        </mesh>
      ))}
    </group>
  );
}

export function GlbModel({
  url,
  getPaper,
  getGlow,
}: {
  url: string;
  getPaper?: () => number;
  getGlow?: () => number;
}) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
