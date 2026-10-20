import { ClusterDashboardPage } from '../../pages/ClusterDashboardPage';
import { ClusterCreationPage } from '../../pages/ClusterCreationPage';
import { NodesPage } from '../../pages/NodesPage';

export class ClusterWorkflow {

    constructor(
        private clusterDashboardPage: ClusterDashboardPage,
        private clusterCreationPage: ClusterCreationPage,
        private nodesPage: NodesPage
    ) {}

    // =====================================================
    // CLUSTER DASHBOARD
    // =====================================================

    async openClusterDashboard(): Promise<void> {
        await this.clusterDashboardPage.open();
    }

    async verifyClusterDashboardDisplayed(): Promise<void> {
        await this.clusterDashboardPage
            .verifyDashboardDisplayed();
    }

    async getClusterCellValue(
        clusterName: string,
        columnName: string
    ): Promise<string> {

        return await this.clusterDashboardPage
            .getCellValue(
                clusterName,
                columnName
            );
    }

    async goToNextPage(): Promise<void> {

        await this.clusterDashboardPage
            .goToNextPage();
    }

    async getPaginationRange(): Promise<string> {

        return await this.clusterDashboardPage
            .getPaginationRange();
    }

    async getClusterCellValueAcrossPages(
        clusterName: string,
        columnName: string
    ): Promise<string> {

        return await this.clusterDashboardPage
            .findCellValueAcrossPages(
                clusterName,
                columnName
            );
    }

    // =====================================================
    // CLUSTER CREATION
    // =====================================================

    async openClusterCreationPage(): Promise<void> {

        await this.clusterCreationPage.open();
    }

    async enterClusterName(
        clusterName: string
    ): Promise<void> {

        await this.clusterCreationPage
            .enterClusterName(clusterName);
    }

    async uploadKubeConfig(
        filePath: string
    ): Promise<void> {

        await this.clusterCreationPage
            .uploadKubeConfig(filePath);
    }

    async selectInfrastructureProvider(
        provider: string
    ): Promise<void> {

        await this.clusterCreationPage
            .selectInfrastructureProvider(provider);
    }

    async applyClusterManifest(): Promise<void> {

        await this.clusterCreationPage
            .applyManifest();
    }

    async verifyClusterOnboardingSuccessful(): Promise<void> {

        await this.clusterCreationPage
            .verifyOnboardingSuccessful();
    }

    async finishClusterSetup(): Promise<void> {

        await this.clusterCreationPage
            .finishSetup();
    }

    // =====================================================
    // CLUSTER ID
    // =====================================================

    async getClusterId(
        clusterName: string
    ): Promise<string> {

        return await this.clusterDashboardPage
            .getClusterId(clusterName);
    }

    // =====================================================
    // CLUSTER DELETE
    // =====================================================

    async deleteCluster(
        clusterName: string,
        reason: string
    ): Promise<void> {

        await this.clusterDashboardPage
            .deleteCluster(
                clusterName,
                reason
            );
    }

    // =====================================================
    // CLUSTER EXISTENCE
    // =====================================================

    async hasCluster(
        clusterName: string
    ): Promise<boolean> {

        return this.clusterDashboardPage
            .hasCluster(clusterName);
    }

    // =====================================================
    // WAIT FOR CLUSTER CONNECTED
    // =====================================================

    async waitForClusterConnected(
        clusterName: string,
        timeout: number = 120_000
    ): Promise<void> {

        await this.clusterDashboardPage
            .waitForClusterConnected(
                clusterName,
                timeout
            );
    }

    // =====================================================
    // NODES
    // =====================================================

    async openNodesAvailable(): Promise<void> {

        await this.nodesPage.open();
    }

    async verifyNodesPageDisplayed(): Promise<void> {

        await this.nodesPage
            .verifyNodesPageDisplayed();
    }

    async verifyNodeListDisplayed(): Promise<void> {

        await this.nodesPage
            .verifyNodeListDisplayed();
    }

    async getFirstNodeName(): Promise<string> {

        return await this.nodesPage
            .getFirstNodeName();
    }

    async getFirstNodeStatus(): Promise<string> {

        return await this.nodesPage
            .getFirstNodeStatus();
    }

    async verifyFirstNodeHasData(): Promise<void> {

        await this.nodesPage
            .verifyFirstNodeHasData();
    }

async getFirstAvailableCluster(): Promise<{
    name: string;
    id: string;
}> {
    return await this.clusterDashboardPage
        .getFirstAvailableCluster();
}

}