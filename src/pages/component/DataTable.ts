
import { Locator, expect } from '@playwright/test';

export class DataTable {
    constructor(
        private table: Locator,
        private pagination: Locator,
        private nextPageButton: Locator,
        private previousPageButton: Locator
    ) {}

    // Normalize values for consistent row matching.
    private normalize(value: string): string {
        return value
            .replace(/[_-]/g, '-')
            .replace(/\s+/g, ' ')
            .trim()
            .toLowerCase();
    }

    // Get the index of a column using its header name.
    async getColumnIndex(columnName: string): Promise<number> {
        const headers = this.table.locator('thead th');

        const header = headers
            .filter({ hasText: columnName })
            .first();

        await expect(header).toBeVisible();

        return await header.evaluate((element) =>
            Array.from(element.parentElement!.children).indexOf(element)
        );
    }

    // Get a cell value for a row on the current page.
    async getCellValue(
        rowValue: string,
        rowColumn: string,
        targetColumn: string
    ): Promise<string> {
        const rowColumnIndex = await this.getColumnIndex(rowColumn);
        const targetColumnIndex = await this.getColumnIndex(targetColumn);

        const rows = this.table.locator('tbody tr');
        const expectedValue = this.normalize(rowValue);
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const cell = row.locator('td').nth(rowColumnIndex);
            const links = cell.locator('a');
            const linkCount = await links.count();

            // Match the cluster-name link, not avatar initials.
            for (let j = 0; j < linkCount; j++) {
                const actualValue = this.normalize(
                    await links.nth(j).innerText()
                );

                if (actualValue === expectedValue) {
                    return (
                        await row
                            .locator('td')
                            .nth(targetColumnIndex)
                            .innerText()
                    ).trim();
                }
            }
        }

        throw new Error(
            `Row '${rowValue}' was not found in column '${rowColumn}'.`
        );
    }


// Check whether a row exists on the current page only.
async hasRow(
    rowValue: string,
    rowColumn: string
): Promise<boolean> {
    const rowColumnIndex = await this.getColumnIndex(rowColumn);

    const rows = this.table.locator('tbody tr');
    const expectedValue = this.normalize(rowValue);
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
        const cell = rows
            .nth(i)
            .locator('td')
            .nth(rowColumnIndex);

        const links = cell.locator('a');
        const linkCount = await links.count();

        for (let j = 0; j < linkCount; j++) {
            const link = links.nth(j);

            // Skip links that are no longer attached to the DOM.
            if (!(await link.count())) {
                continue;
            }

            const actualValue = this.normalize(
                await link.innerText({ timeout: 3000 })
            );

            if (actualValue === expectedValue) {
                return true;
            }
        }
    }

    return false;
}

    // Read the current pagination range.
    async getPaginationRange(): Promise<string> {
        const text = await this.pagination.innerText();
        return text.replace(/\s+/g, ' ').trim();
    }

    // Parse pagination text such as "11 - 20 of 109".
    private parsePagination(text: string): {
        start: number;
        end: number;
        total: number;
    } {
        const match = text.match(
            /(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/
        );

        if (!match) {
            throw new Error(
                `Unable to determine pagination state: "${text}".`
            );
        }

        return {
            start: Number(match[1]),
            end: Number(match[2]),
            total: Number(match[3])
        };
    }

    // Move to the next page and verify the pagination transition.
    async goToNextPage(): Promise<void> {
        const paginationBefore = await this.getPaginationRange();
        const before = this.parsePagination(paginationBefore);

        if (before.total === 0 || before.end >= before.total) {
            throw new Error(
                `Cannot navigate next: already on the last page (${paginationBefore}).`
            );
        }

        await expect(this.nextPageButton).toBeVisible();
        await expect(this.nextPageButton).toBeEnabled();

        await this.nextPageButton.click();
console.log('Pagination before click:', paginationBefore);
console.log('Pagination immediately after click:',
    await this.getPaginationRange()
);
        await expect.poll(
            async () => {
                const paginationAfter = await this.getPaginationRange();

                try {
                    const after = this.parsePagination(paginationAfter);

                    return (
                        after.start > before.start &&
                        after.total === before.total
                    );
                } catch {
                    return false;
                }
            },
            {
                message: `Pagination should advance beyond "${paginationBefore}"`,
                timeout: 10000,
                intervals: [250, 500, 1000]
            }
        ).toBe(true);
    }

    // Return to the first page.
    async goToFirstPage(): Promise<void> {
        while (true) {
            const paginationBefore = await this.getPaginationRange();
            const before = this.parsePagination(paginationBefore);

            if (before.start === 1) {
                return;
            }

            await expect(this.previousPageButton).toBeVisible();
            await expect(this.previousPageButton).toBeEnabled();

            await this.previousPageButton.click();

            await expect.poll(
                async () => {
                    const paginationAfter =
                        await this.getPaginationRange();

                    try {
                        const after =
                            this.parsePagination(paginationAfter);

                        return after.start < before.start;
                    } catch {
                        return false;
                    }
                },
                {
                    message: `Pagination should move back from "${paginationBefore}"`,
                    timeout: 10000,
                    intervals: [250, 500, 1000]
                }
            ).toBe(true);
        }
    }

    // Find a row across pages and return the target cell value.
    async findCellValueAcrossPages(
        rowValue: string,
        rowColumn: string,
        targetColumn: string
    ): Promise<string> {
        await this.goToFirstPage();

        while (true) {
            try {
                return await this.getCellValue(
                    rowValue,
                    rowColumn,
                    targetColumn
                );
            } catch (error) {
                if (
                    !(error instanceof Error) ||
                    !error.message.includes(
                        'was not found in column'
                    )
                ) {
                    throw error;
                }

                const paginationText =
                    await this.getPaginationRange();
                const current = this.parsePagination(paginationText);

                if (
                    current.total === 0 ||
                    current.end >= current.total
                ) {
                    throw error;
                }

                await this.goToNextPage();
            }
        }
    }

    // Check whether a row exists anywhere in the paginated table.
    async hasRowAcrossPages(
        rowValue: string,
        rowColumn: string
    ): Promise<boolean> {
        await this.goToFirstPage();

        while (true) {
            if (await this.hasRow(rowValue, rowColumn)) {
                return true;
            }

            const paginationText =
                await this.getPaginationRange();
            const current = this.parsePagination(paginationText);

            if (
                current.total === 0 ||
                current.end >= current.total
            ) {
                return false;
            }

            await this.goToNextPage();
        }
    }
}
