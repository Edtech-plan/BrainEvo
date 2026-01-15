import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import type { NextPage } from 'next';
import Link from 'next/link';
import invitationService from '../src/modules/invitation/invitation.service';
import type { Invitation } from '../src/shared/types';

const Invite: NextPage = () => {
  const router = useRouter();
  const { token } = router.query;
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyInvite = async () => {
      if (token && typeof token === 'string') {
        try {
          const response = await invitationService.verifyInvitation(token);
          if (response.success && response.invitation) {
            setInvitation(response.invitation);
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error
              ? err.message
              : (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Invalid or expired invitation';
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      } else {
        setError('Invalid invitation link');
        setLoading(false);
      }
    };

    verifyInvite();
  }, [token]);

  const handleAccept = () => {
    if (token) {
      router.push(`/register?token=${token}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying invitation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Invitation</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            href="/register"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">You've Been Invited!</h2>
          <p className="text-gray-600">
            You've been invited to join <strong>{invitation?.organizationId?.name || 'an organization'}</strong> as a{' '}
            <strong className="capitalize">{invitation?.role}</strong>
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 mb-2">
            <strong>Email:</strong> {invitation?.email}
          </div>
          <div className="text-sm text-gray-600">
            <strong>Role:</strong> <span className="capitalize">{invitation?.role}</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleAccept}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Accept Invitation & Sign Up
          </button>
          <Link
            href="/login"
            className="block w-full text-center text-blue-600 hover:text-blue-800 transition-colors py-2"
          >
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Invite;
