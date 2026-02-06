import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../src/features/auth/hooks/useAuth';
import { getDashboardRoute } from '../src/shared/utils/routing';
import { Input, Button } from '../src/shared/components/ui';
import { initializeGoogleSignIn, handleGoogleSignIn as parseGoogleCredential } from '../src/shared/utils/googleAuth';
import { authService } from '../src/features/auth';
import type { GooglePromptNotification, GoogleCredentialResponse } from '../src/shared/types';
import type { AppErrorType } from '../src/shared/types/errors.types';
import { getErrorMessage } from '../src/shared/types/errors.types';
import { ArrowLeft, CheckCircle2 } from 'lucide-react'; // Assuming lucide-react is available as per Landing

const Login: NextPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading, user } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize Google Sign-In
  useEffect(() => {
    initializeGoogleSignIn();
  }, []);

  // Redirect if already authenticated (role-based)
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      router.push(getDashboardRoute(user.role));
    }
  }, [isAuthenticated, authLoading, user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setErrorMessage('');
  };

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!validate()) return;

    setIsLoading(true);
    try {
      const loggedInUser = await login(formData.email, formData.password);
      router.push(getDashboardRoute(loggedInUser.role));
    } catch (error: AppErrorType) {
      setErrorMessage(getErrorMessage(error) || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      if (window.google) {
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
                const dashboardRoutes: Record<string, string> = {
                  learner: '/student/dashboard',
                  teacher: '/teacher/dashboard',
                  organization_admin: '/admin/dashboard'
                };
                router.push(dashboardRoutes[authResponse.user.role] || '/student/dashboard');
              }
            } catch (error: AppErrorType) {
              setErrorMessage(getErrorMessage(error) || 'Google sign-in failed. Please try again.');
            } finally {
              setIsLoading(false);
            }
          },
        });
        window.google.accounts.id.prompt((notification: GooglePromptNotification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            setErrorMessage('Google Sign-In is not available. Please use email login.');
          }
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 flex">
      
      {/* --- Left Side: Form --- */}
      <div className="flex-1 flex flex-col justify-center px-8 md:px-20 lg:px-24 xl:px-32 relative z-10">
        <div className="max-w-[440px] w-full mx-auto">
          
          <Link href="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors mb-10 group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <div className="relative w-8 h-8">
                 <Image src="/logoo.png" alt="BrainEvo" fill className="object-contain" />
              </div>
              <span className="text-xl font-bold text-slate-900">BrainEvo</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
              Welcome back
            </h1>
            <p className="text-slate-600 text-lg">
              Sign in to continue your learning journey.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <div className="w-2 h-2 mt-2 bg-red-500 rounded-full shrink-0" />
              <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
            </div>
          )}

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all py-3 rounded-xl font-semibold flex items-center justify-center gap-3 mb-6 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">or sign in with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              name="email"
              label="Email Address"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <div style={{ position: 'relative' }}>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                required
                style={{
                  fontSize: '16px',       // text-base
                  paddingRight: '40px',   // pr-10
                }}
              />

              <button
                type="button"
                onClick={() => {
                  const passwordInput = document.querySelector(
                    'input[name="password"]'
                  ) as HTMLInputElement;
                  if (passwordInput) {
                    passwordInput.type =
                      passwordInput.type === 'password' ? 'text' : 'password';
                  }
                }}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: '#6b7280', // gray-500
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')} // gray-700
                onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
              }}
            >
              <Link
                href="/forgot-password"
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#2563eb',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1d4ed8')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#2563eb')}
              >
                Forgot password?
              </Link>
            </div>


            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-slate-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              Get Started
            </Link>
          </p>
        </div>
      </div>

      {/* --- Right Side: Visual --- */}
      <div className="hidden lg:flex flex-1 bg-slate-50 border-l border-slate-100 relative items-center justify-center p-12">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-40 mix-blend-multiply" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-40 mix-blend-multiply" />
        
        <div className="relative max-w-lg text-center">
           <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 mb-8 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <h3 className="text-xl font-bold text-slate-900 mb-4 text-left">Trusted by Top Institutes</h3>
              <div className="space-y-3">
                 {[
                   "Secure & Reliable Platform",
                   "Real-time Student Analytics",
                   "Interactive Live Classes"
                 ].map((item, i) => (
                   <div key={i} className="flex items-center gap-3 text-slate-600">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                      <span>{item}</span>
                   </div>
                 ))}
              </div>
           </div>
           
           <h2 className="text-3xl font-bold text-slate-900 mb-4">
             "The best LMS we've ever used."
           </h2>
           <p className="text-slate-600 text-lg">
             Join thousands of students and teachers transforming education with BrainEvo.
           </p>
        </div>
      </div>

    </div>
  );
};

export default Login;
