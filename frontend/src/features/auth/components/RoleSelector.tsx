import React from 'react';
import type { UserRole } from '../../../shared/types';
import { GraduationCap, User, Building2 } from 'lucide-react';

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
    <button
      onClick={!disabled ? onClick : undefined}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all group
        ${active
          ? 'border-primary bg-blue-50/50 dark:bg-blue-900/20'
          : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-900'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <div className={`mb-1 ${active ? 'text-primary' : 'text-slate-400 group-hover:text-primary'}`}>
        {icon}
      </div>
      <span className={`text-xs font-semibold ${active ? 'text-primary' : 'text-slate-600 dark:text-slate-400 group-hover:text-primary'}`}>{label}</span>
    </button>
  );
};

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onRoleChange, disabled }) => {
  const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    {
      value: 'learner',
      label: 'Learner',
      icon: <GraduationCap className="text-2xl" />,
    },
    {
      value: 'teacher',
      label: 'Teacher',
      icon: <User size={20} />,
    },
    {
      value: 'organization_admin',
      label: 'Admin',
      icon: <Building2 className="text-2xl" />,
    },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
        Select Role
      </label>
      <div className="grid grid-cols-3 gap-3" role="radiogroup">
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
