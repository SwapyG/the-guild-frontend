"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

export const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Use useMotionValue for direct, non-rendering updates
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Use useSpring for the smooth, trailing effect
  const springConfig = { damping: 25, stiffness: 700, mass: 0.5 };
  const springX = useSpring(cursorX, springConfig);
  const springY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    // Add event listeners to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    });

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, [cursorX, cursorY]);

  const dotSize = 8;
  const outlineSize = 40;

  return (
    <>
      {/* The trailing outline circle */}
      <motion.div
        className={cn(
          "pointer-events-none fixed z-[100] rounded-full border-2 border-primary transition-transform duration-200",
          isHovering ? "bg-primary/20" : ""
        )}
        style={{
          translateX: springX,
          translateY: springY,
          width: isHovering ? 60 : outlineSize,
          height: isHovering ? 60 : outlineSize,
          left: -outlineSize / 2, // Center the div
          top: -outlineSize / 2,
        }}
      />
      {/* The precise center dot */}
      <motion.div
        className="pointer-events-none fixed z-[100] rounded-full bg-primary"
        style={{
          translateX: cursorX,
          translateY: cursorY,
          left: -dotSize / 2, // Center the div
          top: -dotSize / 2,
          width: dotSize,
          height: dotSize,
          opacity: isHovering ? 0 : 1, // Hide dot on hover
        }}
      />
    </>
  );
};