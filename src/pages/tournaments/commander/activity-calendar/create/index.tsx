"use client";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import SubMenuLayout from "../../layout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddTournaments from "@/components/tournaments/activityCalendar/addTournaments";

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
      title: "Create Activity",
      route: `/tournaments/commander`,
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
          <Typography
            sx={{ flexGrow: 2 }}
            p={2}
            className="table-list-header bukra header-border-right"
          />
        </Box>
        <AddTournaments />
      </Box>
    </>
  );
}
Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
