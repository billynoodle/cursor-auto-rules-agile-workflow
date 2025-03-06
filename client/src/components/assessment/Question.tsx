import React from 'react';
import QuestionTooltip from '../tooltips/QuestionTooltip';
import './Question.css';

interface QuestionOption {
  value: string;
  score: number;
  text: string;
}

interface QuestionProps {
  id: string;
  text: string;
  helpText?: string;
  type: 'MULTIPLE_CHOICE' | 'NUMERIC' | 'TEXT' | 'LIKERT_SCALE';
  options?: QuestionOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
}

/**
 * Question component for displaying assessment questions with enhanced tooltips
 * 
 * Features:
 * - Supports multiple question types (multiple choice, numeric, text, Likert scale)
 * - Enhanced tooltips with metrics and examples
 * - Accessible design
 * - Mobile-friendly layout
 */
const Question: React.FC<QuestionProps> = ({
  id,
  text,
  helpText,
  type,
  options = [],
  value,
  onChange
}) => {
  // Render different input types based on question type
  const renderQuestionInput = () => {
    switch (type) {
      case 'MULTIPLE_CHOICE':
        return (
          <div className="question-options">
            {options.map((option) => (
              <label key={option.value} className="question-option">
                <input
                  type="radio"
                  name={id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                />
                <span className="option-text">{option.text}</span>
              </label>
            ))}
          </div>
        );
        
      case 'NUMERIC':
        return (
          <input
            type="number"
            className="question-input numeric"
            value={value as number || ''}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            aria-labelledby={`question-${id}`}
          />
        );
        
      case 'TEXT':
        return (
          <textarea
            className="question-input text"
            value={value as string || ''}
            onChange={(e) => onChange(e.target.value)}
            aria-labelledby={`question-${id}`}
            rows={3}
          />
        );
        
      case 'LIKERT_SCALE':
        return (
          <div className="likert-scale">
            {options.map((option) => (
              <label key={option.value} className="likert-option">
                <input
                  type="radio"
                  name={id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => onChange(option.value)}
                />
                <span className="likert-value">{option.value}</span>
                <span className="likert-text">{option.text}</span>
              </label>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="question-container">
      <div className="question-header">
        <h3 id={`question-${id}`} className="question-text">
          {text}
          {helpText && (
            <QuestionTooltip helpText={helpText}>
              <span className="visually-hidden">More information about this question</span>
            </QuestionTooltip>
          )}
        </h3>
      </div>
      
      <div className="question-body">
        {renderQuestionInput()}
      </div>
    </div>
  );
};

export default Question; 