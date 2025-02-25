import { Module } from '../models/AssessmentModule';
import { AssessmentCategory } from '../models/AssessmentCategory';
import { DisciplineType } from '../models/DisciplineType';
import { PracticeSize } from '../models/PracticeSize';
import { Country } from '../models/Country';
import { ScorePosition } from '../models/ScorePosition';
import { SOPType } from '../models/SOPType';

/**
 * Sample physiotherapy assessment modules
 */
export const physiotherapyModules: Module[] = [
  // Financial Health Module
  {
    id: 'mod-financial-001',
    name: 'Financial Health',
    description: 'Assesses the financial health and sustainability of the physiotherapy practice',
    category: AssessmentCategory.FINANCIAL,
    order: 1,
    estimatedTimeMinutes: 15,
    weight: 9, // High importance
    minScore: 0,
    maxScore: 100,
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalModule: false,
    benchmarks: {
      poor: 0,
      belowAverage: 30,
      average: 50,
      good: 70,
      excellent: 90
    },
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    countrySpecific: {
      [Country.AUSTRALIA]: {
        benchmarks: {
          poor: 0,
          belowAverage: 35,
          average: 55,
          good: 75,
          excellent: 90
        }
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.COMPLIANCE]
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        description: 'Urgent financial intervention required',
        generalRecommendations: [
          'Immediate review of pricing structure',
          'Analyze expenses and identify cost-cutting opportunities',
          'Review appointment scheduling efficiency'
        ]
      },
      [ScorePosition.CONCERNING]: {
        description: 'Financial vulnerabilities detected',
        generalRecommendations: [
          'Review fee structure compared to local market',
          'Analyze patient retention rates',
          'Review insurance billing processes'
        ]
      },
      [ScorePosition.STABLE]: {
        description: 'Financially stable practice',
        generalRecommendations: [
          'Implement quarterly financial reviews',
          'Consider diversifying revenue streams',
          'Optimize appointment scheduling'
        ]
      },
      [ScorePosition.STRONG]: {
        description: 'Strong financial performance',
        generalRecommendations: [
          'Explore expansion opportunities',
          'Implement profit-sharing or performance bonuses',
          'Review investment in new equipment or technologies'
        ]
      },
      [ScorePosition.EXCEPTIONAL]: {
        description: 'Exceptional financial health',
        generalRecommendations: [
          'Consider expansion to multiple locations',
          'Develop mentorship or franchise model',
          'Implement advanced financial forecasting'
        ]
      }
    }
  },
  
  // Operations Module
  {
    id: 'mod-operations-001',
    name: 'Operational Efficiency',
    description: 'Evaluates the efficiency of day-to-day operations in a physiotherapy practice',
    category: AssessmentCategory.OPERATIONS,
    order: 2,
    estimatedTimeMinutes: 12,
    weight: 8,
    minScore: 0,
    maxScore: 100,
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalModule: false,
    benchmarks: {
      poor: 0,
      belowAverage: 30,
      average: 50,
      good: 70,
      excellent: 90
    },
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    disciplineSpecific: {
      [DisciplineType.PHYSIOTHERAPY]: {
        name: 'Physiotherapy Practice Operations',
        description: 'Evaluates the efficiency of physiotherapy-specific operations including patient flow, treatment room utilization, and equipment management',
        weight: 8,
        benchmarks: {
          poor: 0,
          belowAverage: 30,
          average: 50,
          good: 70,
          excellent: 90
        }
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.CLINICAL, SOPType.QUALITY]
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        description: 'Severe operational inefficiencies',
        generalRecommendations: [
          'Implement structured appointment scheduling system',
          'Reorganize treatment room layout',
          'Review equipment maintenance procedures'
        ]
      },
      [ScorePosition.CONCERNING]: {
        description: 'Operational challenges affecting efficiency',
        generalRecommendations: [
          'Review patient check-in/check-out procedures',
          'Analyze practitioner room allocation',
          'Assess equipment usage and accessibility'
        ]
      },
      [ScorePosition.STABLE]: {
        description: 'Stable operational performance',
        generalRecommendations: [
          'Monitor appointment no-shows and late cancellations',
          'Review supply ordering procedures',
          'Implement regular staff operational feedback'
        ]
      },
      [ScorePosition.STRONG]: {
        description: 'Strong operational systems',
        generalRecommendations: [
          'Fine-tune practitioner scheduling',
          'Optimize patient flow between services',
          'Develop advanced inventory management'
        ]
      },
      [ScorePosition.EXCEPTIONAL]: {
        description: 'Exceptional operational excellence',
        generalRecommendations: [
          'Document operational systems for potential scaling',
          'Implement predictive scheduling based on historical data',
          'Consider offering operational consulting to other practices'
        ]
      }
    }
  },
  
  // Patient Management Module
  {
    id: 'mod-patients-001',
    name: 'Patient Management',
    description: 'Evaluates the effectiveness of patient management systems and patient experience',
    category: AssessmentCategory.PATIENTS,
    order: 3,
    estimatedTimeMinutes: 10,
    weight: 9,
    minScore: 0,
    maxScore: 100,
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalModule: false,
    benchmarks: {
      poor: 0,
      belowAverage: 30,
      average: 50,
      good: 70,
      excellent: 90
    },
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    disciplineSpecific: {
      [DisciplineType.PHYSIOTHERAPY]: {
        name: 'Physiotherapy Patient Management',
        description: 'Evaluates the effectiveness of physiotherapy-specific patient management including assessment protocols, treatment planning, and progress tracking',
        weight: 9,
        benchmarks: {
          poor: 0,
          belowAverage: 35,
          average: 55,
          good: 75,
          excellent: 90
        }
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.CLINICAL, SOPType.QUALITY]
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        description: 'Critical issues in patient management',
        generalRecommendations: [
          'Implement standardized assessment templates',
          'Review treatment documentation procedures',
          'Establish clear communication protocols with patients'
        ]
      },
      [ScorePosition.CONCERNING]: {
        description: 'Patient management needs improvement',
        generalRecommendations: [
          'Review patient record management',
          'Assess discharge planning protocols',
          'Implement patient satisfaction tracking'
        ]
      },
      [ScorePosition.STABLE]: {
        description: 'Adequate patient management systems',
        generalRecommendations: [
          'Enhance patient education materials',
          'Implement progress tracking dashboard',
          'Review referral management processes'
        ]
      },
      [ScorePosition.STRONG]: {
        description: 'Strong patient management practices',
        generalRecommendations: [
          'Implement advanced outcome tracking',
          'Develop patient self-management resources',
          'Optimize digital communication channels'
        ]
      },
      [ScorePosition.EXCEPTIONAL]: {
        description: 'Exceptional patient-centered systems',
        generalRecommendations: [
          'Develop innovative patient engagement tools',
          'Implement predictive analytics for treatment planning',
          'Create comprehensive patient journey mapping'
        ]
      }
    }
  },
  
  // Technology Integration Module
  {
    id: 'mod-technology-001',
    name: 'Technology Integration',
    description: 'Assesses the use of technology in practice management and patient care',
    category: AssessmentCategory.TECHNOLOGY,
    order: 4,
    estimatedTimeMinutes: 10,
    weight: 7,
    minScore: 0,
    maxScore: 100,
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalModule: false,
    benchmarks: {
      poor: 0,
      belowAverage: 30,
      average: 50,
      good: 70,
      excellent: 90
    },
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    disciplineSpecific: {
      [DisciplineType.PHYSIOTHERAPY]: {
        name: 'Physiotherapy Technology Integration',
        description: 'Assesses the use of technology in physiotherapy-specific applications including telehealth, rehabilitation technologies, and digital assessment tools',
        weight: 7,
        benchmarks: {
          poor: 0,
          belowAverage: 25,
          average: 45,
          good: 65,
          excellent: 85
        }
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.TECHNOLOGY, SOPType.CLINICAL]
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        description: 'Significant technology gaps',
        generalRecommendations: [
          'Implement basic practice management software',
          'Setup electronic medical records',
          'Train staff on core digital tools'
        ]
      },
      [ScorePosition.CONCERNING]: {
        description: 'Underutilization of technology',
        generalRecommendations: [
          'Review current technology stack effectiveness',
          'Assess staff digital literacy',
          'Implement basic telehealth capabilities'
        ]
      },
      [ScorePosition.STABLE]: {
        description: 'Functional technology integration',
        generalRecommendations: [
          'Optimize electronic health record usage',
          'Implement patient portal features',
          'Explore digital exercise prescription tools'
        ]
      },
      [ScorePosition.STRONG]: {
        description: 'Strong technology ecosystem',
        generalRecommendations: [
          'Integrate wearable technology data',
          'Implement advanced telehealth services',
          'Develop data analytics capabilities'
        ]
      },
      [ScorePosition.EXCEPTIONAL]: {
        description: 'Cutting-edge technology implementation',
        generalRecommendations: [
          'Explore AI-assisted treatment planning',
          'Implement virtual reality rehabilitation',
          'Develop custom digital tools for patient engagement'
        ]
      }
    }
  },
  
  // Staffing Module
  {
    id: 'mod-staffing-001',
    name: 'Staffing and Professional Development',
    description: 'Evaluates staff management, recruitment, retention, and professional development',
    category: AssessmentCategory.STAFFING,
    order: 5,
    estimatedTimeMinutes: 12,
    weight: 8,
    minScore: 0,
    maxScore: 100,
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalModule: false,
    benchmarks: {
      poor: 0,
      belowAverage: 30,
      average: 50,
      good: 70,
      excellent: 90
    },
    applicablePracticeSizes: [
      PracticeSize.SMALL,  // Not relevant for solo practices
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    disciplineSpecific: {
      [DisciplineType.PHYSIOTHERAPY]: {
        name: 'Physiotherapy Staffing and Development',
        description: 'Evaluates physiotherapy-specific staffing considerations including specialized skills, continuing education, and clinical supervision',
        weight: 8,
        benchmarks: {
          poor: 0,
          belowAverage: 30,
          average: 50,
          good: 70,
          excellent: 90
        }
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.HR, SOPType.ADMINISTRATIVE]
    },
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        description: 'Critical staffing issues',
        generalRecommendations: [
          'Establish clear roles and responsibilities',
          'Implement basic staff onboarding process',
          'Review compensation structure'
        ]
      },
      [ScorePosition.CONCERNING]: {
        description: 'Staffing challenges affecting performance',
        generalRecommendations: [
          'Develop structured recruitment process',
          'Implement regular staff meetings',
          'Create basic professional development plans'
        ]
      },
      [ScorePosition.STABLE]: {
        description: 'Stable staffing practices',
        generalRecommendations: [
          'Enhance continuing education support',
          'Implement peer mentoring program',
          'Review staff satisfaction and engagement'
        ]
      },
      [ScorePosition.STRONG]: {
        description: 'Strong staff management and development',
        generalRecommendations: [
          'Develop career progression pathways',
          'Implement advanced clinical supervision model',
          'Create specialized skill development program'
        ]
      },
      [ScorePosition.EXCEPTIONAL]: {
        description: 'Exceptional staff culture and development',
        generalRecommendations: [
          'Implement leadership development program',
          'Create teaching and research opportunities',
          'Develop innovation incubator for staff ideas'
        ]
      }
    }
  }
]; 