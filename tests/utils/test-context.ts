import { jest } from '@jest/globals';
import { TestTransaction } from './test-isolation';

export interface TestContextOptions {
  setupFn?: () => Promise<void> | void;
  teardownFn?: () => Promise<void> | void;
  mockDate?: Date;
}

/**
 * Base test context that can be extended for specific test scenarios
 */
export class BaseTestContext {
  protected transaction: TestTransaction;
  protected mocks: Map<string, jest.Mock>;

  constructor() {
    this.transaction = new TestTransaction();
    this.mocks = new Map();
  }

  /**
   * Creates a mock function and stores it in the context
   * @param name Unique name for the mock
   * @param implementation Optional mock implementation
   */
  createMock(name: string, implementation?: (...args: any[]) => any): jest.Mock {
    const mock = jest.fn(implementation);
    this.mocks.set(name, mock);
    return mock;
  }

  /**
   * Gets a previously created mock
   * @param name Mock name
   */
  getMock(name: string): jest.Mock | undefined {
    return this.mocks.get(name);
  }

  /**
   * Takes a snapshot of the current state
   * @param key Snapshot identifier
   * @param state State to snapshot
   */
  snapshot(key: string, state: any): void {
    this.transaction.takeSnapshot(key, state);
  }

  /**
   * Restores state from a snapshot
   * @param key Snapshot identifier
   */
  restore(key: string): any {
    return this.transaction.restore(key);
  }

  /**
   * Cleans up the test context
   */
  async cleanup(): Promise<void> {
    this.transaction.clear();
    this.mocks.clear();
    jest.clearAllMocks();
  }
}

/**
 * Sets up a test context for a describe block
 * @param contextFactory Function that creates the test context
 * @param options Test context options
 */
export function withTestContext<T extends BaseTestContext>(
  contextFactory: () => T,
  options: TestContextOptions = {}
): { context: T } {
  const testState = { context: undefined as unknown as T };

  beforeEach(async () => {
    if (options.mockDate) {
      jest.useFakeTimers();
      jest.setSystemTime(options.mockDate);
    }

    testState.context = contextFactory();
    
    if (options.setupFn) {
      await options.setupFn();
    }
  });

  afterEach(async () => {
    if (options.mockDate) {
      jest.useRealTimers();
    }

    if (testState.context) {
      await testState.context.cleanup();
    }

    if (options.teardownFn) {
      await options.teardownFn();
    }
  });

  return testState;
}

/**
 * Creates a mock date for testing
 * @param date Date string or Date object
 */
export function mockDate(date: string | Date): Date {
  const mockDate = typeof date === 'string' ? new Date(date) : date;
  jest.useFakeTimers();
  jest.setSystemTime(mockDate);
  return mockDate;
}

/**
 * Restores the real timer implementation
 */
export function restoreDate(): void {
  jest.useRealTimers();
} 