import { cleanup } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

export interface TestEnvironmentOptions {
  mockDate?: Date;
  mockLocalStorage?: Record<string, string>;
  mockSessionStorage?: Record<string, string>;
}

export const setupTestEnvironment = async (options: TestEnvironmentOptions = {}) => {
  // Mock date if provided
  if (options.mockDate) {
    jest.useFakeTimers();
    jest.setSystemTime(options.mockDate);
  }

  // Mock storage if provided
  if (options.mockLocalStorage) {
    const localStorageMock = {
      getItem: jest.fn(key => options.mockLocalStorage?.[key]),
      setItem: jest.fn(),
      clear: jest.fn(),
      removeItem: jest.fn(),
      length: Object.keys(options.mockLocalStorage || {}).length,
      key: jest.fn(index => Object.keys(options.mockLocalStorage || {})[index]),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  }

  if (options.mockSessionStorage) {
    const sessionStorageMock = {
      getItem: jest.fn(key => options.mockSessionStorage?.[key]),
      setItem: jest.fn(),
      clear: jest.fn(),
      removeItem: jest.fn(),
      length: Object.keys(options.mockSessionStorage || {}).length,
      key: jest.fn(index => Object.keys(options.mockSessionStorage || {})[index]),
    };
    Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });
  }

  // Wait for any pending promises
  await act(async () => {
    await Promise.resolve();
  });

  return {
    cleanup: async () => {
      cleanup();
      if (options.mockDate) {
        jest.useRealTimers();
      }
      jest.clearAllMocks();
      await act(async () => {
        await Promise.resolve();
      });
    },
  };
}; 