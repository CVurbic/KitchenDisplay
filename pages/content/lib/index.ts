import { settings, loadSettings } from './settings';
import { processTicket, handleSkupniPrikaz, easyToMakeTicketsHighlighter, importantArticle } from './ticketProcessing';
import { removeNotification, updateAddLikeNotificationText, startBellShake, createAddLikeNotificationBox, notifications, addNotification, fillNotificationBox, getNotificationsFromStorage, checkAndDisplayNotifications, clearNotificationsAtSpecificTime } from './notifications';
import { createGlowElement, hideGlowElement, showGlowElement, addGlobalStyles } from './styles';
import { uncommentParentElement, setStoredData, getStoredData } from './utils';
import { achievementSystem } from './achievementSystem';
import { createFullscreenButton } from './fullscreen';
// Initialize settings and notifications

createAddLikeNotificationBox()
loadSettings();
getNotificationsFromStorage();

createFullscreenButton()
window.addEventListener('load', () => {
    uncommentParentElement();
    initializeTickets();

});



// Create necessary elements
const navHeight = document.getElementById('navigacija')?.offsetHeight || 45;
const spacer = document.createElement("div")
spacer.classList.add("spacer")
spacer.style.height = "30px"
document.querySelector(".tab-content")!.prepend(spacer)
createGlowElement(navHeight);
addGlobalStyles();

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Content message: ", message);

    /*  if (message.settings) {
         Object.assign(settings, message.settings);
         if (settings.onOffCollors) {
             addColorToTicket();
         } else {
             location.reload();
         }
         importantArticle();
         setStoredData("settings", settings);
     } */

    if (message.popisArtikala) {
        // Handle popisArtikala if needed
        // allArticles.push(message.popisArtikala);
        // setStoredData("allArticles", allArticles);
    }

    if (message.startNotifications) {
        getNotificationsFromStorage();
    }

    if (message.newNotification || message.otherUpdateNotification) {
        const notification = message.newNotification || message.otherUpdateNotification;

        // Add the new notification to the list
        addNotification(notification.notification, notification.isResponseNeeded, notification.ponavljajuca, notification.vrijeme_prikaza);
        updateAddLikeNotificationText(notification.notification);
    }

    if (message.removeNotification) {
        // Remove the notification from the list
        removeNotification(message.removeNotification.id);
        fillNotificationBox();
        removeTextOnRead();
    }

    if (message.readNotification) {
        const notificationToUpdate = notifications.find(n => n.id === message.readNotification.id);
        if (notificationToUpdate) {
            notificationToUpdate.procitano = true;
            setStoredData('notifications', notifications);
            fillNotificationBox();
            removeTextOnRead();
            stopBellShaking();
        }
    }

    if (message.repeatingNotification) {
        handleRepeatingNotification(message.repeatingNotification);
    }
});

function handleRepeatingNotification(notification: any) {
    const [hours, minutes] = notification.vrijeme_prikaza.split(':').map(Number);
    const lastNotificationTime = localStorage.getItem('lastNotificationTime');

    if (lastNotificationTime && new Date(lastNotificationTime) < new Date()) {
        addNotification(notification.notification, notification.isResponseNeeded, true, notification.vrijeme_prikaza);
    }

    setInterval(() => {
        const currentTime = new Date();
        if (currentTime.getHours() === hours && currentTime.getMinutes() === minutes) {
            addNotification(notification.notification, notification.isResponseNeeded, true, notification.vrijeme_prikaza);
            localStorage.setItem('lastNotificationTime', new Date().toISOString());
        }
    }, 60000); // Check every minute
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeNotifications();
    achievementSystem.displayAchievements();
});

function initializeNotifications() {
    const storedNotifications = getStoredData<Notification[]>('notifications', []);
    /*  notifications = storedNotifications; */
    fillNotificationBox();
}

function removeTextOnRead() {
    // Implement this function
}

function stopBellShaking() {
    // Implement this function
}

// Periodic checks
setInterval(() => {
    clearNotificationsAtSpecificTime();
    checkAndDisplayNotifications();
}, 60000);

// Main execution
function initializeTickets() {

    easyToMakeTicketsHighlighter();
    importantArticle();



    hideGlowElement();
}



// Add this set to keep track of processed ticket IDs
const processedTicketIds = new Set<string>();

// Add this set to keep track of processed ticket element IDs
const processedTicketElementIds = new Set<string>();

// Helper function to generate a unique identifier for each ticket element
function generateUniqueElementId(ticketElement: HTMLElement): string {
    const ticketId = ticketElement.getAttribute('ticketid');
    const rowId = ticketElement.querySelector('tr')?.getAttribute('id');
    return `${ticketId}-${rowId}`;
}


// Observer setup
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {


        mutation.addedNodes.forEach((node) => {
            if (
                node.nodeType === Node.ELEMENT_NODE &&
                (node as HTMLElement).tagName.toLowerCase() === "tbody" &&
                (node as HTMLElement).classList.contains("zero-progress-ticket")
            ) {
                processTicket(node as HTMLTableSectionElement, true);
                handleSkupniPrikaz();
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
