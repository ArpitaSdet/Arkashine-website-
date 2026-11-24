/**
 * Interactive deployment globe (Three.js).
 * Real sphere + NASA Blue Marble photographic Earth texture (public domain),
 * with India + state boundaries sourced from Natural Earth 1:50m admin-0/1 data
 * (public domain, bundled at build time — see scripts/build_india_geo.py) instead
 * of hand-drawn approximations. Karnataka gets a botanical-green highlight;
 * every deployment marker sits at its real latitude/longitude.
 */
import * as THREE from "three";

export interface GlobeSite {
  id: string;
  lat: number;
  lng: number;
}
export interface Globe {
  setIntro(p: number): void;
  focus(id: string | null): void;
  setActive(a: boolean): void;
  resize(w: number, h: number): void;
  onPick(cb: (id: string) => void): void;
  dispose(): void;
  ready: Promise<void>;
}

type Ring = [number, number][]; // [lng, lat]
interface IndiaGeo {
  country: Ring[];
  states: Record<string, Ring[]>;
}

const D2R = Math.PI / 180;
export function latLng(lat: number, lng: number, r = 1) {
  const la = lat * D2R, lo = lng * D2R;
  return new THREE.Vector3(Math.cos(la) * Math.cos(lo) * r, Math.sin(la) * r, -Math.cos(la) * Math.sin(lo) * r);
}
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const KARNATAKA_SITE_STATES = new Set(["Karnataka"]);
// States that host a verified deployment but are not the HQ state — drawn with a
// quieter highlight than Karnataka's, never invented, always from the real boundary data.
const CONTEXT_STATES = new Set(["Kerala", "Tamil Nadu", "Andhra Pradesh", "Odisha", "West Bengal", "Rajasthan", "Uttar Pradesh"]);

function maskTexture(geo: IndiaGeo) {
  const W = 4096, H = 2048;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d")!;
  g.fillStyle = "#000";
  g.fillRect(0, 0, W, H);
  const project = (lng: number, lat: number): [number, number] => [((lng + 180) / 360) * W, ((90 - lat) / 180) * H];
  const fillRings = (rings: Ring[], color: string) => {
    for (const ring of rings) {
      g.beginPath();
      ring.forEach(([lng, lat], i) => {
        const [x, y] = project(lng, lat);
        if (i) g.lineTo(x, y);
        else g.moveTo(x, y);
      });
      g.closePath();
      g.fillStyle = color;
      g.fill();
    }
  };
  // R = India (country outline), G = Karnataka + context-state deployment states
  fillRings(geo.country, "#ff0000");
  g.globalCompositeOperation = "lighter";
  for (const name of Object.keys(geo.states)) {
    if (KARNATAKA_SITE_STATES.has(name)) fillRings(geo.states[name], "#00ff00");
    else if (CONTEXT_STATES.has(name)) fillRings(geo.states[name], "#004d00"); // dimmer green channel
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;
  t.anisotropy = 4;
  return t;
}

function ringLine(ring: Ring, r: number, color: string, opacity: number) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < ring.length; i++) {
    const [lng, lat] = ring[i];
    pts.push(latLng(lat, lng, r));
  }
  pts.push(pts[0].clone());
  const g = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity, depthWrite: false });
  return new THREE.Line(g, mat);
}

function stateLines(rings: Ring[], r: number, color: string, opacity: number) {
  const group = new THREE.Group();
  for (const ring of rings) group.add(ringLine(ring, r, color, opacity));
  return group;
}

const earthVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vW;
  void main() {
    vUv = uv;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0);
    vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;
