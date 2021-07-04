import { AbstractComponent } from "src/components/abstract-component";
import { createElement } from 'src/utils';
import { months } from '../calendar.const';

export class MonthSelect extends AbstractComponent {
    constructor(index) {
        super();
        this.options = months.map((month, index) => {
            const option = createElement('option', 'calendar__months-item');
            option.innerText = month;
            option.value = index;
            return option;
        });
        this.wrapper = createElement('select', 'calendar__select', this.options);
        this.setMonthIndex(index);
    }

    setMonthIndex(index) {
        this.wrapper.value = index;
    }

    get monthIndex() {
        return parseInt(this.wrapper.value);
    }
}
