import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import router, { useRouter } from "next/router";
import CreateFitness from "@/components/testAndMedicalChecks/add/AddTestAndMedicalChecks";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { clearTestAndMedicalChecksEditState } from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const AddFitnessPage = () => {
  const dispatch: AppDispatch = useDispatch();
  const [dialog, setDialog] = useState(false);
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

  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.FitnessNutritionAdd)) {
      router.push("/");
    }
  }, [router]);

  const editTestAndMedicalsData = useSelector(
    (state: RootState) => state?.getTestAndMedicalChecksByID
  );
  const editData =
    editTestAndMedicalsData && editTestAndMedicalsData?.data?.length > 0
      ? editTestAndMedicalsData?.data[0]
      : "";

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Fitness & Nutrition",
      route: `/fitness-and-nutrition`,
      currentPage: false,
      disabled: false,
    },
    {
      title: `Fitness`,
      route: `/fitness-and-nutrition/add/fitness`,
      currentPage: true,
      disabled: false,
    },
  ];

  useEffect(() => {
    return () => {
      dispatch(clearTestAndMedicalChecksEditState());
    };
  }, []);

  return (
    <Box p={1}>
      <Box
        p={1.5}
        className="bg-white"
        borderRadius={1}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
      </Box>
      <Grid container mt={1}>
        <Grid item xs={12}>
          <Box className="bg-white" borderRadius={1}>
            <Box p={2}>
              <Box>
                <Typography
                  sx={{
                    fontSize: "16px",
                    lineHeight: "19.2px",
                    textAlign: "left",
                  }}
                  className="bukra-semi-bold"
                >
                  {`Create Fitness`}
                </Typography>
              </Box>
            </Box>
            <Divider />
          </Box>
          <Box
            className="bg-white"
            borderRadius={1}
            sx={{ height: getPageContentHeight(), overflowY: "scroll" }}
          >
            <CreateFitness
              testType="fitness"
              editTestAndMedicalsData={editData}
              cancelDialog={dialog}
              setCancelDialog={setDialog}
              module="fitness"
              clearEditData={() =>
                dispatch(clearTestAndMedicalChecksEditState())
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AddFitnessPage;
