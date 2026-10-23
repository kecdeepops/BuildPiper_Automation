import { test as setup, expect } from '@playwright/test';
import { config } from '../../config/config';
import { LoginPage } from '../../src/pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('authenticate user', async ({ page }) => {

  const loginPage = new LoginPage(page);

  // Open login page
  await loginPage.navigate('/login');

  console.log('Opening URL:', page.url());

  // Login
  await loginPage.login(
    config.username,
    config.password
  );

  // Verify login
  await expect(page).toHaveURL(
    /ClusterDashboard/,
    {
      timeout: 30000
    }
  );

  console.log(
    'Login successful:',
    page.url()
  );

  // Save authenticated session
  await page.context().storageState({
    path: authFile
  });

  console.log(
    'Authentication state saved:',
    authFile
  );
});