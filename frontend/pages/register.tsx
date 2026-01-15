import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../src/shared/hooks/useAuth';
import { Button } from '../src/shared/components/ui';
import RoleSelector from '../src/shared/components/auth/RoleSelector';
import LearnerForm from '../src/shared/components/auth/LearnerForm';
import TeacherForm from '../src/shared/components/auth/TeacherForm';
import AdminForm from '../src/shared/components/auth/AdminForm';
import { initializeGoogleSignIn, handleGoogleSignIn } from '../src/shared/utils/googleAuth';
import invitationService from '../src/modules/invitation/invitation.service';
import type { UserRole, RegisterUserData, GoogleAuthData } from '../src/shared/types';
import type { LearnerFormData, TeacherFormData, AdminFormData, FormErrors, InvitationData } from '../src/shared/types/forms.types';

const Register: NextPage = () => {
  const router = useRouter();
  const { register, isAuthenticated, loading: authLoading } = useAuth();

  // State
  const [selectedRole, setSelectedRole] = useState<UserRole | ''>('');
  const [inviteData, setInviteData] = useState<InvitationData | null>(null);
  const [isVerifyingInvite, setIsVerifyingInvite] = useState(false);
  const [learnerData, setLearnerData] = useState<LearnerFormData>({
    name: '',
    email: '',
    password: '',
  });
  const [teacherData, setTeacherData] = useState<TeacherFormData>({
    name: '',
    email: '',
    password: '',
    qualifications: '',
    subjectsTaught: '',
  });
  const [adminData, setAdminData] = useState<AdminFormData>({
    name: '',
    email: '',
    password: '',
    organizationName: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Initialize Google Sign-In
  useEffect(() => {
    initializeGoogleSignIn();
  }, []);

  // Check for invitation token in URL
  useEffect(() => {
    const verifyInviteToken = async () => {
      const { token } = router.query;
      if (token && typeof token === 'string') {
        setIsVerifyingInvite(true);
        try {
          const response = await invitationService.verifyInvitation(token);
          if (response.success && response.invitation) {
            // Convert Invitation to InvitationData format
            const orgId = typeof response.invitation.organizationId === 'string'
              ? { id: response.invitation.organizationId, name: '' }
              : { id: response.invitation.organizationId.id, name: response.invitation.organizationId.name || '' };

            setInviteData({
              id: response.invitation.id,
              organizationId: orgId,
              email: response.invitation.email,
              role: response.invitation.role,
              token: response.invitation.token,
              expiresAt: response.invitation.expiresAt,
              isUsed: response.invitation.isUsed,
            });
            setSelectedRole(response.invitation.role);
            // Pre-fill email if available
            if (response.invitation.email) {
              if (response.invitation.role === 'learner') {
                setLearnerData(prev => ({ ...prev, email: response.invitation.email }));
              } else if (response.invitation.role === 'teacher') {
                setTeacherData(prev => ({ ...prev, email: response.invitation.email }));
              }
            }
          } else {
            setErrorMessage('Invalid or expired invitation link.');
          }
        } catch (error: any) {
          setErrorMessage(error.response?.data?.message || 'Invalid invitation link.');
        } finally {
          setIsVerifyingInvite(false);
        }
      }
    };

    if (router.isReady) {
      verifyInviteToken();
    }
  }, [router.isReady, router.query]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'learner') {
        router.push('/dashboard');
      } else if (user.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (user.role === 'organization_admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, authLoading, router]);

  // Handle role change
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    setErrors({});
    setErrorMessage('');
  };

  // Handle form field changes
  const handleLearnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLearnerData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setErrorMessage('');
  };

  const handleTeacherChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTeacherData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setErrorMessage('');
  };

  const handleAdminChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
    setErrorMessage('');
  };

  // Validation
  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!selectedRole) {
      setErrorMessage('Please select a role.');
      return false;
    }

    if (selectedRole === 'learner') {
      if (!learnerData.name.trim()) newErrors.name = 'Name is required';
      if (!learnerData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(learnerData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!learnerData.password) {
        newErrors.password = 'Password is required';
      } else if (learnerData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else if (selectedRole === 'teacher') {
      if (!teacherData.name.trim()) newErrors.name = 'Name is required';
      if (!teacherData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(teacherData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!teacherData.password) {
        newErrors.password = 'Password is required';
      } else if (teacherData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else if (selectedRole === 'organization_admin') {
      if (!adminData.organizationName.trim()) newErrors.organizationName = 'Organization name is required';
      if (!adminData.name.trim()) newErrors.name = 'Name is required';
      if (!adminData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(adminData.email)) {
        newErrors.email = 'Email is invalid';
      }
      if (!adminData.password) {
        newErrors.password = 'Password is required';
      } else if (adminData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
      if (!adminData.contactEmail) {
        newErrors.contactEmail = 'Contact email is required';
      } else if (!/\S+@\S+\.\S+/.test(adminData.contactEmail)) {
        newErrors.contactEmail = 'Contact email is invalid';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Google Sign-Up
  const handleGoogleSignUp = async () => {
    if (!selectedRole) {
      setErrorMessage('Please select a role first.');
      return;
    }

    try {
      // This will be handled by Google's button callback
      // For now, we'll use a simple approach
      if ((window as any).google) {
        (window as any).google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setErrorMessage('Google Sign-In is not available. Please use email registration.');
          }
        });
      } else {
        setErrorMessage('Google Sign-In is not available. Please use email registration.');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Google sign-up failed. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      let registerData: RegisterUserData;

      if (selectedRole === 'learner') {
        registerData = {
          name: learnerData.name,
          email: learnerData.email,
          password: learnerData.password,
          role: 'learner',
          inviteToken: inviteData?.token,
        };
      } else if (selectedRole === 'teacher') {
        registerData = {
          name: teacherData.name,
          email: teacherData.email,
          password: teacherData.password,
          role: 'teacher',
          qualifications: teacherData.qualifications || undefined,
          subjectsTaught: teacherData.subjectsTaught
            ? teacherData.subjectsTaught.split(',').map(s => s.trim()).filter(Boolean)
            : undefined,
          inviteToken: inviteData?.token,
        };
      } else {
        registerData = {
          name: adminData.name,
          email: adminData.email,
          password: adminData.password,
          role: 'organization_admin',
          organizationId: undefined, // Will be created on backend
        };
      }

      // Ensure password is always a string for register function
      if (!registerData.password) {
        setErrorMessage('Password is required');
        setIsLoading(false);
        return;
      }

      await register({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        role: registerData.role,
        ...(registerData.qualifications && { qualifications: registerData.qualifications }),
        ...(registerData.subjectsTaught && { subjectsTaught: registerData.subjectsTaught }),
        ...(registerData.inviteToken && { inviteToken: registerData.inviteToken }),
        ...(registerData.organizationId && { organizationId: registerData.organizationId }),
      });

      // Redirect based on role
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'learner') {
        router.push('/dashboard');
      } else if (user.role === 'teacher') {
        router.push('/teacher/dashboard');
      } else if (user.role === 'organization_admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isVerifyingInvite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Left Side - Form Container */}
        <div className="flex-1 flex items-center justify-center p-8 md:p-12 lg:p-16 overflow-y-auto">
          <div className="w-full max-w-lg">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Get Started with BrainEvo!
              </h2>
              <p className="text-gray-600 text-base">
                Create your account to access innovative EdTech solutions for schools and colleges.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Sign up with Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-3 hover:bg-gray-700 transition-colors mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">or</span>
              </div>
            </div>

            {/* Role Selector */}
            <RoleSelector
              selectedRole={selectedRole}
              onRoleChange={handleRoleChange}
              disabled={!!inviteData}
            />

            {/* Form */}
            {selectedRole && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedRole === 'learner' && (
                  <LearnerForm
                    formData={learnerData}
                    errors={errors}
                    onChange={handleLearnerChange}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                )}

                {selectedRole === 'teacher' && (
                  <TeacherForm
                    formData={teacherData}
                    errors={errors}
                    onChange={handleTeacherChange}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                )}

                {selectedRole === 'organization_admin' && (
                  <AdminForm
                    formData={adminData}
                    errors={errors}
                    onChange={handleAdminChange}
                    showPassword={showPassword}
                    onTogglePassword={() => setShowPassword(!showPassword)}
                  />
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full font-semibold text-base py-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </form>
            )}

            {/* Footer Links */}
            <div className="mt-6 text-center text-sm">
              <Link
                href="/login"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Already have an account? Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-white p-8">
          <div className="w-full max-w-lg">
            <Image
              src="/signup.png"
              alt="Sign Up Illustration"
              width={600}
              height={500}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
