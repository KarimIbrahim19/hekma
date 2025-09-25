'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

const API_URL = 'http://localhost:3000/api'; // Replace with your actual NestJS API URL

interface User {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  theme?: 'light' | 'dark';
  lang?: 'en' | 'ar';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (fullName: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        const userData: User = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(userData);
        if (userData.theme) {
          setTheme(userData.theme);
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, [setTheme]);

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

      if (userData.theme) {
        setTheme(userData.theme);
      }
      
      const targetLang = userData.lang || 'en';
      router.push(`/${targetLang}`);


    } catch (error: any) {
      console.error('Login failed:', error);
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('An unexpected error occurred during login.');
    }
  };

  const signup = async (fullName: string, email: string, password: string, phone: string) => {
    try {
      await axios.post(`${API_URL}/auth/register`, {
        fullName,
        email,
        password,
        phone,
      });
    } catch (error: any) {
      console.error('Signup failed:', error);
      if (error.response?.data?.error?.message) {
        throw new Error(error.response.data.error.message);
      }
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('An unexpected error occurred during signup.');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    const lang = pathname.split('/')[1] || 'en';
    router.push(`/${lang}/login`);
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    signup,
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
