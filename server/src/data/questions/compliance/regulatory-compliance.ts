/**
 * Compliance Module - Regulatory Compliance Questions
 * 
 * These questions probe deeply into regulatory compliance practices with
 * intentionally challenging inquiries designed to reveal vulnerabilities and
 * compliance gaps in practice procedures.
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

export const regulatoryComplianceQuestions: Question[] = [
  {
    id: 'comp-risk-006',
    text: 'How often do you provide training to your staff on privacy policies and procedures, including the handling of personal and health information?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.COMPLIANCE,
    moduleId: 'mod-compliance-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'annually', score: 5, text: 'Annually or more frequently with documented training records' },
      { value: 'biennial', score: 3, text: 'Every 2 years with documented training records' },
      { value: 'irregular', score: 1, text: 'Irregularly or without formal documentation' },
      { value: 'none', score: 0, text: 'No formal privacy training provided' }
    ],
    weight: 8,
    helpText: 'Regular staff training on privacy is a must under Australian law to protect patient data. It covers things like secure record-keeping, getting patient consent, and what to do if data is lost or stolen. No training means higher breach risks—and penalties can hit hard.',
    impactAreas: ['Data protection', 'Regulatory compliance', 'Staff awareness'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'Australian Privacy Act 1988 and Australian Privacy Principles require regular training',
    countrySpecific: {
      [Country.AUSTRALIA]: {
        helpText: 'In Australia, the Privacy Act 1988 and the Australian Privacy Principles (APPs) set strict rules for handling sensitive patient data, like health records. Regular training ensures your staff knows how to keep this information safe—think secure filing, proper consent, or safe data sharing. Without it, you risk breaches that could lead to fines (up to $2.5 million for serious breaches) or legal headaches. For example, a staff member might accidentally email patient details to the wrong person if they\'re not trained on privacy protocols.'
      }
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has dangerous privacy compliance gaps',
        actionPrompts: [
          'Implement immediate staff privacy training program',
          'Develop privacy policies and procedures',
          'Create documentation system for training records'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.COMPLIANCE, SOPType.ADMINISTRATIVE],
      ragParameters: {
        contextTags: ['privacy training', 'data protection', 'staff education'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'comp-risk-007',
    text: 'What is the status of your workplace health and safety plan?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.COMPLIANCE,
    moduleId: 'mod-compliance-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'annually', score: 5, text: 'Documented plan that is reviewed and updated annually or more frequently' },
      { value: 'biennial', score: 3, text: 'Documented plan that is reviewed every 2 years' },
      { value: 'irregular', score: 1, text: 'Documented plan but reviewed irregularly or less than every 2 years' },
      { value: 'none', score: 0, text: 'No documented safety plan or no regular reviews' }
    ],
    weight: 7,
    helpText: 'Australian law says you need a safety plan covering hazards like equipment, infections, or emergencies. Reviewing it keeps it up-to-date—say, after new equipment arrives or an incident happens. Without one, you\'re exposed to penalties and safety risks.',
    impactAreas: ['Staff safety', 'Patient safety', 'Regulatory compliance'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'Work Health and Safety Act 2011 requires regular safety plan reviews',
    countrySpecific: {
      [Country.AUSTRALIA]: {
        helpText: 'The Work Health and Safety Act 2011 requires a safe environment for your staff and patients. Physiotherapy involves physical risks—lifting patients, using equipment, or even tripping hazards in the clinic. A documented plan, regularly checked, keeps everyone safe and meets legal standards. For instance, updating it after adding new exercise machines could prevent injuries. No plan? You\'re risking fines (up to $500,000 for businesses) or lawsuits if someone gets hurt.'
      }
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has critical workplace safety compliance gaps',
        actionPrompts: [
          'Develop comprehensive workplace health and safety plan',
          'Implement safety hazard identification process',
          'Create regular review schedule with accountability'
        ],
        priority: 7,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.COMPLIANCE, SOPType.EMERGENCY],
      ragParameters: {
        contextTags: ['workplace safety', 'WHS compliance', 'risk management'],
        contentPriority: 7
      }
    }
  },
  {
    id: 'comp-risk-008',
    text: 'What percentage of your registered physiotherapists have completed their required continuing professional development (CPD) hours for the current registration period?',
    type: QuestionType.NUMERIC,
    category: AssessmentCategory.COMPLIANCE,
    moduleId: 'mod-compliance-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: false,
    weight: 8,
    minScore: 0,
    maxScore: 100,
    helpText: 'Aussie physios must do 20 CPD hours yearly to keep their registration. It\'s about staying current—think workshops or compliance updates. Falling behind risks losing practitioners, disrupting your practice. Track it to stay safe.',
    impactAreas: ['Professional standards', 'Registration compliance', 'Care quality'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'Physiotherapy Board of Australia requires 20 CPD hours annually; best practice is 100% completion',
    countrySpecific: {
      [Country.AUSTRALIA]: {
        helpText: 'In Australia, physiotherapists need 20 CPD hours each year to stay registered with the Physiotherapy Board of Australia. This keeps them sharp on treatments and rules—like learning a new rehab technique or brushing up on billing compliance. If they don\'t complete it, they could lose registration, leaving your practice short-staffed or damaging your reputation. Tracking this ensures everyone\'s compliant. For example, 100% completion means no surprises at renewal time.'
      }
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practitioners are at risk of registration non-compliance',
        actionPrompts: [
          'Implement CPD tracking system for all practitioners',
          'Create quarterly CPD status reviews',
          'Develop CPD planning assistance for practitioners behind schedule'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.COMPLIANCE, SOPType.HR],
      ragParameters: {
        contextTags: ['CPD compliance', 'professional registration', 'continuing education'],
        contentPriority: 8
      }
    }
  }
]; 