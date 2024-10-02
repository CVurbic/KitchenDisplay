import { SkupniPrikazKategorije } from './types';

export function getCategoryName(category: string): string | undefined {
    const categoryMap: { [key: string]: string } = {
        jela: "Jela",
        deserti: "Deserti",
        priloziIDodaci: "Prilozi i dodaci",
        porcije: "Porcije",
        napitci: "Pića",
        umaci: "Umaci",
        povrce: "Povrće"
    };
    return categoryMap[category];
}

export function displaySummaryTicket(itemCounts: SkupniPrikazKategorije) {
    let summaryContainer = document.getElementById('summary-container');

    const ticketTable = document.querySelector(".ticket-table")
    const summary = ticketTable?.querySelector(".grouped-ticket");

    console.log("summary", summary);
    const summaryCode = summary?.getAttribute("ticketid");

    // Replace the existing summary with the new summaryContainer
    if (summaryCode === "0" && summary) {
        if (!summaryContainer) {
            summaryContainer = document.createElement('div');
            summaryContainer.id = 'summary-container';
        }
        summary.replaceWith(summaryContainer);
    } else if (!summaryContainer) {
        summaryContainer = document.createElement('div');
        summaryContainer.id = 'summary-container';
        document.getElementById("mainTableRow")!.prepend(summaryContainer);
    }

    if (ticketTable?.children.length === 0) ticketTable?.remove();

    summaryContainer.innerHTML = '';

    // Create header
    const header = document.createElement('div');
    header.className = 'summary-header';
    const title = document.createElement('h4');
    title.textContent = 'Skupni prikaz';
    header.appendChild(title);
    summaryContainer.appendChild(header);

    // Create a container for hidden category toggles
    const hiddenCategoriesContainer = document.createElement('div');
    hiddenCategoriesContainer.id = 'hidden-categories-container';
    hiddenCategoriesContainer.style.display = 'none';
    summaryContainer.appendChild(hiddenCategoriesContainer);

    // Create toggle button for showing/hiding hidden categories
    const toggleHiddenButton = document.createElement('button');
    toggleHiddenButton.innerHTML = '&#128065;'; // Eye icon
    toggleHiddenButton.title = 'Toggle hidden categories';
    toggleHiddenButton.addEventListener('click', () => {
        hiddenCategoriesContainer.style.display =
            hiddenCategoriesContainer.style.display === 'none' ? 'block' : 'none';
        toggleHiddenButton.innerHTML =
            hiddenCategoriesContainer.style.display === 'none' ? '&#128065;' : '&#128064;'; // Eye icon / Eyes icon
    });
    header.appendChild(toggleHiddenButton);

    for (const [category, items] of Object.entries(itemCounts)) {
        if (Object.keys(items).length === 0) continue;

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'summary-category';

        const totalItems = Object.values(items).reduce((sum, count) => sum + count, 0);
        const categoryTitle = document.createElement('h3');
        categoryTitle.textContent = `${category} (${totalItems})`;

        const toggleButton = document.createElement('button');
        toggleButton.innerHTML = '&#128065;'; // Eye icon
        toggleButton.className = 'category-toggle-button';

        const isVisible = localStorage.getItem(`category_${category}`) !== 'hidden';
        updateCategoryVisibility(categoryDiv, isVisible, category, hiddenCategoriesContainer, categoryTitle, toggleButton, totalItems);

        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            const newVisibility = categoryDiv.style.display === 'none';
            updateCategoryVisibility(categoryDiv, newVisibility, category, hiddenCategoriesContainer, categoryTitle, toggleButton, totalItems);
            localStorage.setItem(`category_${category}`, newVisibility ? 'visible' : 'hidden');
        });

        categoryDiv.appendChild(categoryTitle);
        categoryTitle.appendChild(toggleButton);

        const itemList = document.createElement('ul');
        for (const [itemName, count] of Object.entries(items)) {
            const listItem = document.createElement('li');
            listItem.textContent = `× ${itemName}`;

            listItem.setAttribute('data-count', count.toString());
            itemList.appendChild(listItem);
        }
        categoryDiv.appendChild(itemList);

        summaryContainer.appendChild(categoryDiv);

        categoryTitle.addEventListener('click', () => {
            itemList.style.display = itemList.style.display === 'none' ? 'block' : 'none';
        });
    }


}

function updateCategoryVisibility(
    categoryDiv: HTMLElement,
    isVisible: boolean,
    category: string,
    hiddenCategoriesContainer: HTMLElement,
    categoryTitle: HTMLElement,
    toggleButton: HTMLButtonElement,
    totalItems: number
) {
    categoryDiv.style.display = isVisible ? 'block' : 'none';
    toggleButton.innerHTML = isVisible ? '&#128065;' : '&#128064;'; // Eye icon / Eyes icon
    toggleButton.title = isVisible ? 'Hide category' : 'Show category';
    categoryTitle.textContent = `${category} (${totalItems})`;

    // Handle hidden category toggle
    let hiddenToggle = document.getElementById(`hidden-toggle-${category}`);
    if (!isVisible) {
        if (!hiddenToggle) {
            hiddenToggle = document.createElement('button');
            hiddenToggle.id = `hidden-toggle-${category}`;
            hiddenToggle.textContent = `${category} (${totalItems})`;
            hiddenToggle.addEventListener('click', () => {
                updateCategoryVisibility(categoryDiv, true, category, hiddenCategoriesContainer, categoryTitle, toggleButton, totalItems);
                localStorage.setItem(`category_${category}`, 'visible');
                hiddenToggle!.remove();
            });
            hiddenCategoriesContainer.appendChild(hiddenToggle);
        }
    } else if (hiddenToggle) {
        hiddenToggle.remove();
    }
}
