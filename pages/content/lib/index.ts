import { toggleTheme } from '@lib/toggleTheme';
import { MdNotifications, MdNotificationsActive } from "react-icons/md";



const napitci = {
    "AYRAN": 0,
    "CAPPY JABUKA 0,33l": 0,
    "CAPPY NARANČA 0,33l": 0,
    "CEDEVITA GO BAZGA": 0,
    "CEDEVITA GO LIMETA": 0,
    "CEDEVITA GO LIMUN": 0,
    "CEDEVITA GO NARANČA": 0,
    "COCA COLA 0,33l": 0,
    "COCA COLA 0,50l": 0,
    "COCA COLA ZERO 0,33l": 0,
    "COCA COLA ZERO 0,50l": 0,
    "FANTA 0,50l": 0,
    "HEINEKEN 0,5l": 0,
    "JAMNICA BOTANICA 0,5 Menta": 0,
    "JAMNICA BOTANICA 0,5 Naranča": 0,
    "JAMNICA GAZIRANA 0,50l": 0,
    "JANA NEGAZIRANA 0,50l": 0,
    "JANA VITAMIN 0,5 Crni ribizl": 0,
    "JANA VITAMIN 0,5 Menta": 0,
    "JANA VITAMIN 0,5 Naranča": 0,
    "JANA VITAMIN 0,5 limun": 0,
    "L. ČAJ JANA 0,5 Breskva": 0,
    "L. ČAJ JANA 0,5 Limun": 0,
    "L. ČAJ JANA 0,5 Šumsko voće": 0,
    "OŽUJSKO 0,50l": 0,
    "PAN 0,50l": 0,
    "RED BULL 0,25l": 0,
    "RED BULL Sugarfree 0,25l": 0,
    "SENSATION VODA 0,5 Limeta": 0,
    "SPRITE 0,50l": 0
};

const jela = {
    "LEPINJA": 0,
    "LEPINJA MALA": 0,
    "TORTILJA": 0,
    "TORTILJA MALA": 0,
    "TORTILJA 20CM": 0,
    "POSUDA": 0,
    "POSUDA MALA": 0
};

const priloziIDodaci = {
    "BATAT": 0,
    "POMFRIT": 0,
    "MOZZARELA ŠTAPIĆI": 0,
    "NUGGETS 13kom": 0,
    "NUGGETS 8kom": 0,
    "NUGGETS 6kom": 0,
    "NUGGETS 4kom": 0,
    "MOZZARELA VELIKA": 0,
    "MOZZARELA MALA": 0,
    "FALAFEL VELIKA": 0,
    "FALAFEL MALA": 0,
};

const porcije = {
    "EKSTRA CHICKEN MESO 50g": 0,
    "EKSTRA CLASSIC MESO 50g": 0,
    "CLASSIC MESO": 0,
    "CLASSIC MESO MALO": 0,
    "CHICKEN MESO": 0,
    "CHICKEN MESO MALO": 0,
    "MIX MESO VELIKO": 0,
    "MIX MESO MALO": 0,
};

const povrce = {
    "*CHILLI MLJEVENI": 0,
    "*CRNE MASLINE": 0,
    "*SVJEŽI KRASTAVCI": 0,
    "1 - DODATAK FETA": 0,
    "2 - ICEBERG SALATA": 0,
    "3 - RAJČICA": 0,
    "4 - KUKURUZ": 0,
    "5 - LUK": 0,
    "6 - KUPUS": 0,
    "7 - KRASTAVCI KISELI": 0
};

const umaci = {
    "A - LJUTI UMAK": 0,
    "B - BLAGI UMAK": 0,
    "C - FIT UMAK": 0,
    "CURRY UMAK": 0,
    "KETCHUP 15g": 0,
    "MAJONEZA 15g": 0,
    "SWEET CHILLI": 0
};

const deserti = {
    "MINI PALAČINKE": 0,
    "SLADOLED": 0,
    "EKSTRA KEKS": 0,
    "EKSTRA KOKOS": 0,
    "EKSTRA NUTELLA": 0,
    "EKSTRA PRELJEV JAGODA": 0,
    "EKSTRA PRELJEV KARAMELA": 0,
    "EKSTRA PRELJEV ŠUMSKO VOĆE": 0,

};


