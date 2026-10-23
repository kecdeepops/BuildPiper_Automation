import { Page, Locator, expect } from '@playwright/test';

export class RepositoryPage {

  readonly page: Page;

  // =====================================================
  // NAVIGATION
  // =====================================================

  readonly integrationTab: Locator;
  readonly repoIntegrationTab: Locator;

  // =====================================================
  // REPOSITORY LIST
  // =====================================================

  readonly addRepoButton: Locator;

  // =====================================================
  // CODE REPOSITORY INTEGRATIONS
  // =====================================================

  readonly githubOption: Locator;

  // =====================================================
  // GITHUB REPOSITORY FORM
  // =====================================================

  readonly repoNameInput: Locator;
  readonly credentialInput: Locator;
  readonly urlInput: Locator;
  readonly viewPermissionInput: Locator;
  readonly writePermissionInput: Locator;

  // =====================================================
  // BUTTONS
  // =====================================================

  readonly testConnectionButton: Locator;
  readonly saveButton: Locator;

  // =====================================================
  // ERROR
  // =====================================================

  readonly permissionError: Locator;

  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(page: Page) {

    this.page = page;

    // =====================================================
    // MAIN NAVIGATION
    // =====================================================

    this.integrationTab = page.getByText(
      'Integration',
      {
        exact: true
      }
    );

    // =====================================================
    // INTEGRATION SUB MENU
    // =====================================================

    this.repoIntegrationTab = page.getByText(
      'Repo Integration',
      {
        exact: true
      }
    );

    // =====================================================
    // REPOSITORY LIST
    // =====================================================

    this.addRepoButton = page.getByRole(
      'button',
      {
        name: /ADD REPO/i
      }
    );

    // =====================================================
    // CODE REPOSITORY INTEGRATION
    // =====================================================

    this.githubOption = page.locator(
      'a[href="/repo/github/add"]'
    );

    // =====================================================
    // GITHUB REPOSITORY FORM
    // =====================================================

    this.repoNameInput = page.getByTestId(
      'name'
    );

    this.credentialInput = page.locator(
      '#credential_id'
    );

    this.urlInput = page.getByTestId(
      'git_url'
    );

    this.viewPermissionInput = page.getByTestId(
      'read_user_groups1-input'
    );

    this.writePermissionInput = page.getByTestId(
      'write_user_groups1-input'
    );

    // =====================================================
    // TEST CONNECTION BUTTON
    // =====================================================

    this.testConnectionButton = page.getByRole(
      'button',
      {
        name: /TEST CONNECTION/i
      }
    );

    // =====================================================
    // SAVE BUTTON
    // =====================================================

    this.saveButton = page
      .locator('button')
      .filter({
        hasText: /^\s*SAVE\s*$/i
      })
      .first();

    // =====================================================
    // PERMISSION ERROR
    // =====================================================

    this.permissionError = page.getByText(
      /You don’t have permission to view repositories/i
    );
  }

  // =====================================================
  // OPEN REPOSITORY INTEGRATION
  //
  // Flow:
  // Cluster Dashboard
  //      ↓
  // Integration
  //      ↓
  // Repo Integration
  //      ↓
  // Repository List
  // =====================================================

