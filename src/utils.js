export function boundaries(data) {
    let min;
    let max;

    for (const { v } of data) {
        if (typeof min !== 'number') min = v;
        if (typeof max !== 'number') max = v;

        if (min > v) min = v;
        if (max < v) max = v;
    }

    return  [min, max];
}

export function css(element, styles = {}) {
    Object.assign(element.style, styles);
}
