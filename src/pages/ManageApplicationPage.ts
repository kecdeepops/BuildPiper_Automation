// src/pages/ManageApplicationPage.ts

import { expect, Page, Locator } from '@playwright/test';

export class ManageApplicationPage {

    private readonly page: Page;

    // =====================================================
    // LOCATORS
    // =====================================================

    private readonly manageApplicationMenu: Locator;
    private readonly appsSummary: Locator;
    private readonly addApplicationButton: Locator;

    // =====================================================
    // BASIC INFORMATION
    // =====================================================

    private readonly applicationNameInput: Locator;
    private readonly applicationDescriptionInput: Locator;
    private readonly policyTemplateInput: Locator;
    private readonly jobTemplateDropdown: Locator;
    private readonly continueButton: Locator;

    // =====================================================
    // CHOOSE TYPES
    // =====================================================

    private readonly mobileOption: Locator;
    private readonly microserviceOption: Locator;
    private readonly vmBasedOption: Locator;
    private readonly nextButton: Locator;

    // =====================================================
    // VM BASED
    // =====================================================

    private readonly vmGroupsDropdown: Locator;
    private readonly selectAllVmGroupsCheckbox: Locator;

    // =====================================================
    // REGISTRY
    // =====================================================

    private readonly registryInput: Locator;
    private readonly registryOptions: Locator;

    // =====================================================
    // CREDENTIAL
    // =====================================================

    private readonly credentialInput: Locator;
    private readonly credentialOptions: Locator;

    // =====================================================
    // MICROSERVICE
    // =====================================================

    readonly clusterInput: Locator;
    readonly namespaceInput: Locator;
    private readonly dedicatedClusterToggle: Locator;

    // =====================================================
    // BUTTONS
    // =====================================================

    readonly backButton: Locator;
    readonly saveAndExitButton: Locator;
    readonly submitButton: Locator;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    constructor(page: Page) {

        this.page = page;

        // =================================================
        // MANAGE APPLICATION
        // =================================================

        this.manageApplicationMenu =
            this.page.getByTestId('Manage-Application');

        this.appsSummary =
            this.page
                .getByRole('main')
                .getByText('Apps Summary', {
                    exact: true
                });

        this.addApplicationButton =
            this.page.getByTestId('app-list-add-btn');


        // =================================================
        // BASIC INFORMATION
        // =================================================

        this.applicationNameInput =
            this.page
                .locator('input[placeholder="Enter"]')
                .first();

        this.applicationDescriptionInput =
            this.page.locator(
                'textarea[placeholder="Descriptions"]'
            );

        this.policyTemplateInput =
            this.page.locator(
                'input#policy_template_id'
            );

        this.jobTemplateDropdown =
            this.page
                .getByRole('button')
                .filter({
                    hasText: 'Please Select'
                })
                .first();


        // =================================================
        // CONTINUE
        // =================================================

        this.continueButton =
            this.page.getByRole('button', {
                name: 'Continue',
                exact: true
            });


        // =================================================
        // CHOOSE TYPES
        // =================================================

        this.mobileOption =
            this.page.getByText('Mobile', {
                exact: true
            });

        this.microserviceOption =
            this.page.getByText('Microservice', {
                exact: true
            });

        this.vmBasedOption =
            this.page.getByText('VM Based', {
                exact: true
            });

        this.nextButton =
            this.page.getByRole('button', {
                name: 'Next',
                exact: true
            });


        // =================================================
        // VM GROUP
        // =================================================

        /*
         * IMPORTANT:
         *
         * Do not locate VM Group using
         * "Please Select".
         *
         * After selection its text becomes "test-vm".
         *
         * Stable locator:
         * data-testid="app-form-vmgroup"
         */

        this.vmGroupsDropdown =
            this.page
                .getByTestId('app-form-vmgroup')
                .locator('div[role="button"]');

        this.selectAllVmGroupsCheckbox =
            this.page
                .getByTestId('app-form-vmgroup')
                .locator(
                    'input[name="all_checkbox"]'
                );


        // =================================================
        // REGISTRY
        // =================================================

        /*
         * Registry DOM:
         *
         * placeholder="Select registry"
         *
         * This is more reliable than using
         * input#tags-filled because the id is generic.
         */

        this.registryInput =
            this.page.getByPlaceholder(
                'Select registry',
                {
                    exact: true
                }
            );

        /*
         * Registry dropdown is rendered as a MUI
         * listbox/option popup.
         *
         * :visible prevents us from accidentally
         * picking options from another hidden dropdown.
         */

        this.registryOptions =
            this.page.locator(
                '[role="listbox"]:visible [role="option"]'
            );


        // =================================================
        // CREDENTIAL
        // =================================================

        this.credentialInput =
            this.page.locator(
                'input#credential_id'
            );

        this.credentialOptions =
            this.page.locator(
                '[role="listbox"]:visible [role="option"]'
            );


        // =================================================
        // MICROSERVICE
        // =================================================

        this.clusterInput =
            this.page.locator(
                'input#cluster_id'
            );

        this.namespaceInput =
            this.page.getByTestId(
                'namespaces_disabled-input'
            );

        this.dedicatedClusterToggle =
            this.page.locator(
                'input[name="dedicated_cluster"]'
            );


        // =================================================
        // BUTTONS
        // =================================================

        this.backButton =
            this.page.getByRole('button', {
                name: 'BACK'
            });

        this.saveAndExitButton =
            this.page.getByRole('button', {
                name: 'SAVE & EXIT'
            });

        this.submitButton =
            this.page.getByRole('button', {
                name: 'SUBMIT'
            });
    }


