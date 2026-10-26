// src/workflows/ManageApplication/ManageApplicationWorkflow.ts

import { ClusterDashboardPage } from '../../pages/ClusterDashboardPage';
import { ManageApplicationPage } from '../../pages/ManageApplicationPage';

export class ManageApplicationWorkflow {

    constructor(
        private readonly clusterDashboardPage: ClusterDashboardPage,
        private readonly manageApplicationPage: ManageApplicationPage
    ) {}


    // =====================================================
    // OPEN MANAGE APPLICATION
    // =====================================================

    async openManageApplication(): Promise<void> {

        console.log(
            'Workflow: Opening Manage Application'
        );

        // ---------------------------------------------
        // STEP 1: OPEN CLUSTER DASHBOARD
        // ---------------------------------------------

        console.log(
            'Workflow: Opening Cluster Dashboard'
        );

        await this.clusterDashboardPage
            .openClusterDashboard();

        // ---------------------------------------------
        // STEP 2: OPEN MANAGE APPLICATION
        // ---------------------------------------------

        console.log(
            'Workflow: Selecting Manage Application from left menu'
        );

        await this.manageApplicationPage
            .openManageApplication();

        console.log(
            'Workflow: Manage Application opened successfully'
        );
    }


    // =====================================================
    // OPEN ADD APPLICATION
    // =====================================================

    async openAddApplication(): Promise<void> {

        console.log(
            'Workflow: Opening Add Application'
        );

        await this.manageApplicationPage
            .clickAddApplication();
    }


    // =====================================================
    // ENTER BASIC INFORMATION
    // =====================================================

    async enterBasicInformation(
        applicationName: string,
        description: string
    ): Promise<void> {

        console.log(
            'Workflow: Entering basic application information'
        );

        await this.manageApplicationPage
            .enterApplicationName(
                applicationName
            );

        await this.manageApplicationPage
            .enterApplicationDescription(
                description
            );
    }


    // =====================================================
    // SELECT POLICY TEMPLATE
    // =====================================================

    async selectPolicyTemplate(
        policyTemplate: string
    ): Promise<void> {

        console.log(
            `Workflow: Selecting policy template - ${policyTemplate}`
        );

        await this.manageApplicationPage
            .selectPolicyTemplate(
                policyTemplate
            );
    }


    // =====================================================
    // SELECT JOB TEMPLATE
    // =====================================================

    async selectJobTemplate(): Promise<void> {

        console.log(
            'Workflow: Selecting first Job Template'
        );

        await this.manageApplicationPage
            .selectFirstJobTemplate();
    }


    // =====================================================
    // CONTINUE TO CHOOSE TYPES
    // =====================================================

    async continueToChooseTypes(): Promise<void> {

        console.log(
            'Workflow: Continuing to Choose Types'
        );

        // ---------------------------------------------
        // STEP 1: Continue from Basic Information
        // ---------------------------------------------

        await this.manageApplicationPage
            .clickContinue();

        // ---------------------------------------------
        // STEP 2: Select Mobile,
        //         Microservice and VM Based
        // ---------------------------------------------

        await this.manageApplicationPage
            .selectApplicationTypes();

        // ---------------------------------------------
        // STEP 3: Click Next
        // ---------------------------------------------

        await this.manageApplicationPage
            .clickNext();

        // ---------------------------------------------
        // STEP 4: VM Based configuration
        //
        // VM Group
        // Registry
        // Credential
        // ---------------------------------------------

        await this.manageApplicationPage
            .configureVmBased();

        console.log(
            'Workflow: Choose Types + VM Based completed successfully'
        );
    }


    // =====================================================
    // SELECT APPLICATION TYPES
    // =====================================================

    async selectApplicationTypes(): Promise<void> {

        await this.manageApplicationPage
            .selectApplicationTypes();
    }


    // =====================================================
    // SELECT FIRST REGISTRY
    // =====================================================

    async selectFirstRegistry(): Promise<void> {

        console.log(
            'Workflow: Selecting first Registry'
        );

        await this.manageApplicationPage
            .selectFirstRegistry();
    }


    // =====================================================
    // SELECT FIRST CREDENTIAL
    // =====================================================

    async selectFirstCredential(): Promise<void> {

        console.log(
            'Workflow: Selecting first Credential'
        );

        await this.manageApplicationPage
            .selectFirstCredential();
              await this.manageApplicationPage
            .clickNext();
    }


    // =====================================================
    // CONFIGURE VM BASED
    // =====================================================

    async configureVmBased(): Promise<void> {

        console.log(
            'Workflow: Configuring VM Based'
        );

        await this.manageApplicationPage
            .configureVmBased();
    }


    // =====================================================
    // SELECT FIRST CLUSTER
    // =====================================================

    async selectFirstCluster(): Promise<void> {

        console.log(
            'Workflow: Selecting first Cluster'
        );

        await this.manageApplicationPage
            .selectFirstCluster();
    }


    // =====================================================
    // CONFIGURE MICROSERVICE
    // =====================================================

    async configureMicroservice(): Promise<void> {

        console.log(
            'Workflow: Configuring Microservice'
        );

        await this.manageApplicationPage
            .configureMicroservice();
    }


    // =====================================================
    // VERIFY APPS SUMMARY
    // =====================================================

    async verifyAppsSummary(): Promise<void> {

        console.log(
            'Workflow: Verifying Apps Summary'
        );

        await this.manageApplicationPage
            .verifyAppsSummary();
    }


    // =====================================================
    // SAVE & EXIT APPLICATION
    // =====================================================

    async saveAndExitApplication(): Promise<void> {

        console.log(
            'Workflow: Saving and exiting application'
        );

        await this.manageApplicationPage
            .saveAndExitApplication();
    }


    // =====================================================
    // VERIFY ADD APPLICATION PAGE
    // =====================================================

    async verifyAddApplicationPage(): Promise<void> {

        console.log(
            'Workflow: Verifying Add Application page'
        );

        await this.manageApplicationPage
            .verifyAddApplicationPage();
    }

    async clickNextAfterConfiguration(): Promise<void> {

    console.log(
        'Workflow: Clicking Next after VM Based configuration'
    );

    await this.manageApplicationPage
        .clickNext();

    console.log(
        'Workflow: Next clicked after VM Based configuration'
    );

    
}

// =====================================================
// SELECT FIRST CLUSTER - MICROSERVICE
// =====================================================

async selectMicroserviceCluster(): Promise<void> {

    console.log(
        'Workflow: Selecting first Cluster on Microservice page'
    );

    await this.manageApplicationPage
        .selectFirstCluster();

    console.log(
        'Workflow: First Cluster selected successfully'
    );
}
}