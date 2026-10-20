import { Page } from '@playwright/test';

import { ClusterCreationPage } from './ClusterCreationPage';
import { ClusterDashboardPage } from './ClusterDashboardPage';
import { LoginPage } from './LoginPage';
import { NamespaceCreationPage } from './NamespaceCreationPage';
import { NodesPage } from './NodesPage';
import { PodsPage } from './PodsPage';
import { PodsWorkflow } from '../workflows/infrastructure/PodsWorkflow';
import { ContainerRegistryPage } from './ContainerRegistryPage';
import { ClusterWorkflow } from '../workflows/infrastructure/ClusterWorkflow';
import { NamespaceWorkflow } from '../workflows/infrastructure/NamespaceWorkflow';
import { NodesWorkflow } from '../workflows/infrastructure/NodesWorkflow';
import { ContainerRegistryWorkflow } from '../workflows/integration/ContainerRegistryWorkflow';

export class PageManager {

    private page: Page;

    private _loginPage?: LoginPage;
    private _clusterDashboardPage?: ClusterDashboardPage;
    private _clusterCreationPage?: ClusterCreationPage;

    private _namespaceCreationPage?: NamespaceCreationPage;

    private _nodesPage?: NodesPage;
    private _nodesWorkflow?: NodesWorkflow;

    private _podsPage?: PodsPage;
    private _podsWorkflow?: PodsWorkflow;

    private _clusterWorkflow?: ClusterWorkflow;
    private _namespaceWorkflow?: NamespaceWorkflow;

    private _containerRegistryPage?: ContainerRegistryPage;
private _containerRegistryWorkflow?: ContainerRegistryWorkflow;

    constructor(page: Page) {
        this.page = page;
    }

    // =====================================================
    // LOGIN
    // =====================================================

    get loginPage(): LoginPage {

        if (!this._loginPage) {
            this._loginPage =
                new LoginPage(this.page);
        }

        return this._loginPage;
    }

    // =====================================================
    // CLUSTER DASHBOARD
    // =====================================================

    get clusterDashboardPage(): ClusterDashboardPage {

        if (!this._clusterDashboardPage) {
            this._clusterDashboardPage =
                new ClusterDashboardPage(this.page);
        }

        return this._clusterDashboardPage;
    }

    // =====================================================
    // CLUSTER CREATION
    // =====================================================

    get clusterCreationPage(): ClusterCreationPage {

        if (!this._clusterCreationPage) {
            this._clusterCreationPage =
                new ClusterCreationPage(this.page);
        }

        return this._clusterCreationPage;
    }

    // =====================================================
    // NAMESPACE CREATION
    // =====================================================

    get namespaceCreationPage(): NamespaceCreationPage {

        if (!this._namespaceCreationPage) {
            this._namespaceCreationPage =
                new NamespaceCreationPage(this.page);
        }

        return this._namespaceCreationPage;
    }

    // =====================================================
    // NODES PAGE
    // =====================================================

    get nodesPage(): NodesPage {

        if (!this._nodesPage) {
            this._nodesPage =
                new NodesPage(this.page);
        }

        return this._nodesPage;
    }

    // =====================================================
    // NODES WORKFLOW
    // =====================================================

    get nodesWorkflow(): NodesWorkflow {

        if (!this._nodesWorkflow) {
            this._nodesWorkflow =
                new NodesWorkflow(
                    this.nodesPage
                );
        }

        return this._nodesWorkflow;
    }

    // =====================================================
    // PODS PAGE
    // =====================================================

    get podsPage(): PodsPage {

        if (!this._podsPage) {
            this._podsPage =
                new PodsPage(this.page);
        }

        return this._podsPage;
    }

    // =====================================================
    // PODS WORKFLOW
    // =====================================================

    get podsWorkflow(): PodsWorkflow {

        if (!this._podsWorkflow) {
            this._podsWorkflow =
                new PodsWorkflow(
                    this.podsPage
                );
        }

        return this._podsWorkflow;
    }

    // =====================================================
    // CLUSTER WORKFLOW
    // =====================================================

    get clusterWorkflow(): ClusterWorkflow {

        if (!this._clusterWorkflow) {
            this._clusterWorkflow =
                new ClusterWorkflow(
                    this.clusterDashboardPage,
                    this.clusterCreationPage,
                    this.nodesPage
                );
        }

        return this._clusterWorkflow;
    }

    // =====================================================
    // NAMESPACE WORKFLOW
    // =====================================================

    get namespaceWorkflow(): NamespaceWorkflow {

        if (!this._namespaceWorkflow) {
            this._namespaceWorkflow =
                new NamespaceWorkflow(
                    this.namespaceCreationPage
                );
        }

        return this._namespaceWorkflow;
    }
    // =====================================================
// CONTAINER REGISTRY PAGE
// =====================================================

get containerRegistryPage(): ContainerRegistryPage {

    if (!this._containerRegistryPage) {
        this._containerRegistryPage =
            new ContainerRegistryPage(this.page);
    }

    return this._containerRegistryPage;
}
// =====================================================
// CONTAINER REGISTRY WORKFLOW
// =====================================================

get containerRegistryWorkflow(): ContainerRegistryWorkflow {

    if (!this._containerRegistryWorkflow) {
        this._containerRegistryWorkflow =
            new ContainerRegistryWorkflow(
                this.containerRegistryPage
            );
    }

    return this._containerRegistryWorkflow;
}

}