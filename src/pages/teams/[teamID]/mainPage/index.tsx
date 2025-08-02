"use client";
import React, { useEffect } from "react";
import SubMenuLayout from "./layout";
import { Box, Grid, Grow, Typography, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import AddStaff from "../../../../../public/QuickAccess/user-add 1.svg";
import AddAthlete from "../../../../../public/QuickAccess/user.svg";
import AddCompetitions from "../../../../../public/QuickAccess/trophy-star (1).svg";
import AddTrainingCamp from "../../../../../public/QuickAccess/camping.svg";
import AddTrainingPlan from "../../../../../public/QuickAccess/Athlete.svg";
import AddGoalsAndTargets from "../../../../../public/QuickAccess/archery.svg";
import AddEvents from "../../../../../public/QuickAccess/calendar-star (1).svg";
import AddMeetings from "../../../../../public/QuickAccess/videoconference.svg";
import AddReminder from "../../../../../public/QuickAccess/note.svg";
import AddMedical from "../../../../../public/QuickAccess/test.svg";
import AddBudget from "../../../../../public/QuickAccess/budget-alt (1).svg";
import AddRequirements from "../../../../../public/QuickAccess/completed.svg";
import AddFood from "../../../../../public/QuickAccess/salad.svg";
import UpdateResult from "../../../../../public/QuickAccess/ranking-podium.svg";
import AddRewards from "../../../../../public/QuickAccess/medal (1).svg";
import UpdateRace from "../../../../../public/QuickAccess/big-data-analytics.svg";
import UpdateCamp from "../../../../../public/QuickAccess/newspaper 1.svg";
import QuickAccessCard from "@/components/quickAccess/quickAccessCard";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { listSeason } from "@/redux/slices/season/SeasonListSlice";

function Page() {
  const router = useRouter();
  const { teamID } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "79vh";
    if (isFullHD) return "79vh";
    if (is3K) return "79vh";
    if (is2K) return "75vh";
    if (isLaptopL) return "75vh";
    if (isLaptop) return "75vh";
    if (isTab) return "75vh";
    return "75vh";
  };
  const Seasonlist = useSelector((state: RootState) => state.listSeason);

  useEffect(() => {
    if (teamID) {
      const payload = {
        sportID: Number(teamID),
      };
      dispatch(listSeason({ url: "/GetSeasonList", payload }));
    }
  }, [teamID]);

  const quickAccessStaff = [
    {
      name: "Add Staff",
      path: `/teams/${teamID}/staffs/add`,
      icon: AddStaff,
      visible: checkAccess(USER_PERMISSION.StaffAdd),
    },
    {
      name: "Add Athlete",
      path: `/teams/${teamID}/athletes/add`,
      icon: AddAthlete,
      visible: checkAccess(USER_PERMISSION.AthleteAdd),
    },
  ];
  const quickAccessCompetitions = [
    {
      name: "Create Competitions",
      path: `/teams/${teamID}/raceCalendar?create=tournament`,
      icon: AddCompetitions,
      visible: checkAccess(USER_PERMISSION.RaceCalendarAdd),
    },
    {
      name: "Create Training Camp",
      path: `/teams/${teamID}/trainingCamp/add`,
      icon: AddTrainingCamp,
      visible: checkAccess(USER_PERMISSION.TrainingCampAdd),
    },
    {
      name: "Create Training Plan",
      path: `/teams/${teamID}/trainingPlans/add`,
      icon: AddTrainingPlan,
      visible: checkAccess(USER_PERMISSION.TrainingPlanAdd),
    },
    {
      name: "Create Goals & Targets of the Team",
      path: `/teams/${teamID}/goalsTargets/addGoalsTargets?seasonID=${
        Seasonlist && Seasonlist?.data[0] && Seasonlist?.data[0]?.seasonID
      }`,
      icon: AddGoalsAndTargets,
      visible: checkAccess(USER_PERMISSION.GoalsTargetsAdd),
    },
    {
      name: "Create Events",
      path: `/teams/${teamID}/raceCalendar?create=event`,
      icon: AddEvents,
      visible: checkAccess(USER_PERMISSION.RaceCalendarAdd),
    },
    {
      name: "Create Meetings",
      path: `/teams/${teamID}/raceCalendar?create=meeting`,
      icon: AddMeetings,
      visible: checkAccess(USER_PERMISSION.RaceCalendarAdd),
    },
    {
      name: "Create Reminders",
      path: `/teams/${teamID}/raceCalendar?create=remainder`,
      icon: AddReminder,
      visible: checkAccess(USER_PERMISSION.RaceCalendarAdd),
    },
  ];
  const quickAccessHealth = [
    {
      name: "Add Test & Medical Checks",
      path: `/teams/${teamID}/testAndMedicalChecks?module=add`,
      icon: AddMedical,
      visible: checkAccess(USER_PERMISSION.TestMedicalChecksAdd),
    },
    {
      name: "Create Budget",
      path: `/teams/${teamID}/budget/add`,
      icon: AddBudget,
      visible: checkAccess(USER_PERMISSION.BudgetAdd),
    },
    {
      name: "Create Team Requirements",
      path: `/teams/${teamID}/teamRequirements/add`,
      icon: AddRequirements,
      visible: checkAccess(USER_PERMISSION.TeamRequirementsAdd),
    },
    {
      name: "Create Nutrition Plan",
      path: `/teams/${teamID}/nutrition/assignPlan`,
      icon: AddFood,
      visible: checkAccess(USER_PERMISSION.ReportsAdd),
    },
  ];
  const quickAccessResults = [
    {
      name: "Update Results",
      path: `/reports`,
      icon: UpdateResult,
      visible: checkAccess(USER_PERMISSION.ReportsAdd),
    },
    {
      name: "Update Race Reports",
      path: "/reports",
      icon: UpdateRace,
      visible: checkAccess(USER_PERMISSION.ReportsAdd),
    },
    {
      name: "Update Camp Reports",
      path: `/reports`,
      icon: UpdateCamp,
      visible: checkAccess(USER_PERMISSION.ReportsAdd),
    },
    {
      name: "Create Rewards",
      path: `/teams/${teamID}/rewards/add`,
      icon: AddRewards,
      visible: checkAccess(USER_PERMISSION.RewardsAdd),
    },
  ];

  return (
    <>
      <Box
        display={"flex"}
        sx={{
          bgcolor: "#FFFFFF",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
          mt: { xs: 1, sm: 0 },
        }}
      >
        <Typography
          sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
          p={2}
          className="table-list-header bukra-semi-bold header-border-right"
        >
          Quick Access
        </Typography>
        <Typography
          sx={{ flexGrow: 1, width: "auto", minWidth: 0 }}
          p={2}
          className="table-list-header bukra-semi-bold header-border-right"
        />
      </Box>
      <Box
        sx={{
          height: getPageContentHeight(),
          overflowY: "scroll",
          bgcolor: "#FFFFFF",
          px: 2,
          py: 4,
        }}
      >
        {!quickAccessStaff.every((item) => item.visible === false) && (
          <>
            <Box
              className="bukra"
              sx={{
                p: 2,
                border: "1px solid #DEE2ED",
                borderRadius: "4px",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              Staff & Athlete
            </Box>
            <Grid container spacing={2} px={2} py={3} justifyContent={"center"}>
              {quickAccessStaff &&
                quickAccessStaff
                  .filter((item) => !!item.visible)
                  .map((Profile: any, index: any) => {
                    return (
                      <Grow
                        in={true}
                        style={{ transformOrigin: "0 0 0" }}
                        {...(true ? { timeout: 500 + index * 200 } : {})}
                        key={index}
                      >
                        <Grid item key={index}>
                          <QuickAccessCard Profile={Profile} />
                        </Grid>
                      </Grow>
                    );
                  })}
            </Grid>
          </>
        )}
        {!quickAccessCompetitions.every((item) => item.visible === false) && (
          <>
            <Box
              className="bukra"
              sx={{
                p: 2,
                border: "1px solid #DEE2ED",
                borderRadius: "4px",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              Competitions & Events
            </Box>
            <Grid container spacing={2} px={2} py={3} justifyContent={"center"}>
              {quickAccessCompetitions &&
                quickAccessCompetitions
                  .filter((item) => !!item.visible)
                  .map((Profile: any, index: any) => {
                    return (
                      <Grow
                        in={true}
                        style={{ transformOrigin: "0 0 0" }}
                        {...(true ? { timeout: 500 + index * 200 } : {})}
                        key={index}
                      >
                        <Grid item key={index}>
                          <QuickAccessCard Profile={Profile} />
                        </Grid>
                      </Grow>
                    );
                  })}
            </Grid>
          </>
        )}
        {!quickAccessHealth.every((item) => item.visible === false) && (
          <>
            <Box
              className="bukra"
              sx={{
                p: 2,
                border: "1px solid #DEE2ED",
                borderRadius: "4px",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              Health & Resource
            </Box>
            <Grid container spacing={2} px={2} py={3} justifyContent={"center"}>
              {quickAccessHealth &&
                quickAccessHealth
                  .filter((item) => !!item.visible)
                  .map((Profile: any, index: any) => {
                    return (
                      <Grow
                        in={true}
                        style={{ transformOrigin: "0 0 0" }}
                        {...(true ? { timeout: 500 + index * 200 } : {})}
                        key={index}
                      >
                        <Grid item key={index}>
                          <QuickAccessCard Profile={Profile} />
                        </Grid>
                      </Grow>
                    );
                  })}
            </Grid>
          </>
        )}
        {!quickAccessResults.every((item) => item.visible === false) && (
          <>
            <Box
              className="bukra"
              sx={{
                p: 2,
                border: "1px solid #DEE2ED",
                borderRadius: "4px",
                fontSize: "16px",
                textAlign: "center",
              }}
            >
              Results & Reports
            </Box>
            <Grid container spacing={2} px={2} py={3} justifyContent={"center"}>
              {quickAccessResults &&
                quickAccessResults
                  .filter((item) => !!item.visible)
                  .map((Profile: any, index: any) => {
                    return (
                      <Grow
                        in={true}
                        style={{ transformOrigin: "0 0 0" }}
                        {...(true ? { timeout: 500 + index * 200 } : {})}
                        key={index}
                      >
                        <Grid item key={index}>
                          <QuickAccessCard Profile={Profile} />
                        </Grid>
                      </Grow>
                    );
                  })}
            </Grid>
          </>
        )}
      </Box>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
