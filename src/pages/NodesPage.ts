import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class NodesPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // =========================
    // OPEN NODES PAGE
    // =========================

    async open(): Promise<void> {
        await this.navigate('/cluster/275/node/list');
        // await this.navigate('/ClusterDashboard');
    }

    // =========================
    // PAGE VALIDATION
    // =========================

    async verifyNodesPageDisplayed(): Promise<void> {

        await expect(
            this.page.getByText('Nodes Available', {
                exact: true
            })
        ).toBeVisible();
    }

    async verifyNodeListDisplayed(): Promise<void> {

        await expect(
            this.page.getByText('Node Name', {
                exact: true
            })
        ).toBeVisible();

        await expect(
            this.page.getByText('Status', {
                exact: true
            })
        ).toBeVisible();

        await expect(
            this.page.getByRole('columnheader', {
                name: 'Node Type'
            })
        ).toBeVisible();

        await expect(
            this.page.getByText('Condition Type', {
                exact: true
            })
        ).toBeVisible();
    }

    // =========================
    // FIRST NODE
    // =========================

    async getFirstNodeName(): Promise<string> {

        const nodeName = this.page
            .locator('tbody tr')
            .first()
            .locator('td')
            .first();

        return (await nodeName.innerText()).trim();
    }

    async getFirstNodeStatus(): Promise<string> {

        const status = this.page
            .locator('tbody tr')
            .first()
            .locator('td')
            .nth(1);

        return (await status.innerText()).trim();
    }

    async verifyFirstNodeHasData(): Promise<void> {

        const nodeName = await this.getFirstNodeName();
        const status = await this.getFirstNodeStatus();

        console.log(`Node Name: ${nodeName}`);
        console.log(`Node Status: ${status}`);

        expect(nodeName).not.toBe('');
        expect(status).not.toBe('');
    }

    // =========================
    // NODE TYPE FILTER
    // =========================

    async openNodeTypeFilter(): Promise<void> {

        await this.page.getByRole('button', {
            name: /Node Type: All/
        }).click();
    }

    async selectNodeType(
        nodeType: 'Master' | 'Worker'
    ): Promise<void> {

        await this.page.getByRole('checkbox', {
            name: nodeType
        }).check();
    }

    async verifyNodeTypeResults(
    nodeType: 'Master' | 'Worker'
): Promise<void> {

    const rows = this.page.locator('tbody tr');

    // Give the UI/API time to update after filter selection
    await this.page.waitForTimeout(2000);

    const rowCount = await rows.count();

    console.log(
        `Node Type: ${nodeType}, Row Count: ${rowCount}`
    );

    if (rowCount === 0) {
        console.log(
            `No rows found after applying ${nodeType} filter`
        );

        console.log(
            'Current URL:',
            this.page.url()
        );

        console.log(
            'Page text:',
            (await this.page.locator('body').innerText()).slice(0, 3000)
        );
    }

    expect(
        rowCount,
        `No ${nodeType} nodes found after applying ${nodeType} filter`
    ).toBeGreaterThan(0);

    // Find Node Type column
    const headers = this.page.locator('thead th');

    const headerCount = await headers.count();

    let nodeTypeColumnIndex = -1;

    for (let i = 0; i < headerCount; i++) {

        const headerText =
            (await headers.nth(i).innerText()).trim();

        if (headerText === 'Node Type') {
            nodeTypeColumnIndex = i;
            break;
        }
    }

    expect(
        nodeTypeColumnIndex,
        'Node Type column was not found'
    ).toBeGreaterThanOrEqual(0);

    // Validate every returned row
    for (let i = 0; i < rowCount; i++) {

        const cell = rows
            .nth(i)
            .locator('td')
            .nth(nodeTypeColumnIndex);

        const actualNodeType =
            (await cell.innerText()).trim();

        console.log(
            `Row ${i + 1}: Expected=${nodeType}, Actual=${actualNodeType}`
        );

        expect(
            actualNodeType,
            `Incorrect Node Type in row ${i + 1}`
        ).toBe(nodeType);
    }
}// =========================
    // CLEAR FILTER
    // =========================

    async clearFilters(): Promise<void> {

        await this.page.getByText('Clear Selection', {
            exact: true
        }).click();
    }
}