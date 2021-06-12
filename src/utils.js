export function boundaries(data) {
    let min;
    let max;

    for (const { v } of data) {
        if (typeof min !== 'number') min = v;
        if (typeof max !== 'number') max = v;

        if (min > v) min = v;
        if (max < v) max = v;
    }

    if (typeof min !== 'number') min = 0;
    if (typeof max !== 'number') max = 0;

    return  [min, max];
}

export function css(element, styles = {}) {
    Object.assign(element.style, styles);
}

/**
 *
 * @param tagName: string
 * @param className: string
 * @param children: Array<DOMElement>
 * @returns DOMElement
 */
export function createElement(tagName, className, children) {
    const element = document.createElement(tagName);
    element.className = className;
    if (Array.isArray(children)) {
        for (const child of children) {
            element.appendChild(child);
        }
    }
    return element;
}
