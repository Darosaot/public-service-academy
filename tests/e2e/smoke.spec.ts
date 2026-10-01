import { expect, test } from '@playwright/test';

test('plays the hello mission from briefing to debrief, with the law behind each grade', async ({
  page,
}) => {
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
  await expect(page.getByText(/Red flag/)).toHaveCount(0);

  // Every graded decision shows the EU rule and the Spanish transposition, deep-linked.
  const directive = page.getByRole('link', { name: /Dir\. 2014\/24\/EU, art\. 24/ }).first();
  await expect(directive).toHaveAttribute(
    'href',
    'https://eur-lex.europa.eu/eli/dir/2014/24/oj/eng#art_24',
  );
  const lcsp = page.getByRole('link', { name: /LCSP, art\. 64/ }).first();
  await expect(lcsp).toHaveAttribute(
    'href',
    'https://www.boe.es/buscar/act.php?id=BOE-A-2017-12902#a6-6',
  );

  // And a way from the decision into the process map.
  await page
    .getByRole('button', { name: '6. Ranking, collusion checks and award' })
    .first()
    .click();
  await expect(page.getByRole('heading', { name: 'Public procurement, stage by stage' })).toBeVisible();
  await expect(page.locator('#stage-award')).toHaveClass(/stage--focus/);
  await expect(page.locator('#stage-award')).toContainText('Two problems before Friday');

  // The mission is still there when you go back.
  await page.getByRole('button', { name: 'Mission' }).click();
  await expect(page.getByText('Debrief')).toBeVisible();
});

test('the legislation page carries the concordance table', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Legislation & process' }).click();
  const table = page.getByRole('table');
  await expect(table).toContainText('Conflicts of interest');
  await expect(table).toContainText('Lucha contra la corrupción');
});
