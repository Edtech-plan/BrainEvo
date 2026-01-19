import React from 'react';
import { Input } from '../ui';
import type { AdminFormData, FormErrors } from '../../types/forms.types';

interface AdminFormProps {
  formData: AdminFormData;
  errors: FormErrors;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
}

const AdminForm: React.FC<AdminFormProps> = ({
  formData,
  errors,
  onChange,
  showPassword,
  onTogglePassword,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Organization Information
        </div>
        <Input
          type="text"
          name="organizationName"
          placeholder="Organization Name"
          value={formData.organizationName}
          onChange={onChange}
          error={errors.organizationName}
          required
          className="text-base"
        />
      </div>

      <Input
        type="text"
        name="name"
        placeholder="Your Full Name"
        value={formData.name}
        onChange={onChange}
        error={errors.name}
        required
        className="text-base"
      />

      <Input
        type="email"
        name="email"
        placeholder="Your Email address"
        value={formData.email}
        onChange={onChange}
        error={errors.email}
        required
        className="text-base"
      />

      <div style={{ position: 'relative' }}>
        <Input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={onChange}
          error={errors.password}
          required
          style={{
            fontSize: '16px',        // text-base
            paddingRight: '2.5rem',  // pr-10
          }}
        />

        <button
          type="button"
          onClick={onTogglePassword}
          style={{
            position: 'absolute',
            right: '12px',           // right-3
            top: '50%',              // top-1/2
            transform: 'translateY(-50%)',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',        // text-gray-500
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#374151')} // hover:text-gray-700
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
        >
          {showPassword ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>


      <div>
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Organization Contact Information
        </div>
        <Input
          type="email"
          name="contactEmail"
          placeholder="Organization Contact Email"
          value={formData.contactEmail}
          onChange={onChange}
          error={errors.contactEmail}
          required
          className="text-base"
        />
      </div>

      <Input
        type="tel"
        name="contactPhone"
        placeholder="Organization Contact Phone (optional)"
        value={formData.contactPhone}
        onChange={onChange}
        error={errors.contactPhone}
        className="text-base"
      />
    </div>
  );
};

export default AdminForm;
