/**
 * Google OAuth Utility Functions
 */

import type { GoogleAuthData } from '../types';

/**
 * Initialize Google Sign-In
 * This function should be called when the component mounts
 */
export const initializeGoogleSignIn = (): void => {
  if (typeof window === 'undefined') return;

  // Load Google Sign-In script if not already loaded
  if (!document.querySelector('script[src*="accounts.google.com"]')) {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }
};

/**
 * Handle Google Sign-In callback
 * This extracts user data from the Google credential response
 */
export const handleGoogleSignIn = (credentialResponse: any): GoogleAuthData | null => {
  try {
    // Decode the JWT token to get user info
    // Note: In production, you should verify this token on the backend
    const base64Url = credentialResponse.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    const payload = JSON.parse(jsonPayload);

    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      avatar: payload.picture,
    };
  } catch (error) {
    console.error('Error parsing Google credential:', error);
    return null;
  }
};

/**
 * Alternative: Use Google Identity Services (recommended)
 * This is the modern way to integrate Google Sign-In
 */
export const renderGoogleButton = (
  elementId: string,
  onSuccess: (data: GoogleAuthData) => void,
  onError: (error: string) => void
): void => {
  if (typeof window === 'undefined') return;

  // Wait for Google script to load
  const checkGoogle = setInterval(() => {
    if ((window as any).google) {
      clearInterval(checkGoogle);

      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        callback: (response: any) => {
          const userData = handleGoogleSignIn(response);
          if (userData) {
            onSuccess(userData);
          } else {
            onError('Failed to parse Google authentication data');
          }
        },
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signup_with',
        }
      );
    }
  }, 100);
};