let settings = { onOffCollors: false, highlightArticle: 0 };
const notificirajElementi: Array<HTMLElement> = [];
let isGlowing = false;
let allTicketItems: any = [];
let allArticles: string[] = [];
let ticketCode: string
let notBox: boolean = false

const newColors = [
    {
        glovo: { header: "rgba(0,160,30,1)", body: "rgba(255,194,68,0.5)" },
        ovdje: { header: "rgba(57,181,224,1)", body: "rgba(57,181,224,0.5)" },
        van: { header: "rgba(255,77,77,1)", body: "rgba(255,77,77,0.5)" },
    }
];
const tabContent = document.querySelector(".tab-content")!;
let lastColor: [string, string] = ["", ""];



settings = getStoredData("settings", settings);


console.log("windowLoadeed")
const nav = document.getElementById("navigacija");
const navHeight = nav ? nav.offsetHeight : "45";
createGlowElement(navHeight);

// Pozovi funkciju
uncommentParentElement();
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (
                node.nodeType === 1 &&
                (node as HTMLElement).tagName.toLowerCase() === "tbody" &&
                (node as HTMLElement).classList.contains("zero-progress-ticket")
            ) {

                if (settings.onOffCollors) addColorToTicket();
                easyToMakeTicketsHighlighter();
                importantArticle();
                hideGlowElement();
                allTicketItems = [];
                processTicket(node);
                createNotificationElement()
                generateNotificationBox()
            }
        });
    });
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["class"],
});

const tbodyElements = document.querySelectorAll("#mainTableRow tbody.zero-progress-ticket");

easyToMakeTicketsHighlighter();
importantArticle();
hideGlowElement();
createNotificationElement()
generateNotificationBox()
if (settings.onOffCollors) addColorToTicket();

allTicketItems = [];
tbodyElements.forEach((tbody) => {
    processTicket(tbody);
});


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log("Content message: ", message)
    if (message.settings) {
        settings = message.settings;
        if (settings.onOffCollors) {
            addColorToTicket();
        }
        if (!settings.onOffCollors) {
            location.reload();
        }
        importantArticle();
        setStoredData("settings", settings);
    }

    if (message.popisArtikala) {
        allArticles.push(message.popisArtikala);
        setStoredData("allArticles", allArticles);
    }

    if (message.newNotification) {
        startBellShake()
        createNotificationBox(message.newNotification)
    }

});

tabContent.addEventListener('click', function (e) {
    const clickedElement = e.target as HTMLElement | null;
    if (clickedElement === null) return
    const newSelectedTicket = clickedElement.closest('tbody.zero-progress-ticket');
    const clickedTicketId = newSelectedTicket!.getAttribute("ticketid")
    const ticketsWithClickedTicketId = document.querySelectorAll(`tbody[ticketid="${clickedTicketId}"]`);
    const oldSelectedTickets = document.querySelectorAll(".selected-ticket")


    oldSelectedTickets.forEach((tbody) => {
        (tbody as HTMLElement).style.outline = "";
        tbody.classList.remove("selected-ticket");
    });

    ticketsWithClickedTicketId.forEach(newSelectedTicket => {
        newSelectedTicket!.classList.add("selected-ticket");
        (newSelectedTicket! as HTMLElement).style.setProperty("outline", "5px solid red", "important");

    })
});


function getStoredData(key, dataIfNothingFound) {
    const storedData = localStorage.getItem(key);
    if (storedData !== null) {
        return JSON.parse(storedData);
    } else {
        localStorage.setItem(key, JSON.stringify(dataIfNothingFound));
        return dataIfNothingFound;
    }
}

function setStoredData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function importantArticle() {
    const trs = document.querySelectorAll(".ticket-item");
    trs.forEach((tr) => {
        const productID = tr.getAttribute('product-id');
        (tr as HTMLElement).style.background = (settings.highlightArticle === parseInt(productID as string)) ? "rgba(255, 0 ,0 ,0.75)" : "none";
    });
}


