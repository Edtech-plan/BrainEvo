import React, { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  color?: string;
  className?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  color = 'bg-blue-50 text-blue-600',
  className = '',
}: StatCardProps) {
  return (
    <div
      /* OPTIMIZATION: Replaced shadow hover with border hover for 60FPS performance */
      className={`bg-white rounded-xl p-5 border border-slate-200 
      transition-colors duration-200 hover:border-blue-400 ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${color} shrink-0`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
