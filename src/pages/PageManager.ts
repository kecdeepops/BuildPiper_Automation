import { Page } from '@playwright/test';

import { ClusterCreationPage } from './ClusterCreationPage';
import { ClusterDashboardPage } from './ClusterDashboardPage';
import { LoginPage } from './LoginPage';
import { NamespaceCreationPage } from './NamespaceCreationPage';
import { NodesPage } from './NodesPage';
import { PodsPage } from './PodsPage';
import { ContainerRegistryPage } from './ContainerRegistryPage';
import { RepositoryPage } from './RepositoryPage';
import { ManageApplicationPage } from './ManageApplicationPage';

import { PodsWorkflow } from '../workflows/infrastructure/PodsWorkflow';
import { ClusterWorkflow } from '../workflows/infrastructure/ClusterWorkflow';
import { NamespaceWorkflow } from '../workflows/infrastructure/NamespaceWorkflow';
import { NodesWorkflow } from '../workflows/infrastructure/NodesWorkflow';

import { ContainerRegistryWorkflow } from '../workflows/integration/ContainerRegistryWorkflow';
import { RepositoryWorkflow } from '../workflows/integration/RepositoryWorkflow';
import { ManageApplicationWorkflow } from '../workflows/ManageApplication/ManageApplicationWorkflow';


export class PageManager {

    private readonly page: Page;

    // =====================================================
    // PAGE OBJECTS
    // =====================================================

    private _loginPage?: LoginPage;
    private _clusterDashboardPage?: ClusterDashboardPage;
    private _clusterCreationPage?: ClusterCreationPage;
    private _namespaceCreationPage?: NamespaceCreationPage;
    private _nodesPage?: NodesPage;
    private _podsPage?: PodsPage;
    private _containerRegistryPage?: ContainerRegistryPage;
    private _repositoryPage?: RepositoryPage;
    private _manageApplicationPage?: ManageApplicationPage;


    // =====================================================
    // WORKFLOWS
    // =====================================================

    private _nodesWorkflow?: NodesWorkflow;
    private _podsWorkflow?: PodsWorkflow;
    private _clusterWorkflow?: ClusterWorkflow;
    private _namespaceWorkflow?: NamespaceWorkflow;
    private _containerRegistryWorkflow?: ContainerRegistryWorkflow;
    private _repositoryWorkflow?: RepositoryWorkflow;
    private _manageApplicationWorkflow?: ManageApplicationWorkflow;


    constructor(page: Page) {
        this.page = page;
    }


    // =====================================================
    // LOGIN
    // =====================================================

    get loginPage(): LoginPage {

        if (!this._loginPage) {
            this._loginPage = new LoginPage(this.page);
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
                new NodesWorkflow(this.nodesPage);
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
                new PodsWorkflow(this.podsPage);
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


    // =====================================================
    // REPOSITORY PAGE
    // =====================================================

    get repositoryPage(): RepositoryPage {

        if (!this._repositoryPage) {
            this._repositoryPage =
                new RepositoryPage(this.page);
        }

        return this._repositoryPage;
    }


    // =====================================================
    // REPOSITORY WORKFLOW
    // =====================================================

    get repositoryWorkflow(): RepositoryWorkflow {

        if (!this._repositoryWorkflow) {
            this._repositoryWorkflow =
                new RepositoryWorkflow(
                    this.repositoryPage
                );
        }

        return this._repositoryWorkflow;
    }


    // =====================================================
    // MANAGE APPLICATION PAGE
    // =====================================================

    get manageApplicationPage(): ManageApplicationPage {

        if (!this._manageApplicationPage) {
            this._manageApplicationPage =
                new ManageApplicationPage(this.page);
        }

        return this._manageApplicationPage;
    }


    // =====================================================
    // MANAGE APPLICATION WORKFLOW
    // =====================================================

    get manageApplicationWorkflow(): ManageApplicationWorkflow {

        if (!this._manageApplicationWorkflow) {
            this._manageApplicationWorkflow =
                new ManageApplicationWorkflow(
                    this.clusterDashboardPage,
                    this.manageApplicationPage
                );
        }

        return this._manageApplicationWorkflow;
    }
}