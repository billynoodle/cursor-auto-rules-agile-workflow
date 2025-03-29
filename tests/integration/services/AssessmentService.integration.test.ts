import { AssessmentService } from '@client/services/AssessmentService';
import { AssessmentError } from '@client/services/assessment/AssessmentError';
import { AssessmentStatus } from '@client/types/assessment';
import { createMockSupabaseClient } from '@__mocks__/services/supabase/client';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';
const TEST_ASSESSMENT_ID = '00000000-0000-0000-0000-000000000002';

describe('AssessmentService - Integration', () => {
  let service: AssessmentService;

  beforeEach(() => {
    service = new AssessmentService(createMockSupabaseClient());
  });

  describe('Assessment Management', () => {
    it('should create and retrieve assessment', async () => {
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

      const retrieved = await service.getAssessment(TEST_ASSESSMENT_ID);
      expect(retrieved).toBeDefined();
      expect(retrieved.id).toBe(TEST_ASSESSMENT_ID);
    });
  });

  describe('Answer Management', () => {
    it('should save and retrieve answers', async () => {
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

      await service.createAssessment(assessment);

      const answer = {
        assessment_id: TEST_ASSESSMENT_ID,
        question_id: 'q1',
        answer: { value: 'test', score: 1 }
      };

      await service.saveAnswer(answer);
      const answers = await service.getAnswers(assessment.id);
      expect(answers).toBeDefined();
      expect(answers).toHaveLength(1);
      expect(answers[0].answer).toEqual(answer.answer);
    });
  });

  describe('State Management', () => {
    it('should update assessment state', async () => {
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

      await service.createAssessment(assessment);

      const updatedState = {
        current_module_id: 'module1',
        current_question_id: 'q2',
        progress: 50,
        completed_modules: ['module1'],
        is_complete: false,
        status: 'in_progress' as AssessmentStatus
      };

      const updated = await service.updateAssessment(TEST_ASSESSMENT_ID, updatedState);
      expect(updated).toBeDefined();
      expect(updated.current_module_id).toBe(updatedState.current_module_id);
      expect(updated.current_question_id).toBe(updatedState.current_question_id);
      expect(updated.progress).toBe(updatedState.progress);
    });
  });
}); 