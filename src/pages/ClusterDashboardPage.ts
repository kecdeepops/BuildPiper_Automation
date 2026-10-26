import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ClusterDashboardPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // =====================================================
    // Cluster Dashboard
    // =====================================================

    
async open(): Promise<void> {
    await this.navigate('/ClusterDashboard');

    await this.page.waitForLoadState('domcontentloaded');

    console.log('Dashboard URL:', this.page.url());
    console.log('Dashboard title:', await this.page.title());

    console.log(
        'Dashboard body:',
        (await this.page.locator('body').innerText()).slice(0, 3000)
    );
}

    // =====================================================
    // Verify Dashboard
    // =====================================================

    async verifyDashboardDisplayed(): Promise<void> {

        await expect(
            this.page.getByText('Kubernetes Clusters', {
                exact: true
            })
        ).toBeVisible({
            timeout: 15000
        });
    }

    // =====================================================
    // Cluster Search
    // =====================================================

    async searchCluster(clusterName: string): Promise<void> {

        const searchInput = this.page
            .getByPlaceholder(/search/i)
            .first();

        await expect(searchInput).toBeVisible();

        await searchInput.fill(clusterName);
    }

    // =====================================================
    // Get Cell Value
    // =====================================================

    async getCellValue(
        clusterName: string,
        columnName: string
    ): Promise<string> {

        const row = this.page
            .locator('tbody tr')
            .filter({
                hasText: clusterName
            })
            .first();

        await expect(row).toBeVisible({
            timeout: 15000
        });

        const headers = this.page.locator(
            'thead tr th'
        );

        const headerCount = await headers.count();

        let columnIndex = -1;

        for (let i = 0; i < headerCount; i++) {

            const text = (
                await headers.nth(i).innerText()
            ).trim();

            if (
                text.toLowerCase() ===
                columnName.toLowerCase()
            ) {
                columnIndex = i;
                break;
            }
        }

        if (columnIndex === -1) {
            throw new Error(
                `Column '${columnName}' not found`
            );
        }

        return (
            await row
                .locator('td')
                .nth(columnIndex)
                .innerText()
        ).trim();
    }

    // =====================================================
    // Find Cell Value Across Pages
    // =====================================================

    async findCellValueAcrossPages(
        clusterName: string,
        columnName: string
    ): Promise<string> {

        let currentPage = 1;

        while (true) {

            const rows = this.page.locator(
                'tbody tr'
            );

            const rowCount = await rows.count();

            for (let i = 0; i < rowCount; i++) {

                const row = rows.nth(i);

                const rowText = (
                    await row.innerText()
                ).trim();

                if (rowText.includes(clusterName)) {

                    const headers =
                        this.page.locator(
                            'thead tr th'
                        );

                    const headerCount =
                        await headers.count();

                    let columnIndex = -1;

                    for (
                        let j = 0;
                        j < headerCount;
                        j++
                    ) {

                        const headerText = (
                            await headers
                                .nth(j)
                                .innerText()
                        ).trim();

                        if (
                            headerText.toLowerCase() ===
                            columnName.toLowerCase()
                        ) {
                            columnIndex = j;
                            break;
                        }
                    }

                    if (columnIndex === -1) {
                        throw new Error(
                            `Column '${columnName}' not found`
                        );
                    }

                    return (
                        await row
                            .locator('td')
                            .nth(columnIndex)
                            .innerText()
                    ).trim();
                }
            }

            // =================================================
            // Pagination
            // =================================================

            const nextButton = this.page
    .locator(
        'button:has(span.ri-arrow-right-s-line)'
    )
    .first();
            if (!(await nextButton.isVisible())) {
    break;
}

            await nextButton.click();

            await this.page.waitForTimeout(1000);

            currentPage++;
        }

        throw new Error(
            `Cluster '${clusterName}' was not found on page ${currentPage} or any subsequent page.`
        );
    }

    // =====================================================
    // Get Pagination Range
    // =====================================================

    async getPaginationRange(): Promise<string> {

        const pagination = this.page
            .getByText(
                /\d+\s*-\s*\d+\s+of\s+\d+/,
                { exact: false }
            )
            .first();

        await expect(pagination).toBeVisible({
            timeout: 15000
        });

        return (
            await pagination.innerText()
        ).trim();
    }

    // =====================================================
    // Go To Next Page
    // =====================================================

    async goToNextPage(): Promise<void> {

    const pagination = await this.getPaginationRange();

    const match = pagination.match(
        /(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/
    );

    if (!match) {
        throw new Error(
            `Unexpected pagination text: ${pagination}`
        );
    }

    const currentEnd = Number(match[2]);
    const total = Number(match[3]);

    // Already on last page
    if (currentEnd >= total) {
        console.log(
            `Already on last page: ${pagination}`
        );
        return;
    }

    const nextButton = this.page.locator(
        'button:has(span.ri-arrow-right-s-line)'
    ).first();

    await expect(nextButton).toBeVisible({
        timeout: 10000
    });

    await nextButton.click();

    await this.page.waitForTimeout(1000);
}
    // =====================================================
    // Wait For Cluster Connected
    // =====================================================

    async waitForClusterConnected(
        clusterName: string,
        timeout: number = 120_000,
        interval: number = 10_000
    ): Promise<void> {

        const startTime = Date.now();

        while (
            Date.now() - startTime < timeout
        ) {

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

            await this.page.waitForTimeout(
                interval
            );
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
    // Get Cluster ID
    // =====================================================

    async getClusterId(
        clusterName: string
    ): Promise<string> {
console.log(
    'Cluster rows:',
    await this.page.locator('tbody tr').allInnerTexts()
);
        const row = this.page
            .locator('tbody tr')
            .filter({
                hasText: clusterName
            })
            .first();

        await expect(row).toBeVisible({
            timeout: 15000
        });

        // Cluster name is usually a link containing the cluster ID
        const clusterLink = row
            .locator('a')
            .first();

        await expect(clusterLink).toBeVisible();

        const href = await clusterLink.getAttribute('href');

        if (!href) {
            throw new Error(
                `Cluster '${clusterName}' does not have a valid link`
            );
        }

        const match = href.match(/cluster\/(\d+)/i);

        if (!match) {
            throw new Error(
                `Unable to extract cluster ID from href: ${href}`
            );
        }

        return match[1];
    }

    // =====================================================
    // Delete Cluster
    // =====================================================

    async deleteCluster(
        clusterName: string,
        reason: string
    ): Promise<void> {

        const row = this.page
            .locator('tbody tr')
            .filter({
                hasText: clusterName
            })
            .first();

        await expect(row).toBeVisible({
            timeout: 15000
        });

        const deleteButton = row
            .getByRole('button')
            .filter({
                has: this.page.locator(
                    'svg'
                )
            })
            .first();

        await expect(deleteButton).toBeVisible();

        await deleteButton.click();

        // Handle delete confirmation if available
        const reasonInput = this.page
            .getByPlaceholder(/reason/i)
            .first();

        if (await reasonInput.isVisible().catch(() => false)) {
            await reasonInput.fill(reason);
        }

        const confirmButton = this.page
            .getByRole('button', {
                name: /delete|confirm/i
            })
            .last();

        await expect(confirmButton).toBeVisible();

        await confirmButton.click();
    }

    // =====================================================
    // Check Cluster Exists
    // =====================================================

    async hasCluster(
        clusterName: string
    ): Promise<boolean> {

        const row = this.page
            .locator('tbody tr')
            .filter({
                hasText: clusterName
            })
            .first();

        return await row.isVisible().catch(() => false);
    }

async getFirstAvailableCluster(): Promise<{
    name: string;
    id: string;
}> {
    const rows = this.page.locator('tbody tr');
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
        const row = rows.nth(i);
        const link = row.locator('a').first();

        if (await link.count() === 0) {
            continue;
        }

        const name = (await link.innerText()).trim();
        const href = await link.getAttribute('href');

        const match = href?.match(/cluster\/(\d+)/i);

        if (name && match) {
            return {
                name,
                id: match[1]
            };
        }
    }

    throw new Error('No cluster found on the current dashboard page');
}

 private manageApplicationMenu =
        this.page.getByText(
            'Manage Application',
            {
                exact: true
            }
        );

    // =====================================================
    // OPEN CLUSTER DASHBOARD
    // =====================================================

    async openClusterDashboard(): Promise<void> {

        console.log(
            'Opening Cluster Dashboard...'
        );

        await this.page.goto(
            '/ClusterDashboard'
        );

        await expect(
            this.page
        ).toHaveURL(
            /ClusterDashboard/,
            {
                timeout: 15_000
            }
        );

        console.log(
            `Cluster Dashboard opened: ${this.page.url()}`
        );
    }

    // =====================================================
    // OPEN MANAGE APPLICATION
    // =====================================================

    async openManageApplication(): Promise<void> {

        console.log(
            'Opening Manage Application...'
        );

        await expect(
            this.manageApplicationMenu
        ).toBeVisible({
            timeout: 15_000
        });

        await this.manageApplicationMenu.click();

        // Wait for Apps Summary page
        await expect(
            this.page.getByText(
                'Apps Summary',
                {
                    exact: true
                }
            )
        ).toBeVisible({
            timeout: 15_000
        });

        console.log(
            `Manage Application opened: ${this.page.url()}`
        );
    }
}