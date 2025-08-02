import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

const data = [
  { name: "", value: 14, fill: "#2C3E78" },
  { name: "", value: 6, fill: "#78E0E0" },
  { name: "", value: 10, fill: "#F86C8C" },
  { name: "", value: 18, fill: "#FDCB38" },
  { name: "", value: 13, fill: "#5697D1" },
  { name: "", value: 9, fill: "#A06FB6" },
  { name: "", value: 25, fill: "#00A87E" },
];

const TotalWinRateChart = () => {
  return (
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="subtitle1" fontWeight={600}>
            Total Win Rate
          </Typography>
          <Typography variant="body2" color="primary">
            More ↗
          </Typography>
        </Box>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data} barSize={35}>
            <XAxis dataKey="name" hide />
            <YAxis hide domain={[0, 30]} />
          
            <Tooltip
              cursor={{ fill: "transparent" }}
               formatter={(value) => `${value}%`}
              contentStyle={{
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              }}
            />
            <Bar dataKey="value" radius={[5, 5, 0, 0]}>
              <LabelList
                dataKey="value"
                position="top"
                formatter={(value: any) => `${value}%`}
                style={{ fill: "#000", fontWeight: 600 }}
              />
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

export default TotalWinRateChart;
