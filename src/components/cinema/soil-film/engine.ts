/**
 * ArkaShine "Living Soil → Green Farm" film.
 * One continuous Three.js scene driven by a 0..1 scroll progress:
 * underground soil → root network → nutrient sparks → golden sunlight →
 * surface emergence → green farm reveal (aerial pull-back).
 *
 * Pure Three.js (no React) so the hero component can lazy-load it.
 */
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

export type FilmQuality = "high" | "low";

export interface SoilFilm {
  setProgress(p: number): void;
  setPointer(x: number, y: number): void;
  resize(w: number, h: number): void;
  setActive(active: boolean): void;
  dispose(): void;
  ready: Promise<void>;
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const band = (p: number, a: number, b: number, c: number, d: number) =>
  smooth(a, b, p) * (1 - smooth(c, d, p));
const lerp = THREE.MathUtils.lerp;

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// cheap 3D value noise + fbm (CPU, used for geometry displacement)
function hash3(x: number, y: number, z: number) {
  const h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return h - Math.floor(h);
}
function vnoise(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const xf = x - xi, yf = y - yi, zf = z - zi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf), w = zf * zf * (3 - 2 * zf);
  const c = (a: number, b: number, d: number) => hash3(xi + a, yi + b, zi + d);
  const x00 = lerp(c(0, 0, 0), c(1, 0, 0), u), x10 = lerp(c(0, 1, 0), c(1, 1, 0), u);
  const x01 = lerp(c(0, 0, 1), c(1, 0, 1), u), x11 = lerp(c(0, 1, 1), c(1, 1, 1), u);
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w);
}
function fbm(x: number, y: number, z: number) {
  let a = 0.5, f = 1, s = 0;
  for (let i = 0; i < 4; i++) {
    s += a * vnoise(x * f, y * f, z * f);
    f *= 2.03;
    a *= 0.5;
  }
  return s;
}

/* ------------------------------------------------------------------ */
/* camera choreography (p → position / look target)                    */
/* ------------------------------------------------------------------ */

type V3 = [number, number, number];
const KEYS: [number, V3, V3][] = [
  // 01 · underground soil
  [0.0, [0.0, -9.0, 7.0], [0.6, -9.6, -10]],
  [0.05, [0.25, -9.15, 2.0], [0.4, -9.6, -16]],
  [0.1, [0.5, -9.3, -3.0], [0.2, -9.6, -22]],
  // 02 · root network
  [0.15, [-0.1, -9.5, -9.5], [0.2, -9.4, -28]],
  [0.2, [-0.7, -9.7, -16], [0.2, -9.2, -34]],
  [0.25, [0.1, -9.45, -22], [0.3, -8.7, -40]],
  // 03 · nutrient particles
  [0.3, [0.9, -9.2, -28], [0.4, -8.2, -46]],
  [0.36, [0.65, -8.95, -32.5], [0.3, -7.2, -49]],
  // extra steps right through the root corridor approaching the light — this
  // was still rushing past the roots before they could really be seen.
  [0.39, [0.55, -8.775, -34.25], [0.25, -6.6, -50.5]],
  [0.42, [0.45, -8.6, -36.0], [0.2, -6.0, -52]],
  [0.45, [0.365, -8.25, -37.75], [0.15, -5.25, -53]],
  // 04 · golden sunlight & root network transition (slower, lingering flight among roots)
  [0.48, [0.28, -7.9, -39.5], [0.1, -4.5, -54]],
  [0.53, [0.15, -6.8, -43.0], [0.05, -2.5, -55.5]],
  [0.58, [0.05, -5.2, -46.5], [0.0, -0.5, -57]],
  [0.62, [0.0, -3.4, -49.5], [0.0, 1.2, -59.5]],
  [0.66, [0.0, -1.8, -52.0], [0.0, 2.4, -63.5]],
  [0.69, [0.0, -0.3, -53.5], [0.0, 2.6, -70]],
  // 05 · green farm emergence
  [0.72, [0.0, 1.25, -54.5], [0.0, 2.0, -80]],
  [0.76, [0.0, 2.1, -54.0], [0.0, 2.3, -88]],
  [0.82, [0.0, 3.8, -50.0], [0.0, 2.5, -96]],
  [0.88, [0.0, 6.8, -44.0], [0.0, 2.6, -104]],
  [0.94, [0.0, 10.2, -37.0], [0.0, 2.8, -111]],
  [1.0, [0.0, 13.5, -31.0], [0.0, 3.0, -116]],
];
const posCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k[1])), false, "centripetal");
const lookCurve = new THREE.CatmullRomCurve3(KEYS.map((k) => new THREE.Vector3(...k[2])), false, "centripetal");
function pToU(p: number) {
  const n = KEYS.length;
  if (p <= KEYS[0][0]) return 0;
  for (let i = 0; i < n - 1; i++) {
    const a = KEYS[i][0], b = KEYS[i + 1][0];
    if (p <= b) return (i + (p - a) / (b - a)) / (n - 1);
  }
  return 1;
}

// where the camera breaks the surface
const EMERGE_Z = -54;

/* ------------------------------------------------------------------ */
/* shaders                                                             */
/* ------------------------------------------------------------------ */

const softPointVert = /* glsl */ `
  attribute vec3 color;
  attribute float aSize;
  attribute float aPhase;
  uniform float uTime;
  uniform float uScale;
  uniform float uDrift;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vec3 p = position;
    p.x += sin(uTime * 0.31 + aPhase * 6.2831) * uDrift;
    p.y += sin(uTime * 0.23 + aPhase * 12.566) * uDrift * 0.8 + uTime * 0.02 * uDrift;
    p.z += cos(uTime * 0.27 + aPhase * 9.42) * uDrift;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(aSize * uScale / max(0.35, -mv.z), 26.0);
    vColor = color;
    vTw = 0.55 + 0.45 * sin(uTime * (1.2 + aPhase * 2.0) + aPhase * 40.0);
    // fade very near points (avoid lens-sized blobs)
    vTw *= smoothstep(0.8, 3.0, -mv.z);
  }
`;
const softPointFrag = /* glsl */ `
  uniform float uOpacity;
  uniform float uCore;
  varying vec3 vColor;
  varying float vTw;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c) * 2.0;
    if (d > 1.0) discard;
    float a = pow(max(1.0 - d, 0.0), 2.2) + uCore * smoothstep(0.35, 0.0, d);
    gl_FragColor = vec4(vColor * a * vTw * uOpacity, 1.0);
  }
`;

const rayVert = /* glsl */ `
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vDepth = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`;
const rayFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  varying float vDepth;
  void main() {
    float across = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
    across = across * across;
    float along = smoothstep(0.0, 0.6, vUv.y) * smoothstep(1.0, 0.82, vUv.y) * (0.25 + 0.75 * vUv.y);
    float flick = 0.72 + 0.28 * sin(vUv.y * 7.0 + uTime * 0.45 + uSeed) * sin(vUv.x * 11.0 - uTime * 0.25 + uSeed * 2.0);
    float nearFade = smoothstep(1.0, 6.0, vDepth);
    gl_FragColor = vec4(uColor * across * along * flick * nearFade * uIntensity, 1.0);
  }
`;

const skyVert = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const skyFrag = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  varying vec3 vDir;
  void main() {
    float h = clamp(vDir.y, -0.2, 1.0);
    vec3 c = mix(uHorizon, uTop, smoothstep(0.0, 0.45, h));
    float s = max(dot(normalize(vDir), normalize(uSunDir)), 0.0);
    c += uSunColor * (pow(s, 600.0) * 6.0 + pow(s, 24.0) * 0.45 + pow(s, 4.0) * 0.12);
    gl_FragColor = vec4(c, 1.0);
  }
`;

const plateFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform vec3 uHaze;
  varying vec2 vUv;
  void main() {
    vec4 t = texture2D(uMap, vUv);
    // fade the plate out below its horizon line so the 3D ground takes over
    float a = smoothstep(0.66, 0.72, vUv.y);
    // and softly at the sides/top so it never shows an edge
    a *= smoothstep(0.0, 0.06, vUv.x) * smoothstep(1.0, 0.94, vUv.x) * smoothstep(1.0, 0.9, vUv.y);
    vec3 c = mix(t.rgb, uHaze, 0.16);
    gl_FragColor = vec4(c, a * uOpacity);
  }
