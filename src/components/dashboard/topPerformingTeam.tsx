import { getTopPerformingSports } from "@/redux/slices/dashboard/getTopPerformingSportsSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Skeleton,
  Alert,
  Dialog,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CountAnimation from "../common/CounterAnimation";
import SportViewMorePage from "./TopSportViewMore";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";

interface TopPerformingTeamProps {
  data?: any;
}

const TopPerformingTeam: React.FC<TopPerformingTeamProps> = ({ data }) => {
  const dispatch: AppDispatch = useDispatch();
  //Top performing Sport
  const [open, setOpen] = useState(false);
  const handleOpenSport = () => setOpen(true);
  const handleCloseSport = () => setOpen(false);

  const getTopPerformingSportsData = useSelector(
    (state: RootState) => state.getTopPerformingSports
  );

  useEffect(() => {
    dispatchGetTopPerformingSports();
  }, []);

  const dispatchGetTopPerformingSports = () => {
    const payload = {
      sportID: 0,
    };
    dispatch(
      getTopPerformingSports({
        url: "/GetTopPerformingSports",
        payload: payload,
      })
    );
  };

  return (
    <>
      {getTopPerformingSportsData && getTopPerformingSportsData?.loading && (
        <Card
          sx={{
            p: 2,
            boxShadow: "none",
            borderRadius: "8px",
            height: "280px",
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
      {getTopPerformingSportsData && !getTopPerformingSportsData?.loading && (
        <>
          {getTopPerformingSportsData &&
            getTopPerformingSportsData?.code &&
            getTopPerformingSportsData?.code === 500 && (
              <Alert className="dubai-med" severity="error">
                Unable to retrieve top performing sports records.
              </Alert>
            )}
          {getTopPerformingSportsData &&
            getTopPerformingSportsData?.data &&
            getTopPerformingSportsData?.data.length > 0 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "18px" }} className="bukra">
                    Top Performing Sports
                  </Typography>
                  <Box
                    onClick={handleOpenSport}
                    style={{
                      fontSize: "18px",
                      color: "#58585B",
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "flex",
                    }}
                    className="dubai-regular"
                  >
                    More
                    <ArrowOutwardOutlinedIcon />
                  </Box>
                </Box>
                <Box sx={{ maxWidth: 420 }}>
                  <Dialog open={open} onClose={handleCloseSport} fullWidth>
                    <SportViewMorePage
                      onClose={handleCloseSport}
                      getTopPerformingSportsData={getTopPerformingSportsData}
                    />
                  </Dialog>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                    flexGrow={0}
                  >
                    {getTopPerformingSportsData &&
                      getTopPerformingSportsData?.data &&
                      getTopPerformingSportsData?.data?.length > 0 &&
                      getTopPerformingSportsData?.data
                        ?.slice(
                          0,
                          getTopPerformingSportsData &&
                            getTopPerformingSportsData?.data &&
                            getTopPerformingSportsData?.data?.length > 3
                            ? 3
                            : getTopPerformingSportsData &&
                                getTopPerformingSportsData?.data &&
                                getTopPerformingSportsData?.data?.length
                        )
                        .map((_: any, index: any) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
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
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#00205B",
                                background: "white",
                              }}
                              className="bukra-semi-bold"
                            >
                              {index + 1}
                            </Box>
                            {index !== 2 && (
                              <Box
                                sx={{
                                  width: 2,
                                  height: "50px",
                                  bgcolor: "#00205B",
                                }}
                              />
                            )}
                          </Box>
                        ))}
                  </Box>

                  <Box flexGrow={2}>
                    {getTopPerformingSportsData &&
                      getTopPerformingSportsData?.data &&
                      getTopPerformingSportsData?.data?.length > 0 &&
                      getTopPerformingSportsData?.data
                        ?.slice(
                          0,
                          getTopPerformingSportsData &&
                            getTopPerformingSportsData?.data &&
                            getTopPerformingSportsData?.data?.length > 3
                            ? 3
                            : getTopPerformingSportsData &&
                                getTopPerformingSportsData?.data &&
                                getTopPerformingSportsData?.data?.length
                        )
                        .map((athlete: any, index: any) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              marginBottom: "25px",
                              marginTop: "18px",
                            }}
                          >
                            {/* Horizontal Line Connector */}
                            <Box
                              sx={{
                                width: 60,
                                height: 2,
                                bgcolor: "#00205B",
                                marginBottom: "12px",
                                marginTop: "17px",
                              }}
                            />

                            <Card
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                bgcolor: "#00205B",
                                color: "white",
                                p: 1.1,
                                borderRadius: 2,
                                width: "100%",
                              }}
                            >
                              <Avatar
                                src={athlete?.athleteImage}
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
                                    sx={{ fontSize: "16px", width: "200px" }}
                                    className="dubai-bold text-capitalize webkit-line-clamp webkit-1"
                                  >
                                    {athlete?.teamName}
                                  </Typography>
                                  <Typography
                                    sx={{ fontSize: "12px" }}
                                    className="dubai-regular text-capitalize"
                                  >
                                    {athlete?.sportName}
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
                                      <CountAnimation
                                        value={Number(athlete?.totalWins)}
                                      />
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        whiteSpace: "nowrap",
                                      }}
                                      className="dubai-regular"
                                    >
                                      Total Wins
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
    </>
  );
};

export default TopPerformingTeam;
