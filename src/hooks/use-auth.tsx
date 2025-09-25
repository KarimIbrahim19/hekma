'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API_URL = 'http://localhost:3000/api'; // Replace with your actual NestJS API URL

interface User {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  theme?: string;
  lang?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        rememberMe,
      });

      const { token: apiToken, user: userData } = response.data.data;
      
      setToken(apiToken);
      setUser(userData);
      
      localStorage.setItem('token', apiToken);
      localStorage.setItem('user', JSON.stringify(userData));

    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('An unexpected error occurred during login.');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const lang = window.location.pathname.split('/')[1] || 'en';
    router.push(`/${lang}/login`);
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
