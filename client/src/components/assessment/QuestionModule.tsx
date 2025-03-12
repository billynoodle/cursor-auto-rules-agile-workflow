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
export function QuestionModule({
  id,
  title,
  description,
  questions,
  onAnswerChange,
  answers
}: QuestionModuleProps): JSX.Element {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Calculate completion percentage
  const answeredQuestions = questions.filter(q => answers[q.id] !== undefined);
  const completionPercentage = questions.length > 0 
    ? Math.round((answeredQuestions.length / questions.length) * 100) 
    : 0;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="question-module">
      <div className="module-header">
        <button
          className="module-title"
          onClick={toggleExpand}
          aria-expanded={isExpanded}
          aria-controls={`${id}-content`}
        >
          <h2>{title}</h2>
          <div className="progress-bar" role="progressbar" aria-valuenow={completionPercentage} aria-valuemin={0} aria-valuemax={100}>
            <div className="progress-fill" style={{ width: `${completionPercentage}%` }} />
          </div>
        </button>
      </div>

      <div
        id={`${id}-content`}
        className={`module-content ${isExpanded ? 'expanded' : ''}`}
        role="region"
        aria-labelledby={`${id}-title`}
        hidden={!isExpanded}
      >
        {description && <p className="module-description">{description}</p>}
        <div className="questions-list">
          {questions.map((question) => (
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
    </div>
  );
} 