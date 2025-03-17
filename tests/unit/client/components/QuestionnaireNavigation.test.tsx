import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { QuestionnaireNavigation } from '../../../../client/src/components/assessment/QuestionnaireNavigation';
import { AssessmentCategory, Module, ModuleStatus } from '../../../../client/src/types/assessment.types';

describe('QuestionnaireNavigation', () => {
  const mockModules: Module[] = [
    {
      id: 'module1',
      name: 'Financial Health',
      description: 'Financial health assessment',
      estimatedTimeMinutes: 15,
      categories: [AssessmentCategory.FINANCIAL],
      status: ModuleStatus.IN_PROGRESS,
      progress: 60,
      prerequisites: [],
      completedQuestions: 6,
      totalQuestions: 10
    },
    {
      id: 'module2',
      name: 'Operations',
      description: 'Operations assessment',
      estimatedTimeMinutes: 20,
      categories: [AssessmentCategory.OPERATIONS],
      status: ModuleStatus.LOCKED,
      progress: 0,
      prerequisites: ['module1'],
      completedQuestions: 0,
      totalQuestions: 12
    }
  ];

  const defaultProps = {
    modules: mockModules,
    currentModule: 'module1',
    currentCategory: AssessmentCategory.FINANCIAL,
    onModuleSelect: jest.fn(),
    onCategorySelect: jest.fn(),
    totalEstimatedTime: 35,
    remainingTime: 25
  };

  beforeEach(() => {
    // Mock window.matchMedia
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
      expect(within(financialModule).getByText('Financial Health')).toBeInTheDocument();
      expect(within(financialModule).getByText('60%')).toBeInTheDocument();
      expect(within(financialModule).getByText('15 min')).toBeInTheDocument();
      expect(within(financialModule).getByText('6/10 questions')).toBeInTheDocument();
    });

    test('displays locked state for modules with unmet prerequisites', () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      
      const operationsModule = screen.getByTestId('module-item-module2');
      const operationsButton = within(operationsModule).getByRole('button');
      expect(operationsButton).toHaveAttribute('aria-disabled', 'true');
      expect(within(operationsModule).getByTestId('lock-icon')).toBeInTheDocument();
      expect(within(operationsModule).getByText(/requires financial health/i)).toBeInTheDocument();
    });

    test('handles module selection when prerequisites are met', () => {
      const modules = JSON.parse(JSON.stringify(mockModules));
      modules[1].status = ModuleStatus.AVAILABLE;
      render(<QuestionnaireNavigation {...defaultProps} modules={modules} />);
      
      const operationsModule = screen.getByTestId('module-item-module2');
      const operationsButton = within(operationsModule).getByRole('button');
      fireEvent.click(operationsButton);
      expect(defaultProps.onModuleSelect).toHaveBeenCalledWith('module2');
    });

    test('prevents module selection when prerequisites are not met', async () => {
      // Ensure module2 is locked
      const modules = JSON.parse(JSON.stringify(mockModules));
      expect(modules[1].status).toBe(ModuleStatus.LOCKED);
      
      render(<QuestionnaireNavigation {...defaultProps} modules={modules} />);
      
      const operationsModule = screen.getByTestId('module-item-module2');
      const operationsButton = within(operationsModule).getByRole('button');
      
      // Verify button is locked
      expect(operationsButton).toHaveAttribute('data-locked', 'true');
      expect(operationsButton).toHaveAttribute('aria-disabled', 'true');
      expect(operationsButton).toBeDisabled();
      
      // Attempt to click the button
      await userEvent.click(operationsButton);
      
      // Verify onModuleSelect was not called
      expect(defaultProps.onModuleSelect).not.toHaveBeenCalled();
    });
  });

  describe('Time and Progress Display', () => {
    test('displays overall assessment progress', () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      
      expect(screen.getByText('Total Progress: 27%')).toBeInTheDocument();
      expect(screen.getByText('Time Remaining: 25 min')).toBeInTheDocument();
    });

    test('displays estimated completion time for each module', () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      
      mockModules.forEach(module => {
        expect(screen.getByText(`${module.estimatedTimeMinutes} min`)).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    test('collapses into dropdown on mobile view', () => {
      // Mock mobile view
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

      render(<QuestionnaireNavigation {...defaultProps} />);
      expect(screen.getByTestId('mobile-menu-button')).toBeInTheDocument();
    });

    test('expands dropdown menu on mobile when clicked', async () => {
      // Mock mobile view
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

      render(<QuestionnaireNavigation {...defaultProps} />);
      const menuButton = screen.getByTestId('mobile-menu-button');
      
      // Use act to handle state updates
      await userEvent.click(menuButton);
      
      // Wait for the menu to appear
      const mobileMenu = await screen.findByTestId('mobile-menu');
      expect(mobileMenu).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Accessibility', () => {
    test('supports keyboard navigation', async () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      const firstModuleButton = within(screen.getByTestId('module-item-module1')).getByRole('button');
      const secondModuleButton = within(screen.getByTestId('module-item-module2')).getByRole('button');
      
      firstModuleButton.focus();
      expect(document.activeElement).toBe(firstModuleButton);
      
      // Since the second button is disabled, it should not receive focus
      await userEvent.keyboard('{Tab}');
      expect(document.activeElement).not.toBe(secondModuleButton);
      expect(secondModuleButton).toBeDisabled();
    });

    test('provides appropriate ARIA labels and roles', () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      
      expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Assessment Navigation');
      expect(screen.getByRole('list')).toHaveAttribute('aria-label', 'Assessment Modules');
      
      mockModules.forEach(module => {
        const moduleElement = screen.getByTestId(`module-item-${module.id}`);
        expect(moduleElement).toHaveAttribute('role', 'listitem');
        expect(moduleElement).toHaveAttribute('aria-label', expect.stringContaining(module.name));
      });
    });

    test('announces module status changes', () => {
      render(<QuestionnaireNavigation {...defaultProps} />);
      
      mockModules.forEach(module => {
        const moduleElement = screen.getByTestId(`module-item-${module.id}`);
        expect(moduleElement).toHaveAttribute('aria-live', 'polite');
      });
    });
  });
}); 