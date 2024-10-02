let glowElement: HTMLElement | null = null;

export function createGlowElement(navHeight: number) {
    if (glowElement) return;

    glowElement = document.createElement('div');
    glowElement.id = 'glow-element';
    glowElement.style.position = 'fixed';
    glowElement.style.top = `${navHeight}px`;
    glowElement.style.left = '0';
    glowElement.style.width = '100%';
    glowElement.style.height = '100%';
    glowElement.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
    glowElement.style.backdropFilter = 'blur(5px)';
    glowElement.style.zIndex = '9999';
    glowElement.style.display = 'none';

    document.body.appendChild(glowElement);
}

export function hideGlowElement() {
    if (glowElement) {
        glowElement.style.display = 'none';
    }
}

export function showGlowElement() {
    if (glowElement) {
        glowElement.style.display = 'block';
    }
}

export function addStyleToTicket(ticketElement: HTMLElement, headerColor: string, bodyColor: string, ticketCode: string) {


    /*  const parentTbody = ticketElement.closest('tbody');
     if (parentTbody) {
         parentTbody.style.backgroundColor = bodyColor;
     } */
}

export function addGlobalStyles() {
    const style = document.createElement('style');
    style.textContent += `
        .ticket-container {
            position: relative;
        }

        .package-row {
            position: relative;
            z-index: 0;
        }

        .package-image {
            position: absolute;
            left: 0;
            width: 100%;
            z-index: -1;
            object-fit: cover;
            border-radius: 10px;
            opacity: 0.8;
        }

        .selected-ticket{
            box-shadow: 0 0 0 5px red !important;
        }
        .zero-progress-ticket {
            color: black !important;
            border-radius: 0.75rem;
            outline: none !important;
        }
        .ticket-row-header{
            border-radius: 0.4rem 0.4rem 0 0 ;
            color: white !important;
         }
        .glovo {
            border: 5px solid rgba(0,160,30,1);
            border-radius: 0.75rem ;
            background-color: rgba(255,194,68,0.5) !important;
        }
        .glovo .ticket-row-header {
            background-color: rgba(0,160,30,1) !important;
        }
        .ovdje {
            border: 5px solid rgba(57,181,224,1);
            background-color: rgba(57,181,224,0.5) !important;
        }
        .ovdje .ticket-row-header {
            background-color: rgba(57,181,224,1) !important;
        }
        .van {
            border: 5px solid rgba(255,77,77,1);
            background-color: rgba(255,77,77,0.5) !important;
        }
        .van .ticket-row-header {
            background-color: rgba(255,77,77,1) !important;
        }

        .black-box-container {
            position: absolute;
            top: 40px;
            left: 50%;
            transform: translateX(-50%);
            width: 50vw;
            z-index: 9998;
        }

        .black-box {
            position: relative;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            height: 40px;
            width: 100%;
            background-color: rgba(85, 85, 85, 0.5);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            overflow: hidden;
            border-radius: 10px 10px 0 0;
            cursor: pointer;
        }

        .black-box.newMessage {
            box-shadow: 0 0 50px red;
        }

        .notificationLogo {
            position: absolute;
            top: -20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
        }

        .moving-text {
            position: absolute;
            white-space: nowrap;
            color: black;
            font-size: 20px;
        }

        .notifications-container {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            max-height: 300px;
            overflow-y: auto;
            background-color: rgba(85, 85, 85, 0.15);
            border-radius: 0 0 10px 10px;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }

        .notifications-container.open {
            display: block;
        }

        .notification-item {
            padding: 10px;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            background-color: rgba(255, 255, 255, 0.9);
            transition: background-color 0.3s ease;
        }

        .notification-item:last-child {
            border-bottom: none;
        }

        .notification-item:hover {
            background-color: rgba(255, 255, 255, 1);
        }

        .notification-item.unread {
            font-weight: bold;
            background-color: rgba(255, 255, 255, 0.95);
        }

        .notification-item .status-indicator {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 10px;
        }

        .notification-item .status-indicator.unread {
            background-color: #007bff;
        }

        .notification-item .status-indicator.read {
            background-color: #6c757d;
        }

        .notification-item input[type="text"] {
            width: calc(100% - 70px);
            padding: 5px;
            margin-top: 5px;
            border: 1px solid #ccc;
            border-radius: 4px;
        }

        .notification-item button {
            padding: 5px 10px;
            margin-top: 5px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .notification-item button:hover {
            background-color: #0056b3;
        }
        .notificationLogo.shake{
            
                animation: vibrate 0.5s ease-in-out infinite;
                filter: drop-shadow(0 0 5px red) drop-shadow(0 0 10px red);
            
        }
        .fullscreen-button {
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 24px;
            transition: background-color 0.3s ease;
            width: 44px;
            height: 44px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .fullscreen-button:hover {
            background-color: #0056b3;
        }

        .fullscreen-button::before {
            content: '⤢';
        }

        
        #summary-container {
            top: 20px;
            right: 20px;
            width: 350px;
            max-height: 90vh;
            overflow-y: auto;
            background-color: #f0f0f0;
            border: 2px solid #333;
            border-radius: 12px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            font-family: Arial, sans-serif;
            z-index: 1000;
        }

        .summary-category {
            background-color: #ffffff;
            border-radius: 8px;
            padding: 12px;
            box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
        }

        .summary-category h3 {
            display: flex;
            justify-content: space-between;
            font-size: 22px;
            color: #ffffff;
            margin-bottom: 0px;
            padding: 8px 12px;
            border-radius: 6px 6px 0 0;
            background-color: #AA66CC;
        }

        .summary-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-radius: 10px 10px 0 0;
            background: #8844AA;
            padding: 10px;
        }

        .summary-header h4 {
            margin-bottom: 0;
            color: white;
            font-size: 26px;
            text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
        }
            
        .category-header{
            margin-bottom: 10px;
            background-color: #AA66CC;
            
        }

        .summary-category ul {
            list-style-type: none;
            padding-left: 0;
            margin: 0;
            border: 1px solid #999;
            border-top: none;
            border-radius: 0 0 6px 6px;
        }

        .summary-category li {
            font-size: 18px;
            font-weight: bold;
            color: #333;
            margin-bottom: 8px;
            padding: 6px 10px;
            background-color: #f9f9f9;
            border-bottom: 1px solid #ddd;
        }

        .summary-category li:last-child {
            border-bottom: none;
        }

        .summary-category li::before {
            content: attr(data-count);
            font-weight: bolder;
            color: #fff;
            background-color: #AA66CC;
            padding: 2px 8px;
            font-size: 20px;
            border-radius: 4px;
            margin-right: 10px;
        }

        #summary-container button {
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #summary-container button:hover {
            background-color: #e0e0e0;
        }

        #summary-container .category-toggle-button {
            background: none;
            border: none;
            font-size: 16px;
            cursor: pointer;
            padding: 0 5px;
        }

        #hidden-categories-container button {
            margin: 5px;
            padding: 5px 10px;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        #hidden-categories-container button:hover {
            background-color: #e9ecef;
        }

        @keyframes vibrate {
             0% { transform: translateX(-50%) rotate(0deg); }
                25% { transform: translateX(-50%) rotate(15deg); }
                50% { transform: translateX(-50%) rotate(0deg); }
                75% { transform: translateX(-50%) rotate(-15deg); }
                100% { transform: translateX(-50%) rotate(0deg); }
        }

        /* Keyboard styles */
        .keyboard {
            background-color: #e0e0e0;
            border-radius: 6px;
            padding: 10px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            position: fixed;
            bottom: 10px;
        }

        .keyboard-row {
            display: flex;
            justify-content: center;
            margin-bottom: 8px;
        }

        .keyboard-key {
            background-color: #f5f5f5;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            color: #333;
            cursor: pointer;
            font-size: 16px;
            margin: 0 2px;
            min-width: 30px;
            padding: 8px 12px;
            text-align: center;
            transition: all 0.1s ease;
        }

        .keyboard-key:hover {
            background-color: #e6e6e6;
        }

        .keyboard-key:active {
            background-color: #d9d9d9;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
            transform: translateY(1px);
        }
        .keyboard--hidden{
            display: none;
        }
        .space-key {
            width: 200px;

        }





        // ... rest of the styles ...
    `;
    document.head.appendChild(style);
}


// Add any other style-related functions here