const earthFrag = /* glsl */ `
  uniform sampler2D uDay;
  uniform sampler2D uBump;
  uniform sampler2D uWater;
  uniform sampler2D uMask;
  uniform vec3 uLight;
  uniform float uIndia;
  uniform float uKa;
  uniform float uTime;
  uniform vec2 uTexel;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vW;
  void main() {
    vec3 day = texture2D(uDay, vUv).rgb;
    float ocean = texture2D(uWater, vUv).r;
    vec2 m = texture2D(uMask, vUv).rg;

    // cheap bump-mapped normal from the elevation texture (screen-space derivative free)
    float h0 = texture2D(uBump, vUv).r;
    float hx = texture2D(uBump, vUv + vec2(uTexel.x, 0.0)).r;
    float hy = texture2D(uBump, vUv + vec2(0.0, uTexel.y)).r;
    vec3 n = normalize(vN);
    vec3 t = normalize(cross(n, vec3(0.0, 1.0, 0.0) + vec3(0.0001)));
    vec3 b = normalize(cross(n, t));
    vec3 bumped = normalize(n + (t * (hx - h0) + b * (hy - h0)) * 6.0 * (1.0 - ocean));

    vec3 c = day * vec3(1.04, 1.01, 0.94);

    // India & Karnataka tint, subtle so the real photographic colour still reads through
    vec3 indiaC = mix(c, vec3(0.46, 0.64, 0.33), 0.38);
    c = mix(c, indiaC, m.r * uIndia * (1.0 - ocean * 0.85));
    float pulse = 0.85 + 0.15 * sin(uTime * 1.6);
    c = mix(c, vec3(0.64, 0.88, 0.44) * pulse, m.g * uKa * 0.55);

    vec3 v = normalize(cameraPosition - vW);
    // floor kept well above 0 so the globe never reads as black while it spins
    // through large angles toward India/Karnataka
    float diff = clamp(dot(bumped, normalize(uLight)) * 0.75 + 0.5, 0.22, 1.2);
    c *= diff;
    // ocean specular glint, lit side only
    vec3 hv = normalize(normalize(uLight) + v);
    float spec = pow(max(dot(bumped, hv), 0.0), 70.0) * ocean;
    c += vec3(1.0, 0.92, 0.75) * spec * 0.5 * clamp(dot(n, normalize(uLight)), 0.0, 1.0);
    // atmospheric rim
    float fr = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    c += vec3(0.42, 0.68, 0.46) * fr * 0.3;
    gl_FragColor = vec4(c, 1.0);
  }
`;
const atmoFrag = /* glsl */ `
  varying vec3 vN;
  varying vec3 vW;
  uniform float uOpacity;
  void main() {
    vec3 v = normalize(cameraPosition - vW);
    float f = pow(clamp(1.0 - abs(dot(normalize(vN), v)), 0.0, 1.0), 2.4);
    gl_FragColor = vec4(vec3(0.5, 0.78, 0.55) * f * 1.3 * uOpacity, f * uOpacity);
  }
`;

// a 1x1 placeholder so sampler uniforms are never null/undefined while the real
// textures are still loading — an unbound sampler can make some WebGL drivers
// silently skip the whole draw call rather than just render wrong-looking pixels.
function placeholder(r: number, g: number, b: number, a = 255) {
  const data = new Uint8Array([r, g, b, a]);
  const tex = new THREE.DataTexture(data, 1, 1);
  tex.needsUpdate = true;
  return tex;
}

