import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { QuestionPresentation } from '../../../../client/src/components/assessment/QuestionPresentation';

interface QuestionOption {
  id: string;
  text: string;
  score: number;
}

interface Question {
  id: string;
  text: string;
  description?: string;
  tooltip?: string;
  required?: boolean;
  options?: QuestionOption[];
}

describe('QuestionPresentation', () => {
  const mockQuestion: Question = {
    id: 'q1',
    text: 'What is your practice size?',
    description: 'Select the option that best describes your practice',
    options: [
      { id: 'opt1', text: 'Solo practitioner', score: 1 },
      { id: 'opt2', text: 'Small practice (2-5)', score: 2 },
      { id: 'opt3', text: 'Medium practice (6-15)', score: 3 },
      { id: 'opt4', text: 'Large practice (16+)', score: 4 }
    ],
    required: true,
    tooltip: 'This helps us tailor the assessment to your practice size'
  };

  const defaultProps = {
    question: mockQuestion,
    selectedOption: undefined,
    onSelect: jest.fn(),
    onNext: jest.fn(),
    onPrevious: jest.fn(),
    isFirst: false,
    isLast: false,
    showProgressiveDisclosure: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Question Rendering', () => {
    test('renders question text and description', async () => {
      render(<QuestionPresentation {...defaultProps} />);
      
      expect(screen.getByText(mockQuestion.text)).toBeInTheDocument();
      
      // Click to expand
      await act(async () => {
        await userEvent.click(screen.getByTestId('expand-trigger'));
      });
      
      expect(screen.getByText(mockQuestion.description!)).toBeInTheDocument();
    });

    test('displays required indicator for required questions', () => {
      render(<QuestionPresentation {...defaultProps} />);
      
      expect(screen.getByTestId('required-indicator')).toBeInTheDocument();
      expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
    });

    test('shows tooltip on hover', async () => {
      render(<QuestionPresentation {...defaultProps} />);
      
      const tooltipTrigger = screen.getByTestId('tooltip-trigger');
      await act(async () => {
        await userEvent.hover(tooltipTrigger);
      });
      
      expect(screen.getByText(mockQuestion.tooltip!)).toBeInTheDocument();
    });
  });

  describe('Progressive Disclosure', () => {
    test('initially shows only question text and expands on interaction', async () => {
      render(<QuestionPresentation {...defaultProps} />);
      
      // Initially only question text is visible
      expect(screen.getByText(mockQuestion.text)).toBeInTheDocument();
      const description = screen.queryByText(mockQuestion.description!);
      expect(description).not.toBeInTheDocument();
      
      // Click to expand
      await act(async () => {
        await userEvent.click(screen.getByTestId('expand-trigger'));
      });
      
      // Description and options should now be visible
      expect(screen.getByText(mockQuestion.description!)).toBeVisible();
      mockQuestion.options?.forEach(option => {
        expect(screen.getByLabelText(option.text)).toBeVisible();
      });
    });

    test('shows full content when progressive disclosure is disabled', () => {
      render(<QuestionPresentation {...defaultProps} showProgressiveDisclosure={false} />);
      
      expect(screen.getByText(mockQuestion.text)).toBeVisible();
      expect(screen.getByText(mockQuestion.description!)).toBeVisible();
      mockQuestion.options?.forEach(option => {
        expect(screen.getByLabelText(option.text)).toBeVisible();
      });
    });
  });

  describe('Answer Selection', () => {
    test('handles multiple choice selection', async () => {
      render(<QuestionPresentation {...defaultProps} />);
      
      // Expand content if using progressive disclosure
      if (defaultProps.showProgressiveDisclosure) {
        await act(async () => {
          await userEvent.click(screen.getByTestId('expand-trigger'));
        });
      }
      
      const option = screen.getByLabelText(mockQuestion.options![0].text);
      await act(async () => {
        await userEvent.click(option);
      });
      
      expect(defaultProps.onSelect).toHaveBeenCalledWith(mockQuestion.options![0].id);
    });

    test('shows selected answer state', async () => {
      render(
        <QuestionPresentation
          {...defaultProps}
          selectedOption={mockQuestion.options![0].id}
        />
      );
      
      // Expand content if using progressive disclosure
      if (defaultProps.showProgressiveDisclosure) {
        await act(async () => {
          await userEvent.click(screen.getByTestId('expand-trigger'));
        });
      }
      
      const selectedOption = screen.getByLabelText(mockQuestion.options![0].text);
      expect(selectedOption).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Navigation', () => {
    test('shows/hides previous button appropriately', () => {
      render(<QuestionPresentation {...defaultProps} isFirst={true} />);
      expect(screen.queryByText(/previous/i)).not.toBeInTheDocument();
      
      render(<QuestionPresentation {...defaultProps} isFirst={false} />);
      expect(screen.getByText(/previous/i)).toBeInTheDocument();
    });

    test('shows/hides next button appropriately', () => {
      render(<QuestionPresentation {...defaultProps} isLast={true} />);
      expect(screen.queryByText(/next/i)).not.toBeInTheDocument();
      
      render(<QuestionPresentation {...defaultProps} isLast={false} />);
      expect(screen.getByText(/next/i)).toBeInTheDocument();
    });

    test('disables next button when required question is unanswered', () => {
      render(<QuestionPresentation {...defaultProps} selectedOption={undefined} />);
      
      const nextButton = screen.getByText(/next/i);
      expect(nextButton).toBeDisabled();
    });

    test('enables next button when required question is answered', () => {
      render(
        <QuestionPresentation
          {...defaultProps}
          selectedOption={mockQuestion.options![0].id}
        />
      );
      
      const nextButton = screen.getByText(/next/i);
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    test('provides appropriate ARIA labels and roles', async () => {
      render(<QuestionPresentation {...defaultProps} />);
      
      expect(screen.getByRole('group')).toHaveAttribute(
        'aria-label',
        mockQuestion.text
      );
      
      // Expand content if using progressive disclosure
      if (defaultProps.showProgressiveDisclosure) {
        await act(async () => {
          await userEvent.click(screen.getByTestId('expand-trigger'));
        });
      }
      
      const radioGroup = screen.getByRole('radiogroup');
      expect(radioGroup).toHaveAttribute('aria-label', `Options for ${mockQuestion.text}`);
      
      mockQuestion.options?.forEach(option => {
        const radio = screen.getByLabelText(option.text);
        expect(radio).toHaveAttribute('type', 'radio');
        expect(radio).toHaveAttribute('name', mockQuestion.id);
      });
    });

    test('supports keyboard navigation', async () => {
      render(<QuestionPresentation {...defaultProps} />);
      
      // Expand content if using progressive disclosure
      if (defaultProps.showProgressiveDisclosure) {
        await act(async () => {
          await userEvent.click(screen.getByTestId('expand-trigger'));
        });
      }
      
      const options = mockQuestion.options?.map(
        option => screen.getByLabelText(option.text)
      );
      
      if (options && options.length > 0) {
        // Focus first option
        options[0].focus();
        expect(document.activeElement).toBe(options[0]);
        
        // Navigate with arrow keys
        await userEvent.keyboard('{ArrowDown}');
        expect(document.activeElement).toBe(options[1]);
        
        await userEvent.keyboard('{ArrowUp}');
        expect(document.activeElement).toBe(options[0]);
      }
    });
  });
}); 