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
      className={`bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow ${className}`}
    >
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}
      >
        {icon}
      </div>
      <p className="text-gray-600 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
