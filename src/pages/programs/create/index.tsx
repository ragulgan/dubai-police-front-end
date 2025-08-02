import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import ProgramsAdd from "@/components/programs/add/Programs";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import router from "next/router";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { useEffect } from "react";

const CreateProgramPage = () => {
  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.ProgramsAdd)) {
      router.push("/");
    }
  }, [router]);

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Programs",
      route: `/programs`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Create Program",
      route: `/programs/create`,
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
  const is8K = useMediaQuery("(min-width:2500px)");

  const getPageContentHeight = () => {
    if (is4K) return "71vh";
    if (isFullHD) return "74vh";
    if (is3K) return "71vh";
    if (is2K) return "67vh";
    if (isLaptopL) return "71vh";
    if (isLaptop) return "71vh";
    if (isTab) return "71vh";
    return "67vh";
  };

  return (
    <Box p={1}>
      {/* Breadcrump with back */}
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
                  Create Programs
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
            <ProgramsAdd />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreateProgramPage;
