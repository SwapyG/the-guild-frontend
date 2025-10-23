"use client";

import { useDroppable } from "@dnd-kit/core";
import { MissionStatus } from "@/types";
import { ReactNode, memo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MissionColumnProps {
  status: MissionStatus;
  children: ReactNode;
}

export const MissionColumn = memo(({ status, children }: MissionColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <motion.div
      ref={setNodeRef}
      layout
      initial={false}
      animate={{
        scale: isOver ? 1.02 : 1,
        boxShadow: isOver
          ? "0 0 24px rgba(59,130,246,0.25)"
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      className={cn(
        "rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-4 md:p-5 flex flex-col gap-3 transition-all",
        isOver ? "border-primary/40" : "border-border/30"
      )}
    >
      <AnimatePresence>{children}</AnimatePresence>
    </motion.div>
  );
});

MissionColumn.displayName = "MissionColumn";
