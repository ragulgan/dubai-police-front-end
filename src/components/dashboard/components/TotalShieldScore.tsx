import { Alert, Avatar, Box, Card, Skeleton, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";

export default function TotalShieldScore() {
  const TotalShieldScoreData =  {
    loading: false,
    code: 200,
    message: "Success",
    data:[
    {
    name: "Academic Affairs and Training Sector",
    shieldPoint: 84.7,
  },
  {
    name: "Sector Affairs",
    shieldPoint: 76.3,
  },
  {
    name: "Community Happiness and Logistics Support Sector",
    shieldPoint: 51.8,
  },
  {
    name: "Operations Sector",
    shieldPoint: 47.6,
  },
  {
    name: "Criminal Investigation Department",
    shieldPoint: 40.2,
  },
  {
    name: "Department of Administration",
    shieldPoint: 35.7,
  },
  {
    name: "Excellence and Leadership Affairs Sector",
    shieldPoint: 30.1,
  },
  ]
}
  return (
    <>
      {TotalShieldScoreData && TotalShieldScoreData?.loading && (
        <Card
          sx={{
            p: 2,
            pb: 0,
            height: "350px",
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
      <Box p={2} bgcolor="#ffffff" borderRadius={2} height={700} boxShadow={1}>
        {TotalShieldScoreData && !TotalShieldScoreData?.loading && (
          <>
            {TotalShieldScoreData &&
              TotalShieldScoreData?.data &&
              TotalShieldScoreData?.data.length === 0 && (
                <Alert className="dubai-med" severity="info">
                  No top Ranking records found .
                </Alert>
              )}
            {TotalShieldScoreData &&
              TotalShieldScoreData?.data &&
              TotalShieldScoreData?.data.length > 0 && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                  <Typography sx={{ fontSize: "18px" }} variant="subtitle1" fontWeight="bold">
                       Top Shield Score (100)
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexGrow: 0,
                      }}
                    >
                      {TotalShieldScoreData &&
                        TotalShieldScoreData?.data &&
                        TotalShieldScoreData?.data?.length > 0 &&
                        TotalShieldScoreData?.data.map((data: any, index: any) => (
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
                              {index !== TotalShieldScoreData?.data.length - 1 && (
                                <Box
                                  sx={{
                                    width: 2,
                                    height: "50px",
                                    bgcolor: "#008755",
                                  }}
                                />
                              )}
                            </Box>
                          </>
                        ))}
                    </Box>

                    <Box flexGrow={2}>
                      {TotalShieldScoreData &&
                        TotalShieldScoreData?.data &&
                        TotalShieldScoreData?.data?.length > 0 &&
                        TotalShieldScoreData?.data.map((data: any, index: any) => (
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
                                        {data.shieldPoint}
                                        {/* <CountAnimation
                                          value={Number(athlete?.total_wins)}
                                        /> */}
                                      </Typography>
                                      <Typography
                                        sx={{ fontSize: "12px" }}
                                        className="dubai-regular"
                                      >
                                        Shield Points
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
