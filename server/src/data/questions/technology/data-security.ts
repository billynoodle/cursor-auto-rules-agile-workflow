/**
 * Technology Module - Data Security Questions
 * 
 * These questions probe deeply into data security and privacy practices with
 * intentionally challenging inquiries designed to reveal vulnerabilities and
 * compliance gaps in practice security procedures.
 */

import { Question } from '../../../models/Question';
import { QuestionType } from '../../../models/QuestionType';
import { AssessmentCategory } from '../../../models/AssessmentCategory';
import { DisciplineType } from '../../../models/DisciplineType';
import { PracticeSize } from '../../../models/PracticeSize';
import { Country } from '../../../models/Country';
import { ScorePosition } from '../../../models/ScorePosition';
import { SOPType } from '../../../models/SOPType';
import { MaterialResourceType } from '../../../models/MaterialResourceType';

export const dataSecurity: Question[] = [
  {
    id: 'tech-sec-001',
    text: 'When was your last formal security risk assessment conducted, and by whom?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.TECHNOLOGY,
    moduleId: 'mod-technology-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'recent_external', score: 5, text: 'Within past year by qualified external party' },
      { value: 'recent_internal', score: 3, text: 'Within past year internally' },
      { value: 'outdated_external', score: 2, text: '1-3 years ago by external party' },
      { value: 'outdated_internal', score: 1, text: '1-3 years ago internally' },
      { value: 'never', score: 0, text: 'Never conducted or >3 years ago' }
    ],
    weight: 10,
    helpText: 'Security vulnerabilities evolve rapidly. Without regular third-party assessment, practices remain exposed to significant data breach risks and penalties.',
    impactAreas: ['Compliance risk', 'Data security', 'Business continuity'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'HIPAA requires regular risk assessments; best practice is annual third-party review',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has severe compliance violations and security vulnerabilities',
        actionPrompts: [
          'Schedule immediate security risk assessment with qualified third party',
          'Implement interim security enhancement measures',
          'Develop ongoing security assessment schedule'
        ],
        priority: 10,
        timeframe: 'Immediate (within 2 weeks)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.COMPLIANCE, SOPType.TECHNOLOGY],
      ragParameters: {
        contextTags: ['security risk assessment', 'HIPAA compliance', 'data protection'],
        contentPriority: 10,
        requiredInclusions: ['assessment frequency', 'scope requirements', 'documentation standards']
      }
    }
  },
  {
    id: 'tech-sec-002',
    text: 'Do you have a formal, tested data backup and disaster recovery plan?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.TECHNOLOGY,
    moduleId: 'mod-technology-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, with regular testing, offsite backups, and documented recovery procedures' },
      { value: 'formal_untested', score: 3, text: 'Yes, formal plan but not regularly tested' },
      { value: 'basic', score: 2, text: 'Basic backup system without formal recovery plan' },
      { value: 'minimal', score: 1, text: 'Minimal or ad-hoc backup procedures' },
      { value: 'none', score: 0, text: 'No formal backup or recovery system' }
    ],
    weight: 9,
    helpText: 'Data loss can be catastrophic. 60% of small businesses that experience major data loss close within 6 months.',
    impactAreas: ['Business continuity', 'Data integrity', 'Regulatory compliance'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice is at extreme risk of catastrophic data loss',
        actionPrompts: [
          'Implement immediate automated backup solution with encryption',
          'Create formal disaster recovery documentation',
          'Schedule quarterly recovery testing'
        ],
        priority: 9,
        timeframe: 'Immediate (within 2 weeks)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.TECHNOLOGY, SOPType.EMERGENCY],
      ragParameters: {
        contextTags: ['data backup', 'disaster recovery', 'business continuity'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'tech-sec-003',
    text: 'What percentage of your staff have received formal security awareness training in the past year?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.TECHNOLOGY,
    moduleId: 'mod-technology-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    weight: 8,
    minScore: 0,
    maxScore: 100,
    helpText: 'Staff behavior is the leading cause of security breaches. Without regular training, practices face significantly higher breach risks.',
    impactAreas: ['Data security', 'Compliance risk', 'Staff awareness'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'HIPAA requires training for all staff; best practice is 100% trained annually',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has dangerous security awareness gaps',
        actionPrompts: [
          'Implement mandatory security awareness training for all staff',
          'Create ongoing security communication program',
          'Conduct simulated phishing tests to assess vulnerabilities'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  },
  {
    id: 'tech-sec-004',
    text: 'Do you enforce strong password policies and multi-factor authentication for all systems containing patient data?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.TECHNOLOGY,
    moduleId: 'mod-technology-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, strong policies and MFA on all systems' },
      { value: 'partial_mfa', score: 3, text: 'Strong passwords with MFA on critical systems only' },
      { value: 'strong_no_mfa', score: 2, text: 'Strong passwords but no MFA' },
      { value: 'weak_policies', score: 1, text: 'Basic password requirements only' },
      { value: 'no_policies', score: 0, text: 'No formal password policies or enforcement' }
    ],
    weight: 8,
    helpText: 'Weak authentication is a primary attack vector. MFA reduces breach risk by over 99% compared to passwords alone.',
    impactAreas: ['Data security', 'Unauthorized access', 'Compliance'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has critical authentication vulnerabilities',
        actionPrompts: [
          'Implement password management system with strong requirements',
          'Enable MFA on all systems containing patient data',
          'Conduct quarterly access audit reviews'
        ],
        priority: 8,
        timeframe: 'Immediate (within 2 weeks)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.TECHNOLOGY, SOPType.COMPLIANCE],
      ragParameters: {
        contextTags: ['access control', 'authentication', 'password security'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'tech-sec-005',
    text: 'Have you conducted a thorough inventory of all devices and systems that store or access patient data, including personal devices?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.TECHNOLOGY,
    moduleId: 'mod-technology-002',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive inventory with regular updates and security controls' },
      { value: 'basic', score: 3, text: 'Yes, basic inventory of practice-owned devices only' },
      { value: 'partial', score: 2, text: 'Partial inventory of major systems only' },
      { value: 'outdated', score: 1, text: 'Outdated or incomplete inventory' },
      { value: 'none', score: 0, text: 'No formal inventory conducted' }
    ],
    weight: 7,
    helpText: 'You cannot secure what you don\'t know exists. Most practices have 30-50% more devices accessing patient data than they realize.',
    impactAreas: ['Data security', 'Device management', 'Breach risk'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Quarterly',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has unknown and unmanaged security exposures',
        actionPrompts: [
          'Conduct comprehensive device and system inventory',
          'Implement mobile device management for all devices accessing patient data',
          'Develop BYOD policy with security requirements'
        ],
        priority: 7,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.TECHNOLOGY, SOPType.COMPLIANCE],
      ragParameters: {
        contextTags: ['device inventory', 'asset management', 'security control'],
        contentPriority: 7
      }
    }
  }
]; 