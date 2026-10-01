import { expect, test } from '@playwright/test';

test('plays mission P2 from briefing to debrief, with the law behind each grade', async ({
  page,
}) => {
  await page.goto('/?seed=42');
  await page.getByRole('button', { name: 'Start the mission' }).click();

  // One acceptable answer first, so the debrief has something to explain; then best answers,
  // wherever the shuffle put them.
  for (const label of [
    'Record his arguments in the minutes verbatim',
    'Score only against the published criteria and weights, with written reasons per bid',
    'Suspend the procedure and refer it',
    'Ask the bidder to justify and break down its price, then get a technical report on the answer',
    'Notify a reasoned award with the score breakdown, publish it, and sign after fifteen working days',
  ]) {
    await page.getByRole('button', { name: label }).click();
    await page.getByRole('button', { name: 'Continue' }).click();
  }

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
  await expect(page.locator('#stage-award')).toContainText('Six bids, four evaluators');

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
