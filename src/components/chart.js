import { isOver, boundaries, circle, css } from 'src/utils';
import { CIRCLE_RADIUS, X_STEP_SIZE, PADDING, ROWS_COUNT, DPI_MULTIPLIER } from 'src/const';
import { tooltip } from 'src/components/tooltip';

export function chart(chartElement, data) {
    const { width: WIDTH } = chartElement.getBoundingClientRect();
    const HEIGHT = WIDTH * 0.6;
    const DPI_WIDTH = WIDTH * DPI_MULTIPLIER;
    const DPI_HEIGHT = HEIGHT * DPI_MULTIPLIER;
    const VIEW_HEIGHT = DPI_HEIGHT - PADDING * 2;
    const VIEW_WIDTH = DPI_WIDTH;

    const canvas = chartElement.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    let raf;
    css(canvas, { width: WIDTH + 'px', height: HEIGHT + 'px' });
    canvas.width = DPI_WIDTH;
    canvas.height = DPI_HEIGHT;

    const tooltipComponent = tooltip(chartElement.querySelector('#tooltip'));

    const proxy = new Proxy({}, {
        set(...args) {
            const result = Reflect.set(...args);
            raf = requestAnimationFrame(paint);
            return result;
        }
    });

    canvas.addEventListener('mousemove', mousemove);
    canvas.addEventListener('mouseleave', mouseleave);

    function mouseleave() {
        proxy.mouse = {};
        tooltipComponent.hide();
    }

    function mousemove({ clientX }) {
        const { left } = canvas.getBoundingClientRect();
        // так как плотность координат внутри canvas отличаются от размера элемента умножаем clientX на DPI_MULTIPLIER
        const x = (clientX - left) * DPI_MULTIPLIER
        proxy.mouse = { x };
    }
    function clear() {
        ctx.clearRect(0, 0, DPI_WIDTH, DPI_HEIGHT);
    }
    const [yMin, yMax] = boundaries(data);
    const yRatio = VIEW_HEIGHT / (yMax - yMin);
    const xRatio = VIEW_WIDTH / (data.length - 2);
    function paint() {
        clear();
        // axis
        yAxis();
        xAxis();
        // chart
        line();

        circles();
    }

    function xAxis() {
        ctx.beginPath();
        ctx.strokeStyle ='#bbb';
        ctx.lineWidth = 2;
        ctx.font = 'normal 20px Helvetica, sans-serif';
        ctx.fillStyle = '#96a2aa';
        // буду показывать деления через каждые X_STEP_SIZE пикселей
        for (let i = 0; i < data.length; i++) {

            const x = Math.round(i * xRatio);
            const dateText = data[i].t;

            if (i % X_STEP_SIZE === 0) {
                ctx.fillText(dateText, x, DPI_HEIGHT - 10);
                ctx.moveTo(x, PADDING + VIEW_HEIGHT);
                ctx.lineTo(x, PADDING + VIEW_HEIGHT + 10);
            }

            // отрисовка вертикальной линии, если мышка находится на отрисовываемом значении
            if (isOver(proxy.mouse, x, data.length, VIEW_WIDTH)) {
                ctx.moveTo(x, PADDING);
                ctx.lineTo(x, PADDING + VIEW_HEIGHT);
                tooltipComponent.show({ date: dateText, value: data[i].v });
            }
        }
        ctx.stroke();
        ctx.closePath();
    }

    function yAxis() {
        const step = VIEW_HEIGHT / ROWS_COUNT;
        const textStep = (yMax - yMin) / ROWS_COUNT;
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle ='#bbb';
        ctx.font = 'normal 20px Helvetica, sans-serif';
        ctx.fillStyle = '#96a2aa';
        for (let i = 0; i <= ROWS_COUNT; i++) {
            const yText = (textStep * i).toString();
            const y = DPI_HEIGHT - step * i - PADDING;
            ctx.fillText(yText, 5, y - 5);
            ctx.moveTo(0, y);
            ctx.lineTo(DPI_WIDTH, y);
        }
        ctx.stroke();
        ctx.closePath();
    }

    function line() {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'green';
        ctx.fillStyle = 'green';
        let i = 0
        ctx.lineTo(0, DPI_HEIGHT - PADDING  - yMin);
        for (const { v } of data) {
            const x = Math.round(i * xRatio);
            const y = DPI_HEIGHT - PADDING - v * yRatio
            ctx.lineTo(x, y);
            i++;
        }
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
    }

    function circles() {
        let i = 0
        for (const { v } of data) {
            const x = Math.round(i * xRatio);
            const y = DPI_HEIGHT - PADDING - v * yRatio;
            if (isOver(proxy.mouse, x, data.length, VIEW_WIDTH)) {
                circle(ctx, x, y, CIRCLE_RADIUS);
            }
            i++;
        }
    }

    return({
        init() {
            paint();
        },
        destroy() {
            cancelAnimationFrame(raf);
            canvas.removeListener('mousemove', mousemove);
            canvas.removeListener('mouseleave', mouseleave);
        }
    });
}



