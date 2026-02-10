import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../src/features/auth/hooks/useAuth';
import { getDashboardRoute } from '../src/shared/utils/routing';
import { useAppContext } from '../src/shared/context/AppContext';
import type { AppErrorType } from '../src/shared/types/errors.types';
import { getErrorMessage } from '../src/shared/types/errors.types';
import { 
  ArrowLeft, 
  Brain, 
  Eye, 
  EyeOff, 
  Check, 
  Star, 
  GraduationCap, 
  Building2, 
  Compass,
  Moon,
  Sun
} from 'lucide-react';

const Login: NextPage = () => {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading, user } = useAuth();
  const { theme, setTheme } = useAppContext();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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

  const toggleDarkMode = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-screen flex items-center justify-center overflow-hidden">
      <div className="flex flex-col lg:flex-row w-full h-full">
        {/* Left Column - Sign In Form */}
        <main className="flex-1 flex flex-col justify-center px-8 lg:px-24 py-8">
          <div className="max-w-md w-full mx-auto">
            <Link 
              href="/" 
              className="inline-flex items-center text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="text-lg mr-2 transition-transform group-hover:-translate-x-1" size={18} />
              Back to Home
            </Link>

            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Brain className="text-white" size={20} />
              </div>
              <span className="text-2xl font-bold tracking-tight">BrainEvo</span>
            </div>

            <div className="mb-6">
              <h1 className="text-3xl font-bold mb-2 tracking-tight">Welcome back</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to continue your learning journey.</p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-sm text-red-700 dark:text-red-400 font-medium">{errorMessage}</p>
              </div>
            )}

            <div className="space-y-3">
              <form onSubmit={handleSubmit} className="space-y-4" method="POST">
                <div className="space-y-2">
                  <label 
                    className="text-sm font-semibold text-slate-700 dark:text-slate-300" 
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email 
                        ? 'border-red-300 dark:border-red-700' 
                        : 'border-slate-200 dark:border-slate-700'
                    } bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label 
                      className="text-sm font-semibold text-slate-700 dark:text-slate-300" 
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <Link 
                      href="/forgot-password" 
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 pr-12 rounded-xl border ${
                        errors.password 
                          ? 'border-red-300 dark:border-red-700' 
                          : 'border-slate-200 dark:border-slate-700'
                      } bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
                Don't have an account?{' '}
                <Link href="/register" className="text-primary font-bold hover:underline">
                  Get Started
                </Link>
              </p>
            </div>
          </div>
        </main>

        {/* Right Column - Promotional Content */}
        <section className="hidden lg:flex flex-1 pattern-bg relative overflow-hidden items-center justify-center px-12 py-8">
          {/* Grid Overlay */}
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"></path>
                </pattern>
              </defs>
              <rect fill="url(#grid)" height="100%" width="100%"></rect>
            </svg>
          </div>

          {/* Blurred Shapes */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>

          {/* Glass Card Content */}
          <div className="max-w-2xl relative z-10">
            <div className="glass-card p-8 rounded-[2rem] shadow-2xl space-y-6 border-white/40 dark:border-slate-700/50">
              <div className="space-y-3">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                  Trusted by Top Institutes
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                  Elevate your learning experience with intelligent insights.
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="text-primary text-sm font-bold" size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Secure & Reliable Platform</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Enterprise-grade security for your academic data.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="text-primary text-sm font-bold" size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Real-time Student Analytics</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Track progress with AI-driven behavioral patterns.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 w-6 h-6 flex-shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                    <Check className="text-primary text-sm font-bold" size={14} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200">Interactive Live Classes</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Engage students globally with low-latency streaming.</p>
                  </div>
                </div>
              </div>

              <hr className="border-slate-200 dark:border-slate-700" />

              <div className="pt-2">
                <div className="flex items-center gap-1 text-orange-400 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="fill-current" size={16} />
                  ))}
                </div>
                <p className="italic text-base text-slate-600 dark:text-slate-300 mb-4">
                  "BrainEvo has completely transformed how we deliver curriculum. The analytics tools are unmatched in the current market."
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-300 dark:bg-slate-600"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-800 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-slate-300">
                      +12k
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Dr. Sarah Jenkins</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Director, Oxford Education Group</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Partner Logos */}
            <div className="mt-8 flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2">
                <GraduationCap size={24} />
                <span className="font-bold text-lg uppercase tracking-widest">Academic</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 size={24} />
                <span className="font-bold text-lg uppercase tracking-widest">Institute</span>
              </div>
              <div className="flex items-center gap-2">
                <Compass size={24} />
                <span className="font-bold text-lg uppercase tracking-widest">DesignLab</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 z-50 hover:scale-110 transition-transform"
        aria-label="Toggle dark mode"
      >
        {theme === 'dark' ? (
          <Sun className="text-slate-700 dark:text-slate-300" size={20} />
        ) : (
          <Moon className="text-slate-700 dark:text-slate-300" size={20} />
        )}
      </button>
    </div>
  );
};

export default Login;
