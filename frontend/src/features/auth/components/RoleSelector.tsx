import React from 'react';
import type { UserRole } from '../../../shared/types';

interface RoleSelectorProps {
  selectedRole: UserRole | '';
  onRoleChange: (role: UserRole) => void;
  disabled?: boolean;
}

interface RoleCardProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({ icon, label, active, onClick, disabled }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      className={`
        cursor-pointer rounded-lg border-2 flex flex-col items-center justify-center gap-1 transition-all
        flex-1 min-h-[60px] py-2 px-1.5 bg-white shadow-sm
        ${active
          ? 'border-purple-600 bg-purple-50 text-purple-600 shadow-md'
          : 'border-gray-300 hover:border-purple-400 hover:shadow-md text-gray-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="text-[10px] font-semibold text-center leading-tight">{label}</span>
    </div>
  );
};

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleChange, disabled }) => {
  const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    {
      value: 'learner',
      label: 'Learner',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v9M4 9v9a2 2 0 002 2h12a2 2 0 002-2V9M4 9l8-5 8 5M4 9l8 5 8-5" />
        </svg>
      ),
    },
    {
      value: 'teacher',
      label: 'Teacher',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      value: 'organization_admin',
      label: 'Admin',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mb-6">
      <div className="block text-sm font-medium text-gray-700 mb-2">
        Select Role
      </div>
      <div className="flex gap-2 w-full" role="radiogroup">
        {roles.map((role) => (
          <RoleCard
            key={role.value}
            icon={role.icon}
            label={role.label}
            active={selectedRole === role.value}
            onClick={() => !disabled && onRoleChange(role.value)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
