import React from 'react';
import { theme } from '../../../../shared/components/ui/theme';

export const QuickUploadWidget = () => {
  return (
    <div className="p-6 mt-6 border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 transition-colors" style={{ borderColor: theme.colors.border, borderRadius: theme.borderRadius.lg, backgroundColor: 'transparent' }}>
      <div className="p-3 rounded-full mb-3" style={{ backgroundColor: theme.colors.primaryLight }}><svg className="w-6 h-6" fill="none" stroke={theme.colors.primary} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg></div>
      <h4 className="text-sm font-bold" style={{ color: theme.colors.textMain }}>Quick Upload</h4>
      <p className="text-xs mt-1" style={{ color: theme.colors.textSecondary }}>Drag & drop resources here</p>
    </div>
  );
};
