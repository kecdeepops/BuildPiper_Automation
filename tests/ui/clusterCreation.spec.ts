
import { test, expect } from '../../src/fixtures/ui.fixture';
import path from 'node:path';

test('Create Kubernetes cluster successfully', async ({ pageManager }) => {
    const clusterName = `automation_created_cluster_${Date.now()}`;

    const kubeConfigPath = path.resolve(
        'test-data/kubeconfig/cluster.yaml'
    );

    // Open the cluster creation page.
    await pageManager.clusterWorkflow.openClusterCreationPage();

    // Enter the unique cluster name.
    await pageManager.clusterWorkflow.enterClusterName(clusterName);

    // Upload the Kubernetes configuration.
    await pageManager.clusterWorkflow.uploadKubeConfig(kubeConfigPath);

    // Select the infrastructure provider.
    await pageManager.clusterWorkflow.selectInfrastructureProvider('LDC');

    // Submit the real cluster onboarding request.
    await pageManager.clusterWorkflow.applyClusterManifest();

    // Verify onboarding and finish setup.
    await pageManager.clusterWorkflow.verifyClusterOnboardingSuccessful();
    await pageManager.clusterWorkflow.finishClusterSetup();

    // Open the dashboard and verify the cluster status.
    await pageManager.clusterWorkflow.openClusterDashboard();

    const status =
        await pageManager.clusterWorkflow.getClusterCellValueAcrossPages(
            clusterName,
            'STATUS'
        );

    expect(status.trim()).toBe('Connected');
});
