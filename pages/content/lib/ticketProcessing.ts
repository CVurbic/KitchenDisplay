import { settings } from './settings';
import { addStyleToTicket } from './styles';
import { Notification, SkupniPrikazKategorije } from './types';
import { napitci, jela, priloziIDodaci, porcije, povrce, umaci, deserti, newColors } from './constants';
import { displaySummaryTicket } from './summaryTicket';
import { achievementSystem } from './achievementSystem';
import { addImagesToPackageRows } from './images';

interface TicketItem {
    id: string;

    element: HTMLElement;
    tableCode: string;
}

let allTicketItems: TicketItem[] = [];
let lastTicketInfo: { id: string; tableCode: string } | null = null;

// Global declaration of skupniPrikazKategorije

export function processTicket(ticket: HTMLTableSectionElement, isAdded: boolean) {
    console.log(`Ticket ID: ${ticket.getAttribute('ticketid')}\nAdded: ${isAdded}`);
    const ticketId = ticket.getAttribute('ticketid');
    let tableCode = ticket.getAttribute('table-code')?.toLowerCase();


    if (!ticketId) {
        console.error('Ticket element does not have a ticketid attribute');
        return;
    }

    if (tableCode === 'kiosk') {
        const ticketDescription = ticket.querySelector('.ticket-table-description');
        if (ticketDescription) {
            const descriptionText = ticketDescription.textContent?.toLowerCase() || '';
            if (descriptionText.includes('van')) {
                tableCode = 'van';
            } else if (descriptionText.includes('ovdje')) {
                tableCode = 'ovdje';
            } else {
                tableCode = lastTicketInfo ? lastTicketInfo.tableCode : 'kiosk';
            }
        } else {
            tableCode = lastTicketInfo ? lastTicketInfo.tableCode : 'kiosk';
        }
    } else if (!tableCode) {
        console.error('Ticket element does not have a table-code attribute');
        return;
    }

    if (isAdded) {
        addColorToTicket(ticket, tableCode);
        allTicketItems.push({ id: ticketId, element: ticket, tableCode: tableCode });
        lastTicketInfo = { id: ticketId, tableCode: tableCode };

        processTicketDetails(ticket);

        if (tableCode === 'glovo') {
            processGlovoTicket(ticket);
        }

        // Get the creation time from the ticket header
        const creationTime = getTicketCreationTime(ticket);
        if (creationTime) {
            ticket.setAttribute('data-creation-time', creationTime.toISOString());
        }

        // Count the number of items in the ticket
        const itemCount = ticket.querySelectorAll('.ticket-item').length;
        ticket.setAttribute('data-item-count', itemCount.toString());

    } else {
        // Ticket is being removed (completed)
        const creationTimeStr = ticket.getAttribute('data-creation-time');
        const creationTime = creationTimeStr ? new Date(creationTimeStr) : null;
        const itemCount = parseInt(ticket.getAttribute('data-item-count') || '0');

        if (creationTime) {
            const processingTime = Date.now() - creationTime.getTime();
            console.log(`Ticket ${ticketId} completed. Processing time: ${processingTime}ms`);
            achievementSystem.updateTicketProcessed(ticketId, processingTime, itemCount);
        } else {
            console.warn(`Couldn't find creation time for ticket ${ticketId}`);
        }

        // Remove the ticket from allTicketItems
        allTicketItems = allTicketItems.filter(item => item.id !== ticketId);
    }
    addImagesToPackageRows(ticket);
    console.log("alltickets: ", allTicketItems);
}

function processTicketDetails(ticket: HTMLElement) {
    ticket.querySelectorAll('dt').forEach(dt => {
        if (dt.innerHTML.startsWith('&nbsp; &nbsp; &nbsp;')) {
            dt.innerHTML = '⤷' + dt.innerHTML.trim();
            Object.assign(dt.style, {
                background: '#fff',
                border: '2px solid red',
                fontWeight: 'bold',
                paddingLeft: '10px'
            });
        }
    });
}

