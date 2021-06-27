import {AbstractComponent} from "./abstract-component";
import {createElement} from "src/utils";

export class Title extends AbstractComponent {
    constructor() {
        super();
        this.wrapper = createElement('h1', 'app__title');
        this.wrapper.innerText = 'Архив метеослужб';
    }
}
