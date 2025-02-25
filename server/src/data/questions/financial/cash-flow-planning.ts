/**
 * Financial Health Module - Cash Flow Planning Questions
 * 
 * These questions probe deeply into cash flow management practices with
 * intentionally challenging inquiries designed to reveal weaknesses in
 * accounts receivable management, cash reserves, and financial forecasting.
 * 
 * NOTE: As per the Tooltip Readability Review Initiative (2024-08-05),
 * all helpText in this file should be reviewed for:
 * - Plain language accessibility
 * - Elimination of unnecessary jargon
 * - Clarity of examples and explanations
 * - Appropriate context (benchmarks, metrics)
 * - Consistent tone and difficulty level
 * 
 * The accounts receivable aging profile question (fin-cash-001) has been updated with an enhanced
 * tooltip that can serve as a model for other questions in this module.
 */

import { Question } from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import { AssessmentCategory } from '../../../models/AssessmentCategory';
import { DisciplineType } from '../../../models/DisciplineType';
import { PracticeSize } from '../../../models/PracticeSize';
import { ScorePosition } from '../../../models/ScorePosition';
import { SOPType } from '../../../models/SOPType';

export const cashFlowPlanningQuestions: Question[] = [
  {
    id: 'fin-cash-001',
    text: 'What is your practice\'s current accounts receivable aging profile?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'excellent', score: 5, text: '>90% of AR under 30 days, <2% over 90 days' },
      { value: 'good', score: 4, text: '>80% of AR under 30 days, <5% over 90 days' },
      { value: 'average', score: 3, text: '>70% of AR under 30 days, <10% over 90 days' },
      { value: 'concerning', score: 1, text: '<70% of AR under 30 days, 10-20% over 90 days' },
      { value: 'critical', score: 0, text: '<60% of AR under 30 days, >20% over 90 days or don\'t track' }
    ],
    weight: 9,
    helpText: 'This question looks at how quickly you\'re getting paid after providing services. "Accounts receivable" (AR) simply means money owed to your practice by patients and insurance companies. The "aging profile" shows how long these unpaid bills have been outstanding. For example, if you have $10,000 in unpaid bills and $9,000 of that is from services provided in the last 30 days, then 90% of your AR is under 30 days (which is excellent). The longer bills remain unpaid, the less likely you\'ll ever collect them. For every day beyond 30 days, you lose roughly 1% chance of getting paid. Bills older than 90 days have less than a 50% chance of collection. Having most of your AR under 30 days means better cash flow and fewer collection headaches. You can check this in your practice management software by running an "AR aging report."',
    impactAreas: ['Cash flow', 'Revenue capture', 'Financial stability'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Weekly',
    benchmarkReference: 'High-performing practices maintain >85% of AR under 30 days',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has significant collection issues threatening cash flow',
        actionPrompts: [
          'Implement weekly AR aging review with focused follow-up',
          'Establish front-desk collection protocols for patient responsibility',
          'Review and revise insurance claim submission processes'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.FINANCIAL],
      ragParameters: {
        contextTags: ['accounts receivable', 'collections', 'aging management'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'fin-cash-002',
    text: 'What is your practice\'s minimum cash reserve policy (expressed as months of operating expenses)?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'robust', score: 5, text: '≥6 months of operating expenses' },
      { value: 'strong', score: 4, text: '4-5 months of operating expenses' },
      { value: 'adequate', score: 3, text: '3 months of operating expenses' },
      { value: 'minimal', score: 1, text: '1-2 months of operating expenses' },
      { value: 'none', score: 0, text: '<1 month or no formal cash reserve policy' }
    ],
    weight: 8,
    helpText: 'Cash reserves protect against revenue disruptions and enable strategic investments. Practices with <3 months of reserves are 4x more likely to face financial distress during business disruptions.',
    impactAreas: ['Financial stability', 'Crisis resilience', 'Strategic flexibility'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'Industry standard minimum: 3 months of operating expenses',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is extremely vulnerable to cash flow disruptions',
        actionPrompts: [
          'Establish formal cash reserve policy of minimum 3 months expenses',
          'Develop systematic reserve building plan with monthly contributions',
          'Create separate operating account for reserves to prevent commingling'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'fin-cash-003',
    text: 'How advanced is your practice\'s cash flow forecasting process?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'advanced', score: 5, text: 'Rolling 12-month forecast updated weekly with variance analysis and scenario planning' },
      { value: 'moderate', score: 4, text: '6-month forecast updated monthly with basic variance tracking' },
      { value: 'basic', score: 2, text: '3-month simple forecast updated quarterly' },
      { value: 'minimal', score: 1, text: 'Annual forecast with no regular updates' },
      { value: 'none', score: 0, text: 'No formal cash flow forecasting' }
    ],
    weight: 8,
    helpText: 'Cash flow forecasting enables proactive management and early problem detection. Practices with weekly forecasting typically identify cash shortfalls 45-60 days earlier than those using monthly or quarterly forecasting.',
    impactAreas: ['Financial planning', 'Investment timing', 'Crisis prevention'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Weekly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your cash management is reactive rather than proactive',
        actionPrompts: [
          'Implement 13-week rolling cash flow forecast updated weekly',
          'Create automated variance analysis comparing forecast to actual',
          'Develop early warning system for potential cash shortfalls'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.FINANCIAL],
      ragParameters: {
        contextTags: ['cash flow', 'forecasting', 'financial planning'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'fin-cash-004',
    text: 'What percentage of your patient responsibility amounts are collected at time of service?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'excellent', score: 5, text: '≥90% collected at time of service' },
      { value: 'good', score: 4, text: '75-89% collected at time of service' },
      { value: 'average', score: 2, text: '50-74% collected at time of service' },
      { value: 'poor', score: 1, text: '25-49% collected at time of service' },
      { value: 'critical', score: 0, text: '<25% collected at time of service or don\'t track' }
    ],
    weight: 9,
    helpText: 'Point-of-service collections dramatically improve cash flow and reduce AR work. Each 10% improvement in time-of-service collections typically reduces AR days by 3-5 days and improves collection rates by 5-7%.',
    impactAreas: ['Cash flow', 'Collection rates', 'Administrative efficiency'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Weekly',
    benchmarkReference: 'Top-performing practices collect >85% at time of service',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your point-of-service collection process is ineffective',
        actionPrompts: [
          'Implement pre-visit eligibility verification and patient responsibility estimation',
          'Train front desk staff on collection scripts and techniques',
          'Create incentive program tied to point-of-service collection rates'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'fin-cash-005',
    text: 'How do you manage payer mix to optimize cash flow timing and stability?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'strategic', score: 5, text: 'Strategic payer mix management with regular analysis and active portfolio adjustments' },
      { value: 'active', score: 3, text: 'Active awareness with some management of payer relationships' },
      { value: 'reactive', score: 1, text: 'Reactive adjustments when problems occur' },
      { value: 'none', score: 0, text: 'No formal management of payer mix' }
    ],
    weight: 7,
    helpText: 'Payer mix directly impacts payment timing and predictability. Strategic payer management can reduce average days to payment by 15-20% and improve cash flow predictability.',
    impactAreas: ['Revenue timing', 'Financial planning', 'Contract negotiations'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice lacks strategic management of payment sources',
        actionPrompts: [
          'Analyze payment timing and denial rates by payer',
          'Develop target payer mix strategy based on payment performance',
          'Implement quarterly payer performance reviews'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.FINANCIAL],
      ragParameters: {
        contextTags: ['payer mix', 'revenue cycle', 'contract management'],
        contentPriority: 7
      }
    }
  }
]; 