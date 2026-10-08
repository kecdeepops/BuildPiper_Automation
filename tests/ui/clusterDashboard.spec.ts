import { test, expect } from '../../src/fixtures/ui.fixture';

test('Verify Kubernetes cluster details', async ({
    pageManager
}) => {

    await pageManager.clusterWorkflow
        .openClusterDashboard();

    const status =
        await pageManager.clusterWorkflow
            .getClusterCellValue(
                'test-community-cluster',
                'STATUS'
            );

    const version =
        await pageManager.clusterWorkflow
            .getClusterCellValue(
                'test-community-cluster',
                'KUBERNETES VERSION'
            );

    const provider =
        await pageManager.clusterWorkflow
            .getClusterCellValue(
                'test-community-cluster',
                'INFRA PROVIDER'
            );

    expect(status.trim()).toBe('Connected');
    expect(version.trim()).toBe('1.32');

    expect(provider.trim())
        .toBe('BAREMETAL(Local Data Center)');
});


test('Verify pagination', async ({ pageManager }) => {

    await pageManager.clusterWorkflow
        .openClusterDashboard();

    const before =
        await pageManager.clusterWorkflow
            .getPaginationRange();

    expect(before).toBe('1 - 10 of 95');

    await pageManager.clusterWorkflow
        .goToNextPage();

    const after =
        await pageManager.clusterWorkflow
            .getPaginationRange();

    expect(after).toBe('11 - 20 of 95');
});

test('Find cluster across pages', async ({ pageManager }) => {

    await pageManager.clusterWorkflow
        .openClusterDashboard();

    const status =
        await pageManager.clusterWorkflow
            .getClusterCellValueAcrossPages(
                'dcr-oct-67',
                'STATUS'
            );

    //expect(status.trim()).toBe('Disconnected');
    expect(status.trim()).toBeTruthy();
});