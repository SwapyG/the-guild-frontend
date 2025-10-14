// src/types/index.ts (Corrected for RBAC)

// --- ADD THE UserRole TYPE ---
export type UserRole = 'Member' | 'Manager' | 'Admin';
// -----------------------------

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type MissionStatus = 'Proposed' | 'Active' | 'Completed';

export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  photo_url?: string;
  // --- ADD THE role PROPERTY ---
  role: UserRole;
  // -----------------------------
}

export interface Skill {
  id: string;
  name: string;
}

export interface MissionRole {
  id: string;
  mission_id: string;
  role_description: string;
  skill_id_required: string;
  proficiency_required: SkillProficiency;
  assignee?: User;
  required_skill: Skill;
  mission: Mission; // We added this in a previous step, let's ensure it's here
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

export type PitchStatus = 'Submitted' | 'Accepted' | 'Rejected';

export interface MissionPitch {
  id: string;
  mission_id: string;
  user_id: string;
  pitch_text: string;
  status: PitchStatus;
  user: User;
}