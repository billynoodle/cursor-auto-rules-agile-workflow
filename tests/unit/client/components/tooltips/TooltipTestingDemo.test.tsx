import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import TooltipTestingDemo from '@client/components/tooltips/TooltipTestingDemo';
import tooltipUserTestingService from '@client/services/TooltipUserTestingService';

// Mock the service
jest.mock('@client/services/TooltipUserTestingService', () => ({
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
    expect(screen.getByText('Tooltip Testing Demo')).toBeInTheDocument();
    
    // Testing interface
    expect(screen.getByText('Test this tooltip:')).toBeInTheDocument();
    
    // Export button should not be visible initially
    expect(screen.queryByText('Export Testing Data')).not.toBeInTheDocument();
  });

  test('submits feedback and shows history', async () => {
    render(<TooltipTestingDemo />);
    
    // Show tooltip
    fireEvent.click(screen.getByText('Show Tooltip'));
    
    // Rate clarity
    fireEvent.click(screen.getByLabelText('Clear (5)'));
    
    // Add feedback
    fireEvent.change(screen.getByPlaceholderText('Enter your feedback here...'), {
      target: { value: 'Very clear explanation' }
    });
    
    // Submit feedback
    fireEvent.click(screen.getByText('Submit Feedback'));
    
    // Service should be called
    expect(tooltipUserTestingService.submitFeedback).toHaveBeenCalledWith({
      questionId: 'demo-question',
      clarityRating: 5,
      feedbackText: 'Very clear explanation',
      difficultTerms: []
    });
    
    // History should be shown
    expect(screen.getByText('Testing History')).toBeInTheDocument();
    expect(screen.getByText('Feedback Submissions')).toBeInTheDocument();
    expect(screen.getByText('Clarity Rating: 5/5')).toBeInTheDocument();
  });

  test('exports testing data when export button is clicked', () => {
    render(<TooltipTestingDemo />);
    
    // Submit some feedback to make export button visible
    fireEvent.click(screen.getByText('Show Tooltip'));
    fireEvent.click(screen.getByLabelText('Clear (5)'));
    fireEvent.click(screen.getByText('Submit Feedback'));
    
    // Click export button
    fireEvent.click(screen.getByText('Export Testing Data'));
    
    // Service export should be called
    expect(tooltipUserTestingService.exportTestingData).toHaveBeenCalled();
    
    // Download should be triggered
    const mockAnchor = document.createElement('a');
    expect(mockAnchor.click).toHaveBeenCalled();
    expect(mockAnchor.download).toBe('tooltip-testing-data.json');
  });
}); 