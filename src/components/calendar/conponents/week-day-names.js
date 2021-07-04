import { AbstractComponent } from "src/components/abstract-component";
import { createElement } from 'src/utils';
import { weekDayNames } from '../calendar.const';

export class WeekDayNames extends AbstractComponent {
    constructor() {
        super();
        const names = weekDayNames.map((name) => {
            const nameElement = createElement('th', 'calendar__week-day-name');
            nameElement.innerText = name;
            return nameElement;
        });
        this.list = createElement('tr', '', names);
        this.wrapper = createElement('thead', 'calendar__week-day-names', [this.list]);
    }
}
