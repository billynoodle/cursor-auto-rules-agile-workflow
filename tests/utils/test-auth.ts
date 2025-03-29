import { jest } from '@jest/globals';
import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema } from '@client/types/database';

export interface TestUser {
  id: string;
  email: string;
  role: string;
  session?: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export interface AuthTestContext {
  user: TestUser;
  tokens: {
    access: string;
    refresh: string;
  };
  cleanup: () => Promise<void>;
}

export interface AuthOptions {
  role?: string;
  customClaims?: Record<string, any>;
  sessionDuration?: number;
}

/**
 * Creates a test user with authentication context
 * @param supabaseClient Supabase client instance
 * @param options Auth options
 */
export async function createAuthContext(
  supabaseClient: SupabaseClient<DatabaseSchema>,
  options: AuthOptions = {}
): Promise<AuthTestContext> {
  const userId = `test-${Math.random().toString(36).substring(2)}`;
  const email = `${userId}@test.com`;
  
  const user: TestUser = {
    id: userId,
    email,
    role: options.role || 'user',
    session: {
      access_token: `test-access-${userId}`,
      refresh_token: `test-refresh-${userId}`,
      expires_at: Date.now() + (options.sessionDuration || 3600) * 1000
    }
  };

  // Mock auth methods
  jest.spyOn(supabaseClient.auth, 'getSession').mockImplementation(async () => ({
    data: {
      session: user.session
    },
    error: null
  }));

  jest.spyOn(supabaseClient.auth, 'getUser').mockImplementation(async () => ({
    data: {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          role: user.role,
          ...options.customClaims
        }
      }
    },
    error: null
  }));

  const cleanup = async () => {
    jest.clearAllMocks();
  };

  return {
    user,
    tokens: {
      access: user.session!.access_token,
      refresh: user.session!.refresh_token
    },
    cleanup
  };
}

/**
 * Sets up authentication for a test suite
 * @param supabaseClient Supabase client instance
 * @param options Auth options
 */
export function withAuthentication(
  supabaseClient: SupabaseClient<DatabaseSchema>,
  options: AuthOptions = {}
): { auth: AuthTestContext } {
  const testState = { auth: undefined as unknown as AuthTestContext };

  beforeEach(async () => {
    testState.auth = await createAuthContext(supabaseClient, options);
  });

  afterEach(async () => {
    if (testState.auth) {
      await testState.auth.cleanup();
    }
  });

  return testState;
}

/**
 * Creates a mock authenticated request context
 * @param auth Auth test context
 */
export function createAuthenticatedRequest(auth: AuthTestContext) {
  return {
    headers: {
      authorization: `Bearer ${auth.tokens.access}`
    },
    user: {
      id: auth.user.id,
      email: auth.user.email,
      role: auth.user.role
    }
  };
} 