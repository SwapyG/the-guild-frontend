"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { motion } from "framer-motion";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      {/* Entire page container */}
      <div className="relative flex min-h-screen overflow-hidden bg-background">

        {/* 🪄 Animated background lives behind everything */}
        <AnimatedBackground />

        {/* 🧭 Sidebar */}
        <motion.aside
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-20 flex-shrink-0"
        >
          <Sidebar />
        </motion.aside>

        {/* 🧩 Main content area */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 bg-background/60 backdrop-blur-lg border-l border-border/20 p-4 md:p-8"
        >
          {children}
        </motion.main>
      </div>

      {/* Hide browser scrollbars globally */}
      <style jsx global>{`
        html,
        body {
          overflow: hidden !important;
          background: transparent !important;
        }
        ::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
      `}</style>
    </ProtectedRoute>
  );
}
