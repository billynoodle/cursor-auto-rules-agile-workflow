/**
 * Financial Health Module - Expense Management Questions
 * 
 * These questions probe deeply into expense control practices with
 * intentionally challenging inquiries designed to reveal weaknesses in
 * cost management, overhead control, and budget planning.
 * 
 * NOTE: As per the Tooltip Readability Review Initiative (2024-08-05),
 * all helpText in this file should be reviewed for:
 * - Plain language accessibility
 * - Elimination of unnecessary jargon
 * - Clarity of examples and explanations
 * - Appropriate context (benchmarks, metrics)
 * - Consistent tone and difficulty level
 * 
 * The overhead ratio question (fin-exp-001) has been updated with an enhanced
 * tooltip that can serve as a model for other questions in this module.
 */

import { Question } from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import { AssessmentCategory } from '../../../models/AssessmentCategory';
import { DisciplineType } from '../../../models/DisciplineType';
import { PracticeSize } from '../../../models/PracticeSize';
import { ScorePosition } from '../../../models/ScorePosition';
import { SOPType } from '../../../models/SOPType';

export const expenseManagementQuestions: Question[] = [
  {
    id: 'fin-exp-001',
    text: 'What is your practice\'s overhead ratio (total expenses excluding provider compensation divided by total revenue)?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'excellent', score: 5, text: '<40% overhead ratio' },
      { value: 'good', score: 4, text: '40-49% overhead ratio' },
      { value: 'average', score: 3, text: '50-59% overhead ratio' },
      { value: 'concerning', score: 1, text: '60-69% overhead ratio' },
      { value: 'critical', score: 0, text: '≥70% overhead ratio or don\'t track' }
    ],
    weight: 9,
    helpText: 'Overhead ratio shows what percentage of your income goes to running costs before paying practitioners. To calculate it: Add up all expenses (rent, staff wages, utilities, supplies, etc.) but don\'t include what you pay to practitioners. Then divide by your total income and multiply by 100. For example, if your practice makes $300,000 per year and spends $150,000 on expenses (not counting payments to practitioners), your overhead ratio is 50%. The lower this number, the more money available for practitioners and profit. Most successful practices keep this under 45%, while practices struggling with profitability often have overhead over 65%. Even a 5% reduction in overhead could mean thousands of dollars more available for practitioner pay or practice investment.',
    impactAreas: ['Profitability', 'Financial sustainability', 'Cash flow'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    benchmarkReference: 'Industry standard for physiotherapy: 40-50% overhead ratio',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has excessive overhead seriously threatening profitability',
        actionPrompts: [
          'Conduct comprehensive expense audit to identify top cost drivers',
          'Develop cost reduction plan targeting 15-20% reduction in 90 days',
          'Implement zero-based budgeting for next quarter'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.FINANCIAL],
      ragParameters: {
        contextTags: ['expense management', 'overhead control', 'cost reduction'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'fin-exp-002',
    text: 'How frequently do you analyze expense variances against budget by category?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'weekly', score: 5, text: 'Weekly with formal variance analysis and action plans' },
      { value: 'monthly', score: 4, text: 'Monthly with formal variance analysis and action plans' },
      { value: 'quarterly', score: 2, text: 'Quarterly review of major expenses' },
      { value: 'annual', score: 1, text: 'Annual or sporadic review' },
      { value: 'never', score: 0, text: 'No formal expense analysis or no budget' }
    ],
    weight: 8,
    helpText: 'Regular expense analysis enables rapid cost control. Practices with weekly expense monitoring typically identify and address cost overruns 3-4x faster than peers.',
    impactAreas: ['Cost control', 'Budget adherence', 'Financial discipline'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Weekly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your expense management is reactive rather than proactive',
        actionPrompts: [
          'Implement weekly expense tracking system with category-level detail',
          'Create automated variance alerts for spending exceeding 10% of budget',
          'Establish monthly expense review with all department heads'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'fin-exp-003',
    text: 'Do you have a formal procurement process with competitive bidding for major expenses?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive procurement system with bidding, approval workflows, and vendor performance metrics' },
      { value: 'basic', score: 3, text: 'Yes, basic procurement process with some competitive bidding' },
      { value: 'informal', score: 1, text: 'Informal process with occasional price comparison' },
      { value: 'none', score: 0, text: 'No formal procurement process' }
    ],
    weight: 7,
    helpText: 'Formalized procurement typically reduces supply costs by 15-25% and prevents unnecessary purchases. Many practices overpay by 20-30% due to poor procurement practices.',
    impactAreas: ['Supply costs', 'Vendor management', 'Purchasing efficiency'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your purchasing lacks controls, leading to overspending',
        actionPrompts: [
          'Implement approval workflows for expenses exceeding defined thresholds',
          'Require competitive bids for purchases over $1,000',
          'Conduct annual vendor reviews with performance metrics'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.FINANCIAL],
      ragParameters: {
        contextTags: ['procurement', 'purchasing', 'vendor management'],
        contentPriority: 7
      }
    }
  },
  {
    id: 'fin-exp-004',
    text: 'How do you manage discretionary spending and staff expense reimbursements?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Comprehensive policy with pre-approval workflows, digital receipts, and monthly audits' },
      { value: 'formal', score: 3, text: 'Formal policy with approval thresholds and receipt requirements' },
      { value: 'basic', score: 1, text: 'Basic policy with minimal controls' },
      { value: 'none', score: 0, text: 'No formal expense policy or controls' }
    ],
    weight: 6,
    helpText: 'Uncontrolled discretionary spending often accounts for 5-10% of practice expenses. Strong expense controls typically reduce discretionary spending by 30-40%.',
    impactAreas: ['Cost control', 'Staff accountability', 'Financial governance'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Monthly',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your discretionary spending lacks adequate controls',
        actionPrompts: [
          'Develop clear expense reimbursement policy with approval thresholds',
          'Implement digital receipt capture and expense categorization',
          'Conduct quarterly expense audits of reimbursed expenses'
        ],
        priority: 6,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'fin-exp-005',
    text: 'Do you utilize a zero-based budgeting approach requiring justification for all expenses each budget cycle?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive zero-based budgeting with ROI analysis for all major expenses' },
      { value: 'partial', score: 3, text: 'Partial implementation for selected expense categories' },
      { value: 'attempted', score: 1, text: 'Attempted but inconsistently implemented' },
      { value: 'none', score: 0, text: 'No zero-based budgeting or formal budget process' }
    ],
    weight: 7,
    helpText: 'Zero-based budgeting eliminates legacy spending and forces cost justification. Practices implementing this approach typically reduce expenses by 15-25% in the first year.',
    impactAreas: ['Cost reduction', 'Resource allocation', 'Operational efficiency'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your budget process perpetuates historical spending without critical evaluation',
        actionPrompts: [
          'Implement zero-based budgeting for next fiscal year',
          'Require detailed justification for all expense categories',
          'Establish quarterly budget reforecasting with variance analysis'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.FINANCIAL],
      ragParameters: {
        contextTags: ['budgeting', 'zero-based budget', 'expense justification'],
        contentPriority: 7
      }
    }
  },
  {
    id: 'fin-exp-006',
    text: 'What percentage of your total revenue is allocated to staff compensation and benefits?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 9,
    minScore: 0,
    maxScore: 100,
    helpText: 'Staff compensation and benefits typically represent the largest expense category. Industry benchmarks suggest 40-50% of revenue should go to staff compensation and benefits. This includes salaries, bonuses, health insurance, retirement contributions, and other benefits.',
    impactAreas: ['Staff retention', 'Financial sustainability', 'Competitive compensation'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    benchmarkReference: 'Industry average: 40-50% of revenue',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your staff compensation ratio is significantly outside industry norms',
        actionPrompts: [
          'Review compensation structure and market rates',
          'Analyze productivity metrics against compensation',
          'Consider restructuring benefits package'
        ],
        priority: 9,
        timeframe: 'Within 3 months'
      }
    }
  },
  {
    id: 'fin-exp-007',
    text: 'What is your annual budget for staff professional development and training?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 8,
    minScore: 0,
    maxScore: 10000,
    helpText: 'Investment in staff development directly impacts quality of care and staff retention. Leading practices invest $1,500-2,500 per staff member annually in professional development.',
    impactAreas: ['Staff development', 'Care quality', 'Staff retention'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annually',
    benchmarkReference: 'Leading practices: $1,500-2,500 per staff member annually',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Low investment in staff development may impact care quality and retention',
        actionPrompts: [
          'Review professional development budget allocation',
          'Research cost-effective training options',
          'Consider implementing a training ROI tracking system'
        ],
        priority: 8,
        timeframe: 'Within 6 months'
      }
    }
  },
  {
    id: 'fin-exp-008',
    text: 'What is your current staff turnover cost (recruitment, onboarding, lost productivity) per position?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 9,
    minScore: 0,
    maxScore: 50000,
    helpText: 'Staff turnover costs typically range from 1-3x the position\'s annual salary. This includes direct costs (recruitment, training) and indirect costs (lost productivity, impact on team morale). High turnover significantly impacts financial performance.',
    impactAreas: ['Staff retention', 'Financial stability', 'Operational efficiency'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annually',
    benchmarkReference: 'Industry average: 1-3x annual salary per turnover',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'High turnover costs are significantly impacting financial performance',
        actionPrompts: [
          'Analyze root causes of turnover',
          'Review compensation and benefits package',
          'Implement retention strategies'
        ],
        priority: 9,
        timeframe: 'Within 3 months'
      }
    }
  },
  {
    id: 'fin-exp-009',
    text: 'What percentage of your annual revenue is invested in technology infrastructure and digital transformation initiatives?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'excellent', score: 5, text: '8-10% of revenue' },
      { value: 'good', score: 4, text: '5-7% of revenue' },
      { value: 'average', score: 3, text: '3-4% of revenue' },
      { value: 'concerning', score: 1, text: '1-2% of revenue' },
      { value: 'critical', score: 0, text: '<1% of revenue or don\'t track' }
    ],
    weight: 8,
    helpText: 'Technology investment is crucial for operational efficiency and patient care quality. This includes EMR systems, practice management software, patient engagement platforms, and automation tools. Industry benchmarks suggest successful practices invest 5-10% of revenue in technology to stay competitive and efficient. Consider how technology investments impact staff productivity, patient satisfaction, and operational workflows. Regular technology upgrades can reduce administrative burden, improve patient scheduling efficiency, and enhance data security compliance.',
    impactAreas: ['Technology adoption', 'Operational efficiency', 'Patient experience', 'Staff productivity'],
    applicablePracticeSizes: [PracticeSize.SOLO, PracticeSize.SMALL, PracticeSize.MEDIUM, PracticeSize.LARGE]
  },
  {
    id: 'fin-exp-010',
    text: 'What is your practice\'s patient acquisition cost (marketing spend divided by number of new patients)?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'excellent', score: 5, text: '<$50 per patient' },
      { value: 'good', score: 4, text: '$50-75 per patient' },
      { value: 'average', score: 3, text: '$76-100 per patient' },
      { value: 'concerning', score: 1, text: '$101-150 per patient' },
      { value: 'critical', score: 0, text: '>$150 per patient or don\'t track' }
    ],
    weight: 7,
    helpText: 'Patient acquisition cost (PAC) is a key metric that connects marketing effectiveness with financial performance. Calculate it by dividing your total marketing spend by the number of new patients acquired. This metric helps optimize marketing ROI and patient growth strategies. Lower PAC indicates efficient marketing and strong patient referral networks. Consider how your digital presence, community outreach, and patient satisfaction affect acquisition costs. Track this alongside patient retention rates to understand the full patient lifecycle value.',
    impactAreas: ['Marketing efficiency', 'Patient growth', 'Financial performance', 'Practice sustainability'],
    applicablePracticeSizes: [PracticeSize.SOLO, PracticeSize.SMALL, PracticeSize.MEDIUM, PracticeSize.LARGE]
  },
  {
    id: 'fin-exp-011',
    text: 'What percentage of your operational budget is allocated to quality improvement initiatives and staff development programs?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.FINANCIAL,
    moduleId: 'mod-financial-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'excellent', score: 5, text: '>6% of operational budget' },
      { value: 'good', score: 4, text: '4-6% of operational budget' },
      { value: 'average', score: 3, text: '2-3% of operational budget' },
      { value: 'concerning', score: 1, text: '1-2% of operational budget' },
      { value: 'critical', score: 0, text: '<1% of operational budget or don\'t track' }
    ],
    weight: 8,
    helpText: 'Investment in quality improvement and staff development directly impacts patient care quality, staff retention, and operational efficiency. This includes continuing education, process improvement initiatives, certification programs, and quality management systems. High-performing practices typically allocate 4-6% of their operational budget to these areas. Consider how these investments affect patient outcomes, staff satisfaction, and compliance requirements. Regular staff development programs can reduce errors, improve patient satisfaction, and strengthen team capabilities.',
    impactAreas: ['Quality of care', 'Staff development', 'Operational excellence', 'Compliance', 'Patient satisfaction'],
    applicablePracticeSizes: [PracticeSize.SOLO, PracticeSize.SMALL, PracticeSize.MEDIUM, PracticeSize.LARGE]
  }
]; 