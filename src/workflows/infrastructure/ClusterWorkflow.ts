import { ClusterDashboardPage } from '../../pages/ClusterDashboardPage';
import { ClusterCreationPage } from '../../pages/ClusterCreationPage';
export class ClusterWorkflow {

    constructor(
    private clusterDashboardPage: ClusterDashboardPage,
    private clusterCreationPage: ClusterCreationPage
) {}

    async openClusterDashboard() {
        await this.clusterDashboardPage.open();
    }

    async verifyClusterDashboardDisplayed() {
        await this.clusterDashboardPage.verifyDashboardDisplayed();
    }

    async getClusterCellValue(
        clusterName: string,
        columnName: string
    ): Promise<string> {

        return await this.clusterDashboardPage
            .getCellValue(clusterName, columnName);
    }

    async goToNextPage() {

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
    await this.clusterCreationPage.applyManifest();
}

async verifyClusterOnboardingSuccessful(): Promise<void> {
    await this.clusterCreationPage
        .verifyOnboardingSuccessful();
}

async finishClusterSetup(): Promise<void> {
    await this.clusterCreationPage.finishSetup();
}
async deleteCluster(
    clusterName: string,
    reason: string
): Promise<void> {
    await this.clusterDashboardPage.deleteCluster(
        clusterName,
        reason
    );
}
async hasCluster(clusterName: string): Promise<boolean> {
    return this.clusterDashboardPage.hasCluster(clusterName);
}
}

