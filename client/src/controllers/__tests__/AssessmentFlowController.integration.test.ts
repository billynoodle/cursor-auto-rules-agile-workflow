import { AssessmentFlowController } from '../AssessmentFlowController';
import { AssessmentService } from '../../services/AssessmentService';
import { SupabaseClient } from '@supabase/supabase-js';
import { DatabaseSchema } from '../../types/database';
import { QuestionModule } from '../../types/assessment';

// Mock data
const mockModules: QuestionModule[] = [
  {
    id: 'module1',
    title: 'Module 1',
    description: 'First module',
    questions: [
      {
        id: 'q1',
        text: 'Question 1',
        type: 'text'
      },
      {
        id: 'q2',
        text: 'Question 2',
        type: 'number'
      }
    ]
  },
  {
    id: 'module2',
    title: 'Module 2',
    description: 'Second module',
    questions: [
      {
        id: 'q3',
        text: 'Question 3',
        type: 'boolean'
      }
    ]
  }
];

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        is: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ 
            data: {
              id: 'assessment123',
              user_id: 'user123',
              current_module_id: 'module1',
              current_question_id: 'q1',
              progress: 0,
              completed_modules: [],
              is_complete: false,
              status: 'draft',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            error: null 
          })),
          eq: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    })),
    insert: jest.fn(() => ({
      select: jest.fn(() => ({
        single: jest.fn(() => Promise.resolve({ 
          data: {
            id: 'assessment123',
            user_id: 'user123',
            current_module_id: 'module1',
            current_question_id: 'q1',
            progress: 0,
            completed_modules: [],
            is_complete: false,
            status: 'draft',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          error: null 
        }))
      }))
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        is: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: {
                id: 'assessment123',
                user_id: 'user123',
                current_module_id: 'module1',
                current_question_id: 'q2',
                progress: 33,
                completed_modules: [],
                is_complete: false,
                status: 'in_progress',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              },
              error: null 
            }))
          }))
        }))
      }))
    }))
  })),
  rpc: jest.fn(() => Promise.resolve({ data: null, error: null }))
} as unknown as jest.Mocked<SupabaseClient<DatabaseSchema>>;

describe('AssessmentFlowController Integration', () => {
  let controller: AssessmentFlowController;
  let assessmentService: AssessmentService;

  beforeEach(() => {
    jest.clearAllMocks();
    assessmentService = new AssessmentService(mockSupabaseClient);
    controller = new AssessmentFlowController(mockModules, assessmentService, 'user123');
  });

  describe('Assessment Creation and State Management', () => {
    it('should create a new assessment on initialization', async () => {
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      expect(controller.getAssessmentId()).toBe('assessment123');
    });

    it('should load existing assessment', async () => {
      const existingController = new AssessmentFlowController(
        mockModules,
        assessmentService,
        'user123',
        'assessment123'
      );

      const state = existingController.getCurrentState();
      expect(state.currentModuleId).toBe('module1');
      expect(state.currentQuestionId).toBe('q1');
    });
  });

  describe('Navigation with Persistence', () => {
    it('should persist state when moving to next question', async () => {
      await controller.nextQuestion();
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      
      const state = controller.getCurrentState();
      expect(state.currentModuleId).toBe('module1');
      expect(state.currentQuestionId).toBe('q2');
    });

    it('should persist state when moving to next module', async () => {
      await controller.nextQuestion(); // q1 -> q2
      await controller.nextQuestion(); // q2 -> q3 (next module)

      const state = controller.getCurrentState();
      expect(state.currentModuleId).toBe('module2');
      expect(state.currentQuestionId).toBe('q3');
      expect(state.completedModules).toContain('module1');
    });

    it('should persist state when completing assessment', async () => {
      await controller.nextQuestion(); // q1 -> q2
      await controller.nextQuestion(); // q2 -> q3
      await controller.nextQuestion(); // q3 -> complete

      const state = controller.getCurrentState();
      expect(state.isComplete).toBe(true);
      expect(state.completedModules).toContain('module2');
    });
  });

  describe('Answer Management', () => {
    it('should save answer and update progress', async () => {
      await controller.saveAnswer('Test answer');

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessment_answers');
      
      const state = controller.getCurrentState();
      expect(state.answers['q1']).toBe('Test answer');
      expect(state.progress).toBe(33); // 1 out of 3 questions
    });

    it('should handle answer updates', async () => {
      await controller.saveAnswer('First answer');
      await controller.saveAnswer('Updated answer');

      const state = controller.getCurrentState();
      expect(state.answers['q1']).toBe('Updated answer');
    });
  });

  describe('State Restoration', () => {
    it('should restore and persist state', async () => {
      const newState = {
        currentModuleId: 'module2',
        currentQuestionId: 'q3',
        answers: { 'q1': 'answer1', 'q2': 42 },
        progress: 66,
        completedModules: ['module1'],
        isComplete: false
      };

      await controller.restoreState(newState);

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('assessments');
      
      const state = controller.getCurrentState();
      expect(state).toEqual(newState);
    });
  });

  describe('Error Handling', () => {
    it('should handle assessment creation failure', async () => {
      mockSupabaseClient.from = jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ 
              data: null, 
              error: new Error('Creation failed') 
            }))
          }))
        }))
      })) as any;

      await expect(async () => {
        new AssessmentFlowController(mockModules, assessmentService, 'user123');
      }).rejects.toThrow('Creation failed');
    });

    it('should handle state persistence failure', async () => {
      mockSupabaseClient.from = jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            is: jest.fn(() => ({
              select: jest.fn(() => ({
                single: jest.fn(() => Promise.resolve({ 
                  data: null, 
                  error: new Error('Update failed') 
                }))
              }))
            }))
          }))
        }))
      })) as any;

      await expect(controller.nextQuestion()).rejects.toThrow('Update failed');
    });
  });
}); 