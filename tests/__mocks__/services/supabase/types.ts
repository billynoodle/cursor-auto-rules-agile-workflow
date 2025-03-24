import { PostgrestBuilder, PostgrestFilterBuilder, PostgrestQueryBuilder, PostgrestSingleResponse } from '@supabase/postgrest-js';
import { DatabaseSchema } from '../../../../client/src/types/database';

export type TableName = keyof DatabaseSchema['public']['Tables'];
export type TableRow<T extends TableName> = DatabaseSchema['public']['Tables'][T]['Row'];
export type TableInsert<T extends TableName> = DatabaseSchema['public']['Tables'][T]['Insert'];
export type TableUpdate<T extends TableName> = DatabaseSchema['public']['Tables'][T]['Update'];

export type MockSingleResponse<T extends TableName> = {
  mockResolvedValue: (value: PostgrestSingleResponse<TableRow<T>>) => jest.Mock<Promise<PostgrestSingleResponse<TableRow<T>>>>;
  mockRejectedValue: (error: any) => jest.Mock<Promise<PostgrestSingleResponse<TableRow<T>>>>;
  then: (resolve: any) => Promise<PostgrestSingleResponse<TableRow<T>>>;
};

export type MockFilterBuilder<T extends TableName> = {
  single: () => MockSingleResponse<T>;
  eq: jest.Mock<MockFilterBuilder<T>>;
};

export type MockQueryBuilder<T extends TableName> = {
  select: jest.Mock<MockFilterBuilder<T>>;
  insert: jest.Mock<MockFilterBuilder<T>>;
  update: jest.Mock<MockFilterBuilder<T>>;
  upsert: jest.Mock<MockFilterBuilder<T>>;
  delete: jest.Mock<MockFilterBuilder<T>>;
  eq: jest.Mock<MockFilterBuilder<T>>;
};