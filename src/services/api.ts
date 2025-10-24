// src/services/api.ts (Definitive Final Version with draftUserToRole Restored)

import axios from 'axios';
import { Mission, User, MissionRole, MissionPitch, SkillProficiency, Skill, MissionStatus, Notification, MissionInvite } from '@/types';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// NANO: Cache-busting configuration
const cacheBustingConfig = {
    headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
    },
};

// --- Auth & User Profile ---
export const loginUser = async (email: string, password: string): Promise<string> => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const response = await apiClient.post('/auth/login', params, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
    return response.data.access_token;
};
export interface RegisterUserPayload {
  email: string; password: string; name: string; title: string; photo_url?: string | null;
}
export const registerUser = async (payload: RegisterUserPayload): Promise<User> => {
    const response = await apiClient.post('/auth/register', payload);
    return response.data;
};
export const getMe = async (): Promise<User> => {
    const response = await apiClient.get('/users/me', cacheBustingConfig);
    return response.data;
};
export const getAllUsers = async (): Promise<User[]> => {
    const response = await apiClient.get('/users/', cacheBustingConfig);
    return response.data;
};
export const searchUsersBySkill = async (skillName: string, proficiency: SkillProficiency): Promise<User[]> => {
    const response = await apiClient.get('/users/search', { params: { skill_name: skillName, proficiency }, ...cacheBustingConfig });
    return response.data;
};

// --- Skills & Skill Ledger ---
export const getSkills = async (): Promise<Skill[]> => {
    const response = await apiClient.get('/skills/', cacheBustingConfig);
    return response.data;
};
export interface AddSkillPayload {
  skill_id: string;
  proficiency: SkillProficiency;
}
export const addSkillToUser = async (payload: AddSkillPayload): Promise<User> => {
    const response = await apiClient.post('/users/me/skills', payload);
    return response.data;
};
export const removeSkillFromUser = async (skillId: string): Promise<User> => {
    const response = await apiClient.delete(`/users/me/skills/${skillId}`);
    return response.data;
};

// --- Missions ---
export const getMissions = async (): Promise<Mission[]> => {
  const response = await apiClient.get('/missions/', cacheBustingConfig);
  return response.data;
};
export const getMissionById = async (missionId: string): Promise<Mission> => {
    const response = await apiClient.get(`/missions/${missionId}`, cacheBustingConfig);
    return response.data;
};
export const getActionItems = async (): Promise<Mission[]> => {
    const response = await apiClient.get('/missions/action-items', cacheBustingConfig);
    return response.data;
};
export interface MissionCreatePayload {
  title: string;
  description?: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  roles: { role_description: string; skill_id_required: string; proficiency_required: SkillProficiency; }[];
}
export const createMission = async (payload: MissionCreatePayload): Promise<Mission> => {
    const response = await apiClient.post('/missions/', payload);
    return response.data;
};
export const updateMissionStatus = async (missionId: string, status: MissionStatus): Promise<Mission> => {
    const response = await apiClient.patch(`/missions/${missionId}/status`, { status });
    return response.data;
};

// --- Workflow (Pitches, Invites, etc.) ---
export const pitchForMission = async (missionId: string, pitchText: string): Promise<MissionPitch> => {
    const response = await apiClient.post(`/missions/${missionId}/pitch`, { pitch_text: pitchText });
    return response.data;
};
export const getPitchesForMission = async (missionId: string): Promise<MissionPitch[]> => {
    const response = await apiClient.get(`/missions/${missionId}/pitches`, cacheBustingConfig);
    return response.data;
};
export interface MissionInviteCreatePayload {
    mission_role_id: string;
    invited_user_id: string;
}
export const createInvite = async (payload: MissionInviteCreatePayload): Promise<MissionInvite> => {
    const response = await apiClient.post('/invites', payload);
    return response.data;
};
export const getMyInvites = async (): Promise<MissionInvite[]> => {
    const response = await apiClient.get('/invites/me', cacheBustingConfig);
    return response.data;
};
export const respondToInvite = async (inviteId: string, status: 'Accepted' | 'Declined'): Promise<MissionInvite> => {
    const response = await apiClient.patch(`/invites/${inviteId}`, { status });
    return response.data;
};

// --- NANO: THE MISSING FUNCTION IS RESTORED ---
export const draftUserToRole = async (roleId: string, userId: string): Promise<MissionRole> => {
    const response = await apiClient.post(`/mission-roles/${roleId}/draft`, { assignee_user_id: userId });
    return response.data;
};
// ---------------------------------------------

// --- Notifications ---
export const getMyNotifications = async (): Promise<Notification[]> => {
    const response = await apiClient.get('/users/me/notifications', cacheBustingConfig);
    return response.data;
};
export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
    const response = await apiClient.patch(`/notifications/${notificationId}/read`);
    return response.data;
};

export default apiClient;