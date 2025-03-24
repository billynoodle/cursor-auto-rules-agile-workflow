import { 
  QuestionModule, 
  Question, 
  Answer, 
  AssessmentState,
  StateSubscriber
} from '../types/assessment';
import { AssessmentService } from '../services/AssessmentService';
import { Assessment, AssessmentAnswer } from '../types/database';

export class AssessmentFlowController {
  private modules: QuestionModule[];
  private state: AssessmentState;
  private subscribers: Set<StateSubscriber>;
  private questionMap: Map<string, Question>;
  private moduleMap: Map<string, QuestionModule>;
  private assessmentService: AssessmentService;
  private assessmentId?: string;
  private userId: string;
  private currentModule: number = 0;
  private currentQuestion: number = 0;
  private answers: Record<string, any> = {};
  private progress: number = 0;

  private constructor(modules: QuestionModule[], assessmentService: AssessmentService, userId: string) {
    this.modules = modules;
    this.subscribers = new Set();
    this.questionMap = new Map();
    this.moduleMap = new Map();
    this.assessmentService = assessmentService;
    this.userId = userId;

    // Initialize maps for quick lookups
    this.modules.forEach(module => {
      this.moduleMap.set(module.id, module);
      module.questions.forEach((question: Question) => {
        this.questionMap.set(question.id, question);
      });
    });

    // Initialize state
    this.state = {
      currentModuleId: modules[0]?.id || '',
      currentQuestionId: modules[0]?.questions[0]?.id || '',
      answers: {},
      progress: 0,
      completedModules: [],
      isComplete: false
    };
  }

  static async create(modules: QuestionModule[], assessmentService: AssessmentService, userId: string, existingAssessmentId?: string): Promise<AssessmentFlowController> {
    const controller = new AssessmentFlowController(modules, assessmentService, userId);
    
    if (existingAssessmentId) {
      await controller.loadAssessment(existingAssessmentId);
    } else {
      await controller.createAssessment();
    }

    return controller;
  }

  private async loadAssessment(assessmentId: string): Promise<void> {
    try {
      const assessment = await this.assessmentService.getAssessment(assessmentId);
      if (!assessment) throw new Error('Assessment not found');

      const answers = await this.assessmentService.getAnswers(assessmentId);
      
      // Convert answers to state format
      const stateAnswers: Record<string, Answer> = {};
      answers.forEach((answer: AssessmentAnswer) => {
        stateAnswers[answer.question_id] = answer.answer as Answer;
      });

      this.state = {
        currentModuleId: assessment.current_module_id,
        currentQuestionId: assessment.current_question_id,
        answers: stateAnswers,
        progress: assessment.progress,
        completedModules: assessment.completed_modules,
        isComplete: assessment.is_complete
      };

      this.assessmentId = assessmentId;
      this.notifySubscribers();
    } catch (error) {
      console.error('Failed to load assessment:', error);
      throw error;
    }
  }

  private async createAssessment(): Promise<void> {
    try {
      const assessment = await this.assessmentService.createAssessment({
        user_id: this.userId,
        current_module_id: this.state.currentModuleId,
        current_question_id: this.state.currentQuestionId,
        progress: 0,
        completed_modules: [],
        is_complete: false,
        status: 'draft'
      });

      this.assessmentId = assessment.id;
    } catch (error) {
      console.error('Failed to create assessment:', error);
      throw error;
    }
  }

  public async persistState(): Promise<void> {
    if (!this.assessmentId) {
      throw new Error('Assessment not initialized');
    }

    try {
      await this.assessmentService.updateAssessment(this.assessmentId, {
        current_module_id: this.state.currentModuleId,
        current_question_id: this.state.currentQuestionId,
        progress: this.state.progress,
        completed_modules: this.state.completedModules,
        is_complete: this.state.isComplete,
        status: this.state.isComplete ? 'completed' : 'in_progress'
      });
    } catch (error) {
      console.error('Failed to persist state:', error);
      throw error;
    }
  }

  public getState(): AssessmentState {
    return { ...this.state };
  }

  private setState(newState: Partial<AssessmentState>) {
    this.state = { ...this.state, ...newState };
    this.notifySubscribers();
  }