    // =====================================================
    // OPEN MANAGE APPLICATION
    // =====================================================

    async openManageApplication(): Promise<void> {

        console.log(
            'Page: Opening Manage Application from left menu'
        );

        await expect(
            this.manageApplicationMenu
        ).toBeVisible({
            timeout: 15_000
        });

        await this.manageApplicationMenu.click();

        await expect(
            this.appsSummary
        ).toBeVisible({
            timeout: 15_000
        });

        console.log(
            `Manage Application opened: ${this.page.url()}`
        );
    }


    // =====================================================
    // CLICK ADD APPLICATION
    // =====================================================

    async clickAddApplication(): Promise<void> {

        console.log(
            'Page: Clicking ADD APPLICATION'
        );

        await expect(
            this.addApplicationButton
        ).toBeVisible({
            timeout: 15_000
        });

        await this.addApplicationButton.click();

        await this.page.waitForURL(
            '**/project/add',
            {
                timeout: 15_000
            }
        );

        // Zoom out so complete form is easier to work with
        await this.page.evaluate(() => {
            document.body.style.zoom = '70%';
        });

        console.log(
            `Add Application page opened: ${this.page.url()}`
        );
    }


    // =====================================================
    // ENTER APPLICATION NAME
    // =====================================================

    async enterApplicationName(
        applicationName: string
    ): Promise<void> {

        console.log(
            `Entering application name: ${applicationName}`
        );

        await expect(
            this.applicationNameInput
        ).toBeVisible({
            timeout: 10_000
        });

        await this.applicationNameInput.fill(
            applicationName
        );

        console.log(
            'Application name entered successfully'
        );
    }


    // =====================================================
    // ENTER APPLICATION DESCRIPTION
    // =====================================================

    async enterApplicationDescription(
        description: string
    ): Promise<void> {

        console.log(
            'Entering application description'
        );

        await expect(
            this.applicationDescriptionInput
        ).toBeVisible({
            timeout: 10_000
        });

        await this.applicationDescriptionInput.fill(
            description
        );

        console.log(
            'Application description entered successfully'
        );
    }


    // =====================================================
    // SELECT POLICY TEMPLATE
    // =====================================================

