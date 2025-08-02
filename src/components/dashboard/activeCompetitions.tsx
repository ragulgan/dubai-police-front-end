import { AppDispatch, RootState } from "@/redux/store";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Chip,
  Skeleton,
  Alert,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CompetitionResultCard from "./components/competitionResultCard";
import Link from "next/link";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import { keyframes } from "@mui/system";
import { useRouter } from "next/router";
import { getActiveCompetitionList } from "@/redux/slices/dashboard/getActiveCompetitionListSlice";

const ActiveCompetitions: React.FC = () => {
  const router = useRouter();
  const { teamID, seasonID } = router.query;
  const waveAnimation = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(228, 0, 43, 0.7);
  }
  50% {
    box-shadow: 0 0 10px 10px rgba(228, 0, 43, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(228, 0, 43, 0);
  }
`;
  const dispatch: AppDispatch = useDispatch();
  const getCompetitionListData = useSelector(
    (state: RootState) => state.getActiveCompetitionList
  );
  const dispatchGetCompetitionList = (teamID: any, seasonID: any) => {
    const payload = {
      sportID: teamID ? Number(teamID) : 0,
      seasonID: seasonID ? Number(seasonID) : 0,
      startYear: "",
      endYear: "",
      section: "Active",
      
    };
    dispatch(
      getActiveCompetitionList({ url: "/GetCompetitionList", payload: payload })
    );
  };

  useEffect(() => {
    if (teamID && seasonID) {
      dispatchGetCompetitionList(teamID, seasonID);
    } else {
      dispatchGetCompetitionList("", "");
    }
  }, [teamID, seasonID]);

  return (
    <>
      {getCompetitionListData && getCompetitionListData?.loading && (
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
      {getCompetitionListData && !getCompetitionListData?.loading && (
        <Card
          sx={{
            maxWidth: "100%",
            background: "#FFFFFF",
            color: "black",
            borderRadius: 2,
            boxShadow: "none",
            paddingTop: "24px",
            paddingRight: "24px",
            paddingLeft: "24px",
          }}
        >
          {getCompetitionListData &&
            getCompetitionListData?.code &&
            getCompetitionListData?.code === 500 && (
              <Alert className="dubai-med" severity="error">
                Unable to retrieve active competition list records.
              </Alert>
            )}
          {getCompetitionListData &&
            getCompetitionListData?.data &&
            getCompetitionListData?.data.length === 0 && (
              <Alert className="dubai-med" severity="info" sx={{ mb: 3 }}>
                No active competition list records found for this sport yet.
              </Alert>
            )}
          {getCompetitionListData &&
            getCompetitionListData?.data &&
            getCompetitionListData?.data.length > 0 && (
              <CardContent
                sx={{
                  p: 0,
                }}
              >
                <Grid item md={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "18px",
                      }}
                      className="bukra"
                    >
                      Active Competitions
                      <Chip
                        label={"Live"}
                        sx={{
                          backgroundColor: "#E4002B",
                          color: "#FFFFFF",
                          height: "20px",
                          border: "1px solid #E4002B",
                          borderRadius: "24px",
                          ".MuiChip-label": {
                            fontSize: "16px",
                            lineHeight: "18px",
                            textAlign: "left",
                          },
                          width: "fit-content",
                          ml: 2,
                          animation: `${waveAnimation} 2.5s infinite ease-in-out`,
                        }}
                        className="dubai-med"
                      />
                    </Typography>
                    <Link
                      href={
                        teamID
                          ? `/teams/${teamID}/raceCalendar`
                          : "/competition-calendar"
                      }
                      style={{
                        fontSize: "18px",
                        color: "#58585B",
                        cursor: "pointer",
                        textDecoration: "none",
                        display: "flex",
                      }}
                      className="dubai-regular"
                    >
                      More <ArrowOutwardOutlinedIcon />
                    </Link>
                  </Box>
                  <Grid container spacing={1}>
                    {Array.isArray(getCompetitionListData?.data)
                      ? getCompetitionListData.data
                          .slice(0, teamID ? 1 : 2)
                          .map((sport: any, index: any) => (
                            <Grid item md={teamID ? 12 : 6} key={index}>
                              <CompetitionResultCard
                                data={sport}
                                module="active"
                                cursor="false"
                              />
                            </Grid>
                          ))
                      : null}
                  </Grid>
                </Grid>
              </CardContent>
            )}
        </Card>
      )}
    </>
  );
};

export default ActiveCompetitions;
