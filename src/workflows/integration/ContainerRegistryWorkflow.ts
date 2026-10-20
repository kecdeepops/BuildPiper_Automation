import { ContainerRegistryPage } from '../../pages/ContainerRegistryPage';

export class ContainerRegistryWorkflow {

    constructor(
        private containerRegistryPage: ContainerRegistryPage
    ) {}

    // =====================================================
    // Verify Container Registry Page
    // =====================================================

    async verifyPageDisplayed(): Promise<void> {

        await this.containerRegistryPage.open();

        await this.containerRegistryPage.verifyPageDisplayed();
    }

    // =====================================================
    // Open Add Registry Page
    // =====================================================

    async openAddRegistryPage(): Promise<void> {

        await this.containerRegistryPage.open();

        await this.containerRegistryPage.verifyPageDisplayed();

        await this.containerRegistryPage.clickAddRegistry();
    }

    // =====================================================
    // Create Container Registry
    // =====================================================

    async createRegistry(
        type: string,
        name: string,
        url: string,
        username:string,
        password:string
    ): Promise<void> {

        await this.containerRegistryPage.open();

        await this.containerRegistryPage.verifyPageDisplayed();

        await this.containerRegistryPage.clickAddRegistry();

        await this.containerRegistryPage.selectRegistryType(type);

        await this.containerRegistryPage.enterRegistryName(name);

        await this.containerRegistryPage.enterRegistryUrl(url);
        await this.containerRegistryPage.enterUsername(username);
        await this.containerRegistryPage.enterPassword(password);

        await this.containerRegistryPage.clickSave();
    }
}