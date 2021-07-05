import { GetDataService } from 'src/services/get-data.service'

class Store {
    constructor() {
        this.state = {
            data: [],
            focusDate: [],
            selectedData: 'temperature',
            colWidth: 25,
            columnCountInWindow: 0,
            start: '2005-12-31',
            end: '2006-06-20'
        }

        this.subscribtions = [];

        this.getDataService = new GetDataService(() => {
            this.getData();
        });
    }
    addSubscribe(callback) {
        this.subscribtions.push(callback);
    }
    setState(newState) {
        const prevSate = { ...this.state }
        this.state = {
            ...this.state,
            ...newState
        }
        this.subscribtions.forEach((callback) => callback(this.state));
        this.update(prevSate);
    }
    update(prevSate) {
        const { start, end, selectedData } = this.state;
        if (prevSate.start !== start || prevSate.end !== end || prevSate.selectedData !== selectedData) {
            this.getData(start, end);
        }
    }
    getData() {
        const { start, end, selectedData } = this.state;
        this.getDataService.getData(selectedData, start, end)
            .then((data) => this.setState({ data }));
    }
}

export const store = new Store();
