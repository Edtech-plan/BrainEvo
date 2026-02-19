import React from "react";
import type { UserRole } from "../../../shared/types";
import { GraduationCap, User, Building2 } from "lucide-react";

interface RoleSelectorProps {
  selectedRole: UserRole | "";
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

const RoleCard: React.FC<RoleCardProps> = ({
  icon,
  label,
  active,
  onClick,
  disabled,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === "Enter" || e.key === " ") && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      onClick={!disabled ? onClick : undefined}
      onKeyDown={handleKeyDown}
      // ✅ REMOVED: role="button" — redundant on <button> element
      tabIndex={disabled ? -1 : 0}
      disabled={disabled}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "12px",
        borderRadius: "12px",
        border: active ? "1px solid #10b981" : "1px solid #30363d",
        background: "#1c2333",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "border-color 200ms ease",
        width: "100%",
      }}
      onMouseEnter={(e) => {
        if (!active && !disabled) {
          e.currentTarget.style.borderColor = "transparent";
        }
      }}
      onMouseLeave={(e) => {
        if (!active && !disabled) {
          e.currentTarget.style.borderColor = "#30363d";
        }
      }}
    >
      <div style={{ marginBottom: "6px", color: "#8b949e" }}>{icon}</div>
      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#8b949e" }}>
        {label}
      </span>
    </button>
  );
};

const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
  disabled,
}) => {
  const roles: { value: UserRole; label: string; icon: React.ReactNode }[] = [
    {
      value: "learner",
      label: "Learner",
      icon: <GraduationCap size={22} />,
    },
    {
      value: "teacher",
      label: "Teacher",
      icon: <User size={22} />,
    },
    {
      value: "organization_admin",
      label: "Admin",
      icon: <Building2 size={22} />,
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <label
        htmlFor="role-selector"
        style={{
          display: "block",
          fontSize: "0.8rem",
          fontWeight: 500,
          color: "#8b949e",
          marginBottom: "2px",
        }}
      >
        Select Role
      </label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}
        role="radiogroup"
      >
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
