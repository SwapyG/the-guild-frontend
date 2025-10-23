// src/types/index.ts (Complete & Final)

export type UserRole = 'Member' | 'Manager' | 'Admin';
export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type MissionStatus = 'Proposed' | 'Active' | 'Completed';
export type PitchStatus = 'Submitted' | 'Accepted' | 'Rejected';
export type InviteStatus = 'Pending' | 'Accepted' | 'Declined';

export interface UserSkill {
  skill: Skill;
  proficiency: SkillProficiency;
}

export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  photo_url?: string;
  role: UserRole;
  skills: UserSkill[];
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
  pitches: MissionPitch[];
}

export interface MissionRole {
  id: string;
  mission_id: string;
  role_description: string;
  skill_id_required: string;
  proficiency_required: SkillProficiency;
  assignee?: User;
  required_skill: Skill;
}

export interface MissionPitch {
  id: string;
  mission_id: string;
  user_id: string;
  pitch_text: string;
  status: PitchStatus;
  user: User;
}

// --- NANO: NEW TYPE FOR THE INVITATION SYSTEM ---
export interface MissionInvite {
    id: string;
    mission_role: MissionRole;
    invited_user: User;
    inviting_user: User;
    status: InviteStatus;
    created_at: string;
}
// ---------------------------------------------

// This is constructed on the frontend now, but the type is still useful.
export interface MissionHistoryItem {
    mission_id: string;
    mission_title: string;
    role: string;
    status: MissionStatus;
}

// --- NANO: NEW TYPE FOR NOTIFICATIONS ---
export interface Notification {
    id: string;
    message: string;
    link?: string;
    is_read: boolean;
    created_at: string;
}
// ------------------------------------