import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PodsPage extends BasePage {

    constructor(page: Page) {
        super(page);
    }

    // =====================================================
    // OPEN PODS PAGE
    // =====================================================

    async open(): Promise<void> {
        await this.navigate('/cluster/275/pod/list');
    }

    // =====================================================
    // VERIFY PODS PAGE
    // =====================================================

    async verifyPodsPageDisplayed(): Promise<void> {

        await expect(
            this.page.getByText('Pods Available', { exact: true })
        ).toBeVisible({
            timeout: 15000
        });
    }

    // =====================================================
    // VERIFY POD LIST
    // =====================================================

    async verifyPodListDisplayed(): Promise<void> {

        await expect(
            this.page.getByText('Pod Name', { exact: true })
        ).toBeVisible();

        await expect(
            this.page.getByText('Execution Duration', { exact: true })
        ).toBeVisible();

        await expect(
            this.page.getByText('Status', { exact: true })
        ).toBeVisible();

        await expect(
            this.page.getByText('Namespace', { exact: true })
        ).toBeVisible();

        await expect(
            this.page.getByText('Node Name', { exact: true })
        ).toBeVisible();

        await expect(
            this.page.getByText('Labels', { exact: true })
        ).toBeVisible();
    }

    // =====================================================
    // GET FIRST POD NAME
    // =====================================================

    async getFirstPodName(): Promise<string> {

        const firstRow = this.page
            .locator('tbody tr')
            .first();

        await expect(firstRow).toBeVisible();

        const podName = firstRow
            .locator('td')
            .nth(0)
            .locator('span[aria-label]')
            .first();

        await expect(podName).toBeVisible();

        return (
            (await podName.getAttribute('aria-label'))?.trim() ?? ''
        );
    }

    // =====================================================
    // GET FIRST POD STATUS
    // =====================================================

    async getFirstPodStatus(): Promise<string> {

        const firstRow = this.page
            .locator('tbody tr')
            .first();

        const status = firstRow
            .locator('td')
            .nth(2);

        await expect(status).toBeVisible();

        return (
            await status.innerText()
        ).trim();
    }

    // =====================================================
    // GET FIRST POD NAMESPACE
    // =====================================================

    async getFirstPodNamespace(): Promise<string> {

        const firstRow = this.page
            .locator('tbody tr')
            .first();

        const namespace = firstRow
            .locator('td')
            .nth(3);

        await expect(namespace).toBeVisible();

        return (
            await namespace.innerText()
        ).trim();
    }

    // =====================================================
    // GET FIRST POD NODE NAME
    // =====================================================

    async getFirstPodNodeName(): Promise<string> {

        const firstRow = this.page
            .locator('tbody tr')
            .first();

        const nodeName = firstRow
            .locator('td')
            .nth(4);

        await expect(nodeName).toBeVisible();

        return (
            await nodeName.innerText()
        ).trim();
    }

    // =====================================================
    // GET POD COUNT
    // =====================================================

    async getPodCount(): Promise<number> {

        return await this.page
            .locator('tbody tr')
            .count();
    }

    // =====================================================
    // LOAD MORE
    // =====================================================
async isLoadMoreAvailable(): Promise<boolean> {

    const loadMoreButton = this.page.getByText(
        'LOAD MORE',
        { exact: true }
    );

    return await loadMoreButton.isVisible().catch(() => false);
}

async clickLoadMore(): Promise<void> {

    const loadMoreButton = this.page.getByText(
        'LOAD MORE',
        { exact: true }
    );

    await loadMoreButton.click();
}

    // =====================================================
    // VERIFY MORE PODS LOADED
    // =====================================================

    async verifyMorePodsLoaded(
        previousCount: number
    ): Promise<void> {

        await expect
            .poll(
                async () => {
                    return await this.getPodCount();
                },
                {
                    timeout: 15000,
                    message:
                        'Expected more pods to be loaded after clicking LOAD MORE'
                }
            )
            .toBeGreaterThan(previousCount);
    }

    // =====================================================
    // VERIFY FIRST POD HAS DATA
    // =====================================================

    async verifyFirstPodHasData(): Promise<void> {

        const firstRow = this.page
            .locator('tbody tr')
            .first();

        await expect(firstRow).toBeVisible({
            timeout: 15000
        });

        // Pod Name is available through aria-label
        const podName = await this.getFirstPodName();

        const status = await this.getFirstPodStatus();

        const namespace =
            await this.getFirstPodNamespace();

        const nodeName =
            await this.getFirstPodNodeName();

        console.log(`Pod Name: ${podName}`);
        console.log(`Pod Status: ${status}`);
        console.log(`Namespace: ${namespace}`);
        console.log(`Node Name: ${nodeName}`);

        expect(podName).not.toBe('');
        expect(status).not.toBe('');
        expect(namespace).not.toBe('');
        expect(nodeName).not.toBe('');
    }
    
}