  public async restoreState(state: AssessmentState): Promise<void> {
    const prevState = { ...this.state };
    try {
      this.state = { ...state };
      await this.persistState();
      this.notifySubscribers();
    } catch (error) {
      // Rollback state on error
      this.state = prevState;
      this.notifySubscribers();
      throw error;
    }
  }

  public subscribe(subscriber: StateSubscriber): () => void {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(subscriber => subscriber(this.state));
  }

  private calculateProgress(): number {
    const totalQuestions = this.modules.reduce((total, module) => total + module.questions.length, 0);
    const answeredQuestions = Object.keys(this.state.answers).length;

    // Check if all questions in a module are answered
    this.modules.forEach(module => {
      const allQuestionsAnswered = module.questions.every(q => this.state.answers[q.id]);
      if (allQuestionsAnswered && !this.state.completedModules.includes(module.id)) {
        this.state.completedModules.push(module.id);
      }
    });

    // If all modules are completed, return 100%
    if (this.state.completedModules.length === this.modules.length) {
      this.state.isComplete = true;
      return 100;
    }

    return Math.floor((answeredQuestions / totalQuestions) * 100);
  }

  public async saveAnswer(answer: { questionId: string; value: Answer; timestamp: string }): Promise<void> {
    // Store the current state before making changes
    const previousState = { ...this.state };
    
    try {
      // Validate the question exists
      const question = this.questionMap.get(answer.questionId);
      if (!question) {
        throw new Error(`Question ${answer.questionId} not found`);
      }

      if (!this.assessmentId) {
        throw new Error('Assessment not initialized');
      }

      // Update local state
      this.state = {
        ...this.state,
        answers: {
          ...this.state.answers,
          [answer.questionId]: answer.value
        }
      };

      // Update progress and check module completion
      this.state.progress = this.calculateProgress();

      // Persist to backend
      const answerData = {
        assessment_id: this.assessmentId,
        question_id: answer.questionId,
        answer: answer.value,
        timestamp: answer.timestamp
      };

      await this.assessmentService.saveAnswer(answerData);
      
      // Only notify subscribers after successful persistence
      this.notifySubscribers();
    } catch (error) {
      // Rollback state on error
      this.state = previousState;
      this.notifySubscribers();
      throw error;
    }
  }

  public async nextQuestion(): Promise<void> {
    if (!this.assessmentId) {
      throw new Error('Assessment not initialized');
    }

    const prevState = { ...this.state };

    try {
      // Get current module and question
      const currentModule = this.modules[this.currentModule];
      const questions = currentModule.questions;

      // Update current question/module
      if (this.currentQuestion < questions.length - 1) {
        this.currentQuestion++;
        this.state.currentQuestionId = questions[this.currentQuestion].id;
      } else if (this.currentModule < this.modules.length - 1) {
        this.currentModule++;
        this.currentQuestion = 0;
        const nextModule = this.modules[this.currentModule];
        this.state.currentModuleId = nextModule.id;
        this.state.currentQuestionId = nextModule.questions[0].id;
      } else {
        // At the end of assessment
        this.state.isComplete = true;
      }

      // Persist state
      await this.persistState();
      this.notifySubscribers();
    } catch (error) {
      // Roll back state on error
      this.state = prevState;
      this.currentModule = this.modules.findIndex(m => m.id === prevState.currentModuleId);
      const currentModule = this.modules[this.currentModule];
      this.currentQuestion = currentModule.questions.findIndex(q => q.id === prevState.currentQuestionId);
      throw error;
    }
  }

