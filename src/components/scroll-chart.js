import { createElement } from 'src/utils';
import { Chart } from "../chart";
import { DPI_MULTIPLIER } from "../const";

export class ScrollChart {

    constructor() {
        this.canvas = createElement('canvas', 'chart__canvas-scroll');
        this.leftOverlay = createElement('div', 'chart__scroll-overlay chart__scroll-overlay_left');
        this.rightOverlay = createElement('div', 'chart__scroll-overlay chart__scroll-overlay_right');
        const children = [this.canvas, this.leftOverlay, this.rightOverlay];
        this.wrapper = createElement('div', 'chart__scroll', children);
    }

    getElement() {
        return this.wrapper;
    }

    createChart(data) {
        const { width } = this.wrapper.getBoundingClientRect();
        this.chart = new Chart(this.canvas, {
            width,
            height: 100,
            dpiMultiplier: DPI_MULTIPLIER
        });
        this.chart.setData(data);
        this.chart.paint();
        this.moveWindowHandler();
        return this.chart;
    }

    setColumnCountInWindow(columnCountInWindow) {
        this.columnCountInWindow = columnCountInWindow;
        this.setWindowWidth();

    }

    setWindowWidth() {
        const { width } = this.wrapper.getBoundingClientRect();
        this.windowWidth = width * (this.columnCountInWindow / this.chart.getColumnCount());
        this.setLeftOverlayWidth(0);
        this.setRightOverlayWidth(width - this.windowWidth);
    }

    setLeftOverlayWidth(width) {
        this.leftOverlay.style = `width: ${width}px`;
    }

    setRightOverlayWidth(width) {
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
                let newWidthForLeftOverlay = rangeBetweenCanvasLeftAndCatchPoint - rangeBetweenLeftOverlayRightAndCatchPoint;
                if (newWidthForLeftOverlay < 0) {
                    newWidthForLeftOverlay = 0;
                }
                if (newWidthForLeftOverlay > canvasWidth - self.windowWidth) {
                    newWidthForLeftOverlay = canvasWidth - self.windowWidth;
                }
                self.setLeftOverlayWidth(newWidthForLeftOverlay);
                const rangeBetweenCanvasRightAndCatchPoint = canvasRight - clientX;
                let newWidthForRightOverlay = rangeBetweenCanvasRightAndCatchPoint - rangeBetweenRightOverlayLeftAndCatchPoint;
                if (newWidthForRightOverlay < 0) {
                    newWidthForRightOverlay = 0;
                }
                if (newWidthForRightOverlay > canvasWidth - self.windowWidth) {
                    newWidthForRightOverlay = canvasWidth - self.windowWidth;
                }
                self.setRightOverlayWidth(newWidthForRightOverlay);
            }
        }) // не забыть отписаться
    }
}
