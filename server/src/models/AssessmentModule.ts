import { AssessmentCategory } from './AssessmentCategory';
import { DisciplineType } from './DisciplineType';
import { PracticeSize } from './PracticeSize';
import { Country } from './Country';
import { SOPType } from './SOPType';
import { ScorePosition } from './ScorePosition';

/**
 * Represents an assessment module that contains a collection of related questions
 */
export interface Module {
  id: string;
  name: string;
  description: string;
  category: AssessmentCategory;
  order: number;
  estimatedTimeMinutes: number;
  weight: number; // Importance factor in overall score (1-10)
  minScore: number; // Minimum possible score
  maxScore: number; // Maximum possible score
  applicableDisciplines: DisciplineType[];
  universalModule: boolean; // True if applies to all disciplines
  benchmarks: {
    poor: number;
    belowAverage: number;
    average: number;
    good: number;
    excellent: number;
  };
  applicablePracticeSizes: PracticeSize[]; // Which practice sizes this module applies to
  countrySpecific?: {
    [key in Country]?: {
      benchmarks?: {
        poor: number;
        belowAverage: number;
        average: number;
        good: number;
        excellent: number;
      }
    }
  };
  disciplineSpecific?: {
    [key in DisciplineType]?: {
      name?: string; // Discipline-specific module name
      description?: string; // Discipline-specific description
      weight?: number; // Discipline-specific weight adjustment
      benchmarks?: {
        poor: number;
        belowAverage: number;
        average: number;
        good: number;
        excellent: number;
      }
    }
  };
  sopRelevance?: {
    relevant: boolean;
    sopTypes: SOPType[];
  };
  scoreInterpretation?: {
    [key in ScorePosition]: {
      description: string;
      generalRecommendations: string[];
    }
  };
} 