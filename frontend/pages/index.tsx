import React from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '../src/shared/hooks/useAuth';

const Home: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, loading, logout } = useAuth();

  // Redirect to dashboard if already authenticated
  React.useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Black Navigation Bar */}
      <header className="bg-[#202020] text-white px-5 py-5 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logoo.png"
            alt="BrainEvo Logo"
            width={80}
            height={80}
            className="object-contain"
          />
          <span className="text-2xl font-bold">BrainEvo</span>
        </Link>
        <nav className="hidden md:flex gap-8">
          <Link href="/" className="text-white no-underline font-medium hover:text-gray-300">
            Home
          </Link>
          <Link href="/features" className="text-white no-underline font-medium hover:text-gray-300">
            Features
          </Link>
          <Link href="/pricing" className="text-white no-underline font-medium hover:text-gray-300">
            Pricing
          </Link>
          <Link href="/about" className="text-white no-underline font-medium hover:text-gray-300">
            About Us
          </Link>
          <Link href="/contact" className="text-white no-underline font-medium hover:text-gray-300">
            Contact
          </Link>
        </nav>
        {isAuthenticated ? (
          <Link href="/dashboard">
            <button className="bg-gray-800 text-white px-3 py-1.5 rounded-md border border-gray-400 no-underline hover:bg-gray-700 transition-colors text-sm">
              Dashboard
            </button>
          </Link>
        ) : (
          <Link href="/login">
            <button className="bg-gray-800 text-white px-3 py-1.5 rounded-md border border-gray-400 no-underline hover:bg-gray-700 transition-colors text-sm">
              Login
            </button>
          </Link>
        )}
      </header>

      {/* Hero Section */}
      <section className="flex items-center justify-between px-8 md:px-12 lg:px-16 py-6 md:py-8 bg-white flex-col md:flex-row gap-8 md:gap-12">
        <div className="flex-1 w-full md:w-auto">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-gray-800 leading-tight">
            Empowering Education with Cutting-Edge EdTech Solutions
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-4 leading-relaxed">
            Transform your school or college with our advanced learning platforms designed to enhance engagement and improve outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register">
              <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg no-underline hover:bg-blue-700 transition-colors font-medium text-sm">
                Get Started
              </button>
            </Link>
            <Link href="/demo">
              <button className="bg-white text-black px-5 py-2.5 rounded-lg no-underline hover:bg-gray-50 transition-colors font-medium border border-gray-300 flex items-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
                Watch Demo
              </button>
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0 w-full md:w-1/2 lg:w-2/5 flex items-center justify-center">
          {/* Hero Illustration - Load from public folder */}
          <div className="relative w-full max-w-full">
            <Image
              src="/landing.png"
              alt="Online Learning Illustration"
              width={700}
              height={600}
              className="w-full h-auto object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="flex justify-between px-8 md:px-12 py-4 md:py-6 bg-white flex-col md:flex-row gap-6">
        <div className="flex-1 text-center">
          {/* Boost Engagement Icon - Bar graph with upward arrow */}
          <div className="flex justify-center mb-2">
            <svg width="50" height="50" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Bar chart bars */}
              <rect x="15" y="45" width="10" height="25" fill="#374151" rx="2"/>
              <rect x="30" y="35" width="10" height="35" fill="#374151" rx="2"/>
              <rect x="45" y="25" width="10" height="45" fill="#374151" rx="2"/>
              <rect x="60" y="30" width="10" height="40" fill="#374151" rx="2"/>
              {/* Upward curving arrow */}
              <path d="M42 15 Q45 12 48 15" stroke="#374151" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M48 15 L45 18 L45 22" stroke="#374151" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Boost Engagement</h3>
          <p className="text-sm text-gray-600">
            Interactive and engaging course content for better student participation.
          </p>
        </div>
        <div className="flex-1 text-center">
          {/* Streamline Administration Icon - Gear with document */}
          <div className="flex justify-center mb-2">
            <svg width="50" height="50" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Outer gear */}
              <circle cx="40" cy="40" r="25" fill="none" stroke="#374151" strokeWidth="3"/>
              <circle cx="40" cy="40" r="10" fill="#374151"/>
              {/* Gear teeth */}
              <rect x="38" y="10" width="4" height="10" fill="#374151" rx="1"/>
              <rect x="38" y="60" width="4" height="10" fill="#374151" rx="1"/>
              <rect x="10" y="38" width="10" height="4" fill="#374151" rx="1"/>
              <rect x="60" y="38" width="10" height="4" fill="#374151" rx="1"/>
              {/* Document icon inside */}
              <rect x="32" y="32" width="16" height="16" rx="2" fill="#374151" opacity="0.4"/>
              <rect x="34" y="34" width="12" height="3" fill="#374151"/>
              <rect x="34" y="39" width="8" height="3" fill="#374151"/>
              <rect x="34" y="44" width="10" height="3" fill="#374151"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Streamline Administration</h3>
          <p className="text-sm text-gray-600">
            Manage courses, students, and analytics with ease.
          </p>
        </div>
        <div className="flex-1 text-center">
          {/* Secure & Reliable Icon - Shield with gear */}
          <div className="flex justify-center mb-2">
            <svg width="50" height="50" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Shield shape */}
              <path d="M40 10 L15 20 L15 35 C15 50 25 62 40 70 C55 62 65 50 65 35 L65 20 Z" fill="#374151"/>
              {/* Gear inside shield */}
              <circle cx="40" cy="40" r="15" fill="none" stroke="white" strokeWidth="2.5"/>
              <circle cx="40" cy="40" r="5" fill="white"/>
              <rect x="38" y="22" width="4" height="8" fill="white" rx="1"/>
              <rect x="38" y="50" width="4" height="8" fill="white" rx="1"/>
              <rect x="22" y="38" width="8" height="4" fill="white" rx="1"/>
              <rect x="50" y="38" width="8" height="4" fill="white" rx="1"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Secure & Reliable</h3>
          <p className="text-sm text-gray-600">
            Robust, secure platform ensuring data privacy and reliability.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-5 bg-[#202020] text-white">
        <p className="m-0">&copy; 2024 BrainEvo. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
