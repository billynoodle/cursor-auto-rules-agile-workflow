import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import React from 'react';

// Configure testing-library
configure({
  testIdAttribute: 'data-testid',
});

// Mock React hooks
const mockStates = new Map();
let mockStateCounter = 0;

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn((initialValue) => {
    const stateId = mockStateCounter++;
    if (!mockStates.has(stateId)) {
      mockStates.set(stateId, initialValue);
    }
    const setState = (newValue: any) => {
      mockStates.set(stateId, typeof newValue === 'function' ? newValue(mockStates.get(stateId)) : newValue);
    };
    return [mockStates.get(stateId), setState];
  }),
}));

// Reset state between tests
beforeEach(() => {
  mockStates.clear();
  mockStateCounter = 0;
}); 