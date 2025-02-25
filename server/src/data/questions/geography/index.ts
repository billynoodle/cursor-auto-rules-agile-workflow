/**
 * Geography Module - Index
 * 
 * This file consolidates exports for all geography assessment questions,
 * making it easier to import them into the main application.
 */

import { locationStrategyQuestions } from './location-strategy';
import { demographicAnalysisQuestions } from './demographic-analysis';

// Combine all geography questions into a single export
export const geographyQuestions = [
  ...locationStrategyQuestions,
  ...demographicAnalysisQuestions
];

// Export individual question sets
export { locationStrategyQuestions, demographicAnalysisQuestions }; 