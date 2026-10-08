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

        const pageManager = new PageManager(page);

        await use(pageManager);
    }

});

export { expect };