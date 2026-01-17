import React, { ReactNode, useState } from 'react';
import Link from 'next/link';
import { PanelLeftClose, PanelLeftOpen, Bell, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import { theme } from '../ui/theme';

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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Responsive Styles:
  // - .mobile-only: Visible on phones, Hidden on Desktop
  // - .desktop-only: Hidden on phones, Visible on Desktop
  // - .sidebar-desktop: The wrapper for the static sidebar
  const responsiveStyles = `
    .mobile-only { display: flex !important; }
    .desktop-only { display: none !important; }
    .sidebar-desktop { display: none !important; }

    @media (min-width: 1024px) {
      .mobile-only { display: none !important; }
      .desktop-only { display: flex !important; }
      .sidebar-desktop { display: block !important; }
    }
  `;

  const styles = {
    // 1. Root Container: LOCKED to screen height
    layoutContainer: {
      height: '100vh', 
      width: '100vw',
      backgroundColor: theme.colors.bgMain,
      fontFamily: theme.font,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden', // Prevents window scrolling
    },
    // 2. Header: Fixed height, stays at top
    header: {
      height: theme.sizes.headerHeight,
      backgroundColor: theme.colors.bgSurface,
      borderBottom: `1px solid ${theme.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0, // Never shrinks
      zIndex: 40,
    },
    logoText: {
      fontSize: '20px',
      fontWeight: 700,
      background: `linear-gradient(to right, ${theme.colors.primaryDark}, ${theme.colors.primary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    iconBtn: {
      padding: '8px',
      borderRadius: theme.borderRadius.md,
      color: theme.colors.textSecondary,
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: theme.colors.primary,
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '12px',
      fontWeight: 600,
    },
    // 3. Body Wrapper: Flex container for Sidebar + Main
    bodyWrapper: {
      display: 'flex',
      flex: 1, // Fills remaining height
      height: 'calc(100vh - 64px)', // Explicit height calculation
      overflow: 'hidden',
      position: 'relative' as const,
    },
    // 4. Desktop Sidebar Wrapper: Static & Fixed
    sidebarWrapper: {
      height: '100%',
      flexShrink: 0,
      backgroundColor: theme.colors.bgSurface,
      // Sidebar component handles the border, but we ensure layout integrity here
    },
    // 5. Main Content: The ONLY thing that scrolls
    main: {
      flex: 1,
      height: '100%',
      overflowY: 'auto' as const, // Enable vertical scrolling
      padding: '24px',
      backgroundColor: theme.colors.bgMain,
      scrollBehavior: 'smooth' as const,
    },
    contentInner: {
      maxWidth: '1400px',
      margin: '0 auto',
      minHeight: '100%',
    }
  };

  return (
    <>
      <style>{responsiveStyles}</style>
      
      <div style={styles.layoutContainer}>
        
        {/* --- Header --- */}
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={styles.iconBtn}
              className="mobile-only hover:bg-slate-100"
              aria-label={mobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>


            {/* Desktop Sidebar Toggle */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={styles.iconBtn}
              className="desktop-only hover:bg-slate-100"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ?  <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
            
            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <span style={styles.logoText}>BrainEvo</span>
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button className="hover:bg-slate-100" style={{ ...styles.iconBtn, position: 'relative' }}>
              <Bell size={20} />
              <span style={{
                position: 'absolute', top: '6px', right: '6px', width: '8px', height: '8px',
                backgroundColor: theme.colors.error, borderRadius: '50%', border: `2px solid ${theme.colors.bgSurface}`
              }} />
            </button>
            <div style={styles.avatar}>JD</div>
          </div>
        </header>

        {/* --- Body (Sidebar + Content) --- */}
        <div style={styles.bodyWrapper}>
          
          {/* 1. Desktop Sidebar (Static, Left Side) */}
          <div className="sidebar-desktop" style={styles.sidebarWrapper}>
            <Sidebar
              navItems={navItems}
              activeSection={activeSection}
              onSectionChange={onSectionChange}
              collapsed={sidebarCollapsed}
            />
          </div>

          {/* 2. Mobile Sidebar Drawer (Overlay) */}
          {mobileMenuOpen && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 50 }} className="mobile-only">
              {/* Backdrop */}
              <button
                type="button"
                style={{ 
                  position: 'absolute', inset: 0, width: '100%', height: '100%', 
                  backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)',
                  border: 'none', cursor: 'default'
                }}
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close mobile menu"
              />
              
              {/* Drawer Content */}
              <div style={{ 
                position: 'absolute', top: 0, bottom: 0, left: 0, width: '280px', 
                backgroundColor: '#fff', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
                display: 'flex', flexDirection: 'column' 
              }}>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <Sidebar
                    navItems={navItems}
                    activeSection={activeSection}
                    onSectionChange={(id) => {
                      onSectionChange(id);
                      setMobileMenuOpen(false);
                    }}
                    collapsed={false}
                    isMobile={true}
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. Main Scrollable Content */}
          <main style={styles.main}>
            <div style={styles.contentInner}>
              {children}
            </div>
          </main>

        </div>
      </div>
    </>
  );
}
