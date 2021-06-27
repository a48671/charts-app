import { AbstractComponent } from "./abstract-component";
import { Control } from "./control";
import { Sidebar } from "./sidebar";
import { chart } from "./chart";
import { createElement } from "../utils";

const sidebar = new Sidebar().getElement();
const control = new Control().getElement();

export class Container extends AbstractComponent {
    constructor() {
        super();
        const sidebarBlock = createElement('div', 'app__side-bar', [sidebar]);
        const content = createElement('div', 'app__content', [control, chart.getElement()]);
        this.wrapper = createElement('div', 'app_container', [sidebarBlock, content]);
    }
}
