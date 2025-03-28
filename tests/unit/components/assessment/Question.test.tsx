import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';
import Question from '@client/components/assessment/Question';
import { QuestionType } from '@client/types/assessment.types';

describe('Question', () => {
  const mockOnChange = jest.fn();
  const baseProps = {
    id: 'test-question',
    text: 'Test Question',
    onChange: mockOnChange
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render multiple choice question correctly', () => {
    const props = {
      ...baseProps,
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: '1', value: 'option1', text: 'Option 1', score: 1 },
        { id: '2', value: 'option2', text: 'Option 2', score: 2 }
      ]
    };

    render(<Question {...props} />);
    expect(screen.getByText('Test Question')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('should handle multiple choice selection', () => {
    const props = {
      ...baseProps,
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        { id: '1', value: 'option1', text: 'Option 1', score: 1 },
        { id: '2', value: 'option2', text: 'Option 2', score: 2 }
      ]
    };

    render(<Question {...props} />);
    fireEvent.click(screen.getByLabelText('Option 1'));
    expect(mockOnChange).toHaveBeenCalledWith('option1');
  });

  it('should render numeric question correctly', () => {
    const props = {
      ...baseProps,
      type: QuestionType.NUMERIC,
      value: 42
    };

    render(<Question {...props} />);
    expect(screen.getByRole('spinbutton')).toHaveValue(42);
  });

  it('should handle numeric input', () => {
    const props = {
      ...baseProps,
      type: QuestionType.NUMERIC
    };

    render(<Question {...props} />);
    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '42' } });
    expect(mockOnChange).toHaveBeenCalledWith(42);
  });

  it('should render text question correctly', () => {
    const props = {
      ...baseProps,
      type: QuestionType.TEXT,
      value: 'Test answer'
    };

    render(<Question {...props} />);
    expect(screen.getByRole('textbox')).toHaveValue('Test answer');
  });

  it('should handle text input', () => {
    const props = {
      ...baseProps,
      type: QuestionType.TEXT
    };

    render(<Question {...props} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test answer' } });
    expect(mockOnChange).toHaveBeenCalledWith('Test answer');
  });

  it('should render Likert scale question correctly', () => {
    const props = {
      ...baseProps,
      type: QuestionType.LIKERT_SCALE,
      options: [
        { id: '1', value: '1', text: 'Strongly Disagree', score: 1 },
        { id: '2', value: '2', text: 'Disagree', score: 2 },
        { id: '3', value: '3', text: 'Neutral', score: 3 }
      ]
    };

    render(<Question {...props} />);
    expect(screen.getByText('Strongly Disagree')).toBeInTheDocument();
    expect(screen.getByText('Disagree')).toBeInTheDocument();
    expect(screen.getByText('Neutral')).toBeInTheDocument();
  });

  it('should handle Likert scale selection', () => {
    const props = {
      ...baseProps,
      type: QuestionType.LIKERT_SCALE,
      options: [
        { id: '1', value: '1', text: 'Strongly Disagree', score: 1 },
        { id: '2', value: '2', text: 'Disagree', score: 2 },
        { id: '3', value: '3', text: 'Neutral', score: 3 }
      ]
    };

    render(<Question {...props} />);
    fireEvent.click(screen.getByLabelText('Strongly Disagree'));
    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('should render question description when provided', () => {
    const props = {
      ...baseProps,
      type: QuestionType.TEXT,
      description: 'This is a help text'
    };

    render(<Question {...props} />);
    expect(screen.getByText('This is a help text')).toBeInTheDocument();
  });
}); 