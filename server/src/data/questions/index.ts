/**
 * Question Module Exports
 * 
 * This file consolidates exports from all question modules for easier importing.
 * Each business area is broken into focused modules with specific question sets.
 */

// Financial module exports
export * from './financial';

// Operations module exports
export * from './operations';

// Patient Care module exports
export * from './patient-care';

// Technology module exports
export * from './technology';

// Staffing module exports
export * from './staffing';

// Marketing module exports
export * from './marketing';

// Compliance module exports
export * from './compliance';

// Facilities module exports
export * from './facilities';

// Geography module exports
export * from './geography';

// Automation module exports
export * from './automation';

// Import individual question sets
import * as financial from './financial';
import * as operations from './operations';
import * as patientCare from './patient-care';
import * as technology from './technology';
import * as staffing from './staffing';
import * as marketing from './marketing';
import * as compliance from './compliance';
import * as facilities from './facilities';
import * as geography from './geography';
import * as automation from './automation';
import { Question } from '../../models/Question';

/**
 * Loads all questions from all categories
 * 
 * @returns An array of all questions
 */
export function loadAllQuestions(): Question[] {
  // Collect all question arrays from all modules
  const allQuestionArrays = [
    ...Object.values(financial),
    ...Object.values(operations),
    ...Object.values(patientCare),
    ...Object.values(technology),
    ...Object.values(staffing),
    ...Object.values(marketing),
    ...Object.values(compliance),
    ...Object.values(facilities),
    ...Object.values(geography),
    ...Object.values(automation)
  ];
  
  // Flatten all question arrays
  return allQuestionArrays
    .filter(item => Array.isArray(item)) // Keep only arrays
    .flat() // Flatten arrays of questions
    .filter(q => q && q.id); // Ensure only valid question objects
} 