import React, { ReactNode } from 'react';
import { theme } from '../ui/theme';

interface SidebarProps {
  navItems: Array<{
    id: string;
    label: string;
    icon: ReactNode;
  }>;
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  isMobile?: boolean;
}

export default function Sidebar({
  navItems,
  activeSection,
  onSectionChange,
  collapsed,
}: SidebarProps) {
  
  const styles = {
    aside: {
      width: collapsed ? theme.sizes.sidebarCollapsedWidth : theme.sizes.sidebarWidth,
      backgroundColor: theme.colors.bgSurface,
      borderRight: `1px solid ${theme.colors.border}`,
      transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '16px 12px',
      overflowX: 'hidden' as const,
    },
    button: (isActive: boolean) => ({
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      padding: '12px',
      marginBottom: '4px',
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      backgroundColor: isActive ? theme.colors.primaryLight : 'transparent',
      color: isActive ? theme.colors.primary : theme.colors.textSecondary,
      border: 'none',
      fontSize: '14px',
      fontWeight: isActive ? 600 : 500,
      transition: 'all 0.2s',
      whiteSpace: 'nowrap' as const,
      // Inline hover simulation usually requires state, but we'll rely on CSS class for simple hover
    }),
    iconWrapper: {
      minWidth: '24px', // Ensures icon doesn't shrink
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: collapsed ? '0' : '12px',
    },
    label: {
      opacity: collapsed ? 0 : 1,
      transition: 'opacity 0.2s',
      transform: collapsed ? 'translateX(10px)' : 'none',
    }
  };

  return (
    <aside style={styles.aside}>
      <nav>
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              style={styles.button(isActive)}
              // Add simple hover effect via class since inline hover is complex in React
              className={!isActive ? "hover:bg-slate-50 hover:text-slate-900" : ""}
              title={collapsed ? item.label : undefined}
            >
              <div style={styles.iconWrapper}>
                {item.icon}
              </div>
              {!collapsed && <span style={styles.label}>{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
