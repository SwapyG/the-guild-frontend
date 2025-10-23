// src/components/layout/GlobalLoader.tsx (Upgraded Version)

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GuildLogo from "./GuildLogo";

const loadingMessages = [
  "Architecting the Future of Work...",
  "Assembling the Guild...",
  "Verifying Credentials...",
  "Forging Connections...",
];

export const GlobalLoader = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    // NANO: This outer div now handles the fade-in and fade-out transition.
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* The logo's pulsing animation remains */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
        }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <GuildLogo className="h-16 w-16 text-foreground/80" />
      </motion.div>
      
      {/* NANO: AnimatePresence handles the cross-fade between messages */}
      <div className="mt-6 h-5 text-sm text-muted-foreground">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            {loadingMessages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};