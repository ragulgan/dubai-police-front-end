"use client";
import React, { useEffect } from "react";
import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import _ from "lodash";
import SubMenuLayout from "../layout";
import { usePathname } from "next/navigation";
import CreateNutritionForm from "@/components/nutrition/createNutrition";
import { useRouter } from "next/router";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const CreateNutrition = () => {
  const router = useRouter();
  const { id, teamID }: any = router?.query;
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "73vh";
    if (isFullHD) return "74vh";
    if (is3K) return "73vh";
    if (is2K) return "67vh";
    if (isLaptopL) return "73vh";
    if (isLaptop) return "73vh";
    if (isTab) return "69vh";
    return "69vh";
  };

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/nutrition`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Nutrition Templates",
      route: `/teams/${teamID}/nutrition/planTemplate`,
      currentPage: false,
      disabled: false,
    },
    {
      title: id ? "Update Nutrition Template" : "Create Nutrition Template",
      route: `/teams/${teamID}/nutrition/createNutrition`,
      currentPage: true,
      disabled: false,
    },
  ];

  return (
    <>
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Grid container mt={1}>
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
                  {id
                    ? "Update Nutrition Template"
                    : "Create Nutrition Template"}
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
              overflowY: "scroll",
            }}
            p={3}
          >
            <CreateNutritionForm />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};
CreateNutrition.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default CreateNutrition;
