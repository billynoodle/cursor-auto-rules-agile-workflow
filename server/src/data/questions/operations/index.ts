/**
 * Operations Module - Question Exports
 * 
 * This file consolidates exports for all operations assessment questions.
 * Questions are organized into focused submodules targeting specific aspects of practice operations.
 */

import { appointmentSchedulingQuestions } from './appointment-scheduling';
import { workflowEfficiencyQuestions } from './workflow-efficiency';

// Combine all operations questions
export const operationsQuestions = [
  ...appointmentSchedulingQuestions,
  ...workflowEfficiencyQuestions
];

// Export individual question sets
export { appointmentSchedulingQuestions };
export { workflowEfficiencyQuestions };
