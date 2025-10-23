"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Skill, SkillProficiency } from "@/types";
import { getSkills, createMission, MissionCreatePayload } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trash2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMissionCreated: () => void;
}

type FormRole = {
  id: number;
  role_description: string;
  skill_id_required: string;
  proficiency_required: SkillProficiency;
};

export const CreateMissionModal = ({
  isOpen,
  onClose,
  onMissionCreated,
}: CreateMissionModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roles, setRoles] = useState<FormRole[]>([
    { id: 1, role_description: "", skill_id_required: "", proficiency_required: "Intermediate" },
  ]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load available skills when modal opens
  useEffect(() => {
    if (isOpen) getSkills().then(setSkills).catch(console.error);
  }, [isOpen]);

  const handleRoleChange = (
    index: number,
    field: keyof FormRole,
    value: string | SkillProficiency
  ) =>
    setRoles((roles) =>
      roles.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );

  const addRole = () => {
    if (roles.some((r) => !r.role_description.trim() || !r.skill_id_required.trim())) {
      toast.error("Complete current role details before adding another.");
      return;
    }
    setRoles([
      ...roles,
      {
        id: Date.now(),
        role_description: "",
        skill_id_required: "",
        proficiency_required: "Intermediate",
      },
    ]);
  };

  const removeRole = (id: number) => setRoles((r) => r.filter((x) => x.id !== id));

  const handleSubmit = async () => {
    if (!title || roles.some((r) => !r.role_description || !r.skill_id_required)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading("Creating mission...");

    const payload: MissionCreatePayload = {
      title,
      description,
      roles: roles.map(({ id, ...r }) => r),
    };

    try {
      await createMission(payload);
      toast.success("Mission created successfully!", { id: toastId });
      onMissionCreated();
      setTitle("");
      setDescription("");
      setRoles([
        { id: 1, role_description: "", skill_id_required: "", proficiency_required: "Intermediate" },
      ]);
      onClose();
    } catch (error) {
      let msg = "Failed to create mission.";
      if (axios.isAxiosError(error) && error.response)
        msg = error.response.data.detail || msg;
      toast.error(msg, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent
            className={`
              sm:max-w-[620px] max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl backdrop-blur-xl
              ${isDark
                ? "bg-[rgba(17,17,17,0.8)] border-border/40"
                : "bg-[rgba(255,255,255,0.9)] border-border/30"
              }
            `}
          >
            <motion.div
              key="mission-modal"
              initial={{ opacity: 0, scale: 0.97, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <DialogHeader className="space-y-2">
                <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Create a New Mission
                </DialogTitle>
                <DialogDescription>
                  Define your mission objectives and specify the roles needed for success.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Mission Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Operation Nebula Expansion"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe mission objectives..."
                    rows={4}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Mission Roles</Label>
                  {roles.map((role, index) => (
                    <motion.div
                      key={role.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`
                        relative grid grid-cols-1 gap-4 p-4 rounded-lg border backdrop-blur-sm
                        ${isDark
                          ? "bg-card/30 border-border/40"
                          : "bg-white/70 border-border/20"
                        }
                      `}
                    >
                      {roles.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6"
                          onClick={() => removeRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}

                      <Input
                        placeholder="Role Description (e.g., Lead Data Engineer)"
                        value={role.role_description}
                        onChange={(e) =>
                          handleRoleChange(index, "role_description", e.target.value)
                        }
                      />
                      <div className="grid grid-cols-2 gap-4">
                        {/* Skills Dropdown */}
                        <Select
                          onValueChange={(val) =>
                            handleRoleChange(index, "skill_id_required", val)
                          }
                          value={role.skill_id_required}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Required Skill" />
                          </SelectTrigger>
                          <SelectContent
                            className={`
                              rounded-lg border shadow-lg max-h-[250px] overflow-y-auto
                              ${isDark
                                ? "bg-[rgba(17,17,17,0.85)] border-border/40 backdrop-blur-md"
                                : "bg-[rgba(255,255,255,0.95)] border-border/30"
                              }
                            `}
                          >
                            {skills.map((s) => (
                              <SelectItem key={s.id} value={s.id}>
                                {s.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Proficiency Dropdown */}
                        <Select
                          onValueChange={(val) =>
                            handleRoleChange(index, "proficiency_required", val as SkillProficiency)
                          }
                          value={role.proficiency_required}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Proficiency" />
                          </SelectTrigger>
                          <SelectContent
                            className={`
                              rounded-lg border shadow-lg
                              ${isDark
                                ? "bg-[rgba(17,17,17,0.85)] border-border/40 backdrop-blur-md"
                                : "bg-[rgba(255,255,255,0.95)] border-border/30"
                              }
                            `}
                          >
                            {["Beginner", "Intermediate", "Advanced", "Expert"].map((p) => (
                              <SelectItem key={p} value={p}>
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  ))}

                  <Button variant="outline" onClick={addRole}>
                    Add Another Role
                  </Button>
                </div>
              </div>

              <DialogFooter>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Mission"}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
};
