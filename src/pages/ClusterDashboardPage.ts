
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DataTable } from './component/DataTable';

export class ClusterDashboardPage extends BasePage {
    private clusterTable: Locator;
    private nextPageButton: Locator;
    private previousPageButton: Locator;
    private pagination: Locator;
    private dataTable: DataTable;

    constructor(page: Page) {
        super(page);

        this.clusterTable = this.page.locator('table');

        this.pagination = this.page.getByText(
            /^\d+\s*-\s*\d+\s+of\s+\d+$/
        );

        this.previousPageButton = this.page
            .locator('nav ul li')
            .filter({
                has: this.page.locator('span.ri-arrow-left-s-line')
            })
            .locator('button');

        this.nextPageButton = this.page
            .locator('nav ul li')
            .filter({
                has: this.page.locator('span.ri-arrow-right-s-line')
            })
            .locator('button');

        this.dataTable = new DataTable(
            this.clusterTable,
            this.pagination,
            this.nextPageButton,
            this.previousPageButton
        );
    }

    // Open the cluster dashboard and wait for it to be ready.
    async open(): Promise<void> {
        await this.navigate('/ClusterDashboard');
        await this.verifyDashboardDisplayed();
    }

    // Verify that the dashboard table and pagination are visible.
    async verifyDashboardDisplayed(): Promise<void> {
        await expect(this.clusterTable).toBeVisible({
            timeout: 15000
        });

        await expect(this.pagination).toBeVisible({
            timeout: 15000
        });
    }

    // Get a cell value from the current page.
    async getCellValue(
        clusterName: string,
        columnName: string
    ): Promise<string> {
        return this.dataTable.getCellValue(
            clusterName,
            'CLUSTER',
            columnName
        );
    }

    // Navigate to the next page.
    async goToNextPage(): Promise<void> {
        await this.dataTable.goToNextPage();
    }

    // Get the current pagination range.
    async getPaginationRange(): Promise<string> {
        return this.dataTable.getPaginationRange();
    }

    // Find a cluster's cell value across all pages.
    async findCellValueAcrossPages(
        clusterName: string,
        columnName: string
    ): Promise<string> {
        await this.verifyDashboardDisplayed();

        return this.dataTable.findCellValueAcrossPages(
            clusterName,
            'CLUSTER',
            columnName
        );
    }

    // Find the complete cluster row across all pages.
    private async findClusterRowAcrossPages(
        clusterName: string
    ): Promise<Locator> {
        const normalize = (value: string): string =>
            value
                .replace(/[_-]/g, '-')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();

        const expectedName = normalize(clusterName);

        await this.verifyDashboardDisplayed();

        while (true) {
            const rows = this.clusterTable.locator('tbody tr');
            const rowCount = await rows.count();

            for (let i = 0; i < rowCount; i++) {
                const row = rows.nth(i);
                const links = row.locator('td').first().locator('a');
                const linkCount = await links.count();

                for (let j = 0; j < linkCount; j++) {
                    const actualName = normalize(
                        await links.nth(j).innerText()
                    );

                    if (actualName === expectedName) {
                        return row;
                    }
                }
            }

            const paginationText = await this.getPaginationRange();

            const match = paginationText.match(
                /(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/
            );

            if (!match) {
                throw new Error(
                    `Unable to determine pagination state: "${paginationText}".`
                );
            }

            const currentEnd = Number(match[2]);
            const total = Number(match[3]);

            if (total === 0 || currentEnd >= total) {
                throw new Error(
                    `Cluster '${clusterName}' was not found across dashboard pages.`
                );
            }

            await this.goToNextPage();
        }
    }

    // Check whether a cluster exists anywhere in the table.
    async hasCluster(clusterName: string): Promise<boolean> {
        await this.verifyDashboardDisplayed();

        return this.dataTable.hasRowAcrossPages(
            clusterName,
            'CLUSTER'
        );
    }

    // Delete a cluster after locating its row.
    async deleteCluster(
        clusterName: string,
        reason: string
    ): Promise<void> {
        const row = await this.findClusterRowAcrossPages(clusterName);

        await expect(row).toHaveCount(1);

        const deleteButton = row.locator(
            'button.icon-btn-outline-danger'
        );

        await expect(deleteButton).toBeVisible();
        await deleteButton.click();

        // First confirmation modal.
       const confirmationButton = this.page.getByRole('button', {
    name: 'YES, DELETE',
    exact: true
});

await expect(confirmationButton).toBeVisible();
await expect(confirmationButton).toBeEnabled();

console.log(
    'Delete confirmation buttons:',
    await confirmationButton.count()
);

await confirmationButton.click({
    timeout: 10000
});

console.log('First delete confirmation clicked successfully.');

        // Enter the deletion reason.
        const reasonInput = this.page.locator(
            'textarea[name="remarks"]'
        );

        await expect(reasonInput).toBeVisible();
        await reasonInput.fill(reason);

        // Final confirmation.
        await expect(confirmationButton).toBeVisible();
        await confirmationButton.click();

        await expect(reasonInput).toBeHidden();

        await expect(
    this.page.getByText(`${clusterName} deleted successfully`, {
        exact: true
    })
).toBeVisible({ timeout: 10000 });
    }
}
