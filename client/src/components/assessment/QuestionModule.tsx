import React, { useState } from 'react';
import Question from './Question';
import './QuestionModule.css';

interface QuestionData {
  id: string;
  text: string;
  helpText?: string;
  type: 'MULTIPLE_CHOICE' | 'NUMERIC' | 'TEXT' | 'LIKERT_SCALE';
  options?: Array<{
    value: string;
    score: number;
    text: string;
  }>;
}

interface QuestionModuleProps {
  id: string;
  title: string;
  description?: string;
  questions: QuestionData[];
  onAnswerChange: (questionId: string, value: string | number) => void;
  answers: Record<string, string | number>;
}

/**
 * QuestionModule component for displaying a group of related questions
 * 
 * Features:
 * - Collapsible module with progress tracking
 * - Module description with context
 * - Progress indicator
 * - Mobile-friendly design
 */
const QuestionModule: React.FC<QuestionModuleProps> = ({
  id,
  title,
  description,
  questions,
  onAnswerChange,
  answers
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Calculate completion percentage
  const answeredQuestions = questions.filter(q => answers[q.id] !== undefined);
  const completionPercentage = questions.length > 0 
    ? Math.round((answeredQuestions.length / questions.length) * 100) 
    : 0;
  
  // Toggle module expansion
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="question-module">
      <div className="module-header" onClick={toggleExpand}>
        <div className="module-title-container">
          <h2 className="module-title">{title}</h2>
          <div className="module-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${completionPercentage}%` }}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={completionPercentage}
                role="progressbar"
              />
            </div>
            <span className="progress-text">{completionPercentage}% complete</span>
          </div>
        </div>
        <button 
          className="module-toggle"
          aria-expanded={isExpanded}
          aria-controls={`module-content-${id}`}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>
      
      {isExpanded && (
        <div id={`module-content-${id}`} className="module-content">
          {description && (
            <div className="module-description">
              <p>{description}</p>
            </div>
          )}
          
          <div className="module-questions">
            {questions.map(question => (
              <Question
                key={question.id}
                id={question.id}
                text={question.text}
                helpText={question.helpText}
                type={question.type}
                options={question.options}
                value={answers[question.id]}
                onChange={(value) => onAnswerChange(question.id, value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionModule; 