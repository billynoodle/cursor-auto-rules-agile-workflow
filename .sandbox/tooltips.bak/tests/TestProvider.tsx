import React from 'react';

interface TestProviderProps {
  children: React.ReactNode;
}

export const TestProvider: React.FC<TestProviderProps> = ({ children }) => {
  return (
    <React.StrictMode>
      <div data-testid="test-provider">
        {children}
      </div>
    </React.StrictMode>
  );
};

export const withTestProvider = (Component: React.ComponentType<any>, props: any = {}) => {
  return (
    <TestProvider>
      <Component {...props} />
    </TestProvider>
  );
}; 