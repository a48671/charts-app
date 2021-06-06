import { DPI_MULTIPLIER } from 'src/const';
import { Chart } from 'src/chart';
import { tooltip } from 'src/components/tooltip';

export function chart(chartElement, data) {
    const { width } = chartElement.getBoundingClientRect();
    const tooltipComponent = tooltip(chartElement.querySelector('#tooltip'));
    const canvas = chartElement.querySelector('canvas');
    const newChart = new Chart(canvas, {
        width,
        ratioWidthToHeight: 0.618,
        thereIsYAxis: true,
        thereIsXAxis: true,
        dpiMultiplier: DPI_MULTIPLIER,
        onChangeFocus: tooltipComponent.show
    });
    newChart.setData(data);
    newChart.paint();

    let raf;
    const proxy = new Proxy({}, {
        set(...args) {
            const result = Reflect.set(...args);
            raf = requestAnimationFrame(paint);
            return result;
        }
    });

    function paint() {
        const mouseX = proxy.mouse ? proxy.mouse.x : undefined;
        newChart.paint(mouseX);
    }

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



