import { QuestionType } from './QuestionType';
import { AssessmentCategory } from './AssessmentCategory';
import { DisciplineType } from './DisciplineType';
import { PracticeSize } from './PracticeSize';
import { Country } from './Country';
import { SOPType } from './SOPType';
import { ScorePosition } from './ScorePosition';
import { MaterialResourceType } from './MaterialResourceType';

/**
 * Represents a question in the assessment questionnaire
 */
export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  category: AssessmentCategory;
  moduleId: string;
  applicableDisciplines: DisciplineType[];
  universalQuestion: boolean; // True if applies to all disciplines
  options?: Array<{
    value: string;
    score: number;
    text: string;
  }>;
  weight: number; // Importance factor (1-10)
  dependsOn?: {
    questionId: string;
    condition: string;
  };
  benchmarkReference?: string;
  helpText?: string; // Explanation or context for the question
  impactAreas?: string[]; // Business areas impacted by this question
  applicablePracticeSizes: PracticeSize[]; // Which practice sizes this question applies to
  countrySpecific?: {
    [key in Country]?: {
      text?: string; // Country-specific question text
      options?: Array<{
        value: string;
        score: number;
        text: string;
      }>;
      benchmarkReference?: string;
    }
  };
  disciplineSpecific?: {
    [key in DisciplineType]?: {
      text?: string; // Discipline-specific question text
      options?: Array<{
        value: string;
        score: number;
        text: string;
      }>;
      weight?: number; // Discipline-specific weight adjustment
      benchmarkReference?: string;
    }
  };
  trackingPeriod?: string; // Recommended tracking frequency
  isCustom?: boolean; // Whether this is a custom variable question
  sopRelevance?: {
    relevant: boolean;
    sopTypes: SOPType[];
    contentMapping?: {
      [key: string]: string; // Maps answer values to SOP content sections
    };
    ragParameters?: {
      contextTags: string[];
      contentPriority: number; // 1-10 scale of importance for RAG model
      requiredInclusions?: string[];
    };
  };
  materialFinder?: {
    resourceTypes: MaterialResourceType[];
    keywords: string[];
    mandatoryResources?: string[];
    recommendedResources?: string[];
  };
  scoreInterpretation?: {
    [key in ScorePosition]?: {
      interpretation: string;
      actionPrompts: string[];
      priority: number; // 1-10 scale for prioritizing actions
      timeframe: string; // Suggested timeframe for addressing
    }
  };
} 