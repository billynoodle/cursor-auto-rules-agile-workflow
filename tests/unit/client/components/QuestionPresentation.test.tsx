import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { QuestionPresentation } from '../../../../client/src/components/assessment/QuestionPresentation';
import { Question, QuestionType } from '../../../../client/src/types/assessment.types';

interface QuestionOption {
  id: string;
  text: string;
  score: number;
  value: string;
}

describe('QuestionPresentation', () => {
  const mockQuestion: Question = {
    id: 'test-q1',
    text: 'Test Question',
    type: QuestionType.MULTIPLE_CHOICE,
    description: 'This is a test question',
    required: true,
    weight: 1,
    dependencies: [],
    options: [
      { id: 'opt1', value: 'a', score: 1, text: 'Option A' },
      { id: 'opt2', value: 'b', score: 2, text: 'Option B' }
    ]
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
    test('renders question text and description', () => {
      const mockQuestion = {
        id: 'test-q1',
        text: 'Test Question',
        type: QuestionType.MULTIPLE_CHOICE,
        description: 'This is a test question',
        required: true,
        weight: 1,
        dependencies: [],
        options: [
          { id: 'opt1', text: 'Option A', score: 1, value: 'a' },
          { id: 'opt2', text: 'Option B', score: 2, value: 'b' }
        ]
      };
      
      render(
        <QuestionPresentation
          question={mockQuestion}
          onSelect={jest.fn()}
        />
      );
      
      expect(screen.getByRole('heading', { name: /Test Question/i })).toBeInTheDocument();
      expect(screen.getByTestId('tooltip-trigger')).toHaveTextContent(mockQuestion.description);
    });

    test('displays required indicator for required questions', () => {
      render(<QuestionPresentation {...defaultProps} />);
      
      expect(screen.getByTestId('required-indicator')).toBeInTheDocument();
      expect(screen.getByLabelText(/required/i)).toBeInTheDocument();
    });

    test('shows tooltip on hover', async () => {
      const mockQuestion = {
        id: 'test-q1',
        text: 'Test Question',
        type: QuestionType.MULTIPLE_CHOICE,
        description: 'This is a helpful description',
        required: true,
        weight: 1,
        dependencies: [],
        options: []
      };
      
      render(
        <QuestionPresentation
          question={mockQuestion}
          onSelect={jest.fn()}
        />
      );
      
      const tooltipTrigger = screen.getByTestId('tooltip-trigger');
      await act(async () => {
        await userEvent.hover(tooltipTrigger);
      });
      
      expect(screen.getByText('This is a helpful description')).toBeInTheDocument();
    });
  });

  describe('Progressive Disclosure', () => {
    const mockQuestion = {
      ...defaultProps.question,
      description: 'Test description'
    };
    const mockProps = {
      ...defaultProps,
      question: mockQuestion
    };

    test('initially shows only question text and expands on interaction', () => {
      render(<QuestionPresentation {...mockProps} showProgressiveDisclosure={true} />);
      
      // Initially, the description should only be in the tooltip
      const expandButton = screen.getByTestId('expand-trigger');
      const tooltipTrigger = screen.getByTestId('tooltip-trigger');
      expect(expandButton).toBeInTheDocument();
      expect(tooltipTrigger).toBeInTheDocument();
      expect(screen.queryByText('Test description', { selector: '.question-description' })).not.toBeInTheDocument();
      
      // After clicking expand, the description should be visible in both places
      fireEvent.click(expandButton);
      expect(screen.getByText('Test description', { selector: '.question-description' })).toBeInTheDocument();
      expect(tooltipTrigger).toBeInTheDocument();
      expect(expandButton).not.toBeInTheDocument();
    });

    test('shows full content when progressive disclosure is disabled', () => {
      render(<QuestionPresentation {...defaultProps} showProgressiveDisclosure={false} />);
      
      expect(screen.getByRole('heading', { name: /Test Question/i })).toBeVisible();
      expect(screen.getByTestId('tooltip-trigger')).toBeVisible();
      defaultProps.question.options?.forEach(option => {
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