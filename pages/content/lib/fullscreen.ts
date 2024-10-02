function requestFullscreen() {
    const elem = document.documentElement;
    elem.requestFullscreen();

}

export function createFullscreenButton() {
    const buttonsContainer = document.querySelector(".ticket-menu-buttons-wrapper")
    const button = document.createElement('button');
    button.classList.add('fullscreen-button');
    button.addEventListener('click', requestFullscreen);
    buttonsContainer?.prepend(button);
    return button;
}