  async openRepositoryIntegration(): Promise<void> {

    // -----------------------------------------------------
    // 1. OPEN CLUSTER DASHBOARD
    // -----------------------------------------------------

    console.log(
      'Opening Cluster Dashboard...'
    );

    await this.page.goto(
      '/ClusterDashboard',
      {
        waitUntil: 'domcontentloaded'
      }
    );

    await expect(
      this.page
    ).toHaveURL(
      /ClusterDashboard/,
      {
        timeout: 30000
      }
    );

    console.log(
      'Cluster Dashboard opened:',
      this.page.url()
    );

    // -----------------------------------------------------
    // 2. CLICK INTEGRATION
    // -----------------------------------------------------

    console.log(
      'Clicking Integration...'
    );

    await expect(
      this.integrationTab
    ).toBeVisible({
      timeout: 30000
    });

    await this.integrationTab.click();

    console.log(
      'Integration clicked'
    );

    // -----------------------------------------------------
    // 3. CLICK REPO INTEGRATION
    // -----------------------------------------------------

    console.log(
      'Opening Repo Integration...'
    );

    await expect(
      this.repoIntegrationTab
    ).toBeVisible({
      timeout: 30000
    });

    await this.repoIntegrationTab.click();

    // -----------------------------------------------------
    // 4. WAIT FOR REPOSITORY LIST
    // -----------------------------------------------------

    await this.page.waitForURL(
      '**/repo/list',
      {
        timeout: 30000
      }
    );

    console.log(
      'Repo Integration page opened:',
      this.page.url()
    );

    // -----------------------------------------------------
    // 5. WAIT FOR PAGE TO LOAD
    // -----------------------------------------------------

    await this.page
      .waitForLoadState(
        'domcontentloaded'
      )
      .catch(() => {});

    await this.page.waitForTimeout(
      2000
    );

    // -----------------------------------------------------
    // 6. CHECK PERMISSION ERROR
    // -----------------------------------------------------

    if (
      await this.permissionError
        .isVisible()
        .catch(() => false)
    ) {

      throw new Error(
        'Repository page returned 500: You don’t have permission to view repositories.'
      );
    }

    // -----------------------------------------------------
    // 7. WAIT FOR ADD REPO
    // -----------------------------------------------------

    await expect(
      this.addRepoButton
    ).toBeVisible({
      timeout: 30000
    });

    console.log(
      'ADD REPO button is visible'
    );
  }

  // =====================================================
  // CLICK ADD REPO
  // =====================================================

  async clickAddRepo(): Promise<void> {

    console.log(
      'Clicking ADD REPO...'
    );

    await expect(
      this.addRepoButton
    ).toBeVisible({
      timeout: 30000
    });

    await this.addRepoButton.click();

    // -----------------------------------------------------
    // WAIT FOR CODE REPOSITORY INTEGRATIONS
    // -----------------------------------------------------

    await expect(
      this.page.getByText(
        'Code Repos Integrations',
        {
          exact: true
        }
      )
    ).toBeVisible({
      timeout: 30000
    });

    console.log(
      'Code Repos Integrations opened'
    );
  }

  // =====================================================
  // SELECT GITHUB
  // =====================================================

  async selectGitHub(): Promise<void> {

    console.log(
      'Selecting GitHub...'
    );

    await expect(
      this.githubOption
    ).toBeVisible({
      timeout: 30000
    });

    await this.githubOption.click();

    // -----------------------------------------------------
    // WAIT FOR GITHUB FORM URL
    // -----------------------------------------------------

    await this.page.waitForURL(
      '**/repo/github/add',
      {
        timeout: 30000
      }
    );

    // -----------------------------------------------------
    // WAIT FOR FORM
    // -----------------------------------------------------

    await expect(
      this.repoNameInput
    ).toBeVisible({
      timeout: 30000
    });

    console.log(
      'GitHub form opened:',
      this.page.url()
    );
  }

  // =====================================================
  // VERIFY SAVE BUTTON BEFORE FILLING FORM
  // =====================================================

  async verifySaveButtonExists(): Promise<void> {

    console.log(
      'Checking SAVE button before filling form...'
    );

    await expect(
      this.saveButton
    ).toBeVisible({
      timeout: 30000
    });

    console.log(
      'SAVE button exists and is visible'
    );
  }

  // =====================================================
  // ENTER REPOSITORY NAME
  // =====================================================

  async enterRepoName(
    name: string
  ): Promise<void> {

    await expect(
      this.repoNameInput
    ).toBeVisible({
      timeout: 30000
    });

    await this.repoNameInput.fill(
      name
    );

    console.log(
      'Repository name entered:',
      name
    );
  }

  // =====================================================
  // SELECT CREDENTIAL
  // =====================================================

