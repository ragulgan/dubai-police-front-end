import { Box, Grid } from "@mui/material";
import { useRouter } from "next/router";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../public/backIcon.svg";
import ResearchViewInfo from "@/components/researchAndFacilities/ResearchViewPage";
import { useDispatch } from "react-redux";
import { clearResearchAndFacilitiesEditState } from "@/redux/slices/researchFacilities/researchFacilitiesEditSlice";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";

const ViewResearchPage = () => {
  const router = useRouter();
  const dispatch: any = useDispatch();
  const { researchID } = router.query;

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Research",
      route: `/researchAndFacilities?module=research`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "View",
      route: `/researchAndFacilities/view/research/${researchID}`,
      currentPage: true,
      disabled: false,
    },
  ];
  return (
    <>
      <Grid container p={1}>
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
              }}
              label="Back"
              variant="outlined"
              size="medium"
              ButtonIcon={BackIcon}
              iconPosition="start"
              onClick={() => {
                router.back();
                dispatch(clearResearchAndFacilitiesEditState());
              }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          container
          alignItems={"start"}
          justifyContent={"space-between"}
        >
          <ResearchViewInfo />
        </Grid>
      </Grid>
    </>
  );
};

export default ViewResearchPage;
