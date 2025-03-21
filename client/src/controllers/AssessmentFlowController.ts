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

  private async persistState(): Promise<void> {
    if (!this.assessmentId) return;

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

  public getCurrentState(): AssessmentState {
    return { ...this.state };
  }

  public async restoreState(state: AssessmentState): Promise<void> {
    this.state = { ...state };
    await this.persistState();
    this.notifySubscribers();
  }

  public subscribe(subscriber: StateSubscriber): () => void {
    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(subscriber => subscriber(this.getCurrentState()));
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

    return Math.round((answeredQuestions / totalQuestions) * 100);
  }

  public async saveAnswer(answer: { questionId: string; value: Answer; timestamp: string }): Promise<void> {
    // Store the current state before making changes
    const previousState = { ...this.state };
    
    try {
      // Validate the answer's question ID matches the current question
      if (answer.questionId !== this.state.currentQuestionId) {
        throw new Error('Answer question ID does not match current question');
      }

      if (!this.assessmentId) {
        throw new Error('Assessment ID is required');
      }

      // Update local state
      this.state = {
        ...this.state,
        answers: {
          ...this.state.answers,
          [answer.questionId]: answer.value
        },
        progress: this.calculateProgress()
      };

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
    const currentModule = this.moduleMap.get(this.state.currentModuleId);
    if (!currentModule) return;

    // Save current state for rollback
    const previousState = { ...this.state };

    const currentQuestionIndex = currentModule.questions.findIndex(q => q.id === this.state.currentQuestionId);
    
    if (currentQuestionIndex < currentModule.questions.length - 1) {
      // Next question in current module
      this.state.currentQuestionId = currentModule.questions[currentQuestionIndex + 1].id;
    } else {
      // Check if all questions in current module are answered
      const allQuestionsAnswered = currentModule.questions.every(q => this.state.answers[q.id]);
      if (allQuestionsAnswered && !this.state.completedModules.includes(currentModule.id)) {
        this.state.completedModules.push(currentModule.id);
      }

      // Move to next module
      const currentModuleIndex = this.modules.findIndex(m => m.id === currentModule.id);
      if (currentModuleIndex < this.modules.length - 1) {
        const nextModule = this.modules[currentModuleIndex + 1];
        this.state.currentModuleId = nextModule.id;
        this.state.currentQuestionId = nextModule.questions[0].id;
      } else {
        // Assessment complete
        this.state.isComplete = true;
      }
    }

    // Update progress
    this.state.progress = this.calculateProgress();

    try {
      await this.persistState();
      this.notifySubscribers();
    } catch (error) {
      // Roll back state on error
      this.state = previousState;
      throw error;
    }
  }

  public async previousQuestion(): Promise<void> {
    const currentModule = this.moduleMap.get(this.state.currentModuleId);
    if (!currentModule) return;

    const currentQuestionIndex = currentModule.questions.findIndex(q => q.id === this.state.currentQuestionId);
    
    if (currentQuestionIndex > 0) {
      // Previous question in current module
      this.state.currentQuestionId = currentModule.questions[currentQuestionIndex - 1].id;
    } else {
      // Move to previous module
      const currentModuleIndex = this.modules.findIndex(m => m.id === currentModule.id);
      if (currentModuleIndex > 0) {
        const previousModule = this.modules[currentModuleIndex - 1];
        this.state.currentModuleId = previousModule.id;
        this.state.currentQuestionId = previousModule.questions[previousModule.questions.length - 1].id;
      }
    }

    await this.persistState();
    this.notifySubscribers();
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
  updateService(service: AssessmentService): void {
    this.assessmentService = service;
  }
} 