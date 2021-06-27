import { AbstractComponent } from "./abstract-component";
import { createElement } from "../utils";
import { CheckData } from "./check-data";

const checkData = new CheckData().getElement();

export class Sidebar extends AbstractComponent {
    constructor() {
        super();
        this.wrapper = createElement('div', 'side__bar', [checkData])
    }
}
