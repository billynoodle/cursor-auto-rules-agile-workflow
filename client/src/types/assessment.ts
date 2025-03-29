import { DisciplineType } from './discipline';
import { PracticeSize } from './practice';

export interface QuestionModule {
  id: string;
  title: string;
  name?: string;  // For backward compatibility
  description: string;
  categories: AssessmentCategory[];
  questions: Question[];
  dependencies?: string[];
  metadata?: Record<string, unknown>;
  estimatedTimeMinutes?: number;
  status?: ModuleStatus;
  progress?: number;
  prerequisites?: string[];
  completedQuestions?: number;
  totalQuestions?: number;
  weight: number;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  category: AssessmentCategory;
  moduleId: string;
  applicableDisciplines: DisciplineType[];
  universalQuestion: boolean;
  applicablePracticeSizes: PracticeSize[];
  required: boolean;
  weight: number;
  dependencies: string[];
  options?: QuestionOption[];
  minScore?: number;
  maxScore?: number;
  helpText?: string;
  benchmarkReference?: string;
  impactAreas?: string[];
  metadata?: Record<string, unknown>;
}

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
  score: number;
}

export interface Answer {
  value: string | number | boolean | string[];
  metadata?: Record<string, unknown>;
}

export interface AssessmentAnswer {
  questionId: string;
  moduleId: string;
  value: string | number | boolean;
  score?: number;
  timestamp: string;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  NUMERIC = 'NUMERIC',  // Alias for NUMBER
  BOOLEAN = 'BOOLEAN',
  SCALE = 'SCALE',
  LIKERT_SCALE = 'LIKERT_SCALE'  // Alias for SCALE
}

export enum ModuleStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  LOCKED = 'locked',
  AVAILABLE = 'available'
}

export enum AssessmentCategory {
  FINANCIAL = 'FINANCIAL',
  OPERATIONS = 'OPERATIONS',
  PATIENTS = 'PATIENTS',
  MARKETING = 'MARKETING',
  TECHNOLOGY = 'TECHNOLOGY',
  COMPLIANCE = 'COMPLIANCE',
  PATIENT_CARE = 'PATIENT_CARE',
  STAFFING = 'STAFFING',
  FACILITIES = 'FACILITIES',
  GEOGRAPHY = 'GEOGRAPHY',
  AUTOMATION = 'AUTOMATION'
}

export type ModuleCategory = 'financial' | 'operations' | 'marketing' | 'staffing' | 'compliance' | 'patients' | 'facilities' | 'geography' | 'technology' | 'automation';

export interface AssessmentState {
  currentModuleId: string;
  currentQuestionId: string;
  answers: Record<string, Answer>;
  progress: number;
  completedModules: string[];
  isComplete: boolean;
}

export type StateSubscriber = (state: AssessmentState) => void;

export enum AssessmentStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  ARCHIVED = 'archived'
} 