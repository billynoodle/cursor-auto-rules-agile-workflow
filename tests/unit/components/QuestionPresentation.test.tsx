import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { QuestionPresentation } from '@client/components/assessment/QuestionPresentation';
import { Question, QuestionType } from '@client/types/assessment.types';

const mockQuestion: Question = {
  id: '1',
  text: 'Test Question',
  type: QuestionType.MULTIPLE_CHOICE,
  description: 'This is a test question',
  required: true,
  weight: 1,
  dependencies: [],
  options: [
    { id: '1', text: 'Option 1', value: '1', score: 1 },
    { id: '2', text: 'Option 2', value: '2', score: 2 },
    { id: '3', text: 'Option 3', value: '3', score: 3 }
  ]
};

const defaultProps = {
  question: mockQuestion,
  selectedOption: undefined,
  onSelect: jest.fn(),
  onNext: jest.fn(),
  onPrevious: jest.fn(),
  isFirst: true,
  isLast: false,
  showProgressiveDisclosure: true
};

describe('QuestionPresentation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders question text and description', () => {
    render(<QuestionPresentation {...defaultProps} />);
    expect(screen.getByText(mockQuestion.text)).toBeInTheDocument();
  });

  it('shows required indicator for required questions', () => {
    render(<QuestionPresentation {...defaultProps} />);
    const requiredIndicator = screen.getByTestId('required-indicator');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveAttribute('aria-label', 'required');
  });

  it('shows weight indicator', () => {
    render(<QuestionPresentation {...defaultProps} />);
    const weightIndicator = screen.getByTestId('weight-indicator');
    expect(weightIndicator).toBeInTheDocument();
    expect(weightIndicator).toHaveTextContent('Standard Impact');
  });

  it('handles option selection', () => {
    render(<QuestionPresentation {...defaultProps} showProgressiveDisclosure={false} />);
    const option = screen.getByLabelText(mockQuestion.options![0].text);
    fireEvent.click(option);
    expect(defaultProps.onSelect).toHaveBeenCalledWith(mockQuestion.options![0].id);
  });

  it('shows description when expanded', async () => {
    render(<QuestionPresentation {...defaultProps} />);
    const expandButton = screen.getByTestId('expand-trigger');
    await act(async () => {
      fireEvent.click(expandButton);
    });
    expect(screen.getByText(mockQuestion.description!, { selector: '.question-description' })).toBeInTheDocument();
  });

  it('handles navigation button clicks', () => {
    render(<QuestionPresentation {...defaultProps} isFirst={false} />);
    const nextButton = screen.getByText('Next');
    const previousButton = screen.getByText('Previous');
    
    fireEvent.click(previousButton);
    expect(defaultProps.onPrevious).toHaveBeenCalled();
    
    fireEvent.click(nextButton);
    expect(defaultProps.onNext).not.toHaveBeenCalled(); // Should not be called because no option is selected
  });

  it('disables next button when required question is unanswered', () => {
    render(<QuestionPresentation {...defaultProps} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('enables next button when required question is answered', () => {
    render(<QuestionPresentation {...defaultProps} selectedOption={mockQuestion.options![0].id} />);
    const nextButton = screen.getByText('Next');
    expect(nextButton).not.toBeDisabled();
  });

  it('shows validation error when trying to proceed without selection', () => {
    render(<QuestionPresentation {...defaultProps} />);
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  describe('Accessibility', () => {
    it('provides appropriate ARIA labels and roles', () => {
      render(<QuestionPresentation {...defaultProps} showProgressiveDisclosure={false} />);
      
      const questionGroup = screen.getByRole('group');
      expect(questionGroup).toHaveAttribute('aria-label', mockQuestion.text);
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-label', `Options for ${mockQuestion.text}`);
      expect(radioGroup).toHaveAttribute('aria-required', 'true');
      
      mockQuestion.options?.forEach(option => {
        const radio = screen.getByLabelText(option.text);
        expect(radio).toHaveAttribute('type', 'radio');
        expect(radio).toHaveAttribute('name', mockQuestion.id);
        expect(radio).toHaveAttribute('aria-checked', 'false');
      });
    });

    it('announces validation errors to screen readers', () => {
      render(<QuestionPresentation {...defaultProps} />);
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Please select an option');
    });
  });

  describe('Progressive Disclosure', () => {
    it('initially hides content when progressive disclosure is enabled', () => {
      render(<QuestionPresentation {...defaultProps} />);
      expect(screen.queryByText(mockQuestion.description!, { selector: '.question-description' })).not.toBeInTheDocument();
      expect(screen.getByTestId('expand-trigger')).toBeInTheDocument();
    });

    it('shows all content when progressive disclosure is disabled', () => {
      render(<QuestionPresentation {...defaultProps} showProgressiveDisclosure={false} />);
      expect(screen.getByText(mockQuestion.description!, { selector: '.question-description' })).toBeInTheDocument();
      expect(screen.queryByTestId('expand-trigger')).not.toBeInTheDocument();
    });

    it('focuses first option after expanding content', async () => {
      render(<QuestionPresentation {...defaultProps} />);
      const expandButton = screen.getByTestId('expand-trigger');
      await act(async () => {
        fireEvent.click(expandButton);
      });
      const firstOption = screen.getByLabelText(mockQuestion.options![0].text);
      expect(document.activeElement).toBe(firstOption);
    });
  });

  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      const questionWithNoOptions = {
        ...mockQuestion,
        options: []
      };
      render(<QuestionPresentation {...defaultProps} question={questionWithNoOptions} showProgressiveDisclosure={false} />);
      expect(screen.getByText('No options available')).toBeInTheDocument();
    });

    it('handles high weight values', () => {
      const questionWithHighWeight = {
        ...mockQuestion,
        weight: 15000
      };
      render(<QuestionPresentation {...defaultProps} question={questionWithHighWeight} />);
      expect(screen.getByTestId('weight-indicator')).toHaveTextContent('High Impact');
    });

    it('handles circular dependencies', () => {
      const questionWithCircularDep = {
        ...mockQuestion,
        dependencies: ['self-reference']
      };
      render(<QuestionPresentation {...defaultProps} question={questionWithCircularDep} />);
      expect(screen.getByText('Unable to process dependencies')).toBeInTheDocument();
    });
  });
}); 