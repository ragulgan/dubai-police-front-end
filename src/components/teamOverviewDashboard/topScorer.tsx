import React from 'react'
import { Card, Grid, Typography, Box, Chip } from '@mui/material';
import Image from "next/image";
import topAthlete from "../../../public/team-overview/athlete-img-new.png";

interface TopScorerProps {
  TopScorerData?: any;
}

const TopScorer: React.FC<TopScorerProps> = ({
  TopScorerData,
}) => {
  const footballImg = "/team-overview/football-white.svg";

  return (
    <Card
      sx={{
        maxWidth: "100%",
        background: 'linear-gradient(to right, #004d00, #008000)',
        color: 'white',
        borderRadius: "8px",
        paddingLeft: "24px",
        paddingRight: "49px",
        paddingTop: "46px",
        paddingBottom: "0px",
        height: "301px"
      }}>
      <Grid container spacing={0}>
        <Grid item md={6} direction="column" sx={{ marginTop: "9px" }}>
          <Typography
            className="bukra"
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              lineHeight: "31px"
            }}>Top Scorer in</Typography>
          <Typography
            className="bukra"
            sx={{
              fontSize: "23px",
              fontWeight: 600,
              lineHeight: "34px"
            }}
          >UAE Police League 2024</Typography>
          <Box mt={2}>
            <Chip
              key={'Football'}
              label={'Football'}
              icon={
                <img
                  src={footballImg}
                  style={{
                    width: "20px",
                    height: "16px",
                    paddingTop: "4px"
                  }}
                  alt={'Football'}
                />
              }
              sx={{
                padding: "0px",
                fontWeight: 500,
                fontSize: "16px",
                backgroundColor: "rgba(0, 135, 85, 0.03)",
                color: "#FFFFFF",
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
          </Box>
          <Typography mt={1}
            className="bukra"
            sx={{
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: "31px"
            }}
          >Sergeant</Typography>
          <Typography
            className="bukra"
            sx={{
              fontSize: "16px",
              fontWeight: 500,
              lineHeight: "22px"
            }}
          >Ahmed Saeed Al Mansoori</Typography>
        </Grid>
        <Grid item md={6}>
          <Box>
            <Image
              src={topAthlete}
              alt={""}
              style={{
                width: "256px",
                height: "255px",
                objectFit: "cover"
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Card>
  )
}

export default TopScorer
