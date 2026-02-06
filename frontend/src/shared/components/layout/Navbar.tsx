import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui';

export const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navLinks = [
    {
      name: 'Support',
      href: '/support',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Help Center', href: '/support/help' },
        { name: 'Contact Us', href: '/support/contact' },
        { name: 'FAQs', href: '/support/faqs' },
      ],
    },
    { name: 'Schools/Districts', href: '/schools', hasDropdown: false },
    { name: 'Tutorials', href: '/tutorials', hasDropdown: false },
    {
      name: 'Learn',
      href: '/learn',
      hasDropdown: true,
      dropdownItems: [
        { name: 'Documentation', href: '/learn/docs' },
        { name: 'Video Guides', href: '/learn/videos' },
        { name: 'Best Practices', href: '/learn/practices' },
      ],
    },
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <span className="text-xl font-bold text-white">BrainEvo</span>
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden lg:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
            {navLinks.map((link) => (
              <div key={link.name} className="relative group">
                <Link
                  href={link.href}
                  className="flex items-center space-x-1 px-2 py-2 text-sm font-normal text-white hover:text-gray-300 transition-colors"
                  onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <span>{link.name}</span>
                  {link.hasDropdown && (
                    <svg
                      className="w-3 h-3 ml-1 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </Link>

                {/* Dropdown Menu */}
                {link.hasDropdown && openDropdown === link.name && (
                  <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                    onMouseEnter={() => setOpenDropdown(link.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    {link.dropdownItems?.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Auth Buttons - Right */}
          <div className="flex items-center space-x-3 ml-auto">
            {isAuthenticated ? (
              <>
                <Link href="/student/dashboard">
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors">
                    Dashboard
                  </button>
                </Link>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                  className="text-sm px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all shadow-sm">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Log In</span>
                  </button>
                </Link>
                <Link href="/register">
                  <button className="px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
                    Start for FREE!
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden ml-3 p-2 text-white hover:text-gray-300"
            onClick={() => setOpenDropdown(openDropdown === 'mobile' ? null : 'mobile')}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {openDropdown === 'mobile' && (
          <div className="lg:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link
                    href={link.href}
                    className="block px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 rounded-lg transition-colors"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {link.name}
                  </Link>
                  {link.hasDropdown && link.dropdownItems && (
                    <div className="pl-4 space-y-1">
                      {link.dropdownItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                          onClick={() => setOpenDropdown(null)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
