import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import CreateResearchForm from "@/components/researchAndFacilities/add/createReasearchForm";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

const CreateResearchPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.ResearchFacilitiesAdd)) {
      router.push("/");
    }
  }, [router]);

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Research & Facilities",
      route: `/researchAndFacilities?module=research`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Create Research",
      route: `/researchAndFacilities/create/research`,
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
    if (is4K) return "69.5vh";
    if (isFullHD) return "73.5vh";
    if (is3K) return "69.5vh";
    if (is2K) return "67.5vh";
    if (isLaptopL) return "69.5vh";
    if (isLaptop) return "69.5vh";
    if (isTab) return "65.5vh";
    return "65.5vh";
  };

  return (
    <Grid container p={1}>
      <Grid item xs={12} md={12}>
        <Box p={1.5} className="bg-white" borderRadius={1}>
          <BasicBreadcrumbs routes={breadcrumbRoutes} />
        </Box>
      </Grid>
      <Grid item xs={12} md={12} mt={1}>
        <Box className="bg-white" borderRadius={1}>
          <Box p={2}>
            <Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "19.2px",
                  textAlign: "left",
                }}
                className="bukra"
              >
                Create Research
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
          <CreateResearchForm />
        </Box>
      </Grid>
    </Grid>
  );
};

export default CreateResearchPage;
