import 'src/style/index.scss';
import 'src/components/chart';
import { chart } from 'src/components/chart';
import preciption from 'src/mocks/precipitation.json';

const newChart = chart(document.getElementById('chart'), preciption.slice(0, 200));
newChart.init();
