// tests/ui/manageApplication.spec.ts

import { test } from '@playwright/test';
import { PageManager } from '../../src/pages/PageManager';

test.describe('Manage Application', () => {

    test(
        'Create Application successfully',
        async ({ page }) => {

            // =================================================
            // PAGE MANAGER
            // =================================================

            const pageManager =
                new PageManager(page);

            // =================================================
            // TEST DATA
            // =================================================

            const applicationName =
                `automation-app-${Date.now()}`;

            const description =
                'Application created through Playwright automation';

            const policyTemplate =
                'Default-policy-template';

            console.log(
                `Application name: ${applicationName}`
            );

            // =================================================
            // OPEN MANAGE APPLICATION
            // =================================================

            await pageManager
                .manageApplicationWorkflow
                .openManageApplication();

            // =================================================
            // OPEN ADD APPLICATION
            // =================================================

            await pageManager
                .manageApplicationWorkflow
                .openAddApplication();

            // =================================================
            // ENTER BASIC INFORMATION
            // =================================================

            await pageManager
                .manageApplicationWorkflow
                .enterBasicInformation(
                    applicationName,
                    description
                );

            // =================================================
            // SELECT POLICY TEMPLATE
            // =================================================

            await pageManager
                .manageApplicationWorkflow
                .selectPolicyTemplate(
                    policyTemplate
                );

            console.log(
                'Basic application information completed successfully'
            );

            // =================================================
            // SELECT JOB TEMPLATE
            // =================================================

            await pageManager
                .manageApplicationWorkflow
                .selectJobTemplate();

            // =================================================
            // CONTINUE TO APPLICATION TYPES
            // =================================================

            await pageManager
                .manageApplicationWorkflow
                .continueToChooseTypes();

            // =================================================
            // NO selectApplicationTypes() HERE
            //
            // continueToChooseTypes() already handles:
            //
            // 1. Continue
            // 2. Mobile
            // 3. Microservice
            // 4. VM Based
            // 5. Next
            // 6. VM Groups
            // 7. Registry
            // 8. Credential
            // =================================================

            console.log(
                'Application type configuration completed'
            );

            // =================================================
            // NEXT PAGE
            // =================================================

            await pageManager
                .manageApplicationWorkflow
                .clickNextAfterConfiguration();

            console.log(
                'Moved to the next application configuration page'
            );

await pageManager
    .manageApplicationWorkflow
    .selectMicroserviceCluster();
        }
    );

});