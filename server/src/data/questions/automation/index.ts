/**
 * Automation Module - Index
 * 
 * This file consolidates exports for all automation assessment questions,
 * making it easier to import them into the main application.
 */

import { processAutomationQuestions } from './process-automation';
import { aiIntegrationQuestions } from './ai-integration';

// Combine all automation questions into a single export
export const automationQuestions = [
  ...processAutomationQuestions,
  ...aiIntegrationQuestions
];

// Export individual question sets
export { processAutomationQuestions, aiIntegrationQuestions }; 