function processGlovoTicket(ticketElement: HTMLElement) {
    const ticketTitle = ticketElement.querySelector(".ticket-title");
    const ticketDescription = ticketElement.querySelector(".ticket-table-description") as HTMLElement;

    if (ticketTitle && ticketDescription) {
        const text = ticketDescription.textContent || ticketDescription.innerText;

        // Extract Glovo number
        const regex = /\d{1,4}/;
        const match = text.match(regex);
        const glovoNumber = match ? match[0] : null;
        if (glovoNumber) ticketTitle.innerHTML = `Narudžba: ${glovoNumber}`;

        // Extract and format description
        const prefix = "NAP.NAR.:";
        const index = text.indexOf(prefix);
        const extractedText = index !== -1 ? text.substring(index + prefix.length).trim() : text;

        if (extractedText.length > 0) {
            ticketDescription.style.backgroundColor = "rgba(255,255,255,1)";
            ticketDescription.style.fontSize = "medium";
            ticketDescription.style.borderColor = "red";
            ticketDescription.innerHTML = extractedText;
        }
    }
}

export function handleSkupniPrikaz() {
    console.log("tuSmo")
    const tbodyElements = document.querySelectorAll("#mainTableRow tbody.zero-progress-ticket");

    let skupniPrikazKategorije: SkupniPrikazKategorije = {
        "Jela": {},
        "Porcije": {},
        "Prilozi i dodaci": {},
        "Deserti": {},
        "Pića": {},
        "Povrće": {},
        "Umaci": {},
    };

    const categories = {
        jela: Object.keys(jela),
        deserti: Object.keys(deserti),
        priloziIDodaci: Object.keys(priloziIDodaci),
        porcije: Object.keys(porcije),
        napitci: Object.keys(napitci),
        umaci: Object.keys(umaci),
        povrce: Object.keys(povrce)
    };



    tbodyElements.forEach((tbody) => {
        const ticketItems = tbody.querySelectorAll(".ticket-item");

        ticketItems.forEach((ticketItem) => {
            let itemName = ticketItem.querySelector("dt")!.innerText.trim();
            const itemQuantity = parseInt((ticketItem.querySelector(".item-quantity")! as HTMLElement).innerText);
            const validQuantity = isNaN(itemQuantity) ? 1 : itemQuantity;
            let found = false;

            const addToCategory = (category: keyof SkupniPrikazKategorije, name: string) => {
                skupniPrikazKategorije[category][name] = (skupniPrikazKategorije[category][name] || 0) + validQuantity;
                found = true;
            };

            // Check Jela category
            if (!found) {
                categories.jela.some((jelo) => {
                    if (itemName.includes(jelo)) {
                        if (itemName.includes("MALA")) {
                            addToCategory("Jela", jelo + " MALA");
                        } else {
                            addToCategory("Jela", jelo);
                        }
                        return true;
                    }
                    return false;
                });
            }

            // Check Deserti category
            if (!found) {
                categories.deserti.some((desert) => {
                    if (itemName.includes(desert)) {
                        addToCategory("Deserti", desert);
                        return true;
                    }
                    return false;
                });
            }

            // Check Prilozi i dodaci category
            if (found && (itemName.includes("MOZZARELA") || itemName.includes("FALAFEL"))) {
                categories.priloziIDodaci.some((prilog) => {
                    if (itemName.includes(prilog)) {
                        if (itemName.includes("VELIKA") || itemName.includes("MALA")) {
                            addToCategory("Prilozi i dodaci", prilog);
                        }
                        return true;
                    }
                    return false;
                });
            }
            if (found && itemName.includes("NUGGETS")) {
                categories.priloziIDodaci.some((prilog) => {
                    if (itemName.includes("VELIKA")) {
                        addToCategory("Prilozi i dodaci", "NUGGETS 8kom");
                        return true;
                    } else if (itemName.includes("MALA") && prilog.includes("NUGGETS")) {
                        addToCategory("Prilozi i dodaci", "NUGGETS 4kom");
                        return true;
                    }
                    return false;
                });
            }
            if (!found && !itemName.includes("VELIKA") && !itemName.includes("MALA")) {
                categories.priloziIDodaci.some((prilog) => {
                    if (itemName.includes(prilog)) addToCategory("Prilozi i dodaci", prilog);
                });
            }

            // Check Porcije category
            if (found && (itemName.includes("CLASSIC") || itemName.includes("CHICKEN") || itemName.includes("MIX"))) {
                if (itemName.includes("CLASSIC")) {
                    if (itemName.includes("MALA")) {
                        addToCategory("Porcije", "CLASSIC MALI");
                    } else if (!itemName.includes("EKSTRA")) {
                        addToCategory("Porcije", "CLASSIC VELIKI");
                    }
                } else if (itemName.includes("CHICKEN")) {
                    if (itemName.includes("MALA")) {
                        addToCategory("Porcije", "CHICKEN MALI");
                    } else if (!itemName.includes("EKSTRA")) {
                        addToCategory("Porcije", "CHICKEN VELIKI");
                    }
                } else if (itemName.includes("MIX")) {
                    if (itemName.includes("MALA")) {
                        addToCategory("Porcije", "MIX MALI");
                    } else if (!itemName.includes("EKSTRA")) {
                        addToCategory("Porcije", "MIX VELIKI");
                    }
                }
            }
            if (!found && itemName.includes("50g")) {
                addToCategory("Porcije", itemName);
            }

            // Check Pića category
            if (!found) {
                if (categories.napitci.includes(itemName)) {
                    addToCategory("Pića", itemName);
                }
            }

            // Check Umaci category
            if (!found) {
                if (categories.umaci.includes(itemName)) {
                    addToCategory("Umaci", itemName);
                }
            }

            // Check Povrće category
            if (!found) {
                if (categories.povrce.includes(itemName)) {
                    addToCategory("Povrće", itemName);
                }
            }
        });
    });
    console.log("Skupni: ", skupniPrikazKategorije)
    displaySummaryTicket(skupniPrikazKategorije);
}

