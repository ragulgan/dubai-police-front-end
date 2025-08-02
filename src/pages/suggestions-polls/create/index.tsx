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

const CreateRules = () => {
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
      title: "More",
      route: `/suggestions-polls`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Suggestions & Polls",
      route: `/suggestions-polls`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Create",
      route: `/suggestions-polls/create`,
      currentPage: true,
      disabled: false,
    },
  ];

  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.SuggestionPollsAdd)) {
      router.push("/");
    }
  }, [router]);

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
                >
                  Create Suggestions
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
            <CreateSuggestionForm setBackPop={setBackPop} backpop={backpop} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateRules;
