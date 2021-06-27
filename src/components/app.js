import { AbstractComponent } from "./abstract-component";
import { Title } from "./title";
import { Container } from "./container";
import { createElement } from "../utils";

const title = new Title().getElement();
const container = new Container().getElement();

export class App  extends AbstractComponent {
    constructor() {
        super();
        const app = createElement('div', 'app', [title, container]);
        this.wrapper = createElement('div', 'wrapper', [app]);
    }

}
