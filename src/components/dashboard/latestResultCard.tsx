import { getLatestResult } from "@/redux/slices/dashboard/getLatestResultSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Skeleton,
  Alert,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CompetitionResultCard from "./components/competitionResultCard";
import Link from "next/link";
import ArrowOutwardOutlinedIcon from "@mui/icons-material/ArrowOutwardOutlined";
import { useRouter } from "next/router";

const LatestResultCard: React.FC = ({}) => {
  const router = useRouter();
  const { teamID, seasonID } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const getLatestResultData = useSelector(
    (state: RootState) => state.getLatestResult
  );

  const dispatchLatestResultData = (teamID: any, seasonID: any) => {
    const payload = {
      sportID: teamID ? Number(teamID) : 0,
      
      seasonID: seasonID ? Number(seasonID) : 0,
    };
    dispatch(getLatestResult({ url: "/GetLatestResult", payload: payload }));
  };

  useEffect(() => {
    if (teamID && seasonID) {
      dispatchLatestResultData(teamID, seasonID);
    } else {
      dispatchLatestResultData("", "");
    }
  }, [teamID, seasonID]);

  return (
    <>
      {getLatestResultData && getLatestResultData?.loading && (
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
      {getLatestResultData && !getLatestResultData?.loading && (
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
          {getLatestResultData &&
            getLatestResultData?.code &&
            getLatestResultData?.code === 500 && (
              <Alert className="dubai-med" severity="error" sx={{ mb: 3 }}>
                Unable to retrieve latest result records.
              </Alert>
            )}
          {getLatestResultData &&
            getLatestResultData?.data &&
            getLatestResultData?.data.length === 0 && (
              <Alert className="dubai-med" severity="info" sx={{ mb: 3 }}>
                No latest result records found for this sport yet.
              </Alert>
            )}
          {getLatestResultData &&
            getLatestResultData?.data &&
            getLatestResultData?.data.length > 0 && (
              <CardContent sx={{ p: 0 }}>
                <Grid item md={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 2,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "18px",
                      }}
                      className="bukra"
                    >
                      Latest Results
                    </Typography>
                    <Link
                      href={
                        teamID ? `/teams/${teamID}/results` : "/latest-results"
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
                    {getLatestResultData &&
                      getLatestResultData?.data &&
                      getLatestResultData?.data?.length > 0 &&
                      getLatestResultData?.data
                        ?.slice(0, 4)
                        .map((result: any, index: any) => (
                          <Grid item md={teamID ? 12 : 6} key={index}>
                            <CompetitionResultCard
                              data={result}
                              module={"result"}
                            />
                          </Grid>
                        ))}
                  </Grid>
                </Grid>
              </CardContent>
            )}
        </Card>
      )}
    </>
  );
};

export default LatestResultCard;
