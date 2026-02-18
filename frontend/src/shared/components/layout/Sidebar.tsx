import React, { ReactNode } from 'react';
import { theme } from '../../../../styles/theme';

interface SidebarProps {
  navItems: Array<{ id: string; label: string; icon: ReactNode }>;
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
  isMobile = false,
}: SidebarProps) {
  
  const styles = {
    aside: {
      width: isMobile ? '100%' : (collapsed ? theme.sizes.sidebarCollapsedWidth : theme.sizes.sidebarWidth),
      height: '100%',
      backgroundColor: theme.colors.bgSurface,
      borderRight: isMobile ? 'none' : `1px solid ${theme.colors.border}`,
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
      padding: '12px 16px',
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
      textAlign: 'left' as const,
    }),
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '24px',
    },
    label: {
      opacity: (!isMobile && collapsed) ? 0 : 1,
      transition: 'opacity 0.2s',
      marginLeft: '12px',
      whiteSpace: 'nowrap' as const,
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
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = theme.colors.bgHover;
                  e.currentTarget.style.color = theme.colors.textMain;
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = theme.colors.textSecondary;
                }
              }}
              title={collapsed && !isMobile ? item.label : undefined}
            >
              <div style={styles.iconWrapper}>
                {item.icon}
              </div>
              {(isMobile || !collapsed) && (
                <span style={styles.label}>{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
