"use client";

/**
 * Real satellite imagery (Esri World Imagery tiles) centred on a lat/lon,
 * filling its parent, with a slow cinematic drift. Attribution is shown.
 */

import { motion, useReducedMotion } from "motion/react";

const TILE = 256;

function tileXY(lat: number, lon: number, z: number) {
  const n = 2 ** z;
  const x = ((lon + 180) / 360) * n;
  const r = (lat * Math.PI) / 180;
  const y = ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n;
  return { x, y };
}

export function SatTiles({
  lat,
  lon,
  zoom = 16,
  span = 5,
  className = "",
  drift = true,
}: {
  lat: number;
  lon: number;
  zoom?: number;
  span?: number;
  className?: string;
  drift?: boolean;
}) {
  const reduce = useReducedMotion();
  const { x, y } = tileXY(lat, lon, zoom);
  const cx = Math.floor(x);
  const cy = Math.floor(y);
  const half = Math.floor(span / 2);
  // offset so the exact point sits in the middle of the mosaic
  const offX = (x - cx) * TILE;
  const offY = (y - cy) * TILE;
  const size = span * TILE;

  const tiles: { tx: number; ty: number }[] = [];
  for (let j = -half; j <= half; j++) for (let i = -half; i <= half; i++) tiles.push({ tx: cx + i, ty: cy + j });

  return (
    <div className={`absolute inset-0 overflow-hidden bg-[#2b3a26] ${className}`}>
      <motion.div
        className="absolute left-1/2 top-1/2"
        style={{ width: size, height: size, marginLeft: -(half * TILE + offX), marginTop: -(half * TILE + offY) }}
        animate={drift && !reduce ? { x: [0, -18, 0], y: [0, 12, 0], scale: [1.05, 1.1, 1.05] } : undefined}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      >
        {tiles.map(({ tx, ty }, k) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${tx}-${ty}`}
            src={`https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${ty}/${tx}`}
            alt=""
            width={TILE}
            height={TILE}
            loading="lazy"
            draggable={false}
            className="absolute select-none"
            style={{ left: (k % span) * TILE, top: Math.floor(k / span) * TILE }}
          />
        ))}
      </motion.div>
      <span className="pointer-events-none absolute bottom-1 right-2 font-mono text-[9px] text-white/60">Imagery © Esri, Maxar, Earthstar Geographics</span>
    </div>
  );
}
