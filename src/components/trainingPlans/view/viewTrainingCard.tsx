"use client";
import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  SnackbarCloseReason,
  Tooltip,
} from "@mui/material";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import PersonEdit from "../../../../public/personEdit.svg";
import { useRouter } from "next/router";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _, { isEmpty } from "lodash";
import { usePathname } from "next/navigation";
import { editTrainingPlans } from "@/redux/slices/trainingPlans/TrainingPlansEditSlice";
import SlideDialog from "../../../pages/teams/[teamID]/trainingPlans/edit/SlideDialog";
import { clearAddState } from "@/redux/slices/trainingPlans/TrainingPlansAddSlice";
import moment from "moment";
import UpdateTrainingSlider from "./updateTrainingResults";
import { useForm } from "react-hook-form";
import {
  clearCoachCommentsUpdateState,
  UpdateCoachCommentsByID,
} from "@/redux/slices/athlete/coachCommentsSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TextSunEditor from "@/components/SunEditor";
import { useState } from "react";
import { RenderEditorContentHtml } from "@/utils/helper";
import { USER_PERMISSION } from "@/utils/constants";
import { checkAccess } from "@/utils/acessscheck";

export default function ViewCard() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [updateOpen, setUpdateOpen] = React.useState(false);
  const [isEditData, setisEditData] = React.useState(null);
  const [openDialog, setDialogOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");
  const handleEditData = (isEdit: any) => {
    setisEditData(isEdit);
    setIsOpen(true);
  };
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();
  const { id } = router.query;
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const dispatch: AppDispatch = useDispatch();
  const TrainingPlansEdit = useSelector((state: RootState) =>
    state.TrainingPlansEdit.code === 200 &&
    !isEmpty(state.TrainingPlansEdit?.data)
      ? state.TrainingPlansEdit?.data
      : null
  );
  const TrainingPlansEditLoading = useSelector(
    (state: RootState) => state.TrainingPlansEdit
  );
  const TrainingPlansAddData: any = useSelector(
    (state: RootState) => state.TrainingPlansAdd
  );
  const [formData, setFormData] = useState<any>({
    coachComments: "",
  });

  React.useEffect(() => {
    if (checkAccess(USER_PERMISSION.TrainingPlanView)) {
      if (id && !isOpen) {
        const payload: any = {
          trainingPlanID: id,
          sportID: Number(teamId),
        };
        dispatch(editTrainingPlans(payload));
      } else if (
        TrainingPlansAddData &&
        TrainingPlansAddData.code === 200 &&
        !isOpen
      ) {
        const payload: any = {
          trainingPlanID: id,
          sportID: Number(teamId),
        };
        dispatch(editTrainingPlans(payload));
        dispatch(clearAddState());
      }
    } else {
      router.push("/access-denied");
    }
  }, [id, TrainingPlansAddData, isOpen]);

  const RenderEditorContent = ({ content }: { content: string }) => {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        style={{
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
        }}
      />
    );
  };

  const handleCoachClose = () => {
    setDialogOpen(false);
  };

  const handleClose = (event: React.SyntheticEvent | Event, reason: string) => {
    if (reason === "backdropClick") {
      return;
    }
    setIsOpen(false);
  };

  const handleUpdateTrainingClose = (
    event: React.SyntheticEvent | Event,
    reason: string
  ) => {
    if (reason === "backdropClick") {
      return;
    }
    setUpdateOpen(false);
  };

  const handleUpdateTrainingResult = () => {
    setUpdateOpen(true);
  };
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      coachComments: "",
    },
  });

  const coachCommentsResponse = useSelector(
    (state: any) => state.coachComments
  );

  React.useEffect(() => {
    if (!_.isEmpty(TrainingPlansEdit) && openDialog) {
      setValue("coachComments", TrainingPlansEdit?.coachingNotes);
      setFormData((prevState: any) => ({
        ...prevState,
        coachComments: TrainingPlansEdit?.coachingNotes || "",
      }));
    }
  }, [openDialog, TrainingPlansEdit]);

  const handleCoachComments = () => {
    setDialogOpen(true);
  };

  const onSubmit = (e: any) => {
    const validationErrors: any = {};
    const plainText = RenderEditorContentHtml(formData.coachComments);
    if (_.isEmpty(plainText)) {
      validationErrors.coachComments = "Coach Comments is required";
    }
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const payload: any = {
        trainingPlanID: id,

        coachingNotes: formData.coachComments,
      };
      dispatch(
        UpdateCoachCommentsByID({ url: "/UpdateCoachingNotesByID", payload })
      );
    }
  };

  React.useEffect(() => {
    if (
      coachCommentsResponse &&
      coachCommentsResponse.code === 200 &&
      coachCommentsResponse.status === "succeeded"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      dispatch(clearCoachCommentsUpdateState());
      setDialogOpen(false);
      const payload: any = {
        trainingPlanID: id,
        sportID: Number(teamId),
      };
      dispatch(editTrainingPlans(payload));
    } else if (
      coachCommentsResponse &&
      coachCommentsResponse.code === 500 &&
      coachCommentsResponse.status === "failed"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearCoachCommentsUpdateState());
    }
  }, [coachCommentsResponse]);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <>
      {isOpen && isEditData && (
        <SlideDialog
          open={isOpen}
          onClose={(event: any, reason: any) => handleClose(event, reason)}
          id={isEditData}
          module={"trainingPlan"}
        />
      )}
      {updateOpen && id && (
        <UpdateTrainingSlider
          open={updateOpen}
          onClose={(event: any, reason: any) =>
            handleUpdateTrainingClose(event, reason)
          }
          id={id}
          module={"trainingPlan"}
          TrainingPlansEdit={TrainingPlansEdit}
        />
      )}
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? "Coaching Notes updated successfully!"
              : "Something went wrong"
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleSnackbarClose}
        />
      )}
      {TrainingPlansEditLoading.loading && !isOpen ? (
        <Box
          display={"grid"}
          sx={{
            placeContent: "center",
            alignContent: "center",
            height: { lg: "70vh", xl: "78.5vh" },
            backgroundColor: "#FFFFFF",
          }}
        >
          <CircularProgress sx={{ color: "#008755" }} size="40px" />
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Dialog
            open={openDialog}
            onClose={handleCoachClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            sx={{
              "& .MuiDialog-paper": {
                width: "500px",
                maxWidth: "80%",
              },
            }}
          >
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <DialogTitle
                id="alert-dialog-title"
                className="bukra"
                sx={{ mt: 2 }}
              >
                {"Coaching Notes"}
              </DialogTitle>
              <DialogContent>
                <TextSunEditor
                  setData={setFormData}
                  contentData={formData.coachComments}
                  name="coachComments"
                  minHeight={"150px"}
                />
                {errors.coachComments && (
                  <Typography variant="caption" className="error-message">
                    {errors.coachComments}
                  </Typography>
                )}
              </DialogContent>
              <DialogActions sx={{ p: 3, pt: 0, justifyContent: "center" }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleCoachClose}
                  className="dubai-med text-capitalize"
                  sx={{ mr: 1 }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  className="dubai-med text-capitalize"
                  disabled={coachCommentsResponse?.loading}
                >
                  {coachCommentsResponse?.loading ? (
                    <CircularProgress sx={{ color: "#FFFFFF" }} size="22px" />
                  ) : (
                    "Submit"
                  )}
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
          <Grid item xs={12}>
            <Box
              borderRadius={"8px"}
              height={"250px"}
              sx={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(0, 135, 85, 1), rgba(0, 88, 68, 1))",
              }}
              p={3}
            >
              <Grid
                container
                alignItems={"start"}
                justifyContent={"space-between"}
              >
                <Grid item md={8}>
                  <Tooltip title={TrainingPlansEdit?.trainingPlan}>
                    <Typography className="bukra-semi-bold goal-target-view-head text-ellipsis text-capitalize">
                      {TrainingPlansEdit?.trainingPlan}
                    </Typography>
                  </Tooltip>
                  <Box mt={1.25} display={"flex"}>
                    <Typography
                      width={"auto"}
                      className="dubai-regular goal-target-view-list"
                    >
                      Start Date:{" "}
                      <span className="dubai-med text-ellipsis">
                        {TrainingPlansEdit?.trainingStartDate}
                      </span>
                      &nbsp;&nbsp; End Date:{" "}
                      <span className="dubai-med text-ellipsis">
                        {TrainingPlansEdit?.trainingEndDate}
                      </span>
                    </Typography>
                  </Box>
                  <Box mt={1.25}>
                    <Typography
                      width={"auto"}
                      className="dubai-regular goal-target-view-list"
                      display={"flex"}
                    >
                      Assigned Coach:{" "}
                      <Tooltip
                        title={
                          TrainingPlansEdit?.assignedCoachList &&
                          TrainingPlansEdit?.assignedCoachList
                            .map(
                              (name: any) =>
                                `${name?.firstName} ${name?.middleName} ${name?.surname}`
                            )
                            ?.join(", ")
                        }
                      >
                        <span
                          className="dubai-med webkit-line-clamp webkit-1"
                          style={{ width: "200px" }}
                        >
                          {TrainingPlansEdit?.assignedCoachList ? (
                            TrainingPlansEdit?.assignedCoachList
                              .map(
                                (name: any) =>
                                  `${name?.firstName} ${name?.middleName} ${name?.surname}`
                              )
                              ?.join(", ")
                          ) : (
                            <Chip
                              label="Unassigned Coach"
                              sx={{
                                fontWeight: 400,
                                fontSize: "12px",
                                height: "20px",
                                color: "#fff",
                                background: " rgba(228, 0, 43, 1)",
                                ".MuiChip-label": {
                                  padding: "8px",
                                },
                              }}
                              className="dubai-med text-capitalize"
                            />
                          )}
                        </span>
                      </Tooltip>
                      &nbsp;&nbsp; Additional Coach:{" "}
                      <Tooltip
                        title={
                          TrainingPlansEdit?.additionalCoach &&
                          TrainingPlansEdit?.additionalCoachList
                            .map(
                              (name: any) =>
                                `${name?.firstName} ${name?.middleName} ${name?.surname}`
                            )
                            ?.join(", ")
                        }
                      >
                        <span
                          className="dubai-med webkit-line-clamp webkit-1"
                          style={{ width: "200px", marginLeft: "6px" }}
                        >
                          {TrainingPlansEdit?.additionalCoach ? (
                            TrainingPlansEdit?.additionalCoachList
                              .map(
                                (name: any) =>
                                  `${name?.firstName} ${name?.middleName} ${name?.surname}`
                              )
                              ?.join(", ")
                          ) : (
                            <Chip
                              label="Unassigned Coach"
                              sx={{
                                fontWeight: 400,
                                fontSize: "12px",
                                height: "20px",
                                color: "#fff",
                                background: " rgba(228, 0, 43, 1)",
                                ".MuiChip-label": {
                                  padding: "8px",
                                },
                              }}
                              className="dubai-med text-capitalize"
                            />
                          )}
                        </span>
                      </Tooltip>
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
                      <Typography className="bukra-semi-bold" fontSize={"14px"}>
                        Training Type
                      </Typography>
                      <Typography className="dubai-med" mt={1}>
                        {TrainingPlansEdit?.trainingType
                          ? TrainingPlansEdit?.trainingType
                          : "--"}
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
                      <Typography className="bukra-semi-bold" fontSize={"14px"}>
                        Training Frequency
                      </Typography>
                      <Typography className="dubai-med" mt={1}>
                        {TrainingPlansEdit?.trainingFrequency
                          ? TrainingPlansEdit?.trainingFrequency
                          : "--"}
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
                      <Typography className="bukra-semi-bold" fontSize={"14px"}>
                        Session Duration
                      </Typography>
                      <Typography className="dubai-med" mt={1}>
                        {TrainingPlansEdit?.sessionDuration
                          ? TrainingPlansEdit?.sessionDuration
                          : "--"}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item md={3}>
                  <Box display="flex" gap={1} justifyContent={"end"} pb={0}>
                    {checkAccess(USER_PERMISSION.TrainingPlanEdit) ? (
                      <Tooltip title="Update Training Results">
                        <Button
                          variant="contained"
                          sx={{
                            color: "#008755",
                            height: "48px",
                            backgroundColor: "#FFFFFF",
                          }}
                          startIcon={<SettingsOutlinedIcon />}
                          className="text-capitalize"
                          onClick={handleUpdateTrainingResult}
                        >
                          Update
                        </Button>
                      </Tooltip>
                    ) : null}
                    {checkAccess(USER_PERMISSION.TrainingPlanEdit) ? (
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
                          handleEditData(TrainingPlansEdit?.trainingPlanID)
                        }
                      >
                        Edit Training Plan
                      </Button>
                    ) : null}
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
                        {TrainingPlansEdit?.trainingStatus}
                      </span>
                    </Typography>
                    <Typography className="dubai-regular goal-target-view-status-list">
                      {Number(TrainingPlansEdit?.statusPercentage)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={Number(TrainingPlansEdit?.statusPercentage)}
                    sx={{
                      mb: 5,
                      mt: 1,
                      height: "8px",
                      borderRadius: "8px",
                      opacity: 1,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor:
                          Number(TrainingPlansEdit?.statusPercentage) != null &&
                          Number(TrainingPlansEdit?.statusPercentage) >= 0 &&
                          Number(TrainingPlansEdit?.statusPercentage) <= 100
                            ? "rgba(241, 235, 156, 1)"
                            : "rgba(255, 255, 255, 0.2)",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Training Objective"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent
                    content={TrainingPlansEdit?.trainingObjective}
                  />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={8} className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Warm Up Routine"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent
                    content={TrainingPlansEdit?.warmupRoutine}
                  />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Main Training Phase"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent
                    content={TrainingPlansEdit?.mainTrainingPhase}
                  />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4} className="card-height">
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Cool down Routine"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent
                    content={TrainingPlansEdit?.cooldownRoutine}
                  />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Performance Metrics"
                className="primary-color card-header"
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent
                    content={TrainingPlansEdit?.additionalNotes}
                  />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardHeader
                avatar={<ListOutlinedIcon />}
                title="Coaching Notes"
                className="primary-color card-header"
                action={
                  checkAccess(USER_PERMISSION.TrainingPlanEdit) ? (
                    <Tooltip title="Modify coaching notes">
                      <Button
                        variant="outlined"
                        size="small"
                        className="dubai-med text-capitalize"
                        startIcon={<EditOutlinedIcon />}
                        onClick={handleCoachComments}
                      >
                        Edit
                      </Button>
                    </Tooltip>
                  ) : null
                }
                sx={{ pr: 0 }}
              />
              <CardContent sx={{ py: 0 }}>
                <Typography className="dubai-med view-card-list-para">
                  <RenderEditorContent
                    content={TrainingPlansEdit?.coachingNotes}
                  />
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  );
}
