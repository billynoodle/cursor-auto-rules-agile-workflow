/**
 * Automation Module - Process Automation Questions
 * 
 * These questions probe deeply into practice automation capabilities with
 * intentionally challenging inquiries designed to reveal inefficiencies
 * and manual processes that could be automated.
 */

import { Question } from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import { AssessmentCategory } from '../../../models/AssessmentCategory';
import { DisciplineType } from '../../../models/DisciplineType';
import { PracticeSize } from '../../../models/PracticeSize';
import { ScorePosition } from '../../../models/ScorePosition';
import { SOPType } from '../../../models/SOPType';

export const processAutomationQuestions: Question[] = [
  {
    id: 'auto-proc-001',
    text: 'What percentage of your administrative tasks are currently automated?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.AUTOMATION,
    moduleId: 'mod-automation-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'high', score: 5, text: '75-100%' },
      { value: 'moderate', score: 3, text: '50-74%' },
      { value: 'low', score: 1, text: '25-49%' },
      { value: 'minimal', score: 0, text: 'Less than 25%' }
    ],
    weight: 9,
    helpText: 'Administrative task automation directly impacts operational efficiency and staff satisfaction. High-performing practices automate 70%+ of repetitive tasks, freeing staff for higher-value activities.',
    impactAreas: ['Operational efficiency', 'Staff utilization', 'Cost control'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'Top quartile practices automate >75% of administrative tasks',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is wasting significant resources on manual processes',
        actionPrompts: [
          'Conduct process audit to identify high-volume repetitive tasks',
          'Implement automated appointment reminders within 30 days',
          'Automate insurance verification within 60 days'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.TECHNOLOGY],
      ragParameters: {
        contextTags: ['process automation', 'workflow efficiency', 'administrative tasks'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'auto-proc-002',
    text: 'Have you implemented intelligent scheduling automation with predictive capabilities?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.AUTOMATION,
    moduleId: 'mod-automation-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'advanced', score: 5, text: 'Yes, AI-driven scheduling with optimization and predictive analytics' },
      { value: 'basic', score: 3, text: 'Yes, rule-based automated scheduling' },
      { value: 'minimal', score: 1, text: 'Partial automation of basic scheduling functions' },
      { value: 'none', score: 0, text: 'No scheduling automation implemented' }
    ],
    weight: 8,
    helpText: 'Intelligent scheduling directly impacts provider utilization and patient access. Advanced scheduling automation typically increases provider utilization by 15-25% and reduces no-shows by 30-40%.',
    impactAreas: ['Provider productivity', 'Patient access', 'Revenue optimization'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice scheduling processes are inefficient and reactive',
        actionPrompts: [
          'Implement basic automation rules for appointment types and durations',
          'Enable patient self-scheduling capabilities',
          'Implement predictive no-show modeling with overbook protocols'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'auto-proc-003',
    text: 'Do you utilize automated patient engagement workflows for education and adherence?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.AUTOMATION,
    moduleId: 'mod-automation-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive engagement automation with personalized pathways' },
      { value: 'basic', score: 3, text: 'Yes, basic automated reminders and education materials' },
      { value: 'minimal', score: 1, text: 'Minimal automation for standard communications only' },
      { value: 'none', score: 0, text: 'No automated patient engagement' }
    ],
    weight: 7,
    helpText: 'Automated engagement significantly impacts patient adherence and outcomes. Practices with comprehensive engagement automation typically see 35-45% higher exercise adherence and 25-30% better outcomes.',
    impactAreas: ['Patient adherence', 'Clinical outcomes', 'Patient satisfaction'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your patient engagement is inconsistent and staff-dependent',
        actionPrompts: [
          'Implement automated exercise reminder system',
          'Develop condition-specific education automation workflows',
          'Track engagement metrics and correlate with outcomes'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.TECHNOLOGY],
      ragParameters: {
        contextTags: ['patient engagement', 'adherence', 'automated communication'],
        contentPriority: 7
      }
    }
  },
  {
    id: 'auto-proc-004',
    text: 'Have you implemented automated revenue cycle management processes?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.AUTOMATION,
    moduleId: 'mod-automation-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, end-to-end RCM automation with exception-based workflows' },
      { value: 'advanced', score: 4, text: 'Yes, advanced automation of most RCM processes' },
      { value: 'partial', score: 2, text: 'Partial automation of basic billing functions' },
      { value: 'minimal', score: 1, text: 'Minimal RCM automation' },
      { value: 'none', score: 0, text: 'No RCM automation implemented' }
    ],
    weight: 9,
    helpText: 'RCM automation directly impacts cash flow and administrative costs. Practices with comprehensive RCM automation typically reduce days in A/R by 30-40% and billing staff needs by 40-60%.',
    impactAreas: ['Cash flow', 'Revenue capture', 'Administrative efficiency'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'Top-performing practices have <25 days in A/R with 95%+ clean claim rates',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your revenue cycle is inefficient and vulnerable to errors and delays',
        actionPrompts: [
          'Implement automated eligibility verification',
          'Automate claim scrubbing and submission processes',
          'Deploy denial management automation with root cause analysis'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'auto-proc-005',
    text: 'Do you use automated analytics and reporting for business intelligence?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.AUTOMATION,
    moduleId: 'mod-automation-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive automated analytics with predictive modeling and alerts' },
      { value: 'basic', score: 3, text: 'Yes, basic automated dashboards and reports' },
      { value: 'minimal', score: 1, text: 'Minimal automated reports with manual analysis' },
      { value: 'none', score: 0, text: 'No automated analytics or reporting' }
    ],
    weight: 8,
    helpText: 'Automated analytics enables data-driven decision making. Practices with comprehensive analytics automation typically identify problems 70-80% faster and make strategic adjustments 40-50% more effectively.',
    impactAreas: ['Decision speed', 'Strategic planning', 'Performance optimization'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice lacks critical business intelligence capabilities',
        actionPrompts: [
          'Implement automated KPI dashboard with daily updates',
          'Deploy exception reporting with SMS/email alerts',
          'Establish weekly automated performance trending reports'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.TECHNOLOGY],
      ragParameters: {
        contextTags: ['analytics', 'business intelligence', 'data-driven decisions'],
        contentPriority: 8
      }
    }
  }
]; 