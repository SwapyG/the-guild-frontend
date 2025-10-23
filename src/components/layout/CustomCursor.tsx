// src/components/layout/CustomCursor.tsx (Corrected with pointer-events-none)

"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// From your globals.css, --primary is '220 90% 50%'.
const primaryColorValue = "220 90% 50%";

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 30, stiffness: 200, mass: 0.7 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursorX, cursorY]);

  const cursorVariants: Variants = {
    default: {
      scale: 1,
      backgroundColor: `hsla(${primaryColorValue}, 0)`,
    },
    hover: {
      scale: 1.5,
      backgroundColor: `hsla(${primaryColorValue}, 0.2)`,
    },
    press: {
      scale: 0.8,
      backgroundColor: `hsla(${primaryColorValue}, 0.3)`,
    }
  };

  const dotSize = 8;
  const outlineSize = 40;

  return (
    <>
      {/* The trailing outline circle */}
      <motion.div
        // --- NANO: CRITICAL FIX ---
        // The 'pointer-events-none' class makes this div invisible to clicks,
        // allowing interactions to pass through to the elements underneath.
        className="pointer-events-none fixed z-[9999] rounded-full border-2 border-primary"
        // -------------------------
        variants={cursorVariants}
        animate={isPressed ? "press" : isHovering ? "hover" : "default"}
        style={{
          translateX: springX,
          translateY: springY,
          width: outlineSize,
          height: outlineSize,
          left: -outlineSize / 2,
          top: -outlineSize / 2,
        }}
      />
      {/* The precise center dot */}
      <motion.div
        // --- NANO: CRITICAL FIX ---
        // This must also be non-interactive.
        className="pointer-events-none fixed z-[9999] rounded-full bg-primary"
        // -------------------------
        animate={{ scale: isPressed ? 0.5 : isHovering ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        style={{
          translateX: cursorX,
          translateY: cursorY,
          left: -dotSize / 2,
          top: -dotSize / 2,
          width: dotSize,
          height: dotSize,
        }}
      />
    </>
  );
};