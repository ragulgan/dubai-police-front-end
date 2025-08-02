import React, { useEffect } from "react";
import {
  Card,
  Grid,
  Typography,
  Box,
  Chip,
  Skeleton,
  Alert,
} from "@mui/material";
import Image from "next/image";
import topAthlete from "../../../../../public/maleHero.png";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { getTopScorer } from "@/redux/slices/dashboard/getTopScorerSlice";
import TopScorerBg from "../../../../../public/dashboard/topScorerBg.png";
import Carousel from "react-material-ui-carousel";
import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { getCurrentDateString } from "@/utils/datetime";

const TopScorerCard: React.FC = () => {
  const router = useRouter();
  const { teamID, seasonID } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const getTopScorerData = useSelector(
    (state: RootState) => state.getTopScorer
  );

  const dispatchGetTopScorer = (teamID: any) => {
    const payload = {
      sportID: teamID ? Number(teamID) : 0,
      seasonID: seasonID ? Number(seasonID) : 0,
    };
    dispatch(getTopScorer({ url: "/GetTopScorer", payload: payload }));
  };

  useEffect(() => {
    if (teamID && seasonID) {
      dispatchGetTopScorer(teamID);
    } else {
      dispatchGetTopScorer("");
    }
  }, [teamID, seasonID]);

  return (
    <>
      {getTopScorerData && getTopScorerData?.loading && (
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
      {getTopScorerData && !getTopScorerData?.loading && (
        <Card
          sx={{
            maxWidth: "100%",
            background: "#005844",
            color: "white",
            borderRadius: 2,
            paddingLeft: "24px",
            paddingRight: "24px",
            paddingTop: "26px",
            paddingBottom: "0px",
            height: "280px",
            position: "relative",
          }}
        >
          {getTopScorerData &&
            getTopScorerData?.code &&
            getTopScorerData?.code === 500 && (
              <Alert className="dubai-med" severity="error">
                Unable to retrieve top scorer records.
              </Alert>
            )}
          {getTopScorerData &&
            getTopScorerData?.data &&
            getTopScorerData?.data.length === 0 && (
              <Alert className="dubai-med" severity="info">
                No top scorer records found for this sport yet.
              </Alert>
            )}
          {getTopScorerData &&
            getTopScorerData?.data &&
            getTopScorerData?.data.length > 0 && (
              <>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${TopScorerBg?.src})`,
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                    opacity: "200%",
                    zIndex: 1,
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    filter: "blur(80px)",
                    borderRadius: "50%",
                    backgroundColor: "#FFE628",
                    zIndex: 1,
                    height: "216px",
                    width: "50%",
                    right: 0,
                    top: "30%",
                  }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    filter: "blur(150px)",
                    borderRadius: "50%",
                    backgroundColor: "#000",
                    zIndex: 1,
                    height: "216px",
                    width: "50%",
                    left: 0,
                    top: "30%",
                  }}
                />
                <Carousel
                  autoPlay={true}
                  interval={3000}
                  animation="fade"
                  indicators={false}
                  navButtonsAlwaysInvisible={false}
                  className="top-scorer-carousel"
                >
                  {getTopScorerData &&
                    getTopScorerData?.data &&
                    getTopScorerData?.data.length > 0 &&
                    getTopScorerData?.data?.map(
                      (topScorer: any, index: any) => (
                        <Box key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Box>
                            <Typography
                              className="bukra-semi-bold"
                              sx={{
                                fontSize: "24px",
                                lineHeight: "31px",
                              }}
                            >
                              Top Scorer in
                              <br /> UAE Police League
                              <br /> {getCurrentDateString("YYYY")}
                            </Typography>
                            <Box mt={2}>
                              <Chip
                                key={topScorer?.sportName}
                                label={topScorer?.sportName}
                                icon={
                                  <img
                                    src={topScorer?.sportProfile}
                                    style={{
                                      width: "20px",
                                      height: "16px",
                                      paddingTop: "4px",
                                      paddingRight: "4px",
                                      filter:
                                        "invert(1) brightness(2) contrast(2)",
                                      objectFit: "cover",
                                    }}
                                    alt={topScorer?.sportName}
                                  />
                                }
                                sx={{
                                  fontSize: "16px",
                                  backgroundColor: "rgba(0, 135, 85, 0.03)",
                                  color: "#FFFFFF",
                                  lineHeight: "18px",
                                  height: "24px",
                                  ".MuiChip-label": {
                                    padding: "8px",
                                  },
                                  border: "1px solid #008755",
                                  width: "fit-content",
                                }}
                                className="dubai-med webkit-line-clamp webkit-1"
                              />
                            </Box>
                            <Typography
                              mt={1}
                              className="bukra text-capitalize"
                              sx={{
                                fontSize: "14px",
                                lineHeight: "31px",
                              }}
                            >
                              {isEmpty(topScorer?.rank.trim()) ? (
                                <>&nbsp;</>
                              ) : (
                                topScorer?.rank
                              )}
                            </Typography>
                            <Typography
                              className="bukra text-capitalize"
                              sx={{
                                fontSize: "16px",
                                lineHeight: "22px",
                              }}
                            >
                              {topScorer?.athleteName}
                            </Typography>
                          </Box>

                          <Box style={{ width: "295px", height: "264px", overflow: "hidden" }}>
                            <Image
                              src={
                                isEmpty(topScorer?.athleteFullImage.trim())
                                  ? topAthlete
                                  : topScorer?.athleteFullImage
                              }
                              alt={"Top Athlete Image"}
                              width={295}
                              height={395}
                            />
                          </Box>
                        </Box>
                      )
                    )}
                </Carousel>
              </>
            )}
        </Card>
      )}
    </>
  );
};

export default TopScorerCard;
