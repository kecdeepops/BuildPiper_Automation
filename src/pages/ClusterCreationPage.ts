
import { Page, Locator, expect } from '@playwright/test';
import path from 'node:path';
import { BasePage } from './BasePage';

export class ClusterCreationPage extends BasePage {

    private clusterNameInput: Locator;
    private kubeConfigInput: Locator;
    private applyManifestButton: Locator;
    private finishSetupButton: Locator;
    private onboardingSuccessMessage: Locator;

    constructor(page: Page) {
        super(page);

        this.clusterNameInput =
            this.page.locator('input[name="name"]');

        this.kubeConfigInput =
            this.page.locator('input[name="kube_config"]');

        this.applyManifestButton =
            this.page.getByRole('button', {
                name: 'Apply Manifest'
            });

        this.finishSetupButton =
            this.page.getByRole('button', {
                name: 'FINISH SETUP'
            });

        this.onboardingSuccessMessage =
            this.page.getByText(
                'Congrats, Cluster onboarded successfully!'
            );
    }

    async open(): Promise<void> {
        await this.navigate('/cluster/add/firstpage');
    }

    async enterClusterName(
        clusterName: string
    ): Promise<void> {
        await this.clusterNameInput.fill(clusterName);
    }

    async uploadKubeConfig(
        filePath: string
    ): Promise<void> {
        const absolutePath = path.resolve(filePath);

        await this.kubeConfigInput.setInputFiles(
            absolutePath
        );
    }

    async applyManifest(): Promise<void> {
        await this.applyManifestButton.click();
    }

    async verifyOnboardingSuccessful(): Promise<void> {
        await expect(
            this.onboardingSuccessMessage
        ).toBeVisible({
            timeout: 120_000
        });
    }

    async finishSetup(): Promise<void> {
        await this.finishSetupButton.click();
    }

    async selectInfrastructureProvider(
    provider: string
): Promise<void> {
    const providerLabel = this.page.getByText(
        provider,
        { exact: true }
    );

    await expect(providerLabel).toBeVisible();
    await providerLabel.click();
}
}
