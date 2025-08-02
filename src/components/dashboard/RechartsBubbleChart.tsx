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

// Example data
const data = [
  { name: "A", x: 50, y: 80, z: 51.8, fill: "#2a9d8f" },
  { name: "B", x: 20, y: 30, z: 30.2, fill: "#60c3d3" },
  { name: "C", x: 80, y: 40, z: 25.3, fill: "#f28482" },
  { name: "D", x: 60, y: 20, z: 33.6, fill: "#b388eb" },
  { name: "E", x: 10, y: 70, z: 18.8, fill: "#4895ef" },
  { name: "F", x: 30, y: 60, z: 12.3, fill: "#f4a261" },
  { name: "G", x: 90, y: 90, z: 10.2, fill: "#3d405b" }
];

const RechartsBubbleChart = () => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "16px",
        border: "1px solid #e0e0e0",
        background: "#fff",
        // width: 360,
        // height: 340
      }}
    >
      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography fontWeight="bold">Competitiveness (60)</Typography>
        <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
          More →
        </Typography>
      </Box>

      <ResponsiveContainer width="100%" height={510}>
        <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
          <XAxis type="number" dataKey="x" hide />
          <YAxis type="number" dataKey="y" hide />
          <ZAxis type="number" dataKey="z" range={[60, 200]} />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
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
                    fontSize={12}
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

export default RechartsBubbleChart;
