import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Box, Typography } from "@mui/material";

const data = [
  { name: "A", x:40, y: 50, z: 51.8, fill: "#2a9d8f" },
  { name: "B", x: 25, y: 30, z: 30.2, fill: "#60c3d3" },
  { name: "C", x: 55, y: 30, z: 25.3, fill: "#f28482" },
  { name: "D", x: 65, y: 50, z: 35.6, fill: "#b388eb" },
  { name: "E", x: 20, y: 50, z: 18.8, fill: "#4895ef" },
  { name: "F", x: 30, y: 70, z: 12.3, fill: "#f4a261" },
  { name: "G", x: 55, y: 70, z: 10.2, fill: "#3d405b" }
];

const BubbleChart = () => {
  return (
   <Box p={2} bgcolor="#ffffff" borderRadius={2} height={500} boxShadow={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography fontWeight="bold">Competitiveness (60)</Typography>
        <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
           More ↗
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" >
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
      

          <XAxis type="number" dataKey="x" hide />
          <YAxis type="number" dataKey="y" hide />
          <ZAxis type="number" dataKey="z" range={[40, 150]} />

          <Tooltip cursor={{ strokeDasharray: "3 3" }} />

          <Scatter
            data={data}
            shape={(props: any) => {
              const { cx, cy, size, fill, payload } = props;
              return (
                <g>
                  <circle cx={cx} cy={cy} r={size / 2} fill={fill} />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize={size / 6}
                    fontWeight="bold"
                  >
                    {payload.z}
                  </text>
                </g>
              );
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default BubbleChart;
