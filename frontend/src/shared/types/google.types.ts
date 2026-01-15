/**
 * Google OAuth Types
 */

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

export interface GooglePromptNotification {
  isNotDisplayed(): boolean;
  isSkippedMoment(): boolean;
  isDismissedMoment(): boolean;
  getNotDisplayedReason(): string;
  getSkippedReason(): string;
  getDismissedReason(): string;
}

export interface GoogleAccounts {
  id: {
    initialize: (config: GoogleIdConfiguration) => void;
    prompt: (notificationCallback?: (notification: GooglePromptNotification) => void) => void;
    renderButton: (parent: HTMLElement | null, options?: GoogleButtonOptions) => void;
  };
}

export interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  itp_support?: boolean;
  ux_mode?: 'popup' | 'redirect';
  login_uri?: string;
  native_callback?: () => void;
  nonce?: string;
  context?: 'signin' | 'signup' | 'use';
  state_cookie_domain?: string;
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: () => void;
}

export interface GoogleButtonOptions {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string | number;
  locale?: string;
}

declare global {
  interface Window {
    google?: GoogleAccounts;
  }
}
