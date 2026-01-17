export const theme = {
  colors: {
    // Backgrounds
    bgMain: '#f8fafc',      // Slate-50 (Main Canvas)
    bgSurface: '#ffffff',   // White (Cards/Sidebar/Header)
    bgHover: '#f1f5f9',     // Slate-100
    
    // Primary Brand
    primary: '#2563eb',     // Blue-600
    primaryLight: '#eff6ff',// Blue-50 (Active states)
    primaryDark: '#1d4ed8', // Blue-700
    
    // Text
    textMain: '#0f172a',    // Slate-900 (Headings)
    textSecondary: '#64748b', // Slate-500 (Body)
    
    // Borders
    border: '#e2e8f0',      // Slate-200
    
    // Status
    success: '#10b981',
    successBg: '#ecfdf5',
    warning: '#f59e0b',
    warningBg: '#fffbeb',
    error: '#ef4444',
    errorBg: '#fef2f2',
    info: '#6366f1',
    infoBg: '#eef2ff',
  },
  
  // Layout Dimensions
  sizes: {
    headerHeight: '64px',
    sidebarWidth: '260px',
    sidebarCollapsedWidth: '70px',
  },
  
  // Styling
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  },
  borderRadius: {
    md: '8px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  font: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};
