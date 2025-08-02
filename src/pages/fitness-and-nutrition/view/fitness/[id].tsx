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
import CustomButton from "@/components/buttons/CustomButton";
import PersonEditIcon from "../../../../../public/personEdit.svg";
import ViewPageChip from "@/components/testAndMedicalChecks/ViewPageChip";
import ViewTestCard from "@/components/testAndMedicalChecks/view/ViewTestCard";
import { setLocalStorage } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  clearTestAndMedicalChecksEditState,
  editTestAndMedicalChecks,
} from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";
import { useEffect, useState } from "react";
import BackIcon from "../../../../../public/backIcon.svg";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import FitnessSlideDialog from "../../edit/FitnessSlideDialog";
import FitnessSkeleton from "./FitnessSkeleton";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

const ViewTestPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const urlParams = new URLSearchParams(window.location.search);
  const sportId: any = urlParams.get("sportID");
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");
  const getPageContentHeight = () => {
    if (is4K) return "78vh";
    if (isFullHD) return "79vh";
    if (is3K) return "78vh";
    if (is2K) return "74vh";
    if (isLaptopL) return "78vh";
    if (isLaptop) return "78vh";
    if (isTab) return "74vh";
    return "74vh";
  };
  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Fitness & Nutrition",
      route: `/fitness-and-nutrition`,
      currentPage: false,
      disabled: false,
    },
    {
      title: `Fitness`,
      route: `/fitness-and-nutrition?module=fitness`,
      currentPage: false,
      disabled: false,
    },
    {
      title: `View`,
      route: `/fitness-and-nutrition/fitness/${id}`,
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
    setIsOpen(true);
    setLocalStorage("sport", sportId);
  };

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.FitnessNutritionView)) {
      if (id) {
        const payload: any = {
          testAndMedicalChecksID: id,
          sportID: Number(sportId),
        };
        dispatch(editTestAndMedicalChecks(payload));
      }
    } else {
      router.push("/");
    }
  }, [id]);
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
        <FitnessSlideDialog
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          id={id}
          module="fitness"
          setisEditData={setisEditData}
          testType="fitness"
          isEditSportId={sportId}
        />
      )}
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
              router.push(`/fitness-and-nutrition`);
            }}
          />
        </Box>
        {editTestAndMedicalsData && editTestAndMedicalsData.loading ? (
          <FitnessSkeleton />
        ) : (
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
                  {`Fitness`}
                </Typography>
                {checkAccess(1088) ? (
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
                  />
                ) : null}
              </Box>
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
                    editData?.selectSportsName
                      ? editData?.selectSportsName
                      : "--"
                  }
                />
              </Box>
            </Box>
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
          </Box>
        )}
      </Box>
    </>
  );
};

export default ViewTestPage;
