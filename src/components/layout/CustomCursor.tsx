// src/components/layout/CustomCursor.tsx
"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export const CustomCursor = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const outer = outerRef.current!;
    const core = coreRef.current!;
    const trail = trailRef.current!;
    const isDark = theme === "dark";

    // positions
    let targetX = -100, targetY = -100;
    let outerX = -100, outerY = -100;
    let trailX = -100, trailY = -100;

    // flags
    let hovering = false, pressing = false;

    // style params
    const BASE = 42, HOVER = 54, PRESS = 32;
    const OUTER_LERP = 0.25, TRAIL_LERP = 0.12;

    const glow = isDark ? "rgba(147,197,253,0.28)" : "rgba(59,130,246,0.24)";
    const coreColor = isDark ? "rgba(147,197,253,0.92)" : "rgba(37,99,235,0.9)";

    const setStyle = (el: HTMLElement, size: number, color: string, blur = 0) => {
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.background = color;
      el.style.filter = blur ? `blur(${blur}px)` : "none";
      el.style.borderRadius = "50%";
      el.style.pointerEvents = "none";
      el.style.position = "fixed";
      el.style.zIndex = "9999";
    };

    setStyle(outer, BASE, glow, 6);
    setStyle(core, 8, coreColor);
    setStyle(trail, BASE, glow, 12);

    const update = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      outerX = lerp(outerX, targetX, OUTER_LERP);
      outerY = lerp(outerY, targetY, OUTER_LERP);
      trailX = lerp(trailX, targetX, TRAIL_LERP);
      trailY = lerp(trailY, targetY, TRAIL_LERP);

      const outerSize = pressing ? PRESS : hovering ? HOVER : BASE;

      outer.style.transform = `translate3d(${outerX - outerSize / 2}px, ${outerY - outerSize / 2}px, 0)`;
      outer.style.width = outer.style.height = `${outerSize}px`;

      core.style.transform = `translate3d(${targetX - 4}px, ${targetY - 4}px, 0) scale(${pressing ? 0.5 : hovering ? 0.8 : 1})`;
      trail.style.transform = `translate3d(${trailX - BASE / 2}px, ${trailY - BASE / 2}px, 0)`;

      requestAnimationFrame(update);
    };
    update();

    const move = (e: MouseEvent) => { targetX = e.clientX; targetY = e.clientY; };
    const down = () => (pressing = true);
    const up = () => (pressing = false);
    const enter = () => (hovering = true);
    const leave = () => (hovering = false);

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.querySelectorAll("a, button, input, textarea, select, [role='button']")
      .forEach((el) => {
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, [theme]);

  return (
    <>
      <div ref={trailRef}></div>
      <div ref={outerRef}></div>
      <div ref={coreRef}></div>
    </>
  );
};
