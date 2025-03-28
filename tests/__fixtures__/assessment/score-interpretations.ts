/**
 * Score Interpretation Fixtures
 * Provides standardized score ranges and interpretations for testing
 */

export interface ScoreRange {
  min: number;
  max: number;
  interpretation: string;
  priority: number;
}

export interface ScoreInterpretation {
  ranges: ScoreRange[];
}

export interface ScoreInterpretations {
  [questionId: string]: ScoreInterpretation;
}

export const testScoreInterpretations: ScoreInterpretations = {
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

// Common score ranges that can be reused
export const commonScoreRanges = {
  critical: { min: 0, max: 30, interpretation: 'Critical', priority: 9 },
  needsImprovement: { min: 31, max: 70, interpretation: 'Needs Improvement', priority: 6 },
  healthy: { min: 71, max: 100, interpretation: 'Healthy', priority: 3 }
}; 