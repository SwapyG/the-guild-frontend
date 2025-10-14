// src/components/missions/CreateMissionModal.tsx (Corrected for Auth)

"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { User, Skill, SkillProficiency } from '@/types';
// Note: getUsers is no longer needed here
import { getSkills, createMission, MissionCreatePayload } from '@/services/api'; 

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react';

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

export const CreateMissionModal = ({ isOpen, onClose, onMissionCreated }: CreateMissionModalProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  // --- REMOVED ---
  // const [leadUserId, setLeadUserId] = useState('');
  // const [users, setUsers] = useState<User[]>([]);
  // ---------------
  const [roles, setRoles] = useState<FormRole[]>([
    { id: 1, role_description: '', skill_id_required: '', proficiency_required: 'Intermediate' }
  ]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // We only need to fetch skills now
      getSkills().then(setSkills).catch(console.error);
    }
  }, [isOpen]);

  const handleRoleChange = (index: number, field: keyof FormRole, value: string | SkillProficiency) => {
    setRoles(currentRoles => 
      currentRoles.map((role, i) => {
        if (i === index) {
          return { ...role, [field]: value };
        }
        return role;
      })
    );
  };

  const addRole = () => {
    setRoles([...roles, { id: Date.now(), role_description: '', skill_id_required: '', proficiency_required: 'Intermediate' }]);
  };

  const removeRole = (id: number) => {
    setRoles(roles.filter(role => role.id !== id));
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setRoles([{ id: 1, role_description: '', skill_id_required: '', proficiency_required: 'Intermediate' }]);
  }

  const handleSubmit = async () => {
    // Updated validation: no longer checks for leadUserId
    if (!title || roles.some(r => !r.role_description || !r.skill_id_required)) {
      toast.error('Please fill in the mission title and all role details.');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Creating new mission...');
    
    // --- PAYLOAD IS NOW CORRECT ---
    const payload: MissionCreatePayload = {
      title,
      description,
      // lead_user_id is no longer sent
      roles: roles.map(({ id, ...rest }) => rest),
    };
    // ----------------------------

    try {
      await createMission(payload);
      toast.success('Mission created successfully!', { id: toastId });
      onMissionCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to create mission:", error);
      let errorMessage = "Failed to create mission.";
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `Error: ${error.response.data.detail || 'Please check your inputs.'}`;
      }
      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Mission</DialogTitle>
          <DialogDescription>
            You will be the lead for this mission. Define the objectives and specify the roles needed to succeed.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Mission Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Launch V2 of the Platform" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the mission's goals and objectives..." />
          </div>
          
          {/* --- MISSION LEAD DROPDOWN REMOVED --- */}
          
          <div className="space-y-4">
            <Label>Mission Roles</Label>
            {roles.map((role, index) => (
              <div key={role.id} className="grid grid-cols-1 gap-4 p-4 border rounded-lg relative">
                 {roles.length > 1 && (
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => removeRole(role.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                 )}
                <Input placeholder="Role Description (e.g., Lead Backend Engineer)" value={role.role_description} onChange={(e) => handleRoleChange(index, 'role_description', e.target.value)} />
                <div className="grid grid-cols-2 gap-4">
                  <Select onValueChange={(value) => handleRoleChange(index, 'skill_id_required', value)} value={role.skill_id_required}>
                    <SelectTrigger><SelectValue placeholder="Required Skill" /></SelectTrigger>
                    <SelectContent>
                      {skills.map(skill => <SelectItem key={skill.id} value={skill.id}>{skill.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select onValueChange={(value) => handleRoleChange(index, 'proficiency_required', value)} defaultValue={role.proficiency_required}>
                    <SelectTrigger><SelectValue placeholder="Proficiency" /></SelectTrigger>
                    <SelectContent>
                      {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillProficiency[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
            <Button variant="outline" onClick={addRole}>Add Another Role</Button>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Mission"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};