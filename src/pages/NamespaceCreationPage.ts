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


        // =====================================================
        // REGISTRY INPUT
        // =====================================================

        // MUI Autocomplete actual input
        // DOM:
        // <input
        //   role="combobox"
        //   placeholder="Enter registry name"
        //   data-testid="registries_1-input"
        // >

        this.registryInput =
            this.page.getByTestId(
                'registries_1-input'
            );


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

        await this.navigate(
            `/cluster/${clusterId}/namespace/add`
        );
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

async selectRegistry(
    registryName: string
): Promise<void> {

    console.log(
        `Selecting registry: ${registryName}`
    );

    // =================================================
    // 1. WAIT FOR REGISTRY INPUT
    // =================================================

    await expect(
        this.registryInput
    ).toBeVisible({
        timeout: 15_000
    });

    // =================================================
    // 2. CLICK INPUT
    // =================================================

    await this.registryInput.click();

    // =================================================
    // 3. TYPE REGISTRY NAME
    // =================================================

    await this.registryInput.fill(
        registryName
    );

    // =================================================
    // 4. WAIT FOR DROPDOWN
    // =================================================

    const listbox =
        this.page.getByRole('listbox');

    await expect(
        listbox
    ).toBeVisible({
        timeout: 10_000
    });

    // =================================================
    // 5. FIND EXACT REGISTRY
    // =================================================

    const matchingOption =
        listbox.getByText(
            registryName,
            {
                exact: true
            }
        );

    await expect(
        matchingOption
    ).toBeVisible({
        timeout: 15_000
    });

    console.log(
        `Registry option found: ${registryName}`
    );

    // =================================================
    // 6. SELECT EXACT OPTION
    // =================================================

    await matchingOption.click({
        force: true
    });

    // =================================================
    // 7. WAIT FOR SELECTION
    // =================================================

  // =================================================
// 8. VERIFY SELECTION
// =================================================

const selectedRegistry =
    this.page
        .getByTestId('registries_1-autocomplete')
        .locator('.MuiAutocomplete-tag')
        .filter({
            hasText: registryName
        });

await expect(
    selectedRegistry
).toBeVisible({
    timeout: 10_000
});

console.log(
    `Registry selected successfully: ${registryName}`
);

    // =================================================
    // 8. CLOSE DROPDOWN
    // =================================================

    await this.registryInput.press(
        'Escape'
    );

    console.log(
        `Registry selected successfully: ${registryName}`
    );
}


    // =====================================================
    // APPLY MANIFEST
    // =====================================================

    async applyManifest(): Promise<void> {

        await expect(
            this.applyManifestButton
        ).toBeVisible({
            timeout: 30_000
        });


        await expect(
            this.applyManifestButton
        ).toBeEnabled({
            timeout: 30_000
        });


        await this.applyManifestButton.click();


        await expect(
            this.page.getByText(
                'Creating Namespace...'
            )
        ).toBeVisible({
            timeout: 15_000
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