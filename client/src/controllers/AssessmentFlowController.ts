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

  constructor(modules: QuestionModule[], assessmentService: AssessmentService, userId: string, existingAssessmentId?: string) {
    this.modules = modules;
    this.subscribers = new Set();
    this.questionMap = new Map();
    this.moduleMap = new Map();
    this.assessmentService = assessmentService;
    this.userId = userId;
    this.assessmentId = existingAssessmentId;

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

    // If we have an existing assessment ID, load its state
    if (existingAssessmentId) {
      this.loadAssessment(existingAssessmentId);
    } else {
      this.createAssessment();
    }
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
        progress: this.state.progress,
        completed_modules: this.state.completedModules,
        is_complete: this.state.isComplete,
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

  public async saveAnswer(answer: Answer): Promise<void> {
    if (!this.assessmentId) return;

    try {
      // Save answer to database
      await this.assessmentService.saveAnswer({
        assessment_id: this.assessmentId,
        question_id: this.state.currentQuestionId,
        answer: answer
      });

      // Update local state
      this.state.answers[this.state.currentQuestionId] = answer;
      this.updateProgress();
      await this.persistState();
      this.notifySubscribers();
    } catch (error) {
      console.error('Failed to save answer:', error);
      throw error;
    }
  }

  public async nextQuestion(): Promise<void> {
    const currentModule = this.moduleMap.get(this.state.currentModuleId);
    if (!currentModule) return;

    const currentQuestionIndex = currentModule.questions.findIndex(q => q.id === this.state.currentQuestionId);
    
    if (currentQuestionIndex < currentModule.questions.length - 1) {
      // Next question in current module
      this.state.currentQuestionId = currentModule.questions[currentQuestionIndex + 1].id;
    } else {
      // Move to next module
      const currentModuleIndex = this.modules.findIndex(m => m.id === currentModule.id);
      if (currentModuleIndex < this.modules.length - 1) {
        const nextModule = this.modules[currentModuleIndex + 1];
        this.state.currentModuleId = nextModule.id;
        this.state.currentQuestionId = nextModule.questions[0].id;
        
        if (!this.state.completedModules.includes(currentModule.id)) {
          this.state.completedModules.push(currentModule.id);
        }
      } else {
        // Assessment complete
        if (!this.state.completedModules.includes(currentModule.id)) {
          this.state.completedModules.push(currentModule.id);
        }
        this.state.isComplete = true;
      }
    }

    await this.persistState();
    this.notifySubscribers();
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
} 