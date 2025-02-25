/**
 * Marketing Module - Referral Strategy Questions
 * 
 * These questions probe deeply into referral source management and optimization with
 * intentionally challenging inquiries designed to reveal weaknesses in how
 * practices acquire and maintain their patient pipeline.
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

export const referralStrategyQuestions: Question[] = [
  {
    id: 'mkt-ref-001',
    text: 'What percentage of your new patients come from your top three referral sources?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.MARKETING,
    moduleId: 'mod-marketing-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 9,
    minScore: 0,
    maxScore: 100,
    helpText: 'High concentration in few referral sources creates dangerous dependency. Loss of a single major referrer can devastate practice revenue.',
    impactAreas: ['Business risk', 'Growth stability', 'Market positioning'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'Best practice is <50%; >70% indicates dangerous dependency',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has extreme vulnerability to referral source loss',
        actionPrompts: [
          'Develop referral diversification strategy with specific targets',
          'Create specialized marketing programs for underrepresented sources',
          'Implement risk mitigation plan for top referrer loss'
        ],
        priority: 9,
        timeframe: 'Immediate (within 2 weeks)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.MARKETING],
      ragParameters: {
        contextTags: ['referral source management', 'business risk', 'patient acquisition'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'mkt-ref-002',
    text: 'Do you track the lifetime value, acquisition cost, and retention rate for patients from each referral source?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.MARKETING,
    moduleId: 'mod-marketing-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive tracking with source-specific strategies' },
      { value: 'basic_metrics', score: 3, text: 'Track basic metrics but limited source-specific analysis' },
      { value: 'overall_only', score: 2, text: 'Track overall metrics only, not by referral source' },
      { value: 'minimal', score: 1, text: 'Minimal tracking of referral effectiveness' },
      { value: 'none', score: 0, text: 'No formal tracking of these metrics' }
    ],
    weight: 8,
    helpText: 'Without source-specific analysis, practices often invest in low-value referral channels while neglecting high-value ones.',
    impactAreas: ['Marketing ROI', 'Patient acquisition strategy', 'Resource allocation'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice cannot identify which referral sources provide the best ROI',
        actionPrompts: [
          'Implement source tracking codes in practice management system',
          'Develop referral source dashboard with key metrics',
          'Create source-specific value analysis protocol'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.MARKETING, SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['referral analysis', 'marketing metrics', 'patient acquisition'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'mkt-ref-003',
    text: 'What specific value do you provide to your top referral sources beyond quality patient care?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.MARKETING,
    moduleId: 'mod-marketing-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Comprehensive value program with multiple tangible benefits' },
      { value: 'moderate', score: 3, text: 'Moderate value offerings beyond patient care' },
      { value: 'basic', score: 2, text: 'Basic communication and occasional value-adds' },
      { value: 'minimal', score: 1, text: 'Minimal effort beyond quality care' },
      { value: 'none', score: 0, text: 'No specific value beyond patient care' }
    ],
    weight: 8,
    helpText: 'In competitive markets, quality care alone is rarely sufficient to maintain referral relationships. Referrers expect additional value.',
    impactAreas: ['Referral loyalty', 'Competitive positioning', 'Referral volume'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is highly vulnerable to referrer poaching by competitors',
        actionPrompts: [
          'Conduct referrer needs assessment for top 5 sources',
          'Develop personalized value program for each major referrer',
          'Implement regular value delivery calendar'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.MARKETING],
      ragParameters: {
        contextTags: ['referral relationship', 'value delivery', 'competitive positioning'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'mkt-ref-004',
    text: 'What percentage of your patients are self-referred (direct-to-consumer) versus provider-referred?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.MARKETING,
    moduleId: 'mod-marketing-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 7,
    minScore: 0,
    maxScore: 100,
    helpText: 'Heavy dependence on either channel creates vulnerability. Direct access patients often have higher retention and lifetime value.',
    impactAreas: ['Market independence', 'Business model resilience', 'Marketing strategy'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'Best practice is 30-50% direct access; <20% or >80% increases vulnerability',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice has an imbalanced patient acquisition model',
        actionPrompts: [
          'Develop strategy to diversify acquisition channels',
          'Create specific marketing plan for underrepresented channel',
          'Set quarterly targets for channel balancing'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'mkt-ref-005',
    text: 'Do you have a formalized referral recovery program for previously active referrers who have decreased or stopped sending patients?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.MARKETING,
    moduleId: 'mod-marketing-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, with automated alerts, root cause analysis, and formal recovery protocol' },
      { value: 'basic', score: 3, text: 'Yes, basic tracking and outreach when referrals decline' },
      { value: 'reactive', score: 2, text: 'Reactive approach when major declines are noticed' },
      { value: 'minimal', score: 1, text: 'Minimal attention to declining referrers' },
      { value: 'none', score: 0, text: 'No formal program for referral recovery' }
    ],
    weight: 8,
    helpText: 'Recovering a lost referrer is 3-5x more cost-effective than developing a new one. Most practices lose 15-25% of referrers annually without a recovery program.',
    impactAreas: ['Referral stability', 'Marketing efficiency', 'Relationship management'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is bleeding referral sources without intervention',
        actionPrompts: [
          'Implement referral pattern monitoring system with alerts',
          'Develop formalized recovery protocol for declining referrers',
          'Create win-back campaign for dormant referral sources'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.MARKETING],
      ragParameters: {
        contextTags: ['referral recovery', 'relationship management', 'referral tracking'],
        contentPriority: 8
      }
    }
  }
]; 