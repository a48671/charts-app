import { AbstractComponent } from "./abstract-component";
import { store } from "src/store";
import { createElement, getDataByDateRange } from "../utils";

export class CheckData extends AbstractComponent {
    constructor() {
        super();
        this.selectedData = '';
        this.checkTemperature = createElement('div', 'check-data__item');
        this.checkTemperature.innerText = 'Температура';
        this.checkPrecipitation = createElement('div', 'check-data__item');
        this.checkPrecipitation.innerText = 'Влажность';
        const children = [this.checkTemperature, this.checkPrecipitation];
        this.wrapper = createElement('div', 'check-data', children);
        this.wrapper.addEventListener('click', (event) => {
            const { start, end, temperature, precipitation } = store.state;
            switch (event.target) {
                case this.checkTemperature: {
                    const data = getDataByDateRange(temperature, start, end);
                    store.setState({data, selectedData: 'temperature'});
                    return;
                }
                case this.checkPrecipitation: {
                    const data = getDataByDateRange(precipitation, start, end);
                    store.setState({data, selectedData: 'precipitation'});
                    return;
                }
            }
        });
        store.addSubscribe((state) => {
            if (this.selectedData === state.selectedData) return;
            switch (state.selectedData) {
                case 'temperature':
                    this.checkTemperature.classList.add('active');
                    this.checkPrecipitation.classList.remove('active');
                    return;
                case 'precipitation':
                    this.checkTemperature.classList.remove('active');
                    this.checkPrecipitation.classList.add('active');
                    return;
                default:
                    this.checkTemperature.classList.remove('active');
                    this.checkPrecipitation.classList.remove('active');
            }
        })
    }
}
