import { jest } from '@jest/globals';
import { SupabaseClient } from '@supabase/supabase-js';
import { PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { PostgrestBuilder, PostgrestFilterBuilder, PostgrestSingleResponse, PostgrestError, PostgrestResponseFailure } from '@supabase/postgrest-js';
import { DatabaseSchema } from '@client/types/database';
import { TableName, TableRow, TableInsert, TableUpdate, MockFilterBuilder, MockQueryBuilder } from './types';

export interface MockOptions {
  simulateNetworkError?: boolean;
  simulateTimeout?: boolean;
  simulateConflict?: boolean;
  simulateError?: Error;
}

export type MockSupabaseOptions = MockOptions;

export const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';
export const TEST_ASSESSMENT_ID = '00000000-0000-0000-0000-000000000002';

export const mockErrorScenarios: Record<string, MockOptions> = {
  networkError: { simulateNetworkError: true },
  timeout: { simulateTimeout: true },
  conflict: { simulateConflict: true },
};

export const mockAssessmentData = {
  id: TEST_ASSESSMENT_ID,
  user_id: TEST_USER_ID,
  current_module_id: 'module2',
  current_question_id: 'q2',
  completed_modules: [],
  progress: 50,
  status: 'draft' as const,
  is_complete: false,
  metadata: { source: 'test' },
  created_at: new Date('2025-03-29T02:22:41.521Z').toISOString(),
  updated_at: new Date('2025-03-29T02:22:41.521Z').toISOString()
};

export const mockAnswerData = {
  id: 'test-answer-id',
  assessment_id: TEST_ASSESSMENT_ID,
  question_id: 'q1',
  answer: { value: 'Test answer' },
  metadata: { source: 'test' },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

export const createMockSupabaseClient = (options: MockOptions = {}): jest.Mocked<SupabaseClient<DatabaseSchema>> => {
  const mockResponse = (data: any = null) => {
    if (options.simulateError) {
      return Promise.reject(options.simulateError);
    }
    if (options.simulateNetworkError) {
      return Promise.reject({ message: 'Network error', code: 'NETWORK_ERROR' });
    }
    if (options.simulateConflict) {
      return Promise.reject({ message: 'Conflict error', code: 'CONFLICT' });
    }
    return Promise.resolve({ 
      data: data || { 
        id: TEST_ASSESSMENT_ID,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, 
      error: null,
      count: null,
      status: 200,
      statusText: 'OK'
    });
  };

  const createChainedMethods = (data: any = null) => {
    const methods = {
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockImplementation(() => mockResponse(data)),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      gt: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lt: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      like: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      is: jest.fn().mockReturnThis(),
      in: jest.fn().mockReturnThis(),
      contains: jest.fn().mockReturnThis(),
      containedBy: jest.fn().mockReturnThis(),
      range: jest.fn().mockReturnThis(),
      textSearch: jest.fn().mockReturnThis(),
      match: jest.fn().mockReturnThis(),
      not: jest.fn().mockReturnThis(),
      or: jest.fn().mockReturnThis(),
      filter: jest.fn().mockReturnThis(),
      execute: jest.fn().mockImplementation(() => mockResponse(data))
    };

    // Make all methods chainable
    Object.values(methods).forEach(method => {
      if (typeof method === 'function') {
        method.mockReturnValue(methods);
      }
    });

    return methods;
  };

  const mockQueryBuilder = {
    ...createChainedMethods(),
    insert: jest.fn().mockImplementation((data) => createChainedMethods(data)),
    update: jest.fn().mockImplementation((data) => createChainedMethods(data)),
    upsert: jest.fn().mockImplementation((data) => createChainedMethods(data)),
    delete: jest.fn().mockImplementation(() => createChainedMethods()),
    select: jest.fn().mockImplementation(() => createChainedMethods())
  } as unknown as jest.Mocked<PostgrestQueryBuilder<any, any, any>>;

  const mockClient = {
    from: jest.fn().mockReturnValue(mockQueryBuilder),
    auth: {
      getUser: jest.fn(),
      signIn: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
      getSession: jest.fn()
    },
    realtime: {
      connect: jest.fn(),
      disconnect: jest.fn(),
      removeAllChannels: jest.fn(),
      removeChannel: jest.fn(),
      getChannels: jest.fn()
    },
    functions: {
      invoke: jest.fn()
    },
    storage: {
      from: jest.fn(),
      listBuckets: jest.fn(),
      getBucket: jest.fn(),
      createBucket: jest.fn(),
      deleteBucket: jest.fn()
    },
    removeAllChannels: jest.fn(),
    removeAllSubscriptions: jest.fn(),
    removeSubscription: jest.fn(),
    getChannels: jest.fn(),
    channel: jest.fn(),
    rpc: jest.fn()
  } as unknown as jest.Mocked<SupabaseClient<DatabaseSchema>>;

  return mockClient;
};

export { createMockSupabaseClient as default };