import { DisciplineType } from './discipline';
import { PracticeSize } from './practice';

export { DisciplineType, PracticeSize };

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

export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  TEXT = 'TEXT',
  NUMBER = 'NUMBER',
  NUMERIC = 'NUMERIC',
  BOOLEAN = 'BOOLEAN',
  SCALE = 'SCALE',
  LIKERT_SCALE = 'LIKERT_SCALE'
}

export enum ModuleStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SKIPPED = 'skipped',
  LOCKED = 'locked',
  AVAILABLE = 'available'
}

export interface QuestionOption {
  id: string;
  value: string;
  text: string;
  score: number;
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
  description?: string;
}

export interface QuestionModule {
  id: string;
  title: string;
  name?: string;
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

export interface AssessmentAnswer {
  id: string;
  assessment_id: string;
  question_id: string;
  answer: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Assessment {
  id: string;
  user_id: string;
  status: string;
  progress: number;
  current_module_id: string;
  current_question_id: string;
  created_at: string;
  updated_at: string;
  metadata?: Record<string, unknown>;
}

export type Module = QuestionModule; 