export function createGlobe(canvas: HTMLCanvasElement, sites: GlobeSite[]): Globe {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.01, 50);
  camera.position.set(0, 0, 4.2);

  const tilt = new THREE.Group(); // rotation.x
  const spin = new THREE.Group(); // rotation.y
  tilt.add(spin);
  scene.add(tilt);

  const loader = new THREE.TextureLoader();
  const uniforms = {
    uDay: { value: placeholder(30, 46, 30) as THREE.Texture },
    uBump: { value: placeholder(128, 128, 128) as THREE.Texture },
    uWater: { value: placeholder(0, 0, 0) as THREE.Texture },
    uMask: { value: placeholder(0, 0, 0) as THREE.Texture },
    uLight: { value: new THREE.Vector3(-0.6, 0.5, 1) },
    uIndia: { value: 0 },
    uKa: { value: 0 },
    uTime: { value: 0 },
    uTexel: { value: new THREE.Vector2(1 / 4096, 1 / 2048) },
  };
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 160, 96),
    new THREE.ShaderMaterial({ vertexShader: earthVert, fragmentShader: earthFrag, uniforms }),
  );
  spin.add(earth);

  const atmoMat = new THREE.ShaderMaterial({
    vertexShader: earthVert,
    fragmentShader: atmoFrag,
    uniforms: { uOpacity: { value: 1 } },
    transparent: true,
    side: THREE.BackSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(1.14, 64, 32), atmoMat);
  scene.add(atmo);

  // boundary lines — filled in once the real geography loads
  const indiaOutline = new THREE.Group();
  const karnatakaOutline = new THREE.Group();
  const otherStates = new THREE.Group();
  spin.add(indiaOutline, karnatakaOutline, otherStates);
  let setOutlineOpacity = (_india: number, _ka: number) => {};

  // markers
  type Marker = { id: string; group: THREE.Group; ring: THREE.Mesh; dot: THREE.Mesh; base: THREE.Vector3; phase: number };
  const markers: Marker[] = [];
  const ringGeo = new THREE.RingGeometry(0.75, 1, 40);
  const dotGeo = new THREE.SphereGeometry(1, 16, 12);
  sites.forEach((s, i) => {
    const base = latLng(s.lat, s.lng, 1.004);
    const group = new THREE.Group();
    group.position.copy(base);
    group.lookAt(base.clone().multiplyScalar(2));
    const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: "#d9f2b8", transparent: true, opacity: 0 }));
    dot.scale.setScalar(0.0055);
    const ring = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({ color: "#8cbf5f", transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }),
    );
    ring.scale.setScalar(0.012);
    group.add(dot, ring);
    group.userData.id = s.id;
    dot.userData.id = s.id;
    spin.add(group);
    markers.push({ id: s.id, group, ring, dot, base, phase: i * 0.7 });
  });

  // view targets
  const INDIA_C = { lat: 21, lng: 79 };
  const KA_C = { lat: 16.6, lng: 77.5 };
  const rotFor = (lat: number, lng: number) => {
    const v = latLng(lat, lng);
    return { y: -Math.atan2(v.x, v.z), x: lat * D2R };
  };
  let intro = 0;
  let focusId: string | null = null;
  let rotY = 0, rotX = 0.3, dist = 4.2;
  let dragX = 0, dragY = 0;
  let active = true;
  let raf = 0;
  const clock = new THREE.Clock();
  let pickCb: ((id: string) => void) | null = null;

  // drag + click
  let down: { x: number; y: number; t: number } | null = null;
  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const onDown = (e: PointerEvent) => {
    down = { x: e.clientX, y: e.clientY, t: performance.now() };
  };
  const onMove = (e: PointerEvent) => {
    if (!down || intro < 0.85) return;
    dragX += (e.movementX || 0) * 0.004;
    dragY = Math.max(-0.5, Math.min(0.5, dragY + (e.movementY || 0) * 0.003));
  };
  const onUp = (e: PointerEvent) => {
    if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 6 && intro > 0.85) {
      const r = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      // generous hit test: nearest marker within a screen radius
      let best: string | null = null, bd = 0.06;
      for (const m of markers) {
        const w = m.group.getWorldPosition(new THREE.Vector3()).project(camera);
        const d = Math.hypot(w.x - ndc.x, (w.y - ndc.y) * (r.height / r.width));
        if (d < bd && w.z < 1) {
          bd = d;
          best = m.id;
        }
      }
      if (best && pickCb) pickCb(best);
    }
    down = null;
  };
  canvas.addEventListener("pointerdown", onDown);
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerup", onUp);

  const ready = Promise.all([
    Promise.all(
      ["/textures/earth_day_4k.jpg", "/textures/earth_bump_4k.jpg", "/textures/earth_water_4k.png"].map(
        (u, i) =>
          new Promise<THREE.Texture>((res) =>
            loader.load(
              u,
              (t) => {
                if (i === 0) t.colorSpace = THREE.SRGBColorSpace;
                t.anisotropy = 8;
                res(t);
              },
              undefined,
              () => res(new THREE.Texture()),
            ),
          ),
      ),
    ).then(([day, bump, water]) => {
      uniforms.uDay.value = day;
      uniforms.uBump.value = bump;
      uniforms.uWater.value = water;
    }),
    fetch("/data/india-geo.json")
      .then((r) => r.json())
      .then((geo: IndiaGeo) => {
        uniforms.uMask.value = maskTexture(geo);

        for (const ring of geo.country) indiaOutline.add(ringLine(ring, 1.002, "#f2ede1", 0));
        const karRings = geo.states["Karnataka"] ?? [];
        for (const ring of karRings) karnatakaOutline.add(ringLine(ring, 1.003, "#b6e08a", 0));
        for (const [name, rings] of Object.entries(geo.states)) {
          if (name === "Karnataka") continue;
          const emphasise = CONTEXT_STATES.has(name);
          for (const ring of rings) {
            const line = ringLine(ring, 1.0015, emphasise ? "#d8e9c4" : "#f2ede1", 0);
            line.userData.emphasise = emphasise;
            otherStates.add(line);
          }
        }
        setOutlineOpacity = (indiaP: number, kaP: number) => {
          indiaOutline.children.forEach((l) => (((l as THREE.Line).material as THREE.LineBasicMaterial).opacity = indiaP * 0.75));
          karnatakaOutline.children.forEach((l) => (((l as THREE.Line).material as THREE.LineBasicMaterial).opacity = kaP));
          otherStates.children.forEach((l) => {
            const base = l.userData.emphasise ? 0.28 : 0.1;
            ((l as THREE.Line).material as THREE.LineBasicMaterial).opacity = indiaP * base;
          });
        };
      })
      .catch(() => {
        // keep the placeholder rather than an empty/invalid texture
      }),
  ]).then(() => undefined);

  const lerpA = (a: number, b: number, k: number) => {
    let d = b - a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return a + d * k;
  };

  function frame() {
    raf = requestAnimationFrame(frame);
    if (!active) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    uniforms.uTime.value = t;

    // intro choreography: appear → rotate → India → Karnataka → markers
    const appear = smooth(0, 0.2, intro);
    const toIndia = smooth(0.2, 0.5, intro);
    const toKa = smooth(0.5, 0.72, intro);
    const mk = smooth(0.68, 0.85, intro);

    let ty: number, tx: number, td: number;
    if (focusId && intro > 0.85) {
      const s = sites.find((x) => x.id === focusId)!;
      const r = rotFor(s.lat, s.lng);
      ty = r.y;
      tx = r.x;
      td = 2.05;
    } else {
      const ri = rotFor(INDIA_C.lat, INDIA_C.lng);
      const rk = rotFor(KA_C.lat, KA_C.lng);
      const free = -t * 0.12 + 2.2;
      ty = THREE.MathUtils.lerp(free, ri.y, toIndia);
      if (toKa > 0) ty = THREE.MathUtils.lerp(ri.y, rk.y, toKa);
      tx = THREE.MathUtils.lerp(0.25, ri.x, toIndia);
      tx = THREE.MathUtils.lerp(tx, rk.x, toKa);
      td = THREE.MathUtils.lerp(THREE.MathUtils.lerp(4.4, 3.0, toIndia), 2.35, toKa);
    }
    const k = 1 - Math.exp(-dt * (focusId ? 2.6 : 5));
    rotY = toIndia < 0.01 && !focusId ? ty : lerpA(rotY, ty + dragX, k);
    rotX += (tx + dragY - rotX) * k;
    dist += (td - dist) * k;
    if (!down) {
      dragX *= 0.985;
      dragY *= 0.985;
    }
    spin.rotation.y = rotY;
    tilt.rotation.x = rotX;
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
    const sc = 0.55 + appear * 0.45;
    tilt.scale.setScalar(sc);
    atmo.scale.setScalar(sc);
    atmoMat.uniforms.uOpacity.value = appear;

    uniforms.uIndia.value = toIndia;
    uniforms.uKa.value = toKa;
    setOutlineOpacity(toIndia, toKa);

    for (const m of markers) {
      const on = m.id === focusId;
      const pulse = (t * 0.6 + m.phase) % 1;
      const rm = m.ring.material as THREE.MeshBasicMaterial;
      rm.opacity = mk * (1 - pulse) * (on ? 1 : 0.7);
      m.ring.scale.setScalar((on ? 0.014 : 0.008) + pulse * (on ? 0.05 : 0.03));
      (m.dot.material as THREE.MeshBasicMaterial).opacity = mk;
      m.dot.scale.setScalar(on ? 0.0095 : 0.0055);
      (m.dot.material as THREE.MeshBasicMaterial).color.set(on ? "#ffffff" : "#d9f2b8");
    }
    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);
  if (typeof window !== "undefined" && window.location.search.includes("debug")) {
    (window as unknown as Record<string, unknown>).__globe = {
      renderer,
      scene,
      camera,
      uniforms,
      intro: () => intro,
      setIntro: (p: number) => {
        intro = p;
      },
    };
  }

  return {
    ready,
    setIntro(p) {
      intro = clamp01(p);
    },
    focus(id) {
      focusId = id;
      dragX = 0;
      dragY = 0;
    },
    setActive(a) {
      if (a && !active) clock.getDelta();
      active = a;
    },
    resize(w, h) {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    onPick(cb) {
      pickCb = cb;
    },
    dispose() {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose?.();
        const mat = m.material as THREE.Material | undefined;
        mat?.dispose?.();
      });
      uniforms.uMask.value?.dispose();
      uniforms.uDay.value?.dispose();
      uniforms.uBump.value?.dispose();
      uniforms.uWater.value?.dispose();
      renderer.dispose();
    },
  };
}
