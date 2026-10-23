import {
    test as base,
    expect
} from '@playwright/test';

import { PageManager } from '../pages/PageManager';

type UIFixtures = {
    pageManager: PageManager;
};

export const test = base.extend<UIFixtures>({

    pageManager: async ({ page }, use) => {

        // Every UI test starts from the common Dashboard
        await page.goto('/ClusterDashboard');

        await page.waitForLoadState('domcontentloaded');

        const pageManager = new PageManager(page);

        await use(pageManager);
    }

});

export { expect };