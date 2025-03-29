import { jest } from '@jest/globals';
import { TestTransaction } from './test-isolation';
import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema } from '@client/types/database';
import { AssessmentService } from '@client/services/AssessmentService';
import { OfflineService } from '@client/services/assessment/OfflineService';
import { createMockSupabaseClient } from '@__mocks__/services/supabase/client';
import { createMockOfflineService } from './test-isolation';

export interface TestContext {
  mockSupabaseClient: jest.Mocked<SupabaseClient<DatabaseSchema>>;
  mockOfflineService: jest.Mocked<OfflineService>;
  assessmentService: AssessmentService;
  controller?: any;
  modules?: any[];
}

export interface TestContextOptions {
  moduleOptions?: {
    moduleCount: number;
    questionsPerModule: number;
  };
  mockBehavior?: {
    simulateError?: boolean;
    simulateOffline?: boolean;
  };
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

export const createTestContext = async (options: TestContextOptions = {}): Promise<TestContext> => {
  const mockSupabaseClient = createMockSupabaseClient();
  const mockOfflineService = createMockOfflineService();

  const assessmentService = new AssessmentService(mockSupabaseClient);

  const context: TestContext = {
    mockSupabaseClient,
    mockOfflineService,
    assessmentService
  };

  if (options.moduleOptions) {
    context.modules = createTestModules(options.moduleOptions);
    context.controller = createTestController(context);
  }

  return context;
};

function createTestModules(options: TestContextOptions['moduleOptions']) {
  const { moduleCount = 2, questionsPerModule = 2 } = options || {};
  return Array.from({ length: moduleCount }, (_, i) => ({
    id: `module${i + 1}`,
    title: `Test Module ${i + 1}`,
    questions: Array.from({ length: questionsPerModule }, (_, j) => ({
      id: `q${i + 1}-${j + 1}`,
      text: `Test Question ${j + 1} in Module ${i + 1}`,
      type: 'multiple_choice'
    }))
  }));
}

function createTestController(context: TestContext) {
  // Implementation depends on your controller class
  return {
    initialize: jest.fn(),
    navigate: jest.fn(),
    submit: jest.fn(),
    getState: jest.fn()
  };
} 