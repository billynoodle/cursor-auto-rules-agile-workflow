/**
 * Patient Care Module - Clinical Pathways Questions
 * 
 * These questions probe deeply into practice clinical protocol capabilities with
 * intentionally challenging inquiries designed to reveal weaknesses in
 * standardized care pathways, evidence-based practice, and treatment consistency.
 */

import { Question } from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import { AssessmentCategory } from '../../../models/AssessmentCategory';
import { DisciplineType } from '../../../models/DisciplineType';
import { PracticeSize } from '../../../models/PracticeSize';
import { ScorePosition } from '../../../models/ScorePosition';
import { SOPType } from '../../../models/SOPType';

export const clinicalPathwaysQuestions: Question[] = [
  {
    id: 'pat-path-001',
    text: 'What percentage of your patient conditions are treated using standardized, evidence-based care pathways?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patient-care-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'high', score: 5, text: '80-100% of conditions have standardized pathways' },
      { value: 'moderate', score: 3, text: '50-79% of conditions have standardized pathways' },
      { value: 'low', score: 1, text: '20-49% of conditions have standardized pathways' },
      { value: 'minimal', score: 0, text: '<20% or no standardized pathways' }
    ],
    weight: 9,
    helpText: 'Standardized care pathways dramatically improve outcomes consistency. Practices using evidence-based pathways for 80%+ of cases typically achieve 25-35% better outcomes and 30-40% faster recovery times.',
    impactAreas: ['Clinical outcomes', 'Treatment efficiency', 'Provider consistency'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'Top quartile practices have standardized pathways for 80%+ of common conditions',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your clinical approach lacks standardization, risking inconsistent outcomes',
        actionPrompts: [
          'Identify top 10 conditions by volume and implement pathways for each',
          'Establish pathway compliance monitoring',
          'Measure outcome differences between pathway and non-pathway patients'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL],
      ragParameters: {
        contextTags: ['care pathways', 'clinical protocols', 'evidence-based practice'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'pat-path-002',
    text: 'How often are your clinical pathways updated with new evidence?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patient-care-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'quarterly', score: 5, text: 'Quarterly or more frequent updates' },
      { value: 'biannual', score: 4, text: 'Twice yearly updates' },
      { value: 'annual', score: 3, text: 'Annual updates' },
      { value: 'irregular', score: 1, text: 'Irregular/ad-hoc updates' },
      { value: 'static', score: 0, text: 'Static pathways or no formal update process' }
    ],
    weight: 8,
    helpText: 'Clinical evidence evolves rapidly. Practices with quarterly pathway updates typically stay 18-24 months ahead of peers in implementing evidence-based innovations.',
    impactAreas: ['Evidence-based practice', 'Clinical innovation', 'Outcome improvement'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your clinical practices risk becoming outdated and suboptimal',
        actionPrompts: [
          'Establish quarterly clinical literature review process',
          'Create clinical pathway review committee',
          'Implement systematic update protocol with version control'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'pat-path-003',
    text: 'Do you have formal variance tracking for pathway compliance and outcome exceptions?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patient-care-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive variance tracking with root cause analysis and pathway refinement' },
      { value: 'basic', score: 3, text: 'Yes, basic tracking of major variances' },
      { value: 'minimal', score: 1, text: 'Minimal/informal variance awareness' },
      { value: 'none', score: 0, text: 'No variance tracking' }
    ],
    weight: 8,
    helpText: 'Variance tracking enables continuous clinical improvement. Practices with robust variance management typically improve pathway effectiveness by 15-25% annually and identify root causes for 70-80% of outlier cases.',
    impactAreas: ['Clinical quality', 'Outcome consistency', 'Protocol refinement'],
    applicablePracticeSizes: [
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice lacks clinical quality control mechanisms',
        actionPrompts: [
          'Implement variance tracking for all clinical pathways',
          'Create monthly variance review protocol',
          'Establish pathway refinement process based on variance data'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.QUALITY],
      ragParameters: {
        contextTags: ['clinical variance', 'quality control', 'protocol compliance'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'pat-path-004',
    text: 'What percentage of your providers demonstrate high compliance with standardized pathways?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patient-care-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'excellent', score: 5, text: '90%+ provider compliance' },
      { value: 'good', score: 3, text: '70-89% provider compliance' },
      { value: 'fair', score: 1, text: '50-69% provider compliance' },
      { value: 'poor', score: 0, text: '<50% provider compliance or not measured' }
    ],
    weight: 9,
    helpText: 'Provider compliance directly impacts outcome consistency. Practices with >90% pathway compliance typically show 30-40% less outcome variability between providers.',
    impactAreas: ['Outcome consistency', 'Quality control', 'Clinical reliability'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'High-performing practices maintain >90% pathway compliance',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your providers demonstrate significant practice variation',
        actionPrompts: [
          'Implement provider-specific pathway compliance tracking',
          'Create peer comparison dashboards for compliance',
          'Incorporate pathway compliance into performance reviews'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'pat-path-005',
    text: 'Do you utilize decision support tools to guide clinical pathway selection and monitor progress?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.PATIENTS,
    moduleId: 'mod-patient-care-003',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'advanced', score: 5, text: 'Yes, advanced decision support integrated with EHR and continuous monitoring' },
      { value: 'basic', score: 3, text: 'Yes, basic decision support tools' },
      { value: 'minimal', score: 1, text: 'Minimal/reference tools only' },
      { value: 'none', score: 0, text: 'No decision support tools' }
    ],
    weight: 7,
    helpText: 'Decision support dramatically improves pathway selection accuracy. Practices with advanced decision support typically reduce inappropriate pathway selection by 50-70% and improve early intervention for at-risk cases.',
    impactAreas: ['Clinical decision making', 'Risk identification', 'Pathway optimization'],
    applicablePracticeSizes: [
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your clinical decision making lacks systematic support',
        actionPrompts: [
          'Implement clinical decision support tools for common conditions',
          'Integrate pathway selection tools with clinical documentation',
          'Train providers on effective use of decision support'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.TECHNOLOGY],
      ragParameters: {
        contextTags: ['decision support', 'clinical pathways', 'risk stratification'],
        contentPriority: 7
      }
    }
  }
]; 