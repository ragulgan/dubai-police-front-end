import { getTopPerformingAthlete } from "@/redux/slices/dashboard/getTopPerformingAthlete";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Alert,
  Avatar,
  Box,
  Card,
  Dialog,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CountAnimation from "../common/CounterAnimation";
import { useRouter } from "next/router";
import AthleteViewMorePage from "./TopAthleteViewMore";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import { isEmpty } from "lodash";

const TopPerformingAthletes: React.FC = () => {
  const router = useRouter();
  const { teamID, seasonID } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const handleOpenAthlete = () => setOpen(true);
  const handleCloseAthlete = () => setOpen(false);
  const getTopPerformingAthleteData = useSelector(
    (state: RootState) => state.getTopPerformingAthlete
  );

  useEffect(() => {
    if (teamID && seasonID) {
      dispatchGetTopPerformingAthlete(teamID, seasonID);
    } else {
      dispatchGetTopPerformingAthlete("", "");
    }
  }, [teamID, seasonID]);

  const dispatchGetTopPerformingAthlete = (teamID: any, seasonID: any) => {
    const payload = {
      sportID: teamID ? Number(teamID) : 0,
      seasonID: seasonID ? Number(seasonID) : 0,

      startYear: "",
      endYear: "",
    };
    dispatch(
      getTopPerformingAthlete({
        url: "/GetPerformanceAthlete",
        payload: payload,
      })
    );
  };

  return (
    <>
      {getTopPerformingAthleteData && getTopPerformingAthleteData?.loading && (
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
      {getTopPerformingAthleteData && !getTopPerformingAthleteData?.loading && (
        <>
          {getTopPerformingAthleteData &&
            getTopPerformingAthleteData?.code &&
            getTopPerformingAthleteData?.code === 500 && (
              <Alert className="dubai-med" severity="error">
                Unable to retrieve top performing athlete records.
              </Alert>
            )}
          {getTopPerformingAthleteData &&
            getTopPerformingAthleteData?.data &&
            getTopPerformingAthleteData?.data.length === 0 && (
              <Alert className="dubai-med" severity="info">
                No top performing athlete records found for this sport yet.
              </Alert>
            )}
          {getTopPerformingAthleteData &&
            getTopPerformingAthleteData?.data &&
            getTopPerformingAthleteData?.data.length > 0 && (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "18px" }} className="bukra">
                    Top Performing Athletes
                  </Typography>
                  <Box
                    style={{
                      fontSize: "18px",
                      color: "#58585B",
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "flex",
                    }}
                    className="dubai-regular"
                    onClick={handleOpenAthlete}
                  >
                    More
                    <ArrowOutwardOutlinedIcon />
                  </Box>
                </Box>
                <Box sx={{ maxWidth: 420 }}>
                  <Dialog open={open} onClose={handleCloseAthlete} fullWidth>
                    <AthleteViewMorePage
                      onClose={handleCloseAthlete}
                      getTopPerformingAthleteData={getTopPerformingAthleteData}
                      teamID={teamID}
                    />
                  </Dialog>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", pb: 1.75 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexGrow: 0,
                    }}
                  >
                    {getTopPerformingAthleteData &&
                      getTopPerformingAthleteData?.data &&
                      getTopPerformingAthleteData?.data?.length > 0 &&
                      getTopPerformingAthleteData?.data
                        ?.slice(
                          0,
                          getTopPerformingAthleteData &&
                            getTopPerformingAthleteData?.data &&
                            getTopPerformingAthleteData?.data?.length > 3
                            ? 3
                            : getTopPerformingAthleteData &&
                                getTopPerformingAthleteData?.data &&
                                getTopPerformingAthleteData?.data?.length
                        )
                        .map((data: any, index: any) => (
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
                                  height: "55px",
                                  bgcolor: "#008755",
                                }}
                              />
                            )}
                          </Box>
                        ))}
                  </Box>
                  {/* Cards for Athletes */}
                  <Box flexGrow={2}>
                    {getTopPerformingAthleteData &&
                      getTopPerformingAthleteData?.data &&
                      getTopPerformingAthleteData?.data?.length > 0 &&
                      getTopPerformingAthleteData?.data
                        ?.slice(
                          0,
                          getTopPerformingAthleteData &&
                            getTopPerformingAthleteData?.data &&
                            getTopPerformingAthleteData?.data?.length > 3
                            ? 3
                            : getTopPerformingAthleteData &&
                                getTopPerformingAthleteData?.data &&
                                getTopPerformingAthleteData?.data?.length
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
                                bgcolor: "#008755",
                                marginBottom: "12px",
                                marginTop: "17px",
                              }}
                            />

                            {/* Athlete Card */}
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
                                    sx={{ fontSize: "16px" }}
                                    className="dubai-bold text-capitalize"
                                  >
                                    {athlete?.athleteName &&
                                    !isEmpty(athlete?.athleteName.trim()) ? (
                                      athlete?.athleteName
                                    ) : (
                                      <>&nbsp;</>
                                    )}
                                  </Typography>
                                  {!teamID && (
                                    <Typography
                                      sx={{ fontSize: "12px" }}
                                      className="dubai-regular text-capitalize"
                                    >
                                      {athlete?.sportName &&
                                      !isEmpty(athlete?.sportName.trim()) ? (
                                        athlete?.sportName
                                      ) : (
                                        <>&nbsp;</>
                                      )}
                                    </Typography>
                                  )}
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
                                        value={Number(athlete?.totalMedals)}
                                      />
                                    </Typography>
                                    <Typography
                                      sx={{ fontSize: "12px" }}
                                      className="dubai-regular"
                                    >
                                      Medal
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
                                      <CountAnimation
                                        value={Number(athlete?.totalScore)}
                                      />
                                    </Typography>
                                    <Typography
                                      sx={{ fontSize: "12px" }}
                                      className="dubai-regular"
                                    >
                                      Overall Score
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

export default TopPerformingAthletes;
