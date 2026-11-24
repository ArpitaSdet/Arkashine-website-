"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import * as THREE from "three";
import { ArrowDown, Sparkles } from "lucide-react";

export function CinematicSoilHeroAndTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Scroll tracking across the 250vh pinned transition container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Hero typography fades out as user scrolls (0.0 -> 0.26)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.24], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.24], [0, -50]);

  // Soil-to-Green Farm Horizon Reveal (0.22 -> 0.54)
  const farmRevealOpacity = useTransform(scrollYProgress, [0.22, 0.36, 0.54], [0, 0.9, 0]);
  const farmScale = useTransform(scrollYProgress, [0.22, 0.54], [1.1, 1.0]);

  // Dark studio dissolve layer (0.50 -> 0.75)
  const studioOverlayOpacity = useTransform(scrollYProgress, [0.48, 0.72], [0, 1]);

  // Hardware reveal (0.65 -> 0.95)
  const hardwareOpacity = useTransform(scrollYProgress, [0.62, 0.82], [0, 1]);
  const hardwareScale = useTransform(scrollYProgress, [0.62, 0.9], [0.88, 1.0]);
  const hardwareY = useTransform(scrollYProgress, [0.62, 0.9], [60, 0]);

  // Three.js Subterranean Soil WebGL Scene
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#032526");
    scene.fog = new THREE.FogExp2("#032526", 0.08);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 5.5);

    // Warm subterranean & botanical lighting
    const ambientLight = new THREE.AmbientLight("#063D3B", 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight("#F2F0E8", 1.4);
    keyLight.position.set(3, 4, 3);
    scene.add(keyLight);

    const nutrientGlow = new THREE.PointLight("#83C65A", 2.2, 8);
    nutrientGlow.position.set(-1, -1, 2);
    scene.add(nutrientGlow);

    // 1. Organic Soil Aggregates (Porous 3D Grains)
    const aggregateGroup = new THREE.Group();
    const aggregateGeo = new THREE.DodecahedronGeometry(0.35, 1);
    
    // Displace vertices to create irregular organic soil clods
    const pos = aggregateGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const noise = (Math.sin(vx * 5) + Math.cos(vy * 5) + Math.sin(vz * 5)) * 0.08;
      pos.setXYZ(i, vx + noise, vy + noise, vz + noise);
    }
    aggregateGeo.computeVertexNormals();

    const aggregateMat = new THREE.MeshStandardMaterial({
      color: "#35251D",
      roughness: 0.85,
      metalness: 0.1,
    });

    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < 45; i++) {
      const mesh = new THREE.Mesh(aggregateGeo, aggregateMat);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 6
      );
      const s = 0.4 + Math.random() * 0.7;
      mesh.scale.set(s, s, s);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      aggregateGroup.add(mesh);
      particles.push(mesh);
    }
    scene.add(aggregateGroup);

    // 2. Glowing Nutrient Particles (N, P, K, Ca, Mg micro-ions)
    const nutrientCount = 180;
    const nutrientGeo = new THREE.BufferGeometry();
    const nutrientPositions = new Float32Array(nutrientCount * 3);
    const nutrientColors = new Float32Array(nutrientCount * 3);

    const colBotanical = new THREE.Color("#83C65A");
    const colAmber = new THREE.Color("#E8A13A");
    const colIvory = new THREE.Color("#F2F0E8");

    for (let i = 0; i < nutrientCount; i++) {
      nutrientPositions[i * 3] = (Math.random() - 0.5) * 10;
      nutrientPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      nutrientPositions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const pick = Math.random();
      const c = pick < 0.6 ? colBotanical : pick < 0.85 ? colAmber : colIvory;
      nutrientColors[i * 3] = c.r;
      nutrientColors[i * 3 + 1] = c.g;
      nutrientColors[i * 3 + 2] = c.b;
    }

    nutrientGeo.setAttribute("position", new THREE.BufferAttribute(nutrientPositions, 3));
    nutrientGeo.setAttribute("color", new THREE.BufferAttribute(nutrientColors, 3));

    const nutrientMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const nutrientPoints = new THREE.Points(nutrientGeo, nutrientMat);
    scene.add(nutrientPoints);

    // 3. Delicate Root Filaments
    const rootGroup = new THREE.Group();
    for (let r = 0; r < 6; r++) {
      const points = [];
      let currentPoint = new THREE.Vector3((Math.random() - 0.5) * 4, 3, (Math.random() - 0.5) * 2);
      points.push(currentPoint.clone());
      for (let j = 0; j < 8; j++) {
        currentPoint.x += (Math.random() - 0.5) * 0.6;
        currentPoint.y -= 0.6 + Math.random() * 0.3;
        currentPoint.z += (Math.random() - 0.5) * 0.4;
        points.push(currentPoint.clone());
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.02, 6, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: "#A5B77A",
        roughness: 0.7,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      rootGroup.add(tubeMesh);
    }
    scene.add(rootGroup);

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    let reqId = 0;
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const currentScroll = scrollYProgress.get();

      // Camera moves deeper through soil as user scrolls (Step 1 & 2 of sequence)
      const targetZ = 5.5 - currentScroll * 12;
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);

      // Aggregate drifting and slow rotation
      particles.forEach((p, idx) => {
        p.rotation.x += 0.003 * (idx % 2 === 0 ? 1 : -1);
        p.rotation.y += 0.004;
        p.position.z += currentScroll * 0.08;
      });

      // Roots gently dissolve during transition
      rootGroup.children.forEach((c: any) => {
        if (c.material) {
          c.material.opacity = Math.max(0, 1 - currentScroll * 2.2);
          c.material.transparent = true;
        }
      });

      nutrientPoints.rotation.y = elapsed * 0.03;

      renderer.render(scene, camera);
      reqId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [scrollYProgress]);

  const scrollToHardware = () => {
    const el = document.getElementById("soillenz");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section ref={containerRef} className="relative h-[250vh] w-full bg-[#032526]">
      
      {/* Sticky 100vh Viewport Wrapper */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Layer 1: Subterranean WebGL Canvas */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" />

        {/* Layer 2: Subtle Ambient Vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#032526] via-transparent to-[#032526]/40"
          aria-hidden="true"
        />

        {/* Layer 3: Hero Section Typography (Fades on Scroll) */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-20 flex h-full w-full flex-col items-center justify-center px-6 text-center select-none"
        >
          <div className="max-w-4xl mx-auto flex flex-col items-center">
            
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#063D3B]/70 border border-[#83C65A]/30 text-xs font-mono font-semibold uppercase tracking-[0.24em] text-[#83C65A] mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#83C65A]" />
              <span>ARKASHINE · SOIL INTELLIGENCE HARDWARE</span>
            </div>

            {/* Editorial Headline */}
            <h1 className="font-display font-bold text-[clamp(2.75rem,7.5vw,6.5rem)] leading-[0.98] tracking-[-0.035em] text-[#F2F0E8] drop-shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
              <span>SOIL IS MORE THAN</span>
              <br />
              <span className="text-[#83C65A] font-medium">WHAT YOU SEE.</span>
            </h1>

            {/* Subheading */}
            <p className="mt-8 max-w-xl text-base sm:text-xl text-[#A8B6B0] font-normal leading-relaxed">
              Advanced soil intelligence hardware engineered for agricultural applications.
            </p>

            {/* CTA Button */}
            <button
              onClick={scrollToHardware}
              className="mt-10 group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-transparent hover:bg-[#83C65A]/15 text-[#83C65A] font-mono text-xs font-bold uppercase tracking-[0.2em] border border-[#83C65A]/50 transition-all duration-300 cursor-pointer shadow-lg"
            >
              <span>EXPLORE OUR TECHNOLOGY</span>
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
            </button>
          </div>
        </motion.div>

        {/* Layer 4: Soil-to-Green Farm Horizon Reveal (Authentic Agricultural Landscape) */}
        <motion.div
          style={{ opacity: farmRevealOpacity, scale: farmScale }}
          className="pointer-events-none absolute inset-0 z-25 flex items-center justify-center overflow-hidden"
          aria-hidden="true"
        >
          <div className="relative w-full h-full">
            <Image
              src="/images/slides/slide-01-overview.jpg"
              alt="Lush green farm operation landscape with geo-spatial intelligence"
              fill
              sizes="100vw"
              className="object-cover brightness-90 saturate-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#032526] via-transparent to-[#032526]/60" />
            
            {/* Atmospheric Farm Tag */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-center">
              <span className="font-mono text-xs uppercase tracking-[0.24em] text-[#83C65A] bg-[#032526]/90 px-4 py-1.5 rounded-full border border-[#83C65A]/40 backdrop-blur-md">
                LIVING SOIL · THRIVING HARVEST
              </span>
            </div>
          </div>
        </motion.div>

        {/* Layer 5: Dark Studio Environment Dissolve */}
        <motion.div
          style={{ opacity: studioOverlayOpacity }}
          className="pointer-events-none absolute inset-0 z-30 bg-gradient-to-b from-[#062F2D] via-[#032526] to-[#021819]"
          aria-hidden="true"
        />

        {/* Layer 6: Hero-to-Hardware Transition Landing Preview (Authentic SoiLenz 2.0 Photo) */}
        <motion.div
          style={{ opacity: hardwareOpacity, scale: hardwareScale, y: hardwareY }}
          className="pointer-events-none absolute inset-0 z-40 flex flex-col items-center justify-center px-6 text-center"
        >
          <div className="relative w-full max-w-[560px] aspect-[16/11] flex items-center justify-center">
            {/* Ground Contact Shadow */}
            <div className="absolute bottom-[2%] inset-x-[15%] h-[14%] rounded-[100%] bg-black/85 blur-2xl" />
            
            <Image
              src="/images/products/soillenz-2-studio.webp"
              alt="SoiLenz 2.0 Portable Soil Lab Hardware"
              fill
              priority
              sizes="(min-width: 1024px) 560px, 90vw"
              className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.85)]"
            />
          </div>

          <div className="mt-4 text-center">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#83C65A]">
              HARDWARE EMERGES
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-[#F2F0E8] mt-1">
              SOILENZ 2.0
            </h2>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
