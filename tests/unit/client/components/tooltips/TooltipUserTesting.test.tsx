import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TooltipUserTesting, { UsabilityMetrics } from '@client/components/tooltips/TooltipUserTesting';
import { Question } from '@client/components/tooltips/../../types/assessment.types';
import { AssessmentCategory } from '@client/components/tooltips/../../types/assessment.types';
import { TooltipFeedback } from '@client/components/tooltips/../../types/assessment.types';

describe('TooltipUserTesting Component', () => {
  // Sample test questions with tooltips
  const testQuestions: Question[] = [
    {
      id: 'q1',
      text: 'What is your practice overhead ratio?',
      helpText: 'Overhead ratio is the percentage of your total revenue spent on expenses other than direct practitioner compensation. Industry standard for physiotherapy is 40-60%. Calculate by dividing total non-practitioner expenses by total revenue.',
      type: 'NUMERIC',
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
      type: 'MULTIPLE_CHOICE',
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
    jest.useFakeTimers();
    mockOnFeedbackSubmit.mockClear();
    mockOnMetricsCollected.mockClear();
  });
  
  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders the user testing interface correctly', () => {
    render(<TooltipUserTesting questions={testQuestions} />);
    
    // Check basic rendering
    expect(screen.getByText('Tooltip Readability Testing')).toBeInTheDocument();
    expect(screen.getByText('What is your practice overhead ratio?')).toBeInTheDocument();
    expect(screen.getByText('How do you track patient outcome measures?')).toBeInTheDocument();
  });

  it('displays tooltips when hovering over question help icons', async () => {
    render(<TooltipUserTesting questions={testQuestions} />);
    
    // Find and hover over the first question's help icon
    const helpIcon = screen.getAllByRole('img', { name: /help/i })[0];
    fireEvent.mouseOver(helpIcon);
    
    // Check tooltip content appears
    await waitFor(() => {
      expect(screen.getByText(/Overhead ratio is the percentage/)).toBeInTheDocument();
      expect(screen.getByText(/Industry standard for physiotherapy is 40-60%/)).toBeInTheDocument();
    });
  });

  it('allows users to provide feedback on tooltip clarity', async () => {
    const onFeedbackSubmit = jest.fn();
    render(<TooltipUserTesting 
      questions={testQuestions} 
      onFeedbackSubmit={onFeedbackSubmit} 
    />);
    
    // Open the first tooltip
    const helpIcons = screen.getAllByRole('img', { name: /help/i });
    fireEvent.click(helpIcons[0]);
    
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
      expect(onFeedbackSubmit).toHaveBeenCalledWith({
        questionId: 'q1',
        clarityRating: 5,
        feedbackText: 'The explanation was very helpful',
        difficultTerms: []
      });
    });
  });

  it('allows marking of technical terms that need better explanation', async () => {
    const onFeedbackSubmit = jest.fn();
    render(<TooltipUserTesting 
      questions={testQuestions} 
      onFeedbackSubmit={onFeedbackSubmit} 
    />);
    
    // Open the second tooltip
    const helpIcons = screen.getAllByRole('img', { name: /help/i });
    fireEvent.click(helpIcons[1]);
    
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
      expect(onFeedbackSubmit).toHaveBeenCalledWith({
        questionId: 'q2',
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
    
    render(<TooltipUserTesting questions={testQuestions} />);
    
    // Toggle mobile view
    const mobileToggle = screen.getByLabelText('Test mobile experience');
    fireEvent.click(mobileToggle);
    
    // Check that mobile view class is applied
    await waitFor(() => {
      expect(screen.getByTestId('tooltip-test-container')).toHaveClass('mobile-view');
    });
    
    // Open a tooltip in mobile view
    const helpIcons = screen.getAllByRole('img', { name: /help/i });
    fireEvent.click(helpIcons[0]);
    
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
    const onMetricsCollected = jest.fn();
    
    render(
      <TooltipUserTesting 
        questions={testQuestions} 
        onMetricsCollected={onMetricsCollected} 
      />
    );
    
    // Open the first tooltip
    const helpIcons = screen.getAllByRole('img', { name: /help/i });
    fireEvent.click(helpIcons[0]);
    
    // Simulate reading time (3 seconds)
    jest.advanceTimersByTime(3000);
    
    // Close the tooltip
    fireEvent.click(document.body);
    
    // Check metrics collected
    await waitFor(() => {
      expect(onMetricsCollected).toHaveBeenCalledWith(expect.objectContaining({
        questionId: 'q1',
        viewDuration: 3,
        interactions: expect.any(Number),
        expanded: false
      }));
    });
    
    // Restore timers
    jest.useRealTimers();
  });

  test('renders the component correctly', () => {
    render(
      <TooltipUserTesting 
        questionId={mockQuestionId}
        tooltipText={mockTooltipText}
        onFeedbackSubmit={mockOnFeedbackSubmit}
        onMetricsCollected={mockOnMetricsCollected}
      />
    );
    
    expect(screen.getByText('Tooltip Testing')).toBeInTheDocument();
    expect(screen.getByText('Show Tooltip')).toBeInTheDocument();
    expect(screen.getByText('Provide Feedback')).toBeInTheDocument();
    expect(screen.getByText('Clarity Rating (1-5):')).toBeInTheDocument();
    expect(screen.getByText('Additional Feedback:')).toBeInTheDocument();
    expect(screen.getByText('Difficult Technical Terms:')).toBeInTheDocument();
    expect(screen.getByText('Submit Feedback')).toBeDisabled();
  });
  
  test('shows and hides tooltip when button is clicked', () => {
    render(
      <TooltipUserTesting 
        questionId={mockQuestionId}
        tooltipText={mockTooltipText}
        onFeedbackSubmit={mockOnFeedbackSubmit}
        onMetricsCollected={mockOnMetricsCollected}
      />
    );
    
    // Initially tooltip should be hidden
    expect(screen.queryByText(mockTooltipText)).not.toBeInTheDocument();
    
    // Click to show tooltip
    fireEvent.click(screen.getByText('Show Tooltip'));
    expect(screen.getByText(mockTooltipText)).toBeInTheDocument();
    expect(screen.getByText('Hide Tooltip')).toBeInTheDocument();
    
    // Click to hide tooltip
    fireEvent.click(screen.getByText('Hide Tooltip'));
    expect(screen.queryByText(mockTooltipText)).not.toBeInTheDocument();
    expect(screen.getByText('Show Tooltip')).toBeInTheDocument();
  });
  
  test('allows user to rate tooltip clarity', () => {
    render(
      <TooltipUserTesting 
        questionId={mockQuestionId}
        tooltipText={mockTooltipText}
        onFeedbackSubmit={mockOnFeedbackSubmit}
        onMetricsCollected={mockOnMetricsCollected}
      />
    );
    
    // Submit button should be disabled initially
    expect(screen.getByText('Submit Feedback')).toBeDisabled();
    
    // Select a rating
    fireEvent.click(screen.getByText('4'));
    
    // Submit button should be enabled after selecting a rating
    expect(screen.getByText('Submit Feedback')).toBeEnabled();
  });
  
  test('allows user to add and remove difficult terms', () => {
    render(
      <TooltipUserTesting 
        questionId={mockQuestionId}
        tooltipText={mockTooltipText}
        onFeedbackSubmit={mockOnFeedbackSubmit}
        onMetricsCollected={mockOnMetricsCollected}
      />
    );
    
    // Add a term
    const termInput = screen.getByPlaceholderText('Enter difficult terms here');
    fireEvent.change(termInput, { target: { value: 'Biomechanics' } });
    fireEvent.click(screen.getByText('Add'));
    
    // Term should appear in the list
    expect(screen.getByText('Biomechanics')).toBeInTheDocument();
    
    // Add another term
    fireEvent.change(termInput, { target: { value: 'Proprioception' } });
    fireEvent.click(screen.getByText('Add'));
    
    // Both terms should be in the list
    expect(screen.getByText('Biomechanics')).toBeInTheDocument();
    expect(screen.getByText('Proprioception')).toBeInTheDocument();
    
    // Remove the first term
    const removeButtons = screen.getAllByText('✕');
    fireEvent.click(removeButtons[0]);
    
    // First term should be gone, second term should remain
    expect(screen.queryByText('Biomechanics')).not.toBeInTheDocument();
    expect(screen.getByText('Proprioception')).toBeInTheDocument();
  });
  
  test('submits feedback and metrics when form is submitted', () => {
    render(
      <TooltipUserTesting 
        questionId={mockQuestionId}
        tooltipText={mockTooltipText}
        onFeedbackSubmit={mockOnFeedbackSubmit}
        onMetricsCollected={mockOnMetricsCollected}
      />
    );
    
    // Show tooltip to start the timer
    fireEvent.click(screen.getByText('Show Tooltip'));
    
    // Advance timer by 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });
    
    // Fill out the form
    fireEvent.click(screen.getByText('5')); // Select rating 5
    
    const feedbackTextarea = screen.getByPlaceholderText('Please share your thoughts on this tooltip\'s clarity and usefulness...');
    fireEvent.change(feedbackTextarea, { target: { value: 'Very clear and helpful explanation.' } });
    
    // Add a difficult term
    const termInput = screen.getByPlaceholderText('Enter difficult terms here');
    fireEvent.change(termInput, { target: { value: 'Biomechanics' } });
    fireEvent.click(screen.getByText('Add'));
    
    // Submit the form
    fireEvent.click(screen.getByText('Submit Feedback'));
    
    // Check that callbacks were called with correct data
    expect(mockOnFeedbackSubmit).toHaveBeenCalledWith({
      questionId: mockQuestionId,
      clarityRating: 5,
      feedbackText: 'Very clear and helpful explanation.',
      difficultTerms: ['Biomechanics']
    });
    
    expect(mockOnMetricsCollected).toHaveBeenCalledWith({
      timeToUnderstand: 10,
      clicksToComplete: 1, // One click to show the tooltip
      userSatisfaction: 5
    });
    
    // Check that metrics are displayed
    expect(screen.getByText('Time to understand: 10 seconds')).toBeInTheDocument();
    expect(screen.getByText('Clicks to complete: 1')).toBeInTheDocument();
    expect(screen.getByText('User satisfaction: 5/5')).toBeInTheDocument();
  });
  
  test('tracks mobile view correctly', () => {
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375 // Mobile width
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    
    render(
      <TooltipUserTesting 
        questionId={mockQuestionId}
        tooltipText={mockTooltipText}
        onFeedbackSubmit={mockOnFeedbackSubmit}
        onMetricsCollected={mockOnMetricsCollected}
      />
    );
    
    // Should show mobile view indicator
    expect(screen.getByText('Mobile View')).toBeInTheDocument();
    
    // Change to desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024 // Desktop width
    });
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'));
    
    // Should now show desktop view indicator
    expect(screen.getByText('Desktop View')).toBeInTheDocument();
  });
  
  test('does not allow submitting without a clarity rating', () => {
    render(
      <TooltipUserTesting 
        questionId={mockQuestionId}
        tooltipText={mockTooltipText}
        onFeedbackSubmit={mockOnFeedbackSubmit}
        onMetricsCollected={mockOnMetricsCollected}
      />
    );
    
    // Add text feedback without rating
    const feedbackTextarea = screen.getByPlaceholderText('Please share your thoughts on this tooltip\'s clarity and usefulness...');
    fireEvent.change(feedbackTextarea, { target: { value: 'Very clear and helpful explanation.' } });
    
    // Submit button should still be disabled
    expect(screen.getByText('Submit Feedback')).toBeDisabled();
    
    // Select a rating
    fireEvent.click(screen.getByText('3'));
    
    // Now submit button should be enabled
    expect(screen.getByText('Submit Feedback')).toBeEnabled();
  });
  
  test('resets form after submission', () => {
    render(
      <TooltipUserTesting 
        questionId={mockQuestionId}
        tooltipText={mockTooltipText}
        onFeedbackSubmit={mockOnFeedbackSubmit}
        onMetricsCollected={mockOnMetricsCollected}
      />
    );
    
    // Show tooltip
    fireEvent.click(screen.getByText('Show Tooltip'));
    
    // Fill out the form
    fireEvent.click(screen.getByText('4')); // Select rating 4
    
    const feedbackTextarea = screen.getByPlaceholderText('Please share your thoughts on this tooltip\'s clarity and usefulness...');
    fireEvent.change(feedbackTextarea, { target: { value: 'Good explanation.' } });
    
    // Add a difficult term
    const termInput = screen.getByPlaceholderText('Enter difficult terms here');
    fireEvent.change(termInput, { target: { value: 'Biomechanics' } });
    fireEvent.click(screen.getByText('Add'));
    
    // Submit the form
    fireEvent.click(screen.getByText('Submit Feedback'));
    
    // Tooltip should be hidden again
    expect(screen.queryByText(mockTooltipText)).not.toBeInTheDocument();
    
    // Form should be reset
    expect(screen.getByText('Submit Feedback')).toBeDisabled(); // Rating reset
    expect(screen.getByPlaceholderText('Please share your thoughts on this tooltip\'s clarity and usefulness...')).toHaveValue(''); // Feedback text reset
    expect(screen.queryByText('Biomechanics')).not.toBeInTheDocument(); // Terms reset
  });
  
  test('increments click count correctly', () => {
    render(
      <TooltipUserTesting 
        questionId={mockQuestionId}
        tooltipText={mockTooltipText}
        onFeedbackSubmit={mockOnFeedbackSubmit}
        onMetricsCollected={mockOnMetricsCollected}
      />
    );
    
    // Show tooltip
    fireEvent.click(screen.getByText('Show Tooltip'));
    
    // Hide tooltip
    fireEvent.click(screen.getByText('Hide Tooltip'));
    
    // Show tooltip again
    fireEvent.click(screen.getByText('Show Tooltip'));
    
    // Fill out minimum required form data
    fireEvent.click(screen.getByText('3')); // Select rating 3
    
    // Submit the form
    fireEvent.click(screen.getByText('Submit Feedback'));
    
    // Check that click count is 3
    expect(screen.getByText('Clicks to complete: 3')).toBeInTheDocument();
  });
}); 