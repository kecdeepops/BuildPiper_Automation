import { Locator ,expect} from '@playwright/test';

export class DataTable {

   constructor(
    private table: Locator,
    private pagination: Locator,
    private nextPageButton: Locator
) {}

    async getColumnIndex(
        columnName: string
    ): Promise<number> {

        const headers =
            this.table.locator('thead th');

        const header =
            headers.filter({
                hasText: columnName
            }).first();

        return await header.evaluate(
            (element) =>
                Array.from(
                    element.parentElement!.children
                ).indexOf(element)
        );
    }

    async getCellValue(
    rowValue: string,
    rowColumn: string,
    targetColumn: string
): Promise<string> {

    const rowColumnIndex =
        await this.getColumnIndex(rowColumn);

    const targetColumnIndex =
        await this.getColumnIndex(targetColumn);

    const rows =
        this.table.locator('tbody tr');

    const rowCount =
        await rows.count();

    for (let i = 0; i < rowCount; i++) {

        const row = rows.nth(i);

        const rowCell =
            row
                .locator('td')
                .nth(rowColumnIndex);

        const rowValueLocator =
            rowCell.getByText(
                rowValue,
                { exact: true }
            );

        if (await rowValueLocator.count() > 0) {

            return (
                await row
                    .locator('td')
                    .nth(targetColumnIndex)
                    .innerText()
            ).trim();
        }
    }

    throw new Error(
        `Row '${rowValue}' was not found ` +
        `in column '${rowColumn}'.`
    );
}
    async getPaginationRange(): Promise<string> {

        const text =
            await this.pagination.innerText();

        return text
            .replace(/\s+/g, ' ')
            .trim();
    }

   async goToNextPage(): Promise<void> {

    const firstRow =
        this.table
            .locator('tbody tr')
            .first();

    const currentFirstRowText =
        await firstRow.innerText();

    await this.nextPageButton.click();

    await expect(firstRow)
        .not
        .toHaveText(currentFirstRowText);
}
async findCellValueAcrossPages(
    rowValue: string,
    rowColumn: string,
    targetColumn: string
): Promise<string> {

    while (true) {

        try {

            return await this.getCellValue(
                rowValue,
                rowColumn,
                targetColumn
            );

        } catch (error) {

            const paginationText =
                await this.getPaginationRange();

            const match =
                paginationText.match(
                    /(\d+)\s*-\s*(\d+)\s+of\s+(\d+)/
                );

            if (!match) {
                throw new Error(
                    `Unable to determine pagination state.`
                );
            }

            const currentEnd =
                Number(match[2]);

            const total =
                Number(match[3]);

            if (currentEnd >= total) {

                throw new Error(
                    `Row '${rowValue}' was not found ` +
                    `in column '${rowColumn}'.`
                );
            }

            await this.goToNextPage();
        }
    }
}
}