import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {

    private emailInput: Locator;
    private passwordInput: Locator;
    private loginButton: Locator;

    constructor(page: Page) {
        super(page);

        this.emailInput = this.page.locator('input[name="email"]');

        this.passwordInput = this.page.locator('input[type="password"]');

        this.loginButton = this.page.getByRole('button', {
            name: 'Login'
        });
    }

    async login(username: string, password: string) {
        await this.emailInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}