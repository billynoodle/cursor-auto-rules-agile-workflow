import React from 'react';
import { render, fireEvent, screen } from '../../../utils/test-utils';
import '@testing-library/jest-dom';
import { QuestionModule } from '../../../../client/src/components/assessment/QuestionModule';

console.log('[QuestionModule.test.tsx] Test file loaded');
console.log('[QuestionModule.test.tsx] React version:', React.version);
console.log('[QuestionModule.test.tsx] useState available:', !!React.useState);

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

describe('QuestionModule', () => {
  console.log('[QuestionModule.test.tsx] Starting QuestionModule test suite');
  
  const mockQuestions: QuestionData[] = [
    {
      id: 'q1',
      text: 'Question 1',
      type: 'TEXT'
    },
    {
      id: 'q2',
      text: 'Question 2',
      type: 'NUMERIC'
    }
  ];

  const defaultProps = {
    id: 'test-module',
    title: 'Test Module',
    questions: mockQuestions,
    onAnswerChange: jest.fn(),
    answers: {}
  };

  beforeEach(() => {
    console.log('[QuestionModule.test.tsx] beforeEach - clearing mocks');
    jest.clearAllMocks();
  });

  it('renders module title', () => {
    console.log('[QuestionModule.test.tsx] Starting "renders module title" test');
    render(<QuestionModule {...defaultProps} />);
    console.log('[QuestionModule.test.tsx] Component rendered, checking for title');
    expect(screen.getByText('Test Module')).toBeInTheDocument();
  });

  it('renders module description when provided', () => {
    const description = 'Test description';
    render(<QuestionModule {...defaultProps} description={description} />);
    expect(screen.getByText(description)).toBeInTheDocument();
  });

  it('renders all questions', () => {
    render(<QuestionModule {...defaultProps} />);
    mockQuestions.forEach(question => {
      expect(screen.getByText(question.text)).toBeInTheDocument();
    });
  });

  it('calculates and displays correct completion percentage with no answers', () => {
    render(<QuestionModule {...defaultProps} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');
  });

  it('calculates and displays correct completion percentage with some answers', () => {
    const answers = { q1: 'answer1' };
    render(<QuestionModule {...defaultProps} answers={answers} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '50');
  });

  it('calculates and displays correct completion percentage with all answers', () => {
    const answers = { q1: 'answer1', q2: 42 };
    render(<QuestionModule {...defaultProps} answers={answers} />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '100');
  });

  it('handles answer changes', () => {
    const onAnswerChange = jest.fn();
    render(<QuestionModule {...defaultProps} onAnswerChange={onAnswerChange} />);
    const input = screen.getAllByRole('textbox')[0];
    fireEvent.change(input, { target: { value: 'test answer' } });
    expect(onAnswerChange).toHaveBeenCalledWith('q1', 'test answer');
  });

  describe('module expansion/collapse', () => {
    it('starts expanded by default', () => {
      render(<QuestionModule {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('collapses when header is clicked', () => {
      render(<QuestionModule {...defaultProps} />);
      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('expands when header is clicked while collapsed', () => {
      render(<QuestionModule {...defaultProps} />);
      const button = screen.getByRole('button');
      fireEvent.click(button); // collapse
      fireEvent.click(button); // expand
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('accessibility', () => {
    it('progress bar has correct ARIA attributes', () => {
      render(<QuestionModule {...defaultProps} />);
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuemin', '0');
      expect(progressBar).toHaveAttribute('aria-valuemax', '100');
    });

    it('expand/collapse button has correct ARIA attributes', () => {
      render(<QuestionModule {...defaultProps} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-controls');
    });
  });
}); 