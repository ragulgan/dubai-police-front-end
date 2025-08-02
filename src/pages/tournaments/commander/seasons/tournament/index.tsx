import React from "react";
import SubMenuLayout from "../../layout";
import { Box, Typography } from "@mui/material";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import CustomButton from "@/components/buttons/CustomButton";
import router from "next/router";
import BackIcon from "../../../../../../public/backIcon.svg";
import AddTournaments from "@/components/tournaments/seasonPlanner/addTournaments";

function Page() {
 
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
      title: "Season Planner",
      route: `/tournaments/commander/seasons`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Create Tournament Activity",
      route: `/tournaments/commander/seasons/tournament`,
      currentPage: true,
      disabled: false,
    },
  ];

  return (
    <>
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
      <Box className="bg-white" borderRadius={1} mt={1}>
        <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0 }}
            p={2}
            className="table-list-header bukra header-border-right"
          >
            Create Competition/Tournament
          </Typography>
        </Box>
        <AddTournaments />
        {/* <AddActivity
          type={"competition"} edit={''}         /> */}
      </Box>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
