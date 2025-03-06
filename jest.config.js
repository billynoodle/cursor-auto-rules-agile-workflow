/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: [
    '<rootDir>/tests',
  ],
  testMatch: [
    '**/?(*.)+(spec|test).ts?(x)'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/server/src/$1',
    '^@client/(.*)$': '<rootDir>/client/src/$1'
  },
  collectCoverage: true,
  coverageDirectory: 'test-results/coverage',
  collectCoverageFrom: [
    'server/src/**/*.ts',
    'client/src/**/*.ts?(x)',
    '!**/node_modules/**',
    '!**/*.d.ts'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/tests/utils/setup.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  }
}; 