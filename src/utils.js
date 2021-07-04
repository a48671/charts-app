import { DAYS_IN_WEEK, DAYS_IN_MONTH, WEEK_DAYS_INDEX_FROM_MONDAY } from 'src/const';
import { EnumMonth } from 'src/enums';

export function boundaries(data) {
    let min;
    let max;

    for (const { v } of data) {
        if (typeof min !== 'number') min = v;
        if (typeof max !== 'number') max = v;

        if (min > v) min = v;
        if (max < v) max = v;
    }

    if (typeof min !== 'number') min = 0;
    if (typeof max !== 'number') max = 0;

    return [min, max];
}

export function css(element, styles = {}) {
    Object.assign(element.style, styles);
}

/**
 *
 * @params:
 *  tagName - string
 *  className - string
 *  children - Array<DOMElement>
 * @return DOMElement
 */
export function createElement(tagName, className, children) {
    const element = document.createElement(tagName);
    if (className) {
        element.className = className;
    }
    if (Array.isArray(children)) {
        for (const child of children) {
            child && element.appendChild(child);
        }
    }
    return element;
}

export function getDataByDateRange(data, start, end) {
    return data.filter((item) => (item.t >= start && item.t <= end));
}

/**
 *
 * @param start: number
 * @param end: number
 * @return: Array<number>
 */
export function generatingYears(start, end) {
    const years = [];
    for (let i = start; i <= end; i++) {
        years.push(i);
    }
    return years;
}

/**
 *
 * @param dateA: Date
 * @param dateB: Date
 * @return boolean
 */
export function equalDates(dateA, dateB) {
    if (dateA instanceof Date && dateB instanceof Date) {
        return (
            dateA.getDate() === dateB.getDate() &&
            dateA.getMonth() === dateB.getMonth() &&
            dateA.getFullYear() === dateB.getFullYear()
        );
    }
    return false;
}

/**
 *
 * @param year: number
 * @param monthIndex: number
 * @return Array<Array<date | undefined>>
 */
export function generateDaysForMonth(year, monthIndex) {
    const days = [];

    const daysInMonth = getDaysInMonth(year, monthIndex);
    const startSince = getDayOfWeek(year, monthIndex);
    const numberOfWeeks = (startSince + daysInMonth) / DAYS_IN_WEEK;
    let dayNumber = 1;

    for (let weekIndex = 0; weekIndex <= numberOfWeeks; weekIndex++) {
        const week = [];
        for (let dayIndex = 0; dayIndex < DAYS_IN_WEEK; dayIndex++) {
            if (weekIndex === 0 && dayIndex < startSince || dayNumber > daysInMonth) {
                week.push(undefined);
            } else {
                week.push(new Date(year, monthIndex, dayNumber++))
            }
        }
        days.push(week);
    }

    return days;
}

/**
 *
 * @param year: number
 * @param monthIndex: number
 * @return number
 */
function getDaysInMonth(year, monthIndex) {
    const daysInMonth = DAYS_IN_MONTH[monthIndex];

    if (isLeapYear(year) && monthIndex === EnumMonth.February) {
        return daysInMonth + 1;
    }

    return daysInMonth;
}

function isLeapYear(year) {
    return !((year % 4) || (!(year % 100) && (year % 400)));
}

/**
 *
 * @param year: number
 * @param monthIndex: number
 * @return number
 */
export function getDayOfWeek(year, monthIndex) {
    const dayOfWeek = new Date(year, monthIndex).getDay();

    return WEEK_DAYS_INDEX_FROM_MONDAY[dayOfWeek];
}

/**
 *
 * @param date: Date
 * @return string
 */
export function getStringDateFromDate(date) {
    const month = getTwoLengthStringNumber(date.getMonth() + 1);
    const day = getTwoLengthStringNumber(date.getDate())
    return `${date.getFullYear()}-${month}-${day}`;
}

/**
 *
 * @param number
 * @return string
 */
export function getTwoLengthStringNumber(number) {
    const stringNumber = String(number);
    return stringNumber.length === 1 ? `0${stringNumber}` : stringNumber;
}
