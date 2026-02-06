import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  LayoutDashboard,
  FolderKanban,
  Library,
  Bell,
  Settings,
  Calendar,
  Video,
} from 'lucide-react'

import { useAuth } from '../../../src/features/auth/hooks/useAuth'
import { useStudentRoute } from '../../../src/shared/hooks'
import { DashboardLayout } from '../../../src/shared/components/layout'
import { theme } from '../../../src/shared/components/ui/theme'
import { Overview } from '@/features/student/dashboard'

type Section = 'overview' | 'projects' | 'resources' | 'messages' | 'settings'

export default function Dashboard() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useStudentRoute()
  const [activeSection, setActiveSection] = useState<Section>('overview')

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: theme.colors.bgMain
      }}>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <div style={{
          width: '32px', height: '32px', border: `3px solid ${theme.colors.border}`,
          borderTopColor: theme.colors.primary, borderRadius: '50%', animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }

  if (!isAuthenticated) return null

  const handleNavigation = (section: string) => {
    if (section === 'calendar') {
      router.push('/student/calendar');
      return;
    }
    if (section === 'live-classes') {
      router.push('/student/live-classes');
      return;
    }
    if (section === 'projects') {
      router.push('/student/assignment');
      return;
    }
    if (section === 'settings') {
      router.push('/student/settings');
      return;
    }
    setActiveSection(section as Section);
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'live-classes', label: 'Live Classes', icon: <Video size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'projects', label: 'Assignments', icon: <FolderKanban size={20} /> },
    { id: 'resources', label: 'Resources', icon: <Library size={20} /> },
    { id: 'messages', label: 'Messages', icon: <Bell size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ]

  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={handleNavigation}
    >
      {/*
        NOTE: Since DashboardLayout now handles the Main Scroll,
        We pass the content directly. The content components
        should NOT have 'overflow' properties, just layout.
      */}
      {activeSection === 'overview' && <Overview />}
      {/* Add other sections here */}
    </DashboardLayout>
  )
}
