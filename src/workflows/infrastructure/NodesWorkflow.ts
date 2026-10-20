import { NodesPage } from '../../pages/NodesPage';

export class NodesWorkflow {

    constructor(
        private nodesPage: NodesPage
    ) {}

    // =========================
    // NODES PAGE
    // =========================

    async openNodesPage(): Promise<void> {
        await this.nodesPage.open();
    }

    async verifyNodesPageDisplayed(): Promise<void> {
        await this.nodesPage.verifyNodesPageDisplayed();
    }

    async verifyNodeListDisplayed(): Promise<void> {
        await this.nodesPage.verifyNodeListDisplayed();
    }

    // =========================
    // NODE TYPE FILTER
    // =========================

    async openNodeTypeFilter(): Promise<void> {
        await this.nodesPage.openNodeTypeFilter();
    }

    async selectNodeType(
        nodeType: 'Master' | 'Worker'
    ): Promise<void> {

        await this.nodesPage.selectNodeType(nodeType);
    }

    async verifyNodeTypeResults(
        nodeType: 'Master' | 'Worker'
    ): Promise<void> {

        await this.nodesPage.verifyNodeTypeResults(nodeType);
    }

    async clearFilters(): Promise<void> {
        await this.nodesPage.clearFilters();
    }
}