import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Grid } from "@mui/material";

export const webUsageStats = [
  {
    name: "Academic Affairs and Training Sector",
    value: 4.8,
    color: "#10B981"
   
  },
  { name: "Sector Affairs", value: 3.5, color: "#A855F7" },
  {
    name: "Community Happiness and Logistics Support Sector",
    value: 4.1,
    color: "#60A5FA",
  },
  { name: "Operations Sector", value: 3.3, color: "#FBBF24" },
  { name: "Criminal Investigation Department", value: 3.9, color: "#F87171" },
  { name: "Department of Administration", value: 0.1, color: "#5EEAD4" },
  {
    name: "Excellence and Leadership Affairs Sector",
    value: 6.9,
    color: "#2f3e76",
  },
];

export default function PieAnimation() {

  return (
    <Box p={2} bgcolor="#ffffff" borderRadius={2} height={700} boxShadow={1}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography sx={{ fontSize: "18px" }} variant="subtitle1" fontWeight="bold">
          Women Empowerment (10)
        </Typography>
        <Typography variant="body2" color="primary">
          More ↗
        </Typography>
      </Box>
      <Box height={300} margin={1}>
        <ResponsiveContainer>
       
          <PieChart>
            <circle
              cx="50%"
              cy="50%"
              r="155" 
              fill="#ffffff"
              stroke="#d3f7e9" // Light pastel border color
            />
            <Pie
              data={webUsageStats}
              innerRadius={40}
              outerRadius={150}
              paddingAngle={1}
              dataKey="value"
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius,
                value,
              }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);

                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={12}
                  >
                    {value}
                  </text>
                );
              }}
              labelLine={false}
            >
              {webUsageStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <Grid container spacing={1} mt={5}>
          {webUsageStats.map((entry, index) => (
            <Grid item xs={12} sm={12} key={index}>
              <Box display="flex" alignItems="center">
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "20%",
                    backgroundColor: entry.color,
                    mr: 1,
                  }}
                />
                <Typography variant="body2">{entry.name}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
