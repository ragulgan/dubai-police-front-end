import * as React from 'react';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { AreaPlot, LinePlot } from '@mui/x-charts/LineChart';

const uData = [1000, 2000, 3000, 2000, 2700, 2000, 2500, 3000];
const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
  'Page H'
];

const TinyAreaChart: React.FC = () => {
  return (
    <ChartContainer
      width={500}
      height={300}
      series={[
        {
          data: uData,
          type: 'line',
          label: 'uv',
          area: true,
          stack: 'total',
        },
        {
          data: uData,
          type: 'line',
          label: 'uv-line',
        },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
    >
      <AreaPlot />
      <LinePlot />
    </ChartContainer>
  );
}

export default TinyAreaChart;