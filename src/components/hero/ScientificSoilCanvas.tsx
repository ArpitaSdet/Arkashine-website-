"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * ARKASHINE — SCIENTIFIC SOIL MICROSTRUCTURE ENGINE
 * 
 * Exact 10-Second Continuous Cinematic Loop:
 * 0.0s - 2.0s: Dry Soil Aggregate (macro view of tightly bound porous aggregate)
 * 2.0s - 4.0s: Particle Separation (aggregate gently separates into individual grains)
 * 4.0s - 7.0s: Microscopic 3D Particle Environment (volumetric space, camera travel, strong parallax)
 * 7.0s - 9.0s: Scientific Nutrient Visualization (delicate glowing ionic specks & trajectories: N, P, K, Ca, Mg, S, micronutrients)
 * 9.0s - 10.0s: Seamless Loop Transition (particles smoothly coalesce back to aggregate, zero jump)
 */

interface NutrientBadge {
  sym: string;
  name: string;
  color: string;
  x: number;
  y: number;
  opacity: number;
}

export function ScientificSoilCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeNutrients, setActiveNutrients] = useState<NutrientBadge[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#100B08");
    scene.fog = new THREE.FogExp2("#100B08", 0.075);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      50
    );
    camera.position.set(0, 0.1, 5.2);

    // ----------------------------------------------------
    // Lighting Setup: Scientific macro documentary mood
    // ----------------------------------------------------
    const ambientLight = new THREE.AmbientLight("#3D2D22", 1.2);
    scene.add(ambientLight);

    // Warm key light
    const keyLight = new THREE.DirectionalLight("#FFE8D6", 2.8);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.bias = -0.001;
    scene.add(keyLight);

    // Cool blue-grey fill light (mineral contrast)
    const fillLight = new THREE.DirectionalLight("#6A7B8C", 0.9);
    fillLight.position.set(-5, -2, 3);
    scene.add(fillLight);

    // Back rim light (accents particle silhouettes)
    const rimLight = new THREE.DirectionalLight("#8FA382", 2.2);
    rimLight.position.set(-3, 4, -4);
    scene.add(rimLight);

    // ----------------------------------------------------
    // Procedural Micro-Texture Generation
    // ----------------------------------------------------
    function createSoilNoiseTexture() {
      const size = 256;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d");
      if (!ctx) return null;

      const imgData = ctx.createImageData(size, size);
      for (let i = 0; i < imgData.data.length; i += 4) {
        // Multi-frequency noise
        const n = Math.floor(
          128 +
            (Math.random() - 0.5) * 60 +
            (Math.sin((i / 4 / size) * 20) + Math.cos(((i / 4) % size) * 20)) * 25
        );
        imgData.data[i] = n;
        imgData.data[i + 1] = n;
        imgData.data[i + 2] = n;
        imgData.data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);

      const tex = new THREE.CanvasTexture(c);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(2, 2);
      return tex;
    }
    const noiseTex = createSoilNoiseTexture();

    // ----------------------------------------------------
    // PBR Materials for Authentic Soil Constituents
    // ----------------------------------------------------
    const materials = {
      // 1. Quartz & Silica mineral grains (sharp, translucent sheen)
      quartz: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#DFC7A9"),
        roughness: 0.38,
        metalness: 0.08,
        bumpMap: noiseTex ?? undefined,
        bumpScale: 0.04,
        flatShading: true,
      }),
      // 2. Iron-rich laterite / red earth aggregates
      laterite: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#8E472A"),
        roughness: 0.88,
        metalness: 0.02,
        bumpMap: noiseTex ?? undefined,
        bumpScale: 0.08,
        flatShading: true,
      }),
      // 3. Taupe weathered silt / feldspar
      silt: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#6E5D4B"),
        roughness: 0.82,
        metalness: 0.04,
        bumpMap: noiseTex ?? undefined,
        bumpScale: 0.06,
        flatShading: true,
      }),
      // 4. Dark organic humus & decomposing plant residues
      humus: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1C140F"),
        roughness: 0.95,
        metalness: 0.0,
        bumpMap: noiseTex ?? undefined,
        bumpScale: 0.1,
        flatShading: true,
      }),
      // 5. Clustered clay platelets
      clay: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#4E3E31"),
        roughness: 0.78,
        metalness: 0.05,
        bumpMap: noiseTex ?? undefined,
        bumpScale: 0.05,
        flatShading: true,
      }),
    };

    // ----------------------------------------------------
    // Procedural Particle Geometry Builders
    // Sculpted irregular angular mineral meshes with natural cleavage
    // ----------------------------------------------------
    function createIrregularGrainGeometry(baseRadius: number, irregularity: number, seed: number) {
      const geo = new THREE.IcosahedronGeometry(baseRadius, 1);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        // Deterministic pseudo-noise displacement
        const angle = Math.atan2(v.y, v.x) + seed;
        const disp =
          1 +
          Math.sin(angle * 3 + v.z * 4 + seed) * irregularity * 0.45 +
          Math.cos(v.x * 5 - v.y * 3) * irregularity * 0.35 +
          ((Math.sin(seed * 99 + i) + 1) / 2) * irregularity * 0.2;
        v.multiplyScalar(disp);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      return geo;
    }

    function createHumusFragmentGeometry(length: number, width: number, seed: number) {
      const geo = new THREE.BoxGeometry(length, width, width * 0.35, 2, 2, 1);
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();

      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        v.x += Math.sin(v.y * 4 + seed) * length * 0.2;
        v.y += Math.cos(v.x * 4 + seed) * width * 0.2;
        v.z += (Math.sin(i * 3 + seed) * width * 0.35);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.computeVertexNormals();
      return geo;
    }

    // ----------------------------------------------------
    // Build the Soil Particle Matrix (150 realistic particles)
    // ----------------------------------------------------
    interface SoilParticle {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;    // Position tightly bound inside the macro-clod (0-2s)
      driftPos: THREE.Vector3;   // Expanded volumetric position in microscopic space (4-7s)
      rotSpeed: THREE.Vector3;
      baseScale: number;
      type: keyof typeof materials;
    }

    const particles: SoilParticle[] = [];
    const particleGroup = new THREE.Group();
    scene.add(particleGroup);

    const totalParticles = 148;

    for (let i = 0; i < totalParticles; i++) {
      // Deterministic pseudo-random values
      const seed = i * 1.61803398875;
      const rRatio = i / totalParticles;

      // Classify particle type
      let type: keyof typeof materials = "laterite";
      if (i % 5 === 0) type = "quartz";
      else if (i % 5 === 1) type = "humus";
      else if (i % 5 === 2) type = "silt";
      else if (i % 5 === 3) type = "clay";
      else type = "laterite";

      const baseScale =
        type === "quartz"
          ? 0.16 + (Math.sin(seed * 7) * 0.5 + 0.5) * 0.14
          : type === "humus"
          ? 0.22 + (Math.sin(seed * 11) * 0.5 + 0.5) * 0.16
          : 0.12 + (Math.sin(seed * 13) * 0.5 + 0.5) * 0.18;

      let geom: THREE.BufferGeometry;
      if (type === "humus") {
        geom = createHumusFragmentGeometry(baseScale * 1.5, baseScale * 0.8, seed);
      } else {
        geom = createIrregularGrainGeometry(baseScale, 0.45, seed);
      }

      const mesh = new THREE.Mesh(geom, materials[type]);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // 1. Tightly bound macro-aggregate position (spherical / ellipsoid cluster with crevices)
      const u = Math.sin(seed * 3.7) * 0.5 + 0.5;
      const v = Math.cos(seed * 5.3) * 0.5 + 0.5;
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      // Density concentrated near core with jagged outer boundary
      const clodRad = Math.pow(rRatio, 0.7) * 1.45 * (1 + Math.sin(theta * 3 + phi * 2) * 0.22);
      const bx = clodRad * Math.sin(phi) * Math.cos(theta);
      const by = clodRad * Math.sin(phi) * Math.sin(theta) * 0.85; // slightly flattened like real clod
      const bz = clodRad * Math.cos(phi);

      const basePos = new THREE.Vector3(bx, by, bz);

      // 2. Expanded microscopic space position (volumetric distribution with foreground & background)
      // Some pass very close to camera lens (z: 1.0 to 2.8) for dramatic macro parallax
      const expTheta = seed * 4.2;
      const expPhi = Math.sin(seed * 2.8) * Math.PI;
      const expRadius = 1.8 + Math.pow(rRatio, 0.5) * 4.5;
      
      let tx = Math.sin(expPhi) * Math.cos(expTheta) * (expRadius * 1.25);
      let ty = Math.sin(expPhi) * Math.sin(expTheta) * (expRadius * 0.85);
      let tz = Math.cos(expPhi) * expRadius;

      // Ensure good spread across viewport
      if (i < 16) {
        // Explicit foreground particles passing right by the lens
        tx = (Math.sin(seed * 5) * 2.2);
        ty = (Math.cos(seed * 7) * 1.5);
        tz = 1.4 + (i / 16) * 1.4;
      }

      const driftPos = new THREE.Vector3(tx, ty, tz);

      mesh.position.copy(basePos);
      mesh.rotation.set(seed, seed * 1.5, seed * 2);

      const rotSpeed = new THREE.Vector3(
        (Math.sin(seed * 3) * 0.4),
        (Math.cos(seed * 5) * 0.4),
        (Math.sin(seed * 7) * 0.3)
      );

      particleGroup.add(mesh);
      particles.push({
        mesh,
        basePos,
        driftPos,
        rotSpeed,
        baseScale,
        type,
      });
    }

    // ----------------------------------------------------
    // Scientific Nutrient Visualization Layer (N, P, K, Ca, Mg, S, Fe, Zn...)
    // ----------------------------------------------------
    const nutrientGroup = new THREE.Group();
    scene.add(nutrientGroup);

    const nutrientColors = [
      new THREE.Color("#E8B86D"), // N: Muted warm amber
      new THREE.Color("#E07A5F"), // P: Warm mineral orange
      new THREE.Color("#9E85E6"), // K: Restrained violet
      new THREE.Color("#F4F1DE"), // Ca: Subtle light mineral tone
      new THREE.Color("#81B29A"), // Mg: Muted sage green
      new THREE.Color("#F2CC8F"), // S: Warm yellow
      new THREE.Color("#C98A62"), // Micronutrients (Fe, Cu, Zn, B)
    ];

    const nutrientCount = 180;
    const nutrientGeo = new THREE.BufferGeometry();
    const nutrientPositions = new Float32Array(nutrientCount * 3);
    const nutrientColorArray = new Float32Array(nutrientCount * 3);

    for (let i = 0; i < nutrientCount; i++) {
      const col = nutrientColors[i % nutrientColors.length];
      nutrientColorArray[i * 3] = col.r;
      nutrientColorArray[i * 3 + 1] = col.g;
      nutrientColorArray[i * 3 + 2] = col.b;

      // Dispersed in the microscopic void
      const r = 0.5 + Math.random() * 4.0;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(Math.random() * 2 - 1);
      nutrientPositions[i * 3] = r * Math.sin(p) * Math.cos(t);
      nutrientPositions[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
      nutrientPositions[i * 3 + 2] = r * Math.cos(p);
    }

    nutrientGeo.setAttribute("position", new THREE.BufferAttribute(nutrientPositions, 3));
    nutrientGeo.setAttribute("color", new THREE.BufferAttribute(nutrientColorArray, 3));

    // Glowing particle texture
    function createGlowPointTexture() {
      const size = 64;
      const c = document.createElement("canvas");
      c.width = size;
      c.height = size;
      const ctx = c.getContext("2d");
      if (!ctx) return null;

      const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, "rgba(255, 255, 255, 1)");
      grad.addColorStop(0.2, "rgba(255, 240, 200, 0.8)");
      grad.addColorStop(0.5, "rgba(200, 160, 100, 0.25)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      return new THREE.CanvasTexture(c);
    }

    const nutrientMaterial = new THREE.PointsMaterial({
      size: 0.16,
      map: createGlowPointTexture() ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nutrientPoints = new THREE.Points(nutrientGeo, nutrientMaterial);
    nutrientGroup.add(nutrientPoints);

    // ----------------------------------------------------
    // EXACT 10-SECOND LOOP ANIMATION SYSTEM
    // Continuous, automatic, independent of scroll
    // ----------------------------------------------------
    const LOOP_DURATION = 10.0; // Seconds
    let startTime = performance.now();
    let isVisible = true;
    let animId = 0;

    // Smoothstep easing helper
    const smoothstep = (min: number, max: number, value: number) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    // Vector interpolation reusable temp
    const tempVec = new THREE.Vector3();

    function animate() {
      animId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      // Exact continuous periodic phase in [0, 10.0)
      const tau = elapsed % LOOP_DURATION;

      // -----------------------------------------------------------------
      // PHASE CALCULATIONS
      // 0.0 - 2.0s: Dry soil aggregate (macro clod, camera dollies closer)
      // 2.0 - 4.0s: Particle separation (aggregate parts, grains drift)
      // 4.0 - 7.0s: Microscopic 3D environment (volumetric parallax)
      // 7.0 - 9.0s: Nutrient visualization (delicate glowing ionic specks)
      // 9.0 - 10.0s: Seamless return to origin (zero jump)
      // -----------------------------------------------------------------

      // Separation weight w_sep in [0, 1]
      let w_sep = 0;
      if (tau < 2.0) {
        // Tightly bound clod
        w_sep = 0;
      } else if (tau < 4.0) {
        // Separating into microscopic space
        w_sep = smoothstep(2.0, 4.0, tau);
      } else if (tau < 9.0) {
        // Fully expanded microscopic universe
        w_sep = 1;
      } else {
        // Regrouping smoothly back into clod (9.0 -> 10.0s)
        w_sep = 1 - smoothstep(9.0, 10.0, tau);
      }

      // Nutrient intensity in [0, 1]
      let w_nutrients = 0;
      if (tau >= 7.0 && tau < 9.0) {
        if (tau < 7.6) {
          w_nutrients = smoothstep(7.0, 7.6, tau);
        } else if (tau > 8.5) {
          w_nutrients = 1 - smoothstep(8.5, 9.0, tau);
        } else {
          w_nutrients = 1;
        }
      } else {
        w_nutrients = 0;
      }
      nutrientMaterial.opacity = w_nutrients * 0.85;

      // Rotate nutrient matrix gently
      nutrientPoints.rotation.y = tau * 0.12;
      nutrientPoints.rotation.x = Math.sin(tau * 0.2) * 0.08;

      // -----------------------------------------------------------------
      // CAMERA PATH (Exact loop: Pos(0) == Pos(10), Rot(0) == Rot(10))
      // -----------------------------------------------------------------
      let camZ = 5.2;
      let camX = 0;
      let camY = 0.1;
      let camRotZ = 0;

      if (tau < 2.0) {
        // Approaching the dry aggregate
        const p = tau / 2.0;
        camZ = 5.2 - p * 0.5; // 5.2 -> 4.7
        camX = Math.sin(p * Math.PI * 0.5) * 0.15;
        camY = 0.1 + p * 0.05;
      } else if (tau < 4.0) {
        // Camera moves inward as separation occurs
        const p = (tau - 2.0) / 2.0;
        camZ = 4.7 - p * 1.1; // 4.7 -> 3.6
        camX = 0.15 + p * 0.25;
        camY = 0.15 - p * 0.05;
      } else if (tau < 7.0) {
        // Travelling through microscopic 3D particle field
        const p = (tau - 4.0) / 3.0;
        camZ = 3.6 - Math.sin(p * Math.PI) * 0.8; // dips to 2.8 for intense macro parallax
        camX = 0.4 + Math.sin(p * Math.PI * 1.2) * 0.35;
        camY = 0.1 + Math.cos(p * Math.PI * 1.5) * 0.12;
        camRotZ = Math.sin(p * Math.PI) * 0.035;
      } else if (tau < 9.0) {
        // Nutrient scanning view
        const p = (tau - 7.0) / 2.0;
        camZ = 3.6 + p * 0.6; // 3.6 -> 4.2
        camX = 0.4 - p * 0.25;
        camY = 0.1;
      } else {
        // 9.0 -> 10.0: Smooth return to exact initial camera coordinates
        const p = (tau - 9.0) / 1.0;
        const easeReturn = 0.5 - 0.5 * Math.cos(Math.PI * p);
        camZ = 4.2 + (5.2 - 4.2) * easeReturn;
        camX = 0.15 * (1 - easeReturn);
        camY = 0.1;
        camRotZ = 0;
      }

      camera.position.set(camX, camY, camZ);
      camera.rotation.z = camRotZ;
      camera.lookAt(0, 0, 0);

      // Light sweep across particles
      keyLight.position.x = 4 + Math.sin(tau * 0.6) * 1.5;
      keyLight.position.y = 5 + Math.cos(tau * 0.5) * 1.0;

      // -----------------------------------------------------------------
      // UPDATE SOIL PARTICLES
      // -----------------------------------------------------------------
      for (let i = 0; i < totalParticles; i++) {
        const p = particles[i];

        // Position interpolation: from base clod to microscopic space
        tempVec.lerpVectors(p.basePos, p.driftPos, w_sep);

        // Add subtle Brownian turbulence when suspended in space
        if (w_sep > 0.01) {
          const turb = Math.sin(tau * 1.5 + i) * 0.08 * w_sep;
          tempVec.x += Math.sin(tau * 0.8 + i * 2) * turb;
          tempVec.y += Math.cos(tau * 0.7 + i * 3) * turb;
          tempVec.z += Math.sin(tau * 0.9 + i * 4) * turb;
        }

        p.mesh.position.copy(tempVec);

        // Gentle axial rotation
        p.mesh.rotation.x += p.rotSpeed.x * 0.015;
        p.mesh.rotation.y += p.rotSpeed.y * 0.018;
        p.mesh.rotation.z += p.rotSpeed.z * 0.012;
      }

      // Macro-rotation of the entire particle group
      // Periodic harmonic so rot(0) == rot(10)
      particleGroup.rotation.y = Math.sin((tau / LOOP_DURATION) * Math.PI * 2) * 0.25;
      particleGroup.rotation.x = Math.cos((tau / LOOP_DURATION) * Math.PI * 2) * 0.06;

      // -----------------------------------------------------------------
      // REACTIVE NUTRIENT HUD BADGES (Elegant Minimal Scientific Labels)
      // -----------------------------------------------------------------
      if (w_nutrients > 0.1) {
        const badges: NutrientBadge[] = [
          { sym: "N", name: "Nitrogen", color: "#E8B86D", x: 28, y: 35, opacity: w_nutrients },
          { sym: "P", name: "Phosphorus", color: "#E07A5F", x: 72, y: 42, opacity: w_nutrients * 0.95 },
          { sym: "K", name: "Potassium", color: "#9E85E6", x: 38, y: 68, opacity: w_nutrients * 0.9 },
          { sym: "Ca", name: "Calcium", color: "#F4F1DE", x: 65, y: 72, opacity: w_nutrients * 0.85 },
          { sym: "Mg", name: "Magnesium", color: "#81B29A", x: 50, y: 26, opacity: w_nutrients * 0.9 },
        ];
        setActiveNutrients(badges);
      } else if (activeNutrients.length > 0) {
        setActiveNutrients([]);
      }

      renderer.render(scene, camera);
    }

    animId = requestAnimationFrame(animate);

    // ----------------------------------------------------
    // Resize Handler
    // ----------------------------------------------------
    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ----------------------------------------------------
    // Pause rendering when scrolled off-screen
    // ----------------------------------------------------
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          isVisible = e.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
      renderer.dispose();
      nutrientGeo.dispose();
      nutrientMaterial.dispose();
      Object.values(materials).forEach((m) => m.dispose());
      noiseTex?.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden bg-[#100B08]">
      <canvas ref={canvasRef} className="block h-full w-full" />

      {/* Subtle macro vignette & depth shading */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(16,11,8,0.7)_80%,rgba(16,11,8,0.95)_100%)]"
        aria-hidden="true"
      />

      {/* Subtle scientific nutrient ionization badges (Appear gracefully at 7-9s) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {activeNutrients.map((b) => (
          <div
            key={b.sym}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
              opacity: b.opacity,
              transition: "opacity 0.4s ease-out",
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 rounded-full border border-white/10 bg-[#16100B]/60 px-2.5 py-1 backdrop-blur-xs"
          >
            <span
              style={{ backgroundColor: b.color }}
              className="flex h-4 w-4 items-center justify-center rounded-full font-mono text-[9px] font-bold text-[#100B08]"
            >
              {b.sym}
            </span>
            <span className="font-mono text-[10px] tracking-wider uppercase text-white/70">
              {b.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
