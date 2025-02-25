/**
 * Staffing Module - Professional Development Questions
 * 
 * These questions probe deeply into practice professional development strategies with
 * intentionally challenging inquiries designed to reveal weaknesses in
 * continuing education, staff skills advancement, and clinical expertise development.
 */

import { Question } from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import { AssessmentCategory } from '../../../models/AssessmentCategory';
import { DisciplineType } from '../../../models/DisciplineType';
import { PracticeSize } from '../../../models/PracticeSize';
import { ScorePosition } from '../../../models/ScorePosition';
import { SOPType } from '../../../models/SOPType';

export const professionalDevelopmentQuestions: Question[] = [
  {
    id: 'staff-dev-001',
    text: 'What annual budget do you allocate per practitioner for continuing education and professional development?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'substantial', score: 5, text: '$2,500+ per practitioner annually' },
      { value: 'adequate', score: 4, text: '$1,500-$2,499 per practitioner annually' },
      { value: 'moderate', score: 3, text: '$1,000-$1,499 per practitioner annually' },
      { value: 'minimal', score: 1, text: '$500-$999 per practitioner annually' },
      { value: 'insufficient', score: 0, text: '<$500 per practitioner annually or no formal budget' }
    ],
    weight: 8,
    helpText: 'CE investment directly impacts clinical expertise and practitioner satisfaction. Practices investing $2,000+ annually per practitioner typically show 20-30% higher retention of top performers.',
    impactAreas: ['Clinical expertise', 'Staff retention', 'Service quality'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'Industry average: $1,200 annually; top-performing practices: $2,500+',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your professional development investment is insufficient',
        actionPrompts: [
          'Establish minimum annual CE budget of $1,500 per practitioner',
          'Create formal CE approval process tied to practice goals',
          'Implement knowledge-sharing program for CE attendees'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.CLINICAL],
      ragParameters: {
        contextTags: ['continuing education', 'professional development', 'clinical expertise'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'staff-dev-002',
    text: 'Do you have a formal clinical mentorship or supervision program for all practitioners?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, structured program with regular sessions, documentation, and outcome tracking for all practitioners' },
      { value: 'moderate', score: 3, text: 'Yes, structured program for new/junior practitioners only' },
      { value: 'minimal', score: 1, text: 'Informal or inconsistent mentorship' },
      { value: 'none', score: 0, text: 'No clinical mentorship or supervision program' }
    ],
    weight: 9,
    helpText: 'Clinical mentorship accelerates expertise development and reduces liability risk. Practices with formal mentorship show 25-35% faster skills development and 40-50% fewer clinical errors.',
    impactAreas: ['Clinical quality', 'Risk management', 'Staff development'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your clinical quality oversight is inadequate, risking care quality',
        actionPrompts: [
          'Implement monthly clinical supervision for all practitioners',
          'Develop case review protocols and documentation standards',
          'Create clinical competency progression framework'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'staff-dev-003',
    text: 'How do you track and validate skill acquisition and clinical expertise development?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Comprehensive competency framework with formal validation, documentation, and performance metrics' },
      { value: 'structured', score: 3, text: 'Structured tracking system with basic validation' },
      { value: 'minimal', score: 1, text: 'Minimal tracking of CE attendance without validation' },
      { value: 'none', score: 0, text: 'No formal tracking or validation system' }
    ],
    weight: 7,
    helpText: 'Skill validation ensures training effectiveness and competency verification. Practices with competency validation systems show 30-40% better clinical outcomes and reduced liability exposure.',
    impactAreas: ['Clinical quality', 'Risk management', 'Training ROI'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your skill development lacks verification and accountability',
        actionPrompts: [
          'Develop clinical competency framework for core skills',
          'Implement skill validation process with documentation',
          'Create clinical skills database linked to practitioner profiles'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.QUALITY],
      ragParameters: {
        contextTags: ['competency validation', 'skill tracking', 'clinical expertise'],
        contentPriority: 7
      }
    }
  },
  {
    id: 'staff-dev-004',
    text: 'Do you have a structured internal knowledge-sharing program?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, formal program with regular sessions, CE dissemination protocols, and knowledge repository' },
      { value: 'moderate', score: 3, text: 'Yes, regular sessions with some structure' },
      { value: 'minimal', score: 1, text: 'Occasional informal knowledge sharing' },
      { value: 'none', score: 0, text: 'No internal knowledge sharing program' }
    ],
    weight: 6,
    helpText: 'Knowledge sharing maximizes CE investment and builds team expertise. Practices with formal knowledge sharing programs typically achieve 3-5x ROI on CE investment through dissemination.',
    impactAreas: ['Team expertise', 'CE investment ROI', 'Clinical innovation'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice fails to leverage collective knowledge',
        actionPrompts: [
          'Implement monthly clinical in-service program',
          'Create CE dissemination requirement for funded education',
          'Develop digital knowledge repository for clinical resources'
        ],
        priority: 6,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'staff-dev-005',
    text: 'How do you identify and develop future clinical and administrative leaders?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.STAFFING,
    moduleId: 'mod-staffing-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Formal leadership development program with succession planning, mentoring, and progressive responsibility' },
      { value: 'structured', score: 3, text: 'Structured identification and development of select individuals' },
      { value: 'basic', score: 1, text: 'Basic identification without formal development' },
      { value: 'none', score: 0, text: 'No leadership identification or development program' }
    ],
    weight: 8,
    helpText: 'Internal leadership development creates succession depth and reduces transition disruption. Practices with formal programs fill 70-80% of leadership roles internally with higher success rates.',
    impactAreas: ['Succession planning', 'Organizational stability', 'Leadership quality'],
    applicablePracticeSizes: [
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice lacks leadership pipeline development',
        actionPrompts: [
          'Create formal leadership identification and development program',
          'Implement leadership mentoring with progressive responsibility',
          'Develop leadership skills curriculum for high-potential staff'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['leadership development', 'succession planning', 'talent management'],
        contentPriority: 8
      }
    }
  }
]; 