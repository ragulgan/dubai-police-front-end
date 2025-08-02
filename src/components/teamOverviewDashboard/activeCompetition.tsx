import React from 'react'
import { Card, CardContent, Grid, Box, Typography, Chip } from '@mui/material';

interface ActiveCompetitionProps {
  ActiveCompetitionData?: any;
}

const ActiveCompetition: React.FC<ActiveCompetitionProps> = ({
  ActiveCompetitionData,
}) => {
  const football = "/team-overview/football-img.svg";
  
  return (
    <Card sx={{
      maxWidth: "100%", background: '#FFFFFF', color: '#000000', borderRadius: "8px", boxShadow: 'none',
      paddingTop: "16px",
      paddingRight: "16px",
      paddingLeft: "16px"
    }}>
      <CardContent sx={{
        p: 0
      }}>
        <Grid item md={12} >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5 }}>
            <Typography sx={{
              fontSize: "18px",
              fontWeight: 500
            }}
              className="bukra">Active Competitions
              <Chip
                label={"Live"}
                sx={{
                  backgroundColor: "#E4002B",
                  color: "#FFFFFF",
                  height: "20px",
                  border: "1px solid #E4002B",
                  borderRadius: "24px",
                  ".MuiChip-label": {
                    fontWeight: 500,
                    fontSize: "16px",
                    lineHeight: "18px",
                    textAlign: "left"
                  },
                  width: "fit-content",
                  ml: 1
                }}
                className="dubai-med"
              />
            </Typography>
            <Typography sx={{ fontSize: "14px", color: "#58585B", cursor: "pointer" }}>More →</Typography>
          </Box>
          <Typography
            display="flex"
            flexDirection="row"
            sx={{
              fontSize: "16px",
              fontWeight: 600
            }}
            gap={1}
            className="bukra"
          >

          </Typography>

          <Box
            sx={{
              border: "1px solid rgba(0, 135, 85, 0.3)",
              // borderLeft: "5px solid orange",
              p: 2,
              bgcolor: "white",
              borderRadius: "8px"
            }}
            mb={1}
          >
            <Typography
              display="flex"
              flexDirection="row"
              sx={{
                fontFamily: "29LT Bukra",
                fontSize: "16px",
                fontWeight: 600,
              }}
              className="bukra"
            >
              <Chip
                key={'Football'}
                label={'Football'}
                icon={
                  <img
                    src={football}
                    style={{
                      width: "20px",
                      height: "16px",
                      paddingTop: "4px",
                    }}
                    alt={'Football'}
                  />
                }
                sx={{
                  padding: "0px",
                  fontWeight: 500,
                  fontSize: "16px",
                  backgroundColor: "rgba(0, 135, 85, 0.03)",
                  color: "#008755",
                  lineHeight: "18px",
                  height: "24px",
                  ".MuiChip-label": {
                    padding: "8px",
                  },
                  border: "1px solid #008755",
                  mr: 1,
                  width: "fit-content"
                }}
                className="dubai-med webkit-line-clamp webkit-1"
              />
              <Chip
                label={"Winner"}
                sx={{
                  padding: "11px",
                  backgroundColor: "#FFFAE8",
                  color: "#000000",
                  height: "20px",
                  border: "1px solid #FFAF2F",
                  borderRadius: "4px",
                  ".MuiChip-label": {
                    fontFamily: "Roboto",
                    fontWeight: 500,
                    fontSize: "12px",
                    lineHeight: "18px",
                    textAlign: "left",
                    paddingY: "7px",
                    paddingX: "10px",
                  }
                }}
              />
            </Typography>
            <Typography variant="body2" mt={1} className="dubai-med"
              sx={{
                fontSize: "16px",
                fontWeight: 600,
                color: "#000000"
              }}
            >
              Dubai Super Cup 2024
            </Typography>
          </Box>

        </Grid>
      </CardContent>
    </Card>
  )
}

export default ActiveCompetition
