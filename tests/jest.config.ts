import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  roots: [
    '<rootDir>',
    '<rootDir>/../client/src',
    '<rootDir>/../server/src',
    '<rootDir>/../__mocks__'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../client/src/$1',
    '^@components/(.*)$': '<rootDir>/../client/src/components/$1',
    '^@services/(.*)$': '<rootDir>/../client/src/services/$1',
    '^@types/(.*)$': '<rootDir>/../client/src/types/$1',
    '^@utils/(.*)$': '<rootDir>/../client/src/utils/$1',
    '^@lib/(.*)$': '<rootDir>/../client/src/lib/$1',
    '^@hooks/(.*)$': '<rootDir>/../client/src/hooks/$1',
    '^@contexts/(.*)$': '<rootDir>/../client/src/contexts/$1',
    '^@pages/(.*)$': '<rootDir>/../client/src/pages/$1',
    '^@server/(.*)$': '<rootDir>/../server/src/$1',
    '^@client/(.*)$': '<rootDir>/../client/src/$1',
    '^@__mocks__/(.*)$': '<rootDir>/../__mocks__/$1',
    '^@test/(.*)$': '<rootDir>/$1',
    '^../../../../client/src/(.*)$': '<rootDir>/../client/src/$1',
    '^../../../../server/src/(.*)$': '<rootDir>/../server/src/$1',
    '^../../../client/src/(.*)$': '<rootDir>/../client/src/$1',
    '^../../../server/src/(.*)$': '<rootDir>/../server/src/$1',
    '^../../client/src/(.*)$': '<rootDir>/../client/src/$1',
    '^../../server/src/(.*)$': '<rootDir>/../server/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/fileMock.js'
  },
  testMatch: [
    '<rootDir>/unit/**/*.test.ts',
    '<rootDir>/unit/**/*.test.tsx',
    '<rootDir>/integration/**/*.integration.test.ts',
    '<rootDir>/integration/**/*.integration.test.tsx'
  ],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json'
    }]
  },
  modulePathIgnorePatterns: [
    '<rootDir>/e2e'
  ],
  collectCoverageFrom: [
    '../client/src/**/*.{ts,tsx}',
    '../server/src/**/*.{ts,tsx}',
    '!../**/*.d.ts',
    '!../**/index.{ts,tsx}',
    '!../**/*.stories.{ts,tsx}',
    '!../**/__mocks__/**',
    '!../**/node_modules/**'
  ],
  coverageDirectory: '<rootDir>/results/coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    '../client/src/services/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    '../client/src/api/': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '<rootDir>/results/junit',
      outputName: 'junit.xml',
      classNameTemplate: '{classname}',
      titleTemplate: '{title}',
      ancestorSeparator: ' › ',
      usePathForSuiteName: true,
    }],
  ],
  moduleDirectories: ['node_modules', '<rootDir>/../client/src'],
  testTimeout: 10000,
};

export default config; 