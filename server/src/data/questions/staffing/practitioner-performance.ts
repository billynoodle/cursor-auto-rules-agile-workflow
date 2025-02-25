/**
 * Staffing Module - Practitioner Performance Questions
 * 
 * These questions probe deeply into how the practice manages, measures, and
 * incentivizes practitioner performance with intentionally challenging inquiries
 * designed to reveal weaknesses in performance management and productivity.
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

export const practitionerPerformanceQuestions: Question[] = [
  {
    id: 'staff-perf-001',
    text: 'Do you track individual practitioner productivity, quality metrics, and patient satisfaction, and if so, how frequently is this data reviewed?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive_weekly', score: 5, text: 'Yes, comprehensive metrics reviewed weekly with formal process' },
      { value: 'comprehensive_monthly', score: 4, text: 'Yes, comprehensive metrics reviewed monthly with formal process' },
      { value: 'basic_monthly', score: 3, text: 'Yes, basic metrics reviewed monthly' },
      { value: 'sporadic', score: 1, text: 'Limited metrics reviewed sporadically' },
      { value: 'none', score: 0, text: 'Do not track individual performance metrics' }
    ],
    weight: 9,
    helpText: 'Without individual performance tracking, high and low performers remain unidentified. Performance visibility typically improves productivity by 15-25%.',
    impactAreas: ['Practice profitability', 'Quality of care', 'Staff development'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice lacks fundamental performance management processes',
        actionPrompts: [
          'Implement comprehensive practitioner performance dashboard',
          'Establish weekly performance review process',
          'Develop intervention protocol for underperforming practitioners'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.HR],
      ragParameters: {
        contextTags: ['performance management', 'practitioner metrics', 'productivity monitoring'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'staff-perf-002',
    text: 'What is the percentage difference in productivity between your highest and lowest performing practitioners?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 8,
    minScore: 0,
    maxScore: 100,
    helpText: 'High productivity variation indicates management, training, or hiring issues. Each 10% variation below average represents significant lost revenue.',
    impactAreas: ['Revenue optimization', 'Staffing efficiency', 'Clinical standardization'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'High-performing practices maintain <20% variation; >40% indicates serious performance management issues',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has extreme practitioner productivity disparities',
        actionPrompts: [
          'Analyze root causes of performance variation',
          'Implement standardized protocols and expectations',
          'Develop performance improvement plans for lowest performers'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'staff-perf-003',
    text: 'How do you measure and incentivize quality of care, not just quantity of visits?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Comprehensive quality metrics with formal incentives and consequences' },
      { value: 'basic_incentives', score: 4, text: 'Basic quality metrics with some incentives' },
      { value: 'measure_only', score: 3, text: 'Measure quality metrics without formal incentives' },
      { value: 'subjective', score: 1, text: 'Subjective quality assessment only' },
      { value: 'quantity_only', score: 0, text: 'Focus only on quantity metrics' }
    ],
    weight: 9,
    helpText: 'Purely volume-based incentives often sacrifice quality. Balanced measurement systems improve both patient outcomes and financial performance.',
    impactAreas: ['Clinical quality', 'Patient outcomes', 'Practitioner behavior'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice incentivizes volume at the expense of quality',
        actionPrompts: [
          'Implement balanced scorecard with quality metrics',
          'Create quality-based incentive structure',
          'Develop outcome-based performance standards'
        ],
        priority: 9,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.HR, SOPType.QUALITY],
      ragParameters: {
        contextTags: ['quality incentives', 'performance measurement', 'balanced scorecard'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'staff-perf-004',
    text: 'What percentage of your practitioners consistently meet or exceed their productivity targets while maintaining quality standards?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 8,
    minScore: 0,
    maxScore: 100,
    helpText: 'Consistent underperformance significantly impacts practice profitability and indicates hiring, training, or management deficiencies.',
    impactAreas: ['Practice profitability', 'Operational efficiency', 'Staff alignment'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'High-performing practices maintain >85%; <60% indicates serious productivity issues',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has widespread productivity deficiencies',
        actionPrompts: [
          'Review productivity targets for appropriateness',
          'Implement performance improvement process for underperforming practitioners',
          'Evaluate scheduling and operational barriers to productivity'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'staff-perf-005',
    text: 'Do you have a formal process for identifying and addressing underperforming practitioners, and if so, how quickly does intervention occur?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'immediate', score: 5, text: 'Yes, with immediate intervention (within days) when performance drops' },
      { value: 'rapid', score: 4, text: 'Yes, with intervention within 2 weeks of identified issues' },
      { value: 'monthly', score: 3, text: 'Yes, with monthly performance reviews and intervention' },
      { value: 'informal', score: 1, text: 'Informal or inconsistent intervention process' },
      { value: 'none', score: 0, text: 'No formal process for performance intervention' }
    ],
    weight: 8,
    helpText: 'Delayed intervention allows underperformance to continue, affecting revenue, morale, and patient outcomes. Each month of uncorrected issues typically costs 1.5-2x the practitioner\'s salary.',
    impactAreas: ['Practice profitability', 'Team dynamics', 'Service quality'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice allows underperformance to continue unchecked',
        actionPrompts: [
          'Implement performance alert system for early detection',
          'Develop structured intervention protocol with clear timelines',
          'Train managers on performance conversations and improvement planning'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.HR, SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['performance management', 'corrective action', 'practitioner development'],
        contentPriority: 8
      }
    }
  }
]; 