import { jest } from '@jest/globals';
import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema } from '@client/types/database';
import { createMockSupabaseClient } from '@__mocks__/services/supabase/client';
import { OfflineService } from '@client/services/assessment/OfflineService';

export interface IsolatedTestContext<T = any> {
  mockSupabaseClient: jest.Mocked<SupabaseClient<DatabaseSchema>>;
  mockOfflineService: jest.Mocked<OfflineService>;
  instance?: T;
  cleanup: () => Promise<void>;
}

export interface TestIsolationOptions {
  simulateNetworkError?: boolean;
  simulateTimeout?: boolean;
  simulateConflict?: boolean;
  isOnline?: boolean;
}

/**
 * Creates an isolated test context with mocked dependencies
 * @param factory Function to create the service/controller instance
 * @param options Test isolation options
 */
export async function createIsolatedTestContext<T>(
  factory: (
    client: SupabaseClient<DatabaseSchema>,
    offlineService: OfflineService
  ) => T,
  options: TestIsolationOptions = {}
): Promise<IsolatedTestContext<T>> {
  const mockClient = createMockSupabaseClient(options) as jest.Mocked<SupabaseClient<DatabaseSchema>>;
  const mockOfflineService = createMockOfflineService() as jest.Mocked<OfflineService>;
  
  if (typeof options.isOnline === 'boolean') {
    Object.defineProperty(mockOfflineService, 'isOnline', {
      get: jest.fn().mockReturnValue(options.isOnline),
      configurable: true
    });
  }

  const instance = factory(mockClient, mockOfflineService);

  const cleanup = async () => {
    jest.clearAllMocks();
    // Add any additional cleanup needed
  };

  return {
    mockSupabaseClient: mockClient,
    mockOfflineService,
    instance,
    cleanup
  };
}

/**
 * Creates a transaction-like test environment that can be rolled back
 */
export class TestTransaction {
  private snapshots: Map<string, any> = new Map();

  /**
   * Takes a snapshot of the current state
   * @param key Unique identifier for the snapshot
   * @param state Current state to snapshot
   */
  takeSnapshot(key: string, state: any): void {
    this.snapshots.set(key, JSON.parse(JSON.stringify(state)));
  }

  /**
   * Restores state from a snapshot
   * @param key Snapshot identifier
   * @returns The restored state
   */
  restore(key: string): any {
    const snapshot = this.snapshots.get(key);
    if (!snapshot) {
      throw new Error(`No snapshot found for key: ${key}`);
    }
    return JSON.parse(JSON.stringify(snapshot));
  }

  /**
   * Clears all snapshots
   */
  clear(): void {
    this.snapshots.clear();
  }
}

/**
 * Sets up test isolation for a describe block
 * @param setupFn Optional setup function
 * @param teardownFn Optional teardown function
 */
export function withTestIsolation(
  setupFn?: () => Promise<void> | void,
  teardownFn?: () => Promise<void> | void
): void {
  beforeEach(async () => {
    jest.clearAllMocks();
    if (setupFn) {
      await setupFn();
    }
  });

  afterEach(async () => {
    if (teardownFn) {
      await teardownFn();
    }
  });
}

/**
 * Creates an isolated database context for testing
 */
export function createTestDatabaseContext() {
  const storage = new Map<string, Map<string, any>>();

  return {
    /**
     * Gets data from a table
     */
    getTable<T>(tableName: string): Map<string, T> {
      if (!storage.has(tableName)) {
        storage.set(tableName, new Map());
      }
      return storage.get(tableName) as Map<string, T>;
    },

    /**
     * Clears all data
     */
    clearAll(): void {
      storage.clear();
    },

    /**
     * Clears a specific table
     */
    clearTable(tableName: string): void {
      storage.delete(tableName);
    }
  };
}

export function createMockOfflineService(): jest.Mocked<OfflineService> {
  const mock = {
    STORAGE_KEY: 'assessment_offline_data',
    setupOfflineSync: jest.fn(),
    storeOfflineData: jest.fn(),
    getOfflineData: jest.fn(),
    getAllOfflineData: jest.fn(),
    removeOfflineData: jest.fn(),
    clearOfflineData: jest.fn(),
    syncOfflineData: jest.fn(),
    syncAssessment: jest.fn(),
    syncAnswer: jest.fn(),
    isOnline: jest.fn().mockReturnValue(true),
  };
  return mock as unknown as jest.Mocked<OfflineService>;
} 