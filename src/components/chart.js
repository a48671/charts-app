import { DPI_MULTIPLIER } from 'src/const';
import { Chart } from 'src/chart';
import { tooltip } from 'src/components/tooltip';
import { ScrollChart } from 'src/components/scroll-chart';

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
        onChangeFocus: tooltipComponent.show,
        colWidth: 30
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

    const scrollChartComponent = new ScrollChart();

    chartElement.appendChild(scrollChartComponent.getElement());
    const scrollChart = scrollChartComponent.createChart(data);
    scrollChartComponent.setColumnCountInWindow(mainChart.getColumnCount());
    scrollChartComponent.addSubscribeForChangeRangeData(function(data) {
        mainChart.setData(data);
        mainChart.paint();
    });

    window.addEventListener('resize', function () {
        mainChart.setWidth(chartElement.getBoundingClientRect().width);
        scrollChart.setWidth(chartElement.getBoundingClientRect().width, 100);
        scrollChartComponent.setColumnCountInWindow(mainChart.getColumnCount());
    });

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



