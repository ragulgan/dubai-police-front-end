"use client"
import { Box, Grid, Typography } from "@mui/material";
import TotalMatchesSVG from "../../../public/TotalMatchesSVG.svg";
import TrophySVG from "../../../public/TrophySVG.svg";
import WhistleSVG from "../../../public/WhistleSVG.svg";
import ExerciseSVG from "../../../public/ExerciseSVG.svg";

const PerformaceOverview: React.FC = () => {
  return (
    <Box sx={{
      padding: 2,
      paddingBottom: 4,
      borderRadius: 2,
      backgroundColor: '#FFFFFF',
      height: 451,
      minHeight: 451,
      backgroundImage: 'url(/OverviewBG.png)',
      backgroundSize: 'contain',
      backgroundPosition: 'top',
      backgroundRepeat: 'no-repeat'
    }}>
      <Typography variant="subtitle1" sx={{ padding: 1, fontWeight: 500, fontSize: 17, color: '#FFFFFF' }}>
        {'Overview'}
      </Typography>
      <Grid container spacing={1} sx={{ marginTop: 15 }}>
        <Grid item xs={6} md={6}>
          <Box padding={2} sx={{ backgroundColor: '#E1F0FF', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TotalMatchesSVG style={{ width: 39, height: 39 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 20, marginLeft: 1, color: '#3699FF' }}>
                {'10'}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: 13, textAlign: 'center', color: '#3699FF' }}>
              {'Total Matches'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={6}>
          <Box padding={2} sx={{ backgroundColor: '#FFEDCB', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrophySVG style={{ width: 39, height: 39 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 20, marginLeft: 1, color: '#FFA800' }}>
                {'8'}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: 13, textAlign: 'center', color: '#FFA800' }}>
              {'Total Wins'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={6}>
          <Box padding={2} sx={{ backgroundColor: '#EEE5FF', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <WhistleSVG style={{ width: 39, height: 39 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 20, marginLeft: 1, color: '#8950FC' }}>
                {'5'}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: 13, textAlign: 'center', color: '#8950FC' }}>
              {'Goals Scored'}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} md={6}>
          <Box padding={2} sx={{ backgroundColor: '#D7F9EF', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ExerciseSVG style={{ width: 39, height: 39 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: 20, marginLeft: 1, color: '#1BC5BC' }}>
                {'80%'}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, fontSize: 13, textAlign: 'center', color: '#1BC5BC' }}>
              {'Athletes'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default PerformaceOverview;