"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function GlobalLoader() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";
  const primaryGlow = isDark ? "#60a5fa" : "#2563eb";
  const secondaryGlow = isDark ? "#818cf8" : "#3b82f6";

  return (
    <AnimatePresence>
      <motion.div
        key="guild-nexus-loader"
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-background/70 backdrop-blur-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        {/* --- Pulsing Energy Fields --- */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full blur-[140px] opacity-25"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${primaryGlow}, transparent 70%)`,
          }}
          animate={{ scale: [1, 1.1, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[900px] h-[900px] rounded-full blur-[200px] opacity-15"
          style={{
            background: `radial-gradient(circle at 80% 20%, ${secondaryGlow}, transparent 70%)`,
          }}
          animate={{ scale: [1.1, 1, 1.1], rotate: [0, -45, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* --- Central Command Node --- */}
        <motion.div
          className="relative z-10 flex flex-col items-center text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Rotating Nexus Ring */}
          <motion.div
            className="relative h-32 w-32 mb-6 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute inset-0 rounded-full border-[3px] border-t-transparent border-primary/60 border-r-primary/20"
              style={{ boxShadow: `0 0 45px ${primaryGlow}` }}
            />
            {/* Inner rotating energy ring */}
            <motion.div
              className="absolute inset-4 rounded-full border-[1px] border-dashed border-primary/30"
              animate={{ rotate: -360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
            />

            {/* “The Guild” text core */}
            <motion.h1
              className="text-2xl font-bold tracking-widest uppercase text-primary drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] select-none"
              animate={{
                opacity: [0.8, 1, 0.8],
                scale: [1, 1.05, 1],
                textShadow: [
                  `0 0 10px ${primaryGlow}`,
                  `0 0 25px ${secondaryGlow}`,
                  `0 0 10px ${primaryGlow}`,
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              The Guild
            </motion.h1>
          </motion.div>

          {/* Status Line */}
          <motion.p
            className="text-sm md:text-base font-medium tracking-[0.2em] text-foreground/80 uppercase"
            animate={{
              opacity: [0.5, 1, 0.5],
              letterSpacing: ["0.12em", "0.22em", "0.12em"],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            Activating Mission Channels...
          </motion.p>

          {/* Energy Progress Line */}
          <motion.div
            className="mt-6 w-56 h-[3px] rounded-full overflow-hidden bg-muted/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              className="h-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.6)]"
              initial={{ width: "0%" }}
              animate={{ width: ["0%", "100%", "0%"] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </motion.div>

        {/* --- Ambient Data Particles --- */}
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-primary/40"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: ["0%", "-120%"],
              opacity: [0, 1, 0],
              scale: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 5 + Math.random() * 4,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
