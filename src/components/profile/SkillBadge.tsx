// src/components/profile/SkillBadge.tsx

"use client";

import { UserSkill, SkillProficiency } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";

interface SkillBadgeProps {
  userSkill: UserSkill;
  onProficiencyChange: (skillId: string, proficiency: SkillProficiency) => void;
  onRemove: (skillId: string) => void;
  isUpdating: boolean;
}

export const SkillBadge = ({ userSkill, onProficiencyChange, onRemove, isUpdating }: SkillBadgeProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-secondary rounded-md">
      <div className="flex flex-col items-start gap-2">
        <p className="font-semibold">{userSkill.skill.name}</p>
        <Select
          value={userSkill.proficiency}
          onValueChange={(value) => onProficiencyChange(userSkill.skill.id, value as SkillProficiency)}
          disabled={isUpdating}
        >
          <SelectTrigger className="h-7 px-2 text-xs w-auto">
            <SelectValue />
          </SelectTrigger>
          {/* --- NANO: THIS IS THE FIX --- */}
          {/* Applying popper positioning to this dropdown prevents it from being clipped */}
          <SelectContent position="popper" side="bottom">
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
            <SelectItem value="Expert">Expert</SelectItem>
          </SelectContent>
          {/* ----------------------------- */}
        </Select>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full shrink-0" onClick={() => onRemove(userSkill.skill.id)} disabled={isUpdating}>
        <X className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
};