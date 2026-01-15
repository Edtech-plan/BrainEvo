'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  Calendar,
  FolderKanban,
  Library,
  Bell,
  Settings,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react'
import Link from 'next/link'
import Overview from './components/Overview'
import Resources from './components/Resources'
import Messages from './components/Messages'
import SettingsSection from './components/Settings'
import CalendarSection from './components/CalendarSection'
import Assignments from './components/Assignments'

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
  const [activeSection, setActiveSection] = useState<Section>('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

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
        return <Overview />;
      case 'calendar':
        return <CalendarSection />;
      case 'projects':
        return <Assignments />;
      case 'resources':
        return <Resources />;
      case 'messages':
        return <Messages />;
      case 'settings':
        return <SettingsSection />;
      default:
        return <Overview />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header (UNCHANGED THEME) */}
      <header className="h-[73px] bg-[#202020] text-white px-5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hover:bg-gray-800 p-2 rounded-md"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? (
              <PanelRightOpen className="rotate-180" />
            ) : (
              <PanelRightClose className="rotate-180" />
            )}
          </button>

          <Link href="/dashboard" className="text-2xl font-bold">
            BrainEvo
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative hover:bg-gray-800 p-2 rounded-md">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
          </button>

          <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center text-sm font-semibold">
            JD
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
    ${sidebarCollapsed ? 'w-16' : 'w-64'}
    bg-white border-r border-gray-200
    transition-all duration-300 ease-in-out
    flex flex-col
  `}
        >


          {/* Nav */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeSection === item.id
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-100'
                  }`}
              >
                {item.icon}
                {!sidebarCollapsed && <span>{item.label}</span>}
              </button>
            ))}
          </nav>



        </aside>

        {/* Main Content (DYNAMIC WIDTH) */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  )
}
