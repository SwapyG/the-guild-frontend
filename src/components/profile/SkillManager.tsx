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
import { motion } from "framer-motion";

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
    <div className="space-y-10">
      {/* === Current Skills Section === */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="space-y-4"
      >
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
          <p className="text-sm text-muted-foreground italic">
            You haven’t added any skills yet. Start by adding one below.
          </p>
        )}
      </motion.div>

      {/* === Add New Skill Section === */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border border-border/60 rounded-xl bg-card/50 backdrop-blur-sm p-6 shadow-md space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-xl font-semibold">Add New Skill</h3>
          <p className="text-sm text-muted-foreground">
            Choose a skill and assign proficiency.
          </p>
        </div>

        {/* Input Row */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          {/* Skill Dropdown */}
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
                    : "Select a skill..."}
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
                            setSelectedSkillId(skill.id);
                            setOpen(false);
                          }}
                          className="flex items-center px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
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

          {/* Proficiency Select */}
          <div className="w-full md:w-[180px]">
            <Select
              onValueChange={(value) =>
                setSelectedProficiency(value as SkillProficiency)
              }
              defaultValue={selectedProficiency}
            >
              <SelectTrigger className="w-full">
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
          <Button
            onClick={handleAddSkill}
            disabled={isSubmitting || !selectedSkillId}
            className="w-full md:w-auto rounded-full px-5 shadow-md hover:shadow-[0_0_20px_rgba(59,130,246,0.25)] transition-all"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
