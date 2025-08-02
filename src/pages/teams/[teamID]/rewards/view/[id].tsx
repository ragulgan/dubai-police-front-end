import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../../public/backIcon.svg";
import SubMenuLayout from "../layout";
import RewardsView from "@/components/rewards/view/rewardsView";
import { AppDispatch } from "@/redux/store";
import { useDispatch } from "react-redux";
import { clearEditState } from "@/redux/slices/rewards/rewardsEditSlice";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { useMediaQuery } from "@mui/material";

const RewardsViewPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { teamID } = router.query;
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/rewards`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Rewards",
      route: `/teams/${teamID}/rewards`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "View Rewards",
      route: `/teams/${teamID}/rewards/view/`,
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
    if (is4K) return "77vh";
    if (isFullHD) return "78vh";
    if (is3K) return "77vh";
    if (is2K) return "73vh";
    if (isLaptopL) return "77vh";
    if (isLaptop) return "77vh";
    if (isTab) return "73vh";
    return "77vh";
  };

  useEffect(() => {
    return () => {
      dispatch(clearEditState());
    };
  }, []);

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
              }}
              label="Back"
              variant="outlined"
              size="medium"
              ButtonIcon={BackIcon}
              iconPosition="start"
              onClick={() => {
                router.push(`/teams/${teamID}/rewards`);
                dispatch(clearEditState());
              }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          mt={1}
          height={getPageContentHeight()}
          sx={{
            overflowY: "scroll",
          }}
        >
          <RewardsView />
        </Grid>
      </Grid>
    </>
  );
};

RewardsViewPage.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);

export default RewardsViewPage;
