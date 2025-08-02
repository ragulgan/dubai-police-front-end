"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import _ from "lodash";
import SubMenuLayout from "../layout";
import CreateIndividualGoal from "../../../../../components/GoalandTargets/CreateIndividualGoal";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { USER_PERMISSION } from "@/utils/constants";
import { checkAccess } from "@/utils/acessscheck";

const AddGoalsTargets = () => {
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const router = useRouter();
  const { seasonID } = router.query;
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "72vh";
    if (isFullHD) return "74vh";
    if (is3K) return "72vh";
    if (is2K) return "67vh";
    if (isLaptopL) return "72vh";
    if (isLaptop) return "72vh";
    if (isTab) return "68vh";
    return "72vh";
  };

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamId}/goalsTargets?currentSeasonID=${seasonID}`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Goals & Targets",
      route: `/teams/${teamId}/goalsTargets?currentSeasonID=${seasonID}`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Create Individual Goals",
      route: `/teams/${teamId}/goalsTargets/addGoalsTargets`,
      currentPage: true,
      disabled: false,
    },
  ];

  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.GoalsTargetsAdd)) {
      router.push("/");
    }
  }, [router]);


  return (
    <>
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Grid container spacing={1} mt={0.2}>
        <Grid item xs={12}>
          <Box className="bg-white" borderRadius={1}>
            <Box p={2}>
              <Box>
                <Typography
                  sx={{
                    fontSize: "16px",
                    lineHeight: "19.2px",
                    textAlign: "left",
                  }}
                  className="bukra-semi-bold"
                >
                  Create Individual Goals
                </Typography>
              </Box>
            </Box>
            <Divider />
          </Box>
          <Box
            className="bg-white"
            borderRadius={1}
            sx={{
              width: "100%",
              height: getPageContentHeight(),
              overflow: "scroll",
            }}
          >
            <CreateIndividualGoal teamId={teamId} seasonId={seasonID} />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
AddGoalsTargets.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default AddGoalsTargets;
