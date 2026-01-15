import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useAuth } from '../../src/shared/hooks/useAuth';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated, loading } = useAuth();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {user?.name || 'User'}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Account</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-700">Name:</span>
              <span className="ml-2 text-sm text-gray-900">{user?.name}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Email:</span>
              <span className="ml-2 text-sm text-gray-900">{user?.email}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Role:</span>
              <span className="ml-2 text-sm text-gray-900 capitalize">{user?.role}</span>
            </div>
            {user?.authProvider && (
              <div>
                <span className="text-sm font-medium text-gray-700">Sign-in Method:</span>
                <span className="ml-2 text-sm text-gray-900 capitalize">{user.authProvider}</span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
