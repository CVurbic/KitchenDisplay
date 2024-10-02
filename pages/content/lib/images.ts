import allImages from './resources/allTogether';

export function addImagesToPackageRows(ticket: HTMLElement): void {
    const packageRows = ticket.querySelectorAll('.item-package-row');
    const allRows = ticket.querySelectorAll('tr');

    ticket.classList.add('ticket-container');

    packageRows.forEach((row, index) => {
        const nextPackageRow = packageRows[index + 1] || null;
        let totalHeight = 0;

        const titleCell = row.querySelector('.item-package-title');
        const rowText = titleCell?.textContent?.trim();

        const imageSrcs: string[] = [];
        if (rowText) {
            for (const [keyword, images] of Object.entries(allImages)) {
                if (rowText.includes(keyword)) {
                    imageSrcs.push(...images);
                }
            }
        }

        const startIndex = Array.from(allRows).indexOf(row as HTMLTableRowElement);
        const endIndex = nextPackageRow ? Array.from(allRows).indexOf(nextPackageRow as HTMLTableRowElement) + 1 : allRows.length;

        for (let i = startIndex; i < endIndex; i++) {
            const currentRow = allRows[i] as HTMLTableRowElement;
            totalHeight += currentRow.offsetHeight;
        }

        if (imageSrcs.length === 0) return;

        imageSrcs.forEach((imageSrc, idx) => {
            const img = document.createElement('img');
            img.src = imageSrc;
            img.classList.add('package-image');
            img.style.height = `${totalHeight / imageSrcs.length}px`;
            img.style.top = `${(row as HTMLTableRowElement).offsetTop + (idx * (totalHeight / imageSrcs.length))}px`;

            (row as HTMLElement).classList.add('package-row');

            ticket.insertBefore(img, row);
        });
    });
}
