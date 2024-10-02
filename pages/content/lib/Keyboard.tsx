interface KeyboardOptions {
    onKeyPress: (key: string) => void;
}

class Keyboard {
    private keys: string[][];
    private onKeyPress: (key: string) => void;

    constructor(options: KeyboardOptions) {
        this.onKeyPress = options.onKeyPress;
        this.keys = [
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.']
        ];
    }

    createKeyboard(): () => HTMLElement {
        return () => {
            const keyboard = document.createElement('div');
            keyboard.className = 'keyboard';

            this.keys.forEach(row => {
                const rowElement = document.createElement('div');
                rowElement.className = 'keyboard-row';

                row.forEach(key => {
                    const button = document.createElement('button');
                    button.className = 'keyboard-key';
                    button.textContent = key;
                    button.addEventListener('click', () => this.onKeyPress(key));
                    rowElement.appendChild(button);
                });

                keyboard.appendChild(rowElement);
            });

            const spaceRow = document.createElement('div');
            spaceRow.className = 'keyboard-row';
            const spaceButton = document.createElement('button');
            spaceButton.className = 'keyboard-key space-key';
            spaceButton.textContent = 'Space';
            spaceButton.addEventListener('click', () => this.onKeyPress(' '));
            spaceRow.appendChild(spaceButton);
            keyboard.appendChild(spaceRow);

            return keyboard;
        };
    }
}

export default Keyboard;
