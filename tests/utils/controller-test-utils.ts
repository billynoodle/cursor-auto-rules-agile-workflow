import { AssessmentFlowController } from '@client/controllers/AssessmentFlowController';
import { AssessmentService } from '@client/services/AssessmentService';
import { SupabaseClient } from '@supabase/supabase-js';
import { 
  createMockSupabaseClient, 
  TEST_USER_ID,
  MockOptions,
  GeneratorOptions 
} from '@__mocks__/data/assessment/index';
import { DatabaseSchema } from '@client/types/database';
import { AssessmentState, Answer, QuestionType, AssessmentCategory, QuestionModule, ModuleStatus } from '@client/types/assessment';
import { DisciplineType } from '@client/types/discipline';
import { PracticeSize } from '@client/types/practice';

interface MockSupabaseOptions {
  simulateNetworkError?: boolean;
  simulateTimeout?: boolean;
}

/**
 * Base test context for controller tests
 */
export interface BaseTestContext {
  mockSupabaseClient: ReturnType<typeof createMockSupabaseClient>;
  assessmentService: AssessmentService;
  controller: AssessmentFlowController;
  modules: ReturnType<typeof generateMockModules>;
}

/**
 * Options for creating a test context
 */
export interface TestContextOptions extends MockOptions {
  moduleOptions?: GeneratorOptions;
  mockBehavior?: 'unit' | 'integration';
}

const generateMockModules = (options: GeneratorOptions = {}) => {
  const { moduleCount = 3, questionsPerModule = 3 } = options;
  return Array.from({ length: moduleCount }, (_, i) => {
    const moduleId = `module${i + 1}`;
    return {
      id: moduleId,
      title: `Module ${i + 1}`,
      description: `Description for module ${i + 1}`,
      categories: [AssessmentCategory.FINANCIAL],
      questions: Array.from({ length: questionsPerModule }, (_, j) => ({
        id: `q${moduleId}-${j + 1}`,
        text: `Question ${j + 1} for module ${moduleId}`,
        moduleId,
        type: [QuestionType.TEXT, QuestionType.NUMBER, QuestionType.MULTIPLE_CHOICE][j % 3],
        required: true,
        weight: 1,
        dependencies: [],
        category: AssessmentCategory.FINANCIAL,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        applicablePracticeSizes: [PracticeSize.SMALL],
        universalQuestion: false,
        helpText: `Help text for question ${j + 1}`
      })),
      dependencies: [],
      metadata: {
        category: 'operations'
      },
      weight: 1
    };
  });
};

/**
 * Creates a base test context for controller tests
 * @param options Test context options
 */
export const createBaseTestContext = async (options: TestContextOptions = {}): Promise<BaseTestContext> => {
  const { moduleOptions, mockBehavior, ...mockOptions } = options;
  const mockSupabaseClient = createMockSupabaseClient(mockOptions);
  const assessmentService = new AssessmentService(mockSupabaseClient);
  const modules = generateMockModules(moduleOptions);
  const controller = await AssessmentFlowController.create(modules, assessmentService, TEST_USER_ID);

  return {
    mockSupabaseClient,
    assessmentService,
    controller,
    modules
  };
};

/**
 * Sets up the test environment with common configuration
 */
export const setupTestEnvironment = () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
};

/**
 * Unit test specific context and utilities
 */
