# Epic-1: Core Assessment Framework Development for Allied Health Practices
# Story-1h: Design Comprehensive Business Assessment - Data Models/Schema (Part 1)

## Data Models / Schema

### Question Type Enum
```typescript
enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  LIKERT_SCALE = 'LIKERT_SCALE',
  NUMERIC = 'NUMERIC',
  TEXT = 'TEXT',
  MATRIX = 'MATRIX',
  RANKING = 'RANKING'
}
```

### Assessment Category Enum
```typescript
enum AssessmentCategory {
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
```

### Practice Size Enum
```typescript
enum PracticeSize {
  SOLO = 'SOLO',
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  ENTERPRISE = 'ENTERPRISE'
}
```

### Country Enum
```typescript
enum Country {
  AUSTRALIA = 'AUSTRALIA',
  NEW_ZEALAND = 'NEW_ZEALAND',
  UNITED_KINGDOM = 'UNITED_KINGDOM',
  UNITED_STATES = 'UNITED_STATES',
  CANADA = 'CANADA',
  OTHER = 'OTHER'
}
```

### Discipline Type Enum
```typescript
enum DisciplineType {
  PHYSIOTHERAPY = 'PHYSIOTHERAPY',
  OCCUPATIONAL_THERAPY = 'OCCUPATIONAL_THERAPY',
  SPEECH_PATHOLOGY = 'SPEECH_PATHOLOGY',
  DIETETICS = 'DIETETICS',
  PODIATRY = 'PODIATRY',
  CHIROPRACTIC = 'CHIROPRACTIC',
  OSTEOPATHY = 'OSTEOPATHY',
  PSYCHOLOGY = 'PSYCHOLOGY',
  EXERCISE_PHYSIOLOGY = 'EXERCISE_PHYSIOLOGY',
  OTHER = 'OTHER'
}
```

### SOP Type Enum
```typescript
enum SOPType {
  CLINICAL = 'CLINICAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  COMPLIANCE = 'COMPLIANCE',
  HR = 'HR',
  QUALITY = 'QUALITY',
  EMERGENCY = 'EMERGENCY',
  TECHNOLOGY = 'TECHNOLOGY'
}
```

### Score Position Enum
```typescript
enum ScorePosition {
  CRITICAL = 'CRITICAL',
  CONCERNING = 'CONCERNING',
  STABLE = 'STABLE',
  STRONG = 'STRONG',
  EXCEPTIONAL = 'EXCEPTIONAL'
}
```

### Material Resource Type Enum
```typescript
enum MaterialResourceType {
  TEMPLATE = 'TEMPLATE',
  FORM = 'FORM',
  CHECKLIST = 'CHECKLIST',
  REGULATION = 'REGULATION',
  STANDARD = 'STANDARD',
  GUIDELINE = 'GUIDELINE',
  EXAMPLE = 'EXAMPLE',
  TRAINING = 'TRAINING'
}
```

### Question Schema
```typescript
interface Question {
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
  helpText?: string; // Essential tooltip explanation that must use plain language, avoid jargon, include relevant metrics/context, and provide comprehensive information for complex topics (especially financial/compliance). Should clarify why the question matters to the practice.
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
```

## Test Environment Setup

### Test Configuration Schema
```typescript
// tests/setupTests.ts
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import * as ReactDOM from 'react-dom/client';
import { createElement } from 'react';
import { act } from '@testing-library/react';

// Testing Library Configuration
interface TestConfig {
  testIdAttribute: string;  // Attribute used for querying elements
}

// React Root Configuration
interface RootConfig {
  elementId: string;        // ID of root element for React rendering
  container: HTMLElement;   // Root container element
}

// Test Environment Setup
{
  config: TestConfig;       // Testing library configuration
  root: RootConfig;        // React root configuration
  cleanup: () => void;     // Cleanup function for after tests
  beforeAll: () => void;   // Setup function for before tests
}
```

### Test Environment Features
- Custom test ID attribute configuration
- React 18 concurrent mode initialization
- Automated cleanup after each test
- Console logging for debugging
- Mock implementations for external dependencies
- Proper React hooks initialization
- Test environment validation

### Test Setup Implementation
```typescript
// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Create root element for React
const rootElement = document.createElement('div');
rootElement.id = 'root';
document.body.appendChild(rootElement);

// Mock CSS modules
jest.mock('*.css', () => ({}));

// Initialize React hooks before tests
beforeAll(async () => {
  const root = ReactDOM.createRoot(rootElement);
  await act(async () => {
    root.render(createElement('div'));
  });
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});
```