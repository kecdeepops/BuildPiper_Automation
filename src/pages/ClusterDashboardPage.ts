import { Page, Locator} from '@playwright/test';
import { BasePage } from './BasePage';
import { DataTable } from './component/DataTable';
export class ClusterDashboardPage extends BasePage {

    private pageTitle: Locator;
    private clusterTable: Locator;
    private nextPageButton: Locator;
    private dataTable: DataTable;
    
    constructor(page: Page) {
        super(page);

        this.pageTitle = this.page.getByText('Kubernetes Clusters');

        this.clusterTable = this.page.locator('table');
        this.nextPageButton =this.page.locator('nav ul li').last().locator('button');
    this.dataTable = new DataTable(
    this.clusterTable,
    this.page.getByText(
        /^\d+\s*-\s*\d+\s+of\s+\d+$/
    ),
    this.nextPageButton
);
    }

    async open() {
        await this.navigate('/ClusterDashboard');
    }

    async verifyDashboardDisplayed() {
        await this.pageTitle.waitFor();
    }

   async getCellValue(
    clusterName: string,
    columnName: string
): Promise<string> {

    return await this.dataTable.getCellValue(
        clusterName,
        'CLUSTER',
        columnName
    );
}

 async goToNextPage() {
    await this.dataTable.goToNextPage();
}

async getPaginationRange(): Promise<string> {

    return await this.dataTable
        .getPaginationRange();
}

async findCellValueAcrossPages(
    clusterName: string,
    columnName: string
): Promise<string> {

    return await this.dataTable
        .findCellValueAcrossPages(
            clusterName,
            'CLUSTER',
            columnName
        );
}
}