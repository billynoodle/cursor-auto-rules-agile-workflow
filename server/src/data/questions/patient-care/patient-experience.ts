/**
 * Patient Care Module - Patient Experience Questions
 * 
 * These questions probe deeply into practice patient experience capabilities with
 * intentionally challenging inquiries designed to reveal weaknesses in
 * patient satisfaction, feedback collection, and service excellence.
 */

import { Question } from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import { AssessmentCategory } from '../../../models/AssessmentCategory';
import { DisciplineType } from '../../../models/DisciplineType';
import { PracticeSize } from '../../../models/PracticeSize';
import { ScorePosition } from '../../../models/ScorePosition';
import { SOPType } from '../../../models/SOPType';

export const patientExperienceQuestions: Question[] = [
  {
    id: 'pat-exp-001',
    text: 'What is your Net Promoter Score (NPS) or equivalent patient satisfaction metric?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patient-care-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'excellent', score: 5, text: 'NPS 70+ or exceptional satisfaction metrics' },
      { value: 'good', score: 4, text: 'NPS 50-69 or good satisfaction metrics' },
      { value: 'average', score: 2, text: 'NPS 30-49 or average satisfaction metrics' },
      { value: 'poor', score: 0, text: 'NPS <30, poor metrics, or don\'t measure' }
    ],
    weight: 9,
    helpText: 'NPS directly correlates with patient retention and referrals. Leading practices maintain NPS >70, driving 30-40% of new patients through direct referrals.',
    impactAreas: ['Patient retention', 'Referral generation', 'Reputation management'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'Healthcare industry average NPS is 38; high performers achieve 70+',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has significant patient satisfaction issues',
        actionPrompts: [
          'Implement systematic NPS collection after each visit',
          'Create service recovery protocol for detractors',
          'Develop action plan for top 3 patient complaints'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.CLINICAL],
      ragParameters: {
        contextTags: ['patient satisfaction', 'NPS', 'service quality'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'pat-exp-002',
    text: 'How frequently do you collect and analyze detailed patient feedback?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patient-care-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'continuous', score: 5, text: 'Continuous collection with real-time analysis and alerts' },
      { value: 'weekly', score: 4, text: 'Weekly collection and analysis with action plans' },
      { value: 'monthly', score: 3, text: 'Monthly review of aggregated feedback' },
      { value: 'quarterly', score: 1, text: 'Quarterly or less frequent feedback collection' },
      { value: 'never', score: 0, text: 'No systematic patient feedback collection' }
    ],
    weight: 8,
    helpText: 'Feedback frequency directly impacts service improvement. Practices with real-time feedback systems typically address issues 75% faster and show 30% higher patient satisfaction growth.',
    impactAreas: ['Service improvement', 'Problem resolution', 'Patient retention'],
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
        interpretation: 'Your practice lacks timely insight into patient experience',
        actionPrompts: [
          'Implement automated post-visit satisfaction surveys',
          'Create real-time alerting for negative feedback',
          'Establish weekly service excellence review meeting'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'pat-exp-003',
    text: 'Do you have a formal service recovery protocol for addressing patient complaints?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patient-care-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive protocol with staff empowerment and tracking' },
      { value: 'basic', score: 3, text: 'Yes, basic protocol for common issues' },
      { value: 'informal', score: 1, text: 'Informal approach without standardized protocol' },
      { value: 'none', score: 0, text: 'No service recovery protocol' }
    ],
    weight: 9,
    helpText: 'Effective service recovery can convert 70-90% of dissatisfied patients into loyal advocates. Many practices lose 15-20% of patients annually due to poor complaint resolution.',
    impactAreas: ['Patient retention', 'Reputation management', 'Referral protection'],
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
        interpretation: 'Your practice lacks effective complaint management',
        actionPrompts: [
          'Develop formal service recovery protocol with clear escalation paths',
          'Empower front-line staff with resolution resources',
          'Track complaint resolution rates and time to resolution'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.CLINICAL],
      ragParameters: {
        contextTags: ['service recovery', 'complaint management', 'patient satisfaction'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'pat-exp-004',
    text: 'Have you mapped your patient journey with specific improvement targets for each touchpoint?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patient-care-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive mapping with metrics and improvement plans for each touchpoint' },
      { value: 'partial', score: 3, text: 'Yes, partial mapping of major touchpoints' },
      { value: 'informal', score: 1, text: 'Informal understanding without structured mapping' },
      { value: 'none', score: 0, text: 'No patient journey mapping' }
    ],
    weight: 7,
    helpText: 'Journey mapping enables targeted experience improvement. Practices with comprehensive journey management typically show 25-35% higher satisfaction scores and 20-30% better retention.',
    impactAreas: ['Patient experience', 'Process improvement', 'Operational efficiency'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your patient experience management lacks structure and measurement',
        actionPrompts: [
          'Map complete patient journey from first contact through discharge',
          'Identify metrics for each journey stage',
          'Develop improvement targets for underperforming touchpoints'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'pat-exp-005',
    text: 'What percentage of your patients complete their full recommended treatment plan?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patient-care-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'excellent', score: 5, text: '85%+ completion rate' },
      { value: 'good', score: 4, text: '70-84% completion rate' },
      { value: 'average', score: 2, text: '50-69% completion rate' },
      { value: 'poor', score: 0, text: '<50% completion rate or don\'t track' }
    ],
    weight: 9,
    helpText: 'Treatment plan completion directly impacts clinical outcomes and practice revenue. Many practices lose 40-60% of patients before completing recommended care.',
    impactAreas: ['Clinical outcomes', 'Revenue optimization', 'Patient satisfaction'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'Top quartile practices achieve >85% plan completion',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has significant patient dropout issues',
        actionPrompts: [
          'Implement mid-treatment check-ins to identify at-risk patients',
          'Develop re-engagement protocol for missed appointments',
          'Analyze dropout patterns to identify risk factors'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['treatment compliance', 'patient retention', 'plan completion'],
        contentPriority: 9
      }
    }
  }
]; 