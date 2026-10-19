import { test, expect } from '../../../src/fixtures/ui.fixture';
import path from 'node:path';

test.setTimeout(180_000);

test(
    'Create cluster and perform Namespace CRUD @cluster @namespace @crud @regression',
    async ({ pageManager }) => {

        const clusterName =
            `automation_created_cluster_${Date.now()}`;

        const namespaceName =
            `automation-test-ns-${Date.now()}`;

        const updatedNamespaceName =
            `${namespaceName}-updated`;

        const kubeConfigPath =
            path.resolve(
                'test-data/kubeconfig/cluster.yaml'
            );

        // =====================================================
        // 1. CREATE CLUSTER
        // =====================================================

        await pageManager.clusterWorkflow
            .openClusterCreationPage();

        await pageManager.clusterWorkflow
            .enterClusterName(
                clusterName
            );

        await pageManager.clusterWorkflow
            .uploadKubeConfig(
                kubeConfigPath
            );

        await pageManager.clusterWorkflow
            .selectInfrastructureProvider(
                'LDC'
            );

        await pageManager.clusterWorkflow
            .applyClusterManifest();

        await pageManager.clusterWorkflow
            .verifyClusterOnboardingSuccessful();

        await pageManager.clusterWorkflow
            .finishClusterSetup();

        // =====================================================
        // 2. OPEN CLUSTER DASHBOARD
        // =====================================================

        await pageManager.clusterWorkflow
            .openClusterDashboard();

        // =====================================================
        // 3. WAIT UNTIL CLUSTER IS CONNECTED
        // =====================================================

       

        // =====================================================
        // 4. GET DYNAMIC CLUSTER ID
        // =====================================================

        const clusterId =
            await pageManager.clusterWorkflow
                .getClusterId(
                    clusterName
                );

        console.log(
            `Created Cluster: ${clusterName}`
        );

        console.log(
            `Cluster ID: ${clusterId}`
        );

        // =====================================================
        // 5. OPEN NAMESPACE CREATION PAGE
        // =====================================================

        await pageManager.namespaceWorkflow
            .openNamespaceCreationPage(
                clusterId
            );

        // =====================================================
        // 6. CREATE NAMESPACE
        // =====================================================

        await pageManager.namespaceWorkflow
            .enterNamespaceName(
                namespaceName
            );

        await pageManager.namespaceWorkflow
            .selectRegistry(
                'testing'
            );

        await pageManager.namespaceWorkflow
            .applyManifest();

        await pageManager.namespaceWorkflow
            .verifyNamespaceDeploymentSuccessful();

        await pageManager.namespaceWorkflow
            .continueAfterDeployment();

        // =====================================================
        // 7. VERIFY NAMESPACE ACTIVE
        // =====================================================

        await pageManager.namespaceWorkflow
            .verifyNamespaceActive(
                namespaceName
            );

        // =====================================================
        // 8. OPEN NAMESPACE DETAILS
        // =====================================================

        await pageManager.namespaceWorkflow
            .openNamespaceDetails(
                namespaceName
            );

        // =====================================================
        // 9. EDIT NAMESPACE
        // =====================================================

        await pageManager.namespaceWorkflow
            .clickEditNamespace();

        await pageManager.namespaceWorkflow
            .updateNamespaceName(
                updatedNamespaceName
            );

        await pageManager.namespaceWorkflow
            .applyManifest();

        await pageManager.namespaceWorkflow
            .verifyNamespaceDeploymentSuccessful();

        await pageManager.namespaceWorkflow
            .continueAfterDeployment();

        // =====================================================
        // 10. VERIFY UPDATED NAMESPACE
        // =====================================================

        await pageManager.namespaceWorkflow
            .verifyNamespaceActive(
                updatedNamespaceName
            );

        // =====================================================
        // 11. DELETE NAMESPACE
        // =====================================================

        await pageManager.namespaceWorkflow
            .openNamespaceDetails(
                updatedNamespaceName
            );

        await pageManager.namespaceWorkflow
            .clickDeleteNamespace();

        await pageManager.namespaceWorkflow
            .enterDeleteReason(
                'Automation test cleanup'
            );

        await pageManager.namespaceWorkflow
            .deleteNamespaceFromBPAndK8S();

        // =====================================================
        // 12. VERIFY NAMESPACE DELETED
        // =====================================================

        await pageManager.namespaceWorkflow
            .verifyNamespaceDeleted(
                updatedNamespaceName
            );
    }
);