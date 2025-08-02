import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Fade,
  SnackbarCloseReason,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty, isEqual } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import CustomSnackbar from "@/components/CustomSnackbar";
import DropDown from "@/components/Fields/DropDown";
import {
  addRules,
  clearRulesAddState,
} from "@/redux/slices/rules/RulesAddSlice";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import moment from "moment";
import dayjs from "dayjs";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";

const CreateSeasonPlanner: React.FC<any> = ({
  edit,
  getTeamRequirementByIDData,
  id,
  onClose,
  setIsUpdated,
  module,
  setModule
}) => {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [assignedSportsOption, setAssignedSportsOption] = useState<any>("");

  const rulesAddData = useSelector((state: RootState) => state.rulesAdd);
  const getSportList = useSelector((state: any) => {
    return state.getSportList && state.getSportList?.data;
  });

  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      planName: "",
      sports: null,
      date: null,
      athleteType: null,
      location: "",
      description: "",
    },
  });

  const onSubmit = (data: any) => {
    const payload: any = {
      planName: data?.planName,
      sports: String(data?.sports),
      date: dayjs(data?.date).format("DD-MM-YYYY"),
      athleteType: data?.athleteType,
      location: data?.location,
      description: data?.description,
    };
    //   dispatch(
    //     addRules({
    //       url: "/InsertRulesAndAgreements",
    //       payload: payload,
    //     })
    //   );
    console.log('payload==========>', payload)
  };

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleReset = () => {
    reset({
      planName: "",
      sports: null,
      date: null,
      athleteType: null,
      location: "",
      description: "",
    });
  };

  const handleCancel = () => {
    router.back();
  };

  const handleEdit = () => {
    setModule("Update-season")
  }

  const handleEditClose = () => {
    onClose()
    setModule("View-season")
  }

  useEffect(() => {
    const assignedSports: any = getDefaultOption(getSportList);
    setAssignedSportsOption(assignedSports);
  }, [getSportList]);

  const getDefaultOption = (AssignedSports: any) => {
    const defaultOptions = [];
    for (const item in AssignedSports) {
      defaultOptions.push({
        label: AssignedSports[item].sportName,
        value: AssignedSports[item].sportID,
        icon: AssignedSports[item].sportProfile,
      });
    }
    return defaultOptions;
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  return (
    <>
      <Fade in={true} timeout={1000}>
        <Grid container spacing={0}>
          {snackbarStatus !== "" && (
            <CustomSnackbar
              message={
                snackbarStatus === "success"
                  ? `Season Planner Added successfully!`
                  : (rulesAddData && rulesAddData?.message)
              }
              severity={snackbarStatus === "success" ? "success" : "error"}
              open={snackbarOpen}
              onClose={handleSnackBarClose}
            />
          )}
          {module === "View-season" ?
            <>
              <Grid
                item
                xs={12}
                sx={{
                  paddingX: "2rem",
                  textAlign: "end",
                }}
              >
                <Button
                  variant="outlined"
                  className="text-capitalize dubai-med"
                  color="success"
                  sx={{ height: "45px" }}
                  onClick={handleEdit}
                >
                  Edit
                </Button>
              </Grid>
            </> : module === "Update-season" ? null :
              <>
                <Grid
                  item
                  xs={12}
                  sx={{
                    textAlign: "end",
                  }}
                >
                  <Button
                    variant="outlined"
                    className="text-capitalize dubai-med"
                    color="secondary"
                    sx={{ height: "45px" }}
                    onClick={handleReset}
                  >
                    Clear form
                  </Button>
                </Grid>
              </>
          }

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            display="flex"
            justifyContent="center"
            alignItems={{ xs: "top", md: "center" }}
            sx={{
              position: "relative",
              overflow: "hidden",
            }}
            px={edit ? 4 : 0}
          >
            <Box width="100%">
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2} justifyContent={"space-between"}>
                  <Grid item xs={12} md={12}>
                    <Grid
                      container
                      item
                      xs={12}
                      md={12}
                      spacing={2}
                      justifyContent={"space-between"}
                    >
                      <Grid item xs={12} md={edit ? 12 : 5.75}>
                        <CustomTextField
                          name="planName"
                          label="Plan Name"
                          placeholder="Enter Plan Name"
                          control={control}
                          required={true}
                          disabled={module === "View-season" ? true : module === "Update-season" ? false: false}
                          rules={{
                            pattern: {
                              value: /^[a-zA-Z0-9\s,.()/-]*$/,
                              message:
                                "Only Alphanumberic & hypens are allowed",
                            },
                            maxLength: {
                              value: 100,
                              message: "Plan Name cannot exceed 100 characters",
                            },
                            required: "Plan Name is required",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={edit ? 12 : 5.75}>
                        <DropDown
                          name="sports"
                          control={control}
                          label="Select Sports"
                          placeholder="Select Sports"
                          options={
                            assignedSportsOption && assignedSportsOption
                          }
                          multiple={true}
                          variant="outlined"
                          icon={true}
                          required={true}
                          disabled={module === "View-season" ? true : module === "Update-season" ? false: false}
                        />
                      </Grid>
                      <Grid item xs={12} md={edit ? 12 : 5.75}>
                        <CustomDatePicker
                          control={control}
                          name="date"
                          label="Date"
                          boxmb={0.8}
                          required={true}
                          disabled={module === "View-season" ? true : module === "Update-season" ? false: false}
                          minDate={moment().add(15, "days")}
                          maxDate={moment().add(10, "years")}
                          className="Text-field-customise"
                          rules={{
                            required: "Date is required",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={edit ? 12 : 5.75}>
                        <CustomRadioGroup
                          name="athleteType"
                          control={control}
                          label="Select Athlete Type"
                          options={[
                            { value: "Male", label: "Male", disabled: module === "View-season" ? true : module === "Update-season" ? false: false},
                            { value: "Female", label: "Female", disabled: module === "View-season" ? true : module === "Update-season" ? false: false },
                            { value: "All", label: "All", disabled: module === "View-season" ? true : module === "Update-season" ? false: false },
                          ]}
                          required={true}
                        />
                      </Grid>
                      <Grid item xs={12} md={edit ? 12 : 5.75}>
                        <CustomTextField
                          name="location"
                          label="Location"
                          placeholder="Enter Location"
                          control={control}
                          required={true}
                          disabled={module === "View-season" ? true : module === "Update-season" ? false: false}
                          rules={{
                            pattern: {
                              value: /^[a-zA-Z0-9\s,.()/-]*$/,
                              message:
                                "Only Alphanumberic & hypens are allowed",
                            },
                            maxLength: {
                              value: 100,
                              message: "Location cannot exceed 100 characters",
                            },
                            required: "Location is required",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={edit ? 12 : 5.75}>
                        <CustomTextField
                          name="description"
                          control={control}
                          label="Description"
                          placeholder="Enter Description about Season Plan"
                          textarea={true}
                          disabled={module === "View-season" ? true : module === "Update-season" ? false: false}
                          rules={{
                            pattern: {
                              value: /^[a-zA-Z0-9\s,.()/-]*$/,
                              message:
                                "Only Alphanumberic & hypens are allowed",
                            },
                            maxLength: {
                              value: 400,
                              message: "Description cannot exceed 400 characters",
                            }
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginY: "1.5rem",
                  }}
                >
                  {module === "View-season" ?
                    <>
                      <Button
                        variant="outlined"
                        className="text-capitalize dubai-med"
                        color="success"
                        sx={{ height: "45px" }}
                        onClick={handleEditClose}
                      >
                        Close
                      </Button>
                    </> : module === "Update-season" ?
                      <>
                        <Button
                          variant="outlined"
                          className="text-capitalize dubai-med"
                          color="error"
                          sx={{ height: "45px", mr: 1 }}
                          onClick={handleEditClose}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          className="text-capitalize dubai-med cancel-button"
                          disabled={
                            rulesAddData.loading
                          }
                          onClick={handleSubmit(onSubmit)}
                        >
                          {rulesAddData.loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Update"
                          )}
                        </Button>
                      </> :
                      <>
                        <Button
                          variant="outlined"
                          color="error"
                          sx={{ mr: 1 }}
                          onClick={handleCancel}
                          className="cancel-button text-capitalize dubai-med"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{ mr: 1 }}
                          className="text-capitalize dubai-med cancel-button"
                          disabled={
                            rulesAddData.loading
                          }
                          onClick={handleSubmit(onSubmit)}
                        >
                          {rulesAddData.loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Save & Add New"
                          )}
                        </Button>
                        <Button
                          type="submit"
                          variant="contained"
                          className="text-capitalize dubai-med cancel-button"
                          disabled={
                            rulesAddData.loading
                          }
                          onClick={handleSubmit(onSubmit)}
                        >
                          {rulesAddData.loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </>}
                </Box>
              </form>
            </Box>
          </Grid>
        </Grid>
      </Fade>
    </>
  );
}
export default CreateSeasonPlanner;