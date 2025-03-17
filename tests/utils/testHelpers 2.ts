import { render, RenderResult } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * Test Helper Functions
 * Provides utility functions and types for testing
 */

// Types
export interface TestRenderOptions {
  initialState?: any;
  route?: string;
}

// Test Data Generators
export const generateTestId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};

export const generateTestData = <T extends object>(template: T): T => {
  return { ...template };
};

// React Component Testing
export const renderWithProviders = (
  ui: ReactElement,
  options: TestRenderOptions = {}
): RenderResult => {
  const { initialState = {}, route = '/' } = options;

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <>
      {children}
    </>
  );

  return render(ui, { wrapper: Wrapper });
};

// Mock Data Helpers
export const createMockService = (methods: Record<string, jest.Mock>) => {
  return methods;
};

// Async Test Helpers
export const waitForCondition = async (
  condition: () => boolean | Promise<boolean>,
  timeout: number = 5000,
  interval: number = 100
): Promise<void> => {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error(`Condition not met within ${timeout}ms`);
};

// Test Clean Up
export const cleanupTestData = async (testIds: string[]): Promise<void> => {
  // Add cleanup logic here
};

// Error Helpers
export class TestError extends Error {
  constructor(message: string) {
    super(`Test Error: ${message}`);
    this.name = 'TestError';
  }
}

// Test Constants
export const TEST_TIMEOUT = 5000;
export const TEST_INTERVAL = 100;

// Test Fixtures
export const defaultTestUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User'
};

export const defaultTestPractice = {
  id: '1',
  name: 'Test Practice',
  type: 'PHYSIOTHERAPY'
}; 