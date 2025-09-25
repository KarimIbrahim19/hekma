
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useToast } from './use-toast';
import { format } from 'date-fns';

const API_URL = process.env.NEXT_PUBLIC_API_URL; 

interface User {
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  theme?: 'light' | 'dark';
  lang?: 'en' | 'ar';
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (fullName: string, email: string, password: string, phone: string) => Promise<void>;
  logout: () => void;
  api: typeof axios;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { setTheme } = useTheme();
  const { toast } = useToast();
  
  const api = axios.create({
    baseURL: API_URL,
  });

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

  // Setup axios interceptor
  useEffect(() => {
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const refreshToken = localStorage.getItem('refreshToken');
        if (error.response?.status === 401 && refreshToken && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const { data } = await axios.post(`${API_URL}/auth/refresh`, {
              refreshToken,
            });
            const newAccessToken = data.data.token;
            localStorage.setItem('token', newAccessToken);
            setToken(newAccessToken);
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            // Refresh token failed, logout user
            logout();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          config.headers['Authorization'] = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      api.interceptors.response.eject(responseInterceptor);
      api.interceptors.request.eject(requestInterceptor);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
        rememberMe,
      });

      const { token: apiToken, user: userData, refreshToken } = response.data.data;
      
      setToken(apiToken);
      setUser(userData);
      
      localStorage.setItem('token', apiToken);
      localStorage.setItem('user', JSON.stringify(userData));
      if (rememberMe && refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      } else {
        localStorage.removeItem('refreshToken');
      }

      if (userData.theme) {
        setTheme(userData.theme);
      }
      
      if (userData.lastLogin) {
        toast({
            title: `Welcome back, ${userData.name}!`,
            description: `Last login: ${format(new Date(userData.lastLogin), 'PPP p')}`,
        });
      }

      const targetLang = userData.lang || 'en';
      router.push(`/${targetLang}/pharmacy`);


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

  const logout = async () => {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Server-side logout failed, proceeding with client-side logout.', error);
    } finally {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        const lang = pathname.split('/')[1] || 'en';
        router.push(`/${lang}/login`);
    }
  };

  const value: AuthContextType = {
    user,
    setUser,
    token,
    isLoading,
    login,
    signup,
    logout,
    api,
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