`;

const gradeShader = {
  uniforms: {
    tDiffuse: { value: null as THREE.Texture | null },
    uTime: { value: 0 },
    uFlash: { value: 0 },
    uUnder: { value: 1 },
    uVignette: { value: 0.85 },
    uGrain: { value: 0.035 },
    uRes: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime, uFlash, uUnder, uVignette, uGrain;
    uniform vec2 uRes;
    varying vec2 vUv;
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
      // underground split-tone: warm fertile earth shadows, radiant golden highlights
      vec3 under = c * vec3(1.08, 1.02, 0.94) + vec3(0.018, 0.012, 0.006) * (1.0 - smoothstep(0.0, 0.22, l));
      // farm grade: gentle warmth, slightly richer greens
      vec3 farm = c * vec3(1.03, 1.0, 0.94);
      c = mix(farm, under, uUnder);
      // emergence flash (HDR, tone-mapped afterwards)
      c = mix(c, vec3(1.55, 1.05, 0.5), uFlash);
      vec2 d = vUv - 0.5; d.x *= uRes.x / uRes.y;
      float v = smoothstep(1.05, 0.28, length(d));
      c *= mix(1.0, v, uVignette);
      float g = fract(sin(dot(vUv * uRes + fract(uTime * 7.13) * 91.7, vec2(12.9898, 78.233))) * 43758.5453);
      c += (g - 0.5) * uGrain * (0.25 + l);
      gl_FragColor = vec4(max(c, 0.0), 1.0);
    }
  `,
};

/* ------------------------------------------------------------------ */
/* textures                                                            */
/* ------------------------------------------------------------------ */

function loadTex(loader: THREE.TextureLoader, url: string, srgb = true) {
  return new Promise<THREE.Texture>((resolve) => {
    loader.load(
      url,
      (t) => {
        if (srgb) t.colorSpace = THREE.SRGBColorSpace;
        resolve(t);
      },
      undefined,
      () => {
        // never block the film on a missing plate
        const c = document.createElement("canvas");
        c.width = c.height = 4;
        const t = new THREE.CanvasTexture(c);
        resolve(t);
      },
    );
  });
}

/** Aerial patchwork for the far ground (rows, fallow, hedges). */
function fieldTexture(r: () => number) {
  const S = 2048;
  const c = document.createElement("canvas");
  c.width = c.height = S;
  const g = c.getContext("2d")!;
  g.fillStyle = "#4d5a1c";
  g.fillRect(0, 0, S, S);
  const greens = ["#5b6a1b", "#66731f", "#4f6418", "#73801f", "#5a5f1a", "#7b7a2a", "#6a5a2c", "#556d22"];
  // patchwork of fields (in plane UV space; the central strip is our crop field)
  for (let i = 0; i < 260; i++) {
    const w = 40 + r() * 160, h = 40 + r() * 220;
    const x = r() * S, y = r() * S;
    g.save();
    g.translate(x, y);
    g.rotate((r() - 0.5) * 0.25);
    g.fillStyle = greens[Math.floor(r() * greens.length)];
    g.fillRect(-w / 2, -h / 2, w, h);
    // furrow stripes
    g.globalAlpha = 0.22;
    g.fillStyle = r() > 0.5 ? "#2e2a12" : "#8c8a3a";
    for (let s = -h / 2; s < h / 2; s += 3) g.fillRect(-w / 2, s, w, 1);
    g.globalAlpha = 1;
    // hedge line
    g.strokeStyle = "rgba(30,45,18,0.55)";
    g.lineWidth = 2;
    g.strokeRect(-w / 2, -h / 2, w, h);
    g.restore();
  }
  // our crop field: long rows running toward the horizon (along plane v)
  g.fillStyle = "#506a1a";
  g.fillRect(S * 0.45, 0, S * 0.1, S);
  for (let x = S * 0.45; x < S * 0.55; x += 2) {
    g.fillStyle = (x | 0) % 4 === 0 ? "#3a2c18" : "#5f7d1f";
    g.fillRect(x, 0, 1, S);
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/* ------------------------------------------------------------------ */
/* geometry builders                                                   */
/* ------------------------------------------------------------------ */

function clodGeometry(seed: number, detail: number) {
  let g: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1, detail);
  g.deleteAttribute("normal");
  g.deleteAttribute("uv");
  g = mergeVertices(g);
  const pos = g.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  const o = seed * 17.31;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const n = fbm(v.x * 1.4 + o, v.y * 1.4 - o, v.z * 1.4 + o * 0.5);
    const pores = vnoise(v.x * 6 + o, v.y * 6, v.z * 6 - o);
    const r = 0.72 + n * 0.62 - Math.pow(pores, 3) * 0.22;
    v.multiplyScalar(r);
    v.y *= 0.82;
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  return g;
}

function bladeClump(r: () => number, blades: number) {
  const parts: THREE.BufferGeometry[] = [];
  const base = new THREE.Color("#2c4a14");
  const tip = new THREE.Color("#a6c74e");
  const tmp = new THREE.Color();
  for (let b = 0; b < blades; b++) {
    const h = 0.75 + r() * 0.55;
    const w = 0.05 + r() * 0.035;
    const g = new THREE.PlaneGeometry(w, h, 1, 6);
    g.translate(0, h / 2, 0);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const bend = 0.18 + r() * 0.35;
    const cols: number[] = [];
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const t = y / h;
      pos.setX(i, pos.getX(i) * (1 - t * 0.85));
      pos.setZ(i, bend * t * t * h);
      tmp.copy(base).lerp(tip, Math.pow(t, 0.8));
      cols.push(tmp.r, tmp.g, tmp.b);
    }
    g.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    g.rotateY(r() * Math.PI * 2);
    g.rotateX((r() - 0.5) * 0.25);
    g.translate((r() - 0.5) * 0.12, 0, (r() - 0.5) * 0.12);
    g.computeVertexNormals();
    parts.push(g);
  }
  const m = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return m;
}

function treeGeometry(r: () => number) {
  const parts: THREE.BufferGeometry[] = [];
  const trunk = new THREE.CylinderGeometry(0.18, 0.3, 3.2, 6);
  trunk.translate(0, 1.6, 0);
  const tc: number[] = [];
  for (let i = 0; i < trunk.attributes.position.count; i++) tc.push(0.16, 0.11, 0.07);
  trunk.setAttribute("color", new THREE.Float32BufferAttribute(tc, 3));
  trunk.deleteAttribute("uv");
  parts.push(trunk);
  for (let k = 0; k < 6; k++) {
    let blob: THREE.BufferGeometry = new THREE.IcosahedronGeometry(1.2 + r() * 0.9, 3);
    blob.deleteAttribute("uv");
    blob.deleteAttribute("normal");
    blob = mergeVertices(blob);
    const p = blob.attributes.position as THREE.BufferAttribute;
    const v = new THREE.Vector3();
    const cols: number[] = [];
    for (let i = 0; i < p.count; i++) {
      v.fromBufferAttribute(p, i);
      v.multiplyScalar(0.85 + fbm(v.x * 1.7 + k, v.y * 1.7, v.z * 1.7) * 0.4);
      p.setXYZ(i, v.x, v.y * 0.8, v.z);
      const shade = 0.75 + 0.25 * clamp01(v.y / 2 + 0.5);
      cols.push(0.11 * shade, 0.2 * shade, 0.07 * shade);
    }
    blob.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
    blob.computeVertexNormals();
    blob.translate((r() - 0.5) * 2.2, 3.6 + r() * 1.4, (r() - 0.5) * 2.2);
    parts.push(blob);
  }
  const m = mergeGeometries(parts)!;
  parts.forEach((p) => p.dispose());
  return m;
}

interface RootBuild {
  tubes: THREE.BufferGeometry[];
  hairs: number[];
  curves: THREE.CatmullRomCurve3[];
}

