import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TooltipTestingDemo from '@client/components/tooltips/TooltipTestingDemo';
import tooltipUserTestingService from '@client/components/tooltips/../../services/TooltipUserTestingService';

// Mock the service
jest.mock('../../../services/TooltipUserTestingService', () => ({
  submitFeedback: jest.fn().mockReturnValue('feedback-id-123'),
  submitMetrics: jest.fn(),
  getAggregatedMetrics: jest.fn().mockReturnValue({
    averageClarity: 4.5,
    averageTimeToUnderstand: 12.3,
    averageClicksToComplete: 2.7,
    totalFeedbackCount: 3,
    commonDifficultTerms: {
      'proprioception': 2,
      'telehealth': 1
    }
  }),
  clearTestingData: jest.fn(),
  exportTestingData: jest.fn().mockReturnValue(JSON.stringify({
    feedback: [],
    metrics: {},
    exportDate: '2023-08-15T12:00:00Z'
  }))
}));

describe('TooltipTestingDemo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock URL.createObjectURL and createElement
    global.URL.createObjectURL = jest.fn().mockReturnValue('mock-url');
    const mockAnchor = {
      href: '',
      download: '',
      click: jest.fn(),
    };
    document.createElement = jest.fn().mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor;
      return document.createElement(tag);
    });
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  test('renders the demo component correctly', () => {
    render(<TooltipTestingDemo />);
    
    // Header
    expect(screen.getByText('Tooltip User Testing Demo')).toBeInTheDocument();
    
    // First question
    expect(screen.getByText('Question 1 of 3')).toBeInTheDocument();
    expect(screen.getByText(/How would you rate your practice's implementation/)).toBeInTheDocument();
    
    // Tooltip testing component
    expect(screen.getByText('Tooltip Testing')).toBeInTheDocument();
    expect(screen.getByText('Show Tooltip')).toBeInTheDocument();
    
    // Action buttons
    expect(screen.getByText('Reset Testing')).toBeInTheDocument();
    expect(screen.getByText('Export Current Results')).toBeInTheDocument();
  });

  test('cycles through questions when feedback is submitted', () => {
    render(<TooltipTestingDemo />);
    
    // First question
    expect(screen.getByText(/How would you rate your practice's implementation/)).toBeInTheDocument();
    
    // Click to show tooltip
    fireEvent.click(screen.getByText('Show Tooltip'));
    
    // Select a rating
    fireEvent.click(screen.getByText('5'));
    
    // Submit feedback
    fireEvent.click(screen.getByText('Submit Feedback'));
    
    // Service should be called
    expect(tooltipUserTestingService.submitFeedback).toHaveBeenCalledWith(expect.objectContaining({
      questionId: 'q1',
      clarityRating: 5
    }));
    
    // Should move to second question
    expect(screen.getByText(/Does your practice utilize telehealth services/)).toBeInTheDocument();
    
    // Submit feedback for second question
    fireEvent.click(screen.getByText('Show Tooltip'));
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Submit Feedback'));
    
    // Should move to third question
    expect(screen.getByText(/How effectively does your practice implement proprioceptive/)).toBeInTheDocument();
    
    // Submit feedback for third question
    fireEvent.click(screen.getByText('Show Tooltip'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('Submit Feedback'));
    
    // Should show results
    expect(screen.getByText('Testing Results Summary')).toBeInTheDocument();
  });

  test('exports testing data when export button is clicked', () => {
    render(<TooltipTestingDemo />);
    
    // Click export button
    fireEvent.click(screen.getByText('Export Current Results'));
    
    // Service export should be called
    expect(tooltipUserTestingService.exportTestingData).toHaveBeenCalled();
    
    // Download should be triggered
    const anchorEl = document.createElement('a');
    expect(anchorEl.click).toHaveBeenCalled();
  });

  test('resets testing when reset button is clicked', () => {
    render(<TooltipTestingDemo />);
    
    // Click reset button
    fireEvent.click(screen.getByText('Reset Testing'));
    
    // Service clearTestingData should be called
    expect(tooltipUserTestingService.clearTestingData).toHaveBeenCalled();
    
    // Should show first question
    expect(screen.getByText(/How would you rate your practice's implementation/)).toBeInTheDocument();
  });

  test('shows results after completing all questions', () => {
    render(<TooltipTestingDemo />);
    
    // Complete all three questions
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByText('Show Tooltip'));
      fireEvent.click(screen.getByText('5'));
      fireEvent.click(screen.getByText('Submit Feedback'));
    }
    
    // Results should be shown
    expect(screen.getByText('Testing Results Summary')).toBeInTheDocument();
    
    // Metric values from our mock should be displayed
    expect(screen.getAllByText('4.5 / 5')).toHaveLength(3);
    expect(screen.getAllByText('12.3 seconds')).toHaveLength(3);
    expect(screen.getAllByText('2.7')).toHaveLength(3);
    
    // Difficult terms should be displayed
    expect(screen.getAllByText('proprioception')).toHaveLength(3);
    expect(screen.getAllByText('telehealth')).toHaveLength(3);
    
    // Action buttons should be present
    expect(screen.getByText('Restart Testing')).toBeInTheDocument();
    expect(screen.getByText('Export Detailed Results')).toBeInTheDocument();
  });

  test('restarts testing from results view', () => {
    render(<TooltipTestingDemo />);
    
    // Complete all three questions to get to results
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByText('Show Tooltip'));
      fireEvent.click(screen.getByText('5'));
      fireEvent.click(screen.getByText('Submit Feedback'));
    }
    
    // Results should be shown
    expect(screen.getByText('Testing Results Summary')).toBeInTheDocument();
    
    // Click restart button
    fireEvent.click(screen.getByText('Restart Testing'));
    
    // Service clearTestingData should be called
    expect(tooltipUserTestingService.clearTestingData).toHaveBeenCalled();
    
    // Should return to first question
    expect(screen.getByText(/How would you rate your practice's implementation/)).toBeInTheDocument();
  });
}); 