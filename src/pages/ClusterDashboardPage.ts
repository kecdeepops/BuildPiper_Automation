import { Page, Locator ,expect} from '@playwright/test';
import { BasePage } from './BasePage';

export class ClusterDashboardPage extends BasePage {

    private pageTitle: Locator;
    private clusterTable: Locator;
    private nextPageButton: Locator;
    
    constructor(page: Page) {
        super(page);

        this.pageTitle = this.page.getByText('Kubernetes Clusters');

        this.clusterTable = this.page.locator('table');
        this.nextPageButton =this.page.locator('nav ul li').last().locator('button');
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

        const headers = this.clusterTable.locator('thead th');

        const columnIndex = await headers
            .filter({ hasText: columnName })
            .evaluate(
                (header) =>
                    Array.from(
                        header.parentElement!.children
                    ).indexOf(header)
            );

        const row = this.clusterTable
            .locator('tbody tr')
            .filter({
                hasText: clusterName
            });

        return await row
            .locator('td')
            .nth(columnIndex)
            .innerText();
    }

 async goToNextPage() {

    const firstRow =
        this.clusterTable
            .locator('tbody tr')
            .first();

    const currentFirstRowText =
        await firstRow.innerText();

    await this.nextPageButton.click();

    await expect(firstRow).not.toHaveText(
        currentFirstRowText
    );
}

async getPaginationRange(): Promise<string> {

    const paginationText = this.page
        .getByText(/^\d+\s*-\s*\d+\s+of\s+\d+$/);

    const text = await paginationText.innerText();

    return text.replace(/\s+/g, ' ').trim();
}
async hasCluster(
    clusterName: string
): Promise<boolean> {

    const headers =
        this.clusterTable.locator('thead th');

    const clusterColumnIndex =
        await headers
            .filter({ hasText: 'CLUSTER' })
            .evaluate(
                header =>
                    Array.from(
                        header.parentElement!.children
                    ).indexOf(header)
            );

    const rows =
        this.clusterTable
            .locator('tbody tr');

    const rowCount =
        await rows.count();

    for (let i = 0; i < rowCount; i++) {

        const clusterCell =
            rows
                .nth(i)
                .locator('td')
                .nth(clusterColumnIndex);

        const clusterNameLocator =
            clusterCell.getByText(
                clusterName,
                { exact: true }
            );

        if (await clusterNameLocator.count() > 0) {
            return true;
        }
    }

    return false;
}
async findCellValueAcrossPages(
    clusterName: string,
    columnName: string
): Promise<string> {

    while (true) {

        if (await this.hasCluster(clusterName)) {

            return await this.getCellValue(
                clusterName,
                columnName
            );
        }

        const paginationText =
            await this.getPaginationRange();

        const match =
            paginationText.match(
                /(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/
            );

        if (!match) {
            throw new Error(
                `Unable to determine pagination state.`
            );
        }

        const currentEnd = Number(match[2]);
        const total = Number(match[3]);

        if (currentEnd >= total) {

            throw new Error(
                `Cluster '${clusterName}' was not found ` +
                `in the table.`
            );
        }

        await this.goToNextPage();
    }
}
}