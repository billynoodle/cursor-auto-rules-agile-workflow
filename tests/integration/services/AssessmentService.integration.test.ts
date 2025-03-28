import { IntegrationTestUtils, setupTestEnvironment } from '../../utils/controller-test-utils';
import { AssessmentService } from '../../../client/src/services/AssessmentService';
import { generateFullMockData, createMockSupabaseClient } from '../../../__mocks__/data/assessment';
import { Assessment, AssessmentAnswer, AssessmentStatus } from '../../../client/src/types/database';

describe('AssessmentService - Integration', () => {
  setupTestEnvironment();

  let testData: ReturnType<typeof generateFullMockData>;
  let assessmentService: AssessmentService;

  beforeEach(async () => {
    const { assessmentService: service, modules } = await IntegrationTestUtils.createTestContext({
      moduleOptions: {
        moduleCount: 2,
        questionsPerModule: 2
      }
    });
    assessmentService = service;
    testData = generateFullMockData({
      moduleCount: 2,
      questionsPerModule: 2
    });
  });

  describe('Assessment Creation and Retrieval', () => {
    it('should create and retrieve an assessment', async () => {
      const assessment = await assessmentService.createAssessment({
        user_id: 'test-user',
        current_module_id: testData.modules[0].id,
        current_question_id: testData.modules[0].questions[0].id,
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft' as AssessmentStatus
      });

      expect(assessment).toBeDefined();
      expect(assessment.id).toBeDefined();

      const retrieved = await assessmentService.getAssessment(assessment.id);
      expect(retrieved).toEqual(assessment);
    });

    it('should handle assessment not found', async () => {
      await expect(
        assessmentService.getAssessment('non-existent-id')
      ).rejects.toThrow();
    });
  });

  describe('Answer Management', () => {
    it('should save and retrieve answers', async () => {
      const assessment = await assessmentService.createAssessment({
        user_id: 'test-user',
        current_module_id: testData.modules[0].id,
        current_question_id: testData.modules[0].questions[0].id,
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft' as AssessmentStatus
      });

      const answer = {
        assessment_id: assessment.id,
        question_id: testData.modules[0].questions[0].id,
        answer: { value: 'test answer' }
      };

      await assessmentService.saveAnswer(answer);
      const answers = await assessmentService.getAnswers(assessment.id);
      
      expect(answers).toHaveLength(1);
      expect(answers[0].answer).toEqual(answer.answer);
    });
  });

  describe('State Management', () => {
    it('should update assessment state', async () => {
      const assessment = await assessmentService.createAssessment({
        user_id: 'test-user',
        current_module_id: testData.modules[0].id,
        current_question_id: testData.modules[0].questions[0].id,
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft' as AssessmentStatus
      });

      const updatedState = {
        current_module_id: testData.modules[1].id,
        current_question_id: testData.modules[1].questions[0].id,
        progress: 0.5
      };

      await assessmentService.updateAssessment(assessment.id, updatedState);
      const updated = await assessmentService.getAssessment(assessment.id);

      expect(updated.current_module_id).toBe(updatedState.current_module_id);
      expect(updated.current_question_id).toBe(updatedState.current_question_id);
      expect(updated.progress).toBe(updatedState.progress);
    });
  });
}); 