export function addColorToTicket(ticket: HTMLElement, tableCode: string) {
    console.log("ticket: ", ticket);
    const matchingCode = Object.keys(newColors).find(code => tableCode.includes(code));
    console.log("matchingCode", matchingCode);

    if (matchingCode) {
        const colorScheme = newColors[matchingCode];
        ticket.classList.add(matchingCode)
        addStyleToTicket(ticket, colorScheme.header, colorScheme.body, matchingCode);
    } else {
        console.warn(`No color scheme found for table code: ${tableCode}`);
    }
}

export function easyToMakeTicketsHighlighter() {
    const tbodyElements = document.querySelectorAll('tbody');
    tbodyElements.forEach((tbody) => {
        const rows = tbody.querySelectorAll('tr');
        let isEasyToMake = true;
        let totalItems = 0;

        rows.forEach((row, index) => {
            if (index > 1) {
                const itemName = row.querySelector('td:nth-child(2)')?.textContent?.trim().toLowerCase();
                const quantity = parseInt(row.querySelector('td:nth-child(1)')?.textContent?.trim() || '0');
                totalItems += quantity;

                if (itemName && !isEasyItem(itemName)) {
                    isEasyToMake = false;
                }
            }
        });

        if (isEasyToMake && totalItems <= 3) {
            const ticketElement = tbody.querySelector('tr:first-child td:nth-child(2)') as HTMLElement;
            if (ticketElement) {
                ticketElement.style.backgroundColor = 'lightgreen';
            }
        }
    });
}

function isEasyItem(itemName: string): boolean {
    const easyItems = ['coca-cola', 'fanta', 'sprite', 'voda', 'pivo', 'kava', 'čaj'];
    return easyItems.some(item => itemName.includes(item));
}

export function importantArticle() {
    const tbodyElements = document.querySelectorAll('tbody');
    tbodyElements.forEach((tbody) => {
        const rows = tbody.querySelectorAll('tr');
        rows.forEach((row, index) => {
            if (index > 1) {
                const itemName = row.querySelector('td:nth-child(2)')?.textContent?.trim().toLowerCase();
                if (itemName && isImportantItem(itemName)) {
                    const ticketElement = tbody.querySelector('tr:first-child td:nth-child(2)') as HTMLElement;
                    if (ticketElement) {
                    }
                }
            }
        });
    });
}

function isImportantItem(itemName: string): boolean {
    const importantItems = ['torta', 'kolač', 'sladoled'];
    return importantItems.some(item => itemName.includes(item));
}

function getTicketCreationTime(ticket: HTMLElement): Date | null {
    const headerTable = ticket.querySelector('.ticket-header-table');
    if (headerTable) {
        const dateCell = headerTable.querySelector('tbody tr:first-child td:first-child');
        const timeCell = headerTable.querySelector('tbody tr:first-child td:last-child');

        if (dateCell && timeCell) {
            const dateStr = dateCell.textContent?.trim();
            const timeStr = timeCell.textContent?.trim();

            if (dateStr && timeStr) {
                // Parse the date and time (adjust the format if needed)
                const [day, month, year] = dateStr.split('.').map(Number);
                const [hours, minutes, seconds] = timeStr.split(':').map(Number);

                return new Date(year, month - 1, day, hours, minutes, seconds);
            }
        }
    }
    return null;
}

// Add any other ticket processing related functions here