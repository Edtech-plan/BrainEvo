/**
 * Form Types
 */

import { UserRole } from './user.types';

export interface FormErrors {
  [key: string]: string | undefined;
}

export interface LearnerFormData {
  name: string;
  email: string;
  password: string;
}

export interface TeacherFormData {
  name: string;
  email: string;
  password: string;
  qualifications: string;
  subjectsTaught: string;
}

export interface AdminFormData {
  name: string;
  email: string;
  password: string;
  organizationName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface RegisterPageState {
  selectedRole: UserRole | '';
  inviteData: InvitationData | null;
  isVerifyingInvite: boolean;
  learnerData: LearnerFormData;
  teacherData: TeacherFormData;
  adminData: AdminFormData;
  errors: FormErrors;
  isLoading: boolean;
  errorMessage: string;
  showPassword: boolean;
}

export interface InvitationData {
  id: string;
  organizationId: {
    id: string;
    name: string;
  };
  email: string;
  role: UserRole;
  token: string;
  expiresAt: string;
  isUsed: boolean;
}
