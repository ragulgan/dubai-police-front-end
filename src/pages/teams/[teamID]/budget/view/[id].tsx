import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import CustomButton from "@/components/buttons/CustomButton";
import BackIcon from "../../../../../../public/backIcon.svg";
import SubMenuLayout from "../layout";
import BudgetView from "@/components/budget/view/budgetView";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { EditBudget } from "@/redux/slices/budget/budgetEditSlice";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import { useMediaQuery } from "@mui/material";

const TeamRequirementsViewPage = () => {
  const router = useRouter();
  const { teamID, id } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: `/teams/${teamID}/budget`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "Budget",
      route: `/teams/${teamID}/budget`,
      currentPage: false,
      disabled: false,
    },
    {
      title: "View Budget",
      route: `/teams/${teamID}/budget/view/`,
      currentPage: true,
      disabled: false,
    },
  ];
  const budgetEditData = useSelector((state: RootState) => state.budgetsEdit);
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

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.BudgetView)) {
      if (id) {
        const payload = {
          budgetID: Number(id),
          sportID: Number(teamID),

        };
        dispatch(EditBudget({ url: "/GetBudgetByID", payload: payload }));
      }
    } else {
      router.push('/access-denied')
    }
  }, [id]);

  return (
    <>
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
                router.push(`/teams/${teamID}/budget`);
              }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          sx={{
            height: getPageContentHeight(),
            overflowY: "scroll",
            mt: 1,
          }}
          container
          alignItems={"start"}
          justifyContent={"space-between"}
        >
          <BudgetView budgetEditData={budgetEditData} id={id} teamID={teamID} />
        </Grid>
      </Grid>
    </>
  );
};

TeamRequirementsViewPage.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);

export default TeamRequirementsViewPage;
