import React from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Box, Typography } from "@mui/material";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";

const data = [
  { name: "Academic Affairs and Training Sector", value: 4.8, color: "#00876c" },
  { name: "Sector Affairs", value: 6.9, color: "#404688" },
  { name: "Community Happiness and Logistics Support Sector", value: 3.9, color: "#60c3d3" },
  { name: "Operations Sector", value: 4.1, color: "#94d2bd" },
  { name: "Criminal Investigation Department", value: 3.3, color: "#f4a261" },
  { name: "Department of Administration", value: 3.5, color: "#e76f51" },
  { name: "Excellence and Leadership Affairs Sector", value: 0.1, color: "#c08497" }
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
      {(percent * 100).toFixed(1)}%
    </text>
  );
};

const DonutChartCard = () => {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "20px",
        border: "1px solid #e0e0e0",
        background: "#fff",
        boxShadow: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <Box width="100%" display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle1" fontWeight="bold">
          Women Empowerment (10)
        </Typography>
        <Typography variant="body2" color="primary" sx={{ cursor: "pointer" }}>
          More →
        </Typography>
      </Box>

      {/* Center Pie Chart */}
      <Box display="flex" justifyContent="center" alignItems="center">
        <PieChart width={350} height={300}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            innerRadius={50}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </Box>

      {/* Center Legend */}
      <Box mt={2} width="100%">
        {data.map((item, index) => (
          <Box key={index} display="flex" alignItems="center" mb={0.5}>
            <FiberManualRecordIcon fontSize="small" sx={{ color: item.color, mr: 1 }} />
            <Typography variant="body2">{item.name}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default DonutChartCard;
