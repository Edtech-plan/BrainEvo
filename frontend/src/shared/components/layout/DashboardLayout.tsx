import React, { ReactNode } from 'react';
import Link from 'next/link';
import { PanelRightOpen, PanelRightClose, Bell } from 'lucide-react';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
  children: ReactNode;
  navItems: Array<{
    id: string;
    label: string;
    icon: ReactNode;
  }>;
  activeSection: string;
  onSectionChange: (section: string) => void;
  headerContent?: ReactNode;
}

export default function DashboardLayout({
  children,
  navItems,
  activeSection,
  onSectionChange,
  headerContent,
}: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Header */}
      <header className="h-[73px] bg-[#202020] text-white px-5 flex items-center justify-between sticky top-0 z-30">
        {headerContent || (
          <>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hover:bg-gray-800 p-2 rounded-md"
                aria-label="Toggle sidebar"
              >
                {sidebarCollapsed ? (
                  <PanelRightOpen className="rotate-180" size={20} />
                ) : (
                  <PanelRightClose className="rotate-180" size={20} />
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
          </>
        )}
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          navItems={navItems}
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          collapsed={sidebarCollapsed}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
