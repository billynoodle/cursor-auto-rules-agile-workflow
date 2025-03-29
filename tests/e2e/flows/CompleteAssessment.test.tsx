import { test, expect } from '@playwright/test';
import { AssessmentCategory, QuestionType } from '@client/types/assessment';
import { DisciplineType } from '@client/types/discipline';
import { PracticeSize } from '@client/types/practice';

const mockModules = [
  {
    id: 'module1',
    title: 'Test Module',
    description: 'Test module description',
    categories: [AssessmentCategory.OPERATIONS],
    questions: [
      {
        id: 'q1',
        text: 'How do you track patient progress?',
        type: QuestionType.MULTIPLE_CHOICE,
        moduleId: 'module1',
        weight: 1,
        category: AssessmentCategory.OPERATIONS,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        universalQuestion: true,
        applicablePracticeSizes: [PracticeSize.SMALL, PracticeSize.MEDIUM],
        required: true,
        dependencies: [],
        options: [
          { id: 'opt1', value: 'none', text: 'No formal tracking', score: 0 },
          { id: 'opt2', value: 'basic', text: 'Basic tracking for some patients', score: 3 },
          { id: 'opt3', value: 'consistent', text: 'Consistent tracking for all patients', score: 7 },
          { id: 'opt4', value: 'comprehensive', text: 'Comprehensive system with regular analysis', score: 10 }
        ]
      },
      {
        id: 'q2',
        text: 'What is your patient satisfaction rate?',
        type: QuestionType.MULTIPLE_CHOICE,
        moduleId: 'module1',
        weight: 1,
        category: AssessmentCategory.OPERATIONS,
        applicableDisciplines: [DisciplineType.PHYSIOTHERAPY],
        universalQuestion: true,
        applicablePracticeSizes: [PracticeSize.SMALL, PracticeSize.MEDIUM],
        required: true,
        dependencies: [],
        options: [
          { id: 'opt5', value: 'low', text: 'Below 70%', score: 0 },
          { id: 'opt6', value: 'medium', text: '70-85%', score: 5 },
          { id: 'opt7', value: 'high', text: '85-95%', score: 8 },
          { id: 'opt8', value: 'excellent', text: 'Above 95%', score: 10 }
        ]
      }
    ],
    weight: 1,
    metadata: { category: AssessmentCategory.OPERATIONS }
  }
];

test('complete assessment flow', async ({ page }) => {
  await page.goto('/assessment');

  // Start assessment
  await page.click('button[data-testid="start-assessment"]');

  // Answer first question
  await page.click('input[value="comprehensive"]');
  await page.click('button[data-testid="next-question"]');

  // Answer second question
  await page.click('input[value="excellent"]');
  await page.click('button[data-testid="next-question"]');

  // Verify completion
  await expect(page.locator('text=Assessment Complete')).toBeVisible();
  await expect(page.locator('text=View Results')).toBeVisible();
}); 