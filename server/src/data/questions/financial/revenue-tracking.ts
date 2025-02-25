/**
 * Financial Health Module - Revenue Tracking Questions
 * 
 * These questions probe deeply into financial management practices with 
 * intentionally challenging inquiries designed to reveal weaknesses in
 * revenue tracking and financial management.
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

export const revenueTrackingQuestions: Question[] = [
  {
    id: 'fin-rev-001',
    text: 'What is your practice\'s current debt-to-revenue ratio?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 9,
    minScore: 0,
    maxScore: 100,
    helpText: 'This ratio reveals your practice\'s financial health. High ratios (>40%) indicate dangerous leverage levels.',
    impactAreas: ['Financial stability', 'Borrowing capacity', 'Business risk'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'Industry healthy range: 15-30%',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is dangerously over-leveraged and at high risk of financial failure',
        actionPrompts: [
          'Contact a financial advisor immediately',
          'Develop emergency debt reduction plan',
          'Consider restructuring options to avoid potential insolvency'
        ],
        priority: 10,
        timeframe: 'Immediate (within 2 weeks)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.COMPLIANCE],
      ragParameters: {
        contextTags: ['debt management', 'financial risk', 'leverage'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'fin-rev-002',
    text: 'How often do you analyze your revenue per practitioner hour and compare it to your actual labor costs?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'weekly', score: 5, text: 'Weekly with formal review' },
      { value: 'monthly', score: 4, text: 'Monthly with formal review' },
      { value: 'quarterly', score: 3, text: 'Quarterly with formal review' },
      { value: 'annually', score: 1, text: 'Annually or less frequently' },
      { value: 'never', score: 0, text: 'Never done this analysis' }
    ],
    weight: 8,
    helpText: 'This analysis exposes unprofitable practitioners or services that may be hidden in aggregate numbers.',
    impactAreas: ['Practitioner profitability', 'Service pricing', 'Schedule optimization'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['practitioner profitability', 'revenue analysis', 'labor costs'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'fin-rev-003',
    text: 'What percentage of your invoices remain unpaid after 60 days?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 8,
    minScore: 0,
    maxScore: 100,
    helpText: 'Aging receivables drain cash flow and may indicate underlying problems with your billing processes or client selection.',
    impactAreas: ['Cash flow', 'Operational efficiency', 'Client relationships'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'Industry standard is <5%; >15% indicates serious collection issues',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has dangerous cash flow issues from poor receivables management',
        actionPrompts: [
          'Implement immediate payment terms enforcement',
          'Review credit policies for all clients',
          'Consider factoring receivables for immediate cash flow'
        ],
        priority: 9,
        timeframe: 'Immediate (within 1 month)'
      }
    }
  },
  {
    id: 'fin-rev-004',
    text: 'Do you know the exact profit margin for each specific service you offer, including allocated overhead?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, with comprehensive activity-based costing for all services' },
      { value: 'estimated', score: 3, text: 'Yes, but with estimated overhead allocation' },
      { value: 'partial', score: 2, text: 'Only for major service categories, not individual services' },
      { value: 'basic', score: 1, text: 'Only track overall practice margins, not by service' },
      { value: 'none', score: 0, text: 'Don\'t track profit margins by service' }
    ],
    weight: 9,
    helpText: 'Without service-level profitability analysis, you may be unknowingly subsidizing unprofitable services at the expense of profitable ones.',
    impactAreas: ['Service profitability', 'Strategic planning', 'Pricing strategy'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['profit analysis', 'service profitability', 'cost allocation'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'fin-rev-005',
    text: 'What is your practice\'s current cash reserve in terms of months of operating expenses?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 10,
    minScore: 0,
    maxScore: 24,
    helpText: 'Cash reserves are your business\'s lifeline during downturns or unexpected events. Insufficient reserves put your entire practice at risk.',
    impactAreas: ['Business continuity', 'Risk management', 'Strategic flexibility'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'Industry minimum is 3 months; recommended is 6+ months',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is extremely vulnerable to even minor business disruptions',
        actionPrompts: [
          'Develop emergency cash preservation plan',
          'Review all expenses for immediate reduction opportunities',
          'Establish credit line before financial distress is apparent'
        ],
        priority: 10,
        timeframe: 'Immediate (within 2 weeks)'
      }
    }
  }
]; 