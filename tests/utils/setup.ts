/**
 * Jest Setup File
 * 
 * This file is run before each test file is executed.
 * It sets up the test environment and global mocks.
 */

import * as path from 'path';
import * as fs from 'fs';

// Ensure results directory structure exists
const resultsDir = path.join(__dirname, '../../tests/results');
const dirs = [
  path.join(resultsDir, 'coverage'),
  path.join(resultsDir, 'metrics', 'raw'),
  path.join(resultsDir, 'metrics', 'reports'),
  path.join(resultsDir, 'junit')
];

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Set up global mocks if needed
// For example, if you need to mock fetch:
// global.fetch = jest.fn();

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});

// Add any global test utilities or helpers here 