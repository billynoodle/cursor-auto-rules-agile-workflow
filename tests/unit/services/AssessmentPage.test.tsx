import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AssessmentPage from '@client/pages/AssessmentPage';
import { AssessmentCategory, ModuleStatus } from '@client/types/assessment.types';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('AssessmentPage', () => {
  beforeEach(() => {
    // Clear mocks and localStorage before each test
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Initial Rendering', () => {
    test('renders navigation and first module content', () => {
      render(<AssessmentPage />);
      
      // Check navigation elements
      expect(screen.getByRole('button', { name: /Financial Health Assessment/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Compliance Risk Assessment/i })).toBeInTheDocument();
      
      // Check first module content
      expect(screen.getByRole('heading', { name: /What is your practice's current accounts receivable aging profile\?/i })).toBeInTheDocument();
      expect(screen.getByText(/This module evaluates your practice's financial health/)).toBeInTheDocument();
    });

    test('displays correct module statuses initially', () => {
      render(<AssessmentPage />);
      
      const financialModule = screen.getByTestId('module-item-mod-financial-001');
      const complianceModule = screen.getByTestId('module-item-mod-compliance-001');
      
      expect(within(financialModule).getByRole('button')).toHaveAttribute('data-locked', 'false');
      expect(within(complianceModule).getByRole('button')).toHaveAttribute('data-locked', 'true');
      expect(within(complianceModule).getByTestId('lock-icon')).toBeInTheDocument();
    });

    test('loads saved progress from localStorage if available', () => {
      const savedAnswers = {
        'fin-cash-001': 'excellent',
        'fin-cash-002': 'robust'
      };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedAnswers));

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
      expect(screen.getByText(/What is your practice's current accounts receivable aging profile?/)).toBeInTheDocument();
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
      expect(screen.getByText(/When was your last comprehensive compliance risk assessment conducted/)).toBeInTheDocument();
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
      
      // Answer a question
      const firstOption = screen.getByLabelText('>90% of AR under 30 days, <2% over 90 days');
      await userEvent.click(firstOption);
      
      // Check if localStorage was updated
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'assessmentAnswers',
        expect.stringContaining('fin-cash-001')
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

  describe('Category Management', () => {
    test('displays correct category for current module', () => {
      render(<AssessmentPage />);
      
      expect(screen.getByTestId('current-category')).toHaveTextContent(AssessmentCategory.FINANCIAL);
    });

    test('updates category when switching modules', async () => {
      render(<AssessmentPage />);
      
      // Complete financial module to unlock compliance
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

      expect(screen.getByTestId('current-category')).toHaveTextContent(AssessmentCategory.COMPLIANCE);
    });
  });

  describe('Error Handling', () => {
    test('handles localStorage errors gracefully', () => {
      // Simulate localStorage error
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      // Should not throw error when rendering
      expect(() => render(<AssessmentPage />)).not.toThrow();
    });

    test('shows error message when saving fails', async () => {
      // Simulate localStorage error
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });

      render(<AssessmentPage />);
      
      // Try to save answer
      const firstOption = screen.getByLabelText('>90% of AR under 30 days, <2% over 90 days');
      await userEvent.click(firstOption);
      
      expect(screen.getByRole('alert')).toHaveTextContent(/Error saving progress/);
    });
  });
}); 