import { AbstractComponent } from "src/components/abstract-component";
import { MonthSelect } from "./conponents/month-select";
import { YearsSelect } from "./conponents/years-select";
import { WeekDayNames } from "./conponents/week-day-names";
import { Days } from "./conponents/days";
import { Arrow } from "./conponents/arrow";
import { Label } from "./conponents/label";
import { createElement, generatingYears, generateDaysForMonth, equalDates } from "src/utils";

const yearsList = generatingYears(1881, new Date().getFullYear());

export class Calendar extends AbstractComponent {
    constructor({ selectedDate, name, onChange }) {
        super();

        const monthIndex = selectedDate ? selectedDate.getMonth() : new Date().getMonth();
        const year = selectedDate ? selectedDate.getFullYear() : new Date().getFullYear();

        /**
         *
         * @type {{
         *  daysData: Array<Array<date|undefined>>,
         *  selectedDate: Date,
         *  year: number,
         *  monthIndex: number,
         *  currentDate: Date
         * }}
         */
        this.state = {
            currentDate: new Date(),
            selectedDate: selectedDate,
            monthIndex,
            year,
            daysData: generateDaysForMonth(year, monthIndex),
            isOpen: false
        };

        this.onChange = onChange;

        this.monthsSelect = new MonthSelect(this.state.currentDate.getMonth());
        this.monthsSelectElement = this.monthsSelect.getElement();
        this.yearsSelect = new YearsSelect(this.state.currentDate.getFullYear(), yearsList);
        this.yearsSelectElement = this.yearsSelect.getElement();
        this.weekDayNames = new WeekDayNames();

        this.days = new Days(this.state.daysData, this.state.selectedDate);
        this.leftArrow = new Arrow('left');
        this.rightArrow = new Arrow('right');

        this.label = new Label(this.state.selectedDate, name);

        const headerChildren = [
            this.leftArrow.getElement(),
            this.monthsSelectElement,
            this.yearsSelect.getElement(),
            this.rightArrow.getElement()
        ];
        this.header = createElement('div', 'calendar__header', headerChildren);

        const tableChildren = [this.weekDayNames.getElement(), this.days.getElement()];
        this.table = createElement('table', 'calendar__table', tableChildren);

        this.dropdown = createElement('div', 'calendar__dropdown', [this.header, this.table]);

        const wrapperChildren = [this.label.getElement(), this.dropdown];
        this.wrapper = createElement('div', 'calendar', wrapperChildren);

        this.clickHandler = this.clickHandler.bind(this);
        this.selectMonthHandler = this.selectMonthHandler.bind(this);
        this.selectYearHandler = this.selectYearHandler.bind(this);
        this.clickOutsideHandler = this.clickOutsideHandler.bind(this);

        this.wrapper.addEventListener('click', this.clickHandler);
    }

    clickHandler(event) {
        // click at label
        if (event.target === this.label.getElement()) {
            this.setState({ isOpen: true });
            window.addEventListener('click', this.clickOutsideHandler)
            return;
        }

        // click at day (select day)
        if (event.target.dataset.date) {
            const selectedDate = new Date(event.target.dataset.date);
            if (selectedDate instanceof Date) {
                this.setState({ selectedDate, isOpen: false });
            }
            return;
        }

        // click at arrows
        const date = new Date(this.state.year, this.state.monthIndex);
        switch (event.target) {
            case this.leftArrow.getElement():
                date.setMonth(date.getMonth() - 1);
                break;
            case this.rightArrow.getElement():
                date.setMonth(date.getMonth() + 1);
                break;
        }

        const newYear = date.getFullYear();
        if (newYear > yearsList[yearsList.length - 1] || newYear < yearsList[0]) {
            return;
        }

        this.setState({
            monthIndex: date.getMonth(),
            year: date.getFullYear()
        });
    }

    selectMonthHandler(event) {
        const monthIndex = parseInt(event.target.value);
        if (Number.isNaN(monthIndex)) return;
        this.setState({ monthIndex });
        this.updateMonthDaysInDaysComponent();
    }

    selectYearHandler(event) {
        const year = parseInt(event.target.value);
        if (Number.isNaN(year)) return;
        this.setState({ year });
        this.updateMonthDaysInDaysComponent();
    }

    update(prevState) {
        const { monthIndex, year, selectedDate, isOpen } = this.state;
        const isMonthChanged = this.monthsSelect.monthIndex !== monthIndex;
        const isYearChanged = this.yearsSelect.year !== year;
        if (isMonthChanged) {
            this.monthsSelect.setMonthIndex(monthIndex);
        }
        if (isYearChanged) {
            this.yearsSelect.setYear(year);
        }
        if (isMonthChanged || isYearChanged) {
            this.updateMonthDaysInDaysComponent();
        }
        if (!equalDates(selectedDate, this.days.getSelectedDate())) {
            this.days.setSelectedDay(selectedDate);
            this.label.setLabel(selectedDate);
            this.onChange(selectedDate)
        }
        if (prevState.isOpen !== isOpen) {
            isOpen ? this.onOpenCalendar() : this.onCloseCalendar();
        }
    }

    updateMonthDaysInDaysComponent() {
        const monthDays = generateDaysForMonth(this.state.year, this.state.monthIndex);
        this.setState({ monthDays });
        this.days.setMonthDays(monthDays);
    }

    clickOutsideHandler(event) {
        if (this.wrapper.contains(event.target)) {
            return;
        }
        this.setState({ isOpen: false });
    }

    onOpenCalendar() {
        this.dropdown.classList.add('active');
        this.monthsSelectElement.addEventListener('change', this.selectMonthHandler);
        this.yearsSelectElement.addEventListener('change', this.selectYearHandler);
    }

    onCloseCalendar() {
        this.unsubscribe();
        this.dropdown.classList.remove('active');
    }

    unsubscribe() {
        this.monthsSelectElement.removeEventListener('select', this.selectMonthHandler);
        this.yearsSelectElement.removeEventListener('select', this.selectYearHandler);
        window.removeEventListener('select', this.clickOutsideHandler);
    }
}
