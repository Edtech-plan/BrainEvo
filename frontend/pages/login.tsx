import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../src/shared/hooks/useAuth';
import { Input, Button } from '../src/shared/components/ui';
import { initializeGoogleSignIn, handleGoogleSignIn as parseGoogleCredential } from '../src/shared/utils/googleAuth';
import authService from '../src/modules/auth/auth.service';
import type { GoogleAuthData, GooglePromptNotification, GoogleCredentialResponse } from '../src/shared/types';
import type { AppErrorType } from '../src/shared/types/errors.types';
import { getErrorMessage } from '../src/shared/types/errors.types';

const Login: NextPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize Google Sign-In
  useEffect(() => {
    initializeGoogleSignIn();
  }, []);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setErrorMessage('');
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
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
    } catch (error: AppErrorType) {
      setErrorMessage(getErrorMessage(error) || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      if (window.google) {
        window.google.accounts.id.prompt(async (notification: GooglePromptNotification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // If prompt is not displayed, try to get credential from button
            // For now, show error
            setErrorMessage('Google Sign-In is not available. Please use email login.');
          }
        });

        // Listen for credential response
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
          callback: async (response: GoogleCredentialResponse) => {
            try {
              const userData = parseGoogleCredential(response);
              if (!userData) {
                setErrorMessage('Failed to parse Google authentication data');
                return;
              }

              setIsLoading(true);
              const authResponse = await authService.googleAuth(userData);

              if (authResponse.success && authResponse.token) {
                if (typeof window !== 'undefined') {
                  localStorage.setItem('token', authResponse.token);
                  localStorage.setItem('user', JSON.stringify(authResponse.user));
                }

                // Redirect based on role
                if (authResponse.user.role === 'learner') {
                  router.push('/dashboard');
                } else if (authResponse.user.role === 'teacher') {
                  router.push('/teacher/dashboard');
                } else if (authResponse.user.role === 'organization_admin') {
                  router.push('/admin/dashboard');
                } else {
                  router.push('/dashboard');
                }
              }
            } catch (error: AppErrorType) {
              setErrorMessage(getErrorMessage(error) || 'Google sign-in failed. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        });
      } else {
        setErrorMessage('Google Sign-In is not available. Please use email login.');
      }
    } catch (error: AppErrorType) {
      setErrorMessage(getErrorMessage(error) || 'Google sign-in failed. Please try again.');
    }
  };

  if (authLoading) {
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
        <div className="flex-1 flex items-center justify-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Welcome Back!
              </h2>
              <p className="text-gray-600 text-base">
                Sign in to your account to continue your EdTech journey with BrainEvo.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Sign in with Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
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
              Sign in with Google
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                className="text-base"
              />

              <div className="relative">
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  required
                  className="text-base pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
                    if (passwordInput) {
                      passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
                    }
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>

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
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center text-sm">
              <Link
                href="/forgot-password"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Forgot password?
              </Link>
              {' | '}
              <Link
                href="/register"
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                Don't have an account? Sign Up
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex flex-1 items-center justify-center bg-white p-8">
          <div className="w-full max-w-lg">
            <Image
              src="/signup.png"
              alt="Sign In Illustration"
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

export default Login;
