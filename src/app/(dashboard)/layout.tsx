"use client";

import { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Sidebar } from "@/components/layout/Sidebar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      {/* Full screen layout — single scrollable container */}
      <div className="relative flex min-h-screen overflow-hidden">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -15, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-20 hidden md:block"
        >
          <Sidebar />
        </motion.aside>

        {/* Main content */}
        <motion.main
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            // Single scroll container
            "relative flex-1 overflow-y-auto overflow-x-hidden",
            // Visual polish
            "bg-background/60 backdrop-blur-md border-l border-border/20",
            "px-4 sm:px-6 lg:px-8 py-6"
          )}
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </motion.main>
      </div>
    </ProtectedRoute>
  );
}
