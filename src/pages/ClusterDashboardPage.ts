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
                has: this.page.locator(
                    'span.ri-arrow-left-s-line'
                )
            })
            .locator('button');

        this.nextPageButton = this.page
            .locator('nav ul li')
            .filter({
                has: this.page.locator(
                    'span.ri-arrow-right-s-line'
                )
            })
            .locator('button');

        this.dataTable = new DataTable(
            this.clusterTable,
            this.pagination,
            this.nextPageButton,
            this.previousPageButton
        );
    }

    // =====================================================
    // OPEN DASHBOARD
    // =====================================================

    async open(): Promise<void> {
        await this.navigate('/ClusterDashboard');

        await this.verifyDashboardDisplayed();
    }

    // =====================================================
    // VERIFY DASHBOARD
    // =====================================================

    async verifyDashboardDisplayed(): Promise<void> {
        await expect(
            this.clusterTable
        ).toBeVisible({
            timeout: 15000
        });

        await expect(
            this.pagination
        ).toBeVisible({
            timeout: 15000
        });
    }

    // =====================================================
    // GET CELL VALUE
    // =====================================================

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

    // =====================================================
    // PAGINATION
    // =====================================================

    async goToNextPage(): Promise<void> {

        await this.dataTable.goToNextPage();
    }

    async getPaginationRange(): Promise<string> {

        return this.dataTable.getPaginationRange();
    }

    // =====================================================
    // FIND CLUSTER ACROSS ALL PAGES
    // =====================================================

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

    // =====================================================
    // FIND CLUSTER ROW ACROSS ALL PAGES
    // =====================================================

    private async findClusterRowAcrossPages(
        clusterName: string
    ): Promise<Locator> {

        const normalize = (
            value: string
        ): string => {

            return value
                .replace(/[_-]/g, '-')
                .replace(/\s+/g, ' ')
                .trim()
                .toLowerCase();
        };

        const expectedName =
            normalize(clusterName);

        await this.verifyDashboardDisplayed();

        while (true) {

            const rows =
                this.clusterTable.locator(
                    'tbody tr'
                );

            const rowCount =
                await rows.count();

            for (
                let i = 0;
                i < rowCount;
                i++
            ) {

                const row =
                    rows.nth(i);

                const links =
                    row
                        .locator('td')
                        .first()
                        .locator('a');

                const linkCount =
                    await links.count();

                for (
                    let j = 0;
                    j < linkCount;
                    j++
                ) {

                    const actualName =
                        normalize(
                            await links
                                .nth(j)
                                .innerText()
                        );

                    if (
                        actualName ===
                        expectedName
                    ) {
                        return row;
                    }
                }
            }

            const paginationText =
                await this.getPaginationRange();

            const match =
                paginationText.match(
                    /(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/
                );

            if (!match) {

                throw new Error(
                    `Unable to determine pagination state: "${paginationText}".`
                );
            }

            const currentEnd =
                Number(match[2]);

            const total =
                Number(match[3]);

            if (
                total === 0 ||
                currentEnd >= total
            ) {

                throw new Error(
                    `Cluster '${clusterName}' was not found across dashboard pages.`
                );
            }

            await this.goToNextPage();
        }
    }

    // =====================================================
    // GET CLUSTER ID
    // =====================================================

    async getClusterId(
        clusterName: string
    ): Promise<string> {

        const row =
            await this.findClusterRowAcrossPages(
                clusterName
            );

        const clusterLink =
            row
                .locator('td')
                .first()
                .locator('a')
                .first();

        await expect(
            clusterLink
        ).toBeVisible();

        const href =
            await clusterLink.getAttribute(
                'href'
            );

        if (!href) {

            throw new Error(
                `Unable to get href for cluster '${clusterName}'.`
            );
        }

        /*
         * Expected URL:
         *
         * /cluster/269/namespace/list
         *
         * Extract:
         *
         * 269
         */

        const match =
            href.match(
                /\/cluster\/([^/]+)/
            );

        if (!match) {

            throw new Error(
                `Unable to extract Cluster ID from href: ${href}`
            );
        }

        const clusterId =
            match[1];

        console.log(
            `Cluster '${clusterName}' ID: ${clusterId}`
        );

        return clusterId;
    }

    // =====================================================
    // WAIT FOR CLUSTER CONNECTED
    // =====================================================

   async waitForClusterConnected(
    clusterName: string,
    timeout: number = 120_000,
    interval: number = 10_000
): Promise<void> {

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {

        const status =
            await this.findCellValueAcrossPages(
                clusterName,
                'STATUS'
            );

        console.log(
            `Cluster '${clusterName}' status: ${status}`
        );

        if (
            status
                .trim()
                .toLowerCase() === 'connected'
        ) {
            console.log(
                `Cluster '${clusterName}' is Connected.`
            );
            return;
        }

        console.log(
            `Cluster is not Connected yet. Waiting ${interval / 1000}s...`
        );

        await this.page.waitForTimeout(interval);
    }

    const finalStatus =
        await this.findCellValueAcrossPages(
            clusterName,
            'STATUS'
        );

    throw new Error(
        `Cluster '${clusterName}' did not become Connected within ${timeout / 1000}s. Final status: '${finalStatus}'.`
    );
}
    // =====================================================
    // CHECK CLUSTER EXISTS
    // =====================================================

    async hasCluster(
        clusterName: string
    ): Promise<boolean> {

        await this.verifyDashboardDisplayed();

        return this.dataTable.hasRowAcrossPages(
            clusterName,
            'CLUSTER'
        );
    }
async waitForClusterConnected(
    clusterName: string,
    timeout: number = 120_000
): Promise<void> {

    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {

        try {
            const status =
                await this.getCellValue(
                    clusterName,
                    'STATUS'
                );

            console.log(
                `Cluster '${clusterName}' status: ${status}`
            );

            if (status.trim() === 'Connected') {
                return;
            }

        } catch (error) {
            console.log(
                `Cluster '${clusterName}' not available yet. Retrying...`
            );
        }

        await this.page.waitForTimeout(5_000);

        // Refresh dashboard so latest cluster status is loaded.
        await this.page.reload();

        await this.verifyDashboardDisplayed();
    }

    throw new Error(
        `Cluster '${clusterName}' did not become Connected within ${timeout} ms.`
    );
}
    // =====================================================
    // DELETE CLUSTER
    // =====================================================

    async deleteCluster(
        clusterName: string,
        reason: string
    ): Promise<void> {

        const row =
            await this.findClusterRowAcrossPages(
                clusterName
            );

        await expect(
            row
        ).toHaveCount(1);

        const deleteButton =
            row.locator(
                'button.icon-btn-outline-danger'
            );

        await expect(
            deleteButton
        ).toBeVisible();

        await deleteButton.click();

        // First confirmation

        const confirmationButton =
            this.page.getByRole(
                'button',
                {
                    name: 'YES, DELETE',
                    exact: true
                }
            );

        await expect(
            confirmationButton
        ).toBeVisible();

        await expect(
            confirmationButton
        ).toBeEnabled();

        await confirmationButton.click();

        // Enter deletion reason

        const reasonInput =
            this.page.locator(
                'textarea[name="remarks"]'
            );

        await expect(
            reasonInput
        ).toBeVisible();

        await reasonInput.fill(
            reason
        );

        // Final confirmation

        await expect(
            confirmationButton
        ).toBeVisible();

        await confirmationButton.click();

        await expect(
            reasonInput
        ).toBeHidden();

        // Verify successful deletion

        await expect(
            this.page.getByText(
                `${clusterName} deleted successfully`,
                {
                    exact: true
                }
            )
        ).toBeVisible({
            timeout: 10000
        });
    }
}