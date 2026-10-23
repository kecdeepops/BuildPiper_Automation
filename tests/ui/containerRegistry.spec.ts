import { test } from '../../src/fixtures/ui.fixture';
import { PageManager } from '../../src/pages/PageManager';
test.setTimeout(150_000);

test('Create Azure Registry and deploy Namespace', async ({ page }) => {
    const pages = new PageManager(page);

    const registryName = `automation-azure-${Date.now()}`;
    const namespaceName = `automation-ns-${Date.now()}`;

    console.log('Registry name:', registryName);
    console.log('Namespace name:', namespaceName);

    await test.step('Create Azure Container Registry', async () => {
        await pages.containerRegistryWorkflow.createRegistry(
            'Azure',
            registryName,
            'https://automation-registry.example.com',
            'azureuser',
            'azurepassword123#'
        );
    });

    await test.step('Open cluster and create namespace', async () => {
        await pages.clusterWorkflow.openClusterDashboard();
        await pages.clusterWorkflow.verifyClusterDashboardDisplayed();

        const cluster =
            await pages.clusterWorkflow.getFirstAvailableCluster();

        console.log('Selected Cluster:', cluster.name);
        console.log('Selected Cluster ID:', cluster.id);

        await pages.namespaceWorkflow.openNamespaceCreationPage(
            cluster.id
        );

        await pages.namespaceWorkflow.createNamespace(
            namespaceName,
            registryName
        );
    });

    await test.step('Verify namespace deployment', async () => {
        await pages.namespaceWorkflow.verifyNamespaceDeploymentSuccessful();

        console.log('Namespace deployment verified:', namespaceName);
    });
});
