'use strict';

import { UI } from './app.js';

class Color {
    constructor(value) {
        this.color = value;
    }
}

class StateValue {
    static getBgColor() {
        let bgColor;
        if (!localStorage.getItem('bgcolor')) {
            bgColor = '';
        } else {
            bgColor = localStorage.getItem('bgcolor');
        }
        return bgColor;
    }

    static getTextColor() {
        let textColor;
        if (!localStorage.getItem('textcolor')) {
            textColor = '';
        } else {
            textColor = localStorage.getItem('textcolor');
        }
        return textColor;
    }

    static addBgColor(color) {
        let bgColor = StateValue.getBgColor();
        bgColor = color;
        localStorage.setItem('bgcolor', bgColor);
    }

    static addTextColor(color) {
        let textColor = StateValue.getTextColor();
        textColor = color;
        localStorage.setItem('textcolor', textColor);
    }
}

// toggling mode functionality
document.querySelector('.icon-area').addEventListener('click', e => {
    const element = e.target.classList;
    if (element.contains('light-theme-icon')) {
        const color = new Color('fff');

        UI.setAppBgColor(color.color);

        UI.setAppTextColor('333');

        StateValue.addBgColor(color.color);

        StateValue.addTextColor('333');

        document.querySelector('.icon-area').innerHTML = `<i id="dark-icon" data-color="000" class="fas fa-moon fa-2x dark-theme-icon"></i>`;

    } else if (element.contains('dark-theme-icon')) {
        const color = new Color('333');

        UI.setAppBgColor(color.color);

        UI.setAppTextColor('fff');

        StateValue.addBgColor(color.color);

        StateValue.addTextColor('fff');

        document.querySelector('.icon-area').innerHTML = `<i id="light-icon" data-color="fff" class="fas fa-sun fa-2x light-theme-icon"></i>`;
    }

});

export { StateValue };
