import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Box, Typography } from "@mui/material";

const data = [
  { name: "Sector A", value: 7.9, color: "#2b2d70" },
  { name: "Sector B", value: 7.2, color: "#61dbe4" },
  { name: "Sector C", value: 6.9, color: "#f87070" },
  { name: "Sector D", value: 6.7, color: "#f7b32b" },
  { name: "Sector E", value: 5.1, color: "#53b3f0" },
  { name: "Sector F", value: 4.0, color: "#9f5f9f" },
  { name: "Sector G", value: 2.5, color: "#43aa8b" }
];

const RoundedBarChartCard = () => {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: "16px",
        border: "1px solid #e0e0e0",
        background: "#fff",
        width: "100%",
        height: "auto"
      }}
    >
      <Typography variant="subtitle1" fontWeight="bold" mb={2}>
        Physical Readiness Criterion (10)
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart layout="vertical" data={data} barSize={20}>
          <XAxis type="number" hide domain={[0, 10]} />
          <YAxis type="category" dataKey="name" width={150} />
          <Tooltip cursor={{ fill: 'transparent' }} />
          <Bar dataKey="value" radius={[10, 10, 10, 10]} isAnimationActive>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Box mt={1}>
        {data.map((item, idx) => (
          <Typography
            key={idx}
            sx={{
              position: "relative",
              top: "-32px",
              left: `${item.value * 9.5}%`,
              fontSize: "12px",
              color: "#333",
              fontWeight: 500
            }}
          >
            {item.value}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default RoundedBarChartCard;
