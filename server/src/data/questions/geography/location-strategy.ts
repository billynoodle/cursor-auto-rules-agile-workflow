/**
 * Geography Module - Location Strategy Questions
 * 
 * These questions probe deeply into practice location decisions with
 * intentionally challenging inquiries designed to reveal weaknesses in
 * geographic positioning and accessibility.
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

export const locationStrategyQuestions: Question[] = [
  {
    id: 'geo-loc-001',
    text: 'Have you conducted a formal catchment area analysis with demographic mapping for your practice location(s)?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.GEOGRAPHY,
    moduleId: 'mod-geography-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive analysis with regular updates and strategic planning' },
      { value: 'basic', score: 3, text: 'Yes, basic analysis conducted once' },
      { value: 'informal', score: 2, text: 'Informal assessment without data analysis' },
      { value: 'minimal', score: 1, text: 'Minimal consideration of catchment area' },
      { value: 'none', score: 0, text: 'No catchment analysis conducted' }
    ],
    weight: 8,
    helpText: 'Location-based patient demographics directly impact service needs, marketing strategies, and growth potential. Most practices miss 30-40% of growth opportunities due to poor location analysis.',
    impactAreas: ['Patient acquisition', 'Service mix', 'Growth strategy'],
    applicablePracticeSizes: [
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice lacks fundamental understanding of its market geography',
        actionPrompts: [
          'Conduct comprehensive catchment area analysis with 5-10km radius mapping',
          'Analyze demographic data for age, income, and health indicators',
          'Develop location-specific marketing strategies based on findings'
        ],
        priority: 8,
        timeframe: 'Medium-term (within 3 months)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.MARKETING],
      ragParameters: {
        contextTags: ['catchment analysis', 'geographic targeting', 'location strategy'],
        contentPriority: 8
      }
    }
  },
  {
    id: 'geo-loc-002',
    text: 'What is the average patient travel time to your practice?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.GEOGRAPHY,
    moduleId: 'mod-geography-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'under_10', score: 5, text: 'Under 10 minutes' },
      { value: '10_20', score: 4, text: '10-20 minutes' },
      { value: '20_30', score: 3, text: '20-30 minutes' },
      { value: '30_45', score: 1, text: '30-45 minutes' },
      { value: 'over_45', score: 0, text: 'Over 45 minutes or don\'t track' }
    ],
    weight: 7,
    helpText: 'Travel time directly impacts patient compliance and retention. Dropout rates increase by 15-25% for each additional 15 minutes of travel time.',
    impactAreas: ['Patient compliance', 'Attendance rates', 'Practice growth'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    benchmarkReference: 'Optimal travel time is under 20 minutes; >30 minutes significantly impacts compliance',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your patients face significant travel barriers impacting care',
        actionPrompts: [
          'Analyze completion rates by travel distance',
          'Consider satellite location for distant patient clusters',
          'Implement telehealth options for follow-up visits'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'geo-loc-003',
    text: 'Have you analyzed your location\'s accessibility including public transport, parking, and ADA compliance?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.GEOGRAPHY,
    moduleId: 'mod-geography-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive analysis with regular improvements' },
      { value: 'basic', score: 3, text: 'Yes, basic assessment with some improvements' },
      { value: 'minimal', score: 1, text: 'Minimal assessment of accessibility' },
      { value: 'none', score: 0, text: 'No formal accessibility assessment' }
    ],
    weight: 9,
    helpText: 'Accessibility barriers often eliminate 15-20% of potential patients. Poor accessibility disproportionately affects elderly and disabled populations who often need services most.',
    impactAreas: ['Patient access', 'Practice reputation', 'Inclusivity'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice has significant accessibility barriers limiting patient base',
        actionPrompts: [
          'Conduct comprehensive accessibility audit',
          'Implement priority improvements for critical barriers',
          'Create accessibility information sheet for website and new patients'
        ],
        priority: 9,
        timeframe: 'Short-term (within 1 month)'
      }
    },
    sopRelevance: {
      relevant: true,
      sopTypes: [SOPType.ADMINISTRATIVE, SOPType.COMPLIANCE],
      ragParameters: {
        contextTags: ['accessibility', 'ADA compliance', 'patient access'],
        contentPriority: 9
      }
    }
  },
  {
    id: 'geo-loc-004',
    text: 'What is your practice\'s proximity to complementary healthcare providers and referral sources?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.GEOGRAPHY,
    moduleId: 'mod-geography-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'optimal', score: 5, text: 'Located within healthcare hub with multiple referral sources' },
      { value: 'good', score: 4, text: 'Close proximity to several healthcare providers' },
      { value: 'moderate', score: 3, text: 'Moderate proximity to some healthcare providers' },
      { value: 'distant', score: 1, text: 'Distant from most healthcare providers' },
      { value: 'isolated', score: 0, text: 'Isolated from healthcare ecosystem' }
    ],
    weight: 7,
    helpText: 'Proximity to referral sources significantly impacts referral volume. Practices within 1km of major referrers typically receive 30-50% more referrals.',
    impactAreas: ['Referral volume', 'Professional networking', 'Collaborative care'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CONCERNING]: {
        interpretation: 'Your practice\'s location limits referral network development',
        actionPrompts: [
          'Map all healthcare providers within 5km radius',
          'Develop targeted outreach for proximate referral sources',
          'Consider satellite location near major referral clusters'
        ],
        priority: 7,
        timeframe: 'Medium-term (within 3 months)'
      }
    }
  },
  {
    id: 'geo-loc-005',
    text: 'Have you conducted a competitor density analysis for your location(s)?',
    type: QuestionType.MULTIPLE_CHOICE,
    category: AssessmentCategory.GEOGRAPHY,
    moduleId: 'mod-geography-001',
    applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
    universalQuestion: true,
    options: [
      { value: 'comprehensive', score: 5, text: 'Yes, comprehensive analysis with service differentiation strategy' },
      { value: 'basic', score: 3, text: 'Yes, basic analysis of competitor locations' },
      { value: 'minimal', score: 1, text: 'Minimal awareness of competitors' },
      { value: 'none', score: 0, text: 'No competitor analysis conducted' }
    ],
    weight: 8,
    helpText: 'Competitor density directly impacts market saturation and competitive pressure. Many practices fail due to overlooking the competitive landscape.',
    impactAreas: ['Competitive positioning', 'Service differentiation', 'Market share'],
    applicablePracticeSizes: [
      PracticeSize.SOLO,
      PracticeSize.SMALL,
      PracticeSize.MEDIUM,
      PracticeSize.LARGE,
      PracticeSize.ENTERPRISE
    ],
    trackingPeriod: 'Annual',
    scoreInterpretation: {
      [ScorePosition.CRITICAL]: {
        interpretation: 'Your practice lacks competitive awareness in your geographic market',
        actionPrompts: [
          'Map all competitors within primary catchment area',
          'Analyze competitor service offerings and positioning',
          'Develop clear service differentiation strategy'
        ],
        priority: 8,
        timeframe: 'Short-term (within 1 month)'
      }
    }
  }
]; 