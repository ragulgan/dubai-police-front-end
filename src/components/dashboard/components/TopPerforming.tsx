import { Alert, Avatar, Box, Card, Skeleton, Typography } from "@mui/material";
import { isEmpty } from "lodash";
import React from "react";

export default function TopPerforming() {
  const topTeamsData = {
    loading: false,
    code: 200,
    message: "Success",
    data: [
      {
        title: "Criminal Investigations and Inquiries",
        wins: 10,
        performingImage: "/commander/win1.png",
      },
      {
        title: "Security of Organizations, Facilities, and Emergencies",
        wins: 8,
        performingImage: "/commander/win1.png",
      },
      {
        title: "Naif Police Station",
        wins: 5,
        performingImage: "/commander/win1.png",
      },
      {
        title: "Institutional Development Offices",
        wins: 2,
        performingImage: "/commander/win1.png",
      },
    ],
  };

  return (
    <>
      {topTeamsData && topTeamsData?.loading && (
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
        {topTeamsData && !topTeamsData?.loading && (
          <>
            {topTeamsData &&
              topTeamsData?.data &&
              topTeamsData?.data.length === 0 && (
                <Alert className="dubai-med" severity="info">
                  No top Ranking records found .
                </Alert>
              )}
            {topTeamsData &&
              topTeamsData?.data &&
              topTeamsData?.data.length > 0 && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{ fontSize: "18px" }}
                      variant="subtitle1"
                      fontWeight="bold"
                    >
                      Top Performing Teams
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexGrow: 0,
                      }}
                    >
                      {topTeamsData &&
                        topTeamsData?.data &&
                        topTeamsData?.data?.length > 0 &&
                        topTeamsData?.data.map((data: any, index: any) => (
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
                                  border: "2px solid #00000014",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "50%",
                                  fontSize: "16px",
                                  color: "blue",
                                  background: "#F5F6F9",
                                }}
                                className="bukra-semi-bold"
                              >
                                {index + 1}
                              </Box>
                              {index !== topTeamsData?.data.length - 1 && (
                                <Box
                                  sx={{
                                    width: 2,
                                    height: "45px",
                                    bgcolor: "#008755",
                                  }}
                                />
                              )}
                            </Box>
                          </>
                        ))}
                    </Box>

                    <Box flexGrow={2}>
                      {topTeamsData &&
                        topTeamsData?.data &&
                        topTeamsData?.data?.length > 0 &&
                        topTeamsData?.data.map((data: any, index: any) => (
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
                                bgcolor: "#2f3e76",
                                color: "white",
                                p: 0.6,
                                borderRadius: 2,
                                width: "100%",
                              }}
                            >
                              <Avatar
                                src={data?.performingImage}
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
                                    {data?.title &&
                                    !isEmpty(data?.title.trim()) ? (
                                      data?.title
                                    ) : (
                                      <>&nbsp;</>
                                    )}
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: "12px" }}
                                    className="dubai-regular"
                                  >
                                    Total Win {data.wins}
                                  </Typography>
                                </Box>
                                {/* <Box
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
                                   {data.score}
                                    </Typography>
                                    <Typography
                                      sx={{ fontSize: "12px" }}
                                      className="dubai-regular"
                                    >
                                     {data.name}
                                    </Typography>
                                  </Box>
                                  
                                </Box> */}
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