  async selectCredential(
    credential: string
  ): Promise<void> {

    await expect(
      this.credentialInput
    ).toBeVisible({
      timeout: 30000
    });

    await this.credentialInput.fill(
      credential
    );

    // -----------------------------------------------------
    // WAIT FOR DROPDOWN OPTION
    // -----------------------------------------------------

    const option = this.page
      .getByRole(
        'option',
        {
          name: credential,
          exact: true
        }
      )
      .first();

    await expect(
      option
    ).toBeVisible({
      timeout: 10000
    });

    await option.click();

    console.log(
      'Credential selected:',
      credential
    );
      // =====================================================
  // REMOVE FOCUS FROM CREDENTIAL DROPDOWN
  // =====================================================

  await this.page.locator('body').click({
    position: { x: 10, y: 10 }
  });
await this.credentialInput.press('Escape');

  console.log(
    'Focus removed from Credential dropdown'
  );
  }

  // =====================================================
  // ENTER REPOSITORY URL
  // =====================================================

  async enterUrl(
    url: string
  ): Promise<void> {

    await expect(
      this.urlInput
    ).toBeVisible({
      timeout: 30000
    });

    await this.urlInput.fill(
      url
    );

    console.log(
      'Repository URL entered:',
      url
    );
  }

  // =====================================================
  // SELECT VIEW PERMISSION
  // =====================================================

  async selectViewPermission(
    group: string
  ): Promise<void> {

    await expect(
      this.viewPermissionInput
    ).toBeVisible({
      timeout: 30000
    });

    console.log(
      'Selecting View Permission:',
      group
    );

    await this.viewPermissionInput.fill(
      group
    );

    // -----------------------------------------------------
    // WAIT FOR OPTION
    // -----------------------------------------------------

    const option = this.page
      .getByRole(
        'option',
        {
          name: group,
          exact: true
        }
      )
      .first();

    await expect(
      option
    ).toBeVisible({
      timeout: 1000
    });

    // -----------------------------------------------------
    // SELECT OPTION
    // -----------------------------------------------------

    await option.click();

    console.log('View permission selected:',
      group
    );
    
  }

  // =====================================================
  // SELECT WRITE PERMISSION
  // =====================================================

  async selectWritePermission(
    group: string
  ): Promise<void> {

    await expect(
      this.writePermissionInput
    ).toBeVisible({
      timeout: 30000
    });

    console.log(
      'Selecting Write Permission:',
      group
    );

    await this.writePermissionInput.fill(
      group
    );

    // -----------------------------------------------------
    // WAIT FOR OPTION
    // -----------------------------------------------------

    const option = this.page
      .getByRole(
        'option',
        {
          name: group,
          exact: true
        }
      )
      .first();

    await expect(
      option
    ).toBeVisible({
      timeout: 10000
    });

    // -----------------------------------------------------
    // SELECT OPTION
    // -----------------------------------------------------

    await option.click();
await this.credentialInput.press('Escape');

    console.log(
      'Write permission selected:',
      group
    );
  }

  // =====================================================
  // TEST CONNECTION
  // =====================================================

  async testConnection(): Promise<void> {

    console.log(
      'Clicking TEST CONNECTION...'
    );

    await expect(
      this.testConnectionButton
    ).toBeVisible({
      timeout: 30000
    });

    await expect(
      this.testConnectionButton
    ).toBeEnabled({
      timeout: 30000
    });

    await this.testConnectionButton.click();

    console.log(
      'TEST CONNECTION clicked'
    );

    // -----------------------------------------------------
    // WAIT FOR APPLICATION RESPONSE
    // -----------------------------------------------------

    await this.page.waitForTimeout(
      3000
    );

    console.log(
      'TEST CONNECTION response processed'
    );
  }

  // =====================================================
  // SAVE REPOSITORY
  // =====================================================

  async saveRepository(): Promise<void> {

    console.log(
      'Looking for SAVE button...'
    );

    // -----------------------------------------------------
    // WAIT FOR SAVE BUTTON
    // -----------------------------------------------------

    await expect(
      this.saveButton
    ).toBeVisible({
      timeout: 30000
    });

    console.log(
      'SAVE button found'
    );

    // -----------------------------------------------------
    // WAIT UNTIL ENABLED
    // -----------------------------------------------------

    await expect(
      this.saveButton
    ).toBeEnabled({
      timeout: 30000
    });

    console.log(
      'SAVE button enabled'
    );

    // -----------------------------------------------------
    // CLICK SAVE
    // -----------------------------------------------------

    await this.saveButton.click();

    console.log(
      'SAVE button clicked'
    );
  }
}