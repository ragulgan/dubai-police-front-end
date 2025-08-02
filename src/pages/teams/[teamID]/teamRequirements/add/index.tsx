import { useRouter } from "next/router";
import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import SubMenuLayout from "../layout";
import TeamRequirementsAdd from "@/components/teamRequirements/add/teamRequirementsAdd";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { useEffect } from "react";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

function Page() {
  const router = useRouter();
  const { teamID } = router.query;
  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.TeamRequirementsAdd)) {
      router.replace("/");
    }
  }, [router]);

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/teamRequirements`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Team Requirements",
      route: `/teams/${teamID}/teamRequirements`,
      currentPage: true,
      disabled: false,
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
    if (is4K) return "71.5vh";
    if (isFullHD) return "73.5vh";
    if (is3K) return "71.5vh";
    if (is2K) return "67.5vh";
    if (isLaptopL) return "71.5vh";
    if (isLaptop) return "71.5vh";
    if (isTab) return "67.5vh";
    return "71.5vh";
  };

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
                  className="bukra"
                >
                  Create Team Requirements
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
          >
            <TeamRequirementsAdd />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

Page.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default Page;
