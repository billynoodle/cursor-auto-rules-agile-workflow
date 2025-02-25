/**
 * Technology Module - Question Exports
 * 
 * This file consolidates exports for all technology assessment questions.
 * Questions are organized into focused submodules targeting specific aspects of practice technology.
 */

import { digitalAdoptionQuestions } from './digital-adoption';
import { dataSecurity } from './data-security';

// Combine all technology questions
export const technologyQuestions = [
  ...digitalAdoptionQuestions,
  ...dataSecurity
];

// Export individual question sets
export { digitalAdoptionQuestions };
export { dataSecurity };