    async selectPolicyTemplate(
        policyTemplate: string
    ): Promise<void> {

        console.log(
            `Selecting policy template: ${policyTemplate}`
        );

        await this.policyTemplateInput
            .scrollIntoViewIfNeeded();

        await expect(
            this.policyTemplateInput
        ).toBeVisible({
            timeout: 15_000
        });

        await this.policyTemplateInput.click();

        console.log(
            'Policy Template dropdown opened'
        );

        const policyOption =
            this.page.getByText(
                policyTemplate,
                {
                    exact: true
                }
            );

        await expect(
            policyOption
        ).toBeVisible({
            timeout: 10_000
        });

        await policyOption.click();

        console.log(
            `Policy template selected: ${policyTemplate}`
        );
    }


    // =====================================================
    // SELECT FIRST JOB TEMPLATE
    // =====================================================

    async selectFirstJobTemplate(): Promise<void> {

        console.log(
            'Selecting first Job Template'
        );

        await this.jobTemplateDropdown.click();

        const options =
            this.page.locator(
                '[role="button"].env-item'
            );

        console.log(
            'Job Template Options:',
            await options.allTextContents()
        );

        await expect(
            options.first()
        ).toBeVisible({
            timeout: 10_000
        });

        await options.first().click();

        console.log(
            'First Job Template selected'
        );
    }


    // =====================================================
    // CLICK CONTINUE
    // =====================================================

    async clickContinue(): Promise<void> {

        await expect(
            this.continueButton
        ).toBeVisible({
            timeout: 15_000
        });

        await expect(
            this.continueButton
        ).toBeEnabled();

        await this.continueButton.click();

        console.log(
            'Continue clicked successfully'
        );

        await this.page.waitForTimeout(1000);
    }


    // =====================================================
    // SELECT APPLICATION TYPES
    // =====================================================

    async selectApplicationTypes(): Promise<void> {

        const types = [
            this.mobileOption,
            this.microserviceOption,
            this.vmBasedOption
        ];

        for (const option of types) {

            await expect(
                option
            ).toBeVisible({
                timeout: 10_000
            });

            await option.scrollIntoViewIfNeeded();

            await option.click();

            await this.page.waitForTimeout(500);
        }

        console.log(
            'Mobile, Microservice and VM Based selected'
        );
    }


    // =====================================================
    // CLICK NEXT - CHOOSE TYPES
    // =====================================================

    async clickNext(): Promise<void> {

        console.log(
            'Clicking Next on Choose Types'
        );

        await expect(
            this.nextButton
        ).toBeVisible({
            timeout: 10_000
        });

        await expect(
            this.nextButton
        ).toBeEnabled();

        await this.nextButton.click();

        console.log(
            'Next clicked successfully'
        );

        // Allow VM Based section to render
        await this.page.waitForTimeout(1500);

        
    }


    // =====================================================
    // SELECT ALL VM GROUPS
    // =====================================================

    async selectAllVmGroups(): Promise<void> {

        console.log(
            'Opening VM Groups dropdown'
        );

        await expect(
            this.vmGroupsDropdown
        ).toBeVisible({
            timeout: 15_000
        });

        await expect(
            this.vmGroupsDropdown
        ).toBeEnabled();

        await this.vmGroupsDropdown
            .scrollIntoViewIfNeeded();

        console.log(
            'VM Groups dropdown is visible'
        );

        // ---------------------------------------------
        // OPEN VM GROUP DROPDOWN
        // ---------------------------------------------

        await this.vmGroupsDropdown.click();

        console.log(
            'VM Groups dropdown opened'
        );

        // ---------------------------------------------
        // WAIT FOR CHECKBOX
        // ---------------------------------------------

        await expect(
            this.selectAllVmGroupsCheckbox
        ).toBeVisible({
            timeout: 10_000
        });

        // ---------------------------------------------
        // SELECT ALL
        // ---------------------------------------------

        const isChecked =
            await this.selectAllVmGroupsCheckbox.isChecked();

        console.log(
            'Select All checkbox current state:',
            isChecked
        );

        if (!isChecked) {

            await this.selectAllVmGroupsCheckbox.check();

            console.log(
                'Selected all VM Groups'
            );

        } else {

            console.log(
                'All VM Groups are already selected'
            );
        }

        // Give React/MUI time to update
        await this.page.waitForTimeout(1000);

        // ---------------------------------------------
        // CLOSE VM GROUP DROPDOWN
        // ---------------------------------------------

        /*
         * Click the SAME VM Group trigger.
         *
         * Do NOT click Registry while VM dropdown
         * is still open.
         */

        await this.vmGroupsDropdown.click();

        console.log(
            'VM Groups dropdown closed'
        );

        await this.page.waitForTimeout(1000);

        // ---------------------------------------------
        // IMPORTANT
        // ---------------------------------------------
        //
        // Wait until Registry is visible again.
        //
        // VM Group popup hides the Registry field.
        //

        await expect(
            this.registryInput
        ).toBeVisible({
            timeout: 10_000
        });

        console.log(
            'Registry field is visible after VM Group dropdown closed'
        );
    }


