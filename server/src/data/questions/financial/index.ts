/**
 * Financial Health Module - Question Exports
 * 
 * This file consolidates exports for all financial assessment questions.
 * Questions are organized into focused submodules targeting specific financial aspects.
 */

import { revenueTrackingQuestions } from './revenue-tracking';
import { pricingStrategyQuestions } from './pricing-strategy';
import { expenseManagementQuestions } from './expense-management';
import { cashFlowPlanningQuestions } from './cash-flow-planning';

// Combine all financial questions
export const financialQuestions = [
  ...revenueTrackingQuestions,
  ...pricingStrategyQuestions,
  ...expenseManagementQuestions,
  ...cashFlowPlanningQuestions
];

// Export individual question sets
export { 
  revenueTrackingQuestions,
  pricingStrategyQuestions,
  expenseManagementQuestions,
  cashFlowPlanningQuestions
};
