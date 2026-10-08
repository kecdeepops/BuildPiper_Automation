import { test as setup, expect } from '@playwright/test';
import { config } from '../../config/config';
import { LoginPage } from '../../src/pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('authenticate user', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.navigate('/login');

    await loginPage.login(
        config.username,
        config.password
    );

    await expect(page).toHaveURL(/ClusterDashboard/);

    await page.context().storageState({
        path: authFile
    });
});