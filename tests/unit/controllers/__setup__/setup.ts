import { AssessmentService } from '@client/services/AssessmentService';
import { createMockSupabaseClient } from '@test/__mocks__/data/assessment';

export interface TestContext {
  service: AssessmentService;
}

export const createTestContext = (): TestContext => {
  const mockClient = createMockSupabaseClient();
  const service = new AssessmentService(mockClient);
  return { service };
};

export const setupTestEnvironment = () => {
  beforeEach(() => {
    localStorage.clear();
    Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
}; 