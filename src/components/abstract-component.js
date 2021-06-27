export class AbstractComponent {
    constructor() {
        if (new.target === AbstractComponent) {
            throw new Error('This abstract class');
        }
        this.wrapper = null;
    }
    getElement() {
        return this.wrapper;
    }
}
