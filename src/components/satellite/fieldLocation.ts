"use client";

/**
 * Field location shared by the GeoLenz demos.
 * Starts on farmland near Bengaluru; "Use my location" (or an already-granted
 * browser permission) moves the map, pin and plot points to the visitor's position.
 */

import { useEffect, useSyncExternalStore } from "react";

export interface FieldLocation {
  lat: number;
  lon: number;
  name: string;
  mine: boolean;
}

export const BENGALURU: FieldLocation = { lat: 13.139, lon: 77.487, name: "Bengaluru, Karnataka", mine: false };

let current: FieldLocation = BENGALURU;
let status: "idle" | "locating" | "denied" | "unavailable" = "idle";
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const subscribe = (f: () => void) => {
  subs.add(f);
  return () => subs.delete(f);
};

export const fmt = (n: number) => n.toFixed(5);
export const coordLabel = (l: { lat: number; lon: number }) => `${fmt(l.lat)}, ${fmt(l.lon)}`;

/** 4 corner points of a square plot of `sizeM` metres centred on the location */
export function plotCorners(l: { lat: number; lon: number }, sizeM: number) {
  const half = sizeM / 2;
  const dLat = half / 111_320;
  const dLon = half / (111_320 * Math.cos((l.lat * Math.PI) / 180));
  return [
    { lat: l.lat + dLat, lon: l.lon - dLon }, // NW
    { lat: l.lat + dLat, lon: l.lon + dLon }, // NE
    { lat: l.lat - dLat, lon: l.lon - dLon }, // SW
    { lat: l.lat - dLat, lon: l.lon + dLon }, // SE
  ];
}

export function locateMe() {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    status = "unavailable";
    emit();
    return;
  }
  status = "locating";
  emit();
  navigator.geolocation.getCurrentPosition(
    (p) => {
      current = { lat: p.coords.latitude, lon: p.coords.longitude, name: "Your current location", mine: true };
      status = "idle";
      emit();
    },
    (err) => {
      status = err.code === err.PERMISSION_DENIED ? "denied" : "unavailable";
      emit();
    },
    { enableHighAccuracy: true, timeout: 10_000, maximumAge: 300_000 }
  );
}

let checked = false;
/** if the visitor already allowed location for this site, use it without asking again */
function autoLocate() {
  if (checked || typeof navigator === "undefined") return;
  checked = true;
  navigator.permissions
    ?.query({ name: "geolocation" as PermissionName })
    .then((r) => {
      if (r.state === "granted") locateMe();
    })
    .catch(() => {});
}

export function useFieldLocation() {
  const loc = useSyncExternalStore(subscribe, () => current, () => BENGALURU);
  const st = useSyncExternalStore(subscribe, () => status, () => "idle" as const);
  useEffect(autoLocate, []);
  return { loc, status: st, locateMe };
}
