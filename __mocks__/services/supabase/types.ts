import { PostgrestBuilder, PostgrestFilterBuilder, PostgrestQueryBuilder, PostgrestSingleResponse } from '@supabase/postgrest-js';
import { DatabaseSchema } from '@client/types/database';

export type TableName = keyof DatabaseSchema['public']['Tables'];
export type TableRow<T extends TableName> = DatabaseSchema['public']['Tables'][T]['Row'];
export type TableInsert<T extends TableName> = DatabaseSchema['public']['Tables'][T]['Insert'];
export type TableUpdate<T extends TableName> = DatabaseSchema['public']['Tables'][T]['Update'];

export type MockResponse<T> = {
  data: T | null;
  error: Error | null;
  count: number | null;
  status: number;
  statusText: string;
};

export type MockFilterBuilder<T extends TableName> = {
  select: () => MockFilterBuilder<T>;
  single: () => Promise<MockResponse<TableRow<T>>>;
  eq: (column: string, value: any) => MockFilterBuilder<T>;
  neq: (column: string, value: any) => MockFilterBuilder<T>;
  gt: (column: string, value: any) => MockFilterBuilder<T>;
  gte: (column: string, value: any) => MockFilterBuilder<T>;
  lt: (column: string, value: any) => MockFilterBuilder<T>;
  lte: (column: string, value: any) => MockFilterBuilder<T>;
  like: (column: string, pattern: string) => MockFilterBuilder<T>;
  ilike: (column: string, pattern: string) => MockFilterBuilder<T>;
  is: (column: string, value: any) => MockFilterBuilder<T>;
  in: (column: string, values: any[]) => MockFilterBuilder<T>;
  contains: (column: string, value: any) => MockFilterBuilder<T>;
  containedBy: (column: string, value: any) => MockFilterBuilder<T>;
  range: (column: string, range: [any, any]) => MockFilterBuilder<T>;
  textSearch: (column: string, query: string) => MockFilterBuilder<T>;
  match: (query: object) => MockFilterBuilder<T>;
  not: (column: string, value: any) => MockFilterBuilder<T>;
  or: (query: string, values?: any[]) => MockFilterBuilder<T>;
  filter: (column: string, operator: string, value: any) => MockFilterBuilder<T>;
} & jest.Mock;

export type MockQueryBuilder<T extends TableName> = {
  select: () => MockFilterBuilder<T>;
  insert: (data: TableInsert<T>) => MockFilterBuilder<T>;
  update: (data: TableUpdate<T>) => MockFilterBuilder<T>;
  upsert: (data: TableInsert<T>) => MockFilterBuilder<T>;
  delete: () => MockFilterBuilder<T>;
  eq: (column: string, value: any) => MockFilterBuilder<T>;
  neq: (column: string, value: any) => MockFilterBuilder<T>;
  match: (query: object) => MockFilterBuilder<T>;
  single: () => Promise<MockResponse<TableRow<T>>>;
} & jest.Mock;