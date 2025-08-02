"use client";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import * as React from "react";
import Button from "@mui/material/Button";
import FileUpload from "@/utils/dropzone";
import StaticFoodImage from "../../../../public/staticFoodImage.svg";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonEdit from "../../../../public/personEdit.svg";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useEffect, useRef, useState } from "react";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
  USER_PERMISSION,
} from "@/utils/constants";
import { Typography, LinearProgress, Stack, Tooltip, SnackbarCloseReason } from "@mui/material";
import _, { isEmpty } from "lodash";
import ViewPageNav from "@/components/nav/ViewPageNav";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import TrainingCampViewCard from "@/components/view/TrainingCampViewCard";
import ResultsAchieved from "@/components/view/ResultsAchieved";
import TrainingCampCompetition from "@/components/view/TrainingCampCompetition";
import TrainingCampNutritionPlan from "@/components/view/TrainingCampNutritionPlan";
import TrainingCampTrainingPlan from "@/components/view/TrainingCampTrainingPlan";
import TrainingCampAthlete from "@/components/view/TrainingCampAthlete";
import TrainingCampStaff from "@/components/view/TrainingCampStaff";
import TrainingCampOthers from "@/components/view/TrainingCampOthers";
import OverallTrainingCampReport from "@/components/view/OverallTrainingCampReport";
import { useRouter } from "next/router";
import { getTrainingCampByID } from "@/redux/slices/trainingCamp/getTrainingCampByIdSlice";
import UpdateTrainingCampSlider from "./updateTrainingCamp";
import SlideFullDrawer from "@/pages/teams/[teamID]/trainingCamp/edit/slideFullDrawer";
import moment from "moment";
import { PieChart } from "@mui/x-charts/PieChart";
import {
  clearState,
  singleFileUpload,
} from "@/redux/slices/fileupload/singleFileUpload";
import { checkAccess } from "@/utils/acessscheck";
import { clearTrainingCampUpdateStatusState, updateStatusTrainingCamp } from "@/redux/slices/trainingCamp/updateTrainingCampStatusSlice";
import TrainingCampStatusRejectDialog from "./trainingCampStatusRejectDialog";
import CustomSnackbar from "@/components/CustomSnackbar";

