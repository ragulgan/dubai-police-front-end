import React, { useState } from 'react'
import { Card, CardContent, Box, Typography, Select, MenuItem } from '@mui/material';
import { LineChart, lineElementClasses } from '@mui/x-charts';

interface RaceTrendsProps {
  uData?:any;
  pData?:any;
  xLabels?: any;
}

const RaceTrends: React.FC<RaceTrendsProps> = ({
  uData,
  pData,
  xLabels,
}) => {
  const [season, setSeason] = useState("2024 - 2025");
  
  return (
    <Card sx={{ background: '#FFFFFF', color: '#000000', borderRadius: "8px", boxShadow: 'none', p: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <Typography color="#00000" pb={1}
            sx={{
              fontSize: "18px",
              fontWeight: 500
            }}
            className="bukra">Race Trends</Typography>
          <Box>
            <Select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              variant="outlined"
              sx={{ bgcolor: "white", borderRadius: 2, color: "#008755", mr: 1, height: "40px" }}
            >
              <MenuItem value="2024 - 2025" sx={{
                color: "#008755"
              }}>Season 2024 - 2025</MenuItem>
              <MenuItem value="2025 - 2026" sx={{
                color: "#008755"
              }}>Season 2025 - 2026</MenuItem>
            </Select>
            <Select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              variant="outlined"
              sx={{ bgcolor: "white", borderRadius: 2, color: "#008755", height: "40px" }}
            >
              <MenuItem value="2024 - 2025" sx={{
                color: "#008755"
              }}>Season 2024 - 2025</MenuItem>
              <MenuItem value="2025 - 2026" sx={{
                color: "#008755"
              }}>Season 2025 - 2026</MenuItem>
            </Select>
          </Box>
        </Box>

        <LineChart
          width={1000}
          height={400}
          series={[
            { data: uData, area: true, stack: 'total', showMark: false, connectNulls: true, color: "#26D07C" },
            { data: pData, area: true, stack: 'total', showMark: false, connectNulls: true, color: "#E4002B" }
          ]}
          xAxis={[{ scaleType: 'point', data: xLabels }]}
          yAxis={[{ min: 0, max: 100 }]}
          sx={{
            [`& .${lineElementClasses.root}`]: {
              display: 'none'
            },
          }}
          className="chart-liner-list-overview"
        />
      </CardContent>
    </Card>
  )
}

export default RaceTrends
