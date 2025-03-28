import { jest } from '@jest/globals';
import { OfflineService } from '@client/services/assessment/OfflineService';

export function createMockOfflineService(): jest.Mocked<OfflineService> {
  const mockOfflineService = new OfflineService();
  
  jest.spyOn(mockOfflineService, 'storeOfflineData').mockImplementation(async () => {});
  jest.spyOn(mockOfflineService, 'getOfflineData').mockReturnValue(undefined);
  jest.spyOn(mockOfflineService, 'getAllOfflineData').mockReturnValue([]);
  jest.spyOn(mockOfflineService, 'removeOfflineData').mockImplementation(async () => {});
  jest.spyOn(mockOfflineService, 'clearOfflineData').mockImplementation(async () => {});

  Object.defineProperty(mockOfflineService, 'isOnline', {
    get: jest.fn().mockReturnValue(true),
    set: jest.fn(),
    configurable: true
  });

  return mockOfflineService as jest.Mocked<OfflineService>;
} 