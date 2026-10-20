import { Page, expect } from '@playwright/test';

export class BasePage {

    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(path: string): Promise<void> {

        console.log(`Opening URL: ${path}`);

        await this.page.goto(path, {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });

        console.log(
            `URL after navigation: ${this.page.url()}`
        );

        console.log(
            `Title after navigation: ${await this.page.title()}`
        );
    }

    async waitForPageLoad(): Promise<void> {

        await this.page.waitForLoadState(
            'domcontentloaded',
            { timeout: 30000 }
        );
    }
}