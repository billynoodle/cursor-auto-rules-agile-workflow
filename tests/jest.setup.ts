import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Setup global mocks
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Extend Jest matchers
expect.extend({
  toHaveBeenCalledExactlyOnceWith(received: jest.Mock, ...args: any[]) {
    const pass = received.mock.calls.length === 1 &&
      JSON.stringify(received.mock.calls[0]) === JSON.stringify(args);
    
    return {
      pass,
      message: () =>
        pass
          ? `Expected mock not to have been called exactly once with ${args}`
          : `Expected mock to have been called exactly once with ${args}`,
    };
  },
});

// Global test setup
beforeAll(() => {
  // Add any global setup here
});

// Global test teardown
afterAll(() => {
  // Add any global teardown here
});

// Reset mocks between tests
beforeEach(() => {
  jest.resetAllMocks();
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
}); 