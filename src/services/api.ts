// src/services/api.ts (Complete & Final Version)

import axios from 'axios';
import { Mission, User, MissionRole, MissionPitch, SkillProficiency, Skill, MissionStatus, Notification, MissionInvite } from '@/types';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: baseURL,
  headers: { 'Content-Type': 'application/json' },
});

// --- Mission & Project Endpoints ---

export const getMissions = async (): Promise<Mission[]> => {
  const response = await apiClient.get('/missions/');
  return response.data;
};

export const getMissionById = async (missionId: string): Promise<Mission> => {
    const response = await apiClient.get(`/missions/${missionId}`);
    return response.data;
};

export const getActionItems = async (): Promise<Mission[]> => {
    const response = await apiClient.get('/missions/action-items');
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

// --- User & Talent Endpoints ---

export const getAllUsers = async (): Promise<User[]> => {
    const response = await apiClient.get('/users/');
    return response.data;
};

export const searchUsersBySkill = async (skillName: string, proficiency: SkillProficiency): Promise<User[]> => {
    const response = await apiClient.get('/users/search', { params: { skill_name: skillName, proficiency } });
    return response.data;
};

// --- Authentication & Profile Endpoints ---

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
    const response = await apiClient.get('/users/me');
    return response.data;
};

// --- Skill Ledger Endpoints ---

export const getSkills = async (): Promise<Skill[]> => {
    const response = await apiClient.get('/skills/');
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

// --- Workflow Endpoints (Pitches, Invites, Drafts) ---

export const pitchForMission = async (missionId: string, pitchText: string): Promise<MissionPitch> => {
    const response = await apiClient.post(`/missions/${missionId}/pitch`, { pitch_text: pitchText });
    return response.data;
};

export const getPitchesForMission = async (missionId: string): Promise<MissionPitch[]> => {
    const response = await apiClient.get(`/missions/${missionId}/pitches/`);
    return response.data;
};

export const draftUserToRole = async (roleId: string, userId: string): Promise<MissionRole> => {
    const response = await apiClient.post(`/mission-roles/${roleId}/draft`, { assignee_user_id: userId });
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
    // This backend endpoint (`/invites/me`) does not exist yet.
    // We return a resolved promise with an empty array to prevent errors.
    console.warn("Backend endpoint /invites/me not implemented. Returning mock data.");
    return Promise.resolve([]);
};

export const respondToInvite = async (inviteId: string, status: 'Accepted' | 'Declined'): Promise<MissionInvite> => {
    // The backend endpoint for this works, so we call it directly.
    const response = await apiClient.patch(`/invites/${inviteId}`, { status });
    return response.data;
};

// --- Notification Endpoints ---

export const getMyNotifications = async (): Promise<Notification[]> => {
    const response = await apiClient.get('/users/me/notifications');
    return response.data;
};

export const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
    const response = await apiClient.patch(`/notifications/${notificationId}/read`);
    return response.data;
};

export default apiClient;