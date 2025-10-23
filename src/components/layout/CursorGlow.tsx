"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";
import { useTheme } from "next-themes";

/**
 * A smooth, high-performance mouse-following ambient glow.
 * Designed to integrate with AnimatedBackground and CustomCursor.
 */
export const CursorGlow = () => {
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", updatePosition, { passive: true });
    return () => window.removeEventListener("mousemove", updatePosition);
  }, [mouseX, mouseY]);

  // ⚙️ Smooth physics configuration — feels “60 FPS” without lag
  const springConfig = { damping: 25, stiffness: 150, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 🎨 Adaptive colors
  const isDark = resolvedTheme === "dark";
  const glowColor = isDark
    ? "radial-gradient(circle, rgba(59,130,246,0.15), rgba(147,197,253,0.08), transparent 70%)"
    : "radial-gradient(circle, rgba(37,99,235,0.10), rgba(234,179,8,0.05), transparent 70%)";

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[45] hidden md:block rounded-full mix-blend-screen will-change-transform"
      style={{
        translateX: smoothX,
        translateY: smoothY,
        x: "-50%",
        y: "-50%",
        width: 800,
        height: 800,
        background: glowColor,
        filter: "blur(100px)",
      }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    />
  );
};
