"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container, Engine, IOptions, RecursivePartial } from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import { useTheme } from "next-themes";

export const AnimatedBackground = () => {
  const [engineReady, setEngineReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const tintRef = useRef<HTMLDivElement>(null);

  // Initialize tsparticles
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => setEngineReady(true));
  }, []);

  // Parallax movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Glass tilt + brightness based on scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || 0;
      const tilt = Math.min(scrollY / 200, 1); // glass tilt
      const brightness = 1 + Math.min(scrollY / 1000, 0.15); // glass brightness
      if (glassRef.current) {
        glassRef.current.style.transform = `rotateX(${tilt * 3}deg) translateY(${tilt * -4}px)`;
        glassRef.current.style.filter = `brightness(${brightness})`;
      }
      if (tintRef.current) {
        tintRef.current.style.opacity = `${0.7 - tilt * 0.2}`; // fade tint as you scroll
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const particlesLoaded = async (_?: Container): Promise<void> => {};

  const options: RecursivePartial<IOptions> = useMemo(() => {
    const isDark = resolvedTheme === "dark";
    return {
      fullScreen: { enable: false },
      detectRetina: true,
      fpsLimit: 120,
      background: { color: { value: "transparent" } },
      interactivity: {
        detectsOn: "canvas",
        events: {
          onHover: { enable: true, mode: ["grab", "repulse"] },
          onClick: { enable: true, mode: "push" },
          resize: { enable: true },
        },
        modes: {
          grab: { distance: 180, links: { opacity: 0.4 } },
          repulse: { distance: 120, duration: 0.3 },
          push: { quantity: 3 },
        },
      },
      particles: {
        number: { value: 80, density: { enable: true, area: 900 } },
        color: {
          value: isDark
            ? ["#ffffff", "#00BFFF", "#8A2BE2"]
            : ["#1d4ed8", "#0284c7", "#4338ca"],
        },
        links: {
          enable: true,
          color: isDark ? "#a5b4ff" : "#1e3a8a",
          distance: 150,
          opacity: isDark ? 0.35 : 0.65,
          width: 1.2,
        },
        move: {
          enable: true,
          speed: isDark ? 0.8 : 0.55,
          random: true,
          outModes: { default: "out" },
        },
        opacity: {
          value: isDark ? { min: 0.25, max: 0.6 } : { min: 0.5, max: 0.85 },
          animation: { enable: true, speed: 0.5, sync: false },
        },
        size: {
          value: { min: 1.5, max: isDark ? 3 : 3.5 },
          animation: { enable: true, speed: 2, minimumValue: 0.4, sync: false },
        },
        shadow: {
          enable: !isDark,
          color: "#1e3a8a",
          blur: 4,
        },
      },
    } as RecursivePartial<IOptions>;
  }, [resolvedTheme]);

  if (!engineReady) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-700">
      {/* BACKGROUND ORBS (Parallax) */}
      <div
        ref={parallaxRef}
        className={`absolute inset-0 blur-3xl transition-transform duration-100 ease-linear ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_top_left,_#1e3a8a_0%,_transparent_60%),radial-gradient(ellipse_at_bottom_right,_#00bcd4_0%,_transparent_70%)] opacity-25"
            : "bg-[radial-gradient(ellipse_at_top_left,_#93c5fd_0%,_transparent_60%),radial-gradient(ellipse_at_bottom_right,_#a5b4fc_0%,_transparent_70%)] opacity-60"
        }`}
      />

      {/* PARTICLES */}
      <Particles id="tsparticles" key={resolvedTheme} particlesLoaded={particlesLoaded} options={options} />

      {/* GLASS OVERLAY (Scroll + Brightness) */}
      <div
        ref={glassRef}
        className={`absolute inset-0 pointer-events-none backdrop-blur-md transition-transform duration-300 ease-out ${
          isDark
            ? "bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.08)_0%,rgba(0,0,0,0.6)_100%)] border-t border-white/10"
            : "bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.2)_100%)]"
        }`}
      />

      {/* LIGHT / DARK TINT LAYER (fades on scroll) */}
      <div
        ref={tintRef}
        className={`absolute inset-0 pointer-events-none mix-blend-soft-light transition-opacity duration-700 ${
          isDark
            ? "bg-gradient-to-b from-indigo-900/40 via-transparent to-black/70"
            : "bg-gradient-to-br from-blue-50/50 via-white/80 to-sky-100/50"
        }`}
      />
    </div>
  );
};
