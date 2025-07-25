/**
 * General application constants and configuration values
 * Sport-specific constants have been moved to their respective sport modules
 */

export const HTTP_STATUS = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const GENERAL_ERROR_MESSAGES = {
  INVALID_DATE_FORMAT: 'Invalid date format provided',
  UNAUTHORIZED_ACCESS: 'Unauthorized access',
  RESOURCE_NOT_FOUND: 'Resource not found',
  INTERNAL_ERROR: 'Internal server error',
} as const;

export const API_LIMITS = {
  MAX_QUERY_DEPTH: 10,
  MAX_QUERY_COMPLEXITY: 1000,
  RATE_LIMIT_REQUESTS: 100,
  RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
} as const;