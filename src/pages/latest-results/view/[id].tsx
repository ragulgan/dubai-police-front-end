import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React from "react";
import { useRouter } from "next/router";
import { getLocalStorage } from "@/utils/helper";

import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import BackIcon from "../../../../public/backIcon.svg";
import CustomButton from "@/components/buttons/CustomButton";
import ViewResults from "@/components/results/view/viewResults";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { useMediaQuery } from "@mui/material";

const LatestResultsView = () => {
  const getCurrentSport = getLocalStorage("sport");
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Results",
      route: `/teams/${teamID}/results`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "View Results",
      route: `/teams/${getCurrentSport}/results/view/`,
      disabled: false,
      currentPage: true,
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
    if (is4K) return "78vh";
    if (isFullHD) return "78vh";
    if (is3K) return "78vh";
    if (is2K) return "74vh";
    if (isLaptopL) return "78vh";
    if (isLaptop) return "78vh";
    if (isTab) return "74vh";
    return "78vh";
  };

  return (
    <Box p={1}>
      <Grid container>
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
              onClick={() => {
                router.back();
              }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            height: getPageContentHeight(),
            overflowY: "scroll",
            mt: 1,
          }}
        >
          <ViewResults module="latest-results" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LatestResultsView;
