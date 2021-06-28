import { createElement } from 'src/utils';
import { ChartService } from "src/services/chart.service";
import { DPI_MULTIPLIER } from "../const";
import { AbstractComponent } from "./abstract-component";
import { store } from "src/store";

class ScrollChart extends AbstractComponent {
    constructor() {
        super();
        this.columnCountInWindow = store.state.columnCountInWindow;
        this.rightOverlayWidth = 0;
        this.canvas = createElement('canvas', 'chart__canvas-scroll');
        this.leftOverlay = createElement('div', 'chart__scroll-overlay chart__scroll-overlay_left');
        this.rightOverlay = createElement('div', 'chart__scroll-overlay chart__scroll-overlay_right');
        const children = [this.canvas, this.leftOverlay, this.rightOverlay];
        this.wrapper = createElement('div', 'chart__scroll', children);

        this.moveWindowHandler();
    }

    setColumnCountInWindow(columnCountInWindow) {
        this.columnCountInWindow = columnCountInWindow;
        this.setWindowWidth();
    }

    setWindowWidth() {
        const { width } = this.wrapper.getBoundingClientRect();
        const columnCount = this.chart.getColumnCount();
        if (columnCount === 0) {
            this.windowWidth = width;
            return;
        }
        this.windowWidth = width * (this.columnCountInWindow / columnCount);
        this.setLeftOverlayWidth(width - this.rightOverlayWidth - this.windowWidth);
        this.setRightOverlayWidth(this.rightOverlayWidth);
        this.computeRangeData();
    }

    setLeftOverlayWidth(width) {
        this.leftOverlayWidth = width;
        this.leftOverlay.style = `width: ${width}px`;
    }

    setRightOverlayWidth(width) {
        this.rightOverlayWidth = width;
        this.rightOverlay.style = `width: ${width}px`;
    }

    moveWindowHandler() {
        const self = this;
        self.canvas.addEventListener('mousedown', function({ clientX }) {
            const { x: canvasLeft, width: canvasWidth } = self.canvas.getBoundingClientRect();
            const canvasRight = canvasLeft + canvasWidth;
            const { width: leftOverlayWidth } = self.leftOverlay.getBoundingClientRect();
            const rangeBetweenLeftOverlayRightAndCatchPoint = clientX - (canvasLeft + leftOverlayWidth);
            const { width: rightOverlayWidth } = self.rightOverlay.getBoundingClientRect();
            const rangeBetweenRightOverlayLeftAndCatchPoint = canvasRight -rightOverlayWidth - clientX;
            self.canvas.addEventListener('mousemove', moveHandler);
            window.addEventListener('mouseup', function mouseUpHandler() {
                self.canvas.removeEventListener('mousemove', moveHandler);
                window.removeEventListener('mouseup', mouseUpHandler);
            })

            function moveHandler({ clientX }) {
                const rangeBetweenCanvasLeftAndCatchPoint = clientX - canvasLeft;
                let newWidthForLeftOverlay =
                    rangeBetweenCanvasLeftAndCatchPoint - rangeBetweenLeftOverlayRightAndCatchPoint;
                if (newWidthForLeftOverlay < 0) {
                    newWidthForLeftOverlay = 0;
                }
                if (newWidthForLeftOverlay > canvasWidth - self.windowWidth) {
                    newWidthForLeftOverlay = canvasWidth - self.windowWidth;
                }
                self.setLeftOverlayWidth(newWidthForLeftOverlay);
                const rangeBetweenCanvasRightAndCatchPoint = canvasRight - clientX;
                let newWidthForRightOverlay =
                    rangeBetweenCanvasRightAndCatchPoint - rangeBetweenRightOverlayLeftAndCatchPoint;
                if (newWidthForRightOverlay < 0) {
                    newWidthForRightOverlay = 0;
                }
                if (newWidthForRightOverlay > canvasWidth - self.windowWidth) {
                    newWidthForRightOverlay = canvasWidth - self.windowWidth;
                }
                self.setRightOverlayWidth(newWidthForRightOverlay);
                self.computeRangeData();
            }
        }) // не забыть отписаться
    }
    computeRangeData() {
        const { width: canvasWidth } = this.canvas.getBoundingClientRect();
        const startIndex = Math.floor(this.chart.getColumnCount() * this.leftOverlayWidth / canvasWidth);
        const endIndex = Math.ceil(startIndex + this.columnCountInWindow);
        const viewData = this.chart.viewData.slice(startIndex, endIndex);
        store.setState({ focusDate: viewData });
    }

    setData(data) {
        this.data = data
        this.chart.setData(this.data);
        this.chart.paint();
        this.setRightOverlayWidth(0);
        this.setWindowWidth();
        this.computeRangeData();
    }

    init() {
        const { width } = this.wrapper.getBoundingClientRect();
        this.chart = new ChartService(this.canvas, {
            width,
            height: 100,
            dpiMultiplier: DPI_MULTIPLIER
        });
        this.setColumnCountInWindow(store.state.columnCountInWindow);
        this.setData(store.state.data);

        store.addSubscribe((state) => {
            if (state.data !== this.chart.data) {
                this.setData(state.data);
            }
            if (this.columnCountInWindow !== state.columnCountInWindow) {
                this.setColumnCountInWindow(state.columnCountInWindow);
            }
        });
    }
}

export const scrollChart = new ScrollChart();
