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
  FINANCIAL = 'FINANCIAL',
  OPERATIONS = 'OPERATIONS',
  MARKETING = 'MARKETING',
  STAFFING = 'STAFFING',
  COMPLIANCE = 'COMPLIANCE',
  PATIENTS = 'PATIENTS',
  FACILITIES = 'FACILITIES',
  GEOGRAPHY = 'GEOGRAPHY',
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
  moduleId: string;
  category: AssessmentCategory;
  type: QuestionType;
  text: string;
  tooltip?: string;
  options?: string[];
  minValue?: number;
  maxValue?: number;
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