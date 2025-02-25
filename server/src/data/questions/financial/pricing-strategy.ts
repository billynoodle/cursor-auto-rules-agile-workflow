/**
 * Financial Health Module - Pricing Strategy Questions
 * 
 * These questions probe deeply into pricing practices and profitability with
 * intentionally challenging inquiries designed to reveal weaknesses in
 * pricing strategy and competitive positioning.
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

export const pricingStrategyQuestions: Question[] = [
  {
    id: 'fin-price-001',
    text: 'What specific data points do you use to set your service prices?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Comprehensive analysis (costs, market rates, value, practitioner expertise, competitive positioning)' },
      { value: 'market_cost', score: 4, text: 'Market rates and cost analysis' },
      { value: 'market', score: 3, text: 'Primarily market rates' },
      { value: 'cost_plus', score: 2, text: 'Cost-plus markup only' },
      { value: 'arbitrary', score: 0, text: 'Arbitrary or historical pricing without recent analysis' }
    ],
    weight: 9,
    helpText: 'Pricing without comprehensive data leads to leaving money on the table or pricing yourself out of the market.',
    impactAreas: ['Revenue optimization', 'Competitive positioning', 'Profitability'],
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
        contextTags: ['pricing strategy', 'competitive analysis', 'value-based pricing'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'fin-price-002',
    text: 'When was the last time you raised your prices, and by what percentage?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'recent_significant', score: 5, text: 'Within past year by 5% or more' },
      { value: 'recent_modest', score: 4, text: 'Within past year by less than 5%' },
      { value: 'over_year', score: 3, text: '1-2 years ago' },
      { value: 'over_two_years', score: 1, text: 'More than 2 years ago' },
      { value: 'never', score: 0, text: 'Never raised prices or don\'t know' }
    ],
    weight: 8,
    helpText: 'Failure to regularly adjust pricing leads to margin erosion as costs increase over time. Even small increases compound significantly.',
    impactAreas: ['Profit margins', 'Revenue growth', 'Business sustainability'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'Best practice is annual increases of at least 3-5%, even without other market changes',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your pricing has stagnated while costs have likely increased substantially',
        actionPrompts: [
          'Conduct immediate price review with detailed cost analysis',
          'Implement staged price increases to avoid shocking clients',
          'Develop value communication strategy for announcing increases'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'fin-price-003',
    text: 'Do you offer discounts, and if so, what is your documented strategy for when and how they are applied?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'strategic', score: 5, text: 'Strategic discounting with documented rules, approval processes, and ROI tracking' },
      { value: 'documented', score: 3, text: 'Documented discount policies but limited tracking or analysis' },
      { value: 'informal', score: 2, text: 'Informal discounting at staff discretion' },
      { value: 'inconsistent', score: 1, text: 'Inconsistent discounting with no formal policy' },
      { value: 'none', score: 4, text: 'No discounts offered' }
    ],
    weight: 7,
    helpText: 'Uncontrolled discounting can rapidly erode margins and train clients to expect lower prices. Each 1% discount requires 3-4% volume increase to maintain profits.',
    impactAreas: ['Price integrity', 'Margin management', 'Value perception'],
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
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.FINANCIAL],
      ragParameters: {
        contextTags: ['discount policy', 'price management', 'margin protection'],
        contentPriority: 7
      }
    }
  },
  {
    id: 'fin-price-004',
    text: 'What is your highest-margin service, and what percentage of your total revenue does it represent?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'high_margin_high_volume', score: 5, text: 'Know highest margin service and it represents >30% of revenue' },
      { value: 'high_margin_medium_volume', score: 4, text: 'Know highest margin service and it represents 15-30% of revenue' },
      { value: 'high_margin_low_volume', score: 3, text: 'Know highest margin service but it represents <15% of revenue' },
      { value: 'uncertain_margins', score: 1, text: 'Uncertain which service has highest margins' },
      { value: 'unknown', score: 0, text: 'Don\'t track service-level margins' }
    ],
    weight: 8,
    helpText: 'Understanding your profit drivers is essential for strategic planning. Successful practices maximize their highest-margin services while maintaining quality.',
    impactAreas: ['Strategic focus', 'Profit maximization', 'Service mix optimization'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    disciplineSpecific: {
      [DisciplineType.PHYSIOTHERAPY]: {
        helpText: 'For physiotherapy practices, specialized services often have significantly higher margins than general treatments. Understand your unique value offerings.'
      }
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice lacks fundamental understanding of its profit drivers',
        actionPrompts: [
          'Conduct immediate service profitability analysis',
          'Review scheduling to prioritize high-margin services',
          'Develop marketing strategy focusing on most profitable services'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'fin-price-005',
    text: 'Have you ever calculated the lifetime value of your average patient, and if so, how does it compare to your patient acquisition cost?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'calculated_strong', score: 5, text: 'Yes, calculated LTV is >5x acquisition cost' },
      { value: 'calculated_adequate', score: 4, text: 'Yes, calculated LTV is 3-5x acquisition cost' },
      { value: 'calculated_weak', score: 2, text: 'Yes, calculated LTV is <3x acquisition cost' },
      { value: 'estimated', score: 1, text: 'Only rough estimates without formal calculation' },
      { value: 'not_calculated', score: 0, text: 'Never calculated either metric' }
    ],
    weight: 9,
    helpText: 'Patient lifetime value (LTV) should substantially exceed acquisition costs. Low ratios indicate pricing, retention, or referral problems that threaten sustainability.',
    impactAreas: ['Marketing ROI', 'Patient retention', 'Business valuation'],
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
        interpretation: 'Your practice may be spending more to acquire patients than their value justifies',
        actionPrompts: [
          'Calculate detailed patient lifetime value by referral source',
          'Develop patient retention strategy to increase lifetime value',
          'Review pricing strategy and upselling opportunities'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.MARKETING],
      ragParameters: {
        contextTags: ['patient lifetime value', 'acquisition cost', 'marketing ROI'],
        contentPriority: 9
      }
    }
  }
]; 