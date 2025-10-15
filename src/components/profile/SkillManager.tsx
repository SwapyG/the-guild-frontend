// src/components/profile/SkillManager.tsx

"use client";

import { useState, useEffect } from 'react';
import { UserSkill, Skill, SkillProficiency } from '@/types';
import { getSkills, addSkillToUser, removeSkillFromUser, AddSkillPayload } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, PlusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SkillManagerProps {
  initialSkills: UserSkill[];
}

export const SkillManager = ({ initialSkills }: SkillManagerProps) => {
  const [userSkills, setUserSkills] = useState(initialSkills);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  
  // State for the "Add New" form
  const [selectedSkillId, setSelectedSkillId] = useState<string>('');
  const [selectedProficiency, setSelectedProficiency] = useState<SkillProficiency>('Intermediate');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch the master list of all skills for the dropdown
    getSkills().then(setAllSkills).catch(console.error);
  }, []);

  const handleAddSkill = async () => {
    if (!selectedSkillId) {
      toast.error('Please select a skill to add.');
      return;
    }
    
    setIsSubmitting(true);
    const payload: AddSkillPayload = {
      skill_id: selectedSkillId,
      proficiency: selectedProficiency,
    };

    const toastId = toast.loading('Adding skill...');
    try {
      const updatedUser = await addSkillToUser(payload);
      setUserSkills(updatedUser.skills);
      toast.success('Skill added!', { id: toastId });
      // Reset form
      setSelectedSkillId('');
    } catch (error) {
      toast.error('Failed to add skill.', { id: toastId });
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    const toastId = toast.loading('Removing skill...');
    try {
      const updatedUser = await removeSkillFromUser(skillId);
      setUserSkills(updatedUser.skills);
      toast.success('Skill removed!', { id: toastId });
    } catch (error) {
      toast.error('Failed to remove skill.', { id: toastId });
      console.error(error);
    }
  };

  // Filter out skills the user already has from the dropdown
  const availableSkills = allSkills.filter(
    skill => !userSkills.some(userSkill => userSkill.skill.id === skill.id)
  );

  return (
    <div className="space-y-6">
      {/* List of current skills */}
      <div className="space-y-2">
        {userSkills.length > 0 ? (
          userSkills.map(({ skill, proficiency }) => (
            <div key={skill.id} className="flex items-center justify-between p-3 bg-secondary rounded-md">
              <div>
                <p className="font-semibold">{skill.name}</p>
                <Badge variant="outline" className="mt-1">{proficiency}</Badge>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveSkill(skill.id)}>
                <X className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">You haven't added any skills yet.</p>
        )}
      </div>

      {/* Form to add a new skill */}
      <div className="flex flex-col md:flex-row items-center gap-4 p-4 border rounded-lg">
        <div className="w-full md:w-1/2">
          <Select onValueChange={setSelectedSkillId} value={selectedSkillId}>
            <SelectTrigger><SelectValue placeholder="Select a skill to add..." /></SelectTrigger>
            <SelectContent>
              {availableSkills.map(skill => (
                <SelectItem key={skill.id} value={skill.id}>{skill.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/4">
           <Select onValueChange={(value) => setSelectedProficiency(value as SkillProficiency)} defaultValue={selectedProficiency}>
            <SelectTrigger><SelectValue placeholder="Proficiency" /></SelectTrigger>
            <SelectContent>
              {(['Beginner', 'Intermediate', 'Advanced', 'Expert'] as SkillProficiency[]).map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full md:w-1/4">
          <Button className="w-full" onClick={handleAddSkill} disabled={isSubmitting}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </div>
    </div>
  );
};