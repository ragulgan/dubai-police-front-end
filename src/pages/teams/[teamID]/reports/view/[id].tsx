import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React from "react";
import { useRouter } from "next/router";
import { getLocalStorage } from "@/utils/helper";
import SubMenuLayout from "../layout";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import BackIcon from "../../../../../../public/backIcon.svg";
import CustomButton from "@/components/buttons/CustomButton";
import ViewResults from "@/components/results/view/viewResults";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";

const ResultsView = () => {
  const getCurrentSport = getLocalStorage("sport");
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/results`,
      currentPage: false,
      disabled: false
    },
    {
      title: "Results",
      route: `/teams/${teamID}/results`,
      currentPage: false,
      disabled: false
    },
    {
      title: "View Results",
      route: `/teams/${getCurrentSport}/results/view/`,
      currentPage: true,
      disabled: false
    },
  ];
  return (
    <>
      <Grid container>
        <Grid item xs={12} md={12} sx={{ width: "100%" }}>
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
                fontWeight: 500,
                height: "30px",
              }}
              label="Back"
              variant="outlined"
              size="medium"
              ButtonIcon={BackIcon}
              iconPosition="start"
              onClick={() => router.push(`/teams/${teamID}/results`)}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            height: { lg: "70vh", xl: "79.25vh" },
            overflow: "auto",
            mt: 1,
          }}
        >
          <ViewResults />
        </Grid>
      </Grid>
    </>
  );
};

ResultsView.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);

export default ResultsView;
