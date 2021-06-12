import 'src/style/index.scss';
import 'src/components/chart';
import { chart } from 'src/components/chart';
import precipitation from 'src/mocks/precipitation.json';
import temperature from 'src/mocks/temperature.json';

const newChart = chart(document.getElementById('chart'), temperature.slice(0, 200));
newChart.init();
