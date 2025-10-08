// src/services/api.ts (FINAL AND CORRECTED)

import axios from 'axios';
import { Mission, User, MissionRole, MissionPitch, SkillProficiency, Skill } from '@/types';

// --- UPDATED API CLIENT CONFIGURATION ---
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMissions = async (): Promise<Mission[]> => {
  const response = await apiClient.get('/missions/');
  return response.data;
};

export const getMissionById = async (missionId: string): Promise<Mission> => {
  const response = await apiClient.get(`/missions/${missionId}`);
  return response.data;
};

export const getUsers = async (): Promise<User[]> => {
  const response = await apiClient.get('/users/');
  return response.data;
};

export const draftUserToRole = async (roleId: string, userId: string): Promise<MissionRole> => {
  const response = await apiClient.post(`/mission-roles/${roleId}/draft`, {
    assignee_user_id: userId,
  });
  return response.data;
};

export const pitchForMission = async (
  missionId: string,
  userId: string,
  pitchText: string
): Promise<MissionPitch> => {
  const response = await apiClient.post(`/missions/${missionId}/pitch`, {
    user_id: userId,
    pitch_text: pitchText,
  });
  return response.data;
};

// --- THIS IS THE CRITICAL FUNCTION THAT WAS MISSING ---
export const getSkills = async (): Promise<Skill[]> => {
  const response = await apiClient.get('/skills/');
  return response.data;
};
// -----------------------------------------------------

export interface MissionCreatePayload {
  title: string;
  description?: string;
  lead_user_id: string;
  roles: {
    role_description: string;
    skill_id_required: string;
    proficiency_required: SkillProficiency;
  }[];
}

export const createMission = async (payload: MissionCreatePayload): Promise<Mission> => {
  const response = await apiClient.post('/missions/', payload);
  return response.data;
};

export default apiClient;