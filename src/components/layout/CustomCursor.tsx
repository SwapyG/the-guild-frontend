// src/components/layout/CustomCursor.tsx (Upgraded with Smoother Physics and Click Feedback)

"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  // --- NANO: NEW STATE for click feedback ---
  const [isPressed, setIsPressed] = useState(false);
  
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // --- NANO: RE-TUNED PHYSICS for a smoother, less jittery feel ---
  // Reduced stiffness and increased damping/mass creates a more fluid trail.
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

    // --- NANO: ADDED LISTENERS for click state ---
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

  // --- NANO: VARIANTS for clean state-driven animation ---
  const cursorVariants: Variants = {
    default: {
      scale: 1,
      width: 40,
      height: 40,
      backgroundColor: "transparent",
      borderWidth: "2px",
    },
    hover: {
      scale: 1.5,
      width: 40,
      height: 40,
      backgroundColor: "hsl(var(--primary) / 0.2)",
      borderWidth: "2px",
    },
    press: {
      scale: 0.8,
      width: 40,
      height: 40,
      backgroundColor: "hsl(var(--primary) / 0.3)",
      borderWidth: "2px",
    }
  };

  const dotSize = 8;
  const outlineSize = 40;

  return (
    <>
      {/* The trailing outline circle */}
      <motion.div
        // --- NANO: UPGRADED Z-INDEX and ANIMATION LOGIC ---
        className="pointer-events-none fixed z-[9999] rounded-full border-primary"
        variants={cursorVariants}
        animate={isPressed ? "press" : isHovering ? "hover" : "default"}
        style={{
          translateX: springX,
          translateY: springY,
          left: -outlineSize / 2,
          top: -outlineSize / 2,
        }}
      />
      {/* The precise center dot */}
      <motion.div
        // --- NANO: UPGRADED Z-INDEX and ANIMATION LOGIC ---
        className="pointer-events-none fixed z-[9999] rounded-full bg-primary"
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