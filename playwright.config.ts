import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;

/**
 * Runs against the production bundle, not the dev server, so it exercises what ships.
 * Bound to 127.0.0.1 explicitly: on CI runners `localhost` resolves to ::1 first (lesson
 * carried over from publicadmin's playwright.config.ts).
 */
export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: { baseURL: `http://127.0.0.1:${PORT}`, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run build && npm run preview -- --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
