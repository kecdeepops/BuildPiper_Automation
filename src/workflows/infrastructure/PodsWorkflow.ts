import { PodsPage } from '../../pages/PodsPage';

export class PodsWorkflow {

    private podsPage: PodsPage;

    constructor(podsPage: PodsPage) {
        this.podsPage = podsPage;
    }

    // =====================================================
    // Open Pods Available Page
    // =====================================================

    async openPodsPage(): Promise<void> {
        await this.podsPage.open();
    }

    // =====================================================
    // Verify Pods Page
    // =====================================================

    async verifyPodsPageDisplayed(): Promise<void> {
        await this.podsPage.verifyPodsPageDisplayed();
    }

    // =====================================================
    // Verify Pod List
    // =====================================================

    async verifyPodListDisplayed(): Promise<void> {
        await this.podsPage.verifyPodListDisplayed();
    }

    // =====================================================
    // Verify First Pod Data
    // =====================================================

    async verifyFirstPodHasData(): Promise<void> {
        await this.podsPage.verifyFirstPodHasData();
    }

    // =====================================================
    // Get Pod Count
    // =====================================================

    async getPodCount(): Promise<number> {
        return await this.podsPage.getPodCount();
    }

    // =====================================================
    // LOAD MORE
    // =====================================================

    async clickLoadMore(): Promise<void> {

        const isLoadMoreAvailable =
            await this.podsPage.isLoadMoreAvailable();

        if (isLoadMoreAvailable) {

            console.log(
                'LOAD MORE is available. Clicking LOAD MORE...'
            );

            await this.podsPage.clickLoadMore();

        } else {

            console.log(
                'LOAD MORE is not available. Skipping LOAD MORE.'
            );
        }
    }

    // =====================================================
    // Verify More Pods Loaded
    // =====================================================

    async verifyMorePodsLoaded(
        previousCount: number
    ): Promise<void> {

        await this.podsPage.verifyMorePodsLoaded(
            previousCount
        );
    }
}