function handleSkupniPrikaz() {
    console.log("handleSkupni")
    const tbodyElements = document.querySelectorAll("#mainTableRow tbody.zero-progress-ticket");

    const skupniPrikazKategorije = {
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

            const addToCategory = (category, name) => {
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
                        if (itemName.includes("VELIKA")) {
                            addToCategory("Prilozi i dodaci", prilog);
                        } else if (itemName.includes("MALA")) {
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
                    } else return false

                });
            }
            if (!found && !itemName.includes("VELIKA") && !itemName.includes("MALA")) {
                categories.priloziIDodaci.some((prilog) => {
                    if (itemName.includes(prilog)) addToCategory("Prilozi i dodaci", prilog);
                })
            }
            // Check Porcije category
            if (found && (itemName.includes("CLASSIC") || itemName.includes("CHICKEN") || itemName.includes("MIX"))) {
                if (itemName.includes("CLASSIC")) {
                    if (itemName.includes("MALA")) {
                        addToCategory("Porcije", "CLASSIC MALI");
                    } else if (!itemName.includes("EKSTRA")) {
                        addToCategory("Porcije", "CLASSIC VELIKI");
                    } /* else {
                        addToCategory("Porcije", "EKSTRA CLASSIC 50g");
                    } */
                } else if (itemName.includes("CHICKEN")) {
                    if (itemName.includes("MALA")) {
                        addToCategory("Porcije", "CHICKEN MALI");
                    } else if (!itemName.includes("EKSTRA")) {
                        addToCategory("Porcije", "CHICKEN VELIKI");
                    } /* else {
                        addToCategory("Porcije", "EKSTRA CHICKEN 50g");
                    } */
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

    displaySummaryTicket(skupniPrikazKategorije);
}




function displaySummaryTicket(itemCounts) {
    console.log("displaySummary", itemCounts)
    const existingSummaryTicket = document.querySelector(".summary-ticket");
    if (existingSummaryTicket) {
        existingSummaryTicket.remove();
    }

    const summaryTicket = document.createElement("div");
    summaryTicket.classList.add("summary-ticket");
    summaryTicket.style.width = "350px";
    summaryTicket.style.margin = "0 auto";
    summaryTicket.style.fontFamily = "Arial, sans-serif";

    const titleContainer = document.createElement("div");
    titleContainer.style.backgroundColor = "#AA66CC";
    titleContainer.style.color = "white";
    titleContainer.style.padding = "10px";
    titleContainer.style.borderTopLeftRadius = "5px";
    titleContainer.style.borderTopRightRadius = "5px";
    titleContainer.style.display = "flex";
    titleContainer.style.justifyContent = "space-between";
    titleContainer.style.alignItems = "center";

    const summaryTicketTitle = document.createElement("h4");
    summaryTicketTitle.textContent = "Skupni prikaz";
    summaryTicketTitle.style.margin = "0";

    const settingsButton = document.createElement("button");
    settingsButton.textContent = "Postavke";
    settingsButton.style.backgroundColor = "white";
    settingsButton.style.color = "#AA66CC";
    settingsButton.style.border = "none";
    settingsButton.style.cursor = "pointer";
    settingsButton.style.padding = "5px 10px";
    settingsButton.style.borderRadius = "5px";
    settingsButton.style.fontSize = "14px";

    titleContainer.appendChild(summaryTicketTitle);
    titleContainer.appendChild(settingsButton);

    summaryTicket.appendChild(titleContainer);

    // Kontrolna ploča za postavke
    const settingsContainer = document.createElement("div");
    settingsContainer.style.padding = "10px";
    settingsContainer.style.border = "1px solid #AA66CC";
    settingsContainer.style.borderTop = "none";
    settingsContainer.style.borderBottom = "none";
    settingsContainer.style.backgroundColor = "#f9f9f9";
    settingsContainer.style.display = "none"; // Skriveno dok se ne klikne gumb

    const settingsTitle = document.createElement("h5");
    settingsTitle.textContent = "Postavke:";
    settingsTitle.style.marginBottom = "10px";
    settingsContainer.appendChild(settingsTitle);

    // Učitavanje postavki iz localStorage
    const savedSettings = getStoredData("categorySettings", {});

    Object.keys(itemCounts).forEach((categoryName) => {
        const checkboxContainer = document.createElement("div");
        checkboxContainer.style.marginBottom = "5px";

        const categoryCheckbox = document.createElement("input");
        categoryCheckbox.type = "checkbox";
        categoryCheckbox.checked = savedSettings[categoryName] !== false; // Ako nije spremljeno ili je true, bit će checked
        categoryCheckbox.id = `checkbox-${categoryName}`;
        categoryCheckbox.style.marginRight = "5px";

        const checkboxLabel = document.createElement("label");
        checkboxLabel.htmlFor = `checkbox-${categoryCheckbox.id}`;
        checkboxLabel.textContent = categoryName;

        categoryCheckbox.addEventListener("change", (event) => {
            const categoryCard: HTMLElement = document.querySelector(`.category-card[data-category='${categoryName}']`)!;
            const target = event.target as HTMLInputElement;

            if (target.checked) {
                categoryCard.style.display = "block";
                savedSettings[categoryName] = true;
            } else {
                categoryCard.style.display = "none";
                savedSettings[categoryName] = false;
            }
            // Spremanje postavki u localStorage
            setStoredData("categorySettings", savedSettings)
        });

        checkboxContainer.appendChild(categoryCheckbox);
        checkboxContainer.appendChild(checkboxLabel);
        settingsContainer.appendChild(checkboxContainer);
    });

    summaryTicket.appendChild(settingsContainer);

    const categoriesContainer = document.createElement("div");
    categoriesContainer.style.display = "flex";
    categoriesContainer.style.flexWrap = "wrap";
    categoriesContainer.style.border = "1px solid #AA66CC";
    categoriesContainer.style.borderTop = "none";
    categoriesContainer.style.borderBottomLeftRadius = "5px";
    categoriesContainer.style.borderBottomRightRadius = "5px";

    Object.entries(itemCounts).forEach(([categoryName, categoryItems]) => {
        const categoryCard = document.createElement("div");
        categoryCard.classList.add("category-card");
        categoryCard.style.flex = "0 0 calc(50% - 20px)";
        categoryCard.style.margin = "10px";
        categoryCard.style.padding = "10px";
        categoryCard.style.overflow = "el";
        categoryCard.style.backgroundColor = "#f9f9f9";
        categoryCard.style.border = "1px solid #ccc";
        categoryCard.style.borderRadius = "5px";
        categoryCard.setAttribute("data-category", categoryName);

        // Primijeniti vidljivost iz spremljenih postavki
        if (savedSettings[categoryName] === false) {
            categoryCard.style.display = "none";
        }

        // Calculate the total count for the category
        const totalCount = Object.values(categoryItems as Record<string, number>).reduce((sum, count) => sum + count, 0);


        const cardTitle = document.createElement("div");
        cardTitle.classList.add("card-title");
        cardTitle.textContent = `${categoryName} (${totalCount})`;
        cardTitle.style.cursor = "pointer";
        cardTitle.style.backgroundColor = "#AA66CC";
        cardTitle.style.color = "white";
        cardTitle.style.padding = "5px";
        cardTitle.style.borderRadius = "5px";
        cardTitle.style.textAlign = "center";
        cardTitle.style.marginBottom = "10px";
        cardTitle.addEventListener("click", () => {
            // Toggle prikazivanje/skrivanje sadržaja
            if (categoryContent.style.display === "none") {
                categoryContent.style.display = "block";
            } else {
                categoryContent.style.display = "none";
            }
        });

        const categoryContent = document.createElement("div");
        categoryContent.classList.add("category-content");
        categoryContent.classList.add("hide");

        if (typeof categoryItems === "object" && categoryItems !== null) {
            Object.entries(categoryItems).forEach(([itemName, count]) => {

                const itemRow = document.createElement("div");
                itemRow.classList.add("item-row");

                const itemQuantity = document.createElement("span");
                itemQuantity.classList.add("item-quantity");
                itemQuantity.textContent = `${count}x `;
                itemRow.appendChild(itemQuantity);

                const itemNameSpan = document.createElement("span");
                itemNameSpan.classList.add("item-name");
                itemNameSpan.textContent = itemName;
                itemRow.appendChild(itemNameSpan);

                categoryContent.appendChild(itemRow);
            });
        }
        categoryCard.appendChild(cardTitle);
        categoryCard.appendChild(categoryContent);
        categoriesContainer.appendChild(categoryCard);
    });

    summaryTicket.appendChild(categoriesContainer);

    const mainTable = document.querySelector("#mainTableRow");
    if (mainTable) {
        mainTable.insertBefore(summaryTicket, mainTable.firstChild);

        var columns = mainTable.querySelectorAll(".ticket-holder-column")
        if (columns) {
            columns.forEach(column => {
                var tickets = column.querySelectorAll(".zero-progress-ticket")
                if (tickets.length === 0) column.remove()
            })
        }
    }


    // Dodavanje event listenera na gumb za prikazivanje/sakrivanje postavki
    settingsButton.addEventListener("click", () => {
        if (settingsContainer.style.display === "none") {
            settingsContainer.style.display = "block";
        } else {
            settingsContainer.style.display = "none";
        }
    });
}


function easyToMakeTicketsHighlighter() {
    console.log("easyToMakeTicketsHighlighter")
    const tbodyElements = document.querySelectorAll("#mainTableRow tbody.zero-progress-ticket");
    handleSkupniPrikaz();
    const targetItems = [1593, 1591, 1589, 1590, 1587, 1588, 1594, 1584, 1521, 1524, 1597];
    const targetIds = new Set();

    tbodyElements.forEach((tbody) => {
        const ticketID = tbody.getAttribute("ticketid");
        const ticketItems = Array.from(tbody.querySelectorAll(".ticket-item")).map(item => parseInt(item.getAttribute("product-id")!));
        if (ticketItems.every(itemId => targetItems.includes(itemId))) {
            targetIds.add(ticketID);
        }
    });

    tbodyElements.forEach((tbody: Element) => {

        const ticketID = tbody.getAttribute("ticketid");
        if (targetIds.has(ticketID)) {
            (tbody as HTMLElement).style.boxShadow = "0 0 5px 5px red";
            notificirajElementi.push(tbody as HTMLElement);
        }
    });

    isGlowing = targetIds.size > 0;
    toggleGlowElementDisplay()
}

function toggleGlowElementDisplay() {
    const glowElement: HTMLElement | null = document.querySelector(".glow");
    if (glowElement) {
        glowElement.style.display = isGlowing ? "block" : "none";
    }
}

function createGlowElement(navHeight) {
    const glowElement: HTMLElement = document.createElement("div");
    glowElement.classList.add("glow");
    glowElement.style.width = "0px";
    glowElement.style.height = `calc(100% - ${navHeight}px)`;
    glowElement.style.position = "fixed";
    glowElement.style.right = "0px";
    glowElement.style.top = "45px";
    glowElement.style.borderRadius = "5rem 0 0 5rem";
    glowElement.style.boxShadow = "0 0 50px 50px red";
    document.body.appendChild(glowElement);
}

function hideGlowElement() {
    if (notificirajElementi.length === 0) {
        const glowElement: HTMLElement | null = document.querySelector(".glow");
        if (glowElement) {
            glowElement.style.display = "none";
        }
    }
}

function addColorToTicket() {
    const allTickets = document.querySelectorAll("#mainTableRow tbody.zero-progress-ticket")

    allTickets.forEach((ticket) => {
        ticketCode = ticket.getAttribute("table-code")!.toLocaleLowerCase()

        let headerColor, bodyColor;
        switch (ticketCode) {
            case "glovo":
                headerColor = newColors[0].glovo.header;
                bodyColor = newColors[0].glovo.body;
                break;
            case "za ovdje":
                headerColor = newColors[0].ovdje.header;
                bodyColor = newColors[0].ovdje.body;
                break;
            case "za van":
                headerColor = newColors[0].van.header;
                bodyColor = newColors[0].van.body;
                break;
            case "kiosk":
                const descriptionRow = ticket.querySelector(".ticket-table-description");

                if (descriptionRow) {
                    const descriptionText = descriptionRow.textContent!.trim().toLocaleLowerCase();
                    // Ovdje možete provjeriti što je u descriptionText-u i postaviti boje temeljem njega
                    if (descriptionText.includes("za van")) {
                        headerColor = newColors[0].van.header;
                        bodyColor = newColors[0].van.body;
                        lastColor = [headerColor, bodyColor]
                    } else if (descriptionText.includes("za ovdje")) {
                        headerColor = newColors[0].ovdje.header;
                        bodyColor = newColors[0].ovdje.body;
                        lastColor = [headerColor, bodyColor]
                    }
                    break;
                    // Dodajte još uvjeta prema potrebi za ostale mogućnosti u opisu
                } else {
                    headerColor = lastColor[0]
                    bodyColor = lastColor[1]
                    break
                }
            default:
                headerColor = "rgba(203,203,203,1)"; // Postavite vašu zadanu boju
                bodyColor = "rgba(255,255,255,0.5)"; // Postavite vašu zadanu boju
                break;
        }
        addStyleToTicket(ticket, headerColor, bodyColor, ticketCode);
    })
}

function processTicket(tbody) {
    const ticketItems = tbody.querySelectorAll(".ticket-item");
    const itemsList = Array.from(ticketItems).map(item => {
        const productName = (item as HTMLElement).querySelector("dt")!.innerText;
        const productID = (item as HTMLElement).getAttribute("product-id");
        return { productName, productID };
    });

    allTicketItems.push({ ticketID: tbody.getAttribute("ticketid"), items: itemsList });
    setStoredData("allTicketItems", allTicketItems);
}
function addStyleToTicket(ticket, headerColor, bodyColor, ticketCode) {
    const headerRow = ticket.querySelector(".zero-progress-ticket.bg-blue-grey.white-text.text-center.ticket-row-header");
    const button = ticket.querySelector("button")
    if (button) {
        button.removeAttribute("onclick");
    }

    ticket.style.backgroundColor = bodyColor;
    ticket.style.outline = "none";
    ticket.style.borderRadius = "0 0 1rem 1rem";
    ticket.style.borderColor = headerColor;
    ticket.style.color = "Black";
    ticket.style.boxShadow = `0px 0px 10px ${bodyColor}`;

    if (headerRow) {
        if (ticketCode === "glovo") {
            const ticketTitle = ticket.querySelector(".ticket-title");
            if (ticketTitle) {
                const ticketDescription = ticket.querySelector(".ticket-table-description");
                if (ticketDescription) {
                    const glovoNumber = parseInt(ticketDescription.textContent.substring(0, 3));

                    if (glovoNumber) ticketTitle.innerHTML = `Narudžba: ${glovoNumber}`;
                    // Pronađite element s klasom ticket-table-description

                    // Dohvatite cijeli tekst iz elementa
                    const text = ticketDescription.textContent || ticketDescription.innerText;

                    // Pronađite poziciju "NAP.NAR.:"
                    const prefix = "NAP.NAR.:";
                    const index = text.indexOf(prefix);
                    console.log(index)

                    // Ekstrahirajte tekst nakon "NAP.NAR.:"

                    const extractedText = text.substring(index + prefix.length).trim();
                    if (index !== -1) {
                        console.log(extractedText); // Ispisati ili pohraniti u varijablu
                        if (extractedText.length > 0) {
                            ticketDescription.style.backgroundColor = "rgba(255,255,255,1)"
                            ticketDescription.style.fontSize = "medium"
                            ticketDescription.style.borderColor = "red"
                            ticketDescription.innerHTML = extractedText
                        }
                    } else {
                        ticketDescription.innerHTML = extractedText
                        console.log("Tekst 'NAP.NAR.:' nije pronađen.");
                    }

                }
            }
        }
        ticket.style.borderRadius = "1rem";
        headerRow.style.setProperty("background-color", headerColor, "important");
        headerRow.style.setProperty("border-radius", "0.5rem 0.5rem 0 0 ");
        headerRow.style.setProperty("color", "white", "important");
        const naslov = headerRow.querySelector("span.ticket-title");
        naslov.style.setProperty("padding", "0");
        naslov.style.setProperty("text-shadow", "none");
        const h4 = naslov.parentElement;
        h4.style.setProperty("background", "black");
        h4.style.setProperty("text-align", "center");
        h4.style.borderRadius = "0.75rem 0.75rem 0 0";
        const headerCells = headerRow.querySelectorAll("td");
        headerCells.forEach((cell: HTMLTableCellElement) => {
            cell.style.setProperty("font-weight", "600", "important");
        });
    }
}

function uncommentParentElement() {
    var parentElement = document.querySelector('.ticket-menu-buttons-wrapper'); // Dohvati roditeljski element
    if (parentElement) { // Provjeri postoji li roditeljski element
        // Iteriraj kroz sve dječje elemente roditeljskog elementa
        parentElement.childNodes.forEach(function (childNode) {
            if (childNode.nodeType === 8 && parentElement && childNode.nodeValue) { // Provjeri je li čvor komentar
                // Ako je čvor komentar, zamijeni ga s HTML sadržajem
                parentElement.insertAdjacentHTML('afterbegin', childNode.nodeValue);
                parentElement.removeChild(childNode);
            }
        });
    }
}




function createNotificationElement() {
    const notificationSVGNamespace = "http://www.w3.org/2000/svg";
    const notificationSVG = document.createElementNS(notificationSVGNamespace, "svg");

    notificationSVG.setAttribute("width", "50");
    notificationSVG.setAttribute("height", "50");
    notificationSVG.setAttribute("viewBox", "-8 -8 60 55");
    notificationSVG.setAttribute("fill", "none");
    notificationSVG.setAttribute("xmlns", notificationSVGNamespace);
    notificationSVG.setAttribute("class", "notificationLogo");

    const notificationPath = document.createElementNS(notificationSVGNamespace, "path");
    notificationPath.setAttribute("d", "M11.7917 3.50016L8.81258 0.520996C3.81258 4.3335 0.520915 10.2085 0.229248 16.8752H4.39592C4.54349 14.2331 5.28514 11.6584 6.56564 9.34263C7.84614 7.02691 9.63251 5.02986 11.7917 3.50016ZM37.6042 16.8752H41.7709C41.4584 10.2085 38.1667 4.3335 33.1876 0.520996L30.2292 3.50016C32.3792 5.03739 34.1576 7.03664 35.4339 9.35113C36.7101 11.6656 37.4517 14.2366 37.6042 16.8752ZM33.5001 17.9168C33.5001 11.521 30.0834 6.16683 24.1251 4.75016V3.3335C24.1251 1.60433 22.7292 0.208496 21.0001 0.208496C19.2709 0.208496 17.8751 1.60433 17.8751 3.3335V4.75016C11.8959 6.16683 8.50008 11.5002 8.50008 17.9168V28.3335L4.33341 32.5002V34.5835H37.6667V32.5002L33.5001 28.3335V17.9168ZM21.0001 40.8335C21.2917 40.8335 21.5626 40.8127 21.8334 40.7502C23.1876 40.4585 24.2917 39.5418 24.8334 38.2918C25.0417 37.7918 25.1459 37.2502 25.1459 36.6668H16.8126C16.8334 38.9585 18.6876 40.8335 21.0001 40.8335Z");
    notificationPath.setAttribute("fill", "#1D1B20");
    notificationPath.setAttribute("filter", "url(#shadow)");

    notificationSVG.appendChild(notificationPath);
    document.body.appendChild(notificationSVG);

    notificationSVG.style.position = 'fixed';
    notificationSVG.style.top = '45px';
    notificationSVG.style.right = '200px';
    notificationSVG.style.borderRadius = '50%';
    notificationSVG.style.backgroundColor = 'transparent';
    notificationSVG.style.zIndex = '9999';

    notificationSVG.addEventListener("click", () => {
        const notificationElement = document.querySelector('.notificationBox') as HTMLElement;

        notificationElement.style.display = notificationElement.style.display === 'block' ? 'none' : 'block';
    });
}



function startBellShake() {
    // Get the notification logo SVG element
    const svgElement = document.querySelector(".notificationLogo") as HTMLElement;

    // Create the filter element
    const svgNamespace = "http://www.w3.org/2000/svg";
    const filter = document.createElementNS(svgNamespace, "filter");
    filter.setAttribute("id", "shadow"); // Set the filter ID

    // Create the feDropShadow element for the filter
    const feDropShadow = document.createElementNS(svgNamespace, "feDropShadow");
    feDropShadow.setAttribute("dx", "0"); // Horizontal offset
    feDropShadow.setAttribute("dy", "0"); // Vertical offset
    feDropShadow.setAttribute("stdDeviation", "5"); // Increase the blur radius for a stronger blur
    feDropShadow.setAttribute("flood-color", "red"); // Shadow color
    feDropShadow.setAttribute("flood-opacity", "1"); // Increase opacity for a stronger shadow

    // Append feDropShadow to filter
    filter.appendChild(feDropShadow);

    // Append filter to SVG
    svgElement.appendChild(filter);

    // Define the keyframes for the shaking animation
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerHTML = `
        /**
         * Defines the keyframes for the shaking animation.
         */
        @keyframes shake {
            0% { transform: rotate(-5deg); }
            25% { transform: rotate(5deg); }
            50% { transform: rotate(-5deg); }
            75% { transform: rotate(5deg); }
            100% { transform: rotate(0deg); }
        }

        /**
         * Applies the shaking animation to the element with the 'shake' class.
         */
        .shake {
            animation: shake 0.5s ease-in-out infinite;
        }
    `;
    document.head.appendChild(styleSheet);

    // Add the shaking class to the SVG element
    svgElement.classList.add("shake");
}


function stopBellShaking() {
    // Get the notification logo SVG element
    const svgElement = document.querySelector(".notificationLogo") as HTMLElement;

    if (svgElement) {
        // Remove the shaking class from the SVG element
        svgElement.classList.remove("shake");

        // Remove the filter
        const filter = svgElement.querySelector("filter");
        if (filter) {
            svgElement.removeChild(filter);
        }

        // Optionally, remove the style sheet if it is no longer needed
        const styleSheet = Array.from(document.styleSheets).find(sheet => {
            return (sheet as CSSStyleSheet).cssRules &&
                Array.from((sheet as CSSStyleSheet).cssRules).some(rule => rule.cssText.includes('@keyframes shake'));
        }) as CSSStyleSheet;

        if (styleSheet && styleSheet.ownerNode) {
            // Remove the style sheet from the document head
            document.head.removeChild(styleSheet.ownerNode);
        }
    }
}




function generateNotificationBox() {
    const notificationBox = document.createElement('div');
    notificationBox.classList.add('notificationBox');
    notificationBox.style.display = 'none';
    notificationBox.style.position = 'fixed';
    notificationBox.style.top = '20px';
    notificationBox.style.left = '50%';
    notificationBox.style.transform = 'translateX(-50%)';
    notificationBox.style.padding = '20px';
    notificationBox.style.borderRadius = '10px';
    notificationBox.style.backgroundColor = '#f1f1f1';
    notificationBox.style.zIndex = '9999';
    notificationBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    notificationBox.style.overflow = 'auto';

    document.body.appendChild(notificationBox);
}
function createNotificationBox(notification: any) {
    const notificationBox = document.querySelector('.notificationBox') as HTMLElement;
    const notificationElement = document.createElement('p');
    notificationElement.textContent = notification.notification;
    notificationBox.appendChild(notificationElement);

    if (notification.isResponseNeeded) {
        const answersContainer = document.createElement('div');
        answersContainer.className = 'answersContainer';

        Object.entries(notification.neededAnswers).forEach(([key, answer]) => {
            const label = document.createElement('label');
            label.textContent = `${answer}: `;
            answersContainer.appendChild(label);

            const input = document.createElement('input');
            input.type = 'text';
            input.required = true;  // Added this line
            label.appendChild(input);
        });
        notificationBox.appendChild(answersContainer);
    }

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Save';
    closeButton.addEventListener('click', () => {
        const answersContainer = notificationBox.querySelector('.answersContainer') as HTMLElement;

        console.log("ansercont", answersContainer)
        if (answersContainer) {
            const hasEmptyInputs = Array.from(answersContainer.querySelectorAll('input')).some((input) => {
                return input.value === '';
            });

            if (hasEmptyInputs) {
                alert('Please fill in all the fields');
                return;
            }
            sendAnswersToBackground(notification);
            notificationBox
        }
        sendAnswersToBackground(notification);
        notificationBox.style.display = 'none';
        notBox = false;
        stopBellShaking()
    });
    notificationBox.appendChild(closeButton);
}



function sendAnswersToBackground(notification: any) {
    const notificationBox = document.querySelector('.notificationBox') as HTMLElement;
    const answersContainer = notificationBox.querySelector('.answersContainer') as HTMLElement;
    console.log(answersContainer)
    const answers: { [key: string]: string } = {};

    answersContainer?.querySelectorAll('input').forEach((input, index) => {

        const label = answersContainer.querySelectorAll('label')[index];
        const question = label.textContent?.trim().split(':')[0] || ''; // Assign a default empty string if question is undefined
        answers[question] = input.value;
    });
    console.log(answers)

    chrome.runtime.sendMessage({
        type: 'SEND_ANSWERS',
        notification: notification,
        answers,
    });
    generateNotificationBox()
}




void toggleTheme();
