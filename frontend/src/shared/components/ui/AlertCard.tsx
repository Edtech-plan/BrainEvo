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

  const styles = {
    error: {
      container: 'bg-red-50 border-red-100',
      title: 'text-red-800',
      text: 'text-red-700',
      bullet: 'text-red-500'
    },
    warning: {
      container: 'bg-amber-50 border-amber-100',
      title: 'text-amber-800',
      text: 'text-amber-700',
      bullet: 'text-amber-500'
    },
    info: {
      container: 'bg-blue-50 border-blue-100',
      title: 'text-blue-800',
      text: 'text-blue-700',
      bullet: 'text-blue-500'
    },
  };

  const currentStyle = styles[variant];

  return (
    <div className={`rounded-xl border p-5 ${currentStyle.container} ${className}`}>
      <h2 className={`font-semibold mb-3 ${currentStyle.title}`}>
        {title}
      </h2>
      <ul className={`space-y-2 text-sm ${currentStyle.text}`}>
        {alerts.map((alert, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className={currentStyle.bullet}>•</span>
            {alert}
          </li>
        ))}
      </ul>
    </div>
  );
}
