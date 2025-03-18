/**
 * Enum for assessment question types
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  LIKERT = 'LIKERT',
  NUMERIC = 'NUMERIC',
  TEXT = 'TEXT'
}

/**
 * Enum for assessment categories
 */
export enum AssessmentCategory {
  FINANCIAL = 'FINANCIAL',
  OPERATIONS = 'OPERATIONS',
  MARKETING = 'MARKETING',
  STAFFING = 'STAFFING',
  COMPLIANCE = 'COMPLIANCE',
  PATIENT_MANAGEMENT = 'PATIENT_MANAGEMENT',
  FACILITIES = 'FACILITIES',
  TECHNOLOGY = 'TECHNOLOGY',
  AUTOMATION = 'AUTOMATION'
}

/**
 * Enum for practice sizes
 */
export enum PracticeSize {
  SOLO = 'SOLO',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE'
}

/**
 * Enum for module status
 */
export enum ModuleStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE'
}

/**
 * Interface for question option
 */
export interface QuestionOption {
  id: string;
  text: string;
  value: string;
  score: number;
}

/**
 * Interface for assessment question
 */
export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  description?: string;
  options?: QuestionOption[];
  required: boolean;
  weight: number;
  dependencies: string[];
  tooltip?: string;
}

/**
 * Interface for assessment module
 */
export interface Module {
  id: string;
  name: string;
  description: string;
  estimatedTimeMinutes: number;
  categories: AssessmentCategory[];
  status: ModuleStatus;
  progress: number;
  prerequisites: string[];
  completedQuestions: number;
  totalQuestions: number;
}

/**
 * Interface for assessment score
 */
export interface Score {
  questionId: string;
  rawScore: number;
  weightedScore: number;
  maxPossible: number;
  percentile?: number;
}

/**
 * Interface for module score
 */
export interface ModuleScore {
  moduleId: string;
  scores: Score[];
  totalRawScore: number;
  totalWeightedScore: number;
  maxPossible: number;
  percentageScore: number;
  percentile?: number;
}

/**
 * Interface for tooltip feedback
 */
export interface TooltipFeedback {
  questionId: string;
  clarityRating: number;
  feedback: string;
  timestamp: string;
} 