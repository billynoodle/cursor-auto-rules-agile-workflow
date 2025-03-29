import { AssessmentFlowController } from '@client/controllers/AssessmentFlowController';
import { Question, QuestionModule, AssessmentState, Answer, AssessmentCategory, QuestionType } from '@client/types/assessment';
import { AssessmentService } from '@client/services/AssessmentService';
import { DisciplineType } from '@client/types/discipline';
import { PracticeSize } from '@client/types/practice';
import { test, expect } from '@playwright/test';
import { AssessmentStatus } from '@client/types/assessment';
import { DisciplineType as ClientDisciplineType } from '@client/types/discipline';
import { PracticeSize as ClientPracticeSize } from '@client/types/practice';

describe('AssessmentFlowController', () => {
  let controller: AssessmentFlowController;
  let mockAssessmentService: AssessmentService;
  const mockUserId = 'user1';

  const mockModules: QuestionModule[] = [
    {
      id: 'mod1',
      title: 'Test Module',
      description: 'Test module description',
      categories: [AssessmentCategory.OPERATIONS],
      questions: [
        {
          id: 'q1',
          text: 'How do you track patient progress?',
          type: QuestionType.MULTIPLE_CHOICE,
          moduleId: 'mod1',
          weight: 1,
          category: AssessmentCategory.OPERATIONS,
          applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
          universalQuestion: true,
          applicablePracticeSizes: [PracticeSize.SMALL, PracticeSize.MEDIUM],
          required: true,
          dependencies: [],
          options: [
            { id: 'opt1', value: 'none', text: 'No formal tracking', score: 0 },
            { id: 'opt2', value: 'basic', text: 'Basic tracking for some patients', score: 3 },
            { id: 'opt3', value: 'consistent', text: 'Consistent tracking for all patients', score: 7 },
            { id: 'opt4', value: 'comprehensive', text: 'Comprehensive system with regular analysis', score: 10 }
          ]
        },
        {
          id: 'q2',
          text: 'What is your patient satisfaction rate?',
          type: QuestionType.MULTIPLE_CHOICE,
          moduleId: 'mod1',
          weight: 1,
          category: AssessmentCategory.OPERATIONS,
          applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
          universalQuestion: true,
          applicablePracticeSizes: [PracticeSize.SMALL, PracticeSize.MEDIUM],
          required: true,
          dependencies: [],
          options: [
            { id: 'opt5', value: 'low', text: 'Below 70%', score: 0 },
            { id: 'opt6', value: 'medium', text: '70-85%', score: 5 },
            { id: 'opt7', value: 'high', text: '85-95%', score: 8 },
            { id: 'opt8', value: 'excellent', text: 'Above 95%', score: 10 }
          ]
        }
      ],
      weight: 1,
      metadata: { category: AssessmentCategory.OPERATIONS }
    }
  ];

  beforeEach(async () => {
    mockAssessmentService = {
      createAssessment: jest.fn().mockResolvedValue({
        id: 'test-assessment',
        user_id: mockUserId,
        status: 'draft' as AssessmentStatus,
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
        categories: [AssessmentCategory.OPERATIONS],
        questions: [
          { 
            id: 'q1', 
            text: 'Question 1', 
            type: QuestionType.MULTIPLE_CHOICE,
            moduleId: 'mod1',
            weight: 1,
            category: AssessmentCategory.OPERATIONS,
            applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
            universalQuestion: true,
            applicablePracticeSizes: [PracticeSize.SMALL, PracticeSize.MEDIUM],
            required: true,
            dependencies: [],
            options: [
              { id: 'a', text: 'Option A', value: 'a', score: 1 },
              { id: 'b', text: 'Option B', value: 'b', score: 2 },
              { id: 'c', text: 'Option C', value: 'c', score: 3 }
            ]
          },
          { 
            id: 'q2', 
            text: 'Question 2', 
            type: QuestionType.MULTIPLE_CHOICE,
            moduleId: 'mod1',
            weight: 1,
            category: AssessmentCategory.OPERATIONS,
            applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
            universalQuestion: true,
            applicablePracticeSizes: [PracticeSize.SMALL, PracticeSize.MEDIUM],
            required: true,
            dependencies: [],
            options: [
              { id: 'a', text: 'Option A', value: 'a', score: 1 },
              { id: 'b', text: 'Option B', value: 'b', score: 2 },
              { id: 'c', text: 'Option C', value: 'c', score: 3 }
            ]
          }
        ],
        weight: 1,
        metadata: { category: AssessmentCategory.OPERATIONS }
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

    // Answer second question
    await newController.saveAnswer({
      questionId: 'q2',
      value: { value: 'b' },
      timestamp
    });

    const state = newController.getCurrentState();
    expect(state.progress).toBe(100);
  });
});

test.describe('Complete Assessment Flow', () => {
  const mockModule = {
    id: 'module1',
    title: 'Patient Care',
    description: 'Assessment of patient care practices',
    categories: [AssessmentCategory.OPERATIONS],
    weight: 1,
    questions: [
      {
        id: 'q1',
        text: 'How do you track patient progress?',
        type: QuestionType.MULTIPLE_CHOICE,
        category: AssessmentCategory.OPERATIONS,
        moduleId: 'module1',
        applicableDisciplines: [ClientDisciplineType.PHYSIOTHERAPY],
        universalQuestion: true,
        applicablePracticeSizes: [ClientPracticeSize.SMALL, ClientPracticeSize.MEDIUM],
        required: true,
        weight: 1,
        dependencies: [],
        options: [
          { id: 'opt1', value: 'none', text: 'No formal tracking', score: 0 },
          { id: 'opt2', value: 'basic', text: 'Basic tracking for some patients', score: 3 },
          { id: 'opt3', value: 'consistent', text: 'Consistent tracking for all patients', score: 7 },
          { id: 'opt4', value: 'comprehensive', text: 'Comprehensive system with regular analysis', score: 10 }
        ]
      },
      {
        id: 'q2',
        text: 'What is your patient satisfaction rate?',
        type: QuestionType.MULTIPLE_CHOICE,
        category: AssessmentCategory.OPERATIONS,
        moduleId: 'module1',
        applicableDisciplines: [ClientDisciplineType.PHYSIOTHERAPY],
        universalQuestion: true,
        applicablePracticeSizes: [ClientPracticeSize.SMALL, ClientPracticeSize.MEDIUM],
        required: true,
        weight: 1,
        dependencies: [],
        options: [
          { id: 'opt5', value: 'low', text: 'Below 70%', score: 0 },
          { id: 'opt6', value: 'medium', text: '70-85%', score: 5 },
          { id: 'opt7', value: 'high', text: '85-95%', score: 8 },
          { id: 'opt8', value: 'excellent', text: 'Above 95%', score: 10 }
        ]
      }
    ]
  };

  test.beforeEach(async ({ page }) => {
    // Navigate to assessment page
    await page.goto('/assessment');

    // Wait for page to load
    await page.waitForSelector('[data-testid="assessment-container"]');
  });

  test('should complete assessment successfully', async ({ page }) => {
    // Answer first question
    await page.click('[data-testid="option-consistent"]');
    await page.click('[data-testid="next-button"]');

    // Answer second question
    await page.click('[data-testid="option-high"]');
    await page.click('[data-testid="submit-button"]');

    // Verify completion
    await expect(page.locator('[data-testid="completion-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="score-display"]')).toContainText('75%');
  });

  test('should validate required questions', async ({ page }) => {
    // Try to proceed without answering
    await page.click('[data-testid="next-button"]');

    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Please answer all required questions');
  });

  test('should save progress automatically', async ({ page }) => {
    // Answer first question
    await page.click('[data-testid="option-basic"]');
    await page.click('[data-testid="save-button"]');

    // Reload page
    await page.reload();

    // Verify saved answer is still selected
    await expect(page.locator('[data-testid="option-basic"]')).toBeChecked();
  });
});