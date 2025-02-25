/**
 * Patient Care Module - Question Exports
 * 
 * This file consolidates exports for all patient care assessment questions.
 * Questions are organized into focused submodules targeting specific aspects of patient care.
 */

import { outcomesTrackingQuestions } from './outcomes-tracking';
import { patientExperienceQuestions } from './patient-experience';
import { clinicalPathwaysQuestions } from './clinical-pathways';

// Combine all patient care questions
export const patientCareQuestions = [
  ...outcomesTrackingQuestions,
  ...patientExperienceQuestions,
  ...clinicalPathwaysQuestions
];

// Export individual question sets
export { 
  outcomesTrackingQuestions,
  patientExperienceQuestions,
  clinicalPathwaysQuestions
};
