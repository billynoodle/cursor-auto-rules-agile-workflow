import React, { useState, useMemo, useCallback, memo } from 'react';
import Question from './Question';
import { Question as QuestionType } from '../../types/assessment.types';
import './QuestionModule.css';

interface QuestionModuleProps {
  id: string;
  title: string;
  description?: string;
  questions: QuestionType[];
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
const QuestionModule = memo(({
  id,
  title,
  description,
  questions,
  onAnswerChange,
  answers
}: QuestionModuleProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Memoize completion percentage calculation
  const completionPercentage = useMemo(() => {
    const answeredQuestions = questions.filter(q => answers[q.id] !== undefined);
    return questions.length > 0 
      ? Math.round((answeredQuestions.length / questions.length) * 100) 
      : 0;
  }, [questions, answers]);
  
  const toggleExpand = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

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
              description={question.description}
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
});

QuestionModule.displayName = 'QuestionModule';

export { QuestionModule }; 