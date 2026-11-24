"use client";

import { useEffect } from "react";

/** Each section on this page snaps into one full frame while scrolling. */
export function SnapScroll() {
  useEffect(() => {
    const html = document.documentElement;
    const cls = ["snap-y", "snap-proximity", "lg:snap-mandatory", "scroll-pt-20"];
    html.classList.add(...cls);
    return () => html.classList.remove(...cls);
  }, []);
  return null;
}
