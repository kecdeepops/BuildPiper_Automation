import { test } from '../../src/fixtures/ui.fixture';

test.setTimeout(120_000);

test(
  'Onboard GitHub repository successfully',
  async ({ pageManager }) => {

    const repoName =
      `automation-github-${Date.now()}`;

    const credential =
      'sid-git-creds';

    const repoUrl =
      'https://github.com/kecdeepops/BuildPiper_Automation';

    const permissionGroup =
      'Super_Admin';

    console.log(
      'Repository name:',
      repoName
    );

    await test.step(
      'Onboard GitHub repository',
      async () => {

        await pageManager
          .repositoryWorkflow
          .createGitHubRepository(
            repoName,
            credential,
            repoUrl,
            permissionGroup,
            permissionGroup
          );
      }
    );
  }
);