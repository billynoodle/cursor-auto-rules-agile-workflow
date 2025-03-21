import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';
import { AssessmentService } from '../../../client/src/services/AssessmentService';
import { QuestionModule, AssessmentState, Answer } from '../../../client/src/types/assessment';
import { DatabaseSchema, Assessment, AssessmentAnswer } from '../../../client/src/types/database';
import { SupabaseClient } from '@supabase/supabase-js';
import { AssessmentError } from '../../../client/src/services/AssessmentService';

const TEST_USER_ID = '123e4567-e89b-12d3-a456-426614174000';
const TEST_ASSESSMENT_ID = '987fcdeb-51a2-43f8-96cd-426614174000';

interface MockOptions {
  simulateNetworkError?: boolean;
  simulateTimeout?: boolean;
  simulateConflict?: boolean;
}

const mockModules: QuestionModule[] = [
  {
    id: 'module1',
    title: 'Module 1',
    description: 'First module',
    category: 'operations',
    questions: [
      {
        id: 'q1',
        text: 'Question 1',
        type: 'text',
        moduleId: 'module1',
        weight: 1
      },
      {
        id: 'q2',
        text: 'Question 2',
        type: 'numeric',
        moduleId: 'module1',
        weight: 1
      }
    ]
  },
  {
    id: 'module2',
    title: 'Module 2',
    description: 'Second module',
    category: 'operations',
    questions: [
      {
        id: 'q3',
        text: 'Question 3',
        type: 'boolean',
        moduleId: 'module2',
        weight: 1
      }
    ]
  }
];

const createMockAnswer = (value: any): Answer => ({ value });

const createMockAssessment = (overrides: Partial<Assessment> = {}): Assessment => ({
  id: TEST_ASSESSMENT_ID,
  user_id: TEST_USER_ID,
  current_module_id: 'module1',
  current_question_id: 'q1',
  progress: 0,
  completed_modules: [],
  is_complete: false,
  status: 'draft',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

const createMockAnswerData = (overrides: Partial<AssessmentAnswer> = {}): AssessmentAnswer => ({
  id: '456',
  assessment_id: TEST_ASSESSMENT_ID,
  question_id: 'q1',
  answer: { value: 'Test answer' },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides
});

const createMockSupabaseClient = (options: MockOptions = {}) => {
  const mockClient = {
    from: jest.fn((table: string) => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          is: jest.fn(() => ({
            single: jest.fn(async () => {
              if (options.simulateNetworkError) {
                return { data: null, error: new Error('Network error') };
              }
              if (options.simulateTimeout) {
                return { data: null, error: new Error('Timeout') };
              }
              return Promise.resolve({ 
                data: createMockAssessment(),
                error: null 
              });
            })
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(async () => {
            if (options.simulateNetworkError) {
              return { data: null, error: new Error('Network error') };
            }
            if (options.simulateTimeout) {
              return { data: null, error: new Error('Timeout') };
            }
            return Promise.resolve({ 
              data: createMockAssessment(),
              error: null 
            });
          })
        }))
      })),
      upsert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(async () => {
            if (options.simulateConflict) {
              return { data: null, error: new Error('Conflict: Assessment was updated by another session') };
            }
            if (options.simulateNetworkError) {
              return { data: null, error: new Error('Network error') };
            }
            if (options.simulateTimeout) {
              return { data: null, error: new Error('Timeout') };
            }
            return Promise.resolve({ 
              data: createMockAnswerData(),
              error: null 
            });
          })
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          is: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(async () => {
                if (options.simulateConflict) {
                  return { data: null, error: new Error('Conflict: Assessment was updated by another session') };
                }
                if (options.simulateNetworkError) {
                  return { data: null, error: new Error('Network error') };
                }
                if (options.simulateTimeout) {
                  return { data: null, error: new Error('Timeout') };
                }
                return Promise.resolve({ 
                  data: createMockAssessment({
                    current_module_id: 'module1',
                    current_question_id: 'q2',
                    progress: 33,
                    status: 'in_progress'
                  }),
                  error: null 
                });
              })
            }))
          }))
        }))
      }))
    })),
    rpc: jest.fn(() => Promise.resolve({ data: null, error: null }))
  };

  return mockClient as unknown as jest.Mocked<SupabaseClient<DatabaseSchema>>;
};

