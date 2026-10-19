import { ClusterDashboardPage } from '../../pages/ClusterDashboardPage';
import { ClusterCreationPage } from '../../pages/ClusterCreationPage';

export class ClusterWorkflow {

    constructor(
        private clusterDashboardPage: ClusterDashboardPage,
        private clusterCreationPage: ClusterCreationPage
    ) {}

    // =========================
    // CLUSTER DASHBOARD
    // =========================

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

    // =========================
    // CLUSTER CREATION
    // =========================

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

    // =========================
    // CLUSTER ID
    // =========================

    async getClusterId(
        clusterName: string
    ): Promise<string> {

        return await this.clusterDashboardPage
            .getClusterId(clusterName);
    }

    // =========================
    // CLUSTER DELETE
    // =========================

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

    // =========================
    // CLUSTER EXISTENCE
    // =========================

    async hasCluster(
        clusterName: string
    ): Promise<boolean> {

        return this.clusterDashboardPage
            .hasCluster(clusterName);
    }
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
}