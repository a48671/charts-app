import { AbstractComponent } from "src/components/abstract-component";
import { createElement } from "src/utils";

export class Arrow extends AbstractComponent {
    /**
     *
     * @param type - 'left' | 'right
     */
    constructor(type) {
        super();
        this.wrapper = createElement('div', `calendar__arrow ${type}`)
    }
}
