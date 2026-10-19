import { test } from '../../src/fixtures/ui.fixture';
import { NamespaceCreationPage } from '../../src/pages/NamespaceCreationPage';

test.setTimeout(120_000);

test('Create, Edit and Delete namespace', async ({ page }) => {

    const namespacePage =
        new NamespaceCreationPage(page);

    const namespaceName =
        `automation-test-ns-${Date.now()}`;

    // Cluster ID
    const clusterId =
        'YOUR_CLUSTER_ID';

    // =========================
    // CREATE
    // =========================

    await namespacePage.open(clusterId);

    await namespacePage.enterNamespaceName(
        namespaceName
    );

    await namespacePage.selectRegistry(
        'registryoc'
    );

    await namespacePage.applyManifest();

    await namespacePage.verifyNamespaceDeploymentSuccessful();

    await namespacePage.continueAfterDeployment();


    // =========================
    // SEARCH + VERIFY CREATED
    // =========================

    await namespacePage.searchNamespace(
        namespaceName
    );

    await namespacePage.verifyNamespaceActive(
        namespaceName
    );


    // =========================
    // OPEN NAMESPACE
    // =========================

    await namespacePage.openNamespaceDetails(
        namespaceName
    );


    // =========================
    // EDIT
    // =========================

    await namespacePage.clickEditNamespace();

    // TODO:
    // Update the editable field here.
    //
    // Example:
    // await namespacePage.updateSomething(
    //     'new-value'
    // );


    // Apply updated configuration
    await namespacePage.applyManifest();

    await namespacePage.verifyNamespaceDeploymentSuccessful();

    await namespacePage.continueAfterDeployment();


    // =========================
    // SEARCH AGAIN
    // =========================

    await namespacePage.searchNamespace(
        namespaceName
    );

    await namespacePage.verifyNamespaceActive(
        namespaceName
    );


    // =========================
    // DELETE
    // =========================

    await namespacePage.openNamespaceDetails(
        namespaceName
    );

    await namespacePage.clickDeleteNamespace();

    await namespacePage.enterDeleteReason(
        'Automation test cleanup'
    );

    await namespacePage.deleteNamespace();


    // =========================
    // SEARCH + VERIFY DELETED
    // =========================

    await namespacePage.searchNamespace(
        namespaceName
    );

    await namespacePage.verifyNamespaceDeleted(
        namespaceName
    );
});