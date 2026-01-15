import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../../modules/auth/auth.service';
import type { User, RegisterUserData } from '../types';
import type { AppErrorType } from '../types/errors.types';
import { getErrorMessage } from '../types/errors.types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterUserData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      // Only access localStorage in browser environment
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authService.getMe();
          if (response.success && response.data?.user) {
            setUser(response.data.user);
            setIsAuthenticated(true);
          }
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error: AppErrorType) {
      throw new Error(getErrorMessage(error) || 'Login failed');
    }
  };

  const register = async (userData: RegisterUserData) => {
    try {
      const response = await authService.register(userData);
      if (response.success && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        setUser(response.user);
        setIsAuthenticated(true);
      }
    } catch (error: AppErrorType) {
      throw new Error(getErrorMessage(error) || 'Registration failed');
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};
