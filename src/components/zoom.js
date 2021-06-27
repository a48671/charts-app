import { AbstractComponent } from "./abstract-component";
import { createElement } from "../utils";
import { store } from "src/store";

export class Zoom extends AbstractComponent {
    constructor() {
        super();
        this.up = createElement('div', 'zoom__item');
        this.up.innerText = '+';
        this.down = createElement('div', 'zoom__item');
        this.down.innerText = '-';
        this.wrapper = createElement('div', 'zoom', [this.up, this.down]);

        this.wrapper.addEventListener('click', (event) => {
            switch (event.target) {
                case this.up : {
                    const colWidth = store.state.colWidth < 40 ? store.state.colWidth + 4 : 40;
                    store.setState({colWidth});
                    return;
                }
                case this.down : {
                    const colWidth = store.state.colWidth > 10 ? store.state.colWidth - 4 : 10;
                    store.setState({colWidth});
                    return;
                }
            }
        });
    }
}
