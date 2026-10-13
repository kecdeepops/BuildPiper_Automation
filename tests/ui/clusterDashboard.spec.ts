import { test, expect } from '../../src/fixtures/ui.fixture';

test('Verify pagination', async ({ pageManager }) => {

    await pageManager.clusterWorkflow
        .openClusterDashboard();

    const before =
        await pageManager.clusterWorkflow
            .getPaginationRange();

    const initialMatch =
        before.match(/^(\d+)\s*-\s*(\d+)\s+of\s+(\d+)$/);

    expect(
        initialMatch,
        `Unexpected pagination text: ${before}`
    ).not.toBeNull();

    const initialStart = Number(initialMatch![1]);
    const initialEnd = Number(initialMatch![2]);
    const total = Number(initialMatch![3]);

    expect(initialStart).toBe(1);
    expect(initialEnd).toBeLessThanOrEqual(total);

    await pageManager.clusterWorkflow
        .goToNextPage();

    const after =
        await pageManager.clusterWorkflow
            .getPaginationRange();

    const nextMatch =
        after.match(/^(\d+)\s*-\s*(\d+)\s+of\s+(\d+)$/);

    expect(
        nextMatch,
        `Unexpected pagination text: ${after}`
    ).not.toBeNull();

    expect(Number(nextMatch![1])).toBe(initialEnd + 1);
    expect(Number(nextMatch![2])).toBeLessThanOrEqual(total);
    expect(Number(nextMatch![3])).toBe(total);
});

test('Verify cluster dashboard is displayed', async ({ pageManager }) => {
    await pageManager.clusterWorkflow.openClusterDashboard();

    await pageManager.clusterDashboardPage.verifyDashboardDisplayed();
});


test('Verify Next button is disabled on the last page', async ({ pageManager, page }) => {
    await pageManager.clusterWorkflow.openClusterDashboard();

    const nextButton = page.locator('nav ul li')
        .filter({
            has: page.locator('span.ri-arrow-right-s-line')
        })
        .locator('button');

    let pagination = await pageManager.clusterWorkflow.getPaginationRange();

    while (true) {
        const match = pagination.match(
            /^(\d+)\s*-\s*(\d+)\s+of\s+(\d+)$/
        );

        expect(match, `Unexpected pagination text: ${pagination}`).not.toBeNull();

        const currentEnd = Number(match![2]);
        const total = Number(match![3]);

        if (currentEnd >= total) {
            break;
        }

        await pageManager.clusterWorkflow.goToNextPage();
        pagination = await pageManager.clusterWorkflow.getPaginationRange();
    }

    await expect(nextButton).toBeDisabled();
});
