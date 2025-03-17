import React, { useState, useEffect } from 'react';
import { QuestionModule } from '../components/assessment/QuestionModule';
import { QuestionnaireNavigation } from '../components/assessment/QuestionnaireNavigation';
import { AssessmentCategory, Module, ModuleStatus, Question } from '../types/assessment.types';
import './AssessmentPage.css';

interface ModuleContent {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

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
  // Navigation module data
  const [navigationModules, setNavigationModules] = useState<Module[]>([
    {
      id: 'mod-financial-001',
      name: 'Financial Health Assessment',
      description: 'This module evaluates your practice\'s financial health including revenue tracking, expense management, and cash flow planning.',
      estimatedTimeMinutes: 15,
      categories: [AssessmentCategory.FINANCIAL],
      status: ModuleStatus.IN_PROGRESS,
      progress: 50,
      prerequisites: [],
      completedQuestions: 1,
      totalQuestions: 2
    },
    {
      id: 'mod-compliance-001',
      name: 'Compliance Risk Assessment',
      description: 'This module evaluates your practice\'s compliance with healthcare regulations and risk management procedures.',
      estimatedTimeMinutes: 20,
      categories: [AssessmentCategory.COMPLIANCE],
      status: ModuleStatus.LOCKED,
      progress: 0,
      prerequisites: ['mod-financial-001'],
      completedQuestions: 0,
      totalQuestions: 2
    }
  ]);

  // Module content data
  const [moduleContents] = useState<ModuleContent[]>([
    {
      id: 'mod-financial-001',
      title: 'Financial Health Assessment',
      description: 'This module evaluates your practice\'s financial health including revenue tracking, expense management, and cash flow planning.',
      questions: [
        {
          id: 'fin-cash-001',
          text: 'What is your practice\'s current accounts receivable aging profile?',
          type: 'MULTIPLE_CHOICE',
          helpText: 'This question looks at how quickly you\'re getting paid after providing services...',
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
          type: 'MULTIPLE_CHOICE',
          helpText: 'Cash reserves protect against revenue disruptions and enable strategic investments...',
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
          type: 'MULTIPLE_CHOICE',
          helpText: 'A compliance risk assessment is simply a check-up of your practice\'s ability...',
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
          type: 'MULTIPLE_CHOICE',
          helpText: 'Breaches without proper response typically increase cost by 25-40%...',
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

  const [currentModule, setCurrentModule] = useState('mod-financial-001');
  const [currentCategory, setCurrentCategory] = useState(AssessmentCategory.FINANCIAL);
  
  // State for storing answers
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  
  // Handle answer changes
  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Update module progress and status when answers change
  useEffect(() => {
    setNavigationModules(prevModules => {
      // First pass: update completion status
      const updatedModules = prevModules.map(module => {
        const moduleContent = moduleContents.find(m => m.id === module.id);
        if (!moduleContent) return module;

        const moduleQuestionIds = moduleContent.questions.map(q => q.id);
        const answeredCount = moduleQuestionIds.filter(id => answers[id]).length;
        const totalCount = moduleQuestionIds.length;
        const progress = Math.round((answeredCount / totalCount) * 100);
        const isComplete = answeredCount === totalCount;

        return {
          ...module,
          status: isComplete ? ModuleStatus.COMPLETED : module.status,
          progress,
          completedQuestions: answeredCount,
          totalQuestions: totalCount
        };
      });

      // Second pass: update locked status based on prerequisites
      return updatedModules.map(module => {
        if (module.status === ModuleStatus.LOCKED) {
          const prerequisitesMet = module.prerequisites.every(prereqId => {
            const prereqModule = updatedModules.find(m => m.id === prereqId);
            return prereqModule?.status === ModuleStatus.COMPLETED;
          });

          if (prerequisitesMet) {
            return {
              ...module,
              status: ModuleStatus.AVAILABLE
            };
          }
        }
        return module;
      });
    });
  }, [answers, moduleContents]);

  // Get the questions for the current module
  const getCurrentModuleContent = () => {
    return moduleContents.find(m => m.id === currentModule);
  };
  
  // Calculate overall progress
  const totalQuestions = navigationModules.reduce((sum: number, module: Module) => sum + module.totalQuestions, 0);
  const answeredQuestions = Object.keys(answers).length;
  const overallProgress = totalQuestions > 0 
    ? Math.round((answeredQuestions / totalQuestions) * 100) 
    : 0;

  // Update save progress handler
  const handleSaveProgress = () => {
    // Save answers and module state to localStorage
    localStorage.setItem('assessmentAnswers', JSON.stringify(answers));
    localStorage.setItem('navigationModules', JSON.stringify(navigationModules));
    alert('Progress saved successfully!');
  };

  return (
    <div className="assessment-page">
      <header className="assessment-header">
        <h1>Practice Assessment Questionnaire</h1>
        <QuestionnaireNavigation
          modules={navigationModules}
          currentModule={currentModule}
          currentCategory={currentCategory}
          onModuleSelect={setCurrentModule}
          onCategorySelect={setCurrentCategory}
          totalEstimatedTime={35}
          remainingTime={25}
        />
      </header>
      
      <main className="assessment-content">
        <div className="assessment-instructions">
          <p>
            Complete the following assessment modules to receive a comprehensive analysis of your practice's 
            performance. Each question includes helpful tooltips with explanations and examples.
          </p>
        </div>
        
        {getCurrentModuleContent() && (
          <QuestionModule
            key={currentModule}
            id={currentModule}
            title={getCurrentModuleContent()?.title || ''}
            description={getCurrentModuleContent()?.description || ''}
            questions={getCurrentModuleContent()?.questions || []}
            onAnswerChange={handleAnswerChange}
            answers={answers}
          />
        )}
      </main>
      
      <footer className="assessment-actions">
        <button 
          className="action-button secondary"
          onClick={handleSaveProgress}
        >
          Save Progress
        </button>
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