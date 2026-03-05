import { defineConfig, devices } from '@playwright/test'

/**
 * KCD Best Practice: E2E tests at the top of the Testing Trophy.
 *
 * E2E tests give the most confidence but are slowest.
 * Use them sparingly for critical user flows.
 * The app runs with MSW (VITE_MOCK_API=true) so E2E tests
 * are deterministic and don't depend on external services.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'VITE_MOCK_API=true npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
