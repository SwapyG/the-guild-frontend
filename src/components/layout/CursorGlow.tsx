// src/components/layout/CursorGlow.tsx

"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect } from "react";

export const CursorGlow = () => {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Use spring animation for a smoother, more natural follow effect
  const springConfig = { damping: 40, stiffness: 200, mass: 2 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
      style={{
        translateX: smoothMouseX,
        translateY: smoothMouseY,
        // The gradient itself: a large, blurred circle of light
        background: "radial-gradient(circle 400px, hsl(var(--primary) / 0.1), transparent 80%)",
      }}
      // Position the div's center on the cursor
      initial={{ x: "-50%", y: "-50%" }}
    />
  );
};