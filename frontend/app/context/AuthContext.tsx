'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { isAuthenticated, getUserFromToken, saveToken, removeToken, logout } from '../lib/auth';
import { authApi, usersApi } from '../lib/api';

// Define the shape of our context
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Provider component that wraps the app and makes auth object available
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to load user data
  const loadUserData = async () => {
    if (isAuthenticated()) {
      try {
        const userInfo = getUserFromToken();
        if (userInfo) {
          const userData = await usersApi.getProfile(userInfo.userId);
          setUser(userData);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
        logout();
      }
    }
    setIsLoading(false);
  };

  // Load user data on initial render
  useEffect(() => {
    loadUserData();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      const response = await authApi.login(username, password);
      if (response && response.token) {
        saveToken(response.token);
        setIsLoggedIn(true);
        await loadUserData();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Register function
  const register = async (username: string, password: string, fullName?: string) => {
    try {
      const response = await authApi.register(username, password, fullName);
      if (response && response.token) {
        saveToken(response.token);
        setIsLoggedIn(true);
        await loadUserData();
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Logout function
  const handleLogout = () => {
    removeToken();
    setUser(null);
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  // Value object that will be passed to consumers
  const value = {
    user,
    isLoading,
    isLoggedIn,
    login,
    register,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
