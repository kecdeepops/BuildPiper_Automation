import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class NamespaceCreationPage extends BasePage {

    // =====================================================
    // LOCATORS
    // =====================================================

    private namespaceNameInput: Locator;
    private registryInput: Locator;
    private applyManifestButton: Locator;
    private continueButton: Locator;

    private namespaceSearchInput: Locator;
    private namespaceSearchButton: Locator;

    constructor(page: Page) {
        super(page);

        // =====================================================
        // CREATE NAMESPACE
        // =====================================================

        this.namespaceNameInput =
            this.page.locator(
                'input[name="name"]'
            );

        // New UI registry input
        this.registryInput = this.page.getByTestId('registries-autocomplete');

        this.applyManifestButton =
            this.page.getByRole(
                'button',
                {
                    name: 'Apply Manifest'
                }
            );

        this.continueButton =
            this.page.getByRole(
                'button',
                {
                    name: 'CONTINUE'
                }
            );

        // =====================================================
        // SEARCH
        // =====================================================

        // Search locator is intentionally not used for now.
        // New UI does not expose the old Name search input.
        this.namespaceSearchInput =
            this.page.locator(
                'input[placeholder="Name"], input[name="name"]'
            );

        this.namespaceSearchButton =
            this.page.locator(
                'span.ri-search-2-line'
            );
    }

    // =====================================================
    // OPEN NAMESPACE CREATION PAGE
    // =====================================================

   
async open(clusterId: string): Promise<void> {
    await this.navigate(`/cluster/${clusterId}/namespace/add`);
}

    // =====================================================
    // ENTER NAMESPACE NAME
    // =====================================================

    async enterNamespaceName(
        namespaceName: string
    ): Promise<void> {

        await expect(
            this.namespaceNameInput
        ).toBeVisible({
            timeout: 30_000
        });

        await this.namespaceNameInput.fill(
            namespaceName
        );
    }

    // =====================================================
    // SELECT REGISTRY
    // =====================================================

   // =====================================================
// SELECT REGISTRY
// =====================================================


async selectRegistry(registryName: string): Promise<void> {
    await expect(this.registryInput).toBeVisible({
        timeout: 15000
    });

    await this.registryInput.click();

    const options = this.page.getByRole('option');

    const normalizedTarget = registryName
        .replace(/[_-]/g, '-')
        .toLowerCase();

    const escapedTarget = normalizedTarget.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
    );

    const matchingOption = options.filter({
        hasText: new RegExp(`^${escapedTarget}$`, 'i')
    });

    await expect(matchingOption).toBeVisible({
        timeout: 15000
    });

    await matchingOption.click();

    const selectedRegistry = this.page.getByText(
        new RegExp(`^${escapedTarget}$`, 'i')
    );

    await expect(selectedRegistry.first()).toBeVisible({
        timeout: 10000
    });

    console.log('Registry selected:', registryName);
}


    // =====================================================
    // APPLY MANIFEST
    // =====================================================

   
