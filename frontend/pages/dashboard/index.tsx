'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  LayoutDashboard,
  Calendar,
  FolderKanban,
  Library,
  Bell,
  Settings,
} from 'lucide-react'

import Overview from './components/Overview'
import { useAuth } from '../../src/shared/hooks/useAuth'
import { DashboardLayout } from '../../src/shared/components/layout'
import type { UserRole } from '../../src/shared/types'

type Section =
  | 'overview'
  | 'learning'
  | 'calendar'
  | 'projects'
  | 'resources'
  | 'messages'
  | 'settings'

interface NavItem {
  id: Section
  label: string
  icon: React.ReactNode
}

export default function Dashboard() {
  const router = useRouter()
  const { user, isAuthenticated, loading } = useAuth()

  const [activeSection, setActiveSection] = useState<Section>('overview')

  /* ---------------- AUTHENTICATION ---------------- */

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  // Role-based redirect
  useEffect(() => {
    if (!loading && isAuthenticated && user) {
      const role = (user as any)?.role as UserRole

      if (role === 'teacher') {
        router.push('/teacher/dashboard')
      } else if (role === 'organization_admin') {
        router.push('/admin/dashboard')
      }
    }
  }, [loading, isAuthenticated, user, router])

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    )
  }

  // Prevent render during redirect
  if (!isAuthenticated) {
    return null
  }

  /* ---------------- UI ---------------- */

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar size={20} /> },
    { id: 'projects', label: 'Assignments', icon: <FolderKanban size={20} /> },
    { id: 'resources', label: 'Resources', icon: <Library size={20} /> },
    { id: 'messages', label: 'Messages', icon: <Bell size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <Overview />
      default:
        return <Overview />
    }
  }

  return (
    <DashboardLayout
      navItems={navItems}
      activeSection={activeSection}
      onSectionChange={(section) => setActiveSection(section as Section)}
    >
      {renderSection()}
    </DashboardLayout>
  )
}
