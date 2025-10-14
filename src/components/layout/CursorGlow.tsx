"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export const CursorGlow = () => {
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const springConfig = { damping: 40, stiffness: 200, mass: 2 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block rounded-full"
      style={{
        translateX: smoothMouseX,
        translateY: smoothMouseY,
        x: "-50%",
        y: "-50%",
        width: '800px',
        height: '800px',
        background: "radial-gradient(circle, hsl(var(--primary) / 0.1), transparent 60%)",
      }}
    />
  );
};