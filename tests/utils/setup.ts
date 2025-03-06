/**
 * Jest Setup File
 * 
 * This file is run before each test file is executed.
 * It sets up the test environment and global mocks.
 */

import * as path from 'path';
import * as fs from 'fs';

// Ensure test-results directory exists
const testResultsDir = path.join(__dirname, '../../test-results');
if (!fs.existsSync(testResultsDir)) {
  fs.mkdirSync(testResultsDir, { recursive: true });
}

// Set up global mocks if needed
// For example, if you need to mock fetch:
// global.fetch = jest.fn();

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Add any global test utilities or helpers here 