function growRoot(
  r: () => number,
  out: RootBuild,
  start: THREE.Vector3,
  dir: THREE.Vector3,
  length: number,
  radius: number,
  depth: number,
  maxDepth: number,
  avoid: (p: THREE.Vector3) => THREE.Vector3 | null,
) {
  const pts: THREE.Vector3[] = [start.clone()];
  const p = start.clone();
  const d = dir.clone().normalize();
  const step = 0.28;
  const steps = Math.max(4, Math.ceil(length / step));
  for (let i = 0; i < steps; i++) {
    // organic, meandering botanical root growth with natural wandering
    d.x += (r() - 0.5) * 0.42 + Math.sin(i * 0.7) * 0.08;
    d.z += (r() - 0.5) * 0.42 + Math.cos(i * 0.7) * 0.08;
    d.y += (r() - 0.5) * 0.25 - 0.14;
    d.normalize();
    p.addScaledVector(d, step);
    if (p.y > -0.15) p.y = -0.15;
    const push = avoid(p);
    if (push) p.add(push);
    pts.push(p.clone());
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.45);
  out.curves.push(curve);
  const tubular = steps * 4;
  const radial = depth === 0 ? 10 : 7;
  const tube = new THREE.TubeGeometry(curve, tubular, radius, radial, false);
  // organic tapering, bark displacement, and real bark colouring — a flat
  // single colour is what made these read as plastic/fake rather than roots.
  const pos = tube.attributes.position as THREE.BufferAttribute;
  const c = new THREE.Vector3(), v = new THREE.Vector3();
  const vcount = (tubular + 1) * (radial + 1);
  const colors = new Float32Array(vcount * 3);
  // Natural botanical roots: healthy ivory, golden-ochre, creamy tan, and warm amber (living crop roots)
  const baseHue = 36 + r() * 12; // warm golden-amber range (vitality, not dark brown/black)
  const baseSat = 0.36 + r() * 0.16;
  const baseLight = depth === 0 ? 0.52 + r() * 0.10 : 0.64 + r() * 0.14; // bright, vital living plant root tones
  const tmpColor = new THREE.Color();
  for (let i = 0; i <= tubular; i++) {
    curve.getPointAt(i / tubular, c);
    const k = 1 - (i / tubular) * 0.78;
    const streak = Math.sin(i * 0.37 + r() * 6) * 0.3 + Math.sin(i * 1.4) * 0.08;
    const ring = Math.sin(i * 2.6) * 0.03;
    const tipBlend = Math.pow(i / tubular, 1.3); // root tip becomes creamy ivory / golden cream
    for (let j = 0; j <= radial; j++) {
      const idx = i * (radial + 1) + j;
      v.fromBufferAttribute(pos, idx).sub(c);
      const bump = 1.0 + Math.sin(i * 1.8 + j * 2.4) * 0.05 + (r() - 0.5) * 0.03;
      v.multiplyScalar(k * bump).add(c);
      pos.setXYZ(idx, v.x, v.y, v.z);

      const speckle = (r() - 0.5) * 0.04;
      const light = Math.max(0.32, Math.min(0.90, baseLight + streak * 0.08 + ring + speckle + tipBlend * 0.16));
      tmpColor.setHSL((baseHue + tipBlend * 8) / 360, Math.max(0.16, baseSat - tipBlend * 0.14), light);
      colors[idx * 3] = tmpColor.r;
      colors[idx * 3 + 1] = tmpColor.g;
      colors[idx * 3 + 2] = tmpColor.b;
    }
  }
  tube.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  tube.deleteAttribute("uv");
  tube.computeVertexNormals();
  out.tubes.push(tube);

  // fine root hairs on thinner roots — short fuzz that splays OUT from the
  // root's surface, not long spikes shooting off in arbitrary directions
  // (that read as thorny/fractal rather than like a real root).
  if (depth >= 1) {
    const n = Math.floor(length * (depth >= 2 ? 16 : 7));
    const tan = new THREE.Vector3();
    for (let i = 0; i < n; i++) {
      const t = 0.15 + r() * 0.85;
      curve.getPointAt(t, c);
      curve.getTangentAt(t, tan);
      // a random direction with its along-root component removed, so what's
      // left points outward from the root rather than along it
      const rand = new THREE.Vector3(r() - 0.5, r() - 0.5, r() - 0.5);
      const out3 = rand.sub(tan.clone().multiplyScalar(rand.dot(tan))).normalize();
      if (!isFinite(out3.x)) out3.set(1, 0, 0);
      out3.y -= 0.12; // a slight downward droop, like real fine roots
      out3.normalize();
      const hl = 0.018 + r() * 0.038;
      out.hairs.push(c.x, c.y, c.z, c.x + out3.x * hl, c.y + out3.y * hl, c.z + out3.z * hl);
    }
  }

  if (depth < maxDepth) {
    const branches = depth === 0 ? 5 + Math.floor(r() * 3) : 2 + Math.floor(r() * 3);
    for (let b = 0; b < branches; b++) {
      const t = 0.18 + r() * 0.7;
      const s = curve.getPointAt(t);
      const tan = curve.getTangentAt(t);
      const side = new THREE.Vector3(r() - 0.5, (r() - 0.6) * 0.6, r() - 0.5).normalize();
      const nd = tan.multiplyScalar(0.35).add(side).normalize();
      growRoot(r, out, s, nd, length * (0.45 + r() * 0.25), radius * 0.5, depth + 1, maxDepth, avoid);
    }
  }
}

/* ------------------------------------------------------------------ */
/* the film                                                            */
/* ------------------------------------------------------------------ */

export function createSoilFilm(canvas: HTMLCanvasElement, quality: FilmQuality): SoilFilm {
  const hi = quality === "high";
  const r = rng(20240611);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false,
    alpha: false,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, hi ? 1.5 : 1.25));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const UNDER_FOG = new THREE.Color("#2a1a11"); // warm fertile agricultural loam (NOT pitch black #0d0806)
  const FARM_FOG = new THREE.Color("#c9a989");
  scene.background = UNDER_FOG.clone();
  const fog = new THREE.FogExp2(UNDER_FOG.clone(), 0.036);
  scene.fog = fog;

  const camera = new THREE.PerspectiveCamera(52, 1, 0.05, 1500);
  scene.add(camera);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const loader = new THREE.TextureLoader();
  const disposables: { dispose: () => void }[] = [envTex, pmrem];

  /* ---------- lights ---------- */
  const hemi = new THREE.HemisphereLight("#b68e68", "#2c1a10", 0.78);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight("#ffe2b8", 1.6);
  sun.position.set(14, 30, -10);
  sun.target.position.set(0, -10, -30);
  scene.add(sun, sun.target);
  const lantern = new THREE.PointLight("#ffdfb4", 3.2, 14, 1.8);
  camera.add(lantern);
  lantern.position.set(0.6, 0.8, -0.6);
  const pools: THREE.PointLight[] = [];
  const poolSpots: V3[] = [
    [1.5, -7.5, 2], [3.5, -4.5, -6], [-4, -5, -19], [4.2, -4.4, -31], [-2.5, -3.6, -42],
  ];
  for (const s of poolSpots) {
    const l = new THREE.PointLight("#ffbf6e", 26, 16, 2);
    l.position.set(...s);
    scene.add(l);
    pools.push(l);
  }
  const surfaceGlow = new THREE.PointLight("#ffa94d", 0, 34, 1.6);
  surfaceGlow.position.set(0, -0.6, EMERGE_Z - 3);
  scene.add(surfaceGlow);

  /* ---------- underground group ---------- */
  const under = new THREE.Group();
  scene.add(under);

  // path samples for clearance tests
  const pathPts: THREE.Vector3[] = [];
  for (let i = 0; i <= 260; i++) {
    const p = (i / 260) * 0.56;
    pathPts.push(posCurve.getPoint(pToU(p)));
  }
  const distToPath = (x: number, y: number, z: number) => {
    let m = Infinity;
    for (const q of pathPts) {
      const dx = q.x - x, dy = q.y - y, dz = q.z - z;
      const d = dx * dx + dy * dy + dz * dz;
      if (d < m) m = d;
    }
    return Math.sqrt(m);
  };

  // soil aggregates (triplanar photographic soil texture)
  const soilUniforms = { uSoil: { value: null as THREE.Texture | null }, uScale: { value: 0.55 } };
  const clodMat = new THREE.MeshStandardMaterial({ color: "#8a6140", roughness: 0.92, metalness: 0 });
  clodMat.onBeforeCompile = (sh) => {
    sh.uniforms.uSoil = soilUniforms.uSoil;
    sh.uniforms.uScale = soilUniforms.uScale;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vObjP;\nvarying vec3 vObjN;")
      .replace("#include <begin_vertex>", "#include <begin_vertex>\nvObjP = position;\nvObjN = normal;");
    sh.fragmentShader = sh.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vObjP;\nvarying vec3 vObjN;\nuniform sampler2D uSoil;\nuniform float uScale;",
      )
      .replace(
        "#include <map_fragment>",
        `vec3 bl = pow(abs(normalize(vObjN)), vec3(4.0)); bl /= (bl.x + bl.y + bl.z);
         vec3 tp = vObjP * uScale + 0.37;
         vec4 tx = texture2D(uSoil, tp.yz); vec4 ty = texture2D(uSoil, tp.xz); vec4 tz = texture2D(uSoil, tp.xy);
         vec4 soilTex = tx * bl.x + ty * bl.y + tz * bl.z;
         diffuseColor.rgb *= soilTex.rgb * 1.6;`,
      );
  };
  disposables.push(clodMat);

  const clodGeos = [clodGeometry(1, hi ? 4 : 3), clodGeometry(2, hi ? 3 : 2), clodGeometry(3, hi ? 3 : 2)];
  clodGeos.forEach((g) => disposables.push(g));
  const CLODS = hi ? 1350 : 560;
  const clodMeshes = clodGeos.map((g) => {
    const m = new THREE.InstancedMesh(g, clodMat, Math.ceil(CLODS / 3) + 200);
    m.count = 0;
    under.add(m);
    return m;
  });
  {
    const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    const sc = new THREE.Vector3(), ps = new THREE.Vector3(), col = new THREE.Color();
    let placed = 0, tries = 0;
    const place = (x: number, y: number, z: number, s: number) => {
      const m = clodMeshes[placed % 3];
      e.set(r() * 6.28, r() * 6.28, r() * 6.28);
      q.setFromEuler(e);
      sc.set(s * (0.8 + r() * 0.5), s * (0.7 + r() * 0.4), s * (0.8 + r() * 0.5));
      ps.set(x, y, z);
      mtx.compose(ps, q, sc);
      m.setMatrixAt(m.count, mtx);
      const k = 0.72 + r() * 0.45;
      col.setRGB(k * (1.05 + r() * 0.08), k * (0.92 + r() * 0.06), k * 0.78);
      m.setColorAt(m.count, col);
      m.count++;
      placed++;
    };
    while (placed < CLODS && tries < CLODS * 30) {
      tries++;
      const x = (r() - 0.5) * 30;
      const y = -26 + r() * 25.8;
      const z = 10 - r() * 72;
      // size distribution: mostly small crumbs, some large aggregates
      const u = r();
      const s = u < 0.65 ? 0.12 + r() * 0.45 : u < 0.92 ? 0.5 + r() * 1.0 : 1.4 + r() * 1.8;
      const d = distToPath(x, y, z);
      const clear = y > -3.2 && Math.abs(z - EMERGE_Z) < 7 ? 0.55 : 1.9;
      if (d < clear + s) continue;
      if (y + s * 0.8 > -0.05) continue;
      place(x, y, z, s);
    }
    // dense topsoil crumbs around the ascent shaft — camera brushes past them
    for (let i = 0; i < (hi ? 320 : 140); i++) {
      const a = r() * Math.PI * 2;
      const rad = 0.75 + r() * 3.2;
      const y = -7 + r() * 6.8;
      const t = clamp01((y + 7) / 7);
      const zc = lerp(-46, EMERGE_Z - 0.5, t);
      const s = 0.06 + r() * 0.28;
      if (y + s > -0.05) continue;
      place(Math.cos(a) * rad, y, zc + Math.sin(a) * rad, s);
    }
    clodMeshes.forEach((m) => {
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
      m.computeBoundingSphere();
    });
  }

  // root network — slender guide filaments illuminated by natural root particles
  const rootUniforms = { uTime: { value: 0 } };
  const rootMat = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    vertexColors: true,
    roughness: 0.5,
    metalness: 0.02,
    transparent: true,
    opacity: 0.42,
    emissive: "#523419",
    emissiveIntensity: 0.45,
  });
  rootMat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = rootUniforms.uTime;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         float sway = clamp(-position.y * 0.06, 0.0, 1.0);
         transformed.x += sin(uTime * 0.55 + position.y * 0.9 + position.z * 0.3) * 0.035 * sway;
         transformed.z += cos(uTime * 0.42 + position.y * 0.7 + position.x * 0.4) * 0.025 * sway;`,
      );
  };
  disposables.push(rootMat);
  const roots: RootBuild = { tubes: [], hairs: [], curves: [] };
  const avoid = (p: THREE.Vector3) => {
    let best: THREE.Vector3 | null = null;
    let m = Infinity;
    for (let i = 0; i < pathPts.length; i += 2) {
      const q = pathPts[i];
      const d = q.distanceToSquared(p);
      if (d < m) {
        m = d;
        best = q;
      }
    }
    if (!best) return null;
    const d = Math.sqrt(m);
    if (d > 1.25) return null;
    return p.clone().sub(best).setY(0).normalize().multiplyScalar(1.25 - d + 0.05);
  };

  // Natural slender root guide taproots (clean, elegant, never overcrowded)
  const rootSites: { x: number; z: number; len: number }[] = [
    { x: -1.8, z: 2.0, len: 9.5 },
    { x: 1.9, z: -7.5, len: 10.5 },
    { x: -2.0, z: -17.0, len: 11.0 },
    { x: 2.2, z: -27.0, len: 11.5 },
    { x: -1.9, z: -37.0, len: 10.5 },
    { x: 1.8, z: -47.0, len: 9.5 },
  ];
  for (const s of rootSites) {
    growRoot(
      r,
      roots,
      new THREE.Vector3(s.x, -0.15, s.z),
      new THREE.Vector3((r() - 0.5) * 0.25, -1, (r() - 0.5) * 0.25),
      s.len,
      0.045, // slender, delicate botanical filament (NOT heavy thick tubes)
      0,
      1,     // only 1 gentle level of branching
      avoid,
    );
  }
  const rootGeo = mergeGeometries(roots.tubes)!;
  roots.tubes.forEach((g) => g.dispose());
  const rootMesh = new THREE.Mesh(rootGeo, rootMat);
  under.add(rootMesh);
  disposables.push(rootGeo);

  // ------------------------------------------------------------------
  // NATURAL ROOTS PARTICLES SYSTEM
  // Replaces dense, tangled root geometry with radiant, natural particles
  // tracing the living botanical root pathways and rhizosphere.
  // ------------------------------------------------------------------
  const ROOT_PARTICLE_COUNT = hi ? 4800 : 2200;
  const rootPartColors = [
    new THREE.Color("#fff5db"), // radiant ivory root cap
    new THREE.Color("#fde68a"), // warm golden sap
    new THREE.Color("#fcd34d"), // amber nutrient stream
    new THREE.Color("#f59e0b"), // golden mycorrhizal spore
    new THREE.Color("#fed7aa"), // soft root flare amber
    new THREE.Color("#86efac"), // living botanical chloroplast gold
  ];

  const rootParticleMeta: { curveIdx: number; t: number; speed: number; radialOffset: THREE.Vector3 }[] = [];
  const rootParticlePos = new Float32Array(ROOT_PARTICLE_COUNT * 3);
  const rootParticleCol = new Float32Array(ROOT_PARTICLE_COUNT * 3);
  const rootParticleSize = new Float32Array(ROOT_PARTICLE_COUNT);
  const rootParticlePhase = new Float32Array(ROOT_PARTICLE_COUNT);

  for (let i = 0; i < ROOT_PARTICLE_COUNT; i++) {
    const cIdx = Math.floor(r() * roots.curves.length);
    const curve = roots.curves[cIdx];
    const t = r();
    const speed = 0.008 + r() * 0.024;
    
    // Most particles cling tightly to the root curve; some float gently in the rhizosphere halo
    const isHalo = r() < 0.28;
    const spread = isHalo ? 0.08 + r() * 0.22 : 0.015 + r() * 0.04;
    const angle = r() * Math.PI * 2;
    const radialOffset = new THREE.Vector3(Math.cos(angle) * spread, (r() - 0.5) * spread * 0.6, Math.sin(angle) * spread);

    const pt = curve.getPointAt(t).add(radialOffset);
    rootParticlePos[i * 3] = pt.x;
    rootParticlePos[i * 3 + 1] = pt.y;
    rootParticlePos[i * 3 + 2] = pt.z;

    const baseCol = rootPartColors[Math.floor(r() * rootPartColors.length)];
    const bright = 0.9 + r() * 0.5;
    rootParticleCol[i * 3] = Math.min(1.0, baseCol.r * bright);
    rootParticleCol[i * 3 + 1] = Math.min(1.0, baseCol.g * bright);
    rootParticleCol[i * 3 + 2] = Math.min(1.0, baseCol.b * bright);

    rootParticleSize[i] = isHalo ? 0.025 + r() * 0.04 : 0.04 + r() * 0.065;
    rootParticlePhase[i] = r();

    rootParticleMeta.push({ curveIdx: cIdx, t, speed, radialOffset });
  }

  const rootPartGeo = new THREE.BufferGeometry();
  rootPartGeo.setAttribute("position", new THREE.BufferAttribute(rootParticlePos, 3));
  rootPartGeo.setAttribute("color", new THREE.BufferAttribute(rootParticleCol, 3));
  rootPartGeo.setAttribute("aSize", new THREE.BufferAttribute(rootParticleSize, 1));
  rootPartGeo.setAttribute("aPhase", new THREE.BufferAttribute(rootParticlePhase, 1));

  const rootParticlesMat = new THREE.ShaderMaterial({
    vertexShader: softPointVert,
    fragmentShader: softPointFrag,
    uniforms: {
      uTime: { value: 0 },
      uOpacity: { value: 0.9 },
      uScale: { value: 240 },
      uDrift: { value: 0.08 },
      uCore: { value: 0.65 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const naturalRootParticles = new THREE.Points(rootPartGeo, rootParticlesMat);
  under.add(naturalRootParticles);
  disposables.push(rootPartGeo, rootParticlesMat);

  // moisture droplets
  const dropMat = new THREE.MeshPhysicalMaterial({
    color: "#ffffff",
    roughness: 0.03,
    metalness: 0,
    transparent: true,
    opacity: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.02,
    envMap: envTex,
    envMapIntensity: 1.1,
    ior: 1.33,
  });
  const dropGeo = new THREE.SphereGeometry(1, 18, 14);
  const DROPS = hi ? 260 : 110;
  const drops = new THREE.InstancedMesh(dropGeo, dropMat, DROPS);
  const dropBase: { p: THREE.Vector3; s: number; ph: number }[] = [];
  for (let i = 0; i < DROPS; i++) {
    let p: THREE.Vector3;
    if (i < DROPS * 0.45 && roots.curves.length) {
      // beads clinging to roots
      const c = roots.curves[Math.floor(r() * roots.curves.length)];
      p = c.getPointAt(r()).add(new THREE.Vector3((r() - 0.5) * 0.12, -0.04, (r() - 0.5) * 0.12));
    } else {
      p = new THREE.Vector3((r() - 0.5) * 9, -12 + r() * 11, 4 - r() * 58);
      if (distToPath(p.x, p.y, p.z) < 0.6) p.x += 1.2;
    }
    dropBase.push({ p, s: 0.025 + Math.pow(r(), 2.2) * 0.11, ph: r() * 10 });
  }
  under.add(drops);
  disposables.push(dropGeo, dropMat);

  // nutrient micro-particles: N green, P amber, K violet, Ca ivory, Mg turquoise
  const NUTRIENT_COLORS = ["#7fb36a", "#d9a55b", "#9886b8", "#ede3cf", "#68b5ac"].map((h) => new THREE.Color(h));
  const makePoints = (
    count: number,
    gen: (i: number) => { p: THREE.Vector3; c: THREE.Color; s: number },
    uniforms: { uOpacity: number; uScale: number; uDrift: number; uCore: number },
  ) => {
    const pos = new Float32Array(count * 3), col = new Float32Array(count * 3), size = new Float32Array(count), ph = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const g = gen(i);
      pos.set([g.p.x, g.p.y, g.p.z], i * 3);
      col.set([g.c.r, g.c.g, g.c.b], i * 3);
      size[i] = g.s;
      ph[i] = r();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(ph, 1));
    const mat = new THREE.ShaderMaterial({
      vertexShader: softPointVert,
      fragmentShader: softPointFrag,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: uniforms.uOpacity },
        uScale: { value: uniforms.uScale },
        uDrift: { value: uniforms.uDrift },
        uCore: { value: uniforms.uCore },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    disposables.push(geo, mat);
    return new THREE.Points(geo, mat);
  };

  // Natural 3D Mud Particles & Loam Granules (Opening Sequence: starts with actual mud particles, then continued with roots)
  const MUD_PARTICLE_COUNT = hi ? 2600 : 1100;
  const mudPartColors = [
    new THREE.Color("#734b2a"), // rich moist agricultural loam
    new THREE.Color("#8d5e38"), // warm fertile crumb
    new THREE.Color("#a67347"), // golden organic humus
    new THREE.Color("#5e3d23"), // deep fertile earth
    new THREE.Color("#cda066"), // golden mineral speckle
    new THREE.Color("#ba8a54"), // amber topsoil grain
  ];
  const mudParticles = makePoints(
    MUD_PARTICLE_COUNT,
    () => {
      // Clustered right around the opening camera corridor (z from 9 to -7, y from -10.5 to -7.5, x from -4.5 to 4.5)
      const p = new THREE.Vector3(
        (r() - 0.5) * 9.5,
        -9.0 + (r() - 0.5) * 3.8,
        8.5 - r() * 16.5,
      );
      const c = mudPartColors[Math.floor(r() * mudPartColors.length)].clone().multiplyScalar(0.85 + r() * 0.4);
      const s = 0.045 + Math.pow(r(), 1.6) * 0.18;
      return { p, c, s };
    },
    { uOpacity: 0.95, uScale: 260, uDrift: 0.22, uCore: 0.5 },
  );
  under.add(mudParticles);

  const nutrients = makePoints(
    hi ? 2200 : 900,
    () => {
      const p = new THREE.Vector3((r() - 0.5) * 14, -15 + r() * 14.5, 2 - r() * 60);
      return { p, c: NUTRIENT_COLORS[Math.floor(r() * 5)], s: 0.05 + r() * 0.07 };
    },
    { uOpacity: 0, uScale: 240, uDrift: 0.22, uCore: 0.6 },
  );
  under.add(nutrients);

  const minerals = makePoints(
    hi ? 1800 : 700,
    () => {
      const p = new THREE.Vector3((r() - 0.5) * 18, -18 + r() * 17.8, 8 - r() * 66);
      const k = 0.35 + r() * 0.4;
      return { p, c: new THREE.Color(k, k * 0.86, k * 0.66), s: 0.02 + r() * 0.03 };
    },
    { uOpacity: 0.55, uScale: 240, uDrift: 0.08, uCore: 0.2 },
  );
  under.add(minerals);

  const dust = makePoints(
    hi ? 1600 : 600,
    () => {
      const p = new THREE.Vector3((r() - 0.5) * 16, -14 + r() * 13.8, 6 - r() * 64);
      return { p, c: new THREE.Color("#ffcf8a").multiplyScalar(0.7 + r() * 0.5), s: 0.025 + r() * 0.035 };
    },
    { uOpacity: 0.5, uScale: 240, uDrift: 0.35, uCore: 0.0 },
  );
  under.add(dust);

  // sparks flowing up along roots (nutrient uptake)
  const SPARKS = hi ? 320 : 140;
  const sparkPos = new Float32Array(SPARKS * 3);
  const sparkMeta: { c: THREE.CatmullRomCurve3; t: number; v: number }[] = [];
  const sparks = makePoints(
    SPARKS,
    () => ({ p: new THREE.Vector3(), c: NUTRIENT_COLORS[Math.floor(r() * 5)].clone().multiplyScalar(1.3), s: 0.07 + r() * 0.05 }),
    { uOpacity: 0, uScale: 240, uDrift: 0.0, uCore: 0.35 },
  );
  for (let i = 0; i < SPARKS; i++) {
    const c = roots.curves[Math.floor(r() * roots.curves.length)];
    sparkMeta.push({ c, t: r(), v: 0.012 + r() * 0.03 });
  }
  under.add(sparks);

  // volumetric light shafts (camera-facing around their own axis)
  const rays: { mesh: THREE.Mesh; axis: THREE.Vector3; mat: THREE.ShaderMaterial; base: number }[] = [];
  const rayGeo = new THREE.PlaneGeometry(1, 1);
  disposables.push(rayGeo);
  const raySpecs: { top: V3; dir: V3; w: number; l: number; k: number }[] = [
    { top: [6, 0, 2], dir: [-0.45, -1, -0.25], w: 3.2, l: 22, k: 0.55 },
    { top: [3, 0, -8], dir: [-0.35, -1, -0.15], w: 1.6, l: 18, k: 0.45 },
    { top: [-5, 0, -14], dir: [0.3, -1, -0.2], w: 2.4, l: 20, k: 0.4 },
    { top: [5, 0, -24], dir: [-0.4, -1, 0.1], w: 2.8, l: 22, k: 0.5 },
    { top: [-2, 0, -33], dir: [0.15, -1, -0.3], w: 1.8, l: 17, k: 0.45 },
    { top: [2.5, 0, -42], dir: [-0.2, -1, 0.1], w: 3.4, l: 20, k: 0.7 },
    { top: [0.5, 0, EMERGE_Z - 1], dir: [0.05, -1, 0.35], w: 4.5, l: 16, k: 1.0 },
    { top: [-2.5, 0, EMERGE_Z - 3], dir: [0.25, -1, 0.2], w: 2.2, l: 14, k: 0.8 },
    { top: [3.5, 0, EMERGE_Z + 2], dir: [-0.3, -1, -0.15], w: 2.0, l: 14, k: 0.7 },
  ];
  raySpecs.forEach((s, i) => {
    const mat = new THREE.ShaderMaterial({
      vertexShader: rayVert,
      fragmentShader: rayFrag,
      uniforms: {
        uColor: { value: new THREE.Color("#ffc27a") },
        uIntensity: { value: 0 },
        uTime: { value: 0 },
        uSeed: { value: i * 1.7 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      fog: false,
    });
    disposables.push(mat);
    const mesh = new THREE.Mesh(rayGeo, mat);
    const axis = new THREE.Vector3(...s.dir).normalize();
    mesh.scale.set(s.w, s.l, 1);
    mesh.position.set(...s.top).addScaledVector(axis, s.l / 2);
    mesh.position.y = Math.min(mesh.position.y, -0.2);
    mesh.renderOrder = 5;
    under.add(mesh);
    rays.push({ mesh, axis: axis.clone().negate(), mat, base: s.k });
  });

  /* ---------- farm group ---------- */
  const farm = new THREE.Group();
  farm.visible = false;
  scene.add(farm);

  const SUN_DIR = new THREE.Vector3(-0.55, 0.16, -1).normalize();
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(1200, 32, 16),
    new THREE.ShaderMaterial({
      vertexShader: skyVert,
      fragmentShader: skyFrag,
      side: THREE.BackSide,
      depthWrite: false,
      fog: false,
      uniforms: {
        uTop: { value: new THREE.Color("#c6bdb3") },
        uHorizon: { value: new THREE.Color("#ecc9a2") },
        uSunDir: { value: SUN_DIR },
        uSunColor: { value: new THREE.Color("#ffd9a0") },
      },
    }),
  );
  sky.renderOrder = -10;
  farm.add(sky);
  disposables.push(sky.geometry, sky.material as THREE.Material);

  // photographic horizon plate (Deccan field at golden hour) — sky + tree line only
  const plateMat = new THREE.ShaderMaterial({
    vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: plateFrag,
    uniforms: { uMap: { value: null as THREE.Texture | null }, uOpacity: { value: 1 }, uHaze: { value: FARM_FOG.clone() } },
    transparent: true,
    depthWrite: false,
    fog: false,
  });
  const PLATE_W = 1500, PLATE_H = PLATE_W * (768 / 1376);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(PLATE_W, PLATE_H), plateMat);
  // image horizon sits ~28% from the top → align it with eye level
  plate.position.set(0, 4 - (0.5 - 0.28) * PLATE_H, -520);
  plate.renderOrder = -9;
  farm.add(plate);
  disposables.push(plate.geometry, plateMat);

  const fieldTex = fieldTexture(r);
  fieldTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(1100, 1100),
    new THREE.MeshStandardMaterial({ map: fieldTex, roughness: 1, metalness: 0, color: "#c9c2a0" }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, 0, -100);
  farm.add(ground);
  disposables.push(ground.geometry, ground.material as THREE.Material, fieldTex);

  // furrow strip under the 3D crops (rich brown soil between rows)
  const furrowC = document.createElement("canvas");
  furrowC.width = 64;
  furrowC.height = 4;
  {
    const g = furrowC.getContext("2d")!;
    g.fillStyle = "#3b2a19";
    g.fillRect(0, 0, 64, 4);
    g.fillStyle = "#3f5418";
    g.fillRect(14, 0, 36, 4);
  }
  const furrowTex = new THREE.CanvasTexture(furrowC);
  furrowTex.colorSpace = THREE.SRGBColorSpace;
  furrowTex.wrapS = furrowTex.wrapT = THREE.RepeatWrapping;
  const ROW = 0.95;
  const FIELD_HALF_X = hi ? 34 : 20;
  const FIELD_Z0 = -18, FIELD_Z1 = hi ? -160 : -120;
  furrowTex.repeat.set((FIELD_HALF_X * 2) / ROW, 1);
  furrowTex.offset.set(0.5 - ((FIELD_HALF_X % ROW) / ROW), 0);
  furrowTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const furrows = new THREE.Mesh(
    new THREE.PlaneGeometry(FIELD_HALF_X * 2, FIELD_Z0 - FIELD_Z1),
    new THREE.MeshStandardMaterial({ map: furrowTex, roughness: 1 }),
  );
  furrows.rotation.x = -Math.PI / 2;
  furrows.position.set(0, 0.01, (FIELD_Z0 + FIELD_Z1) / 2);
  farm.add(furrows);
  disposables.push(furrows.geometry, furrows.material as THREE.Material, furrowTex);

  // crops with wind
  const windUniforms = { uTime: { value: 0 }, uGust: { value: 1 } };
  const cropMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.62,
    metalness: 0,
  });
  cropMat.onBeforeCompile = (sh) => {
    sh.uniforms.uTime = windUniforms.uTime;
    sh.uniforms.uGust = windUniforms.uGust;
    sh.vertexShader = sh.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;\nuniform float uGust;\nvarying float vH;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         vec3 org = vec3(instanceMatrix[3][0], 0.0, instanceMatrix[3][2]);
         float hgt = clamp(position.y / 1.25, 0.0, 1.0);
         vH = hgt;
         float wave = sin(uTime * 1.35 + org.x * 0.21 + org.z * 0.17)
                    + 0.5 * sin(uTime * 2.3 + org.x * 0.6 - org.z * 0.33);
         float gust = 0.5 + 0.5 * sin(org.z * 0.08 + uTime * 0.9);
         float bend = (wave * 0.09 + gust * 0.16) * uGust * hgt * hgt;
         transformed.x += bend;
         transformed.z += bend * 0.35;
         transformed.y -= abs(bend) * 0.25;`,
      );
    sh.fragmentShader = sh.fragmentShader
      .replace("#include <common>", "#include <common>\nvarying float vH;")
      .replace(
        "#include <emissivemap_fragment>",
        "#include <emissivemap_fragment>\ntotalEmissiveRadiance += diffuseColor.rgb * vec3(0.55, 0.5, 0.18) * (vH * vH) * 0.55;",
      );
  };
  disposables.push(cropMat);
  const clump = bladeClump(r, 7);
  disposables.push(clump);
  const rowsN = Math.floor((FIELD_HALF_X * 2) / ROW);
  const perRow = Math.floor((FIELD_Z0 - FIELD_Z1) / 0.42);
  const crops = new THREE.InstancedMesh(clump, cropMat, rowsN * perRow);
  {
    const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    const sc = new THREE.Vector3(), ps = new THREE.Vector3(), col = new THREE.Color();
    let n = 0;
    for (let i = 0; i < rowsN; i++) {
      const x = -FIELD_HALF_X + ROW / 2 + i * ROW;
      if (Math.abs(x) < 0.3) continue; // furrow the camera rises through
      for (let j = 0; j < perRow; j++) {
        const z = FIELD_Z0 - j * 0.42 - r() * 0.2;
        const dist = Math.abs(z - EMERGE_Z);
        e.set(0, r() * 6.28, 0);
        q.setFromEuler(e);
        const s = (0.85 + r() * 0.45) * (dist < 30 ? 1 : 1.08);
        sc.set(s, s * (0.9 + r() * 0.35), s);
        ps.set(x + (r() - 0.5) * 0.14, 0, z);
        mtx.compose(ps, q, sc);
        crops.setMatrixAt(n, mtx);
        const k = 0.78 + r() * 0.34;
        col.setRGB(k * (0.95 + r() * 0.1), k, k * (0.85 + r() * 0.15));
        crops.setColorAt(n, col);
        n++;
      }
    }
    crops.count = n;
    crops.instanceMatrix.needsUpdate = true;
    if (crops.instanceColor) crops.instanceColor.needsUpdate = true;
    crops.computeBoundingSphere();
  }
  farm.add(crops);

  // trees & hedgerows for parallax
  const treeGeo = treeGeometry(r);
  disposables.push(treeGeo);
  const treeMat = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.9, flatShading: false });
  disposables.push(treeMat);
  const TREES = hi ? 170 : 80;
  const trees = new THREE.InstancedMesh(treeGeo, treeMat, TREES);
  {
    const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
    const sc = new THREE.Vector3(), ps = new THREE.Vector3();
    for (let i = 0; i < TREES; i++) {
      let x: number, z: number;
      if (i < TREES * 0.25) {
        // loose tree line well beyond our field, softened by haze
        x = (r() - 0.5) * 420;
        z = FIELD_Z1 - 60 - r() * 120;
      } else {
        x = (r() > 0.5 ? 1 : -1) * (FIELD_HALF_X + 12 + r() * 160);
        z = -30 - r() * 340;
      }
      e.set(0, r() * 6.28, 0);
      q.setFromEuler(e);
      const s = 0.8 + r() * 2.2;
      sc.set(s * (0.8 + r() * 0.5), s * (0.8 + r() * 0.5), s * (0.8 + r() * 0.5));
      ps.set(x, 0, z);
      mtx.compose(ps, q, sc);
      trees.setMatrixAt(i, mtx);
    }
    trees.instanceMatrix.needsUpdate = true;
    trees.computeBoundingSphere();
  }
  farm.add(trees);

  // golden pollen in the air
  const pollen = makePoints(
    hi ? 900 : 350,
    () => {
      const p = new THREE.Vector3((r() - 0.5) * 40, 0.3 + r() * 14, -20 - r() * 90);
      return { p, c: new THREE.Color("#ffe2a6").multiplyScalar(0.6 + r() * 0.5), s: 0.05 + r() * 0.07 };
    },
    { uOpacity: 0.0, uScale: 240, uDrift: 0.6, uCore: 0.0 },
  );
  farm.add(pollen);

  /* ---------- lens bokeh (depth-of-field feel) ---------- */
  const bokehCount = hi ? 46 : 24;
  const bokeh = makePoints(
    bokehCount,
    () => {
      const z = -1.2 - r() * 2.6;
      const p = new THREE.Vector3((r() - 0.5) * 3.4 * -z * 0.6, (r() - 0.5) * 2.2 * -z * 0.6, z);
      return { p, c: new THREE.Color("#c99a62").multiplyScalar(0.35 + r() * 0.3), s: 0.12 + r() * 0.22 };
    },
    { uOpacity: 0.32, uScale: 240, uDrift: 0.12, uCore: 0.0 },
  );
  bokeh.renderOrder = 20;
  camera.add(bokeh);
  const bokehMat = bokeh.material as THREE.ShaderMaterial;

  /* ---------- post ---------- */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  // guard against NaN/Inf pixels from any GPU driver before bloom spreads them
  composer.addPass(
    new ShaderPass({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `uniform sampler2D tDiffuse; varying vec2 vUv;
        void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb;
          bool ok = c.r >= 0.0 && c.g >= 0.0 && c.b >= 0.0 && c.r < 6.0e4 && c.g < 6.0e4 && c.b < 6.0e4;
          gl_FragColor = vec4(ok ? min(c, vec3(48.0)) : vec3(0.0), 1.0); }`,
    }),
  );
  const bloom = new UnrealBloomPass(new THREE.Vector2(256, 256), 0.42, 0.55, 0.82);
  composer.addPass(bloom);
  const grade = new ShaderPass(gradeShader);
  composer.addPass(grade);
  composer.addPass(new OutputPass());

  /* ---------- texture loading ---------- */
  const ready = Promise.all([
    loadTex(loader, "/images/soil-roots-cinematic.jpg"),
    loadTex(loader, "/images/generated/hero_scene_4_lush_green_field.jpg"),
  ]).then(([soil, horizon]) => {
    soil.wrapS = soil.wrapT = THREE.MirroredRepeatWrapping;
    soil.anisotropy = 4;
    soilUniforms.uSoil.value = soil;
    plateMat.uniforms.uMap.value = horizon;
    disposables.push(soil, horizon);
    // compile everything once up-front so the emergence never hitches
    farm.visible = true;
    under.visible = true;
    renderer.compile(scene, camera);
    farm.visible = false;
  });

  /* ---------- state & loop ---------- */
  let target = 0, prog = 0;
  let active = true;
  let raf = 0;
  let px = 0, py = 0, spx = 0, spy = 0;
  const clock = new THREE.Clock();
  const pos = new THREE.Vector3(), look = new THREE.Vector3();
  const tmpM = new THREE.Matrix4(), tmpQ = new THREE.Quaternion(), tmpS = new THREE.Vector3(), tmpP = new THREE.Vector3();
  const toCam = new THREE.Vector3(), nrm = new THREE.Vector3(), xAx = new THREE.Vector3(), basis = new THREE.Matrix4();
  const fogUnder = UNDER_FOG, fogFarm = FARM_FOG;
  const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!active) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    prog += (target - prog) * (1 - Math.exp(-dt * 4.2));
    const p = prog;

    // camera along the spline + gentle handheld drift + pointer parallax
    const u = pToU(p);
    posCurve.getPoint(u, pos);
    lookCurve.getPoint(u, look);
    spx += (px - spx) * 0.04;
    spy += (py - spy) * 0.04;
    const drift = reduced ? 0 : 1;
    pos.x += (Math.sin(t * 0.21) * 0.12 + spx * 0.35) * drift;
    pos.y += (Math.sin(t * 0.17 + 1.3) * 0.08 + spy * 0.2) * drift;
    // idle creep forward at the very start so the soil is alive before scrolling
    pos.z -= (1 - smooth(0, 0.08, p)) * (Math.sin(t * 0.1) * 0.6 + 0.6) * drift;
    camera.position.copy(pos);
    look.x += spx * 0.8;
    camera.lookAt(look);
    // slight roll while travelling through soil
    camera.rotateZ(Math.sin(t * 0.13) * 0.012 * drift - spx * 0.01);

    const y = pos.y;
    const surf = smooth(-1.4, 1.2, y); // 0 underground → 1 above ground
    const ascend = smooth(0.44, 0.72, p); // held back further so the roots stay visible longer before the light washes in
    const nutrientIn = band(p, 0.22, 0.30, 0.48, 0.58);
    const flash = band(y, -1.6, -0.3, 0.2, 1.4);

    // visibility culls — keep underground roots visible during emergence transition
    under.visible = y < 2.0;
    farm.visible = y > -2.5;

    // atmosphere
    fog.color.copy(fogUnder).lerp(fogFarm, surf);
    fog.density = lerp(lerp(0.048, 0.028, ascend), 0.0021, surf);
    (scene.background as THREE.Color).copy(fog.color);
    renderer.toneMappingExposure = lerp(lerp(1.05, 1.18, ascend), 1.0, surf);

    // lights
    hemi.intensity = lerp(0.48 + ascend * 0.45, 1.15, surf);
    hemi.color.set(surf > 0.5 ? "#e8ddc8" : "#8c7255");
    hemi.groundColor.set(surf > 0.5 ? "#4c4a22" : "#0f1c16");
    sun.intensity = lerp(1.2 + ascend * 1.3, 3.1, surf);
    if (surf > 0.5) {
      sun.position.copy(pos).addScaledVector(SUN_DIR, 200);
      sun.target.position.set(pos.x, 0, pos.z - 30);
      sun.color.set("#ffd7a1");
    } else {
      sun.position.set(14, 30, pos.z + 8);
      sun.target.position.set(0, -10, pos.z - 20);
      sun.color.set("#ffbe7a");
    }
    // keep root lantern light active and clear during transition
    lantern.intensity = lerp(2.8, 1.8, ascend) * (1 - surf);
    pools.forEach((l, i) => (l.intensity = (22 + Math.sin(t * 0.7 + i) * 3) * (1 - surf)));
    surfaceGlow.intensity = ascend * 45 * (1 - surf);

    // underground animation
    rootUniforms.uTime.value = t;
    for (const m of [mudParticles, naturalRootParticles, nutrients, minerals, dust, sparks, pollen, bokeh]) {
      (m.material as THREE.ShaderMaterial).uniforms.uTime.value = t;
    }
    // Natural mud particles: start with actual mud particles (p = 0), then smoothly part and disperse into the roots
    const mudParticleOpacity = smooth(0.18, 0.0, p);
    (mudParticles.material as THREE.ShaderMaterial).uniforms.uOpacity.value = mudParticleOpacity * 0.95;
    // Natural root particles: active throughout underground rhizosphere, glowing with living botanical energy
    const rootPartIn = band(p, 0.05, 0.12, 0.54, 0.65);
    (naturalRootParticles.material as THREE.ShaderMaterial).uniforms.uOpacity.value = (0.75 + rootPartIn * 0.25) * (1 - surf);
    (nutrients.material as THREE.ShaderMaterial).uniforms.uOpacity.value = nutrientIn * 1.15;
    (sparks.material as THREE.ShaderMaterial).uniforms.uOpacity.value = band(p, 0.20, 0.30, 0.54, 0.64) * 1.4;
    (dust.material as THREE.ShaderMaterial).uniforms.uOpacity.value = 0.35 + ascend * 0.6;
    (minerals.material as THREE.ShaderMaterial).uniforms.uOpacity.value = 0.55 * (1 - ascend * 0.75);
    (pollen.material as THREE.ShaderMaterial).uniforms.uOpacity.value = surf * 0.9;
    bokehMat.uniforms.uOpacity.value = lerp(0.3, 0.14, surf) * (1 - flash);

    if (under.visible) {
      // stream natural root particles along the living root curves
      const rPos = rootPartGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < ROOT_PARTICLE_COUNT; i++) {
        const meta = rootParticleMeta[i];
        meta.t -= meta.speed * dt * (reduced ? 0.3 : 1);
        if (meta.t < 0) meta.t += 1;
        const c = roots.curves[meta.curveIdx];
        c.getPointAt(meta.t, tmpP);
        tmpP.add(meta.radialOffset);
        rPos[i * 3] = tmpP.x;
        rPos[i * 3 + 1] = tmpP.y;
        rPos[i * 3 + 2] = tmpP.z;
      }
      rootPartGeo.attributes.position.needsUpdate = true;

      // sparks climbing the roots
      for (let i = 0; i < SPARKS; i++) {
        const s = sparkMeta[i];
        s.t -= s.v * dt * (reduced ? 0.3 : 1);
        if (s.t < 0) s.t += 1;
        s.c.getPointAt(s.t, tmpP);
        sparkPos[i * 3] = tmpP.x;
        sparkPos[i * 3 + 1] = tmpP.y;
        sparkPos[i * 3 + 2] = tmpP.z;
      }
      const sp = sparks.geometry.attributes.position as THREE.BufferAttribute;
      (sp.array as Float32Array).set(sparkPos);
      sp.needsUpdate = true;

      // suspended droplets bob slowly
      for (let i = 0; i < DROPS; i++) {
        const d = dropBase[i];
        tmpP.copy(d.p);
        tmpP.y += Math.sin(t * 0.5 + d.ph) * 0.03;
        tmpS.setScalar(d.s);
        tmpS.y *= 1.08;
        tmpM.compose(tmpP, tmpQ.identity(), tmpS);
        drops.setMatrixAt(i, tmpM);
      }
      drops.instanceMatrix.needsUpdate = true;

      // light shafts: golden sunlight rays shining down between the roots
      for (const ray of rays) {
        ray.mat.uniforms.uTime.value = t;
        const k = ray.base * (0.35 + ascend * 1.2);
        ray.mat.uniforms.uIntensity.value = k;
        // cylindrical billboard
        toCam.copy(camera.position).sub(ray.mesh.position);
        nrm.copy(toCam).addScaledVector(ray.axis, -toCam.dot(ray.axis)).normalize();
        xAx.crossVectors(ray.axis, nrm).normalize();
        basis.makeBasis(xAx, ray.axis, nrm);
        ray.mesh.quaternion.setFromRotationMatrix(basis);
      }
    }

    windUniforms.uTime.value = t;
    windUniforms.uGust.value = reduced ? 0.25 : 1;

    // post
    const g = grade.uniforms;
    g.uTime.value = t;
    g.uFlash.value = flash * 0.62;
    g.uUnder.value = 1 - surf;
    g.uVignette.value = lerp(0.55, 0.35, surf);
    bloom.strength = lerp(0.42 + ascend * 0.18, 0.28, surf) + flash * 0.35;

    composer.render(dt);
  }

  raf = requestAnimationFrame(frame);
  if (typeof window !== "undefined" && window.location.search.includes("debug")) {
    (window as unknown as Record<string, unknown>).__film = { scene, camera, renderer, composer, under, farm, bloom, grade };
  }

  return {
    ready,
    setProgress(p: number) {
      target = clamp01(p);
    },
    setPointer(x: number, y: number) {
      px = x;
      py = y;
    },
    resize(w: number, h: number) {
      renderer.setSize(w, h, false);
      composer.setSize(w, h);
      camera.aspect = w / h;
      // keep the composition on portrait phones
      camera.fov = w / h < 0.8 ? 66 : 52;
      camera.updateProjectionMatrix();
      grade.uniforms.uRes.value.set(w, h);
      bloom.resolution.set(w / 2, h / 2);
      const pr = renderer.getPixelRatio();
      for (const m of [mudParticles, naturalRootParticles, nutrients, minerals, dust, sparks, pollen, bokeh]) {
        (m.material as THREE.ShaderMaterial).uniforms.uScale.value = (h * pr) / 4.2;
      }
    },
    setActive(a: boolean) {
      if (a && !active) clock.getDelta();
      active = a;
    },
    dispose() {
      cancelAnimationFrame(raf);
      disposables.forEach((d) => d.dispose());
      composer.dispose();
      renderer.dispose();
    },
  };
}
