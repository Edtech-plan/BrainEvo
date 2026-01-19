import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  // Matching Landing Page: Rounded, Blue-600 for primary, Slate for others
  const baseStyles = "inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg focus:ring-blue-600 rounded-xl", 
    secondary: "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg focus:ring-slate-900 rounded-xl",
    outline: "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-200 rounded-xl",
    ghost: "text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-2.5 text-sm",
    lg: "px-8 py-3.5 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
