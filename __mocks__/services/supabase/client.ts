import { jest } from '@jest/globals';
import { SupabaseClient } from '@supabase/supabase-js';
import { PostgrestBuilder, PostgrestFilterBuilder, PostgrestQueryBuilder, PostgrestSingleResponse, PostgrestError, PostgrestResponseFailure } from '@supabase/postgrest-js';
import { DatabaseSchema } from '@client/types/database';
import { TableName, TableRow, TableInsert, TableUpdate, MockFilterBuilder, MockQueryBuilder } from './types';

export interface MockOptions {
  simulateNetworkError?: boolean;
  simulateTimeout?: boolean;
  simulateConflict?: boolean;
}

export function createMockSupabaseClient(options: MockOptions = {}): jest.Mocked<SupabaseClient<DatabaseSchema>> {
  const mockData = new Map<string, any>();
  const mockError = new Map<string, any>();

  function createFilterBuilder<T extends TableName>(tableName: T): MockFilterBuilder<T> {
    const mockSingle = jest.fn().mockImplementation((): Promise<PostgrestSingleResponse<TableRow<T>>> => {
      if (options.simulateNetworkError) {
        const response: PostgrestResponseFailure = {
          data: null,
          error: {
            name: 'NetworkError',
            code: 'NETWORK_ERROR',
            message: 'Network error',
            details: 'Failed to connect to the server',
            hint: 'Check your internet connection'
          },
          count: null,
          status: 500,
          statusText: 'Network Error',
        };
        return Promise.resolve(response);
      }
      if (options.simulateTimeout) {
        const response: PostgrestResponseFailure = {
          data: null,
          error: {
            name: 'TimeoutError',
            code: 'TIMEOUT',
            message: 'Timeout error',
            details: 'Request timed out',
            hint: 'Try again later'
          },
          count: null,
          status: 408,
          statusText: 'Timeout',
        };
        return Promise.resolve(response);
      }
      if (options.simulateConflict) {
        const response: PostgrestResponseFailure = {
          data: null,
          error: {
            name: 'ConflictError',
            code: 'CONFLICT',
            message: 'Conflict error',
            details: 'Resource was modified by another request',
            hint: 'Refresh and try again'
          },
          count: null,
          status: 409,
          statusText: 'Conflict',
        };
        return Promise.resolve(response);
      }
      return Promise.resolve({
        data: mockData.get(tableName) as TableRow<T>,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK',
      });
    });

    const filterBuilder = {
      single: jest.fn().mockReturnValue({
        mockResolvedValue: (value: PostgrestSingleResponse<TableRow<T>>) => {
          mockData.set(tableName, value.data);
          mockError.set(tableName, value.error);
          return mockSingle;
        },
        mockRejectedValue: (error: any) => {
          mockData.set(tableName, null);
          mockError.set(tableName, error);
          return mockSingle;
        },
        then: (resolve: any) => Promise.resolve(mockSingle()).then(resolve),
      }),
      eq: jest.fn().mockReturnThis(),
    } as unknown as MockFilterBuilder<T>;

    return filterBuilder;
  }

  function createQueryBuilder<T extends TableName>(tableName: T): MockQueryBuilder<T> {
    const filterBuilder = createFilterBuilder(tableName);
    const queryBuilder = {
      select: jest.fn().mockReturnValue(filterBuilder),
      insert: jest.fn().mockReturnValue(filterBuilder),
      update: jest.fn().mockReturnValue(filterBuilder),
      upsert: jest.fn().mockReturnValue(filterBuilder),
      delete: jest.fn().mockReturnValue(filterBuilder),
      eq: jest.fn().mockReturnValue(filterBuilder),
    } as MockQueryBuilder<T>;

    return queryBuilder;
  }

  const client = {
    from: jest.fn((tableName: TableName) => createQueryBuilder(tableName)),
    auth: {
      getSession: jest.fn(),
      getUser: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    realtime: {
      channel: jest.fn(),
    },
    functions: {
      invoke: jest.fn(),
    },
    storage: {
      from: jest.fn(),
    },
  } as unknown as jest.Mocked<SupabaseClient<DatabaseSchema>>;

  return client;
}