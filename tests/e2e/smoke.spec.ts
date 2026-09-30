import { expect, test } from '@playwright/test';

test('plays the hello mission from briefing to debrief', async ({ page }) => {
  await page.goto('/?seed=42');
  await page.getByRole('button', { name: 'Start the mission' }).click();

  // Step 1: the best answer, wherever the shuffle put it.
  await page.getByRole('button', { name: 'Suspend the procedure and refer it' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  // Step 2: a merely acceptable answer, so the debrief has something to explain.
  await page.getByRole('button', { name: 'Record his arguments in the minutes verbatim' }).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page.getByText('Debrief')).toBeVisible();
  await expect(page.getByText(/Preferred: Ask everyone to restate/)).toBeVisible();
  await expect(page.getByRole('link', { name: /Art\. 24/ }).first()).toBeVisible();
  await expect(page.getByText(/Red flag/)).toHaveCount(0);
});
