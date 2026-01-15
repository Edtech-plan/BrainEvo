/**
 * Error Types
 */

export interface ApiErrorResponse {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(
    message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 'AUTH_ERROR', 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'AUTHZ_ERROR', 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Axios Error Response
 */
export interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
      code?: string;
      errors?: Record<string, string[]>;
    };
    status?: number;
  };
  message?: string;
}

/**
 * Union type for all possible errors in the application
 * This is more specific than 'unknown' and covers all error scenarios
 */
export type AppErrorType =
  | Error
  | AppError
  | ValidationError
  | AuthenticationError
  | AuthorizationError
  | AxiosErrorResponse
  | string;

/**
 * Type guard to check if error has Axios response structure
 */
export function isAxiosError(error: unknown): error is AxiosErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  );
}

/**
 * Type guard to check if error is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Type guard to check if error is an AppError instance
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Helper function to extract error message from any error type
 */
export function getErrorMessage(error: AppErrorType): string {
  if (typeof error === 'string') {
    return error;
  }

  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'An error occurred';
  }

  if (isError(error)) {
    return error.message;
  }

  return 'An unknown error occurred';
}
