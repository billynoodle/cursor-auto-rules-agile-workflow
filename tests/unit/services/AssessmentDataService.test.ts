import { jest } from '@jest/globals';
import { AssessmentService, AssessmentError } from '../../../client/src/services/AssessmentService';
import { Assessment, DatabaseSchema } from '../../../client/src/types/database';
import { PostgrestError } from '@supabase/postgrest-js';
import { createIsolatedTestContext } from '../../utils/test-isolation';
import { BaseTestContext, withTestContext } from '../../utils/test-context';
import { SupabaseClient } from '@supabase/supabase-js';
import { MockFilterBuilder, MockQueryBuilder } from '../../../__mocks__/services/supabase/types';

type AssessmentRow = Assessment;
type AssessmentInsert = Omit<Assessment, 'id' | 'created_at' | 'updated_at'>;

class AssessmentTestContext extends BaseTestContext {
  service!: AssessmentService;

  async initialize(): Promise<void> {
    const { instance } = await createIsolatedTestContext<AssessmentService>(
      (client: SupabaseClient<DatabaseSchema>) => new AssessmentService(client)
    );
    if (!instance) {
      throw new Error('Failed to create AssessmentService instance');
    }
    this.service = instance;
  }
}

describe('AssessmentService', () => {
  const { context } = withTestContext(() => new AssessmentTestContext());

  beforeEach(async () => {
    await context.initialize();
  });

  describe('createAssessment', () => {
    it('should create assessment when online', async () => {
      const assessment: AssessmentInsert = {
        user_id: 'user1',
        current_module_id: 'module1',
        current_question_id: 'question1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft'
      };

      const mockResponse = {
        data: { ...assessment, id: '1', created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      };

      const { mockSupabaseClient } = await createIsolatedTestContext<AssessmentService>(
        (client: SupabaseClient<DatabaseSchema>) => context.service,
        { isOnline: true }
      );

      const queryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const filterBuilder = queryBuilder.insert(assessment) as unknown as MockFilterBuilder<'assessments'>;
      filterBuilder.single().mockResolvedValue(mockResponse);

      const result = await context.service.createAssessment(assessment);
      expect(result).toEqual(mockResponse.data);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      expect(queryBuilder.insert).toHaveBeenCalledWith(expect.objectContaining(assessment));
    });

    it('should store assessment offline when offline', async () => {
      const assessment: AssessmentInsert = {
        user_id: 'user1',
        current_module_id: 'module1',
        current_question_id: 'question1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft'
      };

      const { mockOfflineService } = await createIsolatedTestContext<AssessmentService>(
        (client: SupabaseClient<DatabaseSchema>) => context.service,
        { isOnline: false }
      );

      const offlineId = '1';
      jest.spyOn(Date, 'now').mockReturnValue(parseInt(offlineId));

      await context.service.createAssessment(assessment);
      expect(mockOfflineService.storeOfflineData).toHaveBeenCalledWith(`assessment_${offlineId}`, assessment);
    });

    it('should throw AssessmentError on database error', async () => {
      const assessment: AssessmentInsert = {
        user_id: 'user1',
        current_module_id: 'module1',
        current_question_id: 'question1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft'
      };

      const { mockSupabaseClient } = await createIsolatedTestContext<AssessmentService>(
        (client: SupabaseClient<DatabaseSchema>) => context.service,
        { isOnline: true, simulateNetworkError: true }
      );

      await expect(context.service.createAssessment(assessment))
        .rejects.toThrow(AssessmentError);
    });

    it('should throw AssessmentError when validation fails', async () => {
      const invalidAssessment = {
        user_id: 'user1',
        current_module_id: 'module1',
        current_question_id: 'question1',
        progress: -1, // Invalid progress value
        completed_modules: [],
        is_complete: false,
        status: 'invalid_status' as 'draft' | 'in_progress' | 'completed' | 'archived'
      };

      const { mockSupabaseClient } = await createIsolatedTestContext<AssessmentService>(
        (client: SupabaseClient<DatabaseSchema>) => context.service,
        { isOnline: true }
      );

      await expect(context.service.createAssessment(invalidAssessment))
        .rejects.toThrow(AssessmentError);
    });
  });

  describe('getAssessment', () => {
    it('should get assessment when online', async () => {
      const assessment: AssessmentRow = {
        id: '1',
        user_id: 'user1',
        current_module_id: 'module1',
        current_question_id: 'question1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const mockResponse = {
        data: assessment,
        error: null,
        count: null,
        status: 200,
        statusText: 'OK'
      };

      const { mockSupabaseClient } = await createIsolatedTestContext<AssessmentService>(
        (client: SupabaseClient<DatabaseSchema>) => context.service,
        { isOnline: true }
      );

      const queryBuilder = mockSupabaseClient.from('assessments') as unknown as MockQueryBuilder<'assessments'>;
      const filterBuilder = queryBuilder.select() as unknown as MockFilterBuilder<'assessments'>;
      filterBuilder.eq('id', assessment.id).single().mockResolvedValue(mockResponse);

      const result = await context.service.getAssessment(assessment.id);
      expect(result).toEqual(assessment);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      expect(queryBuilder.select).toHaveBeenCalled();
    });

    it('should throw AssessmentError when online and database error occurs', async () => {
      const { mockSupabaseClient } = await createIsolatedTestContext<AssessmentService>(
        (client: SupabaseClient<DatabaseSchema>) => context.service,
        { isOnline: true, simulateNetworkError: true }
      );

      await expect(context.service.getAssessment('1'))
        .rejects.toThrow(AssessmentError);
    });

    it('should get assessment from offline storage when offline', async () => {
      const assessment: AssessmentRow = {
        id: '1',
        user_id: 'user1',
        current_module_id: 'module1',
        current_question_id: 'question1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { mockOfflineService } = await createIsolatedTestContext<AssessmentService>(
        (client: SupabaseClient<DatabaseSchema>) => context.service,
        { isOnline: false }
      );

      mockOfflineService.getOfflineData.mockReturnValue(assessment);

      const result = await context.service.getAssessment(assessment.id);
      expect(result).toEqual(assessment);
      expect(mockOfflineService.getOfflineData).toHaveBeenCalledWith(`assessment_${assessment.id}`);
    });
  });
}); 