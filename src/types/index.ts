// src/types/index.ts

// These types mirror the Pydantic schemas in our FastAPI backend.

export type SkillProficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type MissionStatus = 'Proposed' | 'Active' | 'Completed';
export type PitchStatus = 'Submitted' | 'Accepted' | 'Rejected';

export interface User {
  id: string; // UUIDs are strings in TypeScript/JSON
  name: string;
  email: string;
  title: string;
  photo_url?: string;
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
  assignee?: User; // The assignee is a nested User object
  required_skill: Skill; // Add this for displaying the skill name
}

export interface Mission {
  id: string;
  title: string;
  description?: string;
  lead_user_id: string;
  status: MissionStatus;
  created_at: string; // ISO date string
  lead: User; // The lead is a nested User object
  roles: MissionRole[]; // Has a list of MissionRole objects
}


export interface MissionPitch {
  id: string;
  mission_id: string;
  user_id: string;
  pitch_text: string;
  status: PitchStatus;
  user: User; // The backend conveniently includes the user who pitched
}
