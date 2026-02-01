/**
 * Authentication Store
 *
 * Manages user authentication state for OIDC flow.
 * Frontend-only implementation - ready for backend integration.
 */

import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';
import {
  type AuthUser,
  oidcConfig,
  buildAuthorizationUrl,
  buildLogoutUrl,
  generateState,
  generateCodeVerifier,
} from '../config/auth';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export interface AuthState {
  status: AuthStatus;
  user: AuthUser | null;
  accessToken: string | null;
  idToken: string | null;
  expiresAt: number | null;
  error: string | null;
}

const AUTH_STORAGE_KEY = 'otw-auth-state';
const AUTH_STATE_KEY = 'otw-auth-pending-state';
const AUTH_VERIFIER_KEY = 'otw-auth-code-verifier';

// Initial state
const initialState: AuthState = {
  status: 'idle',
  user: null,
  accessToken: null,
  idToken: null,
  expiresAt: null,
  error: null,
};

// Load persisted state from localStorage
function loadPersistedState(): AuthState {
  if (!browser) return initialState;

  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as AuthState;
      // Check if token is expired
      if (parsed.expiresAt && Date.now() > parsed.expiresAt) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        return { ...initialState, status: 'unauthenticated' };
      }
      return { ...parsed, status: 'authenticated' };
    }
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return { ...initialState, status: 'unauthenticated' };
}

// Create the auth store
function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>(initialState);

  return {
    subscribe,

    /**
     * Initialize auth state from storage
     */
    initialize: () => {
      const state = loadPersistedState();
      set(state);
      return state;
    },

    /**
     * Start the login flow - redirect to OIDC provider
     */
    login: () => {
      if (!browser) return;

      update((state) => ({ ...state, status: 'loading', error: null }));

      // Generate and store state for CSRF protection
      const state = generateState();
      sessionStorage.setItem(AUTH_STATE_KEY, state);

      // Generate and store code verifier for PKCE
      const codeVerifier = generateCodeVerifier();
      sessionStorage.setItem(AUTH_VERIFIER_KEY, codeVerifier);

      // Redirect to authorization endpoint
      const authUrl = buildAuthorizationUrl(state, codeVerifier);
      window.location.href = authUrl;
    },

    /**
     * Handle the callback from OIDC provider
     */
    handleCallback: async (code: string, returnedState: string): Promise<boolean> => {
      if (!browser) return false;

      // Verify state matches
      const savedState = sessionStorage.getItem(AUTH_STATE_KEY);
      if (returnedState !== savedState) {
        update((state) => ({
          ...state,
          status: 'error',
          error: 'Invalid state parameter - possible CSRF attack',
        }));
        return false;
      }

      // Get code verifier
      const codeVerifier = sessionStorage.getItem(AUTH_VERIFIER_KEY);

      // Clean up session storage
      sessionStorage.removeItem(AUTH_STATE_KEY);
      sessionStorage.removeItem(AUTH_VERIFIER_KEY);

      update((state) => ({ ...state, status: 'loading' }));

      try {
        // In a real implementation, exchange code for tokens via backend
        // For now, simulate a successful auth with mock data
        // TODO: Implement actual token exchange with backend

        // Mock user data - replace with actual token exchange
        const mockUser: AuthUser = {
          id: 'user-' + Math.random().toString(36).substr(2, 9),
          email: 'user@example.com',
          name: 'Sports Fan',
          picture: undefined,
          emailVerified: true,
        };

        const expiresAt = Date.now() + 3600 * 1000; // 1 hour

        const newState: AuthState = {
          status: 'authenticated',
          user: mockUser,
          accessToken: 'mock-access-token',
          idToken: 'mock-id-token',
          expiresAt,
          error: null,
        };

        // Persist to localStorage
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
        set(newState);

        return true;
      } catch (error) {
        update((state) => ({
          ...state,
          status: 'error',
          error: error instanceof Error ? error.message : 'Authentication failed',
        }));
        return false;
      }
    },

    /**
     * Log out the user
     */
    logout: (redirect = true) => {
      if (!browser) return;

      // Get ID token for logout hint
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      let idToken: string | undefined;
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          idToken = parsed.idToken;
        } catch {
          // Ignore
        }
      }

      // Clear stored auth state
      localStorage.removeItem(AUTH_STORAGE_KEY);

      // Reset store state
      set({ ...initialState, status: 'unauthenticated' });

      // Redirect to OIDC logout if requested
      if (redirect) {
        const logoutUrl = buildLogoutUrl(idToken);
        window.location.href = logoutUrl;
      }
    },

    /**
     * Update user profile
     */
    updateUser: (userData: Partial<AuthUser>) => {
      update((state) => {
        if (!state.user) return state;

        const updatedUser = { ...state.user, ...userData };
        const newState = { ...state, user: updatedUser };

        // Persist updated state
        if (browser) {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newState));
        }

        return newState;
      });
    },

    /**
     * Clear any auth errors
     */
    clearError: () => {
      update((state) => ({ ...state, error: null }));
    },
  };
}

export const authStore = createAuthStore();

// Derived stores for convenience
export const isAuthenticated = derived(
  authStore,
  ($auth) => $auth.status === 'authenticated'
);

export const isLoading = derived(
  authStore,
  ($auth) => $auth.status === 'loading'
);

export const currentUser = derived(
  authStore,
  ($auth) => $auth.user
);

export const authError = derived(
  authStore,
  ($auth) => $auth.error
);
