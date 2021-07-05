import { AbstractComponent } from "./abstract-component";
import { Calendar } from "./calendar";
import { createElement, getStringDateFromDate } from "../utils";
import { store } from "src/store";

export class PeriodSelect extends AbstractComponent {
    constructor() {
        super();

        this.calendarForStart = new Calendar({
            selectedDate: new Date(store.state.start),
            name: 'с:',
            onChange: this.onChangeStartDate
        }).getElement();

        this.calendarForEnd = new Calendar({
            selectedDate: new Date(store.state.end),
            name: 'по:',
            onChange: this.onChangeEndDate
        }).getElement();

        this.start = createElement('div', 'period-select__item', [this.calendarForStart]);
        this.end = createElement('div', 'period-select__item', [this.calendarForEnd]);


        this.wrapper = createElement('div', 'period-select', [this.start, this.end]);
    }

    /**
     *
     * @param date: Date
     */
    onChangeStartDate(date) {
        const start = getStringDateFromDate(date);
        store.setState({ start })
    }

    /**
     *
     * @param date: Date
     */
    onChangeEndDate(date) {
        const end = getStringDateFromDate(date);
        store.setState({ end })
    }
}
