import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import {
  Avatar,
  Box,
  darken,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/router";
import SubMenuLayout from "../../layout";
import CustomButton from "@/components/buttons/CustomButton";
import PersonEditIcon from "../../../../../../../public/personEdit.svg";
import ProfileImg from "../../../../../../../public/profileImg.jpg";
import Image from "next/image";
import ViewPageChip from "@/components/testAndMedicalChecks/ViewPageChip";
import ViewTestCard from "@/components/testAndMedicalChecks/view/ViewTestCard";
import { getTestName } from "@/utils/helper";
import TestAndMedicalsSlideResultDialog from "../../edit/TestAndMedicalsSlideDialog";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  clearTestAndMedicalChecksEditState,
  editTestAndMedicalChecks,
} from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";
import { useEffect, useState } from "react";
import BackIcon from "../../../../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const ViewTestPage = () => {
  const router = useRouter();
  const { teamID, testType, testID } = router.query;
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "79vh";
    if (isFullHD) return "79vh";
    if (is3K) return "79vh";
    if (is2K) return "75vh";
    if (isLaptopL) return "79vh";
    if (isLaptop) return "79vh";
    if (isTab) return "75vh";
    return "75vh";
  };

  const getTestPathName = () => {
    return getTestName(String(testType));
  };

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
      title: `View`,
      route: `/teams/${teamID}/testAndMedicalChecks/${testType}/${testID}`,
      currentPage: true,
      disabled: false,
    },
  ];
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const editTestAndMedicalsData = useSelector(
    (state: RootState) => state?.getTestAndMedicalChecksByID
  );

  const handleClose = (event: any, reason: any) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  const handleEditData = () => {
    // setisEditData(isEdit);
    setIsOpen(true);
  };

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.TestMedicalChecksView)) {
      if (testID) {
        const payload: any = {
          testAndMedicalChecksID: testID,
          sportID: Number(teamID),

        };
        dispatch(editTestAndMedicalChecks(payload));
      }
    } else {
      router.push('/access-denied')
    }
  }, [testID]);
  const editData =
    editTestAndMedicalsData && editTestAndMedicalsData?.data?.length > 0
      ? editTestAndMedicalsData?.data[0]
      : "";

  useEffect(() => {
    return () => {
      dispatch(clearTestAndMedicalChecksEditState());
    };
  }, []);

  return (
    <>
      {isOpen && (
        <TestAndMedicalsSlideResultDialog
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          id={testID}
          module={"testAndMedicalChecks"}
          setisEditData={setisEditData}
          testType={testType}
        />
      )}
      <Box
        p={1.5}
        className="bg-white"
        borderRadius={1}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <BasicBreadcrumbs routes={breadcrumbRoutes} />
        <CustomButton
          sx={{
            borderRadius: "28px",
            backgroundColor: "rgba(0, 135, 85, 0.1)",
            px: 1.5,
            py: 0,
            fontSize: "18px",
            fontWeight: 500,
            height: "30px",
          }}
          label="Back"
          variant="outlined"
          size="medium"
          ButtonIcon={BackIcon}
          iconPosition="start"
          onClick={() => {
            router.push(`/teams/${teamID}/testAndMedicalChecks/${testType}`);
          }}
        />
      </Box>
      <Box sx={{ height: getPageContentHeight(), overflowY: "scroll" }}>
        <Box
          sx={{
            borderRadius: 1,
            padding: 3,
            marginTop: 1,
            background: "linear-gradient(to bottom, #008755, #005844)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: "32px",
                lineHeight: "38.4px",
                color: "#FFFFFF",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
              className="bukra"
            >
              {`${getTestPathName()}`}
            </Typography>
            {checkAccess(USER_PERMISSION.TestMedicalChecksEdit) ?
              <CustomButton
                sx={{
                  backgroundColor: "#008755",
                  color: "#FFFFFF",
                  borderColor: "#FFFFFF",
                  borderWidth: 1,
                  "&:hover": {
                    backgroundColor: darken("#008755", 0.1),
                  },
                }}
                fullWidth={false}
                label="Edit"
                variant="outlined"
                size="medium"
                iconPosition="start"
                ButtonIcon={PersonEditIcon}
                onClick={handleEditData}
              /> : null}
          </Box >
          <Box
            sx={{
              marginTop: 3,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                position: "relative",
                width: 72,
                height: 72,
                borderRadius: "50%",
                overflow: "hidden",
              }}
            >
              <Avatar
                src={editData?.athleteProfileImage}
                alt={editData?.athleteProfileImage}
                sx={{ width: 72, height: 72 }}
              />
            </Box>
            <Box sx={{ marginLeft: 2 }}>
              <Typography
                sx={{
                  fontSize: "20px",
                  lineHeight: "24px",
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                className="bukra"
              >
                {/* {editData?.athleteProfileImage} */}
              </Typography>
              <Typography
                sx={{
                  marginTop: 1,
                  fontFamily: "29LT Bukra",
                  fontWeight: 500,
                  fontSize: "24px",
                  lineHeight: "28.4px",
                  color: "#FFFFFF",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
                className="bukra"
              >
                {`${editData?.athleteFirstName} ${editData?.athleteMiddleName} ${editData?.athleteSurName}`}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              marginTop: 3,
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <ViewPageChip
              label={"Date of Birth"}
              value={editData?.dob ? editData?.dob : "--"}
            />
            <ViewPageChip
              label={"Height"}
              value={editData?.height ? editData?.height : "--"}
            />
            <ViewPageChip
              label={"Weight"}
              value={editData?.weight ? editData?.weight : "--"}
            />
            <ViewPageChip
              label={"Sports"}
              value={
                editData?.selectSportsName ? editData?.selectSportsName : "--"
              }
            />
          </Box>
        </Box >
        {editData?.anotherTestList?.length > 0 ? (
          <Box sx={{ marginTop: 2 }}>
            <Grid container spacing={2}>
              {editData.anotherTestList.map((test: any, index: number) => (
                <Grid
                  key={test.anotherTestID || index}
                  item
                  xs={12}
                  sm={6}
                  md={6}
                  lg={6}
                  xl={6}
                >
                  <ViewTestCard
                    title={test.testName || "Untitled Test"}
                    data={{
                      testResult: test.testResult || "",
                      kpiName: test.kpiName || "",
                      kpiPoint: test.kpiPoint || "",
                      date: test.testDate || "",
                      time: test.testTime || "",
                      staff: test.conductingStaff || "",
                      location: test.location || "",
                      medicalStatus: test.medicalClearanceStatus || "",
                      recoveryPlan: test.recoveryPlan || "",
                      supportingDocuments: test.testFilePath || "",
                      comments: test.comments || "",
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        ) : null}
      </Box >
    </>
  );
};

ViewTestPage.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);

export default ViewTestPage;
