import { AbstractComponent } from "src/components/abstract-component";
import { createElement, getTwoLengthStringNumber } from "src/utils";

export class Label extends AbstractComponent {
    constructor(date, name = '') {
        super();
        this.name = name;
        this.wrapper = createElement('div', 'calendar__label');
        this.setLabel(date);
    }

    setLabel(date) {
        let stringDate = 'Дата не выбрана';
        if (date instanceof Date) {
            stringDate = this.formattingDate(date);
        }
        this.wrapper.innerText = `${this.name} ${stringDate}`;
    }

    formattingDate(date) {
        return ([
            getTwoLengthStringNumber(date.getDate()),
            getTwoLengthStringNumber(date.getMonth() + 1),
            date.getFullYear()
        ]).join('.');
    }
}
