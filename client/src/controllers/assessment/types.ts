import { 
  QuestionModule, 
  Question, 
  Answer, 
  AssessmentState,
  StateSubscriber
} from '../../types/assessment';
import { AssessmentService } from '../../services/AssessmentService';

export interface IAssessmentBase {
  getAssessmentId(): string | undefined;
  getState(): AssessmentState;
  ensureInitialized(): Promise<void>;
}

export interface IAssessmentNavigation extends IAssessmentBase {
  nextQuestion(): Promise<void>;
  previousQuestion(): Promise<void>;
  navigateToQuestion(questionId: string): Promise<void>;
  navigateToModule(moduleId: string): Promise<void>;
  nextModule(): Promise<void>;
  getCurrentModule(): QuestionModule | undefined;
  getCurrentQuestion(): Question | undefined;
  getQuestionsForModule(moduleId: string): Question[];
  getCurrentModuleQuestions(): Question[];
}

export interface IAssessmentState extends IAssessmentBase {
  setState(newState: Partial<AssessmentState>): void;
  restoreState(state: AssessmentState): Promise<void>;
  subscribe(subscriber: StateSubscriber): () => void;
  persistState(): Promise<void>;
}

export interface IAssessmentProgress extends IAssessmentBase {
  calculateProgress(): number;
  isModuleComplete(moduleId: string): boolean;
  isAssessmentComplete(): boolean;
  saveAnswer(answer: { questionId: string; value: Answer; timestamp: string }): Promise<void>;
}

export interface IAssessmentInitialization {
  create(modules: QuestionModule[], assessmentService: AssessmentService, userId: string, existingAssessmentId?: string): Promise<void>;
  loadAssessment(assessmentId: string): Promise<void>;
  createAssessment(): Promise<void>;
}

export interface IAssessmentError {
  handleError(error: Error): void;
  rollbackState(prevState: AssessmentState): void;
}

export interface AssessmentContext {
  modules: QuestionModule[];
  state: AssessmentState;
  subscribers: Set<StateSubscriber>;
  questionMap: Map<string, Question>;
  moduleMap: Map<string, QuestionModule>;
  assessmentService: AssessmentService;
  assessmentId?: string;
  userId: string;
  currentModule: number;
  currentQuestion: number;
} 