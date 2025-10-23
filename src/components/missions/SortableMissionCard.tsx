"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Mission } from "@/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { GripVertical } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SortableMissionCardProps {
  mission: Mission;
}

export const SortableMissionCard = ({ mission }: SortableMissionCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: mission.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout
      initial={false}
      animate={{
        scale: isDragging ? 1.03 : 1,
        opacity: isDragging ? 0.6 : 1,
        boxShadow: isDragging
          ? "0 0 24px rgba(59,130,246,0.3)"
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Card
        className={cn(
          "relative group bg-card/60 backdrop-blur-sm border border-border/40 transition-all",
          "hover:border-primary/40 hover:shadow-md"
        )}
      >
        {/* Clickable Mission Area */}
        <Link
          href={`/missions/${mission.id}`}
          className="block p-5 pt-12 focus:outline-none focus:ring-2 focus:ring-primary/40 rounded-lg"
        >
          <CardHeader className="p-0">
            <CardTitle className="text-lg font-semibold tracking-tight">
              {mission.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 pt-2 text-sm text-muted-foreground">
            <p>Lead: {mission.lead.name}</p>
          </CardContent>

          <CardFooter className="p-0 pt-3 text-xs text-muted-foreground">
            <p>{mission.roles.length} role(s) defined</p>
          </CardFooter>
        </Link>

        {/* 🧭 DRAG HANDLE */}
        <motion.button
          type="button"
          aria-label="Drag to reorder"
          {...attributes}
          {...listeners}
          className={cn(
            "absolute top-3 right-3 p-1 cursor-grab active:cursor-grabbing",
            "text-muted-foreground rounded-md hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
            "opacity-0 group-hover:opacity-100 transition-opacity"
          )}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
        >
          <GripVertical className="h-5 w-5" />
        </motion.button>
      </Card>
    </motion.div>
  );
};
