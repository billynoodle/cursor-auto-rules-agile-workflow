/**
 * Patient Care Module - Outcomes Tracking Questions
 * 
 * These questions probe deeply into how the practice measures and manages clinical outcomes.
 * The questions are intentionally challenging to expose potential weaknesses in outcomes
 * measurement, documentation, and quality improvement processes.
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

export const outcomesTrackingQuestions: Question[] = [
  {
    id: 'pat-out-001',
    text: 'What percentage of your patients receive validated outcome measures at both initial assessment and discharge?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patients-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: false,
    weight: 10,
    minScore: 0,
    maxScore: 100,
    helpText: 'Without standardized before/after measures on every patient, you cannot objectively prove your effectiveness or identify underperforming treatment approaches.',
    impactAreas: ['Clinical quality', 'Treatment efficacy', 'Practice reputation'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'Best practice is >90%; <70% indicates significant quality gaps',
    disciplineSpecific: {
      [DisciplineType.PHYSIOTHERAPY]: {
        helpText: 'Physiotherapy practices should use condition-specific validated measures like DASH, LEFS, NDI, etc. plus pain scales and functional measures.'
      }
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice lacks fundamental evidence of treatment effectiveness',
        actionPrompts: [
          'Implement mandatory outcome measurement protocol for all patients',
          'Train all clinicians on standardized assessment tools',
          'Add outcome measure completion to performance metrics'
        ],
        priority: 10,
        timeframe: 'Immediate (within 2 weeks)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.QUALITY],
      ragParameters: {
        contextTags: ['outcome measurement', 'clinical effectiveness', 'quality assurance'],
        contentPriority: 10,
        requiredInclusions: ['outcome measure selection', 'administration protocol', 'documentation requirements']
      }
    }
  },
  {
    id: 'pat-out-002',
    text: 'Do you systematically track and analyze your patients\' average improvement metrics by practitioner, condition, and treatment approach?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patients-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: false,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, with regular reporting, statistical analysis, and performance management' },
      { value: 'basic', score: 3, text: 'Yes, with basic tracking but limited analysis' },
      { value: 'partial', score: 2, text: 'Partially track some metrics without systematic analysis' },
      { value: 'minimal', score: 1, text: 'Minimal tracking of select cases only' },
      { value: 'none', score: 0, text: 'No systematic tracking of improvement metrics' }
    ],
    weight: 9,
    helpText: 'Without comparative analysis of practitioner performance and treatment approaches, you may be unknowingly employing ineffective or inferior techniques.',
    impactAreas: ['Clinical quality', 'Practitioner performance', 'Treatment optimization'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has no way to identify underperforming practitioners or treatments',
        actionPrompts: [
          'Implement comparative outcomes reporting system',
          'Begin regular clinical performance reviews based on patient outcomes',
          'Institute peer review process for low-performing practitioners'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.QUALITY],
      ragParameters: {
        contextTags: ['performance analysis', 'clinical quality', 'practitioner evaluation'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'pat-out-003',
    text: 'What is your practice\'s average percentage of patients who fail to achieve clinically meaningful improvement?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patients-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: false,
    weight: 10,
    minScore: 0,
    maxScore: 100,
    helpText: 'High non-responder rates may indicate problems with assessment, treatment selection, practitioner skill, or patient selection.',
    impactAreas: ['Clinical effectiveness', 'Patient satisfaction', 'Referral quality'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'High-performing practices have <15% non-responder rates; >25% indicates significant concerns',
    disciplineSpecific: {
      [DisciplineType.PHYSIOTHERAPY]: {
        helpText: 'For physiotherapy, "clinically meaningful improvement" should be defined using minimal clinically important difference (MCID) for relevant outcome measures.'
      }
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has an alarmingly high treatment failure rate',
        actionPrompts: [
          'Conduct urgent investigation into treatment protocols',
          'Review practitioner training and supervision',
          'Analyze patient selection and referral sources'
        ],
        priority: 10,
        timeframe: 'Immediate (within 2 weeks)'
      }
    }
  },
  {
    id: 'pat-out-004',
    text: 'How often do you formally review patient outcome data and implement specific practice changes based on the findings?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patients-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'monthly', score: 5, text: 'Monthly with documented action planning' },
      { value: 'quarterly', score: 4, text: 'Quarterly with documented action planning' },
      { value: 'biannual', score: 3, text: 'Every 6 months with some action planning' },
      { value: 'annual', score: 2, text: 'Annually with limited action planning' },
      { value: 'never', score: 0, text: 'Never conduct formal outcome data reviews' }
    ],
    weight: 8,
    helpText: 'Collecting data without regular review and action is wasted effort and misses critical opportunities for improvement.',
    impactAreas: ['Quality improvement', 'Clinical governance', 'Evidence-based practice'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice fails to utilize clinical data for improvement',
        actionPrompts: [
          'Establish regular clinical quality review meetings',
          'Implement formal action planning protocol for outcome data',
          'Create accountability structure for improvement initiatives'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.QUALITY, SOPType.CLINICAL],
      contentMapping: {
        'monthly': 'Monthly clinical quality review procedure',
        'quarterly': 'Quarterly outcome analysis protocol',
        'biannual': 'Biannual clinical quality review process',
        'annual': 'Annual outcome review procedure',
        'never': 'Clinical quality review protocol (needs implementation)'
      },
      ragParameters: {
        contextTags: ['quality review', 'outcome analysis', 'clinical improvement'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'pat-out-005',
    text: 'What percentage of your practitioners regularly incorporate published research findings into their treatment approaches?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patients-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: false,
    weight: 7,
    minScore: 0,
    maxScore: 100,
    helpText: 'Evidence-based practice requires ongoing integration of research. Without it, practitioners may continue using outdated or disproven approaches.',
    impactAreas: ['Evidence-based practice', 'Treatment quality', 'Clinical effectiveness'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    disciplineSpecific: {
      [DisciplineType.PHYSIOTHERAPY]: {
        helpText: 'Physiotherapy has a rapidly evolving evidence base. Practice approaches that were standard 5 years ago may now be considered ineffective or even harmful.'
      }
    },
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'Leading practices have >80% of practitioners regularly incorporating research; <50% indicates significant concerns',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice may be using outdated treatment approaches',
        actionPrompts: [
          'Implement journal club or research review meetings',
          'Provide dedicated time for research review',
          'Establish protocol for treatment updates based on research'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.QUALITY],
      ragParameters: {
        contextTags: ['evidence-based practice', 'research integration', 'clinical education'],
        contentPriority: 7
      }
    }
  }
]; 