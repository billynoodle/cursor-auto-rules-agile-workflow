import { AssessmentFlowController } from '../../../../client/src/controllers/AssessmentFlowController';
import { Question, QuestionModule, AssessmentState } from '../../../../client/src/types/assessment';

describe('AssessmentFlowController', () => {
  let controller: AssessmentFlowController;
  let mockModules: QuestionModule[];
  let mockQuestions: Question[];

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
        questions: [],
        category: 'operations'
      }
    ];

    controller = new AssessmentFlowController(mockModules);
  });

  describe('State Management', () => {
    it('should initialize with the first question of the first module', () => {
      const state = controller.getCurrentState();
      expect(state.currentModuleId).toBe('mod1');
      expect(state.currentQuestionId).toBe('q1');
      expect(state.answers).toEqual({});
      expect(state.progress).toBe(0);
    });

    it('should save and restore state correctly', () => {
      const answer = { questionId: 'q1', value: 'a' };
      controller.saveAnswer(answer);
      
      const savedState = controller.getCurrentState();
      const newController = new AssessmentFlowController(mockModules);
      newController.restoreState(savedState);
      
      expect(newController.getCurrentState()).toEqual(savedState);
    });
  });

  describe('Navigation', () => {
    it('should move to next question within module', () => {
      controller.nextQuestion();
      const state = controller.getCurrentState();
      expect(state.currentQuestionId).toBe('q2');
      expect(state.currentModuleId).toBe('mod1');
    });

    it('should move to previous question within module', () => {
      controller.nextQuestion();
      controller.previousQuestion();
      const state = controller.getCurrentState();
      expect(state.currentQuestionId).toBe('q1');
      expect(state.currentModuleId).toBe('mod1');
    });

    it('should move to next module when reaching end of current module', () => {
      controller.nextQuestion(); // to q2
      controller.nextQuestion(); // should move to mod2
      const state = controller.getCurrentState();
      expect(state.currentModuleId).toBe('mod2');
    });

    it('should not move past the last question of the last module', () => {
      controller.nextQuestion(); // to q2
      controller.nextQuestion(); // to mod2
      controller.nextQuestion(); // should stay at mod2
      const state = controller.getCurrentState();
      expect(state.currentModuleId).toBe('mod2');
      expect(state.isComplete).toBe(true);
    });
  });

  describe('Progress Tracking', () => {
    it('should calculate progress correctly', () => {
      controller.saveAnswer({ questionId: 'q1', value: 'a' });
      let progress = controller.getCurrentState().progress;
      expect(progress).toBe(50); // 1/2 questions answered

      controller.saveAnswer({ questionId: 'q2', value: 'test' });
      progress = controller.getCurrentState().progress;
      expect(progress).toBe(100); // 2/2 questions answered
    });

    it('should mark module as complete when all questions are answered', () => {
      controller.saveAnswer({ questionId: 'q1', value: 'a' });
      controller.saveAnswer({ questionId: 'q2', value: 'test' });
      const state = controller.getCurrentState();
      expect(state.completedModules).toContain('mod1');
    });
  });

  describe('Answer Management', () => {
    it('should save and retrieve answers correctly', () => {
      const answer = { questionId: 'q1', value: 'a' };
      controller.saveAnswer(answer);
      const state = controller.getCurrentState();
      expect(state.answers['q1']).toBe('a');
    });

    it('should update existing answers', () => {
      controller.saveAnswer({ questionId: 'q1', value: 'a' });
      controller.saveAnswer({ questionId: 'q1', value: 'b' });
      const state = controller.getCurrentState();
      expect(state.answers['q1']).toBe('b');
    });

    it('should validate answers before saving', () => {
      expect(() => {
        controller.saveAnswer({ questionId: 'invalid', value: 'test' });
      }).toThrow('Invalid question ID');
    });
  });

  describe('Event Handling', () => {
    it('should notify subscribers of state changes', () => {
      const mockSubscriber = jest.fn();
      controller.subscribe(mockSubscriber);
      
      controller.saveAnswer({ questionId: 'q1', value: 'a' });
      expect(mockSubscriber).toHaveBeenCalled();
      
      const lastCall = mockSubscriber.mock.calls[mockSubscriber.mock.calls.length - 1][0];
      expect(lastCall.answers['q1']).toBe('a');
    });

    it('should allow unsubscribing from state changes', () => {
      const mockSubscriber = jest.fn();
      const unsubscribe = controller.subscribe(mockSubscriber);
      
      unsubscribe();
      controller.saveAnswer({ questionId: 'q1', value: 'a' });
      expect(mockSubscriber).not.toHaveBeenCalled();
    });
  });
}); 