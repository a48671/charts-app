import { AbstractComponent } from "./abstract-component";
import { Calendar } from "./calendar";
import { createElement, getStringDateFromDate, getDataByDateRange } from "../utils";
import { store } from "src/store";

export class PeriodSelect extends AbstractComponent {
    constructor() {
        super();

        this.calendarForStart = new Calendar({
            selectedDate: new Date('2005-12-31'),
            name: 'с:',
            onChange: this.onChangeStartDate
        }).getElement();

        this.calendarForEnd = new Calendar({
            selectedDate: new Date('2005-12-31'),
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
        const { end, selectedData } = store.state;
        const start = getStringDateFromDate(date);
        const data = getDataByDateRange(store.state[selectedData], start, end);
        store.setState({ start, data })
    }

    /**
     *
     * @param date: Date
     */
    onChangeEndDate(date) {
        const { start, selectedData } = store.state;
        const end = getStringDateFromDate(date);
        const data = getDataByDateRange(store.state[selectedData], start, end);
        store.setState({ end, data })
    }
}
