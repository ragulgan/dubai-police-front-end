"use client";
import React from "react";
import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import _ from "lodash";
import CreateNutritionForm from "@/components/nutrition/createNutrition";
import CustomButton from "@/components/buttons/CustomButton";
import { useRouter } from "next/router";
import BackIcon from "../../../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";

const PlanTemplateViewNutrition = () => {
  const router = useRouter();
  const { id } = router.query;
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Fitness & Nutrition",
      route: `/fitness-and-nutrition`,
      currentPage: false,
      disabled: false
    },
    {
      title: "Nutrition",
      route: `/fitness-and-nutrition?module=nutrition`,
      currentPage: false,
      disabled: false,
    },
    {
      title: `View`,
      route: `/fitness-and-nutrition/view/nutrition/planTemplate/view`,
      currentPage: true,
      disabled: false
    },
  ];

  return (
    <>
      <Box p={1}>
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
            onClick={() => {
              router.back();
            }}
          />
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
                    View Nutrition Template
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
                height: is3K ? "73vh" : is2K ? "69vh" : "73vh",
                overflow: "scroll",
              }}
              p={3}
            >
              <CreateNutritionForm />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PlanTemplateViewNutrition;
