"use client";
import React, { useEffect } from "react";
import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import _ from "lodash";
import SubMenuLayout from "../layout";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import AddResults from "@/components/results/add/AddResults";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

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
    if (is4K) return "64vh";
    if (isFullHD) return "74vh";
    if (is3K) return "64vh";
    if (is2K) return "67.5vh";
    if (isLaptopL) return "64vh";
    if (isLaptop) return "64vh";
    if (isTab) return "68vh";
    return "64vh";
  };

  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.ResultAdd)) {
      router.push("/");
    }
  }, [router]);

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamId}/results`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Results",
      route: `/teams/${teamId}/results/add`,
      currentPage: true,
      disabled: false,
    },
  ];

  return (
    <Box sx={{ mt: { xs: 1, sm: 0 } }}>
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Grid container spacing={2} pt={1}>
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
                  Create Result
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
            <AddResults teamId={teamId} seasonId={seasonID} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
AddGoalsTargets.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default AddGoalsTargets;
