/**
 * Operations Module - Appointment Scheduling Questions
 * 
 * These questions probe deeply into appointment scheduling practices with
 * intentionally challenging inquiries designed to reveal inefficiencies and
 * weaknesses in how the practice manages its most critical resource: time.
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

export const appointmentSchedulingQuestions: Question[] = [
  {
    id: 'ops-sched-001',
    text: 'What is your practice\'s last-minute cancellation rate (cancellations with less than 24 hours notice)?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.OPERATIONS,
    moduleId: 'mod-operations-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 9,
    minScore: 0,
    maxScore: 100,
    helpText: 'High cancellation rates directly impact revenue and indicate potential issues with appointment management, patient commitment, or treatment value perception.',
    impactAreas: ['Revenue', 'Practitioner utilization', 'Schedule optimization'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'High-performing practices maintain <5%; >10% indicates significant operational issues',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is losing substantial revenue through poor schedule management',
        actionPrompts: [
          'Implement 48-hour confirmation policy with automated reminders',
          'Review cancellation fee policy and enforcement',
          'Analyze cancellation patterns by practitioner, time slot, and patient demographics'
        ],
        priority: 9,
        timeframe: 'Immediate (within 2 weeks)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['appointment management', 'cancellation policy', 'schedule optimization'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'ops-sched-002',
    text: 'Do you track practitioner utilization rate (actual treatment time vs. available time), and if so, what is it?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.OPERATIONS,
    moduleId: 'mod-operations-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'high_tracked', score: 5, text: 'Yes, utilization is >85% with formal tracking' },
      { value: 'medium_tracked', score: 4, text: 'Yes, utilization is 75-85% with formal tracking' },
      { value: 'low_tracked', score: 2, text: 'Yes, utilization is <75% with formal tracking' },
      { value: 'estimated', score: 1, text: 'Estimated without formal tracking' },
      { value: 'not_tracked', score: 0, text: 'Don\'t track utilization' }
    ],
    weight: 9,
    helpText: 'Practitioner utilization directly impacts profitability. Each 5% drop in utilization requires a ~10% increase in fees to maintain the same profit.',
    impactAreas: ['Profitability', 'Resource allocation', 'Practitioner productivity'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Weekly',
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['practitioner utilization', 'schedule optimization', 'capacity management'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'ops-sched-003',
    text: 'What is your average appointment fill rate for available slots over the past three months?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.OPERATIONS,
    moduleId: 'mod-operations-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 8,
    minScore: 0,
    maxScore: 100,
    helpText: 'Unfilled appointments represent permanent revenue loss and may indicate scheduling inefficiencies, lack of demand, or poor marketing.',
    impactAreas: ['Revenue', 'Practitioner utilization', 'Marketing effectiveness'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'Best practice is >90%; <75% indicates serious operational or demand issues',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is severely underutilized, resulting in significant lost revenue',
        actionPrompts: [
          'Implement schedule optimization system with dynamic appointment slots',
          'Develop waitlist protocol for high-demand times',
          'Review marketing strategy for low-demand times'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'ops-sched-004',
    text: 'What is the average wait time for a new patient to get their first appointment?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.OPERATIONS,
    moduleId: 'mod-operations-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'same_day', score: 5, text: 'Same day or next day' },
      { value: 'within_week', score: 4, text: '2-7 days' },
      { value: 'within_two_weeks', score: 3, text: '8-14 days' },
      { value: 'within_month', score: 2, text: '15-30 days' },
      { value: 'over_month', score: 0, text: 'More than 30 days' }
    ],
    weight: 7,
    helpText: 'Long wait times for first appointments lead to patient attrition and reduced referrals. Studies show 20-30% of patients will seek care elsewhere if wait times exceed 7 days.',
    impactAreas: ['Patient acquisition', 'Referral relationships', 'Patient satisfaction'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Weekly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is likely losing significant new patients due to excessive wait times',
        actionPrompts: [
          'Implement dedicated new patient appointment slots',
          'Develop triage protocol for urgent cases',
          'Consider expanding capacity during high-demand periods'
        ],
        priority: 7,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.CLINICAL],
      ragParameters: {
        contextTags: ['new patient access', 'wait time management', 'appointment triage'],
        contentPriority: 7
      }
    }
  },
  {
    id: 'ops-sched-005',
    text: 'What percentage of your appointments are scheduled by patients online without staff intervention?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.OPERATIONS,
    moduleId: 'mod-operations-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 6,
    minScore: 0,
    maxScore: 100,
    helpText: 'Staff-managed scheduling is highly inefficient and expensive. Each hour spent on phone scheduling costs approximately $25-35 in staff time.',
    impactAreas: ['Operational efficiency', 'Staff costs', 'Patient convenience'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'Leading practices achieve >50%; <20% indicates significant inefficiency',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is wasting substantial staff resources on manual scheduling',
        actionPrompts: [
          'Implement comprehensive online scheduling system',
          'Create patient education campaign about online scheduling benefits',
          'Set targets for increasing online appointment percentage'
        ],
        priority: 6,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.TECHNOLOGY],
      ragParameters: {
        contextTags: ['online scheduling', 'automation', 'staff efficiency'],
        contentPriority: 6
      }
    }
  }
]; 