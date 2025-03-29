import { AssessmentFlowController } from '@client/controllers/AssessmentFlowController';
import { AssessmentService } from '@client/services/AssessmentService';
import { AssessmentStatus, QuestionType, AssessmentCategory, Answer } from '@client/types/assessment';
import { DisciplineType } from '@client/types/discipline';
import { PracticeSize } from '@client/types/practice';
import { createMockSupabaseClient } from '@__mocks__/services/supabase/client';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

describe('AssessmentFlowController Progress', () => {
  let service: AssessmentService;
  let controller: AssessmentFlowController;

  const mockModules = [
    {
      id: 'module1',
      title: 'Module 1',
      description: 'First module',
      categories: [AssessmentCategory.OPERATIONS],
      weight: 1,
      questions: [
        {
          id: 'q1',
          text: 'Question 1',
          type: QuestionType.MULTIPLE_CHOICE,
          category: AssessmentCategory.OPERATIONS,
          moduleId: 'module1',
          applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
          universalQuestion: true,
          applicablePracticeSizes: [PracticeSize.SMALL, PracticeSize.MEDIUM],
          required: true,
          weight: 1,
          dependencies: [],
          options: [
            { id: 'opt1', value: 'option1', text: 'Option 1', score: 1 },
            { id: 'opt2', value: 'option2', text: 'Option 2', score: 2 }
          ]
        }
      ]
    }
  ];

  beforeEach(async () => {
    service = new AssessmentService(createMockSupabaseClient());
    controller = await AssessmentFlowController.create(mockModules, service, TEST_USER_ID);
  });

  describe('Progress Calculation', () => {
    it('should calculate progress correctly', async () => {
      await controller.saveAnswer({
        questionId: 'q1',
        value: { value: 'option1' } as Answer,
        timestamp: new Date().toISOString()
      });

      const state = controller.getState();
      expect(state.progress).toBe(100);
    });

    it('should update progress when answers are modified', async () => {
      await controller.saveAnswer({
        questionId: 'q1',
        value: { value: 'option1' } as Answer,
        timestamp: new Date().toISOString()
      });

      await controller.saveAnswer({
        questionId: 'q1',
        value: { value: 'option2' } as Answer,
        timestamp: new Date().toISOString()
      });

      const state = controller.getState();
      expect(state.progress).toBe(100);
    });
  });

  describe('Module Completion', () => {
    it('should mark module as completed when all questions are answered', async () => {
      await controller.saveAnswer({
        questionId: 'q1',
        value: { value: 'option1' } as Answer,
        timestamp: new Date().toISOString()
      });

      const state = controller.getState();
      expect(state.completedModules).toContain('module1');
    });

    it('should handle progress calculation with unanswered questions', async () => {
      const state = controller.getState();
      expect(state.progress).toBe(0);
      expect(state.completedModules).not.toContain('module1');
    });
  });
}); 