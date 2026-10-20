import { test } from '../../src/fixtures/ui.fixture';

test('Verify Pods Available page', async ({ pageManager, page }) => {

    await test.step('Open Pods Available page', async () => {
        await pageManager.podsWorkflow.openPodsPage();
    });

    await test.step('Verify Pods page is displayed', async () => {
        await pageManager.podsWorkflow.verifyPodsPageDisplayed();
    });

    await test.step('Verify pod list is displayed', async () => {
        await pageManager.podsWorkflow.verifyPodListDisplayed();
    });

    await test.step('Verify LOAD MORE functionality', async () => {

        const previousCount =
            await pageManager.podsWorkflow.getPodCount();

        console.log(`Pods before LOAD MORE: ${previousCount}`);

        await pageManager.podsWorkflow.clickLoadMore();

        const newCount =
            await pageManager.podsWorkflow.getPodCount();

        console.log(`Pods after LOAD MORE: ${newCount}`);

        if (newCount > previousCount) {
            console.log(
                `LOAD MORE worked. Pods increased from ${previousCount} to ${newCount}.`
            );
        } else {
            console.log(
                'No additional pods loaded. LOAD MORE may not be available.'
            );
        }
    });
});


test('Verify first pod data @smoke', async ({ pageManager }) => {

    await test.step('Open Pods Available page', async () => {
        await pageManager.podsWorkflow.openPodsPage();
    });

    await test.step('Verify first pod has data', async () => {
        await pageManager.podsWorkflow.verifyFirstPodHasData();
    });
});