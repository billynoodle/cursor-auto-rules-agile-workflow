/**
 * Compliance Module - Risk Management Questions
 * 
 * These questions probe deeply into compliance risks and management with
 * intentionally challenging inquiries designed to reveal vulnerabilities and
 * expose potentially costly compliance gaps.
 * 
 * NOTE: As per the Tooltip Readability Review Initiative (2024-08-05),
 * all helpText in this file should be reviewed for:
 * - Plain language accessibility
 * - Elimination of unnecessary jargon
 * - Clarity of examples and explanations
 * - Appropriate context (benchmarks, metrics)
 * - Consistent tone and difficulty level
 * 
 * The compliance risk assessment question (comp-risk-001) has been updated with an enhanced
 * tooltip that can serve as a model for other questions in this module.
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

export const riskManagementQuestions: Question[] = [
  {
    id: 'comp-risk-001',
    text: 'When was your last comprehensive compliance risk assessment conducted, and by whom?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.COMPLIANCE,
    moduleId: 'mod-compliance-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'recent_external', score: 5, text: 'Within past year by qualified external party' },
      { value: 'recent_internal', score: 3, text: 'Within past year internally' },
      { value: 'outdated_external', score: 2, text: '1-3 years ago by external party' },
      { value: 'outdated_internal', score: 1, text: '1-3 years ago internally' },
      { value: 'never', score: 0, text: 'Never conducted or >3 years ago' }
    ],
    weight: 10,
    helpText: 'A compliance risk assessment is simply a check-up of your practice\'s ability to follow healthcare rules and regulations. Think of it like a safety inspection for your business. These assessments look for gaps in how you protect patient information, bill insurance correctly, maintain proper documentation, and follow healthcare laws. Rules change frequently, and penalties for breaking them can be severe—often $10,000+ per violation. Having an independent expert do this assessment is best because they bring fresh eyes and specialized knowledge. For example, they might spot that your patient consent forms are outdated, your staff needs HIPAA refresher training, or your documentation doesn\'t support the billing codes you\'re using. Without regular assessments, many practices unknowingly develop bad habits that can lead to insurance audits, refund demands, fines, or even exclusion from insurance programs.',
    impactAreas: ['Legal risk', 'Financial penalties', 'Practice reputation'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'Best practice is annual third-party assessment; never conducting one violates multiple regulations',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has severe unidentified compliance risks',
        actionPrompts: [
          'Schedule immediate compliance risk assessment with qualified third party',
          'Implement interim compliance enhancement measures',
          'Develop ongoing compliance monitoring program'
        ],
        priority: 10,
        timeframe: 'Immediate (within 2 weeks)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.COMPLIANCE],
      ragParameters: {
        contextTags: ['compliance assessment', 'regulatory risk', 'legal requirements'],
        contentPriority: 10,
        requiredInclusions: ['assessment frequency', 'scope requirements', 'documentation standards']
      }
    }
  },
  {
    id: 'comp-risk-002',
    text: 'Do you have a formal breach response plan with specific procedures, roles, and regulatory notification processes?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.COMPLIANCE,
    moduleId: 'mod-compliance-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive plan with regular testing and updates' },
      { value: 'documented', score: 3, text: 'Yes, documented plan but not regularly tested' },
      { value: 'informal', score: 1, text: 'Informal or incomplete plan' },
      { value: 'none', score: 0, text: 'No formal breach response plan' }
    ],
    weight: 9,
    helpText: 'Breaches without proper response typically increase cost by 25-40% and heighten regulatory penalties. Most practices will experience at least one breach.',
    impactAreas: ['Regulatory compliance', 'Breach cost mitigation', 'Reputation management'],
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
        interpretation: 'Your practice is critically unprepared for inevitable security incidents',
        actionPrompts: [
          'Develop formal breach response plan with notification procedures',
          'Define specific staff roles and responsibilities',
          'Schedule annual tabletop exercise to test procedures'
        ],
        priority: 9,
        timeframe: 'Immediate (within 2 weeks)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.COMPLIANCE, SOPType.EMERGENCY],
      ragParameters: {
        contextTags: ['breach response', 'incident management', 'notification procedure'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'comp-risk-003',
    text: 'What percentage of your clinical documentation would pass a rigorous third-party audit for compliance with current billing requirements?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.COMPLIANCE,
    moduleId: 'mod-compliance-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 9,
    minScore: 0,
    maxScore: 100,
    helpText: 'Documentation deficiencies are the leading cause of claim denials, audits, and recoupments. Most practices overestimate their compliance by 30-50%.',
    impactAreas: ['Audit risk', 'Recoupment exposure', 'Billing compliance'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'Best practice is >95%; <80% represents significant financial risk',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has dangerous documentation vulnerabilities',
        actionPrompts: [
          'Conduct third-party documentation audit',
          'Implement documentation templates aligned with payer requirements',
          'Schedule mandatory documentation compliance training'
        ],
        priority: 9,
        timeframe: 'Immediate (within 2 weeks)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.COMPLIANCE, SOPType.CLINICAL],
      ragParameters: {
        contextTags: ['clinical documentation', 'billing compliance', 'audit preparation'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'comp-risk-004',
    text: 'Do you regularly conduct mock audits of high-risk compliance areas, and if so, how often?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.COMPLIANCE,
    moduleId: 'mod-compliance-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'quarterly', score: 5, text: 'Yes, quarterly mock audits with formal process' },
      { value: 'biannual', score: 4, text: 'Yes, twice yearly mock audits' },
      { value: 'annual', score: 3, text: 'Yes, annual mock audits' },
      { value: 'irregular', score: 1, text: 'Irregular or sporadic mock audits' },
      { value: 'none', score: 0, text: 'No mock audits conducted' }
    ],
    weight: 8,
    helpText: 'Proactive mock audits identify issues before real auditors do. Practices conducting regular mock audits typically reduce compliance penalties by 60-80%.',
    impactAreas: ['Audit readiness', 'Compliance culture', 'Risk reduction'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is blind to compliance violations until discovered by auditors',
        actionPrompts: [
          'Implement quarterly mock audit program',
          'Develop audit focus rotation schedule for high-risk areas',
          'Create corrective action protocol for identified issues'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.COMPLIANCE],
      ragParameters: {
        contextTags: ['mock audit', 'compliance monitoring', 'risk assessment'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'comp-risk-005',
    text: 'What percentage of your total revenue is at risk if your top compliance vulnerability were discovered in an audit?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.COMPLIANCE,
    moduleId: 'mod-compliance-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'minimal', score: 5, text: '<5% of revenue at risk' },
      { value: 'low', score: 4, text: '5-10% of revenue at risk' },
      { value: 'moderate', score: 3, text: '11-25% of revenue at risk' },
      { value: 'high', score: 1, text: '26-50% of revenue at risk' },
      { value: 'severe', score: 0, text: '>50% of revenue at risk or unknown' }
    ],
    weight: 10,
    helpText: 'Compliance violations can result in massive recoupments across multiple years of claims. Most practices underestimate their maximum exposure.',
    impactAreas: ['Business continuity', 'Financial solvency', 'Reputation risk'],
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
        interpretation: 'Your practice faces existential risk from compliance vulnerabilities',
        actionPrompts: [
          'Conduct comprehensive compliance exposure analysis',
          'Implement immediate risk mitigation for highest-exposure areas',
          'Develop compliance risk reduction plan with prioritized actions'
        ],
        priority: 10,
        timeframe: 'Immediate (within 2 weeks)'
      }
    }
  }
]; 