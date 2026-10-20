
import { test, expect } from '../../src/fixtures/ui.fixture';

test('Verify pagination', async ({ pageManager }) => {

    let before = '';
    let after = '';
    let initialEnd = 0;
    let total = 0;

    await test.step('Open cluster dashboard', async () => {
        await pageManager.clusterWorkflow.openClusterDashboard();
    });

    await test.step('Read and validate initial pagination range', async () => {
        before = await pageManager.clusterWorkflow.getPaginationRange();

        const initialMatch = before.match(
            /^(\d+)\s*-\s*(\d+)\s+of\s+(\d+)$/
        );

        expect(
            initialMatch,
            `Unexpected pagination text: ${before}`
        ).not.toBeNull();

        const initialStart = Number(initialMatch![1]);
        initialEnd = Number(initialMatch![2]);
        total = Number(initialMatch![3]);

        expect(initialStart).toBe(1);
        expect(initialEnd).toBeLessThanOrEqual(total);
    });

    await test.step('Navigate to the next page', async () => {
        await pageManager.clusterWorkflow.goToNextPage();
        after = await pageManager.clusterWorkflow.getPaginationRange();
    });

    await test.step('Validate next page range', async () => {
        const nextMatch = after.match(
            /^(\d+)\s*-\s*(\d+)\s+of\s+(\d+)$/
        );

        expect(
            nextMatch,
            `Unexpected pagination text: ${after}`
        ).not.toBeNull();

        expect(Number(nextMatch![1])).toBe(initialEnd + 1);
        expect(Number(nextMatch![2])).toBeLessThanOrEqual(total);
        expect(Number(nextMatch![3])).toBe(total);
    });
});

test('Verify cluster dashboard is displayed', async ({ pageManager }) => {

    await test.step('Open cluster dashboard', async () => {
        await pageManager.clusterWorkflow.openClusterDashboard();
    });

    await test.step('Verify dashboard is displayed', async () => {
        await pageManager.clusterDashboardPage.verifyDashboardDisplayed();
    });
});

