/**
 * Enum for assessment question types
 */
export enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  LIKERT_SCALE = 'LIKERT_SCALE',
  NUMERIC = 'NUMERIC',
  TEXT = 'TEXT',
  MATRIX = 'MATRIX',
  RANKING = 'RANKING'
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
  text: string;
  type: QuestionType | string;
  category: AssessmentCategory | string;
  moduleId: string;
  weight: number;
  helpText?: string;
  options?: QuestionOption[];
  universalQuestion: boolean;
  applicableDisciplines: string[];
  applicablePracticeSizes: string[];
  trackingPeriod?: string;
  benchmarkReference?: string;
  impactAreas?: string[];
}

/**
 * Interface for assessment module
 */
export interface Module {
  id: string;
  name: string;
  description: string;
  category: AssessmentCategory | string;
  order: number;
  estimatedTimeMinutes: number;
  weight: number;
  questions?: Question[];
  minScore: number;
  maxScore: number;
  applicableDisciplines: string[];
  universalModule: boolean;
  applicablePracticeSizes: string[];
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
  feedbackText: string;
  difficultTerms: string[];
} 