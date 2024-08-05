import { toggleTheme } from '@lib/toggleTheme';








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







void toggleTheme();
