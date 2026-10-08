import { defineConfig, devices } from '@playwright/test';
import { config } from './config/config';

export default defineConfig({

    testDir: './tests',

    fullyParallel: true,

    forbidOnly: !!process.env.CI,

    retries: process.env.CI ? 2 : 0,

    workers: process.env.CI ? 1 : undefined,

    reporter: 'html',

    use: {
        baseURL: config.baseUrl,

        trace: 'on-first-retry',

        screenshot: 'only-on-failure',

        video: 'retain-on-failure',
    },

    projects: [

        // 1. Authentication setup
        {
            name: 'setup',

            testMatch: /.*auth\.setup\.ts/,
        },

        // 2. Actual UI tests
        {
            name: 'chromium',

            use: {
                ...devices['Desktop Chrome'],

                storageState: 'playwright/.auth/user.json',
            },

            dependencies: ['setup'],
        },
    ],
});