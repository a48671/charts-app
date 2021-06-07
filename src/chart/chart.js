import { boundaries, css } from "src/utils";
import { CIRCLE_RADIUS, ROWS_COUNT, X_COL_COUNT } from "../const";
export const HORIZONTAL_PADDING = 40;
export const VERTICAL_PADDING = 20;

export class Chart {

    /**
     * @param canvas: HTMLCanvasElement;
     * @param: {
     *     width: number - width wrapper which containing canvas;
     *     ratioWidthToHeight?: number - ratio width to height;
     *     height?: number - height for canvas
     *     thereIsXAxis?: boolean - show x axis;
     *     thereIsYAxis?: boolean - show y axis;
     *     dpiMultiplier?: number - multiplier for width and height canvas,
     *     onChangeFocus?: (data) => void - callback function which will calling before change focus along X-axis,
     *     color?: string - chart color;
     * };
     */
    constructor(canvas, props) {
        const { width, thereIsXAxis, thereIsYAxis, ratioWidthToHeight, dpiMultiplier, onChangeFocus, color, height } = props;
        this.canvas = canvas;
        this.ratioWidthToHeight = ratioWidthToHeight || 0.618;
        this.thereIsXAxis = thereIsXAxis;
        this.thereIsYAxis = thereIsYAxis;
        this.dpiMultiplier = dpiMultiplier || 2;
        this.ctx = this.canvas.getContext('2d');
        this.setWidth(width, height);
        this.data = []; // data for calculate chart
        this.yMin = 0; // min value in axis Y
        this.yMax = 0; // max value in axis Y
        this.yRatio = 0; // ratio viewHeight to yMax - yMin
        this.xRatio = 0; // ratio viewWidth to data length
        this.onChangeFocus = onChangeFocus;
        this.color = color || 'grey';
    }

    setWidth(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height ? height : width * this.ratioWidthToHeight;
        this.dpiWidth = this.canvasWidth * this.dpiMultiplier;
        this.dpiHeight = this.canvasHeight * this.dpiMultiplier;
        this.verticalPadding = this.thereIsXAxis ? VERTICAL_PADDING * this.dpiMultiplier : 0;
        this.horizontalPadding = this.thereIsYAxis ? HORIZONTAL_PADDING * this.dpiMultiplier : 0;
        this.viewHeight = this.dpiHeight - this.verticalPadding * 2;
        this.viewWidth = this.dpiWidth - this.horizontalPadding;

        css(this.canvas, { width: this.canvasWidth + 'px', height: this.canvasHeight + 'px' });
        this.canvas.width = this.dpiWidth;
        this.canvas.height = this.dpiHeight;
    }

    /**
     * @param mouseX: number - cursor position on the X-axis;
     */
    paint(mouseX) {
        this.clear();
        this.thereIsYAxis && this.paintYAxis();
        this.paintLine();
        this.thereIsXAxis && this.paintXAxis(mouseX)
        mouseX && this.paintCircles(mouseX)
    }

    /**
     * @param data: Array<{ t: string; v: number; }>
     */
    setData(data) {
        this.data = data;
        const [yMin, yMax] = boundaries(this.data);
        this.yMin = yMin;
        this.yMax = yMax;
        this.yRatio = this.viewHeight / (this.yMax - this.yMin);
        this.xRatio = this.viewWidth / (this.data.length - 1);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.dpiWidth, this.dpiHeight);
    }

    paintLine() {
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;
        this.ctx.lineTo(0, this.dpiHeight - this.verticalPadding  - this.yMin);
        let i = 0

        for (const { v } of this.data) {
            const x = Math.round(i * this.xRatio);
            const y = this.dpiHeight - this.verticalPadding - v * this.yRatio
            this.ctx.lineTo(x, y);
            i++;
        }
        this.ctx.lineTo(this.viewWidth, this.verticalPadding + this.viewHeight);
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.closePath();
    }

    paintYAxis() {
        const step = this.viewHeight / ROWS_COUNT;
        const sizeStep = (this.yMax - this.yMin) / ROWS_COUNT;

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle ='#bbb';
        this.ctx.font = 'normal 20px Helvetica, sans-serif';
        this.ctx.fillStyle = '#96a2aa';

        for (let i = 0; i <= ROWS_COUNT; i++) {
            const y = this.dpiHeight - step * i - this.verticalPadding;
            const textStep = (sizeStep * i).toFixed(2).toString();
            this.ctx.fillText(textStep, this.viewWidth + 10, y + 5);
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.viewWidth, y);
        }
        this.ctx.moveTo(this.viewWidth, this.verticalPadding);
        this.ctx.lineTo(this.viewWidth, this.viewWidth);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    /**
     * @param mouseX: number - cursor position on the X-axis;
     */
    paintXAxis(mouseX) {
        this.ctx.beginPath();
        this.ctx.strokeStyle ='#bbb';
        this.ctx.lineWidth = 2;
        this.ctx.font = 'normal 20px Helvetica, sans-serif';
        this.ctx.fillStyle = '#96a2aa';
        const xStepSize = Math.round(this.data.length / X_COL_COUNT);
        for (let i = 0; i < this.data.length; i++) {

            const x = Math.round(i * this.xRatio);
            const dateText = this.data[i].t;

            if (i % xStepSize === 0) {
                this.ctx.fillText(dateText, x, this.verticalPadding + this.viewHeight + 30);
                this.ctx.moveTo(x, this.verticalPadding + this.viewHeight);
                this.ctx.lineTo(x, this.verticalPadding + this.viewHeight + 10);
            }

            // отрисовка вертикальной линии, если мышка находится на отрисовываемом значении
            if (this.isOver(mouseX, x, this.data.length, this.viewWidth)) {
                this.ctx.moveTo(x, this.verticalPadding);
                this.ctx.lineTo(x, this.verticalPadding + this.viewHeight);
                this.onChangeFocus({ date: dateText, value: this.data[i].v })
            }
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    /**
     * @param mouseX: number - cursor position on the X-axis;
     */
    paintCircles(mouseX) {
        let i = 0;
        for (const { v } of this.data) {
            const x = Math.round(i * this.xRatio);
            const y = this.dpiHeight - this.verticalPadding - v * this.yRatio;
            if (this.isOver(mouseX, x, this.data.length, this.viewWidth)) {
                this.circle(x, y, CIRCLE_RADIUS);
            }
            i++;
        }
    }

    circle(x, y, radius) {
        this.ctx.beginPath();
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = '#fff';
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.closePath();
    }

    isOver(mouseX, x, length, viewWidth) {
        if (!mouseX) {
            return false;
        }
        return Math.abs(mouseX - x) < (viewWidth / length) / 2;
    }
}
