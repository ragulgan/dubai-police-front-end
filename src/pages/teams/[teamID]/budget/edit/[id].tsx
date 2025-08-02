import { useRouter } from "next/router";
import { Box, Divider, Grid, Typography } from "@mui/material";
import SubMenuLayout from "../layout";
import BudgetAdd from "@/components/budget/add/budgetAdd";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect } from "react";
import { EditBudget } from "@/redux/slices/budget/budgetEditSlice";

function Page() {
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
      title: "Edit Budget",
      route: `/teams/${teamID}/budget`,
      currentPage: true,
      disabled: false,
    },
  ];
  const budgetEditData = useSelector((state: RootState) => state.budgetsEdit);

  useEffect(() => {
    if (id) {
      const payload = {
        budgetID: Number(id),
        sportID: Number(teamID),

      };
      dispatch(EditBudget({ url: "/GetBudgetByID", payload: payload }));
    }
  }, [id]);

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
                  Edit Budget
                </Typography>
              </Box>
            </Box>
            <Divider />
          </Box>
          <Box
            className="bg-white"
            borderRadius={1}
            sx={{ width: "100%", height: "73vh", overflow: "scroll" }}
          >
            <BudgetAdd edit={true} budgetEditData={budgetEditData} id={id} mode="edit" />
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
