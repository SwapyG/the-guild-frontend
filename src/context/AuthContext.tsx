// src/context/AuthContext.tsx (Upgraded with AnimatePresence)

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import apiClient, { getMe } from '@/services/api';
import { GlobalLoader } from '@/components/layout/GlobalLoader';
// --- NANO: IMPORTING THE ANIMATION MANAGER ---
import { AnimatePresence } from 'framer-motion';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const userProfile = await getMe();
          setUser(userProfile);
        } catch (error) {
          console.error("Stored token is invalid, clearing session.", error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('authToken');
          delete apiClient.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (newToken: string) => {
    setLoading(true);
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    try {
      const userProfile = await getMe();
      setUser(userProfile);
      router.push('/dashboard');
    } catch (error) {
      console.error("Failed to fetch user profile after login.", error);
      logout();
    } finally {
      // A slight delay prevents a jarring flash if the login is too fast
      setTimeout(() => setLoading(false), 300); 
    }
  };

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
      {/* --- NANO: THE GATEKEEPER LOGIC --- */}
      {/* AnimatePresence will now manage the exit animation of the loader */}
      {/* when the `loading` state changes from true to false. */}
      <AnimatePresence>
        {loading && <GlobalLoader />}
      </AnimatePresence>
      
      {!loading && children}
      {/* ---------------------------------- */}
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