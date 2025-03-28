export interface QuestionModule {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  dependencies?: string[];
  metadata?: Record<string, unknown>;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  description?: string;
  required: boolean;
  weight: number;
  options?: QuestionOption[];
  dependencies?: string[];
  metadata?: Record<string, unknown>;
}

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface Answer {
  value: string | number | boolean | string[];
  metadata?: Record<string, unknown>;
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  SINGLE_CHOICE = 'single_choice',
  TEXT = 'text',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  SCALE = 'scale'
}

export enum ModuleStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped'
}

export enum AssessmentCategory {
  OPERATIONS = 'operations',
  FINANCIAL = 'financial',
  PATIENT_CARE = 'patient_care',
  STAFFING = 'staffing',
  TECHNOLOGY = 'technology',
  COMPLIANCE = 'compliance',
  MARKETING = 'marketing',
  FACILITIES = 'facilities',
  GEOGRAPHY = 'geography',
  AUTOMATION = 'automation'
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