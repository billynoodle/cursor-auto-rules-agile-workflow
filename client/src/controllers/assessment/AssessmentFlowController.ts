import { 
  QuestionModule, 
  Question, 
  Answer, 
  AssessmentState,
  StateSubscriber
} from '../../types/assessment';
import { AssessmentService } from '../../services/AssessmentService';
import { AssessmentContext } from './types';
import { AssessmentNavigation } from './navigation/AssessmentNavigation';
import { AssessmentState as AssessmentStateManager } from './state/AssessmentState';
import { AssessmentProgress } from './progress/AssessmentProgress';
import { AssessmentInitialization } from './initialization/AssessmentInitialization';
import { AssessmentError } from './error/AssessmentError';

export class AssessmentFlowController {
  private context: AssessmentContext;
  private navigation: AssessmentNavigation;
  private stateManager: AssessmentStateManager;
  private progress: AssessmentProgress;
  private initialization: AssessmentInitialization;
  private errorHandler: AssessmentError;

  private constructor() {
    this.context = {
      modules: [],
      state: {
        currentModuleId: '',
        currentQuestionId: '',
        answers: {},
        progress: 0,
        completedModules: [],
        isComplete: false
      },
      subscribers: new Set(),
      questionMap: new Map(),
      moduleMap: new Map(),
      assessmentService: {} as AssessmentService,
      userId: '',
      currentModule: 0,
      currentQuestion: 0
    };

    this.navigation = new AssessmentNavigation(this.context);
    this.stateManager = new AssessmentStateManager(this.context);
    this.progress = new AssessmentProgress(this.context);
    this.initialization = new AssessmentInitialization(this.context);
    this.errorHandler = new AssessmentError(this.context);
  }

  static async create(
    modules: QuestionModule[], 
    assessmentService: AssessmentService, 
    userId: string, 
    existingAssessmentId?: string
  ): Promise<AssessmentFlowController> {
    const controller = new AssessmentFlowController();
    await controller.initialization.create(modules, assessmentService, userId, existingAssessmentId);
    return controller;
  }

  // Navigation methods
  public async nextQuestion(): Promise<void> {
    return this.navigation.nextQuestion();
  }

  public async previousQuestion(): Promise<void> {
    return this.navigation.previousQuestion();
  }

  public async navigateToQuestion(questionId: string): Promise<void> {
    return this.navigation.navigateToQuestion(questionId);
  }

  public async navigateToModule(moduleId: string): Promise<void> {
    return this.navigation.navigateToModule(moduleId);
  }

  public async nextModule(): Promise<void> {
    return this.navigation.nextModule();
  }

  public getCurrentModule(): QuestionModule | undefined {
    return this.navigation.getCurrentModule();
  }

  public getCurrentQuestion(): Question | undefined {
    return this.navigation.getCurrentQuestion();
  }

  public getQuestionsForModule(moduleId: string): Question[] {
    return this.navigation.getQuestionsForModule(moduleId);
  }

  public getCurrentModuleQuestions(): Question[] {
    return this.navigation.getCurrentModuleQuestions();
  }

  // State management methods
  public getState(): AssessmentState {
    return this.stateManager.getState();
  }

  public async restoreState(state: AssessmentState): Promise<void> {
    return this.stateManager.restoreState(state);
  }

  public subscribe(subscriber: StateSubscriber): () => void {
    return this.stateManager.subscribe(subscriber);
  }

  public async persistState(): Promise<void> {
    return this.stateManager.persistState();
  }

  // Progress tracking methods
  public async saveAnswer(answer: { questionId: string; value: Answer; timestamp: string }): Promise<void> {
    return this.progress.saveAnswer(answer);
  }

  public isModuleComplete(moduleId: string): boolean {
    return this.progress.isModuleComplete(moduleId);
  }

  public isAssessmentComplete(): boolean {
    return this.progress.isAssessmentComplete();
  }

  // Utility methods
  public getAssessmentId(): string | undefined {
    return this.context.assessmentId;
  }

  public updateService(service: AssessmentService): void {
    this.context.assessmentService = service;
  }
} 