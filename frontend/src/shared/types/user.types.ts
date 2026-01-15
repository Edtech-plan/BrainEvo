/**
 * User Types
 */

export type UserRole = 'learner' | 'teacher' | 'organization_admin';
export type AuthProvider = 'email' | 'google';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationId?: string | null;
  qualifications?: string;
  subjectsTaught?: string[];
  authProvider?: AuthProvider;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RegisterUserData {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  organizationId?: string;
  qualifications?: string;
  subjectsTaught?: string | string[];
  inviteToken?: string;
  authProvider?: AuthProvider;
  googleId?: string;
  avatar?: string;
}

export interface GoogleAuthData {
  googleId: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface AuthError {
  message: string;
  code?: string;
}