    // =====================================================
    // SELECT FIRST REGISTRY
    // =====================================================

    async selectFirstRegistry(): Promise<void> {

        console.log(
            'Opening Registry dropdown'
        );

        // ---------------------------------------------
        // WAIT FOR REGISTRY FIELD
        // ---------------------------------------------

        await expect(
            this.registryInput
        ).toBeVisible({
            timeout: 15_000
        });

        await expect(
            this.registryInput
        ).toBeEnabled();

        await this.registryInput
            .scrollIntoViewIfNeeded();

        console.log(
            'Registry field is visible'
        );

        // ---------------------------------------------
        // CLICK REGISTRY
        // ---------------------------------------------

        await this.registryInput.click();

        console.log(
            'Registry dropdown clicked'
        );

        // ---------------------------------------------
        // WAIT FOR DROPDOWN TO OPEN
        // ---------------------------------------------

        await expect(
            this.registryOptions.first()
        ).toBeVisible({
            timeout: 10_000
        });

        console.log(
            'Registry dropdown opened'
        );

        console.log(
            'Registry options:',
            await this.registryOptions.allTextContents()
        );

        // =================================================
        // DEBUG WAIT
        // =================================================
        //
        // Keep Registry dropdown open for 5 seconds.
        // This is intentionally added so you can visually
        // confirm that the Registry dropdown is opening.
        //

        console.log(
            'Keeping Registry dropdown open for 5 seconds for verification...'
        );

        await this.page.waitForTimeout(5000);

        console.log(
            'Registry 5-second verification wait completed'
        );

        // ---------------------------------------------
        // SELECT FIRST REGISTRY
        // ---------------------------------------------

        await expect(
            this.registryOptions.first()
        ).toBeVisible({
            timeout: 10_000
        });

        await this.registryOptions
            .first()
            .click();

        console.log(
            'First Registry selected'
        );

        await this.page.waitForTimeout(500);
    }


    // =====================================================
    // SELECT FIRST CREDENTIAL
    // =====================================================

    async selectFirstCredential(): Promise<void> {

        console.log(
            'Opening Credential dropdown'
        );

        await expect(
            this.credentialInput
        ).toBeVisible({
            timeout: 15_000
        });

        await expect(
            this.credentialInput
        ).toBeEnabled();

        await this.credentialInput
            .scrollIntoViewIfNeeded();

        console.log(
            'Credential dropdown is visible'
        );

        await this.credentialInput.click();

        console.log(
            'Credential dropdown opened'
        );

        await expect(
            this.credentialOptions.first()
        ).toBeVisible({
            timeout: 10_000
        });

        console.log(
            'Credential options:',
            await this.credentialOptions.allTextContents()
        );

        await this.credentialOptions
            .first()
            .click();

        console.log(
            'First credential selected'
        );

        await this.page.waitForTimeout(500);
    }


    // =====================================================
    // CONFIGURE VM BASED
    // =====================================================

    async configureVmBased(): Promise<void> {

        /*
         * IMPORTANT FLOW:
         *
         * 1. VM Group
         * 2. Close VM Group
         * 3. Registry
         * 4. Credential
         */

        await this.selectAllVmGroups();

        await this.selectFirstRegistry();

        await this.selectFirstCredential();

        console.log(
            'VM Based configuration completed'
        );
    }


