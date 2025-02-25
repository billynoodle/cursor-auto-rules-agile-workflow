/**
 * Operations Module - Workflow Efficiency Questions
 * 
 * These questions probe deeply into clinical and administrative workflows with
 * intentionally challenging inquiries designed to reveal inefficiencies and
 * bottlenecks in daily practice operations.
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

export const workflowEfficiencyQuestions: Question[] = [
  {
    id: 'ops-flow-001',
    text: 'What is the average patient check-in to treatment start time in your practice?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.OPERATIONS,
    moduleId: 'mod-operations-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'under_2', score: 5, text: 'Under 2 minutes' },
      { value: '2_5', score: 4, text: '2-5 minutes' },
      { value: '6_10', score: 3, text: '6-10 minutes' },
      { value: '11_15', score: 1, text: '11-15 minutes' },
      { value: 'over_15', score: 0, text: 'Over 15 minutes or not measured' }
    ],
    weight: 8,
    helpText: 'Long wait times between check-in and treatment reduce patient satisfaction and practitioner productivity. Each minute lost reduces billable capacity.',
    impactAreas: ['Patient satisfaction', 'Practitioner productivity', 'Revenue optimization'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Weekly',
    benchmarkReference: 'High-performing practices maintain <5 minutes; >10 minutes indicates significant workflow issues',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is wasting substantial billable time with inefficient workflows',
        actionPrompts: [
          'Implement streamlined check-in process with pre-arrival preparation',
          'Create practitioner notification system for patient readiness',
          'Redesign physical space to minimize transit time'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['patient flow', 'check-in process', 'wait time reduction'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'ops-flow-002',
    text: 'What percentage of your practitioners consistently complete their documentation during or immediately after each patient visit?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.OPERATIONS,
    moduleId: 'mod-operations-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 9,
    minScore: 0,
    maxScore: 100,
    helpText: 'Delayed documentation creates significant risk (clinical, compliance, billing) and often leads to reduced quality and accuracy.',
    impactAreas: ['Documentation quality', 'Compliance risk', 'Billing efficiency'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Weekly',
    benchmarkReference: 'Best practice is >95%; <80% indicates serious documentation issues',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has dangerous documentation delays creating multiple risks',
        actionPrompts: [
          'Implement point-of-care documentation protocols',
          'Provide documentation templates to increase efficiency',
          'Include documentation completion in performance metrics'
        ],
        priority: 9,
        timeframe: 'Immediate (within 2 weeks)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.CLINICAL, SOPType.COMPLIANCE],
      ragParameters: {
        contextTags: ['documentation compliance', 'clinical records', 'audit readiness'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'ops-flow-003',
    text: 'What is your average insurance claim submission lag time from date of service?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.OPERATIONS,
    moduleId: 'mod-operations-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'same_day', score: 5, text: 'Same day of service' },
      { value: 'within_48', score: 4, text: 'Within 48 hours' },
      { value: 'within_week', score: 3, text: 'Within 1 week' },
      { value: 'within_2_weeks', score: 1, text: 'Within 2 weeks' },
      { value: 'beyond_2_weeks', score: 0, text: 'Beyond 2 weeks or not measured' }
    ],
    weight: 8,
    helpText: 'Delayed claim submission directly impacts cash flow and increases denial risk. Each day delay adds approximately 1-3 days to payment timelines.',
    impactAreas: ['Cash flow', 'Claim denial rate', 'Administrative efficiency'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Weekly',
    benchmarkReference: 'Best practice is same-day submission; >7 days indicates serious revenue cycle issues',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is hemorrhaging cash flow through delayed claim submission',
        actionPrompts: [
          'Implement same-day claims submission policy',
          'Automate claim scrubbing and submission processes',
          'Train all practitioners on required documentation for clean claims'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.FINANCIAL],
      ragParameters: {
        contextTags: ['insurance claims', 'revenue cycle management', 'cash flow optimization'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'ops-flow-004',
    text: 'Have you mapped and timed every step in your patient journey from booking to discharge, and identified specific bottlenecks?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.OPERATIONS,
    moduleId: 'mod-operations-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, with comprehensive mapping, timing, and regular optimization' },
      { value: 'basic', score: 3, text: 'Yes, with basic mapping and some timing data' },
      { value: 'partial', score: 2, text: 'Partially mapped some processes without timing data' },
      { value: 'informal', score: 1, text: 'Informal understanding without documented mapping' },
      { value: 'none', score: 0, text: 'No process mapping conducted' }
    ],
    weight: 7,
    helpText: 'Without systematic workflow mapping, inefficiencies remain hidden. Most practices have 25-40% of time spent on non-value-adding activities.',
    impactAreas: ['Operational efficiency', 'Patient experience', 'Cost management'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice lacks fundamental understanding of its own workflows',
        actionPrompts: [
          'Conduct full patient journey mapping exercise',
          'Time each step in the patient experience',
          'Identify and prioritize top 3 bottlenecks for immediate resolution'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.QUALITY],
      ragParameters: {
        contextTags: ['process mapping', 'workflow optimization', 'efficiency improvement'],
        contentPriority: 7
      }
    }
  },
  {
    id: 'ops-flow-005',
    text: 'What percentage of your administrative tasks are automated or systematized with minimal manual intervention?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.OPERATIONS,
    moduleId: 'mod-operations-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 8,
    minScore: 0,
    maxScore: 100,
    helpText: 'Manual administrative tasks cost 3-5x more than automated ones and have higher error rates. Most practices can automate 60-80% of routine tasks.',
    impactAreas: ['Administrative costs', 'Staff efficiency', 'Error reduction'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'Leading practices achieve >70% automation; <40% indicates significant inefficiency',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is wasting substantial resources on manual processes',
        actionPrompts: [
          'Conduct administrative task audit to identify automation opportunities',
          'Prioritize high-volume, repetitive tasks for immediate automation',
          'Implement workflow automation tools for appointment reminders, form completion, and routine communications'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.TECHNOLOGY],
      ragParameters: {
        contextTags: ['automation', 'administrative efficiency', 'digital transformation'],
        contentPriority: 8
      }
    }
  }
]; 