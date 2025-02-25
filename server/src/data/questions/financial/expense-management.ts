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
  }
]; 