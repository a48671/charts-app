import 'src/style/index.scss';
import { App } from 'src/components/app';
import { chart } from 'src/components/chart';
import { scrollChart } from 'src/components/scroll-chart';

const app = new App().getElement();

const root = document.getElementById('root');
root.appendChild(app);
chart.init();
scrollChart.init();
