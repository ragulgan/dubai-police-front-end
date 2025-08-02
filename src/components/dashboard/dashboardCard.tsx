import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import { Box, Skeleton } from "@mui/material";
import TrophyIcon from "../../../public/dashboard/dashboard-trophy.svg";
import UserIcon from "../../../public/dashboard/dashboard-users.svg";
import StaffIcon from "../../../public/dashboard/dashboard-staffs.svg";
import ActivityIcon from "../../../public/dashboard/dashboard-activities.svg";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getDashBoardCounts } from "@/redux/slices/dashboard/getDashBoardCountsSlice";
import CardSection from "./components/cardSection";
import MedalBg from "../../../public/dashboard/medalBg.png";
import SportsBg from "../../../public/dashboard/sportsBg.png";
import CoachBg from "../../../public/dashboard/coachBg.png";
import AttendanceBg from "../../../public/dashboard/attendanceBg.png";

export const DashboardCard = () => {
  const dispatch: AppDispatch = useDispatch();
  const getDashBoardCountsData = useSelector(
    (state: RootState) => state.getDashBoardCounts
  );

  const dispatchGetDashBoardCounts = () => {
    const payload = {
      sportID: 0,
    };
    dispatch(
      getDashBoardCounts({ url: "/GetDashBoardCounts", payload: payload })
    );
  };

  useEffect(() => {
    dispatchGetDashBoardCounts();
  }, []);

  return (
    <>
      {getDashBoardCountsData && getDashBoardCountsData?.loading && (
        <Grid container spacing={2}>
          {Array(4)
            .fill(1)
            .map((card, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                xl={3}
                key={index}
                className="bg-dashboard"
              >
                <Card
                  key={index}
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    boxShadow: "none",
                    borderRadius: "8px",
                    height: "152px",
                  }}
                >
                  <Skeleton
                    data-testid="dashboard-skeleton"
                    variant="circular"
                    width={93}
                    height={93}
                  />
                  <Box pl={3} width={"156px"}>
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "1rem" }}
                      width={"100%"}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "0.5rem" }}
                      width={"80%"}
                    />
                    <Skeleton
                      variant="text"
                      sx={{ fontSize: "0.5rem" }}
                      width={"80%"}
                    />
                  </Box>
                </Card>
              </Grid>
            ))}
        </Grid>
      )}
      {getDashBoardCountsData && !getDashBoardCountsData?.loading && (
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <CardSection
              data={
                getDashBoardCountsData &&
                getDashBoardCountsData?.data &&
                getDashBoardCountsData?.data[0]
              }
              Icon={TrophyIcon}
              leftHead={"Medal"}
              leftContent={"rewardCount"}
              rightHead={"Total Competitions"}
              rightContent={"competitionsCount"}
              bgColor={"#05868E"}
              bgImage={MedalBg}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CardSection
              data={
                getDashBoardCountsData &&
                getDashBoardCountsData?.data &&
                getDashBoardCountsData?.data[0]
              }
              Icon={UserIcon}
              leftHead={"Sports"}
              leftContent={"sportsCount"}
              rightHead={"Athletes"}
              rightContent={"athletesCount"}
              bgColor={"#00205B"}
              bgImage={SportsBg}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CardSection
              data={
                getDashBoardCountsData &&
                getDashBoardCountsData?.data &&
                getDashBoardCountsData?.data[0]
              }
              Icon={StaffIcon}
              leftHead={"Coach"}
              leftContent={"coachCount"}
              rightHead={"Staff"}
              rightContent={"staffCount"}
              bgColor={"#A60A3D"}
              bgImage={CoachBg}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <CardSection
              data={
                getDashBoardCountsData &&
                getDashBoardCountsData?.data &&
                getDashBoardCountsData?.data[0]
              }
              Icon={ActivityIcon}
              leftHead={"Attendance"}
              leftContent={"attendance"}
              rightHead={"Active Training"}
              rightContent={"activeTrainingCount"}
              bgColor={"#008755"}
              bgImage={AttendanceBg}
            />
          </Grid>
        </Grid>
      )}
    </>
  );
};
