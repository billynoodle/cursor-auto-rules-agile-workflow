import React, { useState } from 'react';
import QuestionModule from '../components/assessment/QuestionModule';
import './AssessmentPage.css';

/**
 * AssessmentPage component for displaying the assessment questionnaire
 * 
 * Features:
 * - Multiple question modules
 * - Progress tracking
 * - Save and resume functionality
 * - Mobile-friendly design
 */
const AssessmentPage: React.FC = () => {
  // Sample data for demonstration
  const [modules] = useState([
    {
      id: 'mod-financial-001',
      title: 'Financial Health Assessment',
      description: 'This module evaluates your practice\'s financial health including revenue tracking, expense management, and cash flow planning.',
      questions: [
        {
          id: 'fin-cash-001',
          text: 'What is your practice\'s current accounts receivable aging profile?',
          type: 'MULTIPLE_CHOICE' as const,
          helpText: 'This question looks at how quickly you\'re getting paid after providing services. "Accounts receivable" (AR) simply means money owed to your practice by patients and insurance companies. The "aging profile" shows how long these unpaid bills have been outstanding. For example, if you have $10,000 in unpaid bills and $9,000 of that is from services provided in the last 30 days, then 90% of your AR is under 30 days (which is excellent). The longer bills remain unpaid, the less likely you\'ll ever collect them. For every day beyond 30 days, you lose roughly 1% chance of getting paid. Bills older than 90 days have less than a 50% chance of collection. Having most of your AR under 30 days means better cash flow and fewer collection headaches. You can check this in your practice management software by running an "AR aging report."',
          options: [
            { value: 'excellent', score: 5, text: '>90% of AR under 30 days, <2% over 90 days' },
            { value: 'good', score: 4, text: '>80% of AR under 30 days, <5% over 90 days' },
            { value: 'average', score: 3, text: '>70% of AR under 30 days, <10% over 90 days' },
            { value: 'concerning', score: 1, text: '<70% of AR under 30 days, 10-20% over 90 days' },
            { value: 'critical', score: 0, text: '<60% of AR under 30 days, >20% over 90 days or don\'t track' }
          ]
        },
        {
          id: 'fin-cash-002',
          text: 'What is your practice\'s minimum cash reserve policy (expressed as months of operating expenses)?',
          type: 'MULTIPLE_CHOICE' as const,
          helpText: 'Cash reserves protect against revenue disruptions and enable strategic investments. Practices with <3 months of reserves are 4x more likely to face financial distress during business disruptions.',
          options: [
            { value: 'robust', score: 5, text: '≥6 months of operating expenses' },
            { value: 'strong', score: 4, text: '4-5 months of operating expenses' },
            { value: 'adequate', score: 3, text: '3 months of operating expenses' },
            { value: 'minimal', score: 1, text: '1-2 months of operating expenses' },
            { value: 'none', score: 0, text: '<1 month or no formal cash reserve policy' }
          ]
        }
      ]
    },
    {
      id: 'mod-compliance-001',
      title: 'Compliance Risk Assessment',
      description: 'This module evaluates your practice\'s compliance with healthcare regulations and risk management procedures.',
      questions: [
        {
          id: 'comp-risk-001',
          text: 'When was your last comprehensive compliance risk assessment conducted, and by whom?',
          type: 'MULTIPLE_CHOICE' as const,
          helpText: 'A compliance risk assessment is simply a check-up of your practice\'s ability to follow healthcare rules and regulations. Think of it like a safety inspection for your business. These assessments look for gaps in how you protect patient information, bill insurance correctly, maintain proper documentation, and follow healthcare laws. Rules change frequently, and penalties for breaking them can be severe—often $10,000+ per violation. Having an independent expert do this assessment is best because they bring fresh eyes and specialized knowledge. For example, they might spot that your patient consent forms are outdated, your staff needs HIPAA refresher training, or your documentation doesn\'t support the billing codes you\'re using. Without regular assessments, many practices unknowingly develop bad habits that can lead to insurance audits, refund demands, fines, or even exclusion from insurance programs.',
          options: [
            { value: 'recent_external', score: 5, text: 'Within past year by qualified external party' },
            { value: 'recent_internal', score: 3, text: 'Within past year internally' },
            { value: 'outdated_external', score: 2, text: '1-3 years ago by external party' },
            { value: 'outdated_internal', score: 1, text: '1-3 years ago internally' },
            { value: 'never', score: 0, text: 'Never conducted or >3 years ago' }
          ]
        },
        {
          id: 'comp-risk-002',
          text: 'Do you have a formal breach response plan with specific procedures, roles, and regulatory notification processes?',
          type: 'MULTIPLE_CHOICE' as const,
          helpText: 'Breaches without proper response typically increase cost by 25-40% and heighten regulatory penalties. Most practices will experience at least one breach.',
          options: [
            { value: 'comprehensive', score: 5, text: 'Yes, comprehensive plan with regular testing and updates' },
            { value: 'documented', score: 3, text: 'Yes, documented plan but not regularly tested' },
            { value: 'informal', score: 1, text: 'Informal or incomplete plan' },
            { value: 'none', score: 0, text: 'No formal breach response plan' }
          ]
        }
      ]
    }
  ]);
  
  // State for storing answers
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  
  // Handle answer changes
  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };
  
  // Calculate overall progress
  const totalQuestions = modules.reduce((sum, module) => sum + module.questions.length, 0);
  const answeredQuestions = Object.keys(answers).length;
  const overallProgress = totalQuestions > 0 
    ? Math.round((answeredQuestions / totalQuestions) * 100) 
    : 0;

  return (
    <div className="assessment-page">
      <header className="assessment-header">
        <h1>Practice Assessment Questionnaire</h1>
        <div className="overall-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${overallProgress}%` }}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={overallProgress}
              role="progressbar"
            />
          </div>
          <span className="progress-text">{overallProgress}% complete</span>
        </div>
      </header>
      
      <main className="assessment-content">
        <div className="assessment-instructions">
          <p>
            Complete the following assessment modules to receive a comprehensive analysis of your practice's 
            performance. Each question includes helpful tooltips with explanations and examples.
          </p>
        </div>
        
        {modules.map(module => (
          <QuestionModule
            key={module.id}
            id={module.id}
            title={module.title}
            description={module.description}
            questions={module.questions}
            onAnswerChange={handleAnswerChange}
            answers={answers}
          />
        ))}
      </main>
      
      <footer className="assessment-actions">
        <button className="action-button secondary">Save Progress</button>
        <button 
          className="action-button primary"
          disabled={overallProgress < 100}
        >
          {overallProgress < 100 ? 'Please Complete All Questions' : 'Submit Assessment'}
        </button>
      </footer>
    </div>
  );
};

export default AssessmentPage; 