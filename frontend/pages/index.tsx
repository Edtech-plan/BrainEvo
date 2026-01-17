import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../src/shared/hooks/useAuth';
import { BarChart3, Settings, ShieldCheck, PlayCircle, ChevronRight, Menu } from 'lucide-react';

const Home: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      
      {/* --- Navigation Bar --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10">
              <Image
                src="/logoo.png"
                alt="BrainEvo Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              BrainEvo
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'About Us', 'Contact'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <button className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all hover:shadow-lg">
                  Go to Dashboard
                </button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <button className="px-5 py-2.5 rounded-full text-slate-600 text-sm font-medium hover:text-slate-900 hover:bg-slate-200 transition-colors">
                    Log in
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-5 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5">
                    Get Started
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-xl absolute w-full left-0">
             <nav className="flex flex-col gap-4">
                <Link href="/features" className="text-slate-600 font-medium">Features</Link>
                <Link href="/pricing" className="text-slate-600 font-medium">Pricing</Link>
                <Link href="/login" className="text-blue-600 font-semibold">Login</Link>
             </nav>
          </div>
        )}
      </header>

      {/* --- Hero Section --- */}
      <section className="relative pt-12 pb-24 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10 pointer-events-none">
          <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-6 border border-blue-100 uppercase tracking-wide">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              New Platform v2.0
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Education <br className="hidden lg:block"/>
              <span className="text-blue-600">Reimagined</span> for the Future.
            </h1>
            
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Transform your institution with BrainEvo’s advanced LMS. analytics, live classes, and engagement tools—all in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link href="/register">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                  Start Free Trial <ChevronRight size={18} />
                </button>
              </Link>
              <Link href="/demo">
                <button className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-700 font-semibold border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
                  <PlayCircle size={20} className="text-blue-600" /> Watch Demo
                </button>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative lg:h-[600px] w-full flex items-center justify-center">
             <div className="relative w-full aspect-square max-w-[600px]">
                <Image
                  src="/landing.png"
                  alt="BrainEvo Dashboard Preview"
                  fill
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-out"
                  priority
                />
             </div>
          </div>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-24 bg-slate-50 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Why choose BrainEvo?</h2>
            <p className="text-slate-600 text-lg">
              We provide the infrastructure you need to scale education without the technical headaches.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Boost Engagement</h3>
              <p className="text-slate-600 leading-relaxed">
                Interactive course content, gamification, and real-time feedback loops to keep students hooked.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Settings className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Streamlined Admin</h3>
              <p className="text-slate-600 leading-relaxed">
                Automate attendance, grading, and reporting. Spend less time on paperwork and more on teaching.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-blue-200 transition-all duration-300 group">
              <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Enterprise Security</h3>
              <p className="text-slate-600 leading-relaxed">
                Bank-grade encryption and GDPR compliance ensure your student data is always safe and private.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">BrainEvo</span>
          </div>
          
          <div className="flex gap-8 text-sm font-medium">
             <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
             <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
             <Link href="#" className="hover:text-white transition-colors">Help Center</Link>
          </div>

          <p className="text-sm">
            &copy; {new Date().getFullYear()} BrainEvo Inc.
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Home;
