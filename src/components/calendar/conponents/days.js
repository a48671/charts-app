import { AbstractComponent } from 'src/components/abstract-component';
import { createElement, equalDates, getStringDateFromDate } from "src/utils";
export class Days extends AbstractComponent {
    /**
     *
     * @param monthDays: Array<Array<date | undefined>>
     * @param selectedDate: Date
     */
    constructor(monthDays, selectedDate) {
        super();

        this.selectedDate = selectedDate
        this.monthDays = monthDays;
        const weekElements = this.createWeeks(this.monthDays);
        this.wrapper = createElement('tbody', 'calendar__days', weekElements);
    }

    /**
     * @param:
     *  weekDays - Array<Date>
     * @return: DOMElement
     */
    createWeek(weekDays) {
        const dayElements = weekDays.map((day) => {
            const dayElement = createElement('td', 'calendar__week-col');
            if (day instanceof Date) {
                dayElement.innerText = day.getDate();
                dayElement.dataset.date = getStringDateFromDate(day);
                if (equalDates(day, new Date())) {
                    dayElement.classList.add('current');
                }
                if (equalDates(day, this.selectedDate)) {
                    dayElement.classList.add('selected');
                }
            } else {
                dayElement.classList.add('empty');
            }
            return dayElement;
        });
        return createElement('tr', 'calendar__week-row', dayElements);
    }

    /**
     * @param:
     *  monthDays - Array<Date>
     * @return: Array<DOMElement>
     */
    createWeeks(monthDays) {
        return monthDays.map((weekDays) => {
            return this.createWeek(weekDays);
        })
    }

    setSelectedDay(date) {
        this.selectedDate = date;
        this.update();
    }

    setMonthDays(monthDays) {
        this.monthDays = monthDays;
        this.update();
    }

    getSelectedDate() {
        return this.selectedDate;
    }

    update() {
        const weekElements = this.createWeeks(this.monthDays);
        this.wrapper.innerHTML = '';
        for (const element of weekElements) {
            this.wrapper.appendChild(element);
        }
    }
}
