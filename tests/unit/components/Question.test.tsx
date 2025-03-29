import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Question } from '@client/components/assessment/Question';
import { QuestionType } from '@client/types/assessment';

describe('Question Component', () => {
  const mockMultipleChoiceProps = {
    id: 'test-q1',
    text: 'Test Multiple Choice Question',
    type: QuestionType.MULTIPLE_CHOICE,
    description: 'This is a test question',
    options: [
      { id: 'opt1', value: 'a', score: 1, text: 'Option A' },
      { id: 'opt2', value: 'b', score: 2, text: 'Option B' }
    ],
    onChange: jest.fn()
  };

  const mockNumericProps = {
    id: 'test-q2',
    text: 'Test Numeric Question',
    type: QuestionType.NUMERIC,
    description: 'Enter a number',
    onChange: jest.fn()
  };

  const mockTextProps = {
    id: 'test-q3',
    text: 'Test Text Question',
    type: QuestionType.TEXT,
    description: 'Enter some text',
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders question text', () => {
    render(<Question {...mockTextProps} />);
    expect(screen.getByText('Test Text Question')).toBeInTheDocument();
  });

  test('renders description when provided', () => {
    render(<Question {...mockTextProps} />);
    expect(screen.getByText('Enter some text')).toBeInTheDocument();
  });

  describe('TEXT type', () => {
    test('renders textarea for text input', () => {
      render(<Question {...mockTextProps} />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('aria-labelledby', 'question-test-q3');
    });

    test('handles text input changes', () => {
      render(<Question {...mockTextProps} />);
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'test input' } });
      expect(mockTextProps.onChange).toHaveBeenCalledWith('test input');
    });

    test('displays initial value when provided', () => {
      render(<Question {...mockTextProps} value="initial text" />);
      expect(screen.getByRole('textbox')).toHaveValue('initial text');
    });
  });

  describe('NUMERIC type', () => {
    test('renders number input', () => {
      render(<Question {...mockNumericProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-labelledby', 'question-test-q2');
    });

    test('handles numeric input changes', () => {
      render(<Question {...mockNumericProps} />);
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '42' } });
      expect(mockNumericProps.onChange).toHaveBeenCalledWith(42);
    });

    test('displays initial value when provided', () => {
      render(<Question {...mockNumericProps} value={42} />);
      expect(screen.getByRole('spinbutton')).toHaveValue(42);
    });
  });

  describe('MULTIPLE_CHOICE type', () => {
    test('renders all options', () => {
      render(<Question {...mockMultipleChoiceProps} />);
      mockMultipleChoiceProps.options.forEach(option => {
        expect(screen.getByText(option.text)).toBeInTheDocument();
      });
    });

    test('handles option selection', () => {
      render(<Question {...mockMultipleChoiceProps} />);
      const optionB = screen.getByLabelText('Option B');
      fireEvent.click(optionB);
      expect(mockMultipleChoiceProps.onChange).toHaveBeenCalledWith('b');
    });

    test('marks selected option as checked', () => {
      render(<Question {...mockMultipleChoiceProps} value="b" />);
      const optionB = screen.getByLabelText('Option B') as HTMLInputElement;
      expect(optionB.checked).toBe(true);
    });
  });

  describe('LIKERT_SCALE type', () => {
    const options = [
      { id: 'likert-1', value: '1', score: 1, text: 'Strongly Disagree' },
      { id: 'likert-2', value: '2', score: 2, text: 'Disagree' },
      { id: 'likert-3', value: '3', score: 3, text: 'Neutral' },
      { id: 'likert-4', value: '4', score: 4, text: 'Agree' },
      { id: 'likert-5', value: '5', score: 5, text: 'Strongly Agree' }
    ];

    const mockLikertProps = {
      id: 'test-q4',
      text: 'Test Likert Scale Question',
      type: QuestionType.LIKERT_SCALE,
      description: 'Select your answer',
      options,
      onChange: jest.fn()
    };

    test('renders all scale options', () => {
      render(<Question {...mockLikertProps} />);
      options.forEach(option => {
        expect(screen.getByText(option.value)).toBeInTheDocument();
        expect(screen.getByText(option.text)).toBeInTheDocument();
      });
    });

    test('handles scale selection', () => {
      render(<Question {...mockLikertProps} />);
      const agree = screen.getByRole('radio', { name: /^Agree$/ });
      fireEvent.click(agree);
      expect(mockLikertProps.onChange).toHaveBeenCalledWith('4');
    });

    test('marks selected scale value as checked', () => {
      render(<Question {...mockLikertProps} value="4" />);
      const agree = screen.getByRole('radio', { name: /^Agree$/ }) as HTMLInputElement;
      expect(agree.checked).toBe(true);
    });
  });

  describe('Accessibility', () => {
    test('associates inputs with question text via aria-labelledby', () => {
      render(<Question {...mockTextProps} />);
      const input = screen.getByRole('textbox');
      const questionId = input.getAttribute('aria-labelledby');
      expect(document.getElementById(questionId!)).toHaveTextContent('Test Text Question');
    });
  });
}); 