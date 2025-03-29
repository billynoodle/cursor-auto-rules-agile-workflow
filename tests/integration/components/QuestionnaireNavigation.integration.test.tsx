import React from 'react';
import { render, screen, fireEvent, within, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { QuestionnaireNavigation } from '@client/components/assessment/QuestionnaireNavigation';
import { AssessmentCategory, QuestionModule, ModuleStatus, QuestionType } from '@client/types/assessment';
import { DisciplineType } from '@client/types/discipline';
import { PracticeSize } from '@client/types/practice';
import { generateMockModules } from '@__mocks__/data/assessment/generators';

describe('QuestionnaireNavigation', () => {
  const mockModules = generateMockModules();
  const mockHandleModuleSelect = jest.fn();
  const mockHandleCategorySelect = jest.fn();

  const defaultProps = {
    modules: mockModules,
    currentModule: mockModules[0].id,
    currentCategory: AssessmentCategory.FINANCIAL,
    onModuleSelect: mockHandleModuleSelect,
    onCategorySelect: mockHandleCategorySelect,
    totalEstimatedTime: 35,
    remainingTime: 25
  };

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Module Navigation', () => {
    test('renders module navigation items with progress indicators', () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      
      const financialModule = screen.getByTestId('module-item-module1');
      expect(within(financialModule).getByText('Module 1')).toBeInTheDocument();
      
      const progressElement = within(financialModule).getByText(/0%/);
      expect(progressElement).toBeInTheDocument();
      
      const timeElement = within(financialModule).getByText(/30 min/);
      expect(timeElement).toBeInTheDocument();
      
      const questionsElement = within(financialModule).getByText(/0\/3 questions/);
      expect(questionsElement).toBeInTheDocument();
    });

    test('displays locked state for modules with unmet prerequisites', () => {
      const lockedModules = mockModules.map((m, i) => i === 1 ? { ...m, status: ModuleStatus.LOCKED } : m);
      render(<QuestionnaireNavigation {...defaultProps} modules={lockedModules} />);
      const lockedModule = screen.getByTestId(`module-button-${mockModules[1].id}`);
      expect(lockedModule).toBeDisabled();
      expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
      expect(screen.getByText(/Requires/)).toBeInTheDocument();
    });

    test('allows navigation to unlocked modules', () => {
      const unlockedModules = mockModules.map(m => ({ ...m, status: ModuleStatus.IN_PROGRESS }));
      render(<QuestionnaireNavigation {...defaultProps} modules={unlockedModules} />);
      const moduleButton = screen.getByTestId(`module-button-${mockModules[1].id}`);
      fireEvent.click(moduleButton);
      expect(mockHandleModuleSelect).toHaveBeenCalledWith(mockModules[1].id);
    });
  });

  describe('Time and Progress Display', () => {
    test('displays overall assessment progress', () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      
      const progressElement = screen.getByText(/Total Progress:/);
      expect(progressElement).toBeInTheDocument();
      expect(screen.getByText(/0%/)).toBeInTheDocument();
      expect(screen.getByText('Time Remaining: 25 min')).toBeInTheDocument();
    });

    test('displays estimated completion time for each module', () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      
      mockModules.forEach((module, index) => {
        const moduleElement = screen.getByTestId(`module-item-module${index + 1}`);
        expect(within(moduleElement).getByText(/30 min/)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(max-width: 768px)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });
    });

    test('renders mobile menu on small screens', () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      
      const navigation = screen.getByRole('navigation');
      expect(navigation).toHaveClass('questionnaire-navigation');
      
      const moduleList = screen.getByRole('list');
      expect(moduleList).toHaveClass('module-list');
    });
  });

  describe('Accessibility', () => {
    test('supports keyboard navigation', async () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      const firstModuleButton = within(screen.getByTestId('module-item-module1')).getByRole('button');
      const secondModuleButton = within(screen.getByTestId('module-item-module2')).getByRole('button');
      
      firstModuleButton.focus();
      expect(document.activeElement).toBe(firstModuleButton);
      
      // Tab to the next button
      await userEvent.tab();
      expect(document.activeElement).toBe(secondModuleButton);
    });

    test('provides appropriate ARIA labels and roles', () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Assessment Navigation');
      expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Assessment Modules');
      
      mockModules.forEach((module, index) => {
        const moduleElement = screen.getByTestId(`module-item-module${index + 1}`);
        expect(moduleElement).toHaveAttribute('role', 'listitem');
        expect(moduleElement).toHaveAttribute('aria-label', expect.stringContaining('Module'));
      });
    });

    test('announces module status changes', () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      
      mockModules.forEach((module, index) => {
        const moduleElement = screen.getByTestId(`module-item-module${index + 1}`);
        expect(moduleElement).toHaveAttribute('aria-live', 'polite');
      });
    });
  });
}); 