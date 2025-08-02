import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Box, Typography } from "@mui/material";
import { FiberManualRecord } from "@mui/icons-material";


const data = [
  { name: "Player 1", win: 7, lost: 0, tie: 0, noResult: 0 },
  { name: "Player 2", win: 5, lost: 2, tie: 0, noResult: 0 },
  { name: "Player 3", win: 4, lost: 3, tie: 0, noResult: 0 },
  { name: "Player 4", win: 3, lost: 1, tie: 2, noResult: 1 },
  { name: "Player 5", win: 3, lost: 3, tie: 0, noResult: 0 },
  { name: "Player 6", win: 3, lost: 1, tie: 1, noResult: 1 },
  { name: "Player 7", win: 2, lost: 3, tie: 2, noResult: 1 },
  { name: "Player 8", win: 2, lost: 2, tie: 1, noResult: 1 },
  { name: "Player 9", win: 2, lost: 2, tie: 0, noResult: 1 },
  { name: "Player 10", win: 2, lost: 2, tie: 1, noResult: 0 },
  { name: "Player 11", win: 1, lost: 3, tie: 2, noResult: 1 },
  { name: "Player 12", win: 1, lost: 2, tie: 1, noResult: 2 },
  { name: "Player 13", win: 1, lost: 2, tie: 1, noResult: 2 },
  { name: "Player 14", win: 0, lost: 3, tie: 1, noResult: 1 },
  { name: "Player 15", win: 0, lost: 3, tie: 1, noResult: 1 },
  { name: "Player 16", win: 0, lost: 3, tie: 0, noResult: 2 },
  { name: "Player 17", win: 0, lost: 4, tie: 0, noResult: 1 },
];

export default function StandingsChart() {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "12px",
        p: 2,
        border: "1px solid #e0e0e0",
      }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <FiberManualRecord fontSize="small" sx={{ color: "#2E7D32", mr: 1 }} />
        <Typography variant="subtitle1" fontWeight="bold" color="#2E7D32">
          Standings
        </Typography>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 0, right: 20, left: 0, bottom: 40 }}
        >
          <CartesianGrid
            stroke="#A9A9A9"
            strokeWidth={0.5}
            vertical={false}
            horizontal={true}
          />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis
            ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8,9]}
            domain={[0, 8]}
            interval={0}
          />
         <Tooltip
                     cursor={{ fill: "transparent" }}

                     contentStyle={{
                       borderRadius: "8px",
                       boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                     }}
                   />

          <Bar dataKey="win" stackId="a" fill="#4CAF50" />
          <Bar dataKey="lost" stackId="a" fill="#EF5350" />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={3}
        mt={2}
        flexWrap="wrap"
      >
        <LegendItem color="#4CAF50" label="Win" />
        <LegendItem color="#EF5350" label="Lost" />
        <LegendItem color="#FF9800" label="Tie" />
        <LegendItem color="#9E9E9E" label="No Result" />
      </Box>
    </Box>
  );
}

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <Box display="flex" alignItems="center" gap={0.5}>
    <FiberManualRecord sx={{ color }} fontSize="small" />
    <Typography variant="body2">{label}</Typography>
  </Box>
);