async applyManifest(): Promise<void> {
    await expect(this.applyManifestButton).toBeVisible({
        timeout: 30000
    });

    await expect(this.applyManifestButton).toBeEnabled({
        timeout: 30000
    });

    await this.applyManifestButton.click();

    await expect(
        this.page.getByText('Creating Namespace...')
    ).toBeVisible({
        timeout: 15000
    });
}


    // =====================================================
    // VERIFY NAMESPACE DEPLOYMENT
    // =====================================================

    async verifyNamespaceDeploymentSuccessful(): Promise<void> {

        const successMessage =
            this.page.getByText(
                'Namespace deployed successfully!',
                {
                    exact: true
                }
            );

        const errorMessage =
            this.page.getByText(
                'Unable to create namespace.',
                {
                    exact: false
                }
            );

        await expect(
            successMessage.or(errorMessage)
        ).toBeVisible({
            timeout: 120_000
        });

        if (
            await errorMessage.isVisible()
        ) {

            throw new Error(
                'Namespace creation failed: Unable to create namespace.'
            );
        }
    }

    // =====================================================
    // CONTINUE
    // =====================================================

    async continueAfterDeployment(): Promise<void> {

        await expect(
            this.continueButton
        ).toBeVisible({
            timeout: 15_000
        });

        await this.continueButton.click();
    }

    // =====================================================
    // SEARCH NAMESPACE
    // =====================================================

    async searchNamespace(
        namespaceName: string
    ): Promise<void> {

        // New UI currently does not expose the old
        // namespace search input.
        //
        // Instead, directly locate the namespace
        // from the namespace list.

        const namespace =
            this.page.getByText(
                namespaceName,
                {
                    exact: true
                }
            );

        await expect(
            namespace
        ).toBeVisible({
            timeout: 30_000
        });
    }

    // =====================================================
    // VERIFY NAMESPACE ACTIVE
    // =====================================================

    async verifyNamespaceActive(
        namespaceName: string
    ): Promise<void> {

        await expect(
            this.page.getByText(
                'Namespaces Available',
                {
                    exact: true
                }
            )
        ).toBeVisible({
            timeout: 30_000
        });

        // Locate namespace directly
        const namespace =
            this.page.getByText(
                namespaceName,
                {
                    exact: true
                }
            );

        await expect(
            namespace
        ).toBeVisible({
            timeout: 30_000
        });

        // Get complete table row
        const row =
            namespace.locator(
                'xpath=ancestor::tr'
            );

        // Verify Active status
        await expect(
            row.getByText(
                'Active',
                {
                    exact: true
                }
            )
        ).toBeVisible({
            timeout: 30_000
        });
    }

    // =====================================================
    // VERIFY NAMESPACE EXISTS
    // =====================================================

    async verifyNamespaceExists(
        namespaceName: string
    ): Promise<void> {

        const namespace =
            this.page.getByText(
                namespaceName,
                {
                    exact: true
                }
            );

        await expect(
            namespace
        ).toBeVisible({
            timeout: 15_000
        });
    }

    // =====================================================
    // OPEN NAMESPACE DETAILS
    // =====================================================

    async openNamespaceDetails(
        namespaceName: string
    ): Promise<void> {

        const namespace =
            this.page.getByText(
                namespaceName,
                {
                    exact: true
                }
            );

        await expect(
            namespace
        ).toBeVisible({
            timeout: 30_000
        });

        await namespace.click();
    }

    // =====================================================
    // EDIT NAMESPACE
    // =====================================================

    async clickEditNamespace(): Promise<void> {

        const editButton =
            this.page.getByRole(
                'button',
                {
                    name: /edit/i
                }
            );

        await expect(
            editButton
        ).toBeVisible({
            timeout: 15_000
        });

        await editButton.click();
    }

    // =====================================================
    // UPDATE NAMESPACE NAME
    // =====================================================

    async updateNamespaceName(
        namespaceName: string
    ): Promise<void> {

        await expect(
            this.namespaceNameInput
        ).toBeVisible({
            timeout: 30_000
        });

        await this.namespaceNameInput.fill(
            namespaceName
        );
    }

    // =====================================================
    // DELETE NAMESPACE
    // =====================================================

    async clickDeleteNamespace(): Promise<void> {

        const deleteButton =
            this.page.getByRole(
                'button',
                {
                    name: /delete/i
                }
            );

        await expect(
            deleteButton
        ).toBeVisible({
            timeout: 15_000
        });

        await deleteButton.click();
    }

    // =====================================================
    // ENTER DELETE REASON
    // =====================================================

    async enterDeleteReason(
        reason: string
    ): Promise<void> {

        const reasonInput =
            this.page.locator(
                'textarea'
            );

        await expect(
            reasonInput
        ).toBeVisible({
            timeout: 15_000
        });

        await reasonInput.fill(
            reason
        );
    }

    // =====================================================
    // DELETE NAMESPACE
    // =====================================================

    async deleteNamespace(): Promise<void> {

        const deleteButton =
            this.page.getByRole(
                'button',
                {
                    name: /delete/i
                }
            );

        await expect(
            deleteButton
        ).toBeVisible({
            timeout: 15_000
        });

        await deleteButton.click();
    }

    // =====================================================
    // DELETE FROM BP AND K8S
    // =====================================================

    async deleteNamespaceFromBPAndK8S(): Promise<void> {

        const deleteButton =
            this.page.getByRole(
                'button',
                {
                    name: /delete/i
                }
            );

        await expect(
            deleteButton
        ).toBeVisible({
            timeout: 15_000
        });

        await deleteButton.click();
    }

    // =====================================================
    // VERIFY NAMESPACE DELETED
    // =====================================================

    async verifyNamespaceDeleted(
        namespaceName: string
    ): Promise<void> {

        await expect(
            this.page.getByText(
                namespaceName,
                {
                    exact: true
                }
            )
        ).not.toBeVisible({
            timeout: 30_000
        });
    }

    

}