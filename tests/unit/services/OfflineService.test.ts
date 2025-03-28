import { OfflineService } from '@client/services/assessment/OfflineService';

describe('OfflineService', () => {
  let offlineService: OfflineService;

  beforeEach(() => {
    localStorage.clear();
    offlineService = new OfflineService();
  });

  describe('storeOfflineData', () => {
    it('should store data in localStorage', () => {
      const key = 'test_key';
      const data = { id: 1, value: 'test' };
      
      offlineService.storeOfflineData(key, data);
      
      const storedData = JSON.parse(localStorage.getItem('assessment_offline_data') || '[]');
      expect(storedData).toContainEqual([key, data]);
    });

    it('should append to existing data', () => {
      const key1 = 'test_key_1';
      const data1 = { id: 1, value: 'test1' };
      const key2 = 'test_key_2';
      const data2 = { id: 2, value: 'test2' };
      
      offlineService.storeOfflineData(key1, data1);
      offlineService.storeOfflineData(key2, data2);
      
      const storedData = JSON.parse(localStorage.getItem('assessment_offline_data') || '[]');
      expect(storedData).toHaveLength(2);
      expect(storedData).toContainEqual([key1, data1]);
      expect(storedData).toContainEqual([key2, data2]);
    });
  });

  describe('getOfflineData', () => {
    it('should retrieve stored data by key', () => {
      const key = 'test_key';
      const data = { id: 1, value: 'test' };
      
      localStorage.setItem('assessment_offline_data', JSON.stringify([[key, data]]));
      
      const retrievedData = offlineService.getOfflineData(key);
      expect(retrievedData).toEqual(data);
    });

    it('should return undefined for non-existent key', () => {
      const retrievedData = offlineService.getOfflineData('non_existent');
      expect(retrievedData).toBeUndefined();
    });
  });

  describe('getAllOfflineData', () => {
    it('should retrieve all stored data', () => {
      const data = [
        ['key1', { id: 1, value: 'test1' }],
        ['key2', { id: 2, value: 'test2' }]
      ];
      
      localStorage.setItem('assessment_offline_data', JSON.stringify(data));
      
      const allData = offlineService.getAllOfflineData();
      expect(allData).toEqual(data);
    });

    it('should return empty array when no data exists', () => {
      const allData = offlineService.getAllOfflineData();
      expect(allData).toEqual([]);
    });
  });

  describe('clearOfflineData', () => {
    it('should remove all stored data', () => {
      localStorage.setItem('assessment_offline_data', JSON.stringify([['key', 'value']]));
      
      offlineService.clearOfflineData();
      
      expect(localStorage.getItem('assessment_offline_data')).toBeNull();
    });
  });

  describe('removeOfflineData', () => {
    it('should remove specific key from stored data', () => {
      const data = [
        ['key1', { id: 1, value: 'test1' }],
        ['key2', { id: 2, value: 'test2' }]
      ];
      
      localStorage.setItem('assessment_offline_data', JSON.stringify(data));
      
      offlineService.removeOfflineData('key1');
      
      const remainingData = JSON.parse(localStorage.getItem('assessment_offline_data') || '[]');
      expect(remainingData).toHaveLength(1);
      expect(remainingData).toContainEqual(['key2', { id: 2, value: 'test2' }]);
    });

    it('should handle removing non-existent key', () => {
      const data = [['key1', { id: 1, value: 'test1' }]];
      localStorage.setItem('assessment_offline_data', JSON.stringify(data));
      
      offlineService.removeOfflineData('non_existent');
      
      const remainingData = JSON.parse(localStorage.getItem('assessment_offline_data') || '[]');
      expect(remainingData).toEqual(data);
    });
  });
}); 