// src/context/AuthContext.tsx

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types';
import apiClient from '@/services/api';

// Define the shape of our authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

// Create the context with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Start with loading true
  const router = useRouter();

  // This effect runs once on app load to check for an existing token
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      // Set the token on our API client for all subsequent requests
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      // Here, you would typically fetch the user profile from a '/users/me' endpoint
      // For now, we'll just mark them as authenticated.
      // In a real app: fetchUserProfile(storedToken).then(setUser).catch(logout);
    }
    setLoading(false); // Finished initial check
  }, []);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    // After login, you'd fetch the user profile
    router.push('/dashboard'); // Redirect to the dashboard
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
    router.push('/auth/login'); // Redirect to login page
  };

  // Determine if the user is authenticated based on the presence of a token
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};