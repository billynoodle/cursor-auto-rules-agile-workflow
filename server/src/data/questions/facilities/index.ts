/**
 * Facilities Module - Question Exports
 * 
 * This file consolidates exports for all facilities assessment questions.
 * Questions are organized into focused submodules targeting specific aspects of practice facilities.
 */

import { spaceUtilizationQuestions } from './space-utilization';

// Combine all facilities questions
export const facilitiesQuestions = [
  ...spaceUtilizationQuestions
];

// Export individual question sets
export { spaceUtilizationQuestions };
