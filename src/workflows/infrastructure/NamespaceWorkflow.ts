import { Page, Locator, expect } from '@playwright/test';
import { NamespaceCreationPage } from '../../pages/NamespaceCreationPage';

export class NamespaceWorkflow {

    constructor(
        private namespaceCreationPage: NamespaceCreationPage
    ) {}

    // =====================================================
    // CREATE NAMESPACE
    // =====================================================

    async openNamespaceCreationPage(
        clusterId: string
    ): Promise<void> {

        await this.namespaceCreationPage.open(
            clusterId
        );
    }

    async enterNamespaceName(
        namespaceName: string
    ): Promise<void> {

        await this.namespaceCreationPage
            .enterNamespaceName(
                namespaceName
            );
    }

async selectRegistry(registry: string): Promise<void> {

    await this.namespaceCreationPage
        .selectRegistry(registry);
}
   
   async applyManifest(): Promise<void> {

    await this.namespaceCreationPage
        .applyManifest();
}
    async verifyNamespaceDeploymentSuccessful(): Promise<void> {

        await this.namespaceCreationPage
            .verifyNamespaceDeploymentSuccessful();
    }

    async continueAfterDeployment(): Promise<void> {

        await this.namespaceCreationPage
            .continueAfterDeployment();
    }

    // =====================================================
    // SEARCH / VERIFY
    // =====================================================

    async searchNamespace(
        namespaceName: string
    ): Promise<void> {

        await this.namespaceCreationPage
            .searchNamespace(
                namespaceName
            );
    }

    async verifyNamespaceActive(
        namespaceName: string
    ): Promise<void> {

        await this.namespaceCreationPage
            .verifyNamespaceActive(
                namespaceName
            );
    }

    // =====================================================
    // OPEN NAMESPACE DETAILS
    // =====================================================

    async openNamespaceDetails(
        namespaceName: string
    ): Promise<void> {

        await this.namespaceCreationPage
            .openNamespaceDetails(
                namespaceName
            );
    }

    // =====================================================
    // EDIT / UPDATE
    // =====================================================

    async clickEditNamespace(): Promise<void> {

        await this.namespaceCreationPage
            .clickEditNamespace();
    }

    async updateNamespaceName(
        namespaceName: string
    ): Promise<void> {

        await this.namespaceCreationPage
            .updateNamespaceName(
                namespaceName
            );
    }

    // =====================================================
    // DELETE
    // =====================================================

    async clickDeleteNamespace(): Promise<void> {

        await this.namespaceCreationPage
            .clickDeleteNamespace();
    }

    async enterDeleteReason(
        reason: string
    ): Promise<void> {

        await this.namespaceCreationPage
            .enterDeleteReason(
                reason
            );
    }

    async deleteNamespace(): Promise<void> {

        await this.namespaceCreationPage
            .deleteNamespace();
    }

    async deleteNamespaceFromBPAndK8S(): Promise<void> {

        await this.namespaceCreationPage
            .deleteNamespaceFromBPAndK8S();
    }

    async verifyNamespaceDeleted(
        namespaceName: string
    ): Promise<void> {

        await this.namespaceCreationPage
            .verifyNamespaceDeleted(
                namespaceName
            );
    }

    async debugNamespacePage(): Promise<void> {
}

async createNamespace(
    namespaceName: string,
    registryName: string
): Promise<void> {

    await this.enterNamespaceName(namespaceName);

    await this.selectRegistry(registryName);

    await this.applyManifest();

    await this.verifyNamespaceDeploymentSuccessful();
}
}