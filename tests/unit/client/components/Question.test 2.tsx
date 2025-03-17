import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Question from '@client/components/assessment/Question';

describe('Question', () => {
  const defaultProps = {
    id: 'test-question',
    text: 'Test Question',
    type: 'TEXT' as const,
    onChange: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders question text', () => {
    render(<Question {...defaultProps} />);
    expect(screen.getByText('Test Question')).toBeInTheDocument();
  });

  test('renders help text when provided', () => {
    const helpText = 'This is help text';
    render(<Question {...defaultProps} helpText={helpText} />);
    expect(screen.getByText(helpText)).toBeInTheDocument();
  });

  describe('TEXT type', () => {
    test('renders textarea for text input', () => {
      render(<Question {...defaultProps} type="TEXT" />);
      const textarea = screen.getByRole('textbox');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveAttribute('aria-labelledby', 'question-test-question');
    });

    test('handles text input changes', () => {
      render(<Question {...defaultProps} type="TEXT" />);
      const textarea = screen.getByRole('textbox');
      fireEvent.change(textarea, { target: { value: 'test input' } });
      expect(defaultProps.onChange).toHaveBeenCalledWith('test input');
    });

    test('displays initial value when provided', () => {
      render(<Question {...defaultProps} type="TEXT" value="initial text" />);
      expect(screen.getByRole('textbox')).toHaveValue('initial text');
    });
  });

  describe('NUMERIC type', () => {
    const numericProps = { ...defaultProps, type: 'NUMERIC' as const };

    test('renders number input', () => {
      render(<Question {...numericProps} />);
      const input = screen.getByRole('spinbutton');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-labelledby', 'question-test-question');
    });

    test('handles numeric input changes', () => {
      render(<Question {...numericProps} />);
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '42' } });
      expect(defaultProps.onChange).toHaveBeenCalledWith(42);
    });

    test('displays initial value when provided', () => {
      render(<Question {...numericProps} value={42} />);
      expect(screen.getByRole('spinbutton')).toHaveValue(42);
    });
  });

  describe('MULTIPLE_CHOICE type', () => {
    const options = [
      { value: 'a', score: 1, text: 'Option A' },
      { value: 'b', score: 2, text: 'Option B' },
      { value: 'c', score: 3, text: 'Option C' }
    ];
    const multipleChoiceProps = {
      ...defaultProps,
      type: 'MULTIPLE_CHOICE' as const,
      options
    };

    test('renders all options', () => {
      render(<Question {...multipleChoiceProps} />);
      options.forEach(option => {
        expect(screen.getByText(option.text)).toBeInTheDocument();
      });
    });

    test('handles option selection', () => {
      render(<Question {...multipleChoiceProps} />);
      const optionB = screen.getByLabelText('Option B');
      fireEvent.click(optionB);
      expect(defaultProps.onChange).toHaveBeenCalledWith('b');
    });

    test('marks selected option as checked', () => {
      render(<Question {...multipleChoiceProps} value="b" />);
      const optionB = screen.getByLabelText('Option B') as HTMLInputElement;
      expect(optionB.checked).toBe(true);
    });
  });

  describe('LIKERT_SCALE type', () => {
    const options = [
      { value: '1', score: 1, text: 'Strongly Disagree' },
      { value: '2', score: 2, text: 'Disagree' },
      { value: '3', score: 3, text: 'Neutral' },
      { value: '4', score: 4, text: 'Agree' },
      { value: '5', score: 5, text: 'Strongly Agree' }
    ];
    const likertProps = {
      ...defaultProps,
      type: 'LIKERT_SCALE' as const,
      options
    };

    test('renders all scale options', () => {
      render(<Question {...likertProps} />);
      options.forEach(option => {
        expect(screen.getByText(option.text)).toBeInTheDocument();
        expect(screen.getByText(option.value)).toBeInTheDocument();
      });
    });

    test('handles scale selection', () => {
      render(<Question {...likertProps} />);
      const agree = screen.getByLabelText(/^4/);
      fireEvent.click(agree);
      expect(defaultProps.onChange).toHaveBeenCalledWith('4');
    });

    test('marks selected scale value as checked', () => {
      render(<Question {...likertProps} value="4" />);
      const agree = screen.getByLabelText(/^4/) as HTMLInputElement;
      expect(agree.checked).toBe(true);
    });
  });

  describe('accessibility', () => {
    test('provides accessible help text', () => {
      const helpText = 'This is help text';
      render(<Question {...defaultProps} helpText={helpText} />);
      expect(screen.getByLabelText('Help text')).toBeInTheDocument();
      expect(screen.getByText('More information about this question')).toHaveClass('visually-hidden');
    });

    test('associates inputs with question text via aria-labelledby', () => {
      render(<Question {...defaultProps} type="TEXT" />);
      const input = screen.getByRole('textbox');
      const questionId = input.getAttribute('aria-labelledby');
      expect(document.getElementById(questionId!)).toHaveTextContent('Test Question');
    });
  });
}); 