export const UnitTestUtils = {
  createTestContext: async (options: TestContextOptions = {}): Promise<BaseTestContext> => {
    // For unit tests, ensure all external dependencies are fully mocked
    const context = await createBaseTestContext({
      ...options,
      mockBehavior: 'unit'
    });
    
    // Mock state with dynamic updates
    let currentState: AssessmentState = {
      currentModuleId: context.modules[0]?.id || '',
      currentQuestionId: `q${context.modules[0]?.id}-1` || '',
      answers: {} as Record<string, Answer>,
      progress: 0,
      completedModules: [] as string[],
      isComplete: false
    };

    let currentModuleIndex = 0;
    let currentQuestionIndex = 0;

    const updateProgress = () => {
      const totalQuestions = context.modules.reduce((sum, m) => sum + m.questions.length, 0);
      const answeredQuestions = Object.keys(currentState.answers).length;
      currentState.progress = Math.round((answeredQuestions / totalQuestions) * 100);
    };

    const checkModuleCompletion = (moduleId: string) => {
      const module = context.modules.find(m => m.id === moduleId);
      if (!module) return;
      
      const moduleQuestions = module.questions.map(q => q.id);
      const isModuleComplete = moduleQuestions.every(qId => currentState.answers[qId]);
      
      if (isModuleComplete && !currentState.completedModules.includes(moduleId)) {
        currentState.completedModules = [...currentState.completedModules, moduleId];
      }
    };

    jest.spyOn(context.controller, 'getState').mockImplementation(() => currentState);
    
    jest.spyOn(context.controller, 'restoreState').mockImplementation(async (newState) => {
      currentState = { ...newState };
      currentModuleIndex = context.modules.findIndex(m => m.id === currentState.currentModuleId);
      const currentModule = context.modules[currentModuleIndex];
      currentQuestionIndex = parseInt(currentState.currentQuestionId.split('-')[1]) - 1;
      return Promise.resolve();
    });
    
    jest.spyOn(context.controller, 'saveAnswer').mockImplementation(async (answer: { questionId: string; value: Answer; timestamp: string; }) => {
      currentState.answers = {
        ...currentState.answers,
        [answer.questionId]: answer.value
      };
      updateProgress();
      checkModuleCompletion(currentState.currentModuleId);
      return Promise.resolve();
    });

    // Mock navigation methods to update state
    jest.spyOn(context.controller, 'nextQuestion').mockImplementation(async () => {
      const currentModule = context.modules[currentModuleIndex];
      
      if (currentQuestionIndex < currentModule.questions.length - 1) {
        // Move to next question in current module
        currentQuestionIndex++;
        currentState = {
          ...currentState,
          currentQuestionId: `q${currentState.currentModuleId}-${currentQuestionIndex + 1}`
        };
      } else if (currentModuleIndex < context.modules.length - 1) {
        // Move to first question of next module
        checkModuleCompletion(currentModule.id);
        currentModuleIndex++;
        currentQuestionIndex = 0;
        const nextModule = context.modules[currentModuleIndex];
        currentState = {
          ...currentState,
          currentModuleId: nextModule.id,
          currentQuestionId: `q${nextModule.id}-1`
        };
      } else {
        // At last question of last module
        checkModuleCompletion(currentModule.id);
        currentState.isComplete = true;
      }

      // Update controller's internal state
      context.controller['currentModule'] = currentModuleIndex;
      context.controller['currentQuestion'] = currentQuestionIndex;
      
      return Promise.resolve();
    });

    jest.spyOn(context.controller, 'previousQuestion').mockImplementation(async () => {
      if (currentQuestionIndex > 0) {
        // Move to previous question in current module
        currentQuestionIndex--;
        currentState = {
          ...currentState,
          currentQuestionId: `q${currentState.currentModuleId}-${currentQuestionIndex + 1}`
        };
      } else if (currentModuleIndex > 0) {
        // Move to last question of previous module
        currentModuleIndex--;
        const prevModule = context.modules[currentModuleIndex];
        currentQuestionIndex = prevModule.questions.length - 1;
        currentState = {
          ...currentState,
          currentModuleId: prevModule.id,
          currentQuestionId: `q${prevModule.id}-${currentQuestionIndex + 1}`
        };
      }
      // If at first question of first module, stay there

      // Update controller's internal state
      context.controller['currentModule'] = currentModuleIndex;
      context.controller['currentQuestion'] = currentQuestionIndex;
      
      return Promise.resolve();
    });

    jest.spyOn(context.controller, 'nextModule').mockImplementation(async () => {
      if (currentModuleIndex < context.modules.length - 1) {
        currentModuleIndex++;
        currentQuestionIndex = 0;
        const nextModule = context.modules[currentModuleIndex];
        currentState = {
          ...currentState,
          currentModuleId: nextModule.id,
          currentQuestionId: `q${nextModule.id}-1`
        };
        context.controller['currentModule'] = currentModuleIndex;
        context.controller['currentQuestion'] = currentQuestionIndex;
      }
      return Promise.resolve();
    });

    jest.spyOn(context.controller, 'getCurrentModule').mockImplementation(() => {
      const currentModule = context.modules[currentModuleIndex];
      if (!currentModule) return undefined;
      return {
        id: currentModule.id,
        title: `Module ${currentModuleIndex + 1}`,
        description: `Description for module ${currentModuleIndex + 1}`,
        categories: [AssessmentCategory.OPERATIONS],
        weight: 1,
        questions: Array.from({ length: options.moduleOptions?.questionsPerModule || 3 }, (_, i) => ({
          id: `q${currentModule.id}-${i + 1}`,
          text: `Question ${i + 1} for module ${currentModule.id}`,
          moduleId: currentModule.id,
          type: [QuestionType.TEXT, QuestionType.NUMBER, QuestionType.MULTIPLE_CHOICE][i % 3],
          required: true,
          weight: 1,
          dependencies: [],
          category: AssessmentCategory.FINANCIAL,
          applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
          applicablePracticeSizes: [PracticeSize.SMALL],
          universalQuestion: false,
          helpText: `Help text for question ${i + 1}`
        })),
        dependencies: [],
        metadata: {
          category: 'operations'
        }
      };
    });

    jest.spyOn(context.controller, 'getCurrentQuestion').mockImplementation(() => {
      const currentModule = context.modules[currentModuleIndex];
      if (!currentModule) return undefined;
      return {
        id: `q${currentModule.id}-${currentQuestionIndex + 1}`,
        text: `Question ${currentQuestionIndex + 1} for module ${currentModule.id}`,
        moduleId: currentModule.id,
        type: [QuestionType.TEXT, QuestionType.NUMBER, QuestionType.MULTIPLE_CHOICE][currentQuestionIndex % 3],
        required: true,
        weight: 1,
        dependencies: [],
        category: AssessmentCategory.FINANCIAL,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        applicablePracticeSizes: [PracticeSize.SMALL],
        universalQuestion: false,
        helpText: `Help text for question ${currentQuestionIndex + 1}`
      };
    });

    return context;
  }
};

/**
 * Integration test specific context and utilities
 */
export const IntegrationTestUtils = {
  createTestContext: async (options: TestContextOptions = {}): Promise<BaseTestContext> => {
    // For integration tests, allow some real implementations
    const context = await createBaseTestContext({
      ...options,
      mockBehavior: 'integration'
    });
    
    // Additional integration test specific setup
    // Use actual implementations where appropriate
    
    return context;
  }
};