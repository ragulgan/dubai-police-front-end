import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';
import { FiberManualRecord } from '@mui/icons-material';

const data = [
  { name: 'Player-1', win: 7, lost: 0 },
  { name: 'Player-2', win: 5, lost: 2 },
  { name: 'Player-3', win: 4, lost: 3 },
  { name: 'Player-4', win: 4, lost: 2 },
  { name: 'Player-5', win: 3, lost: 3 },
  { name: 'Player-6', win: 3, lost: 2 },
  { name: 'Player-7', win: 2, lost: 3 },
  { name: 'Player-8', win: 2, lost: 2 }
];

export default function StandingsChart() {
  return (
    <Box
      sx={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        p: 2,
        border: '1px solid #e0e0e0',
      }}
    >
      {/* Title with green dot */}
      <Box display="flex" alignItems="center" mb={2}>
        <FiberManualRecord fontSize="small" sx={{ color: '#2E7D32', mr: 1 }} />
        <Typography variant="subtitle1" fontWeight="bold" color="#2E7D32">
          Standings
        </Typography>
      </Box>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 0, right: 20, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={60} />
          <YAxis />
          <Tooltip />
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
