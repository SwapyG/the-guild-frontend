// src/services/api.ts (Final, Corrected Version)

import axios from 'axios';
import { Mission, User, MissionRole, MissionPitch, SkillProficiency, Skill, MissionStatus } from '@/types';
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

export const pitchForMission = async (missionId: string, pitchText: string): Promise<MissionPitch> => {
  const response = await apiClient.post(`/missions/${missionId}/pitch`, {
    pitch_text: pitchText,
  });
  return response.data;
};

export const getSkills = async (): Promise<Skill[]> => {
  const response = await apiClient.get('/skills/');
  return response.data;
};

export interface MissionCreatePayload {
  title: string;
  description?: string;
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

export const getPitchesForMission = async (missionId: string): Promise<MissionPitch[]> => {
  const response = await apiClient.get(`/missions/${missionId}/pitches/`);
  return response.data;
};

export const updateMissionStatus = async (missionId: string, status: MissionStatus): Promise<Mission> => {
  const response = await apiClient.patch(`/missions/${missionId}/status`, { status });
  return response.data;
};

// --- AUTHENTICATION FUNCTIONS ---

export const loginUser = async (email: string, password: string): Promise<string> => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const response = await apiClient.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  
  return response.data.access_token;
};

export interface RegisterUserPayload {
  email: string;
  password: string;
  name: string;
  title: string;
  photo_url?: string | null;
}

export const registerUser = async (payload: RegisterUserPayload): Promise<User> => {
  const response = await apiClient.post('/auth/register', payload);
  return response.data;
};

export const getMe = async (): Promise<User> => {
    const response = await apiClient.get('/users/me');
    return response.data;
};
// ------------------------------------

export default apiClient;