  public async previousQuestion(): Promise<void> {
    if (!this.assessmentId) {
      throw new Error('Assessment not initialized');
    }

    const prevState = { ...this.state };

    try {
      // Get current module and question
      const currentModule = this.modules[this.currentModule];

      // Update current question/module
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
        this.state.currentQuestionId = currentModule.questions[this.currentQuestion].id;
      } else if (this.currentModule > 0) {
        this.currentModule--;
        const prevModule = this.modules[this.currentModule];
        this.currentQuestion = prevModule.questions.length - 1;
        this.state.currentModuleId = prevModule.id;
        this.state.currentQuestionId = prevModule.questions[this.currentQuestion].id;
      }

      // Persist state
      await this.persistState();
      this.notifySubscribers();
    } catch (error) {
      // Rollback state on error
      this.state = prevState;
      this.notifySubscribers();
      throw error;
    }
  }

  private updateProgress(): void {
    const totalQuestions = this.modules.reduce((total, module) => total + module.questions.length, 0);
    const answeredQuestions = Object.keys(this.state.answers).length;
    this.state.progress = Math.round((answeredQuestions / totalQuestions) * 100);
  }

  public getQuestion(questionId: string): Question | undefined {
    return this.questionMap.get(questionId);
  }

  public getModule(moduleId: string): QuestionModule | undefined {
    return this.moduleMap.get(moduleId);
  }

  public getCurrentModule(): QuestionModule | undefined {
    return this.moduleMap.get(this.state.currentModuleId);
  }

  public getCurrentQuestion(): Question | undefined {
    return this.questionMap.get(this.state.currentQuestionId);
  }

  public getAssessmentId(): string | undefined {
    return this.assessmentId;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.assessmentId) {
      throw new Error('Assessment not initialized');
    }
  }

  /**
   * Updates the assessment service instance.
   * This is primarily used for testing to simulate different service behaviors.
   * @param service The new assessment service instance
   */
  public updateService(service: AssessmentService) {
    this.assessmentService = service;
  }

  private getQuestionsInCurrentModule(): Question[] {
    const currentModule = this.moduleMap.get(this.state.currentModuleId);
    return currentModule?.questions || [];
  }

  public async navigateToQuestion(questionId: string): Promise<void> {
    await this.ensureInitialized();
    
    const question = this.questionMap.get(questionId);
    if (!question) {
      throw new Error(`Question ${questionId} not found`);
    }

    const prevState = {
      currentModuleId: this.state.currentModuleId,
      currentQuestionId: this.state.currentQuestionId
    };

    try {
      // Update state with new question and its module
      this.state.currentQuestionId = questionId;
      this.state.currentModuleId = question.moduleId;

      // Persist state
      await this.persistState();
      this.notifySubscribers();
    } catch (error) {
      // Roll back state on error
      this.state.currentModuleId = prevState.currentModuleId;
      this.state.currentQuestionId = prevState.currentQuestionId;
      throw error;
    }
  }

  public async navigateToModule(moduleId: string): Promise<void> {
    await this.ensureInitialized();
    
    const module = this.moduleMap.get(moduleId);
    if (!module) {
      throw new Error(`Module ${moduleId} not found`);
    }

    const prevState = {
      currentModuleId: this.state.currentModuleId,
      currentQuestionId: this.state.currentQuestionId
    };

    try {
      // Update state with new module and its first question
      this.state.currentModuleId = moduleId;
      this.state.currentQuestionId = module.questions[0].id;

      // Persist state
      await this.persistState();
      this.notifySubscribers();
    } catch (error) {
      // Roll back state on error
      this.state.currentModuleId = prevState.currentModuleId;
      this.state.currentQuestionId = prevState.currentQuestionId;
      throw error;
    }
  }

  public isModuleComplete(moduleId: string): boolean {
    const module = this.moduleMap.get(moduleId);
    if (!module) return false;
    return module.questions.every(q => this.state.answers[q.id]);
  }

  public isAssessmentComplete(): boolean {
    return this.state.isComplete;
  }

  public getQuestionsForModule(moduleId: string): Question[] {
    const module = this.moduleMap.get(moduleId);
    return module?.questions || [];
  }

  public getCurrentModuleQuestions(): Question[] {
    return this.getQuestionsForModule(this.state.currentModuleId);
  }

  public async nextModule(): Promise<void> {
    if (this.currentModule < this.modules.length - 1) {
      this.currentModule++;
      this.currentQuestion = 0;
      const nextModule = this.modules[this.currentModule];
      this.state.currentModuleId = nextModule.id;
      this.state.currentQuestionId = nextModule.questions[0].id;
      await this.persistState();
      this.notifySubscribers();
    }
  }
} 