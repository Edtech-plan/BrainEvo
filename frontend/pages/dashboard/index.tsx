import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  LayoutDashboard,
  Calendar,
  FolderKanban,
  Library,
  Bell,
  Settings,
  Video,
} from 'lucide-react'


import { useAuth } from '../../src/shared/hooks/useAuth'
import { DashboardLayout } from '../../src/shared/components/layout'
import type { UserRole } from '../../src/shared/types'
import { theme } from '../../src/shared/components/ui/theme'
import Overview from './Overview'
import LiveClasses from './LiveClasses'

type Section = 'overview' | 'live' | 'calendar' | 'projects' | 'resources' | 'messages' | 'settings'

export default function Dashboard() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()
  const [activeSection, setActiveSection] = useState<Section>('overview')

  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/login')
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const role = user.role as UserRole
      if (role === 'teacher') router.push('/teacher/dashboard')
      else if (role === 'organization_admin') router.push('/admin/dashboard')
    }
  }, [loading, isAuthenticated, user, router])

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

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'live', label: 'Live Classes', icon: <Video size={20} /> },
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
      onSectionChange={(s) => setActiveSection(s as Section)}
    >
      {/* 
        NOTE: Since DashboardLayout now handles the Main Scroll,
        We pass the content directly. The content components 
        should NOT have 'overflow' properties, just layout.
      */}
      {activeSection === 'overview' && <Overview />}
      {activeSection === 'live' && <LiveClasses />}
      {/* Add other sections here */}
    </DashboardLayout>
  )
}
