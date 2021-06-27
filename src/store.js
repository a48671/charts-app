import temperature from 'src/mocks/temperature.json';
import precipitation from 'src/mocks/precipitation.json';
import {getDataByDateRange} from "./utils";

class Store {
    constructor() {
        this.state = {
            data: [],
            focusDate: [],
            selectedData: 'temperature',
            colWidth: 25,
            columnCountInWindow: 0,
            start: '2005-12-31',
            end: '2006-12-31',
            temperature,
            precipitation
        }
        this.state.data = getDataByDateRange(this.state[this.state.selectedData], this.state.start, this.state.end);
        this.subscribtions = [];
    }
    addSubscribe(callback) {
        this.subscribtions.push(callback);
    }
    setState(newState) {
        this.state = {
            ...this.state,
            ...newState
        }
        this.subscribtions.forEach(callback => callback(this.state));
        console.log(this.state);
    }
}

export const store = new Store();
