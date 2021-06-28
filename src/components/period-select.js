import { AbstractComponent } from "./abstract-component";
import { createElement, getDataByDateRange } from "../utils";
import { store } from "src/store";

export class PeriodSelect extends AbstractComponent {
    constructor() {
        super();
        this.start = createElement('input', 'period-select__item');
        this.start.type = 'date';
        this.start.value = store.state.start;
        this.end = createElement('input', 'period-select__item');
        this.end.type = 'date';
        this.end.value = store.state.end;
        this.wrapper = createElement('div', 'period-select', [this.start, this.end]);

        this.wrapper.addEventListener('input', (event) => {
            if (new Date(event.target.value).toString() === 'Invalid Date') return;
            const { start, end, selectedData } = store.state;
            const date = event.target.value;
            const newStart = event.target === this.start ? date : start;
            const newEnd = event.target === this.end ? date : end;
            const data = getDataByDateRange(store.state[selectedData], newStart, newEnd);
            switch (event.target) {
                case this.start:
                    store.setState({ start: event.target.value, data });
                    return;
                case this.end:
                    store.setState({ end: event.target.value, data });
                    return;
            }
        })
    }
}
