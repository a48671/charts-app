import { DPI_MULTIPLIER } from 'src/const';
import { Chart } from 'src/chart';
import { tooltip } from 'src/components/tooltip';

export function chart(chartElement, data) {
    const { width } = chartElement.getBoundingClientRect();
    const tooltipComponent = tooltip(chartElement.querySelector('#tooltip'));
    const mainCanvas = chartElement.querySelector('canvas[data-el="main-chart"]');
    const mainChart = new Chart(mainCanvas, {
        width,
        ratioWidthToHeight: 0.618,
        thereIsYAxis: true,
        thereIsXAxis: true,
        dpiMultiplier: DPI_MULTIPLIER,
        onChangeFocus: tooltipComponent.show
    });
    mainChart.setData(data);
    mainChart.paint();

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
        mainChart.paint(mouseX);
    }

    mainCanvas.addEventListener('mousemove', mousemove);
    mainCanvas.addEventListener('mouseleave', mouseleave);

    function mouseleave() {
        proxy.mouse = {};
        tooltipComponent.hide();
    }

    function mousemove({ clientX }) {
        const { left } = mainCanvas.getBoundingClientRect();
        // так как плотность координат внутри canvas отличаются от размера элемента умножаем clientX на DPI_MULTIPLIER
        const x = (clientX - left) * DPI_MULTIPLIER
        proxy.mouse = { x };
    }

    const scrollCanvas = chartElement.querySelector('canvas[data-el="scroll-chart"]');
    const scrollChart = new Chart(scrollCanvas, {
        width,
        height: 100,
        dpiMultiplier: DPI_MULTIPLIER
    });
    scrollChart.setData(data);
    scrollChart.paint();

    return({
        init() {
            paint();
        },
        destroy() {
            cancelAnimationFrame(raf);
            mainCanvas.removeListener('mousemove', mousemove);
            mainCanvas.removeListener('mouseleave', mouseleave);
        }
    });
}



