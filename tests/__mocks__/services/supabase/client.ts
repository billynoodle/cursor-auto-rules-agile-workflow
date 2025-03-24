import { jest } from '@jest/globals';
import { SupabaseClient } from '@supabase/supabase-js';
import { PostgrestBuilder, PostgrestFilterBuilder, PostgrestQueryBuilder, PostgrestSingleResponse } from '@supabase/postgrest-js';
import { DatabaseSchema } from '../../../../client/src/types/database';
import { TableName, TableRow, TableInsert, TableUpdate, MockFilterBuilder, MockQueryBuilder } from './types';

export function createMockSupabaseClient(): jest.Mocked<SupabaseClient<DatabaseSchema>> {
  const mockData = new Map<string, any>();
  const mockError = new Map<string, any>();

  function createFilterBuilder<T extends TableName>(tableName: T): MockFilterBuilder<T> {
    const mockSingle = jest.fn().mockImplementation(() => {
      return Promise.resolve({
        data: mockData.get(tableName),
        error: mockError.get(tableName),
        count: null,
        status: mockError.get(tableName) ? 400 : 200,
        statusText: mockError.get(tableName) ? 'Error' : 'OK',
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