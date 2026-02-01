/**
 * OIDC Authentication Configuration
 *
 * Configure your OIDC provider here. Supports standard providers like:
 * - Auth0
 * - Okta
 * - Keycloak
 * - Google
 * - Azure AD
 */

export interface OIDCConfig {
  /** OIDC provider authority/issuer URL */
  authority: string;
  /** Client ID from your OIDC provider */
  clientId: string;
  /** Redirect URI after authentication */
  redirectUri: string;
  /** Post-logout redirect URI */
  postLogoutRedirectUri: string;
  /** Requested scopes */
  scopes: string[];
  /** Response type (code for PKCE flow) */
  responseType: 'code';
  /** Whether to use PKCE (recommended) */
  usePkce: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified: boolean;
  /** Raw claims from the ID token */
  claims?: Record<string, unknown>;
}

// Get base URL for redirects
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:5173';
};

/**
 * OIDC Configuration
 *
 * Replace these values with your actual OIDC provider settings.
 * For development, you can use a local Keycloak or Auth0 dev tenant.
 */
export const oidcConfig: OIDCConfig = {
  // Example: Auth0
  // authority: 'https://your-tenant.auth0.com',
  // Example: Keycloak
  // authority: 'https://keycloak.example.com/realms/your-realm',
  // Example: Google
  // authority: 'https://accounts.google.com',

  authority: import.meta.env.VITE_OIDC_AUTHORITY || 'https://auth.otw.sport',
  clientId: import.meta.env.VITE_OIDC_CLIENT_ID || 'otw-sport-frontend',
  redirectUri: `${getBaseUrl()}/auth/callback`,
  postLogoutRedirectUri: getBaseUrl(),
  scopes: ['openid', 'profile', 'email'],
  responseType: 'code',
  usePkce: true,
};

/**
 * Build the authorization URL for the OIDC provider
 */
export function buildAuthorizationUrl(state: string, codeVerifier?: string): string {
  const params = new URLSearchParams({
    client_id: oidcConfig.clientId,
    redirect_uri: oidcConfig.redirectUri,
    response_type: oidcConfig.responseType,
    scope: oidcConfig.scopes.join(' '),
    state,
  });

  if (oidcConfig.usePkce && codeVerifier) {
    // In a real implementation, generate code_challenge from code_verifier
    // code_challenge = base64url(sha256(code_verifier))
    params.set('code_challenge_method', 'S256');
    params.set('code_challenge', codeVerifier); // Placeholder
  }

  return `${oidcConfig.authority}/authorize?${params.toString()}`;
}

/**
 * Build the logout URL for the OIDC provider
 */
export function buildLogoutUrl(idTokenHint?: string): string {
  const params = new URLSearchParams({
    post_logout_redirect_uri: oidcConfig.postLogoutRedirectUri,
  });

  if (idTokenHint) {
    params.set('id_token_hint', idTokenHint);
  }

  return `${oidcConfig.authority}/logout?${params.toString()}`;
}

/**
 * Generate a random state parameter for CSRF protection
 */
export function generateState(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Generate a code verifier for PKCE
 */
export function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}
