import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { getTestName } from "@/utils/helper";
import { Box, Divider, Grid, Typography, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import TestAndMedicalChecks from "@/components/testAndMedicalChecks/add/AddTestAndMedicalChecks";
import SubMenuLayout from "../../layout";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { clearTestAndMedicalChecksEditState } from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const AddTestPage = () => {
  const router = useRouter();
  const { teamID, testType } = router.query;
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
    if (is4K) return "73vh";
    if (isFullHD) return "74vh";
    if (is3K) return "73vh";
    if (is2K) return "67.5vh";
    if (isLaptopL) return "73vh";
    if (isLaptop) return "73vh";
    if (isTab) return "69vh";
    return "69vh";
  };

  const getTestPathName = () => {
    return getTestName(String(testType));
  };
  const editTestAndMedicalsData = useSelector(
    (state: RootState) => state?.getTestAndMedicalChecksByID
  );
  const editData =
    editTestAndMedicalsData && editTestAndMedicalsData?.data?.length > 0
      ? editTestAndMedicalsData?.data[0]
      : "";

  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.TestMedicalChecksAdd)) {
      router.push("/");
    }
  }, [router]);

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
      currentPage: false,
      disabled: false,
    },
    {
      title: `${getTestPathName()}`,
      route: `/teams/${teamID}/testAndMedicalChecks/${testType}`,
      currentPage: false,
      disabled: false,
    },
    {
      title: `Create ${getTestPathName()}`,
      route: `/teams/${teamID}/testAndMedicalChecks/add/${testType}`,
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
    <>
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
                    fontSize: "18px",
                    lineHeight: "19.2px",
                    textAlign: "left",
                  }}
                  className="bukra-semi-bold"
                >
                  {`Create ${getTestPathName()}`}
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
            <TestAndMedicalChecks
              teamId={teamID}
              testType={testType}
              editTestAndMedicalsData={editData}
              cancelDialog={dialog}
              setCancelDialog={setDialog}
              clearEditData={() => dispatch(clearTestAndMedicalChecksEditState())}
            />
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

AddTestPage.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default AddTestPage;
