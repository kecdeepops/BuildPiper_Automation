import { Page } from '@playwright/test';

import { LoginPage } from './LoginPage';
import { ClusterDashboardPage } from './ClusterDashboardPage';
import { ClusterWorkflow } from '../workflows/infrastructure/ClusterWorkflow';

export class PageManager {

    private page: Page;

    private _loginPage?: LoginPage;
    private _clusterDashboardPage?: ClusterDashboardPage;
    private _clusterWorkflow?: ClusterWorkflow;

    constructor(page: Page) {
        this.page = page;
    }

    get loginPage(): LoginPage {

        if (!this._loginPage) {
            this._loginPage = new LoginPage(this.page);
        }

        return this._loginPage;
    }

    get clusterDashboardPage(): ClusterDashboardPage {

        if (!this._clusterDashboardPage) {
            this._clusterDashboardPage =
                new ClusterDashboardPage(this.page);
        }

        return this._clusterDashboardPage;
    }

    get clusterWorkflow(): ClusterWorkflow {

        if (!this._clusterWorkflow) {
            this._clusterWorkflow =
                new ClusterWorkflow(
                    this.clusterDashboardPage
                );
        }

        return this._clusterWorkflow;
    }
}