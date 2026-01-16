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
      <header className="h-[73px] bg-[#202020] text-white px-5 py-4  flex items-center justify-between sticky top-0 z-30">
        {headerContent || (
          <>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="hover:bg-gray-800 p-2 rounded-md"
                aria-label="Toggle sidebar"
              >
                {sidebarCollapsed ? (
                  <PanelRightOpen size={25} style={{ transform: 'rotate(180deg)' }}/>
                ) : (
                  <PanelRightClose size={25} style={{ transform: 'rotate(180deg)' }} />
                )}
              </button>
              <Link href="/dashboard" className="text-2xl font-bold">
                BrainEvo
              </Link>
            </div>
            <div className="flex items-center gap-4">
            <button
              style={{
                position: 'relative',
                padding: '8px',
                borderRadius: '6px',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#1f2937'; // gray-800
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Bell size={20} />

              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#2563eb', // blue-600
                  borderRadius: '50%',
                }}
              />
            </button>

              <div
                style={{
                  width: '36px',
                  height: '36px',
                  backgroundColor: '#374151', 
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffff',
                }}
              >
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
