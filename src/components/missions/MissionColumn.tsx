// src/components/missions/MissionColumn.tsx

"use client";

import { useDroppable } from '@dnd-kit/core';
import { MissionStatus } from '@/types';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MissionColumnProps {
  status: MissionStatus;
  children: ReactNode;
}

export const MissionColumn = ({ status, children }: MissionColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "bg-secondary/50 rounded-lg p-4 transition-colors",
        isOver ? "bg-primary/20" : ""
      )}
    >
      {children}
    </div>
  );
};