import { boundaries, css } from "src/utils";
import { CIRCLE_RADIUS, X_COL_COUNT, ROW_HEIGHT } from "../const";
export const HORIZONTAL_PADDING = 40;
export const VERTICAL_PADDING = 20;

export class ChartService {
    /**
     * @param canvas: HTMLCanvasElement;
     * @params: {
     *     width: number - width wrapper which containing canvas;
     *     ratioWidthToHeight?: number - ratio width to height;
     *     height?: number - height for canvas
     *     thereIsXAxis?: boolean - show x axis;
     *     thereIsYAxis?: boolean - show y axis;
     *     dpiMultiplier?: number - multiplier for width and height canvas,
     *     onChangeFocus?: (data) => void - callback function which will calling before change focus along X-axis,
     *     color?: string - chart color;
     *     colWidth?: number - width`s column
     * };
     */
    constructor(canvas, props) {
        this.canvas = canvas;
        this.ratioWidthToHeight = props.ratioWidthToHeight || 0.618;
        this.thereIsXAxis = props.thereIsXAxis;
        this.thereIsYAxis = props.thereIsYAxis;
        this.dpiMultiplier = props.dpiMultiplier || 2;
        this.ctx = this.canvas.getContext('2d');
        this.setData([]);
        this.setWidth(props.width, props.height);
        this.setRatio();
        this.onChangeFocus = props.onChangeFocus;
        this.color = props.color || 'grey';
        this.colWidth = props.colWidth;
        this.setColumnCount();
    }

    setColWidth(colWidth) {
        this.colWidth = colWidth;
        this.setColumnCount();
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
        this.setColumnCount();
        this.setData(this.data);

        css(this.canvas, { width: this.canvasWidth + 'px', height: this.canvasHeight + 'px' });
        this.canvas.width = this.dpiWidth;
        this.canvas.height = this.dpiHeight;

        this.setRatio();
        this.paint();
    }

    /**
     * Установка количества столбцов по оси X
     */
    setColumnCount() {
        this.columnCount = this.colWidth ? Math.floor(this.viewWidth / this.colWidth) : this.data.length;
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
        this.setColumnCount();
        const lengthByColumnsCount = this.columnCount ? this.columnCount + 1 : this.data.length;
        this.viewData = data.slice(0, lengthByColumnsCount);
        this.setRatio();
    }

    setRatio() {
        const [yMin, yMax] = boundaries(this.viewData);
        this.yMin = yMin;
        this.yMax = yMax;
        // range никогда не должен быть 0, если this.yMax - this.yMin = 0, значит yRatio = viewHeight
        const range = this.yMax - this.yMin || 1;
        this.yRatio = this.viewHeight / range;
        this.xRatio = this.colWidth || this.viewWidth / (this.viewData.length - 1);
    }

    clear() {
        this.ctx.clearRect(0, 0, this.dpiWidth, this.dpiHeight);
    }

    paintLine() {
        this.ctx.beginPath();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.color;
        this.ctx.fillStyle = this.color;
        let i = 0
        for (const { v } of this.viewData) {
            const y = this.getY(v);
            const x = Math.round(i * this.xRatio);
            this.ctx.lineTo(x, y);
            i++;
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }

    paintYAxis() {
        const step = ROW_HEIGHT;
        const rowsCount = this.viewHeight / ROW_HEIGHT
        const sizeStep = (this.yMax - this.yMin) / rowsCount;

        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle ='#bbb';
        this.ctx.font = 'normal 20px Helvetica, sans-serif';
        this.ctx.fillStyle = '#96a2aa';

        /**
         * Нижняя граница графика (ось X)
         */
        this.ctx.moveTo(0, this.verticalPadding + this.viewHeight);
        this.ctx.lineTo(this.viewWidth, this.verticalPadding + this.viewHeight);

        if (this.yMin < 0) {
            const getNegativeYByI = (i) => {
                return this.verticalPadding + this.yMax * this.yRatio + step * i;
            };
            let i = 0;
            while (getNegativeYByI(i) < this.verticalPadding + this.viewHeight) {
                const y = getNegativeYByI(i);
                const textStep = (sizeStep * i * -1).toFixed(2).toString();
                this.ctx.fillText(textStep, this.viewWidth + 10, y + 5);
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.viewWidth, y);
                i++;
            }
        }

        const getPositiveYByI = (i) => {
            return this.verticalPadding + this.yMax * this.yRatio - step * i;
        };
        let i = 0;
        while (getPositiveYByI(i) >= this.verticalPadding) {
            const y = getPositiveYByI(i);
            if (y > this.verticalPadding + this.viewHeight) {
                i++;
                continue;
            }
            const textStep = (sizeStep * i).toFixed(1).toString();
            this.ctx.fillText(textStep, this.viewWidth + 10, y + 5);
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.viewWidth, y);
            i++;
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
        for (let i = 0; i < this.viewData.length; i++) {
            const x = Math.round(i * this.xRatio);
            const dateText = this.viewData[i].t;

            if (i % X_COL_COUNT === 0) {
                this.ctx.fillText(dateText, x, this.verticalPadding + this.viewHeight + 30);
                this.ctx.moveTo(x, this.verticalPadding + this.viewHeight);
                this.ctx.lineTo(x, this.verticalPadding + this.viewHeight + 10);
            }

            // отрисовка вертикальной линии, если мышка находится на отрисовываемом значении
            if (this.isOver(mouseX, x, this.columnCount, this.viewWidth)) {
                this.ctx.moveTo(x, this.verticalPadding);
                this.ctx.lineTo(x, this.verticalPadding + this.viewHeight);
                this.onChangeFocus({ date: dateText, value: this.viewData[i].v })
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
        for (const { v } of this.viewData) {
            const y = this.getY(v);
            const x = Math.round(i * this.xRatio);
            if (this.isOver(mouseX, x, this.columnCount, this.viewWidth)) {
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

    /**
     * Получение относительного отступа по оси Y сверху вниз по значению
     * @param value: number
     */
    getY(value) {
        if (value < 0) {
            return this.verticalPadding + (this.yMax + Math.abs(value)) * this.yRatio;
        } else {
            return this.verticalPadding + (this.yMax - value) * this.yRatio;
        }
    }

    /**
     * Получение количества столбцов в графике, чтобы понимать сколько элементов списка вмещает график по оси X
     */
    getColumnCount() {
        return this.columnCount;
    }
}
