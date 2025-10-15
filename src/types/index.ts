// src/types/index.ts (Updated for Skill Ledger)

export type UserRole = 'Member' | 'Manager' | 'Admin';
export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type MissionStatus = 'Proposed' | 'Active' | 'Completed';
export type PitchStatus = 'Submitted' | 'Accepted' | 'Rejected';

// --- NEW: This interface defines the nested skill object in a user's profile ---
export interface UserSkill {
  skill: Skill;
  proficiency: SkillProficiency;
}
// -------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  photo_url?: string;
  role: UserRole;
  skills: UserSkill[]; // <-- UPDATED: The User type now includes their skills
}

export interface Skill {
  id: string;
  name: string;
}

export interface Mission {
  id: string;
  title: string;
  description?: string;
  lead_user_id: string;
  status: MissionStatus;
  created_at: string;
  lead: User;
  roles: MissionRole[];
}

export interface MissionRole {
  id: string;
  mission_id: string;
  role_description: string;
  skill_id_required: string;
  proficiency_required: SkillProficiency;
  assignee?: User;
  required_skill: Skill;
  mission: Mission;
}

export interface MissionPitch {
  id: string;
  mission_id: string;
  user_id: string;
  pitch_text: string;
  status: PitchStatus;
  user: User;
}