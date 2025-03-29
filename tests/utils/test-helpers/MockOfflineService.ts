import { OfflineService } from '@client/services/assessment/OfflineService';
import { Assessment, AssessmentAnswer } from '@client/types/database';

export const createMockOfflineService = (): jest.Mocked<OfflineService> => {
  const mock = {
    STORAGE_KEY: 'assessment_offline_data',
    setupOfflineSync: jest.fn(),
    storeOfflineData: jest.fn(),
    getOfflineData: jest.fn(),
    getAllOfflineData: jest.fn(),
    removeOfflineData: jest.fn(),
    clearOfflineData: jest.fn(),
    syncOfflineData: jest.fn(),
    syncAssessment: jest.fn(),
    syncAnswer: jest.fn(),
    isOnline: jest.fn().mockReturnValue(true)
  };

  return mock as unknown as jest.Mocked<OfflineService>;
};

export default createMockOfflineService; 