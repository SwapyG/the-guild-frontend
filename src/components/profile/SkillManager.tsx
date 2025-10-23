// src/components/profile/SkillManager.tsx (Final - Polished and Aligned)

"use client";

import { useState, useEffect, useMemo } from "react";
import { UserSkill, Skill, SkillProficiency } from "@/types";
import {
  addSkillToUser,
  removeSkillFromUser,
  getSkills,
} from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, PlusCircle, ChevronsUpDown, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { SkillBadge } from "./SkillBadge";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

interface SkillManagerProps {
  initialSkills: UserSkill[];
}

export const SkillManager = ({ initialSkills }: SkillManagerProps) => {
  const [userSkills, setUserSkills] = useState<UserSkill[]>(initialSkills);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [selectedProficiency, setSelectedProficiency] =
    useState<SkillProficiency>("Intermediate");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  // Fetch all available skills once
  useEffect(() => {
    getSkills()
      .then(setAllSkills)
      .catch(() => toast.error("Failed to load skills list."));
  }, []);

  const availableSkills = useMemo(
    () =>
      allSkills
        .filter(
          (skill) => !userSkills.some((userSkill) => userSkill.skill.id === skill.id)
        )
        .sort((a, b) => a.name.localeCompare(b.name)),
    [allSkills, userSkills]
  );

  const handleProficiencyChange = async (
    skillId: string,
    proficiency: SkillProficiency
  ) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Updating proficiency...");
    try {
      const updatedUser = await addSkillToUser({ skill_id: skillId, proficiency });
      setUserSkills(updatedUser.skills);
      toast.success("Proficiency updated!", { id: toastId });
    } catch {
      toast.error("Failed to update proficiency.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSkill = async () => {
    if (!selectedSkillId) {
      toast.error("Please select a skill to add.");
      return;
    }
    setIsSubmitting(true);
    const toastId = toast.loading("Adding skill...");
    try {
      const updatedUser = await addSkillToUser({
        skill_id: selectedSkillId,
        proficiency: selectedProficiency,
      });
      setUserSkills(updatedUser.skills);
      toast.success("Skill added!", { id: toastId });
      setSelectedSkillId("");
    } catch {
      toast.error("Failed to add skill.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Removing skill...");
    try {
      const updatedUser = await removeSkillFromUser(skillId);
      setUserSkills(updatedUser.skills);
      toast.success("Skill removed!", { id: toastId });
    } catch {
      toast.error("Failed to remove skill.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Skills */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Your Current Skills</h3>
        {userSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userSkills.map((userSkill) => (
              <SkillBadge
                key={userSkill.skill.id}
                userSkill={userSkill}
                onProficiencyChange={handleProficiencyChange}
                onRemove={handleRemoveSkill}
                isUpdating={isSubmitting}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You haven't added any skills yet.
          </p>
        )}
      </div>

      {/* Add New Skill */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Add New Skill</h3>
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg bg-card shadow-sm">
          {/* Skill Selector */}
          <div className="w-full flex-1">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {selectedSkillId
                    ? allSkills.find((skill) => skill.id === selectedSkillId)?.name
                    : "Select a skill to add..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                sideOffset={6}
                className="min-w-[var(--radix-popover-trigger-width)] p-0 rounded-md shadow-lg dark:shadow-primary/10 border bg-popover"
              >
                <Command>
                  <CommandInput
                    placeholder="Search skills..."
                    className="border-b border-muted px-3 py-2 focus:ring-0 focus:outline-none text-sm"
                  />
                  <CommandEmpty>No skill found.</CommandEmpty>
                  <CommandGroup>
                    <div className="max-h-60 overflow-y-auto custom-scrollbar">
                      {availableSkills.map((skill) => (
                        <CommandItem
                          key={skill.id}
                          value={skill.name}
                          onSelect={() => {
                            setSelectedSkillId(
                              skill.id === selectedSkillId ? "" : skill.id
                            );
                            setOpen(false);
                          }}
                          className={cn(
                            "flex items-center transition-colors cursor-pointer"
                          )}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedSkillId === skill.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {skill.name}
                        </CommandItem>
                      ))}
                    </div>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Proficiency Selector */}
          <div className="w-full md:w-auto">
            <Select
              onValueChange={(value) =>
                setSelectedProficiency(value as SkillProficiency)
              }
              defaultValue={selectedProficiency}
            >
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Proficiency" />
              </SelectTrigger>
              <SelectContent side="bottom">
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
                <SelectItem value="Expert">Expert</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Button */}
          <div className="w-full md:w-auto">
            <Button
              className="w-full"
              onClick={handleAddSkill}
              disabled={isSubmitting || !selectedSkillId}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
