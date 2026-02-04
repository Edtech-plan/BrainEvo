import React, { ReactNode, useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // 1. Import Image component
import { useRouter } from 'next/router';
import { PanelLeftClose, PanelLeftOpen, Bell, Menu, X, Settings, LogOut } from 'lucide-react';
import Sidebar from './Sidebar';
import { theme } from '../ui/theme';

// Import Shared Components
import ConfirmationModal from '../ui/ConfirmationModal';
import { useSettings } from '@/features/settings';

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: Array<{ id: string; label: string; icon: ReactNode }>;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function DashboardLayout({
  children,
  navItems,
  activeSection,
  onSectionChange,
}: DashboardLayoutProps) {
  const router = useRouter();
  
  // State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Dropdown & Modal State
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  // Ref for click-outside detection
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Hook Data
  const { settings } = useSettings();
  const profile = settings?.profile;

  const getInitials = (name: string) => {
    if (!name) return ''; 
    return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    // Perform logout logic (clear tokens etc.)
    router.push('/login');
  };

  const css = `
    .mobile-visible { display: flex !important; }
    .desktop-visible { display: none !important; }
    .sidebar-wrapper { display: none !important; }
    .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .hide-scrollbar::-webkit-scrollbar { display: none; }

    @media (min-width: 1024px) {
      .mobile-visible { display: none !important; }
      .desktop-visible { display: flex !important; }
      .sidebar-wrapper { display: block !important; }
    }
  `;

  const styles = {
    root: {
      height: '100vh', width: '100vw', backgroundColor: theme.colors.bgMain,
      fontFamily: theme.font, display: 'flex', flexDirection: 'column' as const, overflow: 'hidden',
    },
    header: {
      height: theme.sizes.headerHeight, backgroundColor: theme.colors.bgSurface,
      borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', padding: '0 24px', flexShrink: 0, zIndex: 40,
    },
    logo: {
      fontSize: '20px', fontWeight: 700,
      background: `linear-gradient(to right, ${theme.colors.primaryDark}, ${theme.colors.primary})`,
      WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none',
    },
    iconBtn: {
      padding: '8px', borderRadius: theme.borderRadius.md, color: theme.colors.textSecondary,
      backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    avatar: {
      width: '32px', height: '32px', borderRadius: '50%',
      backgroundColor: theme.colors.primary, color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '12px', fontWeight: 600, overflow: 'hidden',
      cursor: 'pointer', border: `1px solid ${theme.colors.primaryDark}`,
      position: 'relative' as const // 2. Added position relative for Next Image
    },
    menuItem: {
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '10px 16px', width: '100%', border: 'none',
      backgroundColor: 'transparent', color: theme.colors.textMain,
      fontSize: '14px', fontWeight: 500, cursor: 'pointer', textAlign: 'left' as const,
      textDecoration: 'none'
    }
  };

  return (
    <>
      <style>{css}</style>
      
      {/* GLOBAL LOGOUT MODAL */}
      <ConfirmationModal 
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Log Out"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Log Out"
        isDangerous={true}
      />

      <div style={styles.root}>
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setMobileMenuOpen(true)} style={styles.iconBtn} className="mobile-visible"><Menu size={24} /></button>
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} style={styles.iconBtn} className="desktop-visible">
              {sidebarCollapsed ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <Link href="/dashboard" style={styles.logo}>BrainEvo</Link>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ ...styles.iconBtn, position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: theme.colors.error, borderRadius: '50%', border: `2px solid ${theme.colors.bgSurface}` }} />
            </button>
            
            {/* PROFILE DROPDOWN */}
            <div style={{ position: 'relative' }} ref={profileMenuRef}>
              <button 
                style={styles.avatar} 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                title={profile?.fullName || 'User Profile'}
              >
                {/* 3. Replaced <img> with <Image /> */}
                {profile?.avatarUrl ? (
                  <Image 
                    src={profile.avatarUrl} 
                    alt="Profile" 
                    width={32} 
                    height={32}
                    style={{ objectFit: 'cover' }}
                    unoptimized // Skips Next.js optimization (avoids config requirement for blobs)
                  />
                ) : (
                  profile?.fullName ? getInitials(profile.fullName) : ''
                )}
              </button>

              {profileMenuOpen && (
                <div style={{
                  position: 'absolute', top: '45px', right: 0, width: '200px',
                  backgroundColor: '#fff', borderRadius: theme.borderRadius.md,
                  boxShadow: theme.shadows.md, border: `1px solid ${theme.colors.border}`,
                  overflow: 'hidden', animation: 'fadeIn 0.1s ease'
                }}>
                  {/* Menu Items */}
                  <Link href="/settings" style={styles.menuItem} onClick={() => setProfileMenuOpen(false)}>
                    <Settings size={16} /> Settings
                  </Link>
                  
                  <div style={{ height: '1px', backgroundColor: theme.colors.border, margin: '4px 0' }} />
                  
                  <button 
                    style={{ ...styles.menuItem, color: theme.colors.error }}
                    onClick={() => {
                      setProfileMenuOpen(false);
                      setShowLogoutModal(true); // Trigger Modal
                    }}
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, height: `calc(100vh - ${theme.sizes.headerHeight})`, overflow: 'hidden', position: 'relative' }}>
          <div className="sidebar-wrapper" style={{ height: '100%', backgroundColor: theme.colors.bgSurface, borderRight: `1px solid ${theme.colors.border}`, flexShrink: 0 }}>
            <Sidebar navItems={navItems} activeSection={activeSection} onSectionChange={onSectionChange} collapsed={sidebarCollapsed} />
          </div>

          {mobileMenuOpen && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 50 }} className="mobile-visible">
              <button style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', border: 'none' }} onClick={() => setMobileMenuOpen(false)} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '280px', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={styles.logo}>Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)} style={styles.iconBtn}><X size={24} /></button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <Sidebar navItems={navItems} activeSection={activeSection} onSectionChange={(id) => { onSectionChange(id); setMobileMenuOpen(false); }} collapsed={false} isMobile={true} />
                </div>
              </div>
            </div>
          )}

          <main style={{ flex: 1, height: '100%', overflowY: 'auto', padding: '24px', backgroundColor: theme.colors.bgMain }} className="hide-scrollbar">
            <div style={{ maxWidth: '1400px', margin: '0 auto', minHeight: '100%' }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
