"use client";

/**
 * A living-soil diorama for the growers hero, all SVG + Motion:
 * sun rays turning, a seedling that grows (stem draws, leaves pop and sway),
 * roots spreading through the soil, an earthworm wriggling, microbes pulsing,
 * drench drops soaking in, and natural-input labels floating around.
 */

import { motion, useReducedMotion } from "motion/react";

const LABELS = [
  { t: "Jeevamrutham", x: 6, y: 18, d: 0.2 },
  { t: "Beejamrutham", x: 66, y: 10, d: 0.5 },
  { t: "Neemastra", x: 72, y: 38, d: 0.8 },
  { t: "Vermicompost", x: 4, y: 62, d: 1.1 },
  { t: "Trichoderma", x: 64, y: 78, d: 1.4 },
  { t: "Panchagavya", x: 30, y: 88, d: 1.7 },
];

const ROOTS = [
  "M200 250 C 196 290, 182 320, 160 350",
  "M200 250 C 204 295, 222 330, 246 362",
  "M200 250 C 200 300, 198 340, 200 390",
  "M186 300 C 170 312, 150 318, 128 316",
  "M214 312 C 232 322, 254 326, 276 320",
  "M199 340 C 186 356, 176 372, 170 392",
];

const MICROBES = Array.from({ length: 16 }, (_, i) => ({
  cx: 40 + ((i * 53) % 320),
  cy: 270 + ((i * 37) % 120),
  r: 2 + (i % 3),
  c: i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#8cbf5f" : "#5eead4",
  d: (i * 0.3) % 3,
}));

export function LivingSoilScene() {
  const reduce = useReducedMotion();
  const loop = (duration: number, delay = 0) => (reduce ? { duration: 0 } : { duration, delay, repeat: Infinity, ease: "easeInOut" as const });

  return (
    <div className="relative mx-auto aspect-[4/4.4] w-full max-w-[460px]">
      <svg viewBox="0 0 400 440" className="absolute inset-0 h-full w-full" role="img" aria-label="Illustration: a seedling growing from living soil with roots, an earthworm and soil microbes">
        <defs>
          <linearGradient id="ls-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e9f7e1" />
            <stop offset="1" stopColor="#d4ecc6" />
          </linearGradient>
          <linearGradient id="ls-soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7a5232" />
            <stop offset="0.5" stopColor="#5d3c22" />
            <stop offset="1" stopColor="#3e2716" />
          </linearGradient>
          <clipPath id="ls-clip">
            <rect x="0" y="0" width="400" height="440" rx="36" />
          </clipPath>
        </defs>

        <g clipPath="url(#ls-clip)">
          <rect width="400" height="250" fill="url(#ls-sky)" />

          {/* sun */}
          <g transform="translate(330 64)">
            <motion.g animate={reduce ? undefined : { rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}>
              {Array.from({ length: 12 }, (_, i) => (
                <rect key={i} x="-2" y="-46" width="4" height="14" rx="2" fill="#fbbf24" opacity="0.7" transform={`rotate(${i * 30})`} />
              ))}
            </motion.g>
            <circle r="24" fill="#fcd34d" />
          </g>

          {/* drench drops falling and soaking in */}
          {[120, 160, 250, 285].map((x, i) => (
            <motion.circle
              key={x}
              cx={x}
              r="3.5"
              fill="#38bdf8"
              initial={{ cy: 120, opacity: 0 }}
              animate={reduce ? { cy: 200, opacity: 0.6 } : { cy: [120, 250, 268], opacity: [0, 1, 0] }}
              transition={loop(2.4, i * 0.6)}
            />
          ))}

          {/* soil */}
          <rect y="250" width="400" height="190" fill="url(#ls-soil)" />
          <path d="M0 250 Q 50 240 100 250 T 200 250 T 300 250 T 400 250 V 262 H 0 Z" fill="#8a5d39" />
          {/* soil grains */}
          {Array.from({ length: 40 }, (_, i) => (
            <circle key={i} cx={(i * 97) % 400} cy={268 + ((i * 41) % 165)} r={1 + (i % 2)} fill="#2a1a0e" opacity="0.5" />
          ))}

          {/* microbes */}
          {MICROBES.map((m, i) => (
            <motion.circle
              key={i}
              cx={m.cx}
              cy={m.cy}
              r={m.r}
              fill={m.c}
              animate={reduce ? undefined : { opacity: [0.25, 1, 0.25], scale: [0.8, 1.4, 0.8] }}
              transition={loop(2.6, m.d)}
            />
          ))}

          {/* roots */}
          {ROOTS.map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke="#f1d9b5"
              strokeWidth={i < 3 ? 3 : 2}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: 0.6 + i * 0.25, ease: "easeOut" }}
            />
          ))}

          {/* earthworm */}
          <motion.path
            d="M60 400 q 12 -10 24 0 t 24 0 t 24 0"
            fill="none"
            stroke="#d97786"
            strokeWidth="7"
            strokeLinecap="round"
            animate={
              reduce
                ? undefined
                : { d: ["M60 400 q 12 -10 24 0 t 24 0 t 24 0", "M70 400 q 12 10 24 0 t 24 0 t 24 0", "M60 400 q 12 -10 24 0 t 24 0 t 24 0"], x: [0, 30, 0] }
            }
            transition={loop(4)}
          />

          {/* seedling */}
          <motion.g
            style={{ originX: "200px", originY: "250px" }}
            animate={reduce ? undefined : { rotate: [-2, 2, -2] }}
            transition={loop(5)}
          >
            <motion.path
              d="M200 250 C 198 220, 204 190, 200 150"
              fill="none"
              stroke="#4f7d2e"
              strokeWidth="5"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
            {[
              { d: "M200 205 C 176 196, 160 178, 158 160 C 178 162, 196 178, 200 205 Z", delay: 1.0 },
              { d: "M200 190 C 224 182, 242 164, 246 146 C 224 148, 206 164, 200 190 Z", delay: 1.25 },
              { d: "M200 160 C 186 146, 182 128, 188 112 C 202 124, 206 142, 200 160 Z", delay: 1.5 },
              { d: "M200 160 C 214 148, 226 134, 224 116 C 210 124, 202 142, 200 160 Z", delay: 1.7 },
            ].map((l) => (
              <motion.path
                key={l.d}
                d={l.d}
                fill="#6fb342"
                stroke="#4f7d2e"
                strokeWidth="1.5"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                style={{ originX: "200px", originY: "180px" }}
                transition={{ type: "spring", stiffness: 200, damping: 12, delay: l.delay }}
              />
            ))}
          </motion.g>
        </g>
      </svg>

      {/* floating natural-input labels */}
      {LABELS.map((l) => (
        <motion.span
          key={l.t}
          className="absolute rounded-full border border-emerald-900/10 bg-white/90 px-3 py-1 font-mono text-[10px] font-bold text-emerald-900 shadow-[0_10px_24px_-10px_rgba(6,78,59,0.45)] backdrop-blur"
          style={{ left: `${l.x}%`, top: `${l.y}%` }}
          initial={{ opacity: 0, scale: 0.6 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ opacity: { delay: 1.8 + l.d }, scale: { delay: 1.8 + l.d, type: "spring", stiffness: 260, damping: 14 }, y: { duration: 4 + l.d, repeat: Infinity, ease: "easeInOut" } }}
        >
          {l.t}
        </motion.span>
      ))}
    </div>
  );
}
