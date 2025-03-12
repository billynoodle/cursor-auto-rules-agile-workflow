import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { QuestionnaireNavigation } from '@client/components/assessment/QuestionnaireNavigation';
import { AssessmentCategory, Module } from '@client/types/assessment.types';

describe('QuestionnaireNavigation', () => {
  const mockModules: Module[] = [
    {
      id: 'module1',
      name: 'Financial Health',
      description: 'Financial health assessment',
      estimatedTimeMinutes: 15,
      categories: [AssessmentCategory.FINANCIAL]
    },
    {
      id: 'module2',
      name: 'Operations',
      description: 'Operations assessment',
      estimatedTimeMinutes: 20,
      categories: [AssessmentCategory.OPERATIONS]
    }
  ];

  const defaultProps = {
    modules: mockModules,
    currentModule: 'module1',
    currentCategory: AssessmentCategory.FINANCIAL,
    onModuleSelect: jest.fn(),
    onCategorySelect: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders module navigation items', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    expect(screen.getByText('Financial Health')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
  });

  test('highlights current module', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    const currentModule = screen.getByText('Financial Health').closest('button');
    expect(currentModule).toHaveClass('active');
    const otherModule = screen.getByText('Operations').closest('button');
    expect(otherModule).not.toHaveClass('active');
  });

  test('handles module changes', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    fireEvent.click(screen.getByText('Operations'));
    expect(defaultProps.onModuleSelect).toHaveBeenCalledWith('module2');
  });

  test('handles empty modules array gracefully', () => {
    render(<QuestionnaireNavigation {...defaultProps} modules={[]} />);
    const moduleNavigation = screen.getByRole('navigation').children[0];
    expect(moduleNavigation.children).toHaveLength(0);
    // Category buttons should still be present
    const categoryNavigation = screen.getByRole('navigation').children[1];
    expect(categoryNavigation.children.length).toBeGreaterThan(0);
  });

  test('maintains tab order for accessibility', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAttribute('tabIndex', '0');
    });
  });

  test('renders all assessment categories', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    Object.values(AssessmentCategory).forEach(category => {
      expect(screen.getByText(category)).toBeInTheDocument();
    });
  });

  test('highlights current category', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    const currentCategory = screen.getByText(AssessmentCategory.FINANCIAL).closest('button');
    expect(currentCategory).toHaveClass('active');
    const otherCategories = Object.values(AssessmentCategory)
      .filter(cat => cat !== AssessmentCategory.FINANCIAL)
      .map(cat => screen.getByText(cat).closest('button'));
    otherCategories.forEach(button => {
      expect(button).not.toHaveClass('active');
    });
  });

  test('handles category changes', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    fireEvent.click(screen.getByText(AssessmentCategory.OPERATIONS));
    expect(defaultProps.onCategorySelect).toHaveBeenCalledWith(AssessmentCategory.OPERATIONS);
  });

  test('renders navigation with correct structure', () => {
    render(<QuestionnaireNavigation {...defaultProps} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('questionnaire-navigation');
    expect(nav.children).toHaveLength(2); // module-navigation and category-navigation
    expect(nav.children[0]).toHaveClass('module-navigation');
    expect(nav.children[1]).toHaveClass('category-navigation');
  });
}); 