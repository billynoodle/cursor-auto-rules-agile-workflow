/**
 * Facilities Module - Space Utilization Questions
 * 
 * These questions probe deeply into how effectively the practice utilizes its
 * physical space with intentionally challenging inquiries designed to reveal 
 * inefficiencies and opportunities for optimization.
 */

import { Question } from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import { AssessmentCategory } from '../../../models/AssessmentCategory';
import { DisciplineType } from '../../../models/DisciplineType';
import { PracticeSize } from '../../../models/PracticeSize';
import { Country } from '../../../models/Country';
import { ScorePosition } from '../../../models/ScorePosition';
import { SOPType } from '../../../models/SOPType';
import { MaterialResourceType } from '../../../models/MaterialResourceType';

export const spaceUtilizationQuestions: Question[] = [
  {
    id: 'fac-space-001',
    text: 'What is your treatment space utilization rate (actual treatment hours divided by available treatment hours)?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.FACILITIES,
    moduleId: 'mod-facilities-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 9,
    minScore: 0,
    maxScore: 100,
    helpText: 'Physical space is typically the highest fixed cost. Low utilization rates directly impact profitability and often indicate scheduling inefficiencies.',
    impactAreas: ['Operational costs', 'Revenue potential', 'Space planning'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'High-performing practices maintain >85%; <60% indicates serious utilization issues',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is wasting significant resources on underutilized space',
        actionPrompts: [
          'Implement space scheduling system to maximize utilization',
          'Consider shared or flexible treatment spaces',
          'Review lease terms and space requirements'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'fac-space-002',
    text: 'Do you track revenue per square foot, and if so, what is it?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FACILITIES,
    moduleId: 'mod-facilities-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'high_tracked', score: 5, text: 'Yes, >$500 per square foot annually with formal tracking' },
      { value: 'medium_tracked', score: 4, text: 'Yes, $300-500 per square foot annually with formal tracking' },
      { value: 'low_tracked', score: 2, text: 'Yes, <$300 per square foot annually with formal tracking' },
      { value: 'estimated', score: 1, text: 'Estimated without formal tracking' },
      { value: 'not_tracked', score: 0, text: 'Don\'t track revenue per square foot' }
    ],
    weight: 8,
    helpText: 'Revenue per square foot is a critical metric for space profitability. Low values indicate space inefficiency or lease overpayment.',
    impactAreas: ['Space profitability', 'Lease value', 'Business model efficiency'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has poor space economics threatening financial viability',
        actionPrompts: [
          'Analyze revenue by treatment room and service type',
          'Implement space allocation optimization',
          'Consider space reduction or subletting opportunities'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['space economics', 'facility optimization', 'cost management'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'fac-space-003',
    text: 'What is the average patient throughput time (total time from arrival to departure) for a typical visit?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FACILITIES,
    moduleId: 'mod-facilities-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'efficient', score: 5, text: 'Highly efficient with <5 minutes of non-treatment time' },
      { value: 'good', score: 4, text: '5-10 minutes of non-treatment time' },
      { value: 'moderate', score: 3, text: '11-15 minutes of non-treatment time' },
      { value: 'poor', score: 1, text: '16-25 minutes of non-treatment time' },
      { value: 'very_poor', score: 0, text: '>25 minutes of non-treatment time or not measured' }
    ],
    weight: 7,
    helpText: 'Non-treatment time represents lost revenue opportunity and reduced patient satisfaction. Each 5 minutes of waste typically costs $15-25 per visit.',
    impactAreas: ['Patient experience', 'Operational efficiency', 'Revenue optimization'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice workflow has critical efficiency gaps',
        actionPrompts: [
          'Map patient flow and identify bottlenecks',
          'Redesign check-in and transition processes',
          'Optimize treatment room layout and equipment placement'
        ],
        priority: 7,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'fac-space-004',
    text: 'Have you formally analyzed your space requirements based on service mix, and optimized your facility accordingly?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FACILITIES,
    moduleId: 'mod-facilities-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, with comprehensive analysis and regular optimization' },
      { value: 'basic', score: 3, text: 'Yes, with basic analysis and some optimization' },
      { value: 'informal', score: 2, text: 'Informal assessment without structured analysis' },
      { value: 'minimal', score: 1, text: 'Minimal consideration of space requirements' },
      { value: 'none', score: 0, text: 'No formal analysis conducted' }
    ],
    weight: 7,
    helpText: 'Space requirements vary significantly by service type. Without optimal allocation, practices often have both overcrowded and underutilized areas.',
    impactAreas: ['Operational efficiency', 'Patient experience', 'Revenue optimization'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice has significant space optimization opportunities',
        actionPrompts: [
          'Conduct detailed service-to-space requirement mapping',
          'Analyze utilization rates by room type and time period',
          'Develop space allocation plan based on service profitability'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'fac-space-005',
    text: 'What percentage of your facility space is dedicated to revenue-generating activities versus administrative functions?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.FACILITIES,
    moduleId: 'mod-facilities-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 8,
    minScore: 0,
    maxScore: 100,
    helpText: 'Only treatment space directly generates revenue. High percentages of administrative space reduce overall profitability per square foot.',
    impactAreas: ['Space economics', 'Revenue potential', 'Cost management'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'Best practice is >75% revenue-generating space; <60% indicates poor space economics',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has excessive non-revenue generating space',
        actionPrompts: [
          'Convert administrative areas to treatment space where possible',
          'Implement shared administrative workspaces',
          'Consider remote work options for administrative staff'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['space allocation', 'facility planning', 'revenue optimization'],
        contentPriority: 8
      }
    }
  }
]; 