/**
 * Geography Module - Demographic Analysis Questions
 * 
 * These questions probe deeply into practice demographic understanding with
 * intentionally challenging inquiries designed to reveal weaknesses in
 * target market analysis and population-based service planning.
 */

import { Question } from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import { AssessmentCategory } from '../../../models/AssessmentCategory';
import { DisciplineType } from '../../../models/DisciplineType';
import { PracticeSize } from '../../../models/PracticeSize';
import { ScorePosition } from '../../../models/ScorePosition';
import { SOPType } from '../../../models/SOPType';

export const demographicAnalysisQuestions: Question[] = [
  {
    id: 'geo-dem-001',
    text: 'How frequently do you analyze demographic trends in your service area?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.GEOGRAPHY,
    moduleId: 'mod-geography-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'quarterly', score: 5, text: 'Quarterly with detailed data analytics' },
      { value: 'annual', score: 4, text: 'Annual comprehensive review' },
      { value: 'occasional', score: 2, text: 'Occasional/ad-hoc review (every 2-3 years)' },
      { value: 'rare', score: 1, text: 'Rarely (>3 years between analyses)' },
      { value: 'never', score: 0, text: 'Never conducted demographic analysis' }
    ],
    weight: 7,
    helpText: 'Demographic shifts can rapidly change service needs. Practices tracking demographic changes typically adjust service offerings 30% faster than peers, capturing emerging markets.',
    impactAreas: ['Service planning', 'Market targeting', 'Future growth'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is operating blindly to demographic realities and trends',
        actionPrompts: [
          'Implement quarterly demographic trend analysis',
          'Subscribe to local demographic data services',
          'Create demographic-based service development plan'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.MARKETING, SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['demographic analysis', 'market research', 'population trends'],
        contentPriority: 7
      }
    }
  },
  {
    id: 'geo-dem-002',
    text: 'What percentage of your service offerings were developed specifically based on demographic analysis?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.GEOGRAPHY,
    moduleId: 'mod-geography-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: '0-20', score: 0, text: '0-20%' },
      { value: '21-40', score: 1, text: '21-40%' },
      { value: '41-60', score: 3, text: '41-60%' },
      { value: '61-80', score: 4, text: '61-80%' },
      { value: '81-100', score: 5, text: '81-100%' }
    ],
    weight: 8,
    helpText: 'Services aligned with demographic needs typically show 40-60% higher utilization rates. Misaligned services often struggle with low utilization despite marketing efforts.',
    impactAreas: ['Service utilization', 'Revenue optimization', 'Market alignment'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'High-performing practices align 60%+ of services to demographic analysis',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your service development is disconnected from demographic realities',
        actionPrompts: [
          'Analyze current service utilization by demographic segments',
          'Identify 3-5 demographically aligned service opportunities',
          'Develop pilot program for highest potential demographic segment'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'geo-dem-003',
    text: 'Do you have data on the aging trends in your service area and age-specific service plans?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.GEOGRAPHY,
    moduleId: 'mod-geography-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, detailed aging trend data with specific service plans for each age segment' },
      { value: 'basic', score: 3, text: 'Yes, basic aging data with some age-targeted services' },
      { value: 'minimal', score: 1, text: 'Minimal age-related data with generic services' },
      { value: 'none', score: 0, text: 'No age-trend data or age-specific planning' }
    ],
    weight: 9,
    helpText: 'Age demographics profoundly impact service needs. Practices with age-specific service paths typically achieve 35-45% better clinical outcomes and higher satisfaction.',
    impactAreas: ['Service specialization', 'Clinical outcomes', 'Patient satisfaction'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice ignores age-specific needs, risking clinical and business outcomes',
        actionPrompts: [
          'Analyze local census data for aging patterns in your area',
          'Develop specific service protocols for 2-3 age groups',
          'Train staff on age-specific care considerations'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['aging population', 'age-specific care', 'demographic specialization'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'geo-dem-004',
    text: 'Have you mapped income distribution in your service area and aligned your pricing strategy accordingly?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.GEOGRAPHY,
    moduleId: 'mod-geography-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, detailed income mapping with tiered pricing strategy' },
      { value: 'basic', score: 3, text: 'Yes, basic income data with some price considerations' },
      { value: 'minimal', score: 1, text: 'Minimal income data with standard pricing' },
      { value: 'none', score: 0, text: 'No income analysis affecting pricing' }
    ],
    weight: 8,
    helpText: 'Pricing misaligned with local income realities leads to accessibility barriers or revenue leakage. Income-aligned pricing can increase market penetration by 25-35%.',
    impactAreas: ['Pricing strategy', 'Service accessibility', 'Market penetration'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your pricing is disconnected from economic realities of your market',
        actionPrompts: [
          'Map income distribution by zip code in your service area',
          'Analyze price sensitivity and develop tiered pricing options',
          'Create sliding scale or scholarship programs if serving diverse income areas'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'geo-dem-005',
    text: 'Do you track cultural and language diversity in your service area with corresponding service adaptations?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.GEOGRAPHY,
    moduleId: 'mod-geography-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive cultural data with fully adapted services and materials' },
      { value: 'basic', score: 3, text: 'Yes, basic cultural awareness with some adapted materials' },
      { value: 'minimal', score: 1, text: 'Minimal cultural considerations' },
      { value: 'none', score: 0, text: 'No cultural adaptation or language services' }
    ],
    weight: 7,
    helpText: 'Cultural barriers significantly impact care access and compliance. Practices with culturally adapted services typically reach 30-40% more diverse populations.',
    impactAreas: ['Cultural competence', 'Service accessibility', 'Community reputation'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice ignores cultural diversity, limiting patient access',
        actionPrompts: [
          'Analyze language and cultural demographics in your area',
          'Develop materials in 2-3 most common languages in your area',
          'Train staff on cultural competence for predominant cultural groups'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.CLINICAL],
      ragParameters: {
        contextTags: ['cultural competence', 'language services', 'diversity'],
        contentPriority: 7
      }
    }
  }
]; 