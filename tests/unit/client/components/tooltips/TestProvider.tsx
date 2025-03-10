import React from 'react';

interface TestProviderProps {
  children: React.ReactNode;
}

export const TestProvider: React.FC<TestProviderProps> = ({ children }) => {
  return (
    <div data-testid="test-provider">
      {children}
    </div>
  );
};

export const withTestProvider = (Component: React.ComponentType<any>, props: any = {}) => {
  return (
    <TestProvider>
      <Component {...props} />
    </TestProvider>
  );
}; 