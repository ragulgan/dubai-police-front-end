"use client";
import React, { useEffect, useState } from "react";
import { Box, Divider, Grid, Stack, Typography } from "@mui/material";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import _ from "lodash";
import SubMenuLayout from "../layout";
import CreateTournaments from "./CreateTournaments";
import { usePathname } from "next/navigation";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";

const Tournaments = () => {
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Internal Races & Tournaments",
      route: `/Internal Races & Tournaments`,
      currentPage: false,
      disabled: false
    },
    {
      title: "Create Tournament",
      route: `/tournaments/createTournaments`,
      currentPage: true,
      disabled: false
    },
  ];

  return (
    <>
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Grid container spacing={2} mt={0.2}>
        <Grid item xs={12}>
          <Box className="bg-white" borderRadius={1}>
            <Box p={2}>
              <Box>
                <Typography
                  sx={{
                    fontSize: "18px",
                    lineHeight: "19.2px",
                    textAlign: "left",
                  }}
                  className="bukra-semi-bold"
                >
                  Create Tournament
                </Typography>
              </Box>
            </Box>
            <Divider />
          </Box>
          <Box className="bg-white" borderRadius={1}>
            <CreateTournaments teamId={teamId} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
Tournaments.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Tournaments;
