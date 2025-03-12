import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import * as ReactDOM from 'react-dom/client';
import { createElement } from 'react';
import { act } from '@testing-library/react';

console.log('[setupTests.ts] Starting test environment setup');

// Configure testing library
configure({ testIdAttribute: 'data-testid' });
console.log('[setupTests.ts] Configured @testing-library/react');

// Create root element for React
const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

// Mock CSS modules
jest.mock('*.css', () => ({}));
console.log('[setupTests.ts] Mocked CSS modules');

// Initialize React hooks before tests
beforeAll(async () => {
  console.log('[setupTests.ts] beforeAll hook - initializing React');
  // Initialize React 18 concurrent features
  const root = ReactDOM.createRoot(rootElement);
  await act(async () => {
    root.render(createElement('div'));
  });
});

// Clean up after each test
afterEach(() => {
  console.log('[setupTests.ts] afterEach hook - clearing mocks');
  jest.clearAllMocks();
}); 