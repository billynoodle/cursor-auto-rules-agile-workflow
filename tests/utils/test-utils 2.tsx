import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import '@testing-library/jest-dom';

console.log('[test-utils.tsx] Initializing test utilities');
console.log('[test-utils.tsx] React version:', React.version);
console.log('[test-utils.tsx] useState available:', !!React.useState);

interface AllTheProvidersProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[test-utils.tsx] Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children;
  }
}

// Create a wrapper component that provides React context
const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  console.log('[test-utils.tsx] AllTheProviders rendering');
  try {
    return (
      <ErrorBoundary>
        <React.StrictMode>
          {children}
        </React.StrictMode>
      </ErrorBoundary>
    );
  } catch (error) {
    console.error('[test-utils.tsx] Error in AllTheProviders:', error);
    throw error;
  }
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  console.log('[test-utils.tsx] customRender called with:', {
    componentType: typeof ui.type === 'function' ? ui.type.name || 'Anonymous' : String(ui.type),
    hasOptions: !!options
  });

  try {
    return render(ui, { 
      wrapper: AllTheProviders,
      ...options
    });
  } catch (error) {
    console.error('[test-utils.tsx] Error in customRender:', error);
    throw error;
  }
};

// Cleanup after each test
afterEach(() => {
  console.log('[test-utils.tsx] afterEach cleanup');
  jest.clearAllMocks();
});

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render }; 