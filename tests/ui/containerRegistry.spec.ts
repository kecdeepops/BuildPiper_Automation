
import { test } from '../../src/fixtures/ui.fixture';
import { PageManager } from '../../src/pages/PageManager';

test('Create Azure Registry and debug Namespace page', async ({ page }) => {
    const pages = new PageManager(page);

    // Step 1: Create Registry
    const registryName = `automation_azure_${Date.now()}`;
console.log('Registry name submitted:', registryName);
    await test.step('Create Azure Container Registry', async () => {
        await pages.containerRegistryWorkflow.createRegistry(
            'Azure',
            registryName,
            'https://automation-registry.example.com',
            'azureuser',
            'azurepassword123#'
        );
    });

    // Step 2: Open Cluster Dashboard
    await test.step('Find cluster and capture Namespace DOM', async () => {
        await pages.clusterWorkflow.openClusterDashboard();

        await pages.clusterWorkflow.verifyClusterDashboardDisplayed();

await pages.clusterWorkflow.openClusterDashboard();

await pages.clusterWorkflow.verifyClusterDashboardDisplayed();

const cluster = await pages.clusterWorkflow.getFirstAvailableCluster();

console.log('Selected Cluster:', cluster.name);
console.log('Selected Cluster ID:', cluster.id);
await pages.namespaceWorkflow.openNamespaceCreationPage(cluster.id);

await pages.namespaceWorkflow.selectRegistry(registryName);
    });
});
