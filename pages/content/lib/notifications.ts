import { Notification as CustomNotification } from './types';
import Keyboard from './Keyboard';
import { getStoredData, setStoredData, generateUniqueId } from './utils';

export let notifications: CustomNotification[] = [];

// Add this function to initialize notifications from localStorage
export function initializeNotifications() {
    const storedNotifications = getStoredData<CustomNotification[]>('notifications', []);
    notifications = storedNotifications;
    fillNotificationBox();
}


export function fillNotificationBox() {
    const notificationsContainer = document.querySelector('.notifications-container') as HTMLElement;
    if (!notificationsContainer) {
        console.error("Element with class 'notifications-container' not found");
        return;
    }

    notificationsContainer.innerHTML = '';

    if (notifications.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.textContent = 'No notifications';
        notificationsContainer.appendChild(emptyMessage);
        return;
    }

    // Display all notifications
    notifications.forEach((notification, index) => {
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.procitano ? 'read' : 'unread'}`;
        notificationElement.innerHTML = `
            <p>${notification.notification}</p>
            <div class="status-indicator ${notification.procitano ? 'read' : 'unread'}"></div>
        `;

        if (notification.isResponseNeeded) {
            // Add response input and send button for notifications that need a response
            const responseInput = document.createElement('input');
            responseInput.type = 'text';
            responseInput.placeholder = 'Your response...';
            responseInput.readOnly = true; // Prevent default keyboard

            const keyboardContainer = document.createElement('div');
            keyboardContainer.className = 'keyboard-container';

            const keyboard = new Keyboard({
                onKeyPress: (key) => {
                    if (key === ' ') {
                        responseInput.value += ' ';
                    } else if (key === 'Backspace') {
                        responseInput.value = responseInput.value.slice(0, -1);
                    } else {
                        responseInput.value += key;
                    }
                }
            });
            console.log(keyboard)
            // Create a container for the keyboard
            const keyboardElement = document.createElement('div');
            keyboardElement.className = 'custom-keyboard keyboard--hidden';

            // Append the keyboard's DOM element
            /* keyboardElement.appendChild(keyboard); */

            responseInput.addEventListener('focus', () => {
                keyboardContainer.appendChild(keyboardElement);
                keyboardElement.classList.remove('keyboard--hidden');
            });

            responseInput.addEventListener('blur', () => {
                keyboardContainer.innerHTML = '';
            });

            const sendButton = document.createElement('button');
            sendButton.textContent = 'Send';
            sendButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                handleSend(notification, responseInput.value);
                keyboardContainer.innerHTML = '';
            });

            notificationElement.appendChild(responseInput);
            notificationElement.appendChild(keyboardContainer);
            notificationElement.appendChild(sendButton);
        } else {
            notificationElement.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event from bubbling up
                if (!notification.procitano) {
                    notification.procitano = true;
                    sendAnswersToBackground(notification);
                    fillNotificationBox();
                }
            });
        }

        notificationsContainer.appendChild(notificationElement);
    });

    // Add helper function to handle sending responses
    function handleSend(notification: CustomNotification, response: string) {
        notification.response = { generalResponse: response };
        notification.procitano = true;
        sendAnswersToBackground(notification);
        fillNotificationBox();
    }
}

export function checkAndDisplayNotifications() {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    notifications.forEach(notification => {
        if (notification.vrijeme_prikaza === currentTime && notification.isActive) {
            alert(notification.notification);
            if (!notification.ponavljajuca) {
                notification.isActive = false;
            }
        }
    });
    setStoredData('notifications', notifications);
    fillNotificationBox();
}

export function getNotificationsFromStorage() {
    notifications = getStoredData<CustomNotification[]>('notifications', []);
    fillNotificationBox();
}

export function addNotification(notificationText: string, isResponseNeeded: boolean = false, ponavljajuca: boolean = false, vrijeme_prikaza: string = '') {
    const newNotification: CustomNotification = {
        id: generateUniqueId(),
        notification: notificationText,
        procitano: false,
        isResponseNeeded,
        ponavljajuca,
        vrijeme_prikaza,
        isActive: true,
        response: null
    };
    notifications.unshift(newNotification); // Add to the beginning of the array
    updateLocalStorage();
    fillNotificationBox();
}

export function removeNotification(id: string) {
    notifications = notifications.filter(n => n.id !== id);
    updateLocalStorage();
    fillNotificationBox();
}

function updateLocalStorage() {
    setStoredData('notifications', notifications);
}

function toggleReadStatus(notification: CustomNotification) {
    notification.procitano = !notification.procitano;
    updateLocalStorage();
    fillNotificationBox();
}

function respondToNotification(notification: CustomNotification) {
    const response = prompt('Enter your response:');
    if (response !== null) {
        notification.response = response;
        notification.isResponseNeeded = false;
        updateLocalStorage();
        fillNotificationBox();
    }
}

function deleteNotification(notification: CustomNotification) {
    notifications = notifications.filter(n => n.id !== notification.id);
    updateLocalStorage();
    fillNotificationBox();
}

export function clearNotificationsAtSpecificTime() {
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });
    if (currentTime === '00:00') {
        notifications = notifications.filter(notification => notification.ponavljajuca);
        updateLocalStorage();
        fillNotificationBox();
    }
}



export function updateAddLikeNotificationText(text: string) {
    const movingText1 = document.getElementById("movingText1");
    const movingText2 = document.getElementById("movingText2");
    const blackScreen = document.getElementById("blackBox");
    startBellShake()
    blackScreen?.classList.add("newMessage")



    if (movingText1 && movingText2) {
        // Set the same text for both moving elements
        movingText1.textContent = text;
        movingText2.textContent = text;

        // Calculate the text width and container width
        const textWidth = movingText1.offsetWidth;
        const containerWidth = movingText1.parentElement!.offsetWidth;

        // Calculate the duration of the animation based on the text width and container width
        const scrollDuration = Math.max((textWidth + containerWidth) / 150, 10); // Adjust the divisor for speed control

        // Update the keyframes for the scrolling text animation with dynamic duration
        let styleSheet = document.getElementById("scrollStyle") as HTMLStyleElement;
        if (!styleSheet) {
            styleSheet = document.createElement("style");
            styleSheet.id = "scrollStyle";
            styleSheet.type = "text/css";
            document.head.appendChild(styleSheet);
        }

        styleSheet.sheet?.insertRule(`
            @keyframes moveText {
                0% { transform: translateX(${containerWidth}px); }
                100% { transform: translateX(-${textWidth}px); }
            }
        `);
        styleSheet.sheet?.insertRule(`
            #movingText1, #movingText2 {
                animation: moveText ${scrollDuration}s linear infinite;
            }
        `);

        // Set initial positions
        movingText1.style.transform = `translateX(${containerWidth}px)`;
        movingText2.style.transform = `translateX(${containerWidth + textWidth + 30}px)`; // Spacing between texts

        // Start the animation for both texts
        [movingText1, movingText2].forEach((movingText) => {
            movingText.style.animation = `moveText ${scrollDuration}s linear infinite`;
        });
    }
}


export function createAddLikeNotificationBox() {
    const blackBoxContainer = createBlackBoxElement();
    document.body.appendChild(blackBoxContainer);

    const notificationsContainer = document.createElement('div');
    notificationsContainer.classList.add('notifications-container');
    blackBoxContainer.appendChild(notificationsContainer);

    blackBoxContainer.addEventListener("click", (e) => {
        console.log("Black box clicked", e);
        toggleNotificationsContainer();
    });

    // Prevent clicks within the notifications container from closing it
    notificationsContainer.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    return function addNotification(message: string, isResponseNeeded: boolean, ponavljajuca: boolean, vrijeme_prikaza: string) {
        const notificationItem = document.createElement('div');
        notificationItem.classList.add('notification-item');
        notificationItem.textContent = message;
        notificationsContainer.appendChild(notificationItem);

        updateAddLikeNotificationText(message);
    };
}

function createBlackBoxElement(): HTMLElement {
    const blackBoxContainer = document.createElement("div");
    blackBoxContainer.id = "blackBoxContainer";
    blackBoxContainer.classList.add('black-box-container');

    const blackBox = document.createElement("div");
    blackBox.id = "blackBox";
    blackBox.classList.add('black-box');

    const movingText1 = document.createElement("div");
    const movingText2 = document.createElement("div");
    [movingText1, movingText2].forEach((movingText, index) => {
        movingText.id = `movingText${index + 1}`;
        movingText.classList.add('moving-text');
        blackBox.appendChild(movingText);
    });

    const notificationSVG = createNotificationSVG();

    blackBoxContainer.appendChild(notificationSVG);
    blackBoxContainer.appendChild(blackBox);

    return blackBoxContainer;
}

function createNotificationSVG(): SVGSVGElement {
    const notificationSVGNamespace = "http://www.w3.org/2000/svg";
    const notificationSVG = document.createElementNS(notificationSVGNamespace, "svg");

    notificationSVG.setAttribute("width", "40");
    notificationSVG.setAttribute("height", "40");
    notificationSVG.setAttribute("viewBox", "-8 -8 60 55");
    notificationSVG.setAttribute("fill", "none");
    notificationSVG.setAttribute("xmlns", notificationSVGNamespace);
    notificationSVG.classList.add("notificationLogo");

    const notificationPath = document.createElementNS(notificationSVGNamespace, "path");
    notificationPath.setAttribute("d", "M11.7917 3.50016L8.81258 0.520996C3.81258 4.3335 0.520915 10.2085 0.229248 16.8752H4.39592C4.54349 14.2331 5.28514 11.6584 6.56564 9.34263C7.84614 7.02691 9.63251 5.02986 11.7917 3.50016ZM37.6042 16.8752H41.7709C41.4584 10.2085 38.1667 4.3335 33.1876 0.520996L30.2292 3.50016C32.3792 5.03739 34.1576 7.03664 35.4339 9.35113C36.7101 11.6656 37.4517 14.2366 37.6042 16.8752ZM33.5001 17.9168C33.5001 11.521 30.0834 6.16683 24.1251 4.75016V3.3335C24.1251 1.60433 22.7292 0.208496 21.0001 0.208496C19.2709 0.208496 17.8751 1.60433 17.8751 3.3335V4.75016C11.8959 6.16683 8.50008 11.5002 8.50008 17.9168V28.3335L4.33341 32.5002V34.5835H37.6667V32.5002L33.5001 28.3335V17.9168ZM21.0001 40.8335C21.2917 40.8335 21.5626 40.8127 21.8334 40.7502C23.1876 40.4585 24.2917 39.5418 24.8334 38.2918C25.0417 37.7918 25.1459 37.2502 25.1459 36.6668H16.8126C16.8334 38.9585 18.6876 40.8335 21.0001 40.8335Z");
    notificationPath.setAttribute("fill", "#808080");

    notificationSVG.appendChild(notificationPath);
    return notificationSVG;
}

function toggleNotificationsContainer() {
    const notificationsContainer = document.querySelector('.notifications-container') as HTMLElement;
    if (notificationsContainer) {
        notificationsContainer.classList.toggle('open');
    }
    fillNotificationBox();
}

function removeTextOnRead() {
    // Implement this function
    console.log("Removing text on read");
}

let addLikeNotificationBoxIsOpen = false;

export function changeLikeNotificationBoxStyle() {
    toggleNotificationsContainer();
}

function sendAnswersToBackground(notification: CustomNotification) {
    chrome.runtime.sendMessage({
        type: 'SEND_ANSWERS',
        notification: notification,
    });
    console.log("Sending answers to background:", notification);
}

function stopBellShaking() {
    const svgElement = document.querySelector(".notificationLogo") as HTMLElement;

    if (svgElement) {
        svgElement.classList.remove("shake");
        svgElement.querySelector("filter")?.remove();
    }
    console.log("Stopping bell shaking");
}

export function startBellShake() {
    const svgElement = document.querySelector(".notificationLogo") as HTMLElement;

    if (svgElement) {
        svgElement.classList.add("shake");
        svgElement.querySelector("filter")?.remove();
    }

}

// Add any other notification-related functions here