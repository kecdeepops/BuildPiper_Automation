import { ClusterDashboardPage } from '../../pages/ClusterDashboardPage';

export class ClusterWorkflow {

    constructor(
        private clusterDashboardPage: ClusterDashboardPage
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
}
