import { css } from 'src/utils';

export function tooltip(element) {
    if (!element) return;
    const clear = () => element.innerHTML = '';
    return ({
        show(data) {
            clear();
            element.innerHTML = `${data.date}: ${data.value}`;
            css(element, { display: 'block' })
        },
        hide() {
            css(element, { display: 'none' });
        }
    });
}
