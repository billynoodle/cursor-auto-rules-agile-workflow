# Epic-1: Core Assessment Framework Development for Allied Health Practices
# Story-1i: Design Comprehensive Business Assessment - Data Models/Schema (Part 2)

## Data Models / Schema (Continued)

### Module Schema
```typescript
interface Module {
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

### Module Navigation State Management
```typescript
interface ModuleNavigationState {
  currentModuleId: string;
  modules: {
    [moduleId: string]: {
      status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETE';
      progress: number; // 0-100
      timeRemaining: number; // minutes
      isLocked: boolean;
      prerequisites: string[]; // moduleIds that must be completed
    }
  };
  overallProgress: number; // 0-100
  timeRemaining: number; // total minutes remaining
}

interface ModuleSelectionEvent {
  moduleId: string;
  isLocked: boolean;
  status: 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETE';
  currentProgress: number;
}
```

### Custom Variable Schema
```typescript
interface CustomVariable {
  id: string;
  name: string;
  description: string;
  category: AssessmentCategory;
  type: QuestionType;
  applicableDisciplines: DisciplineType[];
  options?: Array<{
    value: string;
    score: number;
    text: string;
  }>;
  weight: number;
  trackingPeriod: string;
  targetValue?: number;
  createdBy: string; // User ID
  createdAt: Date;
  sopRelevant?: boolean;
  materialFinderRelevant?: boolean;
}
```

### Score Schema
```typescript
interface Score {
  questionId: string;
  rawScore: number;
  weightedScore: number;
  maxPossible: number;
  percentile?: number; // Compared to benchmark
  countryPercentile?: number; // Country-specific percentile
  practiceSizePercentile?: number; // Practice size specific percentile
  disciplinePercentile?: number; // Discipline-specific percentile
}

interface ModuleScore {
  moduleId: string;
  scores: Score[];
  totalRawScore: number;
  totalWeightedScore: number;
  maxPossible: number;
  percentageScore: number;
  percentile?: number; // Compared to benchmark
  countryPercentile?: number;
  practiceSizePercentile?: number;
  disciplinePercentile?: number;
  position: ScorePosition;
  strengths: string[]; // IDs of high-scoring questions
  weaknesses: string[]; // IDs of low-scoring questions
  sopRecommendations?: SOPType[]; // SOP types recommended based on scores
  actionPrompts: string[]; // Specific actions recommended based on scores
}

interface CategoryScore {
  category: AssessmentCategory;
  moduleScores: ModuleScore[];
  totalScore: number;
  maxPossible: number;
  percentageScore: number;
  percentile?: number; // Compared to benchmark
  countryPercentile?: number;
  practiceSizePercentile?: number;
  disciplinePercentile?: number;
  position: ScorePosition;
  actionPrompts: string[]; // Category-specific action prompts
}

interface OverallScore {
  categoryScores: CategoryScore[];
  totalScore: number;
  maxPossible: number;
  percentageScore: number;
  businessHealthIndex: number; // 0-100 normalized score
  percentile?: number; // Compared to benchmark
  countryPercentile?: number;
  practiceSizePercentile?: number;
  disciplinePercentile?: number;
  position: ScorePosition;
  customVariableScores?: {
    [variableId: string]: Score;
  };
  recommendedSOPs?: SOPType[]; // SOP types recommended based on overall assessment
  prioritizedActionPrompts: Array<{
    prompt: string;
    priority: number;
    category: AssessmentCategory;
    impact: string;
    timeframe: string;
  }>;
  materialFinderRecommendations: Array<{
    resourceType: MaterialResourceType;
    purpose: string;
    relevance: number; // 1-10 scale
  }>;
}
```

### Practice Profile Schema
```typescript
interface PracticeProfile {
  id: string;
  name: string;
  size: PracticeSize;
  practitioners: number;
  locations: number;
  specialties: string[];
  discipline: DisciplineType; // Primary discipline
  secondaryDisciplines?: DisciplineType[]; // For multi-disciplinary practices
  disciplineSpecifics?: {
    [key in DisciplineType]?: {
      focus: string[]; // Specific focus areas within the discipline
      certifications: string[];
      specialEquipment: string[];
      specializedServices: string[];
    }
  };
  country: Country;
  region: string;
  yearEstablished: number;
  revenueRange: string;
  patientVolume: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
```