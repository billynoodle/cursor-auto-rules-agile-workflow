import { AssessmentCategory } from '../models/AssessmentCategory';

export interface BusinessImpact {
  sourceCategory: AssessmentCategory;
  impactedCategory: AssessmentCategory;
  impactScore: number; // 1-10 scale
  impactStatement: string;
  relatedSourceQuestions: string[]; // Question IDs
  relatedImpactedQuestions: string[]; // Question IDs
}

export const businessImpacts: BusinessImpact[] = [
  {
    sourceCategory: AssessmentCategory.FINANCIAL,
    impactedCategory: AssessmentCategory.STAFFING,
    impactScore: 8,
    impactStatement: 'Financial health directly impacts staffing capabilities, including recruitment, retention, and professional development budgets.',
    relatedSourceQuestions: [
      'fin-exp-006', // Staff compensation budget
      'fin-exp-007', // Professional development budget
      'fin-exp-008', // Staff turnover cost
      'fin-exp-011'  // Quality improvement and staff development budget
    ],
    relatedImpactedQuestions: [
      'staff-rec-001', // Time to fill positions
      'staff-rec-002', // Staff turnover rate
      'staff-rec-003', // Employee satisfaction
      'staff-dev-001', // Training budget per practitioner
      'staff-dev-002', // Clinical mentorship
      'staff-perf-001', // Practitioner productivity
      'staff-perf-003'  // Quality of care incentives
    ]
  },
  {
    sourceCategory: AssessmentCategory.TECHNOLOGY,
    impactedCategory: AssessmentCategory.OPERATIONS,
    impactScore: 9,
    impactStatement: 'Technology adoption and system integration significantly impact operational efficiency, workflow, and scheduling capabilities.',
    relatedSourceQuestions: [
      'tech-dig-001', // Patient interactions digitization
      'tech-dig-003', // Patient tracking tools
      'tech-dig-004', // EMR integration
      'tech-dig-005', // Digital workflow adoption
      'tech-dig-006', // Practice management integration
      'tech-dig-007', // Digital tool adoption
      'tech-dig-008'  // Scheduling system integration
    ],
    relatedImpactedQuestions: [
      'ops-sched-001', // Cancellation rate
      'ops-sched-002', // Practitioner utilization
      'ops-sched-003', // Appointment fill rate
      'ops-sched-005', // Online scheduling
      'ops-flow-003', // Insurance claim submission
      'ops-flow-004', // Patient flow mapping
      'ops-flow-005'  // Administrative task automation
    ]
  },
  {
    sourceCategory: AssessmentCategory.COMPLIANCE,
    impactedCategory: AssessmentCategory.TECHNOLOGY,
    impactScore: 8,
    impactStatement: 'Compliance requirements affect technology selection, security protocols, and data management practices.',
    relatedSourceQuestions: [
      'comp-sec-001', // Security policies
      'comp-sec-002', // Data protection
      'comp-sec-003', // Compliance training
      'comp-sec-004'  // Audit procedures
    ],
    relatedImpactedQuestions: [
      'tech-sec-001', // Security risk assessment
      'tech-sec-003', // Security training
      'tech-sec-004', // Password policies
      'tech-sec-005'  // Device inventory
    ]
  }
]; 