let isFullscreen = false;

const enterFullscreenIcon = `<svg fill="#fff" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 3.414L9.414 8 14 12.586v-2.583h2V16h-6v-1.996h2.59L8 9.414l-4.59 4.59H6V16H0v-5.997h2v2.583L6.586 8 2 3.414v2.588H0V0h16v6.002h-2V3.414zm-1.415-1.413H10V0H6v2H3.415L8 6.586 12.585 2z" fill-rule="evenodd"/>
</svg>`;

const exitFullscreenIcon = `<svg height="16" width="16" fill="#fff" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <g id="fullscreen_x5F_exit">
        <g>
            <polygon style="fill:#ffffff;" points="24.586,27.414 29.172,32 32,29.172 27.414,24.586 32,20 20,20 20,32"/>
            <polygon style="fill:#ffffff;" points="0,12 12,12 12,0 7.414,4.586 2.875,0.043 0.047,2.871 4.586,7.414"/>
            <polygon style="fill:#ffffff;" points="0,29.172 2.828,32 7.414,27.414 12,32 12,20 0,20 4.586,24.586"/>
            <polygon style="fill:#ffffff;" points="20,12 32,12 27.414,7.414 31.961,2.871 29.133,0.043 24.586,4.586 20,0"/>
        </g>
    </g>
</svg>`;

function toggleFullscreen() {
    if (!isFullscreen) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

function updateFullscreenButton(button: HTMLButtonElement) {
    if (isFullscreen) {
        button.innerHTML = exitFullscreenIcon;
        button.title = 'Exit fullscreen';
    } else {
        button.innerHTML = enterFullscreenIcon;
        button.title = 'Enter fullscreen';
    }
}

export function createFullscreenButton() {
    const buttonsContainer = document.querySelector(".ticket-menu-buttons-wrapper");
    const button = document.createElement('button');
    button.classList.add('fullscreen-button');

    updateFullscreenButton(button);

    button.addEventListener('click', () => {
        toggleFullscreen();
    });

    document.addEventListener('fullscreenchange', () => {
        isFullscreen = !!document.fullscreenElement;
        updateFullscreenButton(button);
    });

    buttonsContainer?.prepend(button);
    return button;
}




