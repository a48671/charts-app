export function isOver(mouse, x, length, viewWidth) {
    if (!mouse ||!mouse.x) {
        return false;
    }
    return Math.abs(mouse.x - x) < (viewWidth / length) / 2;
}

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

export function circle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'green';
    ctx.fillStyle = '#fff';
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}

export function css(element, styles = {}) {
    Object.assign(element.style, styles);
}
