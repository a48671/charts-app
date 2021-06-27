import { AbstractComponent } from "./abstract-component";
import { PeriodSelect } from "./period-select";
import { Zoom } from "./zoom";
import { createElement } from "../utils";

const periodSelect = new PeriodSelect().getElement();
const zoom = new Zoom().getElement();

export class Control extends AbstractComponent {
    constructor() {
        super();
        this.wrapper = createElement('div', 'control', [periodSelect, zoom])
    }
}
