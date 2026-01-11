import React from 'react';
import { classNames } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div className={classNames('bg-white rounded-lg shadow p-6', className)}>
      {children}
    </div>
  );
};
