import React from 'react';

interface AlertCardProps {
  title: string;
  alerts: string[];
  variant?: 'error' | 'warning' | 'info';
  className?: string;
}

export default function AlertCard({
  title,
  alerts,
  variant = 'error',
  className = '',
}: AlertCardProps) {
  if (alerts.length === 0) return null;

  const variantStyles = {
    error: 'border-red-200 text-red-600',
    warning: 'border-yellow-200 text-yellow-600',
    info: 'border-blue-200 text-blue-600',
  };

  return (
    <div
      className={`bg-white rounded-lg border ${variantStyles[variant]} p-6 ${className}`}
    >
      <h2 className={`text-xl font-semibold mb-4`}>{title}</h2>
      <ul className="space-y-2 text-sm text-gray-700">
        {alerts.map((alert, index) => (
          <li key={index}>• {alert}</li>
        ))}
      </ul>
    </div>
  );
}
