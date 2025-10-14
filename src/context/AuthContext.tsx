// src/context/AuthContext.tsx (FINAL, CORRECTED VERSION)

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import apiClient, { getMe } from '@/services/api'; // <-- Import getMe

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>; // <-- login is now async
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // This effect runs on initial app load to check for a persistent session
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          // --- CHANGE #1: FETCH USER ON INITIAL LOAD ---
          const userProfile = await getMe();
          setUser(userProfile);
          // ---------------------------------------------
        } catch (error) {
          // If the token is invalid/expired, log the user out
          console.error("Invalid token, logging out.");
          logout();
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []); // The empty dependency array ensures this runs only once

  // --- CHANGE #2: LOGIN IS NOW ASYNC AND FETCHES THE USER ---
  const login = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    try {
      const userProfile = await getMe();
      setUser(userProfile);
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to fetch user profile after login.", error);
      // Handle case where login succeeds but profile fetch fails
      logout(); 
    }
  };
  // ----------------------------------------------------

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
    router.push('/auth/login');
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loading }}>
      {!loading && children} {/* Don't render children until auth check is complete */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};