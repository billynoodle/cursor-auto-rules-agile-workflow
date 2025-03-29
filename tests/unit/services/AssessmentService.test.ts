import { AssessmentService } from '@client/services/AssessmentService';
import { AssessmentError } from '@client/services/assessment/AssessmentError';
import { AssessmentStatus } from '@client/types/assessment';
import { createMockSupabaseClient } from '@__mocks__/services/supabase/client';

const TEST_ASSESSMENT_ID = '00000000-0000-0000-0000-000000000002';
const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

describe('AssessmentService', () => {
  let service: AssessmentService;

  beforeEach(() => {
    service = new AssessmentService(createMockSupabaseClient());
  });

  describe('createAssessment', () => {
    it('should create a new assessment', async () => {
      const assessment = {
        id: TEST_ASSESSMENT_ID,
        user_id: TEST_USER_ID,
        status: 'draft' as AssessmentStatus,
        current_module_id: 'module1',
        current_question_id: 'q1',
        completed_modules: [],
        progress: 0,
        is_complete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const result = await service.createAssessment(assessment);
      expect(result).toBeDefined();
      expect(result.id).toBe(TEST_ASSESSMENT_ID);
    });

    it('should handle creation errors', async () => {
      service = new AssessmentService(createMockSupabaseClient({ simulateError: new Error('Failed to create') }));

      await expect(service.createAssessment({
        user_id: TEST_USER_ID,
        current_module_id: 'module1',
        current_question_id: 'q1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft',
        metadata: {}
      })).rejects.toThrow(AssessmentError);
    });
  });

  describe('getAssessment', () => {
    it('should get an assessment by id', async () => {
      const result = await service.getAssessment(TEST_ASSESSMENT_ID);
      expect(result).toBeDefined();
      expect(result.id).toBe(TEST_ASSESSMENT_ID);
    });

    it('should handle not found errors', async () => {
      service = new AssessmentService(createMockSupabaseClient({ simulateError: new Error('Assessment not found') }));
      await expect(service.getAssessment('not-found')).rejects.toThrow(AssessmentError);
    });
  });

  describe('updateAssessment', () => {
    it('should update an assessment', async () => {
      const updates = {
        current_module_id: 'module2',
        current_question_id: 'q2',
        completed_modules: ['module1'],
        progress: 50,
        is_complete: false,
        status: 'in_progress' as AssessmentStatus
      };

      const result = await service.updateAssessment(TEST_ASSESSMENT_ID, updates);
      expect(result).toBeDefined();
      expect(result.id).toBe(TEST_ASSESSMENT_ID);
    });

    it('should handle update errors', async () => {
      service = new AssessmentService(createMockSupabaseClient({ simulateError: new Error('Update failed') }));
      await expect(service.updateAssessment(TEST_ASSESSMENT_ID, {
        current_module_id: 'module2'
      })).rejects.toThrow(AssessmentError);
    });
  });

  describe('getAnswers', () => {
    it('should get answers for an assessment', async () => {
      const result = await service.getAnswers(TEST_ASSESSMENT_ID);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle errors when getting answers', async () => {
      service = new AssessmentService(createMockSupabaseClient({ simulateError: new Error('Failed to get answers') }));
      await expect(service.getAnswers(TEST_ASSESSMENT_ID)).rejects.toThrow(AssessmentError);
    });
  });
});