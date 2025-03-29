import { AssessmentFlowController } from '@client/controllers/AssessmentFlowController';
import { AssessmentService } from '@client/services/AssessmentService';
import { AssessmentStatus, QuestionType, AssessmentCategory } from '@client/types/assessment';
import { DisciplineType } from '@client/types/discipline';
import { PracticeSize } from '@client/types/practice';
import { createMockSupabaseClient } from '@__mocks__/services/supabase/client';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000001';

describe('AssessmentFlowController Initialization', () => {
  let service: AssessmentService;

  beforeEach(() => {
    service = new AssessmentService(createMockSupabaseClient());
  });

  describe('Module Validation', () => {
    it('should validate module structure', async () => {
      const validModules = [
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

      const controller = await AssessmentFlowController.create(validModules, service, TEST_USER_ID);
      expect(controller).toBeDefined();
    });

    it('should reject invalid module structure', async () => {
      const invalidModules = [
        {
          id: 'invalid',
          title: 'Invalid Module',
          description: 'Invalid module structure',
          categories: [AssessmentCategory.OPERATIONS],
          weight: 1,
          questions: []
        }
      ];

      await expect(AssessmentFlowController.create(invalidModules, service, TEST_USER_ID)).rejects.toThrow('Invalid module structure');
    });
  });
}); 