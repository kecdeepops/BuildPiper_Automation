import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContainerRegistryPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // =====================================================
    // Open Container Registries Page
    // =====================================================

    async open(): Promise<void> {
        await this.navigate('/integration/containerRegistries');
    }

    // =====================================================
    // Verify Container Registries Page
    // =====================================================

    // =====================================================
    // Click Add Registry
    // =====================================================

    async clickAddRegistry(): Promise<void> {
        await this.page.getByRole('link', {
            name: /ADD A REGISTRY/i
        }).click();
    }

    // =====================================================
    // Select Registry Type
    // =====================================================

    async selectRegistryType(
        type: string
    ): Promise<void> {

        await this.page.getByText(type, {
            exact: true
        }).click();
    }

    // =====================================================
    // Enter Registry Name
    // =====================================================

   async enterRegistryName(name: string): Promise<void> {

    const registryNameInput = this.page.locator(
        'input'
    ).first();

    await expect(registryNameInput).toBeVisible({
        timeout: 10000
    });

    await registryNameInput.fill(name);
}

    // =====================================================
    // Enter Registry URL
    // =====================================================
async enterRegistryUrl(url: string): Promise<void> {

    const urlInput = this.page.locator('input').nth(1);

    await expect(urlInput).toBeVisible({
        timeout: 10000
    });

    await urlInput.fill(url);
}



    // =====================================================
    // Click Save
    // =====================================================
async verifyPageDisplayed(): Promise<void> {

    console.log('Current URL:', this.page.url());

    console.log(
        'Body text:',
        await this.page.locator('body').innerText()
    );

}
  // =====================================================
// Enter Username
// =====================================================

async enterUsername(username: string): Promise<void> {

    await this.page.getByRole('textbox', {
        name: /Username/i
    }).fill(username);
}

// =====================================================
// Enter Password
// =====================================================

async enterPassword(password: string): Promise<void> {

    await this.page.getByRole('textbox', {
        name: /Password/i
    }).fill(password);
}

// =====================================================
// Click Save
// =====================================================

async clickSave(): Promise<void> {

    await this.page.getByRole('button', {
        name: /SAVE/i
    }).click();
}
}