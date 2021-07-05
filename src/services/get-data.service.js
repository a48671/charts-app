import { IndexDbService } from './index-db.service';
import { GetDataTransport } from 'src/api/get-data.transport';

export class GetDataService {
    constructor(initCallback) {
        this.lastStart = '';
        this.lastEnd = '';
        this.lastType = '';
        this.indexDbService = new IndexDbService(initCallback);
    }

    getData(type, start, end) {
        return this.indexDbService.getData(type, start, end)
            .then((data) => {
                if (!data.length) {
                    return this.getDataFromServer(type, start, end)
                        .then(() => this.getData(type, start, end));
                }
                if (data[0].t === start && data[data.length - 1].t === end) {
                    return data;
                }
                if (data[0].t > start && (this.lastType !== type || this.lastStart !== start)) {
                    return this.getDataFromServer(type, start, data[0].t, 'end')
                        .then(() => this.getData(type, start, end));
                }
                if (data[data.length - 1].t < end && (this.lastType !== type || this.lastEnd !== end)) {
                    return this.getDataFromServer(type, data[data.length - 1].t, end, 'start')
                        .then(() => this.getData(type, start, end));
                }
                return data;
            })
            .catch(console.error);
    }

    getDataFromServer(type, start, end, slice) {
        this.lastStart = start;
        this.lastEnd = end;
        this.lastType = type;
        return GetDataTransport.getData(type, start, end)
            .then((data) => {
                if (slice === 'end') {
                    data.splice(-1, 1);
                }
                if (slice === 'start') {
                    data.splice(0, 1);
                }
                this.indexDbService.addData(type, data)
                    .then()
                    .catch(console.error);
            })
            .catch(console.error);
    }
}
