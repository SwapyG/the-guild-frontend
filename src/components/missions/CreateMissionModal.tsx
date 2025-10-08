// src/components/missions/CreateMissionModal.tsx

"use client";

import { useState, useEffect } from 'react';
import { User, Skill, SkillProficiency } from '@/types';
import { getUsers, getSkills, createMission, MissionCreatePayload } from '@/services/api';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2 } from 'lucide-react'; // Icon for removing a role

interface CreateMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMissionCreated: () => void;
}

// Define a type for a single role within our form state
type FormRole = {
  id: number; // A temporary ID for React key prop
  role_description: string;
  skill_id_required: string;
  proficiency_required: SkillProficiency;
};

export const CreateMissionModal = ({ isOpen, onClose, onMissionCreated }: CreateMissionModalProps) => {
  // State for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [leadUserId, setLeadUserId] = useState('');
  const [roles, setRoles] = useState<FormRole[]>([
    { id: 1, role_description: '', skill_id_required: '', proficiency_required: 'Intermediate' }
  ]);

  // State for populating dropdowns
  const [users, setUsers] = useState<User[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data for dropdowns when the modal opens
  useEffect(() => {
    if (isOpen) {
      getUsers().then(setUsers).catch(console.error);
      getSkills().then(setSkills).catch(console.error);
    }
  }, [isOpen]);

  // --- Handlers for dynamically managing roles ---
  const handleRoleChange = (index: number, field: keyof FormRole, value: string) => {
    const updatedRoles = [...roles];
    (updatedRoles[index] as any)[field] = value;
    setRoles(updatedRoles);
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
    setLeadUserId('');
    setRoles([{ id: 1, role_description: '', skill_id_required: '', proficiency_required: 'Intermediate' }]);
  }

  // --- Form Submission Logic ---
  const handleSubmit = async () => {
    // Basic validation
    if (!title || !leadUserId || roles.some(r => !r.role_description || !r.skill_id_required)) {
      alert('Please fill in all required fields for the mission and its roles.');
      return;
    }

    setIsSubmitting(true);
    const payload: MissionCreatePayload = {
      title,
      description,
      lead_user_id: leadUserId,
      roles: roles.map(({ id, ...rest }) => rest), // Remove the temporary client-side ID
    };

    try {
      await createMission(payload);
      onMissionCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Failed to create mission:", error);
      alert("Failed to create mission. See console for details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create a New Mission</DialogTitle>
          <DialogDescription>Define the objectives, select a lead, and specify the roles needed to succeed.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Mission Details */}
          <div className="grid gap-2">
            <Label htmlFor="title">Mission Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Launch V2 of the Platform" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the mission's goals and objectives..." />
          </div>
          <div className="grid gap-2">
            <Label>Mission Lead</Label>
            <Select onValueChange={setLeadUserId} value={leadUserId}>
              <SelectTrigger><SelectValue placeholder="Select a guild member" /></SelectTrigger>
              <SelectContent>
                {users.map(user => <SelectItem key={user.id} value={user.id}>{user.name} - {user.title}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Roles Section */}
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