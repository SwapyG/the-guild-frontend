"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Engine, IOptions, RecursivePartial } from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import { useTheme } from "next-themes";

export const AnimatedBackground = () => {
  const [engineReady, setEngineReady] = useState(false);
  const [particleCount, setParticleCount] = useState(130);
  const { resolvedTheme } = useTheme();
  const parallaxRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  // Initialize tsparticles
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => setEngineReady(true));
  }, []);

  // Adjust particle density based on device
  useEffect(() => {
    const cores = navigator.hardwareConcurrency || 4;
    const lowPerf = cores <= 4 || window.innerWidth < 1024;
    setParticleCount(lowPerf ? 80 : 150);
  }, []);

  // Mouse movement — parallax and spotlight effect
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10;
      const y = (e.clientY / innerHeight - 0.5) * 10;

      if (parallaxRef.current)
        parallaxRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;

      if (haloRef.current) {
        const isDark = document.documentElement.classList.contains("dark");
        haloRef.current.style.background = isDark
          ? `radial-gradient(circle at ${e.clientX}px ${e.clientY}px,
              rgba(147,197,253,0.4),
              rgba(99,102,241,0.2) 25%,
              transparent 60%)`
          : `radial-gradient(circle at ${e.clientX}px ${e.clientY}px,
              rgba(59,130,246,0.25),
              rgba(191,219,254,0.15) 25%,
              transparent 60%)`;
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  // Particle settings
  const options: RecursivePartial<IOptions> = useMemo(() => {
    const isDark = resolvedTheme === "dark";
    return {
      fullScreen: { enable: false },
      fpsLimit: 120,
      detectRetina: true,
      background: { color: { value: "transparent" } },
      interactivity: {
        detectsOn: "window",
        events: {
          onHover: { enable: true, mode: ["grab", "bubble"] },
          onClick: { enable: true, mode: ["push"] },
        },
        modes: {
          grab: { distance: 200, links: { opacity: 0.7 } },
          bubble: {
            distance: 180,
            size: 9,
            duration: 1.3,
            opacity: 1,
            color: { value: isDark ? "#93c5fd" : "#1d4ed8" },
          },
          push: { quantity: 2 },
        },
      },
      particles: {
        number: { value: particleCount, density: { enable: true, area: 900 } },
        color: {
          value: isDark
            ? ["#ffffff", "#93c5fd", "#c084fc"]
            : ["#1d4ed8", "#3b82f6", "#60a5fa"],
        },
        links: {
          enable: true,
          distance: 130,
          color: isDark ? "#93c5fd" : "#1e3a8a",
          opacity: isDark ? 0.35 : 0.5,
          width: 1.1,
        },
        move: {
          enable: true,
          speed: 0.7,
          random: true,
          outModes: { default: "out" },
        },
        opacity: {
          value: { min: 0.4, max: 0.9 },
          animation: { enable: true, speed: 0.8 },
        },
        size: {
          value: { min: 1.4, max: 3.4 },
          animation: { enable: true, speed: 2 },
        },
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.1,
            opacity: 1,
            color: { value: isDark ? "#60a5fa" : "#2563eb" },
          },
        },
      },
    } as RecursivePartial<IOptions>;
  }, [resolvedTheme, particleCount]);

  if (!engineReady) return null;
  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 🎨 Ambient Background with Parallax */}
      <div
        ref={parallaxRef}
        className={`absolute inset-0 transition-transform duration-100 ease-linear ${
          isDark
            ? "bg-[radial-gradient(circle_at_center,_#0f172a_0%,_transparent_80%)]"
            : "bg-[radial-gradient(circle_at_center,_#dbeafe_0%,_#bfdbfe_40%,_transparent_90%)]"
        }`}
      />

      {/* ✨ Particle Layer */}
      <Particles id="tsparticles" options={options} />

      {/* 🌫️ Frosted Glass Layer */}
      <div
        className={`absolute inset-0 backdrop-blur-[4px] transition-all duration-700 ${
          isDark ? "bg-[rgba(0,0,0,0.25)]" : "bg-[rgba(255,255,255,0.25)]"
        }`}
      />

      {/* 💡 Adaptive Vignette for Depth */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-700 ${
          isDark
            ? "bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.8)_100%)] opacity-70"
            : "bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.1)_100%)] opacity-90"
        }`}
      />

      {/* 🔵 Halo Spotlight */}
      <div
        ref={haloRef}
        className="absolute inset-0 pointer-events-none mix-blend-screen animate-pulse-halo"
      />

      <style jsx global>{`
        @keyframes pulse-halo {
          0% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
        }
        .animate-pulse-halo {
          animation: pulse-halo 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
