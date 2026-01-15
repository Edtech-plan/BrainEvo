import React from 'react';

interface SidebarProps {
  navItems: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
}

export default function Sidebar({
  navItems,
  activeSection,
  onSectionChange,
  collapsed,
}: SidebarProps) {
  return (
    <aside
      className={`
        ${collapsed ? 'w-16' : 'w-64'}
        bg-white border-r border-gray-200
        transition-all duration-300 ease-in-out
        flex flex-col
      `}
    >
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
              activeSection === item.id
                ? 'bg-blue-50 text-blue-600 font-medium'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
    </aside>
  );
}
