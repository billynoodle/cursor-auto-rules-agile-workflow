/**
 * Enum for assessment question types
 */
export enum QuestionType {
  SCALE = 'SCALE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  YES_NO = 'YES_NO',
  TEXT = 'TEXT'
}

/**
 * Enum for assessment categories
 */
export enum AssessmentCategory {
  FINANCIAL = 'Financial',
  OPERATIONS = 'Operations',
  COMPLIANCE = 'Compliance',
  MARKETING = 'Marketing',
  STAFFING = 'Staffing',
  TECHNOLOGY = 'Technology'
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
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

/**
 * Interface for question option
 */
export interface QuestionOption {
  value: string;
  score: number;
  text: string;
}

/**
 * Interface for assessment question
 */
export interface Question {
  id: string;
  text: string;
  type: 'MULTIPLE_CHOICE' | 'NUMERIC' | 'TEXT' | 'LIKERT_SCALE';
  helpText?: string;
  options?: Array<{
    value: string;
    score: number;
    text: string;
  }>;
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