    // =====================================================
    // COMPLETE CHOOSE TYPES + VM BASED FLOW
    // =====================================================

    async configureApplicationTypes(): Promise<void> {

        // ---------------------------------------------
        // 1. Select application types
        // ---------------------------------------------

        await this.selectApplicationTypes();

        // ---------------------------------------------
        // 2. Click Next
        // ---------------------------------------------

        await this.clickNext();

        // ---------------------------------------------
        // 3. Configure VM Based
        //
        // VM Group
        // Registry
        // Credential
        // ---------------------------------------------

        await this.configureVmBased();

        console.log(
            'Application Types configuration completed'
        );
    }


    // =====================================================
    // SELECT FIRST CLUSTER
    // =====================================================

    async selectFirstCluster(): Promise<void> {

        console.log(
            'Opening Cluster dropdown'
        );

        await this.clusterInput
            .scrollIntoViewIfNeeded();

        await expect(
            this.clusterInput
        ).toBeVisible({
            timeout: 10_000
        });

        await this.clusterInput.click();

        console.log(
            'Cluster dropdown opened'
        );

        await this.page.waitForTimeout(1000);

        const options =
            this.page.locator(
                '[role="listbox"]:visible [role="option"]'
            );

        console.log(
            'Cluster options:',
            await options.allTextContents()
        );

        await expect(
            options.first()
        ).toBeVisible({
            timeout: 10_000
        });

        await options.first().click();

        console.log(
            'First cluster selected'
        );
    }


    // =====================================================
    // CONFIGURE MICROSERVICE
    // =====================================================

    async configureMicroservice(): Promise<void> {

        console.log(
            'Opening Cluster dropdown'
        );

        await this.clusterInput
            .scrollIntoViewIfNeeded();

        await expect(
            this.clusterInput
        ).toBeVisible({
            timeout: 10_000
        });

        await this.clusterInput.click();

        console.log(
            'Cluster dropdown opened'
        );

        await this.page.waitForTimeout(1000);

        const clusterOptions =
            this.page.locator(
                '[role="listbox"]:visible [role="option"]'
            );

        console.log(
            'Cluster options:',
            await clusterOptions.allTextContents()
        );

        await expect(
            clusterOptions.first()
        ).toBeVisible({
            timeout: 10_000
        });

        await clusterOptions
            .first()
            .click();

        console.log(
            'Cluster selected'
        );

        // ---------------------------------------------
        // DEDICATED CLUSTER
        // ---------------------------------------------

        console.log(
            'Checking Dedicated Cluster state'
        );

        const dedicatedClusterChecked =
            await this.dedicatedClusterToggle.isChecked();

        console.log(
            'Dedicated Cluster enabled:',
            dedicatedClusterChecked
        );

        if (!dedicatedClusterChecked) {

            await expect(
                this.namespaceInput
            ).toBeDisabled();

            console.log(
                'Namespace is disabled because Dedicated Cluster is OFF'
            );

        } else {

            console.log(
                'Dedicated Cluster is ON - Namespace should be available'
            );
        }
    }


    // =====================================================
    // VERIFY APPS SUMMARY
    // =====================================================

    async verifyAppsSummary(): Promise<void> {

        console.log(
            'Verifying Apps Summary'
        );

        await expect(
            this.appsSummary
        ).toBeVisible({
            timeout: 15_000
        });

        console.log(
            'Apps Summary is visible'
        );
    }


    // =====================================================
    // VERIFY ADD APPLICATION PAGE
    // =====================================================

    async verifyAddApplicationPage(): Promise<void> {

        console.log(
            'Verifying Add Application page'
        );

        await expect(
            this.applicationNameInput
        ).toBeVisible({
            timeout: 15_000
        });

        console.log(
            `Add Application page verified: ${this.page.url()}`
        );
    }


    // =====================================================
    // SAVE & EXIT APPLICATION
    // =====================================================

    async saveAndExitApplication(): Promise<void> {

        console.log(
            'Save & Exit Application'
        );

        // Implementation can be added when required
    }
}