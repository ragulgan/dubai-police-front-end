"use client";
import React, { useEffect, useState } from "react";
import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import _ from "lodash";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import CreateSuggestionForm from "@/components/suggestions-polls/create/createSuggestions";
import { useRouter } from "next/router";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import CreateCompetitionForm from "@/components/commanderShield/create/CreateCompetition";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../../public/backIcon.svg";
import { useSelector } from "react-redux";

const CreateCompetitions = () => {
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const getPageContentHeight = () => {
    if (is4K) return "69.5vh";
    if (isFullHD) return "73.5vh";
    if (is3K) return "69.5vh";
    if (is2K) return "67.5vh";
    if (isLaptopL) return "69.5vh";
    if (isLaptop) return "69.5vh";
    if (isTab) return "65.5vh";
    return "65.5vh";
  };
  const [backpop, setBackPop] = useState<boolean>(false);
  const router = useRouter();

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Dashboard",
      route: `/competitions`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Internal Races & Tournaments",
      route: `/competitions`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Create Tournament",
      route: `/competitions/create`,
      currentPage: true,
      disabled: false,
    },
  ];

  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.SuggestionPollsAdd)) {
      router.push("/");
    }
  }, [router]);

  // Add Competition
  const addCompetition = useSelector((state: any) => {
    return state.addCompetition;
  });

  return (
    <Box p={1}>
      <Grid item xs={12} md={12}>
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
      </Grid>
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
                  borderRadius={1}
                >
                  Create Tournament
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
            p={5}
          >
            <CreateCompetitionForm setBackPop={setBackPop} backpop={backpop} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateCompetitions;
