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

  const css = `
    .mobile-visible { display: flex !important; }
    .desktop-visible { display: none !important; }
    .sidebar-wrapper { display: none !important; }
    
    /* Scrollbar Hiding Class */
    .hide-scrollbar {
      -ms-overflow-style: none;  /* IE and Edge */
      scrollbar-width: none;  /* Firefox */
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none; /* Chrome, Safari and Opera */
    }

    @media (min-width: 1024px) {
      .mobile-visible { display: none !important; }
      .desktop-visible { display: flex !important; }
      .sidebar-wrapper { display: block !important; }
    }
  `;

  const styles = {
    root: {
      height: '100vh',
      width: '100vw',
      backgroundColor: theme.colors.bgMain,
      fontFamily: theme.font,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
    },
    header: {
      height: theme.sizes.headerHeight,
      backgroundColor: theme.colors.bgSurface,
      borderBottom: `1px solid ${theme.colors.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
      zIndex: 40,
    },
    logo: {
      fontSize: '20px',
      fontWeight: 700,
      background: `linear-gradient(to right, ${theme.colors.primaryDark}, ${theme.colors.primary})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textDecoration: 'none',
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
    body: {
      display: 'flex',
      flex: 1,
      height: `calc(100vh - ${theme.sizes.headerHeight})`,
      overflow: 'hidden',
      position: 'relative' as const,
    },
    sidebarContainer: {
      height: '100%',
      backgroundColor: theme.colors.bgSurface,
      borderRight: `1px solid ${theme.colors.border}`,
      flexShrink: 0,
    },
    // Updated Main Style to use the class for scrollbar hiding
    main: {
      flex: 1,
      height: '100%',
      overflowY: 'auto' as const,
      padding: '24px',
      backgroundColor: theme.colors.bgMain,
    },
    contentInner: {
      maxWidth: '1400px',
      margin: '0 auto',
      minHeight: '100%',
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
    }
  };

  return (
    <>
      <style>{css}</style>
      <div style={styles.root}>
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setMobileMenuOpen(true)}
              style={styles.iconBtn}
              className="mobile-visible"
            >
              <Menu size={24} />
            </button>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              style={styles.iconBtn}
              className="desktop-visible"
            >
              {sidebarCollapsed ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
            <Link href="/dashboard" style={styles.logo}>BrainEvo</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button style={{ ...styles.iconBtn, position: 'relative' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', backgroundColor: theme.colors.error, borderRadius: '50%', border: `2px solid ${theme.colors.bgSurface}` }} />
            </button>
            <div style={styles.avatar}>JD</div>
          </div>
        </header>

        <div style={styles.body}>
          <div className="sidebar-wrapper" style={styles.sidebarContainer}>
            <Sidebar navItems={navItems} activeSection={activeSection} onSectionChange={onSectionChange} collapsed={sidebarCollapsed} />
          </div>

          {mobileMenuOpen && (
            <div style={{ position: 'absolute', inset: 0, zIndex: 50 }} className="mobile-visible">
              <button type="button" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'default' }} onClick={() => setMobileMenuOpen(false)} />
              <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '280px', backgroundColor: '#fff', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '16px', borderBottom: `1px solid ${theme.colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={styles.logo}>Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)} style={styles.iconBtn}><X size={24} /></button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <Sidebar navItems={navItems} activeSection={activeSection} onSectionChange={(id) => { onSectionChange(id); setMobileMenuOpen(false); }} collapsed={false} isMobile={true} />
                </div>
              </div>
            </div>
          )}

          {/* Main Content with Hide Scrollbar Class */}
          <main style={styles.main} className="hide-scrollbar">
            <div style={styles.contentInner}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
