import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TooltipUserTesting, { UsabilityMetrics } from '../components/TooltipUserTesting';
import { withTestProvider } from './TestProvider';
import { Question, QuestionType, AssessmentCategory } from '@client/types/assessment';
import { TooltipFeedback } from '../services/TooltipUserTestingService';

describe('TooltipUserTesting Component', () => {
  // Sample test questions with tooltips
  const testQuestions: Question[] = [
    {
      id: 'q1',
      text: 'What is your practice overhead ratio?',
      helpText: 'Overhead ratio is the percentage of your total revenue spent on expenses other than direct practitioner compensation. Industry standard for physiotherapy is 40-60%. Calculate by dividing total non-practitioner expenses by total revenue.',
      type: QuestionType.NUMERIC,
      category: AssessmentCategory.FINANCIAL,
      moduleId: 'mod-001',
      weight: 8,
      universalQuestion: true,
      applicableDisciplines: [],
      applicablePracticeSizes: ['SOLO', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']
    },
    {
      id: 'q2',
      text: 'How do you track patient outcome measures?',
      helpText: 'Patient outcome measures are standardized tools to assess treatment effectiveness. Examples include functional assessment scales, pain scales, and quality of life measurements. Regular tracking helps demonstrate clinical effectiveness and improve treatment protocols.',
      type: QuestionType.MULTIPLE_CHOICE,
      options: [
        { value: 'none', score: 0, text: 'No formal tracking' },
        { value: 'basic', score: 3, text: 'Basic tracking for some patients' },
        { value: 'consistent', score: 7, text: 'Consistent tracking for all patients' },
        { value: 'comprehensive', score: 10, text: 'Comprehensive system with regular analysis' }
      ],
      category: AssessmentCategory.PATIENTS,
      moduleId: 'mod-004',
      weight: 7,
      universalQuestion: false,
      applicableDisciplines: ['PHYSIOTHERAPY'],
      applicablePracticeSizes: ['SOLO', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE']
    }
  ];

  const mockQuestionId = 'q123';
  const mockTooltipText = 'This is a tooltip explaining a complex term';
  const mockOnFeedbackSubmit = jest.fn();
  const mockOnMetricsCollected = jest.fn();
  
  beforeEach(() => {
    // Mock window properties and methods
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });

    // Mock window event listeners
    const listeners: { [key: string]: EventListenerOrEventListenerObject[] } = {};
    window.addEventListener = jest.fn((event: string, callback: EventListenerOrEventListenerObject) => {
      if (!listeners[event]) {
        listeners[event] = [];
      }
      listeners[event].push(callback);
      // Immediately call the callback for resize events
      if (event === 'resize' && typeof callback === 'function') {
        callback(new Event('resize'));
      }
    });
    window.removeEventListener = jest.fn((event: string, callback: EventListenerOrEventListenerObject) => {
      if (listeners[event]) {
        listeners[event] = listeners[event].filter(cb => cb !== callback);
      }
    });

    // Reset all mocks
    jest.clearAllMocks();
  });
  
  afterEach(() => {
    // Clean up after each test
    jest.clearAllMocks();
  });

  it('renders the user testing interface correctly', () => {
    render(
      <TooltipUserTesting 
        questionId={testQuestions[0].id}
        tooltipText={testQuestions[0].helpText || ''}
      />
    );
    
    // Check basic rendering
    expect(screen.getByText('Tooltip Readability Testing')).toBeInTheDocument();
  });

  it('displays tooltips when hovering over question help icons', async () => {
    render(
      <TooltipUserTesting 
        questionId={testQuestions[0].id}
        tooltipText={testQuestions[0].helpText || ''}
      />
    );
    
    // Find and hover over the help icon
    const helpIcon = screen.getByRole('img', { name: /help/i });
    fireEvent.mouseOver(helpIcon);
    
    // Check tooltip content appears
    await waitFor(() => {
      expect(screen.getByText(/Overhead ratio is the percentage/)).toBeInTheDocument();
      expect(screen.getByText(/Industry standard for physiotherapy is 40-60%/)).toBeInTheDocument();
    });
  });

  it('allows users to provide feedback on tooltip clarity', async () => {
    render(
      <TooltipUserTesting 
        questionId={testQuestions[0].id}
        tooltipText={testQuestions[0].helpText || ''}
        onFeedbackSubmit={mockOnFeedbackSubmit}
      />
    );
    
    // Open the tooltip
    const helpIcon = screen.getByRole('img', { name: /help/i });
    fireEvent.click(helpIcon);
    
    // Rate the tooltip clarity
    const clarityRating = screen.getByLabelText('Clear (5)');
    fireEvent.click(clarityRating);
    
    // Add a feedback comment
    const feedbackInput = screen.getByPlaceholderText('Enter your feedback here...');
    fireEvent.change(feedbackInput, { target: { value: 'The explanation was very helpful' } });
    
    // Submit the feedback
    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    fireEvent.click(submitButton);
    
    // Check feedback was submitted correctly
    await waitFor(() => {
      expect(mockOnFeedbackSubmit).toHaveBeenCalledWith({
        questionId: testQuestions[0].id,
        clarityRating: 5,
        feedbackText: 'The explanation was very helpful',
        difficultTerms: []
      });
    });
  });

  it('allows marking of technical terms that need better explanation', async () => {
    render(
      <TooltipUserTesting 
        questionId={testQuestions[1].id}
        tooltipText={testQuestions[1].helpText || ''}
        onFeedbackSubmit={mockOnFeedbackSubmit}
      />
    );
    
    // Open the tooltip
    const helpIcon = screen.getByRole('img', { name: /help/i });
    fireEvent.click(helpIcon);
    
    // Mark a technical term
    const termToggle = screen.getByLabelText('Mark difficult terms');
    fireEvent.click(termToggle);
    
    // Select text (simulating text selection)
    const tooltipText = screen.getByText(/Patient outcome measures are standardized tools/);
    
    // Mock text selection
    const mockSelection = {
      toString: () => 'standardized tools',
      removeAllRanges: jest.fn()
    };
    window.getSelection = jest.fn().mockImplementation(() => mockSelection);
    
    // Click mark button
    fireEvent.click(screen.getByRole('button', { name: /mark selected term/i }));
    
    // Submit feedback with the marked term
    fireEvent.click(screen.getByLabelText('Mostly Clear (4)'));
    fireEvent.change(screen.getByPlaceholderText('Enter your feedback here...'), { 
      target: { value: 'The term standardized tools could use more examples' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /submit feedback/i }));
    
    // Check feedback includes the marked term
    await waitFor(() => {
      expect(mockOnFeedbackSubmit).toHaveBeenCalledWith({
        questionId: testQuestions[1].id,
        clarityRating: 4,
        feedbackText: 'The term standardized tools could use more examples',
        difficultTerms: ['standardized tools']
      });
    });
  });

  it('enables testing tooltip experience on mobile view', async () => {
    // Mock a mobile viewport
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width: 768px)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
    
    render(
      <TooltipUserTesting 
        questionId={testQuestions[0].id}
        tooltipText={testQuestions[0].helpText || ''}
      />
    );
    
    // Toggle mobile view
    const mobileToggle = screen.getByLabelText('Test mobile experience');
    fireEvent.click(mobileToggle);
    
    // Check that mobile view class is applied
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-test-container')).toHaveClass('mobile-view');
    });
    
    // Open a tooltip in mobile view
    const helpIcon = screen.getByRole('img', { name: /help/i });
    fireEvent.click(helpIcon);
    
    // Check that mobile tooltip is displayed correctly
    await waitFor(() => {
      const tooltip = screen.getByText(/Overhead ratio is the percentage/);
      expect(tooltip).toBeInTheDocument();
      expect(tooltip.closest('.tooltip-content')).toHaveClass('mobile');
    });
  });

  it('collects comprehensive usability metrics', async () => {
    // Mock time functions
    jest.useFakeTimers();
    
    render(
      <TooltipUserTesting 
        questionId={testQuestions[0].id}
        tooltipText={testQuestions[0].helpText || ''}
        onMetricsCollected={mockOnMetricsCollected}
      />
    );
    
    // Open the tooltip
    const helpIcon = screen.getByRole('img', { name: /help/i });
    fireEvent.click(helpIcon);
    
    // Simulate reading time (3 seconds)
    jest.advanceTimersByTime(3000);
    
    // Close the tooltip
    fireEvent.click(document.body);
    
    // Check metrics collected
    await waitFor(() => {
      expect(mockOnMetricsCollected).toHaveBeenCalledWith({
        timeToUnderstand: 3,
        clicksToComplete: 1,
        userSatisfaction: 0
      });
    });
    
    // Restore timers
    jest.useRealTimers();
  });

  test('renders the component correctly', () => {
    render(withTestProvider(TooltipUserTesting, {
      questionId: mockQuestionId,
      tooltipText: mockTooltipText,
      onFeedbackSubmit: mockOnFeedbackSubmit,
      onMetricsCollected: mockOnMetricsCollected
    }));
    
    expect(screen.getByTestId('tooltip-container')).toBeInTheDocument();
  });
  
  test('shows and hides tooltip when button is clicked', () => {
    render(withTestProvider(TooltipUserTesting, {
      questionId: mockQuestionId,
      tooltipText: mockTooltipText
    }));
    
    const button = screen.getByRole('button', { name: /show tooltip/i });
    fireEvent.click(button);
    expect(screen.getByText(mockTooltipText)).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByText(mockTooltipText)).not.toBeInTheDocument();
  });
  
  test('tracks mobile view correctly', () => {
    render(withTestProvider(TooltipUserTesting, {
      questionId: mockQuestionId,
      tooltipText: mockTooltipText
    }));

    // Simulate resize to mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500 // Mobile width
    });

    // Trigger the resize event
    window.dispatchEvent(new Event('resize'));
    expect(screen.getByTestId('tooltip-container')).toHaveClass('mobile-view');

    // Simulate resize back to desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024 // Desktop width
    });

    // Trigger the resize event again
    window.dispatchEvent(new Event('resize'));
    expect(screen.getByTestId('tooltip-container')).not.toHaveClass('mobile-view');
  });
  
  test('allows user to rate tooltip clarity', async () => {
    render(withTestProvider(TooltipUserTesting, {
      questionId: mockQuestionId,
      tooltipText: mockTooltipText,
      onFeedbackSubmit: mockOnFeedbackSubmit
    }));

    const clarityRating = screen.getByLabelText('Clarity Rating');
    fireEvent.change(clarityRating, { target: { value: '4' } });
    expect(clarityRating).toHaveValue('4');
  });
  
  test('submits feedback and metrics when form is submitted', async () => {
    render(withTestProvider(TooltipUserTesting, {
      questionId: mockQuestionId,
      tooltipText: mockTooltipText,
      onFeedbackSubmit: mockOnFeedbackSubmit,
      onMetricsCollected: mockOnMetricsCollected
    }));

    // Fill in feedback form
    const clarityRating = screen.getByLabelText('Clarity Rating');
    const feedbackText = screen.getByLabelText('Feedback');
    const submitButton = screen.getByRole('button', { name: /submit feedback/i });

    fireEvent.change(clarityRating, { target: { value: '4' } });
    fireEvent.change(feedbackText, { target: { value: 'Very clear explanation' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnFeedbackSubmit).toHaveBeenCalledWith({
        questionId: mockQuestionId,
        clarityRating: 4,
        feedbackText: 'Very clear explanation',
        difficultTerms: []
      });
    });
  });
  
  test('does not allow submitting without a clarity rating', async () => {
    render(withTestProvider(TooltipUserTesting, {
      questionId: mockQuestionId,
      tooltipText: mockTooltipText,
      onFeedbackSubmit: mockOnFeedbackSubmit
    }));

    const submitButton = screen.getByRole('button', { name: /submit feedback/i });
    fireEvent.click(submitButton);

    expect(mockOnFeedbackSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/please provide a clarity rating/i)).toBeInTheDocument();
  });
  
  test('resets form after submission', async () => {
    render(withTestProvider(TooltipUserTesting, {
      questionId: mockQuestionId,
      tooltipText: mockTooltipText,
      onFeedbackSubmit: mockOnFeedbackSubmit
    }));

    const clarityRating = screen.getByLabelText('Clarity Rating');
    const feedbackText = screen.getByLabelText('Feedback');
    const submitButton = screen.getByRole('button', { name: /submit feedback/i });

    fireEvent.change(clarityRating, { target: { value: '4' } });
    fireEvent.change(feedbackText, { target: { value: 'Very clear explanation' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(clarityRating).toHaveValue('0');
      expect(feedbackText).toHaveValue('');
    });
  });
}); 