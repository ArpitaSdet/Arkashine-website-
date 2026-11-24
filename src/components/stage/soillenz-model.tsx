"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// SoiLenz 2.0 — exterior only. The device is always closed and solid (CLAUDE.md §5 strict rule).

const W = 2;
const H = 1.8;
const D = 1.8;
const FRONT = D / 2;

function useCanvasTexture(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void, w: number, h: number) {
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
  /** 0 → 1: paper slides out of the printer slot. */
  getPaper?: () => number;
  /** 0 → 1: logo glow + Bluetooth pulse rings. */
  getGlow?: () => number;
};

export function ProceduralSoilLenz({ getPaper, getGlow }: Props) {
  const paper = useRef<THREE.Group>(null);
  const logoMat = useRef<THREE.MeshBasicMaterial>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);

  const logo = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = "#4d94ff";
      ctx.font = "italic 700 150px Georgia, 'Times New Roman', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ArkaShine", w / 2, h / 2 + 6);
    },
    1024,
    256,
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
    340,
  );
  const badge = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "#d5dbe3";
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, w - 6, h - 6);
      ctx.fillStyle = "#1e3a8a";
      ctx.font = "italic 700 64px Georgia, serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("ArkaShine", w / 2, h / 2 + 4);
    },
    512,
    128,
  );
  const plate = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = "#eef1f4";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#0f1b4c";
      ctx.font = "700 40px Arial, sans-serif";
      ctx.fillText("SoiLenz 2.0", 28, 64);
      ctx.font = "400 26px Arial, sans-serif";
      ctx.fillStyle = "#5b6575";
      ctx.fillText("ArkaShine Innovations Pvt Ltd", 28, 112);
      ctx.fillText("Bengaluru, Karnataka, India", 28, 150);
      drawLeaf(ctx, w - 70, 90, 26);
    },
    512,
    192,
  );
  // Printed report — styled after the real SoiLenz thermal receipt.
  // Only the sample reading approved for the site (section 4) is shown; never real farmer data.
  const receipt = useCanvasTexture(
    (ctx, w, h) => {
      ctx.fillStyle = "#fdfdfb";
      ctx.fillRect(0, 0, w, h);
      ctx.textAlign = "center";
      ctx.fillStyle = "#15181a";
      let y = 36;
      ctx.font = "700 20px 'Courier New', monospace";
      ctx.fillText("ARKASHINE INNOVATIONS", w / 2, y);
      y += 24;
      ctx.font = "700 22px 'Courier New', monospace";
      ctx.fillText("SoiLENZ 2.0", w / 2, y);
      y += 26;
      ctx.strokeStyle = "#b8bcbf";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(18, y);
      ctx.lineTo(w - 18, y);
      ctx.stroke();
      y += 26;
      ctx.font = "700 17px 'Courier New', monospace";
      ctx.fillText("SAMPLE READING", w / 2, y);
      y += 18;
      ctx.beginPath();
      ctx.moveTo(18, y);
      ctx.lineTo(w - 18, y);
      ctx.stroke();
      y += 30;
      ctx.textAlign = "left";
      ctx.font = "600 17px 'Courier New', monospace";
      const rows: [string, string][] = [
        ["pH", "6.8"],
        ["EC", "0.4 dS/m"],
        ["N", "279 kg/ha"],
        ["Temp", "25°C"],
      ];
      for (const [k, v] of rows) {
        ctx.fillText(k, 26, y);
        ctx.textAlign = "right";
        ctx.fillText(v, w - 26, y);
        ctx.textAlign = "left";
        y += 26;
      }
      y += 4;
      ctx.textAlign = "center";
      ctx.strokeStyle = "#cfd2d4";
      ctx.beginPath();
      ctx.moveTo(18, y);
      ctx.lineTo(w - 18, y);
      ctx.stroke();
      y += 22;
      ctx.font = "500 11px 'Courier New', monospace";
      ctx.fillStyle = "#6b7074";
      ctx.fillText("+ OC · P · K · Ca · Mg · S", w / 2, y);
      y += 15;
      ctx.fillText("Fe · Mn · Cu · Zn · B", w / 2, y);
      y += 26;
      ctx.setLineDash([]);
      ctx.strokeStyle = "#b8bcbf";
      ctx.beginPath();
      ctx.moveTo(18, y);
      ctx.lineTo(w - 18, y);
      ctx.stroke();
      y += 22;
      ctx.font = "500 11px 'Courier New', monospace";
      ctx.fillStyle = "#15181a";
      ctx.fillText("This is for your information", w / 2, y);
      y += 18;
      ctx.fillText("Toll free PH: 9611297893", w / 2, y);
    },
    320,
    560,
  );

  const white = useMemo(
    () => new THREE.MeshPhysicalMaterial({ color: "#f4f6f7", roughness: 0.35, clearcoat: 0.35, clearcoatRoughness: 0.4 }),
    [],
  );
  const black = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#0c0d10", roughness: 0.15, metalness: 0.2, clearcoat: 1, clearcoatRoughness: 0.08 }), []);
  const matteBlack = useMemo(() => new THREE.MeshStandardMaterial({ color: "#16171b", roughness: 0.55 }), []);
  const metal = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c9ced6", metalness: 1, roughness: 0.22 }), []);
  const vent = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c3c9cf", roughness: 0.6 }), []);
  useEffect(
    () => () => {
      for (const m of [white, black, matteBlack, metal, vent]) m.dispose();
    },
    [white, black, matteBlack, metal, vent],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const g = getGlow?.() ?? 0;
    if (logoMat.current) logoMat.current.color.setScalar(1 + g * (1.6 + Math.sin(t * 6) * 0.5));
    for (let i = 0; i < rings.current.length; i++) {
      const r = rings.current[i];
      if (!r) continue;
      const phase = (t * 0.7 + i / 3) % 1;
      r.scale.setScalar(0.6 + phase * 2.6);
      (r.material as THREE.MeshBasicMaterial).opacity = g * (1 - phase) * 0.9;
    }
    if (paper.current) {
      const p = getPaper?.() ?? 0;
      paper.current.scale.y = 0.02 + p * 0.9;
      paper.current.visible = p > 0.001;
    }
  });

  const vents = useMemo(() => Array.from({ length: 8 }, (_, i) => i), []);

  return (
    <group dispose={null}>
      {/* Body */}
      <RoundedBox args={[W, H, D]} radius={0.2} smoothness={6} material={white} castShadow receiveShadow />

      {/* Glossy black lid */}
      <RoundedBox args={[W + 0.02, 0.22, D + 0.02]} radius={0.09} smoothness={5} position={[0, H / 2 + 0.06, 0]} material={black} castShadow />
      {/* Logo runs front-to-back so it reads straight at the "top" stop (device turned to its side, top tilted to camera) */}
      <group position={[0, H / 2 + 0.172, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.35, 0.34]} />
          <meshBasicMaterial ref={logoMat} map={logo} transparent toneMapped={false} />
        </mesh>
      </group>
      {/* Bluetooth pulse rings (visible only around the top stop) */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={(m) => void (rings.current[i] = m)} position={[0, H / 2 + 0.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.36, 0.38, 64]} />
          <meshBasicMaterial color="#4F9484" transparent opacity={0} toneMapped={false} depthWrite={false} />
        </mesh>
      ))}

      {/* Front: ArkaShine badge, printer slot, knob, label, drawer */}
      <mesh position={[-0.28, 0.66, FRONT + 0.003]}>
        <planeGeometry args={[0.5, 0.125]} />
        <meshBasicMaterial map={badge} toneMapped={false} />
      </mesh>
      <RoundedBox args={[1.02, 0.82, 0.06]} radius={0.05} position={[-0.28, 0.08, FRONT]} material={matteBlack} />
      <mesh position={[-0.28, 0.12, FRONT + 0.032]}>
        <planeGeometry args={[0.86, 0.6]} />
        <meshStandardMaterial color="#060608" roughness={0.9} />
      </mesh>
      <mesh position={[-0.28, -0.2, FRONT + 0.034]}>
        <boxGeometry args={[0.62, 0.035, 0.01]} />
        <meshStandardMaterial color="#2b2d33" />
      </mesh>
      {/* Paper: grows down and forward out of the slot */}
      <group ref={paper} position={[-0.28, -0.2, FRONT + 0.05]} rotation={[-0.45, 0, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <planeGeometry args={[0.52, 0.5]} />
          <meshStandardMaterial map={receipt} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      </group>

      <mesh position={[0.62, 0.46, FRONT + 0.035]} rotation={[Math.PI / 2, 0, 0]} material={metal} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.07, 48]} />
      </mesh>
      <mesh position={[0.62, 0.46, FRONT + 0.072]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.085, 0.085, 0.01, 32]} />
        <meshStandardMaterial color="#9aa2ad" metalness={0.9} roughness={0.35} />
      </mesh>
      <mesh position={[0.62, -0.08, FRONT + 0.003]}>
        <planeGeometry args={[0.62, 0.41]} />
        <meshBasicMaterial map={label} transparent toneMapped={false} />
      </mesh>
      <RoundedBox args={[1.3, 0.34, 0.06]} radius={0.04} position={[-0.2, -0.64, FRONT]} material={matteBlack} />
      <mesh position={[-0.2, -0.6, FRONT + 0.035]}>
        <boxGeometry args={[0.7, 0.04, 0.02]} />
        <meshStandardMaterial color="#33363d" />
      </mesh>

      {/* Left side (faces camera at the "side" stop): one-touch power button + recessed grip */}
      <group position={[-W / 2 - 0.001, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <RoundedBox args={[0.95, 0.5, 0.03]} radius={0.06} position={[0, -0.1, 0]}>
          <meshStandardMaterial color="#e3e7ea" roughness={0.5} />
        </RoundedBox>
        <mesh position={[0, 0.52, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.03, 48]} />
          <meshStandardMaterial color="#2f9e44" emissive="#2f9e44" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0.52, 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.03, 48]} />
          <meshStandardMaterial color="#f7f8f8" roughness={0.3} />
        </mesh>
      </group>

      {/* Right side: vent slots */}
      <group position={[W / 2 + 0.001, 0.05, 0]} rotation={[0, Math.PI / 2, 0]}>
        {vents.map((i) => (
          <mesh key={i} position={[0, 0.35 - i * 0.1, 0]} material={vent}>
            <boxGeometry args={[0.9, 0.035, 0.012]} />
          </mesh>
        ))}
      </group>

      {/* Back: rating plate, vents and ports */}
      <group position={[0, 0, -FRONT - 0.001]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0.38, 0]}>
          <planeGeometry args={[0.9, 0.34]} />
          <meshBasicMaterial map={plate} toneMapped={false} />
        </mesh>
        {vents.slice(0, 5).map((i) => (
          <mesh key={i} position={[0, -0.05 - i * 0.09, 0]} material={vent}>
            <boxGeometry args={[1.2, 0.03, 0.012]} />
          </mesh>
        ))}
        <mesh position={[-0.55, -0.6, 0.006]} material={matteBlack}>
          <boxGeometry args={[0.16, 0.08, 0.012]} />
        </mesh>
        <mesh position={[-0.3, -0.6, 0.006]} material={matteBlack}>
          <cylinderGeometry args={[0.045, 0.045, 0.012, 24]} />
        </mesh>
      </group>

      {/* Feet */}
      {[
        [-0.75, -0.7],
        [0.75, -0.7],
        [-0.75, 0.7],
        [0.75, 0.7],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -H / 2 - 0.03, z]} material={matteBlack}>
          <cylinderGeometry args={[0.09, 0.09, 0.06, 20]} />
        </mesh>
      ))}
    </group>
  );
}

export function GlbModel({ path }: { path: string }) {
  const { scene } = useGLTF(path);
  return <primitive object={scene} />;
}

/** Height of the device including feet, for floor placement. */
export const SOILLENZ_HALF_HEIGHT = H / 2 + 0.06;