export default function ViewTrainingCamp() {
  const router = useRouter();
  const { id, teamID } = router.query;
  const trainingCampID = id;
  const dispatch: AppDispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditData, setisEditData] = useState(null);
  const trainingCampData = useSelector((state: RootState) => {
    return state &&
      state.getTrainingCampByID &&
      !isEmpty(state?.getTrainingCampByID?.data) &&
      !isEmpty(state?.getTrainingCampByID?.data[0])
      ? state.getTrainingCampByID.data[0]
      : null;
  });
  const [image, setImage] = useState<any>("");
  const [imageData, setImageData] = useState<any>({
    ProfileImage: "",
  });
  const externalClubCertificateRef = useRef<HTMLInputElement>(null);
  const [section, setSection] = useState(0);
  const [updateOpen, setUpdateOpen] = useState(false);
  const trainingCampUpload = useSelector((state: any) => state.singleUpload);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [action, setAction] = useState<"approve" | "reject" | "">("");

  const UpdateTrainingCampStatusData = useSelector(
    (state: RootState) => state.updateTrainingCampStatus
  );

  const loadTrainingCampDeatils = () => {
    const payload: any = {
      trainingCampID: trainingCampID,
      sportID: teamID,
    };
    dispatch(getTrainingCampByID(payload));
  }

  const handleCampImage = () => {
    if (externalClubCertificateRef.current) {
      externalClubCertificateRef.current.click();
    }
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
    loadTrainingCampDeatils();
  };

  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };

  const handleFileChange = (
    file: any,
    flag: any,
    modulename: any,
    moduleId: any
  ) => {
    if (file) {
      setImage((prevData: any) => ({
        ...prevData,
        [flag]: {
          file,
          modulename,
          moduleId,
          section: flag,
        },
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageData((prevData: any) => ({
          ...prevData,
          ProfileImage:
            flag === DROPZONE_IMAGE_FLAG.PROFILES
              ? result
              : prevData.ProfileImage,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSection = (value: number) => {
    if (section == value) {
      setSection(0);
    } else {
      setSection(value);
    }
  };

  useEffect(() => {
    if (checkAccess(USER_PERMISSION.TrainingCampView)) {
      if (!trainingCampID || !teamID) return;
      loadTrainingCampDeatils();
    } else {
      router.push('/access-denied')
    }
  }, [trainingCampID, teamID]);

  const startDate = moment(
    trainingCampData?.campStartDate,
    "DD/MM/YYYY hh:mm:ss A"
  );
  const endDate = moment(
    trainingCampData?.campEndDate,
    "DD/MM/YYYY hh:mm:ss A"
  );

  // Calculate difference in days
  const durationInDays = endDate.diff(startDate, "days");

  const handleUpdateTrainingClose = (
    event: React.SyntheticEvent | Event,
    reason: string
  ) => {
    if (reason === "backdropClick") {
      return;
    }
    setUpdateOpen(false);
  };

  const handleUpdateTrainingCamp = () => {
    setUpdateOpen(true);
  };

  const pieData = [
    {
      id: 0,
      value: +trainingCampData?.athletesCount,
      label: "Athletes",
      color: "rgba(2, 164, 111, 1)",
    },
    {
      id: 1,
      value: +trainingCampData?.staffsCount,
      label: "Staff",
      color: "rgba(255, 165, 31, 1)",
    },
    {
      id: 2,
      value: +trainingCampData?.othersCount,
      label: "Others",
      color: "rgba(234, 86, 121, 1)",
    },
  ];

  useEffect(() => {
    if (imageData && imageData?.ProfileImage) {
      const fileFlags = ["ProfileImage"];
      fileFlags.forEach((flag) => {
        const fileData = image?.[flag as keyof typeof image];
        if (fileData && fileData.file) {
          const formData = new FormData();
          formData.append("file", fileData.file);
          formData.append("modulename", "TrainingCamp");
          formData.append("moduleid", trainingCampData.trainingCampID);
          formData.append("section", "ProfileImage");
          dispatch(singleFileUpload(formData));
        }
      });
    }
  }, [imageData]);

  useEffect(() => {
    if (trainingCampUpload.code === 200) {
      dispatch(clearState());
      setImageData({});
      setImage("");
      loadTrainingCampDeatils();
    }
  }, [trainingCampUpload]);

  const handleApproveTrainingCamp = (id: any) => {
    setAction("approve");
    const payload: any = {
      trainingCampID: Number(id),
      status: 1,
      rejectedReason: ""
    };
    dispatch(updateStatusTrainingCamp({ url: "/UpdateTrainingCampStatus", payload: payload }));
  };

  useEffect(() => {
    if (UpdateTrainingCampStatusData && UpdateTrainingCampStatusData?.code === 200) {
      setSnackbarStatus("success");
      dispatch(clearTrainingCampUpdateStatusState());
      loadTrainingCampDeatils();
    } else if (UpdateTrainingCampStatusData && UpdateTrainingCampStatusData?.code === 500) {
      setSnackbarStatus("error");
      dispatch(clearTrainingCampUpdateStatusState());
    }
  }, [UpdateTrainingCampStatusData]);


  const canShowApprove = () => {
    if (trainingCampData && trainingCampData?.status === 0)
      return true;
    return false;
  }

  const canShowReject = () => {
    if (trainingCampData && trainingCampData?.status === 0)
      return true;
    return false;
  }

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    setAction("");
    setSnackbarStatus("");
  };

  const getSnackBarMessage = () => {
    if (snackbarStatus === "success" && action === "approve") {
      return "Training Camp is approved successfully!";
    }

    if (snackbarStatus === "success" && action !== "approve") {
      return `Training Camp is rejected and its reason updated successfully!`;
    }

    if (snackbarStatus === "error" && action === "approve") {
      return "Unable to approve the Training Camp!";
    }

    if (snackbarStatus === "error" && action !== "approve") {
      return "Unable to reject the Training Camp!";
    }

    return "Unable to complete the action!";
  }

  return (
    <>
      {!!snackbarStatus ? (
        <CustomSnackbar
          message={getSnackBarMessage()}
          severity={
            snackbarStatus === "success"
              ? "success" : "error"
          }
          open={!!snackbarStatus}
          onClose={handleSnackBarClose}
        />
      ) : null}
      <Grid container>
        {isOpen && (
          <SlideFullDrawer
            open={isOpen}
            onClose={(event: any, reason: any) => handleClose(event, reason)}
            module={"trainingCamp"}
            isEditData={isEditData}
          />
        )}
        {updateOpen && id && (
          <UpdateTrainingCampSlider
            open={updateOpen}
            onClose={(event: any, reason: any) =>
              handleUpdateTrainingClose(event, reason)
            }
            id={id}
            module={"trainingPlan"}
            TrainingCampData={trainingCampData}
          />
        )}
        <Grid item xs={12} md={12}>
          <Grid container direction="column" height="100%">
            <Grid
              item
              xs={6}
              height="50%"
              sx={{
                backgroundImage: 'url("/your-image.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
              }}
            >
              <Box
                position={"relative"}
                sx={{
                  width: "100%",
                  borderTopRightRadius: "8px",
                  borderTopLeftRadius: "8px",
                  height: "300px",
                }}
              >
                {imageData?.ProfileImage ||
                  !isEmpty(trainingCampData?.profileFilePath) ? (
                  <img
                    src={
                      imageData?.ProfileImage || trainingCampData?.profileFilePath
                    }
                    alt="Upload Camp"
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      borderTopRightRadius: "8px",
                      borderTopLeftRadius: "8px",
                      height: "300px",
                    }}
                  />
                ) : (
                  <StaticFoodImage
                    style={{
                      width: "100%",
                      border: "1px dashed #B1DACB",
                      borderTopRightRadius: "8px",
                      borderTopLeftRadius: "8px",
                      height: "300px",
                      cursor: "pointer",
                    }}
                    className="static-image"
                    onClick={handleCampImage}
                  />
                )}
                <Button
                  variant="contained"
                  className="dubai-med text-capitalize"
                  sx={{
                    position: "absolute",
                    right: 20,
                    top: 20,
                    borderRadius: "30px",
                    border: "1px solid #FFFFFF",
                    fontSize: "18px",
                    whiteSpace: "nowrap",
                  }}
                  startIcon={<EditOutlinedIcon />}
                  onClick={handleCampImage}
                >
                  {imageData?.ProfileImage ||
                    !isEmpty(trainingCampData?.profileFilePath)
                    ? "Change"
                    : "Add Image"}
                  <FileUpload
                    onFileChange={(
                      file: any,
                      flag: any,
                      modulename: any,
                      moduleId: any
                    ) => handleFileChange(file, flag, modulename, moduleId)}
                    formatType={FILE_FORMAT_TYPE}
                    type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
                    flag={DROPZONE_IMAGE_FLAG.PROFILES}
                    modulename={"trainingCamp"}
                    setData={setImageData}
                    formData={imageData}
                    fileInputRef={externalClubCertificateRef}
                  />
                </Button>
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={6}
              height="50%"
              sx={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0, 135, 85, 1), rgba(0, 88, 68, 1))",
                borderBottomLeftRadius: "10px",
                borderBottomRightRadius: "10px",
              }}
              p={3}
              container
              alignItems={"start"}
              justifyContent={"space-between"}
            >
              <Grid item md={8}>
                {/* <Tooltip title={TrainingPlansEdit?.trainingPlan}> */}
                <Typography
                  mt={2}
                  className="bukra-semi-bold goal-target-view-head text-ellipsis"
                >
                  {trainingCampData?.campName}
                </Typography>
                {/* </Tooltip> */}
                <Box mt={1.5} display={"flex"}>
                  <Typography
                    width={"auto"}
                    className="dubai-regular goal-target-view-list"
                  >
                    Start Date:{" "}
                    <span className="dubai-bold text-ellipsis">
                      {trainingCampData?.campStartDate}
                    </span>
                    &nbsp;&nbsp; End Date:{" "}
                    <span className="dubai-bold text-ellipsis">
                      {trainingCampData?.campEndDate}
                    </span>
                  </Typography>
                </Box>
                <Box mt={1.5} display={"flex"}>
                  <Typography
                    width={"auto"}
                    className="dubai-regular goal-target-view-list"
                  >
                    Location:{" "}
                    <span className="dubai-bold text-ellipsis">
                      {trainingCampData?.campCity}
                    </span>
                  </Typography>
                </Box>
                <Box mt={2.5} display={"flex"} alignItems={"center"}>
                  <Box
                    px={2}
                    py={1}
                    sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    borderRadius={"8px"}
                    width={"auto"}
                    className="goal-target-view-list"
                  >
                    <Typography className="bukra" fontSize={"15px"}>
                      Camp Duration
                    </Typography>
                    <Typography className="dubai-regular" mt={1}>
                      {durationInDays} {durationInDays === 1 ? "day" : "days"}
                    </Typography>
                  </Box>
                  <Box
                    px={2}
                    py={1}
                    sx={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                    borderRadius={"8px"}
                    width={"auto"}
                    className="goal-target-view-list"
                    ml={2}
                  >
                    <Typography className="bukra" fontSize={"14px"}>
                      Total Cost
                    </Typography>
                    <Typography className="dubai-regular" mt={1}>
                      {trainingCampData?.totalCost} AED
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item md={3}>
                <Box display="flex" gap={1} justifyContent={"end"} pb={0} mt={2}>
                  {checkAccess(USER_PERMISSION.TrainingCampApproval) && (
                    <Tooltip title="Update Overall Training Camp Report">
                      <Button
                        variant="contained"
                        sx={{
                          color: "#008755",
                          height: "48px",
                          backgroundColor: "#FFFFFF",
                        }}
                        endIcon={<SettingsOutlinedIcon />}
                        className="text-capitalize"
                        onClick={handleUpdateTrainingCamp}
                      >
                        Update
                      </Button>
                    </Tooltip>
                  )}
                  {checkAccess(USER_PERMISSION.TrainingCampEdit) && (
                    <Button
                      variant="outlined"
                      sx={{
                        color: "#FFFFFF",
                        borderColor: "#FFFFFF",
                        height: "48px",
                        whiteSpace: "nowrap",
                      }}
                      startIcon={<PersonEdit />}
                      className="text-capitalize dubai-regular season-goal-btn"
                      onClick={() =>
                        handleEditData(trainingCampData?.trainingCampID)
                      }
                    >
                      Edit Training Camp
                    </Button>
                  )}
                </Box>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  mt={5}
                >
                  <Typography className="goal-target-view-status bukra">
                    Status:
                    <span
                      style={{ marginLeft: "8px" }}
                      className="dubai-regular goal-target-view-status-list text-capitalize"
                    >
                      {trainingCampData?.status}
                    </span>
                  </Typography>
                  <Typography className="dubai-bold  goal-target-view-status-list">
                    {trainingCampData?.percentage
                      ? Number(trainingCampData?.percentage)
                      : 0}
                    %
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={Number(trainingCampData?.percentage)}
                  sx={{
                    mb: 5,
                    mt: 1,
                    height: "8px",
                    borderRadius: "8px",
                    opacity: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        Number(70) != null && Number(70) >= 0 && Number(70) <= 100
                          ? "rgba(241, 235, 156, 1)"
                          : "rgba(255, 255, 255, 0.2)",
                    },
                  }}
                />
                <Box
                  textAlign={"end"}
                  sx={{ placeContent: "end" }}
                >
                  <Stack
                    direction="row"
                    spacing={1}
                    justifyContent={"end"}
                    alignItems={"end"}
                  >
                    {checkAccess(USER_PERMISSION.TrainingCampApproval) && canShowReject()
                      ? <TrainingCampStatusRejectDialog
                        trainingCampData={trainingCampData}
                      /> : null}
                    {checkAccess(USER_PERMISSION.TrainingCampApproval) &&
                      canShowApprove()
                      ? <Button
                        variant="contained"
                        className="text-capitalize dubai-regular"
                        sx={{
                          fontSize: "16px",
                          bgcolor: "rgba(255, 255, 255, 0.1)",
                          color: "#FFFFFF",
                          height: "48px",
                        }}
                        onClick={() => handleApproveTrainingCamp(trainingCampData?.trainingCampID)}
                      >
                        Approve
                      </Button> : null}

                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={2} py={2}>
          <Grid item xs={12} md={9}>
            <Box
              sx={{
                borderRadius: "8px",
                bgcolor: "#FFFFFF",
              }}
              p={2}
            >
              <Typography
                className="bukra-semi-bold primary-color"
                sx={{ fontWeight: "18px" }}
              >
                Delegation Distribution
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  // height: 350
                }}
              >
                <PieChart
                  series={[{ data: pieData }]}
                  width={480}
                  height={250}
                  slotProps={{
                    legend: { hidden: true },
                  }}
                />
                <Stack direction="row" spacing={2} mt={2} justifyContent="center">
                  {pieData.map((item) => (
                    <Stack
                      key={item.id}
                      direction="row"
                      alignItems="center"
                      spacing={1}
                    >
                      <Box
                        sx={{
                          backgroundColor: item.color,
                          width: "37px",
                          height: "8px",
                          gap: "0px",
                          opacity: "0px",
                        }}
                      />
                      <Typography
                        variant="body2"
                        className="typography textfield-label dubai-regular"
                      >
                        {item.label}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </Box>
            <Box width={"100%"}>
              {section !== 1 && (
                <ViewPageNav
                  label="Overall Training Camp Report"
                  expanded={section == 1}
                  onClick={() => toggleSection(1)}
                />
              )}
              {section == 1 ? (
                <OverallTrainingCampReport
                  label="Overall Training Camp Report"
                  expanded={section == 1}
                  onClick={() => toggleSection(1)}
                  id={id}
                  data={trainingCampData}
                />
              ) : null}

              {section !== 2 && (
                <ViewPageNav
                  label="Results Achieved"
                  expanded={section == 2}
                  onClick={() => toggleSection(2)}
                />
              )}
              {section == 2 ? (
                <ResultsAchieved
                  label="Results Achieved"
                  expanded={section == 2}
                  onClick={() => toggleSection(2)}
                  id={id}
                  trainingCampData={trainingCampData}
                />
              ) : null}

              {section !== 3 && (
                <ViewPageNav
                  label="Competition(s) the team will participate during the camp"
                  expanded={section == 3}
                  onClick={() => toggleSection(3)}
                />
              )}
              {section == 3 && (
                <TrainingCampCompetition
                  label="Competition(s) the team will participate during the camp"
                  expanded={section == 3}
                  onClick={() => toggleSection(3)}
                  data={trainingCampData}
                />
              )}

              {section !== 4 && (
                <ViewPageNav
                  label="Events Plan"
                  expanded={section == 4}
                  onClick={() => toggleSection(4)}
                />
              )}
              {section == 4 && (
                <TrainingCampTrainingPlan
                  label="Events Plan"
                  expanded={section == 4}
                  onClick={() => toggleSection(4)}
                  data={trainingCampData}
                />
              )}
              {section !== 5 && (
                <ViewPageNav
                  label="Meal Schedule"
                  expanded={section == 5}
                  onClick={() => toggleSection(5)}
                />
              )}
              {section == 5 && (
                <TrainingCampNutritionPlan
                  label="Meal Schedule"
                  expanded={section == 5}
                  onClick={() => toggleSection(5)}
                  data={trainingCampData}
                />
              )}
              {section !== 6 && (
                <ViewPageNav
                  label="Athletes"
                  expanded={section == 6}
                  onClick={() => toggleSection(6)}
                />
              )}
              {section == 6 && (
                <TrainingCampAthlete
                  label="Athletes"
                  expanded={section == 6}
                  onClick={() => toggleSection(6)}
                  data={trainingCampData}
                />
              )}
              {section !== 7 && (
                <ViewPageNav
                  label="Staff"
                  expanded={section == 7}
                  onClick={() => toggleSection(7)}
                />
              )}
              {section == 7 && (
                <TrainingCampStaff
                  label="Staff"
                  expanded={section == 7}
                  onClick={() => toggleSection(7)}
                  data={trainingCampData}
                />
              )}
              {section !== 8 && (
                <ViewPageNav
                  label="Others"
                  expanded={section == 8}
                  onClick={() => toggleSection(8)}
                />
              )}
              {section == 8 && (
                <TrainingCampOthers
                  label="Others"
                  expanded={section == 8}
                  onClick={() => toggleSection(8)}
                  data={trainingCampData}
                />
              )}
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <TrainingCampViewCard data={trainingCampData} module="trainingCamp" />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
