"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Engine, IOptions, RecursivePartial } from "@tsparticles/engine";
import { loadFull } from "tsparticles";
import { useTheme } from "next-themes";

export const AnimatedBackground = () => {
  const [engineReady, setEngineReady] = useState(false);
  const { resolvedTheme } = useTheme();
  const parallaxRef = useRef<HTMLDivElement>(null);

  // ✅ Initialize tsparticles
  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => setEngineReady(true));
  }, []);

  // ✅ Parallax gradient
  useEffect(() => {
    const move = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const options: RecursivePartial<IOptions> = useMemo(() => {
    const isDark = resolvedTheme === "dark";

    return {
      fullScreen: { enable: false },
      fpsLimit: 120,
      detectRetina: true,
      background: { color: { value: "transparent" } },
      interactivity: {
        detectsOn: "window", // ✅ ensures interaction even when canvas is behind UI
        events: {
          onHover: {
            enable: true,
            mode: ["grab", "repulse", "bubble"],
            parallax: { enable: true, force: 60, smooth: 12 },
          },
          onClick: {
            enable: true,
            mode: ["push", "repulse", "connect"],
          },
          resize: { enable: true },
        },
        modes: {
          grab: { distance: 220, links: { opacity: 0.7 } },
          repulse: { distance: 150, duration: 0.5, speed: 1 },
          bubble: {
            distance: 200,
            size: 8,
            duration: 2,
            opacity: 0.9,
            color: { value: isDark ? "#60a5fa" : "#2563eb" },
          },
          push: { quantity: 3 },
          connect: { distance: 120, radius: 180, links: { opacity: 0.6 } },
        },
      },
      particles: {
        number: { value: 100, density: { enable: true, area: 900 } },
        color: {
          value: isDark
            ? ["#ffffff", "#38bdf8", "#a78bfa"]
            : ["#2563eb", "#0ea5e9", "#6366f1"],
        },
        links: {
          enable: true,
          distance: 140,
          color: isDark ? "#818cf8" : "#1e3a8a",
          opacity: isDark ? 0.25 : 0.55,
          width: 1.1,
        },
        move: {
          enable: true,
          speed: 0.6,
          random: false,
          straight: false,
          direction: "none",
          outModes: { default: "out" },
          attract: { enable: true, rotateX: 600, rotateY: 1200 },
        },
        opacity: {
          value: { min: 0.3, max: 0.6 },
          animation: { enable: true, speed: 0.4, sync: false },
        },
        size: {
          value: { min: 1, max: 3.5 },
          animation: { enable: true, speed: 2, minimumValue: 0.4 },
        },
      },
    } as RecursivePartial<IOptions>;
  }, [resolvedTheme]);

  if (!engineReady) return null;
  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden transition-colors duration-700">
      {/* 🌌 Parallax Gradient */}
      <div
        ref={parallaxRef}
        className={`absolute inset-0 blur-3xl transition-transform duration-100 ease-linear ${
          isDark
            ? "bg-[radial-gradient(ellipse_at_top_left,_#1e3a8a_0%,_transparent_60%),radial-gradient(ellipse_at_bottom_right,_#00bcd4_0%,_transparent_70%)] opacity-25"
            : "bg-[radial-gradient(ellipse_at_top_left,_#93c5fd_0%,_transparent_60%),radial-gradient(ellipse_at_bottom_right,_#a5b4fc_0%,_transparent_70%)] opacity-55"
        }`}
      />

      {/* ✨ Interactive Particles */}
      <Particles id="tsparticles" options={options} />

      {/* 🧊 Frosted Glass Layer */}
      <div
        className={`absolute inset-0 backdrop-blur-[6px] border-t border-white/10 transition-all duration-700 ${
          isDark
            ? "bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.04)_0%,rgba(0,0,0,0.5)_100%)]"
            : "bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0.2)_100%)]"
        }`}
      />

      {/* 💫 Soft shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay animate-[shimmer_6s_infinite_linear]"
        style={{
          background:
            "linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </div>
  );
};
