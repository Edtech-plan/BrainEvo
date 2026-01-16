import React from 'react';

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'outline';
}

function ActionButton({ 
  label, 
  onClick, 
  disabled, 
  variant = 'primary' 
}: ActionButtonProps) {
  const baseStyles = "w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md focus:ring-blue-600",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 focus:ring-slate-500"
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {label}
    </button>
  );
}

export default ActionButton;
