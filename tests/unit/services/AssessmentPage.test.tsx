import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssessmentPage from '@client/pages/AssessmentPage';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};

// Mock matchMedia
const mockMatchMedia = jest.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: jest.fn(),
  removeListener: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}));

// Setup mocks
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
  });
  Object.defineProperty(window, 'matchMedia', {
    value: mockMatchMedia,
    writable: true,
    configurable: true
  });
});

describe('AssessmentPage', () => {
  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    mockLocalStorage.clear();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Initial Rendering', () => {
    test('renders navigation and first module content', () => {
      render(<AssessmentPage />);
      
      // Check navigation elements
      const financialModule = screen.getByTestId('module-item-mod-financial-001');
      const complianceModule = screen.getByTestId('module-item-mod-compliance-001');
      
      expect(within(financialModule).getByRole('heading')).toHaveTextContent('Financial Health Assessment');
      expect(within(complianceModule).getByRole('heading')).toHaveTextContent('Compliance Risk Assessment');
      
      // Check first module content
      const questionText = screen.getByRole('heading', { name: /What is your practice's current accounts receivable aging profile\?/i });
      expect(questionText).toBeInTheDocument();
      expect(screen.getByText(/This module evaluates your practice's financial health/i)).toBeInTheDocument();
    });

    test('displays correct module statuses initially', () => {
      render(<AssessmentPage />);
      
      const financialModule = screen.getByTestId('module-item-mod-financial-001');
      const complianceModule = screen.getByTestId('module-item-mod-compliance-001');
      
      expect(within(financialModule).getByRole('button')).toHaveAttribute('data-locked', 'false');
      expect(within(complianceModule).getByRole('button')).toHaveAttribute('data-locked', 'true');
    });

    test('loads saved progress from localStorage if available', () => {
      const savedProgress = {
        'fin-cash-001': 'excellent'
      };
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'assessmentAnswers') {
          return JSON.stringify(savedProgress);
        }
        return null;
      });

      render(<AssessmentPage />);
      
      // Check if answers are restored
      const firstOption = screen.getByLabelText('>90% of AR under 30 days, <2% over 90 days');
      expect(firstOption).toBeChecked();
    });
  });

  describe('Module Navigation', () => {
    test('prevents navigation to locked modules', async () => {
      render(<AssessmentPage />);
      
      const lockedModuleButton = screen.getByTestId('module-button-mod-compliance-001');
      await userEvent.click(lockedModuleButton);
      
      // Should still show financial module content
      const financialModule = screen.getByTestId('module-item-mod-financial-001');
      expect(within(financialModule).getByRole('heading')).toHaveTextContent('Financial Health Assessment');
    });

    test('allows navigation between unlocked modules', async () => {
      render(<AssessmentPage />);
      
      // Complete financial module
      const questions = [
        '>90% of AR under 30 days, <2% over 90 days',
        '≥6 months of operating expenses'
      ];
      
      for (const question of questions) {
        const option = screen.getByLabelText(question);
        await userEvent.click(option);
      }

      // Navigate to compliance module
      const complianceModuleButton = screen.getByTestId('module-button-mod-compliance-001');
      await userEvent.click(complianceModuleButton);

      // Should show compliance module content
      const complianceModule = screen.getByTestId('module-item-mod-compliance-001');
      expect(within(complianceModule).getByRole('heading')).toHaveTextContent('Compliance Risk Assessment');
    });

    test('preserves answers when navigating between modules', async () => {
      render(<AssessmentPage />);
      
      // Answer first question
      const firstOption = screen.getByLabelText('>90% of AR under 30 days, <2% over 90 days');
      await userEvent.click(firstOption);
      
      // Complete module to unlock compliance
      const secondOption = screen.getByLabelText('≥6 months of operating expenses');
      await userEvent.click(secondOption);

      // Navigate to compliance module and back
      const complianceModuleButton = screen.getByTestId('module-button-mod-compliance-001');
      await userEvent.click(complianceModuleButton);
      const financialModuleButton = screen.getByTestId('module-button-mod-financial-001');
      await userEvent.click(financialModuleButton);

      // Check if answer is preserved
      expect(firstOption).toBeChecked();
    });
  });

  describe('Answer Management', () => {
    test('updates progress when answering questions', async () => {
      render(<AssessmentPage />);
      
      // Answer first question
      const firstOption = screen.getByLabelText('>90% of AR under 30 days, <2% over 90 days');
      await userEvent.click(firstOption);
      
      // Check progress update
      const financialModule = screen.getByTestId('module-item-mod-financial-001');
      const progressText = within(financialModule).getByText(/\d+%/);
      expect(progressText).toHaveTextContent('50%');
    });

    test('unlocks dependent modules when prerequisites are completed', async () => {
      render(<AssessmentPage />);
      
      // Complete financial module questions
      const questions = [
        '>90% of AR under 30 days, <2% over 90 days',
        '≥6 months of operating expenses'
      ];
      
      for (const question of questions) {
        const option = screen.getByLabelText(question);
        await userEvent.click(option);
      }
      
      // Check if compliance module is unlocked
      const complianceModuleButton = screen.getByTestId('module-button-mod-compliance-001');
      expect(complianceModuleButton).toHaveAttribute('data-locked', 'false');
      expect(complianceModuleButton).not.toBeDisabled();
    });

    test('saves answers to localStorage after each change', async () => {
      render(<AssessmentPage />);
      
      // Answer first question
      const firstOption = screen.getByLabelText('>90% of AR under 30 days, <2% over 90 days');
      await userEvent.click(firstOption);
      
      // Check if localStorage was updated
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'assessmentAnswers',
        expect.stringContaining('"fin-cash-001"')
      );
    });

    test('handles answer changes correctly', async () => {
      render(<AssessmentPage />);
      
      // Select first answer
      const firstOption = screen.getByLabelText('>90% of AR under 30 days, <2% over 90 days');
      await userEvent.click(firstOption);
      
      // Change to different answer
      const differentOption = screen.getByLabelText('>80% of AR under 30 days, <5% over 90 days');
      await userEvent.click(differentOption);
      
      expect(firstOption).not.toBeChecked();
      expect(differentOption).toBeChecked();
    });
  });
}); 