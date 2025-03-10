import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import { cleanup } from '@testing-library/react';

// Configure testing-library
configure({ testIdAttribute: 'data-testid' });

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock CSS modules
jest.mock('*.css', () => ({})); 