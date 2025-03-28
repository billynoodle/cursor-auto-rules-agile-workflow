import { AssessmentFlowController } from '../../../client/src/controllers/AssessmentFlowController';
import { AssessmentService } from '../../../client/src/services/AssessmentService';
import { practiceService, assessmentModuleService, assessmentResponseService } from '../../../client/src/services/database';
import { createMockService } from '../mock-helpers/create-mock-service';
import { ModuleCategory, QuestionModule, Question, QuestionType } from '../../../client/src/types/assessment';
import { MockDataFactory } from './MockDataFactory';

export interface TestModuleOptions {
  moduleCount: number;
  questionsPerModule: number;
  includeValidation: boolean;
}

export interface TestContextOptions {
  moduleOptions?: Partial<TestModuleOptions>;
  mockServices?: {
    database?: boolean;
    assessment?: boolean;
    offline?: boolean;
  };
}

export class TestContextBuilder {
  private moduleOptions: TestModuleOptions = {
    moduleCount: 1,
    questionsPerModule: 2,
    includeValidation: false
  };

  private mockServices = {
    database: true,
    assessment: true,
    offline: false
  };

  withModules(options: Partial<TestModuleOptions>): TestContextBuilder {
    this.moduleOptions = { ...this.moduleOptions, ...options };
    return this;
  }

  withMockServices(services: Partial<{ [key: string]: boolean }>): TestContextBuilder {
    this.mockServices = { ...this.mockServices, ...services };
    return this;
  }

  private createTestModules(): QuestionModule[] {
    return MockDataFactory.createBulkModules(this.moduleOptions.moduleCount, {
      questions: MockDataFactory.createBulkQuestions(this.moduleOptions.questionsPerModule)
    });
  }

  private createMockDatabase() {
    return {
      practice: createMockService({
        name: 'practiceService',
        methods: Object.keys(practiceService),
        implementation: {
          createPractice: jest.fn().mockResolvedValue(MockDataFactory.createAssessment()),
          getPractice: jest.fn().mockResolvedValue(null),
          getUserPractices: jest.fn().mockResolvedValue([]),
          updatePractice: jest.fn().mockResolvedValue(true),
          deletePractice: jest.fn().mockResolvedValue(true)
        }
      }),
      assessmentModule: createMockService({
        name: 'assessmentModuleService',
        methods: Object.keys(assessmentModuleService),
        implementation: {
          getModules: jest.fn().mockResolvedValue(this.createTestModules()),
          getModule: jest.fn().mockResolvedValue(null)
        }
      }),
      assessmentResponse: createMockService({
        name: 'assessmentResponseService',
        methods: Object.keys(assessmentResponseService),
        implementation: {
          createAssessmentResponse: jest.fn().mockResolvedValue(MockDataFactory.createAssessment()),
          getPracticeAssessments: jest.fn().mockResolvedValue([]),
          getAssessmentWithResponses: jest.fn().mockResolvedValue(null)
        }
      })
    };
  }

  private createMockAssessmentService(): jest.Mocked<AssessmentService> {
    return createMockService({
      name: 'AssessmentService',
      methods: [
        'getModules',
        'saveAnswer',
        'getAnswers',
        'calculateScore',
        'checkOnlineStatus',
        'setupOfflineSync',
        'createAssessment',
        'getAssessment',
        'updateAssessment',
        'deleteAssessment',
        'listAssessments',
        'subscribeToAssessmentUpdates'
      ],
      implementation: {
        getModules: jest.fn().mockResolvedValue(this.createTestModules()),
        saveAnswer: jest.fn().mockResolvedValue(true),
        getAnswers: jest.fn().mockResolvedValue({}),
        calculateScore: jest.fn().mockResolvedValue({ total: 0, breakdown: {} }),
        checkOnlineStatus: jest.fn().mockResolvedValue(undefined),
        setupOfflineSync: jest.fn().mockImplementation(() => {}),
        createAssessment: jest.fn().mockResolvedValue(MockDataFactory.createAssessment()),
        getAssessment: jest.fn().mockResolvedValue(null),
        updateAssessment: jest.fn().mockResolvedValue(true),
        deleteAssessment: jest.fn().mockResolvedValue(true),
        listAssessments: jest.fn().mockResolvedValue([]),
        subscribeToAssessmentUpdates: jest.fn().mockImplementation(() => () => {})
      }
    }) as unknown as jest.Mocked<AssessmentService>;
  }

  async buildControllerContext() {
    const mockDb = this.mockServices.database ? this.createMockDatabase() : undefined;
    const mockAssessmentService = this.mockServices.assessment ? this.createMockAssessmentService() : undefined;
    const modules = this.createTestModules();
    
    if (!mockAssessmentService) {
      throw new Error('AssessmentService is required for controller creation');
    }

    const controller = await AssessmentFlowController.create(
      modules,
      mockAssessmentService,
      'test-user-id'
    );

    return {
      controller,
      modules,
      mockDb,
      mockAssessmentService
    };
  }

  async buildServiceContext<T>(
    ServiceClass: new (...args: any[]) => T,
    additionalDependencies: any[] = []
  ) {
    const mockDb = this.mockServices.database ? this.createMockDatabase() : undefined;
    const dependencies = [mockDb, ...additionalDependencies].filter(Boolean);
    
    const service = new ServiceClass(...dependencies);

    return {
      service,
      mockDb,
      modules: this.createTestModules()
    };
  }
} 