import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, Typography, Box } from "@mui/material";

const data = [
  { name: "", value: 7.9, fill: "#2C3E78" },
  { name: "", value: 7.2, fill: "#78E0E0" },
  { name: "", value: 6.9, fill: "#F86C8C" },
  { name: "", value: 6.7, fill: "#FDCB38" },
  { name: "", value: 5.1, fill: "#5697D1" },
  { name: "", value: 4.0, fill: "#A06FB6" },
  { name: "", value: 2.5, fill: "#00A87E" },
];

const CustomLabel = (props: any) => {
  const { x, y, width, value } = props;
  return (
    <text
      x={x + width + 8} // Positioning label 8px to the right of bar
      y={y + 20} // Align vertically with bar center
      fill="#333"
      fontSize={16}
      fontWeight={600}
    >
      {value}
    </text>
  );
};

const RoundedBarChartCard = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1" fontWeight={600}>
            Physical Readiness Criterion (10)
          </Typography>
        </Box>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart data={data} layout="vertical" barSize={35}>
            <XAxis type="number" domain={[0, 10]} hide />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip
              cursor={{ fill: "transparent" }} // disables hover rectangle
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            />
            <Bar
              dataKey="value"
              radius={[0, 5, 5, 0]}
              isAnimationActive={false}
              label={<CustomLabel />}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RoundedBarChartCard;
