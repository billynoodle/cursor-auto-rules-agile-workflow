/**
 * Marketing Module - Question Exports
 * 
 * This file consolidates exports for all marketing assessment questions.
 * Questions are organized into focused submodules targeting specific aspects of practice marketing.
 */

import { referralStrategyQuestions } from './referral-strategy';

// Combine all marketing questions
export const marketingQuestions = [
  ...referralStrategyQuestions
];

// Export individual question sets
export { referralStrategyQuestions };