describe('AssessmentFlowController', () => {
  let mockSupabaseClient: jest.Mocked<SupabaseClient<DatabaseSchema>>;
  let assessmentService: AssessmentService;
  let controller: AssessmentFlowController;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabaseClient = createMockSupabaseClient();
    assessmentService = new AssessmentService(mockSupabaseClient);
  });

  describe('Initialization', () => {
    it('should create a new assessment and initialize state', async () => {
      controller = await AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID);
      expect(controller.getCurrentState()).toEqual({
        currentModuleId: 'module1',
        currentQuestionId: 'q1',
        answers: {},
        progress: 0,
        completedModules: [],
        isComplete: false
      });
    });

    it('should handle network errors during assessment creation', async () => {
      mockSupabaseClient = createMockSupabaseClient({ simulateNetworkError: true });
      assessmentService = new AssessmentService(mockSupabaseClient);
      
      await expect(
        AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID)
      ).rejects.toThrow(AssessmentError);
      await expect(
        AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID)
      ).rejects.toMatchObject({
        code: 'CREATE_ERROR',
        originalError: expect.objectContaining({
          code: 'DB_ERROR',
          originalError: expect.objectContaining({
            message: expect.stringContaining('Network error')
          })
        })
      });
    });

    it('should handle timeouts during assessment creation', async () => {
      mockSupabaseClient = createMockSupabaseClient({ simulateTimeout: true });
      assessmentService = new AssessmentService(mockSupabaseClient);
      
      await expect(
        AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID)
      ).rejects.toThrow(AssessmentError);
      await expect(
        AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID)
      ).rejects.toMatchObject({
        code: 'CREATE_ERROR',
        originalError: expect.objectContaining({
          code: 'DB_ERROR',
          originalError: expect.objectContaining({
            message: expect.stringContaining('Timeout')
          })
        })
      });
    });
  });

  describe('State Management', () => {
    beforeEach(async () => {
      controller = await AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID);
    });

    it('should persist state when moving to next question', async () => {
      await controller.nextQuestion();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      
      const state = controller.getCurrentState();
      expect(state.currentModuleId).toBe('module1');
      expect(state.currentQuestionId).toBe('q2');
    });

    it('should save and persist answers', async () => {
      const timestamp = new Date().toISOString();
      const answer = createMockAnswerData();
      await controller.saveAnswer({
        questionId: answer.question_id,
        value: answer.answer,
        timestamp
      });

      const state = controller.getCurrentState();
      expect(state.answers[answer.question_id]).toEqual(answer.answer);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessment_answers');
    });

    it('should handle answer updates', async () => {
      const timestamp = new Date().toISOString();
      const firstAnswer = createMockAnswerData({ answer: { value: 'First answer' } });
      const updatedAnswer = createMockAnswerData({ answer: { value: 'Updated answer' } });

      await controller.saveAnswer({
        questionId: firstAnswer.question_id,
        value: firstAnswer.answer,
        timestamp
      });
      await controller.saveAnswer({
        questionId: updatedAnswer.question_id,
        value: updatedAnswer.answer,
        timestamp
      });

      const state = controller.getCurrentState();
      expect(state.answers[updatedAnswer.question_id]).toEqual(updatedAnswer.answer);
    });
  });

  describe('Error Recovery', () => {
    beforeEach(async () => {
      mockSupabaseClient = createMockSupabaseClient();
      assessmentService = new AssessmentService(mockSupabaseClient);
      controller = await AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID);
    });

    it('should handle network errors during state persistence', async () => {
      mockSupabaseClient = createMockSupabaseClient({ simulateNetworkError: true });
      assessmentService = new AssessmentService(mockSupabaseClient);
      controller.updateService(assessmentService);

      await expect(controller.nextQuestion()).rejects.toThrow(AssessmentError);
      await expect(controller.nextQuestion()).rejects.toMatchObject({
        code: 'UPDATE_FAILED',
        originalError: expect.objectContaining({
          message: expect.stringContaining('Network error')
        })
      });
      expect(controller.getCurrentState().currentQuestionId).toBe('q1');
    });

    it('should handle concurrent update conflicts', async () => {
      mockSupabaseClient = createMockSupabaseClient({ simulateConflict: true });
      assessmentService = new AssessmentService(mockSupabaseClient);
      controller.updateService(assessmentService);

      const timestamp = new Date().toISOString();
      const answer = createMockAnswerData();
      await expect(controller.saveAnswer({
        questionId: answer.question_id,
        value: answer.answer,
        timestamp
      })).rejects.toThrow(AssessmentError);
      await expect(controller.saveAnswer({
        questionId: answer.question_id,
        value: answer.answer,
        timestamp
      })).rejects.toMatchObject({
        code: 'SAVE_ERROR',
        originalError: expect.objectContaining({
          message: expect.stringContaining('conflict')
        })
      });

      expect(controller.getCurrentState().answers).toEqual({});
    });
  });

  describe('State Restoration', () => {
    beforeEach(async () => {
      controller = await AssessmentFlowController.create(mockModules, assessmentService, TEST_USER_ID);
    });

    it('should restore and persist state', async () => {
      const newState: AssessmentState = {
        currentModuleId: 'module2',
        currentQuestionId: 'q3',
        answers: {
          'q1': createMockAnswer('answer1'),
          'q2': createMockAnswer(42)
        },
        progress: 66,
        completedModules: ['module1'],
        isComplete: false
      };

      await controller.restoreState(newState);
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      expect(controller.getCurrentState()).toEqual(newState);
    });
  });
}); 