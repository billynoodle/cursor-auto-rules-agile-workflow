import { jest } from '@jest/globals';
import { AssessmentDataService } from '../../../../client/src/services/assessment/AssessmentDataService';
import { AssessmentError } from '../../../../client/src/services/assessment/AssessmentError';
import { createMockSupabaseClient } from '../../../__mocks__/services/supabase';
import { createMockOfflineService } from '../../../__mocks__/services/offline';
import { SupabaseClient } from '@supabase/supabase-js';
import { OfflineService } from '../../../../client/src/services/assessment/OfflineService';
import { DatabaseSchema } from '../../../../client/src/types/database';
import { MockFilterBuilder, MockQueryBuilder } from '../../../__mocks__/services/supabase/types';
import { PostgrestError } from '@supabase/postgrest-js';

type AssessmentRow = DatabaseSchema['public']['Tables']['assessments']['Row'];
type AssessmentInsert = DatabaseSchema['public']['Tables']['assessments']['Insert'];
type AssessmentUpdate = DatabaseSchema['public']['Tables']['assessments']['Update'];

const generateMockAssessment = (): AssessmentRow => ({
  id: '1',
  user_id: 'user1',
  current_module_id: 'module1',
  progress: 50,
  completed_modules: ['module1'],
  is_complete: true,
  status: 'completed',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

describe('AssessmentDataService', () => {
  let mockSupabaseClient: jest.Mocked<SupabaseClient<DatabaseSchema>>;
  let mockOfflineService: OfflineService;
  let service: AssessmentDataService;

  beforeEach(() => {
    mockSupabaseClient = createMockSupabaseClient();
    mockOfflineService = createMockOfflineService();
    service = new AssessmentDataService(mockSupabaseClient, mockOfflineService);
  });

  describe('createAssessment', () => {
    it('should create assessment when online', async () => {
      const assessment: AssessmentInsert = {
        user_id: 'user1',
        current_module_id: 'module1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'in_progress'
      };
      mockOfflineService.isOnline = true;

      const mockResponse = {
        data: { ...assessment, id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      };

      const queryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const filterBuilder = queryBuilder.insert(assessment) as unknown as MockFilterBuilder<'assessments'>;
      filterBuilder.single().mockResolvedValue(mockResponse);

      const result = await service.createAssessment(assessment);
      expect(result).toEqual(mockResponse.data);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      expect(queryBuilder.insert).toHaveBeenCalledWith(assessment);
    });

    it('should store assessment offline when offline', async () => {
      const assessment: AssessmentInsert = {
        user_id: 'user1',
        current_module_id: 'module1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'in_progress'
      };
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });

      const offlineId = '1';
      jest.spyOn(Date, 'now').mockReturnValue(parseInt(offlineId));

      await service.createAssessment(assessment);
      expect(mockOfflineService.storeOfflineData).toHaveBeenCalledWith(`assessment_${offlineId}`, assessment);
    });

    it('should throw AssessmentError on database error', async () => {
      const assessment: AssessmentInsert = {
        user_id: 'user1',
        current_module_id: 'module1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'in_progress'
      };
      mockOfflineService.isOnline = true;

      const mockQueryBuilder = mockSupabaseClient.from('assessments');
      jest.spyOn(mockQueryBuilder, 'insert').mockReturnValue({
        single: () => Promise.resolve({ 
          data: null, 
          error: { message: 'Database error', code: 'DB_ERROR' } as PostgrestError,
          count: null,
          status: 400,
          statusText: 'Error'
        })
      } as any);

      await expect(service.createAssessment(assessment))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when validation fails', async () => {
      const invalidAssessment = {
        // Missing required fields
      };
      mockOfflineService.isOnline = true;

      await expect(service.createAssessment(invalidAssessment))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when offline and validation fails', async () => {
      const invalidAssessment = {
        // Missing required fields
      };
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });

      await expect(service.createAssessment(invalidAssessment))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when database error occurs', async () => {
      const assessment = generateMockAssessment();
      mockOfflineService.isOnline = true;
      const error = { message: 'Database error', code: 'DB_ERROR' } as PostgrestError;
      const queryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const filterBuilder = queryBuilder.insert(assessment) as unknown as MockFilterBuilder<'assessments'>;
      filterBuilder.single().mockRejectedValue(error);

      await expect(service.createAssessment(assessment))
        .rejects.toThrow(AssessmentError);
    });
  });

  describe('getAssessment', () => {
    it('should get assessment when online', async () => {
      const assessment: AssessmentRow = {
        id: '1',
        user_id: 'user1',
        current_module_id: 'module1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'in_progress',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockOfflineService.isOnline = true;

      const mockResponse = {
        data: assessment,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      };

      const queryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const filterBuilder = queryBuilder.select().eq('id', assessment.id) as unknown as MockFilterBuilder<'assessments'>;
      filterBuilder.single().mockResolvedValue(mockResponse);

      const result = await service.getAssessment(assessment.id);
      expect(result).toEqual(assessment);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      expect(queryBuilder.select).toHaveBeenCalled();
      expect(filterBuilder.eq).toHaveBeenCalledWith('id', assessment.id);
    });

    it('should throw AssessmentError when online and database error occurs', async () => {
      mockOfflineService.isOnline = true;
      const error = { message: 'Database error', code: 'DB_ERROR' } as PostgrestError;
      const queryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const filterBuilder = queryBuilder.select().eq('id', '1') as unknown as MockFilterBuilder<'assessments'>;
      filterBuilder.single().mockRejectedValue(error);

      await expect(service.getAssessment('1'))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when online and assessment not found', async () => {
      mockOfflineService.isOnline = true;
      const queryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const filterBuilder = queryBuilder.select().eq('id', '1') as unknown as MockFilterBuilder<'assessments'>;
      filterBuilder.single().mockResolvedValue({ 
        data: null, 
        error: { message: 'Not found', code: 'NOT_FOUND' } as PostgrestError,
        count: null,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(service.getAssessment('1'))
        .rejects.toThrow(AssessmentError);
    });

    it('should get assessment from offline storage when offline', async () => {
      const assessment: AssessmentRow = {
        id: '1',
        user_id: 'user1',
        current_module_id: 'module1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'in_progress',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });
      jest.spyOn(mockOfflineService, 'getOfflineData').mockReturnValue(assessment);

      const result = await service.getAssessment(assessment.id);
      expect(result).toEqual(assessment);
      expect(mockOfflineService.getOfflineData).toHaveBeenCalledWith(`assessment_${assessment.id}`);
    });

    it('should throw AssessmentError when offline and assessment not found', async () => {
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });
      jest.spyOn(mockOfflineService, 'getOfflineData').mockReturnValue(null);

      await expect(service.getAssessment('1'))
        .rejects.toThrow(AssessmentError);
    });
  });

  describe('updateAssessment', () => {
    it('should update assessment when online', async () => {
      const assessment: AssessmentRow = {
        id: '1',
        user_id: 'user1',
        current_module_id: 'module1',
        progress: 50,
        completed_modules: ['module1'],
        is_complete: true,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockOfflineService.isOnline = true;

      // Mock getAssessment response
      const getQueryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const getFilterBuilder = getQueryBuilder.select().eq('id', assessment.id) as unknown as MockFilterBuilder<'assessments'>;
      getFilterBuilder.single().mockResolvedValue({
        data: assessment,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      });

      // Mock update response
      const updateQueryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const updateFilterBuilder = updateQueryBuilder.update(assessment).eq('id', assessment.id) as unknown as MockFilterBuilder<'assessments'>;
      updateFilterBuilder.single().mockResolvedValue({
        data: assessment,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      });

      const result = await service.updateAssessment(assessment.id, assessment);
      expect(result).toEqual(assessment);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      expect(updateQueryBuilder.update).toHaveBeenCalledWith(assessment);
      expect(updateFilterBuilder.eq).toHaveBeenCalledWith('id', assessment.id);
    });

    it('should throw AssessmentError when online and database error occurs', async () => {
      const assessment = generateMockAssessment();
      mockOfflineService.isOnline = true;
      const error = { message: 'Database error', code: 'DB_ERROR' } as PostgrestError;
      const queryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const filterBuilder = queryBuilder.update(assessment).eq('id', assessment.id) as unknown as MockFilterBuilder<'assessments'>;
      filterBuilder.single().mockRejectedValue(error);

      await expect(service.updateAssessment(assessment.id, assessment))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when online and update returns no data', async () => {
      const assessment: AssessmentRow = {
        id: '1',
        user_id: 'user1',
        current_module_id: 'module1',
        progress: 50,
        completed_modules: ['module1'],
        is_complete: true,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      mockOfflineService.isOnline = true;

      // Mock getAssessment response
      const getQueryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const getFilterBuilder = getQueryBuilder.select().eq('id', assessment.id) as unknown as MockFilterBuilder<'assessments'>;
      getFilterBuilder.single().mockResolvedValue({
        data: assessment,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      });

      // Mock update with no data
      const updateQueryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const updateFilterBuilder = updateQueryBuilder.update(assessment).eq('id', assessment.id) as unknown as MockFilterBuilder<'assessments'>;
      updateFilterBuilder.single().mockResolvedValue({
        data: null,
        error: { message: 'Not found', code: 'NOT_FOUND' } as PostgrestError,
        count: null,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(service.updateAssessment(assessment.id, assessment))
        .rejects.toThrow(AssessmentError);
    });

    it('should store assessment offline when offline', async () => {
      const assessment: AssessmentRow = {
        id: '1',
        user_id: 'user1',
        current_module_id: 'module1',
        progress: 50,
        completed_modules: ['module1'],
        is_complete: true,
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });
      jest.spyOn(mockOfflineService, 'getOfflineData').mockReturnValue(assessment);

      await service.updateAssessment(assessment.id, assessment);
      expect(mockOfflineService.storeOfflineData).toHaveBeenCalledWith(`assessment_${assessment.id}`, assessment);
    });

    it('should throw AssessmentError when validation fails', async () => {
      const invalidAssessment = {
        // Missing required fields
      };
      mockOfflineService.isOnline = true;

      await expect(service.updateAssessment('1', invalidAssessment))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when offline and validation fails', async () => {
      const invalidAssessment = {
        // Missing required fields
      };
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });

      await expect(service.updateAssessment('1', invalidAssessment))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when offline and assessment not found', async () => {
      const assessment: AssessmentUpdate = {
        progress: 50,
        completed_modules: ['module1'],
        is_complete: true,
        status: 'completed'
      };
      Object.defineProperty(mockOfflineService, 'isOnline', {
        get: jest.fn().mockReturnValue(false),
        configurable: true
      });
      jest.spyOn(mockOfflineService, 'getOfflineData').mockReturnValue(null);

      await expect(service.updateAssessment('1', assessment))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when no data returned after update', async () => {
      const assessment = generateMockAssessment();
      mockOfflineService.isOnline = true;
      const queryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const filterBuilder = queryBuilder.update(assessment).eq('id', assessment.id) as unknown as MockFilterBuilder<'assessments'>;
      filterBuilder.single().mockResolvedValue({ 
        data: null, 
        error: { message: 'No data returned', code: 'NO_DATA' } as PostgrestError,
        count: null,
        status: 200,
        statusText: 'OK'
      });

      await expect(service.updateAssessment(assessment.id, assessment))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when online and assessment not found', async () => {
      const assessment = generateMockAssessment();
      mockOfflineService.isOnline = true;
      const queryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const filterBuilder = queryBuilder.update(assessment).eq('id', assessment.id) as unknown as MockFilterBuilder<'assessments'>;
      filterBuilder.single().mockResolvedValue({ 
        data: null, 
        error: { message: 'Assessment not found', code: 'NOT_FOUND' } as PostgrestError,
        count: null,
        status: 404,
        statusText: 'Not Found'
      });

      await expect(service.updateAssessment(assessment.id, assessment))
        .rejects.toThrow(AssessmentError);
    });
  });
}); 