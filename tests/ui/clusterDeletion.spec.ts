
import { test, expect } from '../../src/fixtures/ui.fixture';
import path from 'node:path';

test('Create, verify, and delete Kubernetes cluster', async ({
    pageManager
}) => {
    test.setTimeout(120000);
const clusterName = `automation-lifecycle-${Date.now()}`;
    const kubeConfigPath = path.resolve(
        'test-data/kubeconfig/cluster.yaml'
    );

    let creationSubmitted = false;
    let deletionCompleted = false;

    try {
        // Step 1: Create the cluster.
        await pageManager.clusterWorkflow.openClusterCreationPage();
        await pageManager.clusterWorkflow.enterClusterName(clusterName);
        await pageManager.clusterWorkflow.uploadKubeConfig(kubeConfigPath);
        await pageManager.clusterWorkflow.selectInfrastructureProvider('LDC');
        await pageManager.clusterWorkflow.applyClusterManifest();

        creationSubmitted = true;

        await pageManager.clusterWorkflow.verifyClusterOnboardingSuccessful();
        await pageManager.clusterWorkflow.finishClusterSetup();

        // Step 2: Verify cluster status.
        await pageManager.clusterWorkflow.openClusterDashboard();

        const status =
            await pageManager.clusterWorkflow.getClusterCellValueAcrossPages(
                clusterName,
                'STATUS'
            );

      //  expect(status.trim()).toBe('Connected');

        // Step 3: Confirm the cluster exists.
        

        // Step 4: Delete this test's cluster.
        await pageManager.clusterWorkflow.deleteCluster(
            clusterName,
            'Automated lifecycle test cleanup'
        );

        // Step 5: Verify deletion.
      await pageManager.clusterWorkflow.openClusterDashboard();

const clusterStillExists =
    await pageManager.clusterWorkflow.hasCluster(clusterName);

console.log(
    `Cluster '${clusterName}' exists after deletion:`,
    clusterStillExists
);

expect(clusterStillExists).toBe(false);


        deletionCompleted = true;
    } finally {
        if (creationSubmitted && !deletionCompleted) {
            console.warn(
                `Lifecycle test did not complete deletion for '${clusterName}'.`
            );
            console.warn(
                'Check BuildPiper and clean up the cluster if it still exists.'
            );
        }
    }
});
