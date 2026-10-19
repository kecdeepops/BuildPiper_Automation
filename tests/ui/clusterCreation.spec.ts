import { test, expect } from '../../src/fixtures/ui.fixture';
import path from 'node:path';

test.setTimeout(120_000);

test('Create Kubernetes cluster successfully', async ({ pageManager }) => {

    const clusterName =
        `automation_created_cluster_${Date.now()}`;

    const kubeConfigPath = path.resolve(
        'test-data/kubeconfig/cluster.yaml'
    );

    // =========================
    // CREATE CLUSTER
    // =========================

    await pageManager.clusterWorkflow.openClusterCreationPage();

    await pageManager.clusterWorkflow.enterClusterName(
        clusterName
    );

    await pageManager.clusterWorkflow.uploadKubeConfig(
        kubeConfigPath
    );

    await pageManager.clusterWorkflow.selectInfrastructureProvider(
        'LDC'
    );

    await pageManager.clusterWorkflow.applyClusterManifest();

    // =========================
    // VERIFY ONBOARDING
    // =========================

    await pageManager.clusterWorkflow
        .verifyClusterOnboardingSuccessful();

    await pageManager.clusterWorkflow
        .finishClusterSetup();

    // =========================
    // OPEN CLUSTER DASHBOARD
    // =========================

    await pageManager.clusterWorkflow
        .openClusterDashboard();

    // =========================
    // VERIFY CLUSTER STATUS
    // =========================

    const status =
        await pageManager.clusterWorkflow
            .getClusterCellValueAcrossPages(
                clusterName,
                'STATUS'
            );

    //expect(status.trim()).toBe('Connected');

    // =========================
    // GET CREATED CLUSTER ID
    // =========================

    const clusterId =
        await pageManager.clusterWorkflow
            .getClusterId(clusterName);

    console.log(
        'Created Cluster ID:',
        clusterId
    );
});