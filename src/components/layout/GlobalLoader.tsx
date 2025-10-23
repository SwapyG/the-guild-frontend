"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GuildLogo from "./GuildLogo";
import { useTheme } from "next-themes";

const loadingMessages = [
  "Forging neural pathways...",
  "Summoning elite operatives...",
  "Synchronizing mission intel...",
  "Calibrating the Guild systems...",
  "Polishing the steel...",
  "Architecting the future of work...",
];

export const GlobalLoader = () => {
  const [index, setIndex] = useState(0);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden transition-colors duration-700
        ${isDark ? "bg-[#020617]" : "bg-[#f1f5f9]"}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Glowing background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={`absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-30 animate-pulse
          ${isDark ? "bg-blue-500/40" : "bg-blue-300/40"}`}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, -40, 40, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 12,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-25
          ${isDark ? "bg-purple-600/30" : "bg-indigo-300/30"}`}
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 40, -40, 0],
            scale: [1, 1.1, 0.95, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Rotating halo */}
      <motion.div
        className={`absolute w-[220px] h-[220px] rounded-full blur-2xl ${
          isDark ? "bg-gradient-to-r from-blue-500/20 to-indigo-600/20" : "bg-gradient-to-r from-blue-400/25 to-indigo-400/25"
        }`}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      />

      {/* Main logo pulse */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.8, 1, 0.8],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <GuildLogo
          className={`h-20 w-20 ${
            isDark ? "text-slate-100" : "text-slate-800"
          } drop-shadow-[0_0_25px_rgba(56,189,248,0.3)]`}
        />
      </motion.div>

      {/* Message transition */}
      <div className="mt-8 h-6 text-center text-base font-medium">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
            transition={{ duration: 0.6 }}
            className={`tracking-wide ${
              isDark
                ? "bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 text-transparent bg-clip-text"
                : "bg-gradient-to-r from-blue-700 via-indigo-600 to-sky-600 text-transparent bg-clip-text"
            }`}
          >
            {loadingMessages[index]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Subtle bottom glow */}
      <motion.div
        className={`absolute bottom-0 w-[80%] h-[2px] rounded-full blur-sm mx-auto ${
          isDark ? "bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600" : "bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-400"
        }`}
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.div>
  );
};
