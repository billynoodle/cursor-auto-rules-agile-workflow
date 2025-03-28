import { AssessmentFlowController } from '../../../../client/src/controllers/AssessmentFlowController';
import { Question, QuestionModule, AssessmentState, Answer } from '../../../../client/src/types/assessment';
import { AssessmentService } from '../../../../client/src/services/AssessmentService';

describe('AssessmentFlowController', () => {
  let controller: AssessmentFlowController;
  let mockAssessmentService: AssessmentService;
  const mockUserId = 'user1';
  const mockModules: QuestionModule[] = [
    {
      id: 'mod1',
      title: 'Module 1',
      description: 'Test module for assessment flow',
      category: 'operations',
      questions: [
        { 
          id: 'q1', 
          text: 'Question 1', 
          type: 'multiple_choice',
          moduleId: 'mod1',
          weight: 1,
          options: [
            { id: 'a', text: 'Option A', value: 'a', score: 1 },
            { id: 'b', text: 'Option B', value: 'b', score: 2 },
            { id: 'c', text: 'Option C', value: 'c', score: 3 }
          ]
        },
        { 
          id: 'q2', 
          text: 'Question 2', 
          type: 'multiple_choice',
          moduleId: 'mod1',
          weight: 1,
          options: [
            { id: 'a', text: 'Option A', value: 'a', score: 1 },
            { id: 'b', text: 'Option B', value: 'b', score: 2 },
            { id: 'c', text: 'Option C', value: 'c', score: 3 }
          ]
        }
      ]
    }
  ];

  beforeEach(async () => {
    mockAssessmentService = {
      createAssessment: jest.fn().mockResolvedValue({
        id: 'test-assessment',
        user_id: mockUserId,
        current_module_id: 'mod1',
        current_question_id: 'q1',
        progress: 0,
        completed_modules: [],
        is_complete: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }),
      updateAssessment: jest.fn().mockImplementation((id, data) => {
        return Promise.resolve({
          success: true,
          ...data
        });
      }),
      saveAnswer: jest.fn().mockResolvedValue({
        id: 'ans1',
        assessment_id: 'test-assessment',
        question_id: 'q1',
        answer: { value: 'a' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }),
      getAnswers: jest.fn().mockResolvedValue([]),
      deleteAssessment: jest.fn().mockResolvedValue({ success: true })
    } as unknown as AssessmentService;

    controller = await AssessmentFlowController.create(mockModules, mockAssessmentService, mockUserId);
  });

  it('should initialize with first module and question', () => {
    const state = controller.getCurrentState();
    expect(state.currentModuleId).toBe('mod1');
    expect(state.currentQuestionId).toBe('q1');
  });

  it('should save answer and update state', async () => {
    const timestamp = new Date().toISOString();
    await controller.saveAnswer({
      questionId: 'q1',
      value: { value: 'a' },
      timestamp
    });
    const state = controller.getCurrentState();
    expect(state.answers['q1']).toEqual({ value: 'a' });
  });

  it('should move to next question', async () => {
    const timestamp = new Date().toISOString();
    await controller.saveAnswer({
      questionId: 'q1',
      value: { value: 'a' },
      timestamp
    });
    await controller.nextQuestion();
    const state = controller.getCurrentState();
    expect(state.currentQuestionId).toBe('q2');
  });

  it('should handle answer updates', async () => {
    const timestamp = new Date().toISOString();
    await controller.saveAnswer({
      questionId: 'q1',
      value: { value: 'a' },
      timestamp
    });
    await controller.saveAnswer({
      questionId: 'q1',
      value: { value: 'b' },
      timestamp
    });
    const state = controller.getCurrentState();
    expect(state.answers['q1']).toEqual({ value: 'b' });
  });

  it('should calculate progress correctly', async () => {
    const timestamp = new Date().toISOString();
    const newController = await AssessmentFlowController.create(
      [{
        id: 'mod1',
        title: 'Module 1',
        description: 'Test module for assessment flow',
        category: 'operations',
        questions: [
          { 
            id: 'q1', 
            text: 'Question 1', 
            type: 'multiple_choice',
            moduleId: 'mod1',
            weight: 1,
            options: [
              { id: 'a', text: 'Option A', value: 'a', score: 1 },
              { id: 'b', text: 'Option B', value: 'b', score: 2 },
              { id: 'c', text: 'Option C', value: 'c', score: 3 }
            ]
          },
          { 
            id: 'q2', 
            text: 'Question 2', 
            type: 'multiple_choice',
            moduleId: 'mod1',
            weight: 1,
            options: [
              { id: 'a', text: 'Option A', value: 'a', score: 1 },
              { id: 'b', text: 'Option B', value: 'b', score: 2 },
              { id: 'c', text: 'Option C', value: 'c', score: 3 }
            ]
          }
        ]
      }],
      mockAssessmentService,
      'user1'
    );

    // Answer first question
    await newController.saveAnswer({
      questionId: 'q1',
      value: { value: 'a' },
      timestamp
    });

    // Move to next question
    await newController.nextQuestion();

    // Answer second question
    await newController.saveAnswer({
      questionId: 'q2',
      value: { value: 'b' },
      timestamp
    });

    // Complete the module
    await newController.nextQuestion();

    const state = newController.getCurrentState();
    expect(state.progress).toBe(100);
  });
}); 