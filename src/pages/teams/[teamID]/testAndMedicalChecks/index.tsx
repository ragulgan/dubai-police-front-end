// New feature branch
import { useRouter } from "next/router";
import SubMenuLayout from "./layout";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import TestLangingPageCard from "@/components/testAndMedicalChecks/TestLangingPageCard";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";

const TestAndMedicalCheckLandingPage = () => {
  const router = useRouter();
  const { teamID, module } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/testAndMedicalChecks`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Test & Medical Checks",
      route: `/teams/${teamID}/testAndMedicalChecks`,
      currentPage: true,
      disabled: false,
    },
  ];
  const testTypes = ["militaryReadiness", "performance", "field", "medical"];
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "73vh";
    if (isFullHD) return "73vh";
    if (is3K) return "73vh";
    if (is2K) return "67vh";
    if (isLaptopL) return "73vh";
    if (isLaptop) return "73vh";
    if (isTab) return "67vh";
    return "67vh";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box p={1.5} className="bg-white" borderRadius={1}>
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Box
        className="bg-white"
        sx={{ borderRadius: 1, marginTop: 1, flexGrow: 1 }}
      >
        <Box display={"flex"}>
          <Typography
            sx={{ flexGrow: 0, width: "auto", minWidth: 0 }}
            p={2}
            className="table-list-header bukra header-border-right"
          >
            Test & Medical Checks
          </Typography>
          <Typography
            p={2}
            sx={{ flexGrow: 2, width: "auto", minWidth: 0 }}
            className="table-count-header dubai-med header-border-right"
          >
            {" "}
          </Typography>
        </Box>
        <Box
          sx={{
            padding: 3,
            height: getPageContentHeight(),
            overflowY: "scroll",
          }}
        >
          <Grid container spacing={3}>
            {testTypes.map((testType: string) => {
              return (
                <Grid item xs={6} key={testType}>
                  <TestLangingPageCard
                    testType={testType}
                    onClick={() => {
                      if (module === "add") {
                        router.push(
                          `/teams/${teamID}/testAndMedicalChecks/add/${testType}`
                        );
                      } else {
                        router.push(
                          `/teams/${teamID}/testAndMedicalChecks/${testType}`
                        );
                      }
                    }}
                  />
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

TestAndMedicalCheckLandingPage.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);

export default TestAndMedicalCheckLandingPage;
