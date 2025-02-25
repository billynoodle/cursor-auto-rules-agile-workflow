/**
 * Technology Module - Digital Adoption Questions
 * 
 * These questions probe deeply into technology adoption and utilization with
 * intentionally challenging inquiries designed to reveal weaknesses in 
 * how practices leverage digital tools to enhance efficiency and outcomes.
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

export const digitalAdoptionQuestions: Question[] = [
  {
    id: 'tech-dig-001',
    text: 'What percentage of your patient interactions (scheduling, forms, education, payments) can be completed digitally?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.TECHNOLOGY,
    moduleId: 'mod-technology-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 8,
    minScore: 0,
    maxScore: 100,
    helpText: 'Digital patient interactions reduce administrative costs and improve patient satisfaction. Each paper form costs $15-20 to process vs. $2-3 digitally.',
    impactAreas: ['Operational efficiency', 'Patient satisfaction', 'Administrative costs'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'Leading practices achieve >80%; <50% indicates significant digital gaps',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is severely behind in digital transformation',
        actionPrompts: [
          'Conduct digital workflow audit',
          'Implement patient portal for forms and communications',
          'Transition to digital payment processing'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.TECHNOLOGY, SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['digital transformation', 'patient portal', 'paperless workflow'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'tech-dig-002',
    text: 'Do you utilize telehealth for appropriate patient interactions, and if so, what percentage of eligible visits are conducted via telehealth?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.TECHNOLOGY,
    moduleId: 'mod-technology-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'high_telehealth', score: 5, text: 'Yes, >50% of eligible visits' },
      { value: 'medium_telehealth', score: 4, text: 'Yes, 25-50% of eligible visits' },
      { value: 'low_telehealth', score: 3, text: 'Yes, 10-25% of eligible visits' },
      { value: 'minimal_telehealth', score: 1, text: 'Yes, <10% of eligible visits' },
      { value: 'no_telehealth', score: 0, text: 'Do not utilize telehealth' }
    ],
    weight: 7,
    helpText: 'Telehealth reduces overhead costs and improves patient convenience. Practices using telehealth report 15-30% cost savings for appropriate visits.',
    impactAreas: ['Service accessibility', 'Operational costs', 'Patient convenience'],
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
        interpretation: 'Your practice is missing significant opportunities through underutilization of telehealth',
        actionPrompts: [
          'Implement HIPAA-compliant telehealth platform',
          'Create clinical guidelines for telehealth-appropriate cases',
          'Train practitioners on effective telehealth delivery'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'tech-dig-003',
    text: 'Do you use digital tools to automatically track patient home exercise adherence and outcomes?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.TECHNOLOGY,
    moduleId: 'mod-technology-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: false,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, with comprehensive tracking, alerts, and outcomes correlation' },
      { value: 'basic_tracking', score: 3, text: 'Yes, with basic tracking and some alerts' },
      { value: 'prescribe_only', score: 2, text: 'Digitally prescribe but don\'t track adherence' },
      { value: 'manual', score: 1, text: 'Use paper-based exercise programs only' },
      { value: 'inconsistent', score: 0, text: 'Inconsistent or no formal exercise program' }
    ],
    weight: 8,
    helpText: 'Research shows digital exercise tracking improves adherence by 25-35% and outcomes by 15-20% compared to paper instructions.',
    impactAreas: ['Treatment outcomes', 'Patient engagement', 'Clinical efficiency'],
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
        helpText: 'For physiotherapy, exercise adherence is often the primary determinant of treatment success, making digital tracking particularly valuable.'
      }
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is missing critical outcome data and compromising treatment effectiveness',
        actionPrompts: [
          'Implement digital exercise prescription and tracking platform',
          'Establish adherence monitoring protocols',
          'Develop intervention strategy for non-adherent patients'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.TECHNOLOGY],
      ragParameters: {
        contextTags: ['exercise adherence', 'home program', 'patient monitoring'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'tech-dig-004',
    text: 'Does your EMR/practice management software fully integrate with your scheduling, billing, and clinical documentation?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.TECHNOLOGY,
    moduleId: 'mod-technology-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'full_integration', score: 5, text: 'Yes, full integration across all systems' },
      { value: 'partial_integration', score: 3, text: 'Partial integration with some manual transfers' },
      { value: 'minimal_integration', score: 1, text: 'Minimal integration with mostly separate systems' },
      { value: 'no_integration', score: 0, text: 'No integration between systems' }
    ],
    weight: 9,
    helpText: 'Non-integrated systems create massive inefficiency and error risk. Studies show staff spend 30-40% of time on manual data transfer in non-integrated practices.',
    impactAreas: ['Operational efficiency', 'Error risk', 'Staff productivity'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has dangerous inefficiencies from siloed systems',
        actionPrompts: [
          'Conduct integrated practice management system evaluation',
          'Create migration plan for consolidated platform',
          'Prioritize integration of clinical and billing systems'
        ],
        priority: 9,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'tech-dig-005',
    text: 'What percentage of your clinical and administrative staff can efficiently use all required technology without regular assistance?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.TECHNOLOGY,
    moduleId: 'mod-technology-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 7,
    minScore: 0,
    maxScore: 100,
    helpText: 'Technology proficiency directly impacts productivity. Each staff member who struggles with technology can waste 3-5 hours per week and impact others.',
    impactAreas: ['Staff productivity', 'Technology ROI', 'Service quality'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'High-performing practices maintain >90% technology proficiency; <70% indicates significant training issues',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice has significant technology adoption gaps reducing efficiency',
        actionPrompts: [
          'Implement structured technology training program',
          'Create system-specific documentation and quick guides',
          'Establish technology champions for peer support'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.TECHNOLOGY, SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['technology adoption', 'staff training', 'digital literacy'],
        contentPriority: 7
      }
    }
  }
]; 