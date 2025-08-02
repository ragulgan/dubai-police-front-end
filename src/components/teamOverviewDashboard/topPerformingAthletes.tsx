import React from 'react'
import athletes from '@/pages/teams/[teamID]/athletes';
import { Box, Typography, Card, Avatar } from '@mui/material';


interface TopPerformingAthletesProps {
  data?: any;
}

const TopPerformingAthletes: React.FC<TopPerformingAthletesProps> = ({
  data,
}) => {
  const athleteInfo = [
    { name: "Mujahid Yabaal el-Ghattas", wins: 18, score: 89, image: "/team-overview/player1.svg" },
    { name: "Daawood Ashkir Edris", wins: 13, score: 75, image: "/team-overview/player2.svg" },
    { name: "Muzammil al-Hussain", wins: 11, score: 62, image: "/team-overview/player3.svg" },
  ];

  return (
    <>
      <Box sx={{
        maxWidth: "100%", background: "#F8FAFC", borderRadius: "8px",
        paddingLeft: "19px", paddingRight: "27px", paddingTop: "10px",
        paddingBottom: "0px"
      }}>
        {/* Title */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography 
          sx={{
            fontSize: "18px",
            fontWeight: 500
          }}
          className="bukra">Top Performing Athletes</Typography>
          <Typography sx={{ fontSize: "14px", color: "#58585B", cursor: "pointer" }}>More →</Typography>
        </Box>

        {/* Stepper with Athletes */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Left Stepper */}
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {athleteInfo.map((_, index) => (
              <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                {/* Number Circle */}
                <Box
                  sx={{
                    width: 38,
                    height: 39,
                    borderRadius: "50%",
                    border: "2px solid #00205B",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px",
                    fontWeight: "bold",
                    color: "#00205B",
                    background: "white",
                  }}
                >
                  {index + 1}
                </Box>

                {/* Vertical Line (Except for Last Item) */}
                {index !== athleteInfo.length - 1 && (
                  <Box sx={{ width: 2, height: "39px", bgcolor: "#00205B" }} />
                )}
              </Box>
            ))}
          </Box>

          {/* Cards for Athletes */}
          <Box>
            {athleteInfo.map((athlete, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", marginBottom: "25px", marginTop: "18px" }}>
                {/* Horizontal Line Connector */}
                <Box sx={{ width: 60, height: 2, bgcolor: "#00205B", marginBottom: "12px", marginTop: "17px" }} />

                {/* Athlete Card */}
                <Card
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "#00205B",
                    color: "white",
                    p: 1.1,
                    borderRadius: 2,
                    width: 366,
                  }}
                >
                  <Avatar src={athlete.image} sx={{ width: 30, height: 30, mr: 2 }} />
                  <Box sx={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box>
                      <Typography sx={{ fontSize: "10px", fontWeight: 700 }}>Mujahid Yabaal el-Ghattas</Typography>
                    </Box>

                    <Box sx={{
                      display: "flex",
                      gap: "8px",  // Adds spacing between the stats
                      fontFamily: "29LT Bukra",
                      fontWeight: 500,
                      fontSize: "16px",
                      color: "#FFFFFF",
                      backgroundColor: "#1e3a6e",
                      borderRadius: "5px",
                      padding: "2px 8px", // Adds padding
                      justifyContent: "flex-end"
                    }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontWeight: 300, fontSize: "10px" }}>15</Typography>
                        <Typography sx={{ fontWeight: 300, fontSize: "10px" }}>Wins</Typography>
                      </Box>
                      {/* Vertical Line */}
                      <Box sx={{
                        width: "1px",   // Thin vertical line
                        height: "30px", // Adjust height as needed
                        backgroundColor: "#b7b0b0", // White line color
                      }} />
                      <Box sx={{ textAlign: "center" }}>
                        <Typography sx={{ fontWeight: 300, fontSize: "10px" }}>18</Typography>
                        <Typography sx={{ fontWeight: 300, fontSize: "10px" }}>Overall Score</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>

              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default TopPerformingAthletes