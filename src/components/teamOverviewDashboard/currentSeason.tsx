import { getTeamOverviewDashBoardCounts } from "@/redux/slices/dashboard/getTeamOverviewCountSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Card,
  Grid,
  Box,
  Typography,
  Avatar,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CountAnimation from "../common/CounterAnimation";
import { listSeason } from "@/redux/slices/season/SeasonListSlice";

interface CurrentSeasonProps {
  phases?: any;
}

const CurrentSeason: React.FC<CurrentSeasonProps> = ({ phases }) => {
  const totalCompetition = "/team-overview/total-competitions.svg";
  const maleAthletes = "/team-overview/male-athletes.svg";
  const totalMedals = "/team-overview/medals.svg";
  const femaleAthletes = "/team-overview/female-athletes.svg";
  const nationalTeamAthletes = "/team-overview/national-team-athletes.svg";
  const cardGraph = useRef<HTMLImageElement>(null);
  const router = useRouter();
  const { teamID } = router.query;
  const [season, setSeason] = useState("");
  const [innerHeight, setInnerHeight] = useState<any>("");
  const dispatch: AppDispatch = useDispatch();
  const getTeamOverviewCountData = useSelector(
    (state: RootState) => state.getTeamOverviewCount
  );
  const Seasonlist = useSelector((state: RootState) => state.listSeason);

  const dispatchGetTeamOverviewCount = (teamID: any, season: any) => {
    const payload = {
      sportID: Number(teamID && teamID),

      seasonID: Number(season && season),
    };
    dispatch(
      getTeamOverviewDashBoardCounts({
        url: "/GetTeamDashBoardCounts",
        payload: payload,
      })
    );
  };

  useEffect(() => {
    if (teamID) {
      const payload = {
        sportID: Number(teamID),
      };
      dispatch(listSeason({ url: "/GetSeasonList", payload }));
    }
  }, [teamID]);

  useEffect(() => {
    if (season && teamID) {
      dispatchGetTeamOverviewCount(teamID, season);
    }
  }, [teamID, season]);

  useEffect(() => {
    setInnerHeight(cardGraph.current?.clientHeight);
  }, [cardGraph]);

  useEffect(() => {
    if (Seasonlist && Seasonlist?.code === 200) {
      setSeason(
        Seasonlist?.data?.length > 0 ? Seasonlist.data[0].seasonID : ""
      );
      router?.push(
        `/teams/${teamID}/teamOverview?seasonID=${
          Seasonlist && Seasonlist?.data[0] && Seasonlist?.data[0]?.seasonID
        }`
      );
    }
  }, [Seasonlist]);

  return (
    <>
      {getTeamOverviewCountData && getTeamOverviewCountData?.loading && (
        <Card
          sx={{
            p: 2,
            boxShadow: "none",
            borderRadius: "8px",
            height: innerHeight && innerHeight,
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={"40%"} />
          <Skeleton variant="text" sx={{ fontSize: "0.5rem" }} width={"30%"} />
          <Skeleton
            variant="rectangular"
            width={"100%"}
            height={"200px"}
            sx={{ mt: 1, borderRadius: "20px" }}
          />
        </Card>
      )}
      {getTeamOverviewCountData &&
        !getTeamOverviewCountData?.loading &&
        Seasonlist &&
        !Seasonlist?.loading && (
          <Card
            sx={{
              width: "100%",
              height: "100%",
              borderRadius: "10px",
              background: "linear-gradient(180deg, #008755 0%, #005844 100%)",
            }}
            ref={cardGraph}
          >
            <Grid container direction="column">
              <Grid item xs={12} sm={6} md={6} p={2} container>
                <Grid item md={8}>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "27px",
                        color: "#FFFFFF",
                        ml: 1,
                      }}
                      className="bukra"
                    >
                      Current Season
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: "fit-content",
                    }}
                    className="bukra"
                  >
                    <Typography
                      sx={{
                        p: 1,
                        fontSize: "16px",
                        color: "#FFFFFF",
                        ml: 1,
                        backgroundColor: "#008755",
                        borderRadius: "8px",
                      }}
                      className="bukra"
                    >
                      {getTeamOverviewCountData &&
                        getTeamOverviewCountData?.data &&
                        getTeamOverviewCountData?.data[0] &&
                        getTeamOverviewCountData?.data[0]?.sportName}
                    </Typography>
                  </Box>
                  <Grid item height="40%" container spacing={2} pl={1} pt={3}>
                    <Grid item md={4}>
                      <Box>
                        <Typography
                          sx={{
                            color: "#FFFFFF",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Avatar
                              src={totalCompetition}
                              alt={"Total Competition"}
                              sx={{
                                width: "64px",
                                height: "64px",
                                radius: "200px",
                              }}
                              variant="square"
                            />
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="left"
                              width="38px"
                              height="26px"
                              gap="16px"
                            >
                              <Typography
                                className="bukra-semi-bold"
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "32px",
                                  lineHeight: "0px",
                                  pb: "10px",
                                }}
                              >
                                <CountAnimation
                                  value={Number(
                                    getTeamOverviewCountData &&
                                      getTeamOverviewCountData?.data &&
                                      getTeamOverviewCountData?.data[0] &&
                                      getTeamOverviewCountData?.data[0]
                                        ?.totalCompetition
                                  )}
                                />
                              </Typography>
                              <Typography
                                className="dubai-regular"
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "16px",
                                  lineHeight: "12px",
                                }}
                              >
                                Total Competition
                              </Typography>
                            </Box>
                          </Box>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={4}>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "27px",
                            color: "#FFFFFF",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Avatar
                              src={maleAthletes}
                              alt={"Male Athletes"}
                              sx={{
                                width: "64px",
                                height: "64px",
                                radius: "200px",
                              }}
                              variant="square"
                            />
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="left"
                              width="38px"
                              height="26px"
                              gap="16px"
                            >
                              <Typography
                                className="bukra-semi-bold"
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "32px",
                                  lineHeight: "0px",
                                  pb: "10px",
                                }}
                              >
                                <CountAnimation
                                  value={Number(
                                    getTeamOverviewCountData &&
                                      getTeamOverviewCountData?.data &&
                                      getTeamOverviewCountData?.data[0] &&
                                      getTeamOverviewCountData?.data[0]
                                        ?.maleAthletes
                                  )}
                                />
                              </Typography>
                              <Typography
                                className="dubai-regular"
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "16px",
                                  lineHeight: "12px",
                                }}
                              >
                                Male Athletes
                              </Typography>
                            </Box>
                          </Box>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={4}></Grid>
                  </Grid>

                  <Grid item height="50%" container spacing={2} pt={2} pl={1}>
                    <Grid item md={4}>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "27px",
                            color: "#FFFFFF",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Avatar
                              src={totalMedals}
                              alt={"Total Medals"}
                              sx={{
                                width: "64px",
                                height: "64px",
                                radius: "200px",
                              }}
                              variant="square"
                            />
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="left"
                              width="38px"
                              height="26px"
                              gap="16px"
                            >
                              <Typography
                                className="bukra-semi-bold"
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "32px",
                                  lineHeight: "0px",
                                  pb: "10px",
                                }}
                              >
                                <CountAnimation
                                  value={Number(
                                    getTeamOverviewCountData &&
                                      getTeamOverviewCountData?.data &&
                                      getTeamOverviewCountData?.data[0] &&
                                      getTeamOverviewCountData?.data[0]
                                        ?.totalMedal
                                  )}
                                />
                              </Typography>
                              <Typography
                                className="dubai-regular"
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "16px",
                                  lineHeight: "12px",
                                }}
                              >
                                Total Medals
                              </Typography>
                            </Box>
                          </Box>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={4}>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "27px",
                            color: "#FFFFFF",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Avatar
                              src={femaleAthletes}
                              alt={"Female Athletes"}
                              sx={{
                                width: "64px",
                                height: "64px",
                                radius: "200px",
                              }}
                              variant="square"
                            />
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="left"
                              width="38px"
                              height="26px"
                              gap="16px"
                            >
                              <Typography
                                className="bukra-semi-bold"
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "32px",
                                  lineHeight: "0px",
                                  pb: "10px",
                                }}
                              >
                                <CountAnimation
                                  value={Number(
                                    getTeamOverviewCountData &&
                                      getTeamOverviewCountData?.data &&
                                      getTeamOverviewCountData?.data[0] &&
                                      getTeamOverviewCountData?.data[0]
                                        ?.femaleAthletes
                                  )}
                                />
                              </Typography>
                              <Typography
                                className="dubai-regular"
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "16px",
                                  lineHeight: "12px",
                                }}
                              >
                                Female Athletes
                              </Typography>
                            </Box>
                          </Box>
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item md={4}>
                      <Box>
                        <Typography
                          sx={{
                            fontSize: "27px",
                            color: "#FFFFFF",
                          }}
                          className="bukra"
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <Avatar
                              src={nationalTeamAthletes}
                              alt={"National Team Athletes"}
                              sx={{
                                width: "64px",
                                height: "64px",
                                radius: "200px",
                              }}
                              variant="square"
                            />
                            <Box
                              display="flex"
                              flexDirection="column"
                              alignItems="left"
                              width="38px"
                              height="26px"
                              gap="16px"
                            >
                              <Typography
                                className="bukra-semi-bold"
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "32px",
                                  lineHeight: "0px",
                                  pb: "10px",
                                }}
                              >
                                <CountAnimation
                                  value={Number(
                                    getTeamOverviewCountData &&
                                      getTeamOverviewCountData?.data &&
                                      getTeamOverviewCountData?.data[0] &&
                                      getTeamOverviewCountData?.data[0]
                                        ?.nationalTeamAthletes
                                  )}
                                />
                              </Typography>
                              <Typography
                                className="dubai-regular"
                                sx={{
                                  color: "#FFFFFF",
                                  fontSize: "16px",
                                  lineHeight: "12px",
                                }}
                              >
                                National Team Athletes
                              </Typography>
                            </Box>
                          </Box>
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item md={4}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 2,
                      justifyContent: "flex-end",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-end",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Select
                          value={season}
                          onChange={(e) => {
                            setSeason(e.target.value);
                            router?.push(
                              `/teams/${teamID}/teamOverview?seasonID=${e.target.value}`
                            );
                          }}
                          variant="outlined"
                          sx={{
                            bgcolor: "white",
                            borderRadius: 2,
                            color: "#008755",
                            width: "214px",
                            height: "39px",
                          }}
                          className="dubai-med"
                        >
                          {Seasonlist &&
                            Seasonlist?.data &&
                            Seasonlist?.data.length > 0 &&
                            Seasonlist?.data.map((season: any) => (
                              <MenuItem
                                value={season?.seasonID}
                                className="dubai-med"
                                sx={{
                                  color: "#008755",
                                  fontSize: "16px",
                                  lineHeight: "27.01px",
                                }}
                              >
                                {season?.seasonName}
                              </MenuItem>
                            ))}
                        </Select>
                      </Box>
                      <Box>
                        <Card
                          sx={
                            getTeamOverviewCountData &&
                            getTeamOverviewCountData?.data &&
                            getTeamOverviewCountData?.data[0] &&
                            getTeamOverviewCountData?.data[0]?.currentSeason ===
                              "preSeasons"
                              ? {
                                  bgcolor: "white",
                                  borderRadius: 2,
                                  color: "#008755",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "flex-end",
                                  width: "214px",
                                  padding: "10px",
                                }
                              : {
                                  bgcolor: "#008755",
                                  borderRadius: 1,
                                  padding: "10px",
                                  width: "214px",
                                  height: "33px",
                                  boxShadow: "none",
                                }
                          }
                        >
                          {getTeamOverviewCountData &&
                            getTeamOverviewCountData?.data &&
                            getTeamOverviewCountData?.data[0] &&
                            getTeamOverviewCountData?.data[0]?.currentSeason ===
                              "preSeasons" && (
                              <Typography
                                className="dubai-regular"
                                sx={{
                                  color: "#008755",
                                  lineHeight: "20.8px",
                                  fontSize: "16px",
                                }}
                              >
                                Current Phase:
                              </Typography>
                            )}
                          <Typography
                            className="dubai-bold"
                            sx={{
                              color:
                                getTeamOverviewCountData &&
                                getTeamOverviewCountData?.data &&
                                getTeamOverviewCountData?.data[0] &&
                                getTeamOverviewCountData?.data[0]
                                  ?.currentSeason === "preSeasons"
                                  ? "#008755"
                                  : "#FFFFFF",
                              lineHeight: "20.8px",
                              fontSize: "14px",
                            }}
                          >
                            Pre-Season (
                            {`${
                              getTeamOverviewCountData &&
                              getTeamOverviewCountData?.data &&
                              getTeamOverviewCountData?.data[0] &&
                              getTeamOverviewCountData?.data[0]?.preSeasons
                            }`}
                            )
                          </Typography>
                        </Card>
                      </Box>
                      <Box>
                        <Card
                          sx={
                            getTeamOverviewCountData &&
                            getTeamOverviewCountData?.data &&
                            getTeamOverviewCountData?.data[0] &&
                            getTeamOverviewCountData?.data[0]?.currentSeason ===
                              "inSeasons"
                              ? {
                                  bgcolor: "white",
                                  borderRadius: 2,
                                  color: "#008755",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "flex-end",
                                  width: "214px",
                                  padding: "10px",
                                }
                              : {
                                  bgcolor: "#008755",
                                  borderRadius: 1,
                                  padding: "10px",
                                  width: "214px",
                                  height: "33px",
                                  boxShadow: "none",
                                }
                          }
                        >
                          {getTeamOverviewCountData &&
                            getTeamOverviewCountData?.data &&
                            getTeamOverviewCountData?.data[0] &&
                            getTeamOverviewCountData?.data[0]?.currentSeason ===
                              "inSeasons" && (
                              <Typography
                                className="dubai-regular"
                                sx={{
                                  color: "#008755",
                                  lineHeight: "20.8px",
                                  fontSize: "16px",
                                }}
                              >
                                Current Phase:
                              </Typography>
                            )}
                          <Typography
                            className="dubai-bold"
                            sx={{
                              color:
                                getTeamOverviewCountData &&
                                getTeamOverviewCountData?.data &&
                                getTeamOverviewCountData?.data[0] &&
                                getTeamOverviewCountData?.data[0]
                                  ?.currentSeason === "inSeasons"
                                  ? "#008755"
                                  : "#FFFFFF",
                              lineHeight: "15.8px",
                              fontSize: "14px",
                            }}
                          >
                            In-Season (
                            {`${
                              getTeamOverviewCountData &&
                              getTeamOverviewCountData?.data &&
                              getTeamOverviewCountData?.data[0] &&
                              getTeamOverviewCountData?.data[0]?.inSeasons
                            }`}
                            )
                          </Typography>
                        </Card>
                      </Box>
                      <Box>
                        <Card
                          sx={
                            getTeamOverviewCountData &&
                            getTeamOverviewCountData?.data &&
                            getTeamOverviewCountData?.data[0] &&
                            getTeamOverviewCountData?.data[0]?.currentSeason ===
                              "offSeasons"
                              ? {
                                  bgcolor: "white",
                                  borderRadius: 2,
                                  color: "#008755",
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "flex-end",
                                  width: "214px",
                                  padding: "10px",
                                }
                              : {
                                  bgcolor: "#008755",
                                  borderRadius: 1,
                                  padding: "10px",
                                  width: "214px",
                                  height: "33px",
                                  boxShadow: "none",
                                }
                          }
                        >
                          {getTeamOverviewCountData &&
                            getTeamOverviewCountData?.data &&
                            getTeamOverviewCountData?.data[0] &&
                            getTeamOverviewCountData?.data[0]?.currentSeason ===
                              "offSeasons" && (
                              <Typography
                                className="dubai-regular"
                                sx={{
                                  lineHeight: "20.8px",
                                  fontSize: "16px",
                                  color: "#008755",
                                }}
                              >
                                Current Phase:
                              </Typography>
                            )}
                          <Typography
                            className="dubai-bold"
                            sx={{
                              color:
                                getTeamOverviewCountData &&
                                getTeamOverviewCountData?.data &&
                                getTeamOverviewCountData?.data[0] &&
                                getTeamOverviewCountData?.data[0]
                                  ?.currentSeason === "offSeasons"
                                  ? "#008755"
                                  : "#FFFFFF",
                              lineHeight: "15.8px",
                              fontSize: "14px",
                            }}
                          >
                            Off-Season (
                            {`${
                              getTeamOverviewCountData &&
                              getTeamOverviewCountData?.data &&
                              getTeamOverviewCountData?.data[0] &&
                              getTeamOverviewCountData?.data[0]?.offSeasons
                            }`}
                            )
                          </Typography>
                        </Card>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        position: "relative",
                        height: "100px",
                        width: "2px",
                        backgroundColor: "white",
                        marginBottom: "18px",
                      }}
                    >
                      <Box
                        sx={{
                          width: "15px",
                          height: "15px",
                          borderRadius: "50%",
                          border: "2px solid white",
                          backgroundColor:
                            getTeamOverviewCountData &&
                            getTeamOverviewCountData?.data &&
                            getTeamOverviewCountData?.data[0] &&
                            getTeamOverviewCountData?.data[0]?.currentSeason ===
                              "offSeasons"
                              ? "#FFFFFF"
                              : "#006c48",
                          position: "absolute",
                          bottom: "-10px",
                          left: "50%",
                          transform: "translateX(-50%)",
                        }}
                      />
                      <Box
                        sx={{
                          width: "15px",
                          height: "15px",
                          borderRadius: "50%",
                          border: "2px solid white",
                          position: "absolute",
                          bottom: "50%",
                          left: "50%",
                          transform: "translate(-50%, 50%)",
                          backgroundColor:
                            getTeamOverviewCountData &&
                            getTeamOverviewCountData?.data &&
                            getTeamOverviewCountData?.data[0] &&
                            getTeamOverviewCountData?.data[0]?.currentSeason ===
                              "inSeasons"
                              ? "#FFFFFF"
                              : "#006c48",
                        }}
                      />
                      <Box
                        sx={{
                          width: "15px",
                          height: "15px",
                          borderRadius: "50%",
                          border: "2px solid white",
                          position: "absolute",
                          top: "-15px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor:
                            getTeamOverviewCountData &&
                            getTeamOverviewCountData?.data &&
                            getTeamOverviewCountData?.data[0] &&
                            getTeamOverviewCountData?.data[0]?.currentSeason ===
                              "preSeasons"
                              ? "#FFFFFF"
                              : "#006c48",
                        }}
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        )}
    </>
  );
};

export default CurrentSeason;
