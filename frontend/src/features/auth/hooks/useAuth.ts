import { useAuthContext } from '../context/AuthContext';

/**
 * Authentication Hook
 * Uses AuthContext for authentication state and methods
 */
export const useAuth = () => {
  return useAuthContext();
};
