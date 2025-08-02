"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Box, Grid, useMediaQuery } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import SubMenuLayout from "../../layout";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import RegionalChampionshipt from "@/components/tournaments/teamsDepartment/view/regionalChampionship";
import TopScorerCard from "@/components/tournaments/teamsDepartment/view/topScorerCard";
import MedalCounts from "@/components/tournaments/teamsDepartment/view/medals";
import LatestResultCard from "@/components/tournaments/teamsDepartment/view/latestResult";
import CompititivenessCard from "@/components/tournaments/teamsDepartment/view/compititiveness";
import ParticipantsEngagementCard from "@/components/tournaments/teamsDepartment/view/participantsEngage";
import WomenEmpowermentCard from "@/components/tournaments/teamsDepartment/view/womenEmpower";
import SeasonStandingsBarChart from "@/components/tournaments/teamsDepartment/view/seasonStanding";
import PhysicalReadinessCard from "@/components/tournaments/teamsDepartment/view/physicalReady";
import AssistanceMotivationCard from "@/components/tournaments/teamsDepartment/view/assistanceMotivation";
import TopPerformingAthletes from "@/components/tournaments/teamsDepartment/view/topPerforming";
import ParticipantsTableCard from "@/components/tournaments/teamsDepartment/view/paticipantsTable";

function Page() {
  const router = useRouter();
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Dashboard",
      route: `/dashboard`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Internal Races & Tournaments",
      route: `/tournaments`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Commander's Shield",
      route: `/tournaments/commander`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Departments",
      route: `/tournaments/commander/departments/view`,
      currentPage: true,
      disabled: false,
    },
  ];

  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "85.25vh";
    if (isFullHD) return "85.25vh";
    if (is3K) return "85.25vh";
    if (is2K) return "82.25vh";
    if (isLaptopL) return "82.25vh";
    if (isLaptop) return "82.25vh";
    if (isTab) return "82.25vh";
    return "78.25vh";
  };

  return (
    <>
      <Box sx={{ p: 1 }}>
        <Grid container>
          <Grid item xs={12} md={12} sx={{ width: "100%" }}>
            <Box
              p={1.5}
              className="bg-white"
              borderRadius={1}
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <BasicBreadcrumbs routes={breadcrumbRoutes} />
              <CustomButton
                sx={{
                  borderRadius: "28px",
                  backgroundColor: "rgba(0, 135, 85, 0.1)",
                  px: 1.5,
                  py: 0,
                  fontSize: "18px",
                  fontWeight: 500,
                  height: "30px",
                }}
                label="Back"
                variant="outlined"
                size="medium"
                ButtonIcon={BackIcon}
                iconPosition="start"
                onClick={() => router.back()}
              />
            </Box>
          </Grid>

          <Grid item xs={12} md={12}
            sx={{
              height: getPageContentHeight(),
              overflow: "auto",
              mt: 1,
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <RegionalChampionshipt />
              </Grid>
              <Grid item xs={12} md={6}>
                <TopScorerCard />
              </Grid>
              <Grid item xs={12} md={6}>
                <MedalCounts />
              </Grid>
              <Grid item xs={12} md={6}>
                <LatestResultCard />
              </Grid>
              <Grid item xs={12} md={6}>
                <CompititivenessCard />
              </Grid>

              <Grid item xs={12} md={4} lg={3}>
                <ParticipantsEngagementCard />
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <WomenEmpowermentCard />
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <PhysicalReadinessCard />
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <AssistanceMotivationCard />
              </Grid>
              
              <Grid item xs={12} md={9}>
                <SeasonStandingsBarChart />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <ParticipantsTableCard />
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <TopPerformingAthletes />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
export default Page;
