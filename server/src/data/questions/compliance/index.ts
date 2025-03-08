/**
 * Compliance Module - Question Exports
 * 
 * This file consolidates exports for all compliance assessment questions.
 * Questions are organized into focused submodules targeting specific aspects of practice compliance.
 */

import { riskManagementQuestions } from './risk-management';
import { regulatoryComplianceQuestions } from './regulatory-compliance';

// Combine all compliance questions
export const complianceQuestions = [
  ...riskManagementQuestions,
  ...regulatoryComplianceQuestions
];

// Export individual question sets
export { 
  riskManagementQuestions,
  regulatoryComplianceQuestions
};
