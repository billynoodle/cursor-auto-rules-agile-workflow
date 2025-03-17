/**
 * Test Assessment Fixture
 * Provides sample assessment data for testing
 */

export interface AssessmentQuestion {
  id: string;
  category: string;
  text: string;
  type: 'numeric' | 'choice' | 'text';
  weight: number;
  applicableDisciplines: string[];
  applicablePracticeSizes: string[];
}

export interface AssessmentResponse {
  questionId: string;
  value: string | number;
  score: number;
}

export interface Assessment {
  id: string;
  practiceId: string;
  name: string;
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  responses: AssessmentResponse[];
}

// Sample Questions
export const testQuestions: AssessmentQuestion[] = [
  {
    id: 'fin-rev-001',
    category: 'FINANCIAL',
    text: 'What is your average monthly revenue?',
    type: 'numeric',
    weight: 10,
    applicableDisciplines: ['PHYSIOTHERAPY'],
    applicablePracticeSizes: ['SMALL', 'MEDIUM', 'LARGE']
  },
  {
    id: 'ops-flow-001',
    category: 'OPERATIONS',
    text: 'How many patients do you see per day?',
    type: 'numeric',
    weight: 8,
    applicableDisciplines: ['PHYSIOTHERAPY'],
    applicablePracticeSizes: ['SMALL', 'MEDIUM', 'LARGE']
  }
];

// Sample Assessment
export const testAssessment: Assessment = {
  id: 'test-assessment-1',
  practiceId: 'test-practice-1',
  name: 'Test Assessment',
  status: 'in_progress',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  responses: [
    {
      questionId: 'fin-rev-001',
      value: 50000,
      score: 75
    },
    {
      questionId: 'ops-flow-001',
      value: 20,
      score: 85
    }
  ]
};

// Sample Score Interpretations
export const testScoreInterpretations = {
  'fin-rev-001': {
    ranges: [
      { min: 0, max: 30, interpretation: 'Critical', priority: 9 },
      { min: 31, max: 70, interpretation: 'Needs Improvement', priority: 6 },
      { min: 71, max: 100, interpretation: 'Healthy', priority: 3 }
    ]
  },
  'ops-flow-001': {
    ranges: [
      { min: 0, max: 40, interpretation: 'Below Target', priority: 7 },
      { min: 41, max: 80, interpretation: 'Meeting Target', priority: 4 },
      { min: 81, max: 100, interpretation: 'Exceeding Target', priority: 2 }
    ]
  }
}; 