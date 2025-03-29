import React, { memo, useCallback, useMemo } from 'react';
import { QuestionType, QuestionOption } from '../../types/assessment';
import './Question.css';

interface QuestionProps {
  id: string;
  text: string;
  description?: string;
  type: QuestionType;
  options?: QuestionOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
}

/**
 * Question component for displaying assessment questions
 * 
 * Features:
 * - Supports multiple question types (multiple choice, numeric, text, Likert scale)
 * - Help text display
 * - Accessible design
 * - Mobile-friendly layout
 */
const Question = memo(({
  id,
  text,
  description,
  type,
  options = [],
  value,
  onChange
}: QuestionProps): JSX.Element => {
  // Memoize the change handlers
  const handleNumericChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  }, [onChange]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleOptionChange = useCallback((optionValue: string | number) => {
    onChange(optionValue);
  }, [onChange]);

  // Memoize question input rendering
  const questionInput = useMemo(() => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
        return (
          <div className="question-options">
            {options.map((option) => (
              <label key={option.id} className="question-option">
                <input
                  type="radio"
                  name={id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleOptionChange(option.value)}
                />
                <span className="option-text">{option.text}</span>
              </label>
            ))}
          </div>
        );
        
      case QuestionType.NUMERIC:
        return (
          <input
            type="number"
            className="question-input numeric"
            value={value as number || ''}
            onChange={handleNumericChange}
            aria-labelledby={`question-${id}`}
          />
        );
        
      case QuestionType.TEXT:
        return (
          <textarea
            className="question-input text"
            value={value as string || ''}
            onChange={handleTextChange}
            aria-labelledby={`question-${id}`}
            rows={3}
          />
        );
        
      case QuestionType.LIKERT_SCALE:
        return (
          <div className="likert-scale">
            {options.map((option) => (
              <label key={option.id} className="likert-option">
                <input
                  type="radio"
                  name={id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={() => handleOptionChange(option.value)}
                  aria-label={option.text}
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
  }, [type, options, value, id, handleNumericChange, handleTextChange, handleOptionChange]);

  return (
    <div className="question-container">
      <div className="question-header">
        <h3 id={`question-${id}`} className="question-text">
          {text}
          {description && (
            <div className="help-text" aria-label="Help text">
              <span className="visually-hidden">More information about this question</span>
              <p>{description}</p>
            </div>
          )}
        </h3>
      </div>
      
      <div className="question-body">
        {questionInput}
      </div>
    </div>
  );
});

Question.displayName = 'Question';

export { Question };
export default Question; 