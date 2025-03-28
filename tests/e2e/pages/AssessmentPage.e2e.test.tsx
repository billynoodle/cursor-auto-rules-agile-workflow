import { test, expect } from '@playwright/test';
import AssessmentPage from '../../../client/src/pages/AssessmentPage';

test.describe('Assessment Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to assessment page
    await page.goto('/assessment');
  });

  test('should display initial assessment page', async ({ page }) => {
    // Check main elements are visible
    await expect(page.getByRole('heading', { name: 'Assessment' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Assessment' })).toBeVisible();
  });

  test('should start assessment flow', async ({ page }) => {
    // Start assessment
    await page.getByRole('button', { name: 'Start Assessment' }).click();

    // Check first module is loaded
    await expect(page.getByTestId('module-title')).toBeVisible();
    await expect(page.getByTestId('question-text')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next' })).toBeVisible();
  });

  test('should complete first question', async ({ page }) => {
    // Start assessment
    await page.getByRole('button', { name: 'Start Assessment' }).click();

    // Answer first question
    await page.getByRole('radio', { name: 'Option A' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Check progress is updated
    await expect(page.getByTestId('progress-indicator')).toContainText('1/2');
  });

  test('should show validation error for unanswered question', async ({ page }) => {
    // Start assessment
    await page.getByRole('button', { name: 'Start Assessment' }).click();

    // Try to proceed without answering
    await page.getByRole('button', { name: 'Next' }).click();

    // Check error message
    await expect(page.getByText('Please answer the question before proceeding')).toBeVisible();
  });

  test('should complete assessment', async ({ page }) => {
    // Start assessment
    await page.getByRole('button', { name: 'Start Assessment' }).click();

    // Complete all questions
    for (const option of ['Option A', 'Option B']) {
      await page.getByRole('radio', { name: option }).click();
      await page.getByRole('button', { name: 'Next' }).click();
    }

    // Check completion screen
    await expect(page.getByText('Assessment Complete')).toBeVisible();
    await expect(page.getByRole('button', { name: 'View Results' })).toBeVisible();
  });

  test('should save progress on refresh', async ({ page }) => {
    // Start assessment
    await page.getByRole('button', { name: 'Start Assessment' }).click();

    // Answer first question
    await page.getByRole('radio', { name: 'Option A' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Refresh page
    await page.reload();

    // Check progress is maintained
    await expect(page.getByTestId('progress-indicator')).toContainText('1/2');
    await expect(page.getByTestId('question-text')).toBeVisible();
  });

  test('should handle network errors', async ({ page, context }) => {
    // Start assessment
    await page.goto('/assessment');
    await page.getByRole('button', { name: 'Start Assessment' }).click();

    // Intercept and fail network requests
    await context.route('**/api/**', route => route.abort());

    // Try to save answer
    await page.getByRole('radio', { name: 'Option A' }).click();
    await page.getByRole('button', { name: 'Next' }).click();

    // Check error handling
    await expect(page.getByText('Network error. Your progress has been saved locally.')).toBeVisible();
  });
}); 