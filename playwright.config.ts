import { defineConfig, devices } from '@playwright/test';
import { config } from './config/config';

export default defineConfig({

  testDir: './tests',

  // Keep tests sequential for application stability
  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  // Single worker
  workers: 1,

  reporter: [
    ['list'],

    [
      'allure-playwright',
      {
        detail: true,
        resultsDir: 'allure-results',
        suiteTitle: false,
      },
    ],
  ],

  use: {
    baseURL: config.baseUrl,

    trace: 'on-first-retry',

    screenshot: 'only-on-failure',

    video: 'retain-on-failure',

    headless: false,
  },

  projects: [

    // =====================================================
    // AUTHENTICATION SETUP
    // =====================================================

    {
      name: 'setup',

      testMatch: /.*auth\.setup\.ts/,
    },

    // =====================================================
    // CHROMIUM UI TESTS
    // =====================================================

    {
      name: 'chromium',

      use: {
        ...devices['Desktop Chrome'],

        // Reuse authenticated session
        storageState: 'playwright/.auth/user.json',
      },

      dependencies: ['setup'],
    },
  ],
});