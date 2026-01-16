import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export default function PageHeader({
  title,
  description,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="mt-2 text-slate-500 text-base md:text-lg max-w-2xl">
          {description}
        </p>
      )}
    </div>
  );
}
