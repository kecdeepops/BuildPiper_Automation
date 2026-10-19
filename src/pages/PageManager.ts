import { Page } from '@playwright/test';

import { ClusterCreationPage } from './ClusterCreationPage';
import { ClusterDashboardPage } from './ClusterDashboardPage';
import { LoginPage } from './LoginPage';
import { NamespaceCreationPage } from './NamespaceCreationPage';

import { ClusterWorkflow } from '../workflows/infrastructure/ClusterWorkflow';
import { NamespaceWorkflow } from '../workflows/infrastructure/NamespaceWorkflow';

export class PageManager {

    private page: Page;

    private _loginPage?: LoginPage;
    private _clusterDashboardPage?: ClusterDashboardPage;
    private _clusterCreationPage?: ClusterCreationPage;

    private _namespaceCreationPage?: NamespaceCreationPage;

    private _clusterWorkflow?: ClusterWorkflow;
    private _namespaceWorkflow?: NamespaceWorkflow;

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
    // CLUSTER WORKFLOW
    // =====================================================

    get clusterWorkflow(): ClusterWorkflow {

        if (!this._clusterWorkflow) {
            this._clusterWorkflow =
                new ClusterWorkflow(
                    this.clusterDashboardPage,
                    this.clusterCreationPage
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
}