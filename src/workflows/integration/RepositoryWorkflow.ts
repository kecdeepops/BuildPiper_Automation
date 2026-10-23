import { RepositoryPage } from '../../pages/RepositoryPage';

export class RepositoryWorkflow {

  constructor(
    private readonly repositoryPage: RepositoryPage
  ) {}

  async createGitHubRepository(
    repoName: string,
    credential: string,
    repoUrl: string,
    viewPermission: string,
    writePermission: string
  ): Promise<void> {

    // 1. Open Repository Integration
    await this.repositoryPage.openRepositoryIntegration();

    // 2. Click ADD REPO
    await this.repositoryPage.clickAddRepo();

    // 3. Select GitHub
    await this.repositoryPage.selectGitHub();

    // 4. IMPORTANT:
    // Verify SAVE exists BEFORE entering any data
    await this.repositoryPage.verifySaveButtonExists();

    // 5. Fill repository name
    await this.repositoryPage.enterRepoName(repoName);

    // 6. Select credential
    await this.repositoryPage.selectCredential(
      credential
    );

    // 7. Enter repository URL
    await this.repositoryPage.enterUrl(
      repoUrl
    );

    // 8. Select view permission
    await this.repositoryPage.selectViewPermission(
      viewPermission
    );

    // 9. Select write permission
    await this.repositoryPage.selectWritePermission(
      writePermission
    );

    // 10. Test connection
    await this.repositoryPage.testConnection();
    // 11. Save repository
    await this.repositoryPage.saveRepository();
  }
}