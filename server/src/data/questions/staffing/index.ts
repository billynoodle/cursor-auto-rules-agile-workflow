/**
 * Staffing Module - Question Exports
 * 
 * This file consolidates exports for all staffing assessment questions.
 * Questions are organized into focused submodules targeting specific aspects of practice staffing.
 */

import { practitionerPerformanceQuestions } from './practitioner-performance';
import { recruitmentRetentionQuestions } from './recruitment-retention';
import { professionalDevelopmentQuestions } from './professional-development';

// Combine all staffing questions
export const staffingQuestions = [
  ...practitionerPerformanceQuestions,
  ...recruitmentRetentionQuestions,
  ...professionalDevelopmentQuestions
];

// Export individual question sets
export { 
  practitionerPerformanceQuestions,
  recruitmentRetentionQuestions,
  professionalDevelopmentQuestions
};
