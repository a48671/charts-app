import { AbstractComponent } from "src/components/abstract-component";
import { createElement } from 'src/utils';

export class YearsSelect extends AbstractComponent {
    constructor(year, yearsList) {
        super();

        this.options = yearsList.map((year) => {
            const option = createElement('option', 'calendar__years-item');
            option.innerText = year;
            option.value = year;
            return option;
        });

        this.wrapper = createElement('select', 'calendar__select', this.options);

        this.setYear(year);
    }

    setYear(year) {
        this.wrapper.value = year;
    }

    get year() {
        return parseInt(this.wrapper.value);
    }
}
