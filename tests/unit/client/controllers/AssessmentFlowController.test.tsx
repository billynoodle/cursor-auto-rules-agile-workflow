import { AssessmentFlowController } from '../../../../client/src/controllers/AssessmentFlowController';
import { Question, QuestionModule, AssessmentState, Answer } from '../../../../client/src/types/assessment';
import { AssessmentService } from '../../../../client/src/services/AssessmentService';

describe('AssessmentFlowController', () => {
  let controller: AssessmentFlowController;
  let mockModules: QuestionModule[];
  let mockQuestions: Question[];
  let mockAssessmentService: AssessmentService;
  const mockUserId = 'test-user-id';

  beforeEach(() => {
    // Mock questions
    mockQuestions = [
      {
        id: 'q1',
        text: 'Question 1',
        moduleId: 'mod1',
        type: 'multiple_choice',
        options: [
          { id: 'opt1', text: 'Option A', value: 'a', score: 1 },
          { id: 'opt2', text: 'Option B', value: 'b', score: 2 }
        ],
        weight: 1
      },
      {
        id: 'q2',
        text: 'Question 2',
        moduleId: 'mod1',
        type: 'text',
        weight: 1
      }
    ];

    // Mock modules
    mockModules = [
      {
        id: 'mod1',
        title: 'Module 1',
        description: 'First module',
        questions: mockQuestions,
        category: 'financial'
      },
      {
        id: 'mod2',
        title: 'Module 2',
        description: 'Second module',
        questions: [
          {
            id: 'q3',
            text: 'Question 3',
            moduleId: 'mod2',
            type: 'text',
            weight: 1
          }
        ],
        category: 'operations'
      }
    ];

    // Mock AssessmentService
    mockAssessmentService = {
      createAssessment: jest.fn().mockResolvedValue({ 
        id: 'test-assessment-id',
        user_id: mockUserId,
        current_module_id: 'mod1',
        current_question_id: 'q1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }),
      getAssessment: jest.fn().mockResolvedValue(null),
      updateAssessment: jest.fn().mockResolvedValue({ success: true }),
      saveAnswer: jest.fn().mockResolvedValue({ 
        id: 'test-answer-id',
        assessment_id: 'test-assessment-id',
        question_id: 'q1',
        answer: { value: 'a' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }),
      getAnswers: jest.fn().mockResolvedValue([]),
      deleteAssessment: jest.fn().mockResolvedValue({ success: true })
    } as unknown as AssessmentService;

    controller = new AssessmentFlowController(mockModules, mockAssessmentService, mockUserId);
  });

  it('should initialize with first module and question', () => {
    const state = controller.getCurrentState();
    expect(state.currentModuleId).toBe('mod1');
    expect(state.currentQuestionId).toBe('q1');
  });

  it('should save answer and update state', async () => {
    const answer: Answer = { value: 'a' };
    await controller.saveAnswer(answer);
    const state = controller.getCurrentState();
    expect(state.answers['q1']).toEqual({ value: 'a' });
  });

  it('should restore state correctly', async () => {
    await controller.saveAnswer({ value: 'a' });
    const savedState = controller.getCurrentState();
    const newController = new AssessmentFlowController(mockModules, mockAssessmentService, mockUserId);
    await newController.restoreState(savedState);
    const restoredState = newController.getCurrentState();
    expect(restoredState).toEqual(savedState);
  });

  describe('navigation', () => {
    it('should move to next question', async () => {
      await controller.saveAnswer({ value: 'a' });
      await controller.nextQuestion();
      const state = controller.getCurrentState();
      expect(state.currentQuestionId).toBe('q2');
    });

    it('should move to previous question', async () => {
      await controller.saveAnswer({ value: 'test' });
      await controller.nextQuestion();
      await controller.previousQuestion();
      const state = controller.getCurrentState();
      expect(state.currentQuestionId).toBe('q1');
    });

    it('should complete module when all questions answered', async () => {
      await controller.saveAnswer({ value: 'a' });
      await controller.nextQuestion();
      await controller.saveAnswer({ value: 'test' });
      await controller.nextQuestion();
      const state = controller.getCurrentState();
      expect(state.completedModules).toContain('mod1');
    });
  });

  describe('error handling', () => {
    it('should handle invalid question id', async () => {
      // Force an invalid question ID
      const controller = new AssessmentFlowController(
        [{
          id: 'mod1',
          title: 'Module 1',
          description: 'Test module',
          category: 'operations',
          questions: []
        }],
        mockAssessmentService,
        'user1'
      );
      await expect(controller.saveAnswer({ value: 'test' })).rejects.toThrow('Assessment not initialized');
    });

    it('should handle answer updates', async () => {
      await controller.saveAnswer({ value: 'a' });
      await controller.saveAnswer({ value: 'b' });
      const state = controller.getCurrentState();
      expect(state.answers['q1']).toEqual({ value: 'b' });
    });
  });

  describe('progress tracking', () => {
    it('should calculate progress correctly', async () => {
      await controller.saveAnswer({ value: 'a' });
      const state = controller.getCurrentState();
      expect(state.progress).toBeGreaterThan(0);
    });
  });
}); 