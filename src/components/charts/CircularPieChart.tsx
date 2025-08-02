import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { PiePlot, ResponsiveChartContainer, useDrawingArea } from '@mui/x-charts';
import { styled } from '@mui/material/styles';

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 20,
}));

function PieCenterLabel({ children }: { children: React.ReactNode }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

// interface ChartData {
//   label: string;
//   value: number;
// }

// interface CircularPieChartProps {
//   data: ChartData
// }

const CircularPieChart: React.FC = () => {
  const data = [
    { label: 'Warm Up', value: 92, fill: "#26D07C" },
    { label: 'Cool Down', value: 8, fill: "#E1E1E1" },
  ];
  return (
    <>
      <PieChart
        colors={["#26D07C", "#E1E1E1"]}
        series={[
          {
            paddingAngle: 5,
            innerRadius: 60,
            outerRadius: 80,
            data,
          },
        ]}
        margin={{ right: 5 }}
        width={200}
        height={200}
        legend={{ hidden: true }}
      >
        <PieCenterLabel>92%</PieCenterLabel>
      </PieChart >
    </>
  );
}


export default CircularPieChart;