import {
  Alert,
  Avatar,
  Box,
  Card,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { isEmpty } from "lodash";
import React from "react";

export default function TopRanking() {
  
  const allRankingData = {
    loading: false,
    code: 200,
    message: "Success",
    data: [
      { id: 1, title: "Community Happiness", score: 61.5 ,name:"Shield Point"},
      { id: 2, title: "Airport Security", score: 82.4,name:"Shield Point" },
      {
        id: 3,
        title: "Security of agencies, facilities and em...",
        score: 89.9,
        name:"Shield Point"
      },
      { id: 4, title: "Dubai Police Academy", score: 61.0,name:"Shield Point"},
      { id: 5, title: "Extra Unit", score: 55.0,name:"Shield Point" },
        { id: 6, title: "Test Unit", score: 40.0,name:"Shield Point" },
        {
        id: 7,
        title: "Criminal Investigations ",
        score: 74.9,name:"Shield Point"
      },

    ],
  };

  const rankingData = [...allRankingData.data]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  console.log("ranking ", rankingData);
  return (
  

<>
      {allRankingData && allRankingData?.loading && (
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
      <Box p={2} bgcolor="#ffffff" borderRadius={2} height={500} boxShadow={1}>

      {allRankingData && !allRankingData?.loading && (
        <>
          {allRankingData &&
          allRankingData?.data &&
          allRankingData?.data.length === 0 && (
            <Alert className="dubai-med" severity="info">
              No top Ranking records found .
            </Alert>
          )}
        {allRankingData &&
          allRankingData?.data &&
         rankingData.length > 0 && (
             <>
               <Box 
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontSize: "18px" }} variant="subtitle1" fontWeight="bold">
                  Top 5 Rankings
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center",}}>
                 
                        <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexGrow: 0,
                  }}
                >
                  {allRankingData &&
                    allRankingData?.data &&
                    allRankingData?.data?.length > 0 &&
                    rankingData.map((data: any, index: any) => (
              
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
                          {index !== rankingData.length - 1 && (
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
                    {allRankingData &&
                      allRankingData?.data &&
                      allRankingData?.data?.length > 0 &&
                      rankingData.map((data: any, index: any) => (
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
                                   {data.score}
                                    </Typography>
                                    <Typography
                                      sx={{ fontSize: "12px" }}
                                      className="dubai-regular"
                                    >
                                     {data.name}
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
