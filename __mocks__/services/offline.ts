import { OfflineService } from '@client/services/offline/OfflineService';
import { jest } from '@jest/globals';

export const createMockOfflineService = (): jest.Mocked<OfflineService> => {
  const mock = {
    isOnline: true,
    storeOfflineData: jest.fn(),
    getOfflineData: jest.fn(),
    checkConnection: jest.fn(),
    clearOfflineData: jest.fn(),
    syncOfflineData: jest.fn()
  } as jest.Mocked<OfflineService>;

  mock.checkConnection.mockResolvedValue(true);
  mock.syncOfflineData.mockResolvedValue(undefined);

  return mock;
};

export const mockOfflineService = createMockOfflineService(); 