/**
 * Automation Module - AI Integration Questions
 * 
 * These questions probe deeply into practice AI adoption with
 * intentionally challenging inquiries designed to reveal weaknesses
 * in leveraging artificial intelligence for healthcare operations and clinical support.
 */

import { Question } from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import { AssessmentCategory } from '../../../models/AssessmentCategory';
import { DisciplineType } from '../../../models/DisciplineType';
import { PracticeSize } from '../../../models/PracticeSize';
import { ScorePosition } from '../../../models/ScorePosition';
import { SOPType } from '../../../models/SOPType';

export const aiIntegrationQuestions: Question[] = [
  {
    id: 'auto-ai-001',
    text: 'Have you integrated AI-driven clinical decision support tools into your practice?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.AUTOMATION,
    moduleId: 'mod-automation-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive AI integration with validated clinical decision support' },
      { value: 'partial', score: 3, text: 'Yes, limited AI tools for specific conditions or scenarios' },
      { value: 'exploratory', score: 1, text: 'Exploring options or pilot implementation' },
      { value: 'none', score: 0, text: 'No AI clinical decision support implemented' }
    ],
    weight: 7,
    helpText: 'AI-driven clinical support can significantly enhance treatment precision. Early adopters report 25-35% improvement in treatment selection and 15-25% better outcomes for complex cases.',
    impactAreas: ['Clinical decision making', 'Treatment outcomes', 'Provider confidence'],
    applicablePracticeSizes: [
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice is falling behind in clinical AI adoption',
        actionPrompts: [
          'Evaluate evidence-based AI clinical decision support tools',
          'Implement pilot program for high-volume condition',
          'Measure outcomes compared to standard care pathways'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.TECHNOLOGY],
      ragParameters: {
        contextTags: ['AI clinical support', 'decision support', 'treatment optimization'],
        contentPriority: 7
      }
    }
  },
  {
    id: 'auto-ai-002',
    text: 'Do you utilize AI for patient triage and risk stratification?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.AUTOMATION,
    moduleId: 'mod-automation-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, AI-driven triage with risk stratification and care pathway assignment' },
      { value: 'basic', score: 3, text: 'Yes, basic AI screening tools for initial assessment' },
      { value: 'minimal', score: 1, text: 'Limited AI integration in intake process' },
      { value: 'none', score: 0, text: 'No AI utilization for triage or risk assessment' }
    ],
    weight: 8,
    helpText: 'AI triage enables precision patient routing and early intervention. Practices with AI triage typically identify high-risk patients 40-60% faster and reduce care pathway mismatches by 30-45%.',
    impactAreas: ['Patient routing', 'Resource allocation', 'Early intervention'],
    applicablePracticeSizes: [
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your patient triage relies on subjective judgment rather than data science',
        actionPrompts: [
          'Implement AI-driven intake assessment',
          'Create risk-stratified care pathways',
          'Measure care pathway outcomes by risk category'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'auto-ai-003',
    text: 'Have you implemented AI-powered predictive analytics for operational forecasting?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.AUTOMATION,
    moduleId: 'mod-automation-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive predictive modeling across all operations' },
      { value: 'partial', score: 3, text: 'Yes, predictive analytics for specific operational areas' },
      { value: 'minimal', score: 1, text: 'Basic trend analysis without true predictive capabilities' },
      { value: 'none', score: 0, text: 'No predictive analytics implemented' }
    ],
    weight: 8,
    helpText: 'Predictive operational analytics enables proactive management. Practices with comprehensive predictive capabilities typically reduce staffing costs by 15-20% while improving appointment availability by 20-30%.',
    impactAreas: ['Resource planning', 'Staff utilization', 'Operational efficiency'],
    applicablePracticeSizes: [
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice operates reactively without forecasting capabilities',
        actionPrompts: [
          'Implement demand forecasting for appointment scheduling',
          'Deploy predictive staffing models based on historical patterns',
          'Create proactive inventory management with predictive ordering'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.TECHNOLOGY],
      ragParameters: {
        contextTags: ['predictive analytics', 'operational forecasting', 'resource planning'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'auto-ai-004',
    text: 'Do you use AI-powered virtual assistants for patient interaction or administrative tasks?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.AUTOMATION,
    moduleId: 'mod-automation-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, sophisticated virtual assistants for both clinical and administrative functions' },
      { value: 'moderate', score: 3, text: 'Yes, virtual assistants for multiple administrative functions' },
      { value: 'basic', score: 1, text: 'Basic chatbots for simple interactions only' },
      { value: 'none', score: 0, text: 'No virtual assistants implemented' }
    ],
    weight: 7,
    helpText: 'AI assistants can handle 60-70% of routine patient interactions and administrative tasks. Practices with comprehensive virtual assistant implementation typically reduce administrative staff needs by 20-30% while improving patient satisfaction.',
    impactAreas: ['Administrative efficiency', 'Patient experience', 'Staff focus'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice underutilizes virtual assistant technology',
        actionPrompts: [
          'Implement AI chatbot for appointment scheduling and FAQs',
          'Deploy virtual check-in assistant',
          'Create automated follow-up communication system'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'auto-ai-005',
    text: 'Have you implemented AI-driven personalization of treatment plans and home exercise programs?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.AUTOMATION,
    moduleId: 'mod-automation-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, AI continuously adapts programs based on adherence, feedback, and progress' },
      { value: 'moderate', score: 3, text: 'Yes, some AI-assisted personalization with manual oversight' },
      { value: 'minimal', score: 1, text: 'Limited personalization without true AI capabilities' },
      { value: 'none', score: 0, text: 'No AI-driven personalization implemented' }
    ],
    weight: 9,
    helpText: 'AI personalization dramatically improves program adherence and outcomes. Practices with comprehensive AI personalization typically see 40-60% higher exercise adherence and 25-35% better functional outcomes.',
    impactAreas: ['Treatment adherence', 'Clinical outcomes', 'Patient satisfaction'],
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
        interpretation: 'Your treatment plans lack personalization, limiting effectiveness',
        actionPrompts: [
          'Implement AI-powered exercise program generation',
          'Deploy adaptive programming based on patient feedback',
          'Measure adherence and outcomes differences with personalized approach'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.TECHNOLOGY],
      ragParameters: {
        contextTags: ['personalized treatment', 'adaptive programming', 'AI exercise prescription'],
        contentPriority: 9
      }
    }
  }
]; 