import { DPI_MULTIPLIER } from 'src/const';
import { ChartService } from 'src/services/chart.service';
import { tooltip } from 'src/components/tooltip';
import { scrollChart } from 'src/components/scroll-chart';
import { createElement } from 'src/utils';
import { AbstractComponent } from 'src/components/abstract-component';
import { store } from "src/store";

const scrollChartElement = scrollChart.getElement();

class Chart extends AbstractComponent {
    constructor({ data }) {
        super();
        this.canvas = createElement('canvas', undefined);
        this.tooltip = createElement('div', 'chart__tooltip');
        const children = [this.canvas, this.tooltip, scrollChartElement];
        this.wrapper = createElement('div', 'chart', children);
        this.tooltipComponent = tooltip(this.tooltip);

        const self = this;

        this.proxy = new Proxy({}, {
            set(...args) {
                const result = Reflect.set(...args);
                self.raf = requestAnimationFrame(self.paint.bind(self));
                return result;
            }
        });

        this.canvas.addEventListener('mousemove', mousemove);
        this.canvas.addEventListener('mouseleave', mouseleave);

        function mouseleave() {
            self.proxy.mouse = {};
            self.tooltipComponent.hide();
        }

        function mousemove({ clientX }) {
            const { left } = self.canvas.getBoundingClientRect();
            // так как плотность координат внутри canvas отличаются
            // от размера элемента умножаем clientX на DPI_MULTIPLIER
            const x = (clientX - left) * DPI_MULTIPLIER
            self.proxy.mouse = { x };
        }

        window.addEventListener('resize', function() {
            self.updateSizes();
        });

        store.addSubscribe((state) => {
            if (state.focusDate !== this.chart.data) {
                this.setData(state.focusDate);
            }
            if (this.chart.colWidth !== state.colWidth) {
                this.chart.setColWidth(state.colWidth);
                store.setState({ columnCountInWindow: this.chart.getColumnCount() })
            }
        });

        this.onDestroyHandler = function() {
            cancelAnimationFrame(this.raf);
            this.canvas.removeListener('mousemove', mousemove);
            this.canvas.removeListener('mouseleave', mouseleave);
        }
    }

    setData(data) {
        this.chart.setData(data);
        this.chart.paint();
    }

    updateSizes() {
        this.chart.setWidth(this.wrapper.getBoundingClientRect().width);
        store.setState({ columnCountInWindow: this.chart.getColumnCount() });
    }

    paint() {
        const mouseX = this.proxy.mouse ? this.proxy.mouse.x : undefined;
        this.chart.paint(mouseX);
    }

    destroy() {
        this.onDestroyHandler();
    }

    init() {
        const { width } = this.wrapper.getBoundingClientRect();
        this.chart = new ChartService(this.canvas, {
            width,
            ratioWidthToHeight: 0.618,
            thereIsYAxis: true,
            thereIsXAxis: true,
            dpiMultiplier: DPI_MULTIPLIER,
            onChangeFocus: this.tooltipComponent.show,
            colWidth: store.state.colWidth,
            data: store.state.focusDate
        });
        store.setState({ columnCountInWindow: this.chart.getColumnCount() });
        this.paint();
    }
}

export const chart = new Chart({ data: [] });

