/**
 * Staffing Module - Recruitment and Retention Questions
 * 
 * These questions probe deeply into practice recruitment and retention strategies with
 * intentionally challenging inquiries designed to reveal weaknesses in
 * hiring processes, onboarding, and staff satisfaction management.
 */

import { Question } from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import { AssessmentCategory } from '../../../models/AssessmentCategory';
import { DisciplineType } from '../../../models/DisciplineType';
import { PracticeSize } from '../../../models/PracticeSize';
import { ScorePosition } from '../../../models/ScorePosition';
import { SOPType } from '../../../models/SOPType';

export const recruitmentRetentionQuestions: Question[] = [
  {
    id: 'staff-rec-001',
    text: 'What is your average time-to-fill for practitioner positions?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'excellent', score: 5, text: '<30 days with high-quality candidates' },
      { value: 'good', score: 4, text: '30-45 days with quality candidates' },
      { value: 'average', score: 3, text: '45-60 days with acceptable candidates' },
      { value: 'concerning', score: 1, text: '60-90 days or variable candidate quality' },
      { value: 'critical', score: 0, text: '>90 days or chronic recruitment struggles' }
    ],
    weight: 8,
    helpText: 'Practitioner vacancy costs typically exceed $1,000 per day in lost revenue and locum/overtime costs. Each day of vacancy directly impacts continuity of care and team morale.',
    impactAreas: ['Revenue protection', 'Team stability', 'Service continuity'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'Top-performing practices fill positions in <45 days with high-quality candidates',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your recruitment process is ineffective, causing significant revenue leakage',
        actionPrompts: [
          'Develop proactive talent pipeline with ongoing candidate engagement',
          'Implement structured interview protocol with rubric-based evaluation',
          'Create competitive compensation analysis benchmarked to market'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.HR],
      ragParameters: {
        contextTags: ['recruitment', 'hiring process', 'vacancy management'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'staff-rec-002',
    text: 'What is your practice\'s annual staff turnover rate?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'excellent', score: 5, text: '<10% annual turnover' },
      { value: 'good', score: 4, text: '10-15% annual turnover' },
      { value: 'average', score: 3, text: '15-20% annual turnover' },
      { value: 'concerning', score: 1, text: '20-30% annual turnover' },
      { value: 'critical', score: 0, text: '>30% annual turnover or don\'t track' }
    ],
    weight: 9,
    helpText: 'Each practitioner turnover costs 100-150% of annual salary in replacement, training, and lost productivity. High turnover directly impacts patient satisfaction and team culture.',
    impactAreas: ['Team stability', 'Institutional knowledge', 'Patient satisfaction'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'Industry average: 18%; high-performing practices: <12%',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has serious retention issues causing significant disruption',
        actionPrompts: [
          'Conduct confidential exit interviews to identify turnover drivers',
          'Implement formal 30-60-90 day onboarding process',
          'Develop stay interviews with high-value employees'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'staff-rec-003',
    text: 'How do you measure and manage employee satisfaction and engagement?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Comprehensive system with regular pulse surveys, formal engagement program, and action planning' },
      { value: 'formal', score: 3, text: 'Regular formal surveys with some action planning' },
      { value: 'basic', score: 1, text: 'Basic annual surveys with limited follow-up' },
      { value: 'none', score: 0, text: 'No formal measurement of satisfaction or engagement' }
    ],
    weight: 8,
    helpText: 'Employee engagement directly impacts retention and performance. Practices with formal engagement programs typically show 25-35% lower turnover and 15-20% higher productivity.',
    impactAreas: ['Staff retention', 'Team performance', 'Practice culture'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice lacks insight into employee satisfaction drivers',
        actionPrompts: [
          'Implement quarterly employee engagement surveys',
          'Create structured focus groups to identify improvement opportunities',
          'Develop formal action planning process for survey results'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.HR],
      ragParameters: {
        contextTags: ['employee engagement', 'satisfaction measurement', 'retention strategy'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'staff-rec-004',
    text: 'How structured is your new staff onboarding process?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Comprehensive 90-day structured program with milestones, mentoring, and regular feedback' },
      { value: 'structured', score: 3, text: 'Structured 30-day program with some follow-up' },
      { value: 'basic', score: 1, text: 'Basic orientation with minimal structured follow-up' },
      { value: 'minimal', score: 0, text: 'Minimal orientation or ad-hoc approach' }
    ],
    weight: 7,
    helpText: 'Onboarding effectiveness directly impacts time-to-productivity and early turnover. Practices with structured 90-day programs typically achieve full productivity 30-40% faster with 50-60% less first-year turnover.',
    impactAreas: ['Time to productivity', 'Early turnover', 'Practice culture'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your onboarding process is inadequate, risking early turnover',
        actionPrompts: [
          'Develop structured 90-day onboarding program with clear milestones',
          'Implement mentor/buddy system for all new hires',
          'Create 30/60/90 day feedback checkpoints'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'staff-rec-005',
    text: 'Do you have a structured approach to career pathing and internal promotion?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, formal career paths with competency frameworks, development plans, and promotion criteria' },
      { value: 'basic', score: 3, text: 'Yes, basic career progression options with some structure' },
      { value: 'informal', score: 1, text: 'Informal/ad-hoc approach to advancement' },
      { value: 'none', score: 0, text: 'No structured career paths or internal promotion system' }
    ],
    weight: 8,
    helpText: 'Career pathing significantly impacts retention of high performers. Practices with formal career paths typically retain top talent 40-50% longer and fill 60-70% of leadership roles internally.',
    impactAreas: ['Staff retention', 'Leadership pipeline', 'Employee satisfaction'],
    applicablePracticeSizes: [
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice lacks clear advancement opportunities for top performers',
        actionPrompts: [
          'Develop formal career paths with clear advancement criteria',
          'Create competency framework for each role level',
          'Implement talent review process to identify high-potential employees'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.HR],
      ragParameters: {
        contextTags: ['career development', 'promotion criteria', 'talent management'],
        contentPriority: 8
      }
    }
  }
]; 