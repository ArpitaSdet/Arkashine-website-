// Pose keyframes for the pinned 3D stage (CLAUDE.md §5.3). Shared by the 3D scene and the DOM overlay.
// The device is ALWAYS closed: poses only rotate, tilt and move the camera.

const DEG = Math.PI / 180;

export type Pose = { ry: number; rx: number; dist: number; cx: number };

// 0 rest · 1 side (knob) · 2 top · 3 back · 4 other side · 5 front
export const POSES: Pose[] = [
  { ry: -25 * DEG, rx: 10 * DEG, dist: 0.82, cx: -1.65 },
  { ry: 90 * DEG, rx: 10 * DEG, dist: 0.95, cx: -1.4 },
  { ry: 90 * DEG, rx: 45 * DEG, dist: 1.05, cx: -1.35 },
  { ry: 180 * DEG, rx: 10 * DEG, dist: 1.05, cx: -1.35 },
  { ry: 270 * DEG, rx: 10 * DEG, dist: 1.05, cx: -1.0 },
  { ry: 360 * DEG, rx: 0, dist: 1, cx: -1.0 },
];

export const SEGMENTS = POSES.length - 1;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (t: number) => t * t * (3 - 2 * t);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export function easeOutBack(t: number, s = 1.9) {
  const c3 = s + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
}

/** Which segment the progress is in, and how far through it (0–1). */
export function segmentAt(p: number) {
  const x = clamp01(p) * SEGMENTS;
  const seg = Math.min(SEGMENTS - 1, Math.floor(x));
  return { seg, t: x - seg };
}

/** Nearest resting stop (0–5), used for cards and the dot indicator. */
export const stopAt = (p: number) => Math.round(clamp01(p) * SEGMENTS);

const out = { ry: 0, rx: 0, rz: 0, dist: 1, cx: 0, seg: 0, t: 0, turning: 0 };

/**
 * Pose for a scroll progress. Holds briefly at each face, moves faster between faces,
 * and leans ±4° on Z mid-turn. Returns a shared object (no per-frame allocation).
 */
export function poseAt(p: number) {
  const { seg, t } = segmentAt(p);
  const e = smoothstep(clamp01((t - 0.14) / 0.72));
  const a = POSES[seg];
  const b = POSES[seg + 1];
  out.ry = lerp(a.ry, b.ry, e);
  out.rx = lerp(a.rx, b.rx, e);
  out.dist = lerp(a.dist, b.dist, e);
  out.cx = lerp(a.cx, b.cx, e);
  out.turning = Math.sin(e * Math.PI);
  out.rz = out.turning * 4 * DEG * (seg % 2 === 0 ? 1 : -1);
  out.seg = seg;
  out.t = t;
  return out;
}

/** Bottle flight during segment 3 (side → other side). 0 = off-screen right, 1 = docked. */
export function bottleAt(p: number) {
  if (p >= 0.8) return 1;
  const { seg, t } = segmentAt(p);
  if (seg < 3) return 0;
  return clamp01((t - 0.05) / 0.8);
}

/** Paper out of the printer during the last segment. */
export function paperAt(p: number) {
  const { seg, t } = segmentAt(p);
  if (seg < 4) return 0;
  return clamp01((t - 0.45) / 0.45);
}

/** Logo glow around the top stop. */
export const glowAt = (p: number) => clamp01(1 - Math.abs(p - 0.4) / 0.1);
