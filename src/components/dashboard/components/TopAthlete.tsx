import { Alert, Avatar, Box, Card, Skeleton, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";

export default function TopAthlete() {
  const TopAthleteData =  {
    loading: false,
    code: 200,
    message: "Success",
    data:[
    {
      name: "Mujahid Yabaal el-Ghattas",
      department: "Criminal Investigations and Inquiries",
      wins: 18,
      participation: 89,athleteImage:"/team-overview/player1.svg"
    },
    {
      name: "Daawood Ashkir Edris",
      department: "Naif Police Station",
      wins: 13,
      participation: 75,athleteImage:"/team-overview/player2.svg"
    },
    {
      name: "Muzammil al-Hussain",
      department: "Institutional Development Offices",
      wins: 11,
      participation: 62,athleteImage:"/team-overview/player3.svg"
    },
    {
      name: "Fawzi Humaidaan Nasir",
      department: "Security of Organizations, Facilities...",
      wins: 5,
      participation: 50,
      athleteImage:"/team-overview/player1.svg"
    },
    {
      name: "Abdul Hameed al-Bashara",
      department: "Criminal Investigations and Inquiries",
      wins: 4,
      participation: 40,athleteImage:"/team-overview/player2.svg"
    },
  ]
}
  return (
    <>
      {TopAthleteData && TopAthleteData?.loading && (
        <Card
          sx={{
            p: 2,
            pb: 0,
            height: "280px",
            boxShadow: "none",
            borderRadius: "8px",
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
          <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} width={"30%"} />
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"204px"}
            sx={{ mt: 1, borderRadius: "20px" }}
          />
        </Card>
      )}
      <Box p={2} bgcolor="#ffffff" borderRadius={2} height={550} boxShadow={1}>
        {TopAthleteData && !TopAthleteData?.loading && (
          <>
            {TopAthleteData &&
              TopAthleteData?.data &&
              TopAthleteData?.data.length === 0 && (
                <Alert className="dubai-med" severity="info">
                  No top Ranking records found .
                </Alert>
              )}
            {TopAthleteData &&
              TopAthleteData?.data &&
              TopAthleteData?.data.length > 0 && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                  <Typography sx={{ fontSize: "18px" }} variant="subtitle1" fontWeight="bold">
                       Top Performing Athletes
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center",  }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexGrow: 0,
                      }}
                    >
                      {TopAthleteData &&
                        TopAthleteData?.data &&
                        TopAthleteData?.data?.length > 0 &&
                        TopAthleteData?.data.map((data: any, index: any) => (
                          <>
                            <Box
                              key={index}
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 38,
                                  height: 39,
                                  border: "2px solid #008755",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "50%",
                                  fontSize: "16px",
                                  color: "#008755",
                                  background: "#F5F6F9",
                                }}
                                className="bukra-semi-bold"
                              >
                                {index + 1}
                              </Box>
                              {index !== TopAthleteData?.data.length - 1 && (
                                <Box
                                  sx={{
                                    width: 2,
                                    height: "55px",
                                    bgcolor: "#008755",
                                  }}
                                />
                              )}
                            </Box>
                          </>
                        ))}
                    </Box>

                    <Box flexGrow={2}>
                      {TopAthleteData &&
                        TopAthleteData?.data &&
                        TopAthleteData?.data?.length > 0 &&
                        TopAthleteData?.data.map((data: any, index: any) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "30px",
                              marginTop: "15px",
                            }}
                          >
                            <Box
                              sx={{
                                width: 60,
                                height: 2,
                                bgcolor: "#008755",
                                marginBottom: "12px",
                                marginTop: "17px",
                              }}
                            />

                            <Card
                              sx={{
                                display: "flex",
                                alignItems: "center",
                               bgcolor: "#008755",
                                color: "white",
                                p: 0.6,
                                borderRadius: 2,
                                width: "100%",
                              }}
                            >
                              <Avatar
                                src={data?.athleteImage}
                                sx={{
                                  width: 32,
                                  height: 32,
                                  mr: 1.5,
                                  border: "1px solid #fff",
                                }}
                              />
                              <Box
                                sx={{
                                  flex: 1,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <Box>
                                  <Typography
                                    sx={{ fontSize: "16px" }}
                                    className="dubai-bold text-capitalize"
                                  >
                                    {data?.name &&
                                    !isEmpty(data?.name.trim()) ? (
                                      data?.name
                                    ) : (
                                      <>&nbsp;</>
                                    )}
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: "12px" }}
                                    className="dubai-regular"
                                  >
                                   {data.department}
                                  </Typography>
                                </Box>
                                 <Box
                                    sx={{
                                      display: "flex",
                                      gap: "8px",
                                      color: "#FFFFFF",
                                      backgroundColor: "#FFFFFF1A",
                                      borderRadius: "5px",
                                      padding: "2px 16px",
                                      justifyContent: "flex-end",
                                    }}
                                  >
                                    <Box sx={{ textAlign: "center" }}>
                                      <Typography
                                        sx={{ fontSize: "18px" }}
                                        className="bukra-semi-bold"
                                      >
                                        {data.wins}
                                        {/* <CountAnimation
                                          value={Number(athlete?.total_wins)}
                                        /> */}
                                      </Typography>
                                      <Typography
                                        sx={{ fontSize: "12px" }}
                                        className="dubai-regular"
                                      >
                                        Wins
                                      </Typography>
                                    </Box>
                                    {/* Vertical Line */}
                                    <Box
                                      sx={{
                                        width: "1px",
                                        height: "50px",
                                        backgroundColor: "#b7b0b0",
                                      }}
                                    />
                                    <Box sx={{ textAlign: "center" }}>
                                      <Typography
                                        sx={{ fontSize: "18px" }}
                                        className="bukra-semi-bold"
                                      >
                                        {data.participation}
                                        {/* <CountAnimation
                                          value={Number(athlete?.total_participants)}
                                        /> */}
                                      </Typography>
                                      <Typography
                                        sx={{ fontSize: "12px" }}
                                        className="dubai-regular"
                                      >
                                        Total Participants
                                      </Typography>
                                    </Box>
                                  </Box>
                              </Box>
                            </Card>
                          </Box>
                        ))}
                    </Box>
                  </Box>
                </>
              )}
          </>
        )}
      </Box>
    </>
  );
}
