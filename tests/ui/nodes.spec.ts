import { test, expect } from '../../src/fixtures/ui.fixture';

test('Verify Nodes Available page', async ({ pageManager }) => {

    await test.step('Open Nodes Available page', async () => {
        await pageManager.clusterWorkflow.openNodesAvailable();
    });

    await test.step('Verify Nodes page is displayed', async () => {
        await pageManager.nodesPage.verifyNodesPageDisplayed();
    });

    await test.step('Verify node list is displayed', async () => {
        await pageManager.nodesPage.verifyNodeListDisplayed();
    });
});


test('Verify first node data @smoke', async ({ pageManager }) => {

    await test.step('Open Nodes Available page', async () => {
        await pageManager.clusterWorkflow.openNodesAvailable();
    });

    await test.step('Verify first node has data', async () => {
        await pageManager.clusterWorkflow
            .verifyFirstNodeHasData();
    });
});


test('Verify Node Type filter @smoke', async ({ pageManager }) => {

    await test.step('Open Nodes page', async () => {
        await pageManager.nodesWorkflow.openNodesPage();
    });

    await test.step('Open Node Type filter', async () => {
        await pageManager.nodesWorkflow.openNodeTypeFilter();
    });

    await test.step('Select Master node type', async () => {
        await pageManager.nodesWorkflow.selectNodeType('Master');
    });

    await test.step('Verify filtered results', async () => {
        await pageManager.nodesWorkflow
            .verifyNodeTypeResults('Master');
    });

    await test.step('Clear filters', async () => {
        await pageManager.nodesWorkflow.clearFilters();
    });
});

test('Verify Worker Node Type filter @smoke', async ({ pageManager }) => {

    await test.step('Open Nodes page', async () => {
        await pageManager.nodesWorkflow.openNodesPage();
    });

    await test.step('Open Node Type filter', async () => {
        await pageManager.nodesWorkflow.openNodeTypeFilter();
    });

    await test.step('Select Worker node type', async () => {
        await pageManager.nodesWorkflow.selectNodeType('Worker');
    });

    await test.step('Verify filtered Worker results', async () => {
        await pageManager.nodesWorkflow.verifyNodeTypeResults('Worker');
    });

    await test.step('Clear filters', async () => {
        await pageManager.nodesWorkflow.clearFilters();
    });
});