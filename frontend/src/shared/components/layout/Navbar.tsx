import React from 'react';
import Link from 'next/link';
import { routes } from '../../../config/routes';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4">
          <Link href={routes.HOME}>Home</Link>
          <Link href={routes.COURSES}>Courses</Link>
          <Link href={routes.ASSIGNMENTS}>Assignments</Link>
          <Link href={routes.LIVE_CLASSES}>Live Classes</Link>
        </div>
      </div>
    </nav>
  );
};
