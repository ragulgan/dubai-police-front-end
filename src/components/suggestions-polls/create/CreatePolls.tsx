"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Fade,
  SnackbarCloseReason,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { useForm } from "react-hook-form";
import CustomSnackbar from "@/components/CustomSnackbar";
import { useRouter } from "next/router";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";
import DropDown from "@/components/Fields/DropDown";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
import {
  addSuggestionsAndPolls,
  clearSuggestionsAndPollsAddState,
} from "@/redux/slices/suggestionsAndPolls/SuggestionsAndPollsAddSlice";
import CustomTextField from "@/components/Fields/CustomTextField";
import moment from "moment";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import CustomSwitch from "@/components/Fields/CustomSwitch";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { addPollsOptions } from "@/redux/slices/suggestionsAndPolls/pollsOption/PollsOptionsAddSlice";
import AppAlertDialog from "@/components/AppAlertDialog";
import { getTokenData } from "@/utils/helper";
import MultiSelect from "@/components/Fields/MultiSelect";
import { SelectChangeEvent } from "@mui/material";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";

const CreatePollsForm = (props: any) => {
  const {
    edit,
    pollsEditData,
    id,
    onClose,
    setIsUpdated,
    backpop,
    setBackPop,
  } = props;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [assignedSportsOption, setAssignedSportsOption] = useState<any>("");
  const loginData = getTokenData()
  const [selectedSport, setSelectedSport] = useState<any>([0]);
  const suggestionsAndPollsAddData = useSelector(
    (state: RootState) => state.suggestionsAndPollsAdd
  );
  const getSportList = useSelector((state: any) => {
    return state.getSportList && state.getSportList?.data;
  });
  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      pollsQuestion: "",
      selectSport: "",
      visibility: "",
      startDate: null,
      endDate: null,
      multipleChoice: false,
      pollsOptions: [],
    },
  });
  const selecteSport = watch("selectSport") || [];
  useEffect(() => {
    let updatedArray;
    const lastElement = selecteSport.length > 0 ? selecteSport[selecteSport.length - 1] : null;
    if (lastElement !== 0) {
      updatedArray = selecteSport.filter((item: any) => item !== 0);
    } else if (selecteSport.length > 1 && lastElement === 0) {
      updatedArray = [0];
    } else {
      updatedArray = selecteSport;
    }
    if (JSON.stringify(updatedArray) !== JSON.stringify(selecteSport)) {
      setValue("selectSport", updatedArray.map(Number));
    }
  }, [selecteSport, setValue]);
  const [formData, setFormData] = useState<any>({
    pollsOptions: [
      { pollsOptions: "" },
      { pollsOptions: "" }
    ],
  });
  const [errors, setErrors] = useState<{ pollsOptions?: string }>({});
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const [dialogOpen, setDialogOpen] = useState(false);
  const onSubmit = ({ pollsOptions, ...data }: any) => {
    const filledOptionsCount = formData.pollsOptions.filter(
      (option: any) => option.pollsOptions.trim() !== ""
    ).length;

    if (filledOptionsCount < 2) {
      setErrors({ pollsOptions: "At least two options must be filled" });
      return;
    }
    setErrors({});
    if (edit) {
      const updatePayload: any = {
        ...data,
        section: "polls",
        pollsID: Number(id),
        selectSport: String(data?.selectSport),
        createdByModule: loginData?.createdModule,
        startDate: moment(data.startDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
        endDate: moment(data.endDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
      };
      dispatch(
        addSuggestionsAndPolls({
          url: "/UpdatePollsAndSuggestionsByID",
          payload: updatePayload,
        })
      );
    } else {
      const payload: any = {
        ...data,
        section: "polls",
        selectSport: String(data?.selectSport),
        createdByModule: loginData?.createdModule,
        startDate: moment(data.startDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
        endDate: moment(data.endDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
      };
      dispatch(
        addSuggestionsAndPolls({
          url: "/InsertPollsAndSuggestions",
          payload: payload,
        })
      );
    }
  };

  useEffect(() => {
    if (backpop) {
      setDialogOpen(true);
    }
  }, [backpop]);

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
      pollsQuestion: "",
      assignedSports: null,
      paragraph: null,
      shortDescription: "",
      uploadDocuments: "",
    });
    setFormData({
      pollsOptions: [
        { pollsOptions: "" },
        { pollsOptions: "" }
      ],
    });
  };

  const getSportModify = [
    // {
    //   sportID: 0,
    //   sportName: "All",
    //   sportProfile: <ScoreboardOutlinedIcon />,
    // },
    ...(!isEmpty(getSportList) ? getSportList : []),
  ];

  useEffect(() => {
    const assignedSports: any = getDefaultOption(getSportModify);
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

  useEffect(() => {
    if (suggestionsAndPollsAddData && suggestionsAndPollsAddData.code === 200) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      const filteredPollsOptions = formData.pollsOptions
        .filter((option: any) => option.pollsOptions.trim() !== "")
        .map((option: any) => ({
          pollsOptions: option.pollsOptions,
          pollsOptionsID: option.pollsOptionsID ? option.pollsOptionsID : 0,
        }));
      const params: any = {
        ...formData,
        pollsOptions: filteredPollsOptions,
        pollsID: Number(suggestionsAndPollsAddData?.data.pollsID),
      };
      setSnackbarMessage(`Polls ${id ? "Updated" : "Added"} Successfully`);
      dispatch(
        addPollsOptions({
          url: id ? "/UpdatePollsOptionByID" : "/InsertPollsOption",
          payload: params,
        })
      );
      setTimeout(() => {
        if (edit) {
          setIsUpdated(true);
          onClose();
          setTimeout(() => {
            setIsUpdated(false);
          }, 1000);
        } else {
          router.back();
        }
      }, 1000);
      dispatch(clearSuggestionsAndPollsAddState());
    } else if (
      suggestionsAndPollsAddData &&
      suggestionsAndPollsAddData.code === 500
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearSuggestionsAndPollsAddState());
    } else if (
      suggestionsAndPollsAddData &&
      suggestionsAndPollsAddData.code === 409
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearSuggestionsAndPollsAddState());
      }, 2000);
    }
  }, [suggestionsAndPollsAddData]);

  useEffect(() => {
    if (pollsEditData) {
      setValue("pollsQuestion", pollsEditData?.pollsQuestion);
      setValue(
        "selectSport",
        pollsEditData && isEmpty(pollsEditData?.selectSport)
          ? ""
          : pollsEditData?.selectSport.split(",").map(Number)
      );
      setValue("visibility", pollsEditData?.visibility);
      setValue("multipleChoice", pollsEditData?.multipleChoice);
      setValue(
        "startDate",
        moment(pollsEditData && pollsEditData.startDate, "DD/MM/YYYY")
      );
      setValue(
        "endDate",
        moment(pollsEditData && pollsEditData.endDate, "DD/MM/YYYY")
      );
      setFormData({
        ...formData,
        pollsOptions: pollsEditData.pollsOptionList?.length
          ? pollsEditData.pollsOptionList.map((option: any) => ({
            pollsOptions: option.pollsOptions,
            pollsOptionsID: option.pollsOptionsID,
          }))
          : [{ pollsOptions: "", pollsOptionsId: "" }],
      });
    }
  }, [pollsEditData]);

  const handleChange = (index: number, value: string) => {
    setFormData((prevFormData: any) => {
      const updatedOptions = [...prevFormData.pollsOptions];
      updatedOptions[index] = { ...updatedOptions[index], pollsOptions: value }; // Allow empty value
      setValue("pollsOptions", updatedOptions);
      return { ...prevFormData, pollsOptions: updatedOptions };
    });
  };

  const handleAddOption = () => {
    setFormData({
      ...formData,
      pollsOptions: [...formData.pollsOptions, { pollsOptions: "" }],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (formData.pollsOptions.length > 1) {
      const updatedOptions = formData.pollsOptions.filter(
        (_option: any, i: any) => i !== index
      );
      setFormData({ ...formData, pollsOptions: updatedOptions });
    }
  };

  const closeAdd = () => {
    if (id) {
      onClose();
    } else {
      setDialogOpen(true);
    }
  };

  const handleDialogDisagree = () => {
    setDialogOpen(false);
    setBackPop(false);
  };

  const handleDialogAgree = () => {
    if (id) {
      onClose();
    }
    setDialogOpen(false);
    setBackPop(false);
    router.back();
  };
  const minEndDate: any = startDate && moment(startDate).isValid()
    ? moment(startDate)
    : null;


  const handleSportSelect = (event: SelectChangeEvent<any>) => {
    const {
      target: { value },
    } = event;
    const selected = Array.isArray(value) ? value : [];
    let updatedArray;
    const lastElement = selected.length > 0 ? selected[selected.length - 1] : null;
    if (lastElement !== 0) {
      updatedArray = selected.filter((item) => item !== 0);
    } else if (selected.length > 1 && lastElement === 0) {
      updatedArray = [0];
    } else {
      updatedArray = selected;
    }
    setSelectedSport(updatedArray); // Update state with the new selection
    setValue(
      "selectSport",
      updatedArray.length === 0 ? "" : updatedArray.map(Number)
    );
  };

  return (
    <>
      {dialogOpen && (
        <AppAlertDialog
          open={dialogOpen}
          onClose={handleDialogDisagree}
          title="Discard Changes"
          description="You have unsaved changes. Do you really want to leave this page?"
          onAgree={handleDialogAgree}
          onDisagree={handleDialogDisagree}
          agreeLabel="Discard"
          disagreeLabel="Cancel"
        />
      )}
      {pollsEditData && pollsEditData?.loading ? (
        <EditFieldSkeleton isAvatar={true} />
      ) : (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={0}>
            {snackbarStatus !== "" && (
              <CustomSnackbar
                message={snackbarMessage}
                severity={snackbarStatus === "success" ? "success" : "error"}
                open={snackbarOpen}
                onClose={handleSnackBarClose}
              />
            )}
            {edit ? null : (
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
            )}
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
            >
              <Box width="100%">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2}>
                    <Grid
                      container
                      item
                      xs={12}
                      md={6}
                      spacing={2}
                      justifyContent={"space-between"}
                    >
                      <Grid item xs={12} md={11}>
                        <CustomTextField
                          name="pollsQuestion"
                          label="Polls Question"
                          placeholder="Enter New Polls Question"
                          control={control}
                          required={true}
                          rules={{
                            pattern: {
                              value: /^[a-zA-Z0-9\s,.:()/-?""]*$/,
                              message:
                                "Only Alphanumberic & hypens are allowed",
                            },
                            maxLength: {
                              value: 100,
                              message:
                                "Polls Question cannot exceed 100 characters",
                            },
                            required: "Polls Question is required",
                          }}
                          onKeyPress={(event) => {
                            const regex = /^[a-zA-Z0-9\s,.:()/-?""]$/;
                            if (!regex.test(event.key)) {
                              event.preventDefault();
                            }
                          }}
                        />
                      </Grid>
                      <Grid container item xs={12} md={11} spacing={2}>
                        <Grid item xs={6}>
                          <TrainingCampCustomDatePicker
                            control={control}
                            name="startDate"
                            label="Start Date"
                            boxmb={0.8}
                            required={true}
                            minDate={moment()}
                            maxDate={moment().add(10, "years")}
                            // maxDate={
                            //   endDate
                            //     ? moment(endDate).add(1, "day")
                            //     : moment().add(10, "years")
                            // }
                            className="Text-field-customise"
                            rules={{
                              required: "Start Date is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <TrainingCampCustomDatePicker
                            control={control}
                            name="endDate"
                            label="End Date"
                            boxmb={0.8}
                            required={true}
                            minDate={minEndDate}
                            disabled={!minEndDate}
                            maxDate={moment().add(10, "years")}
                            className="Text-field-customise"
                            rules={
                              !minEndDate
                                ? { required: "" }
                                : { required: "End Date is required" }
                            }
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={12} md={11}>
                        <DropDown
                          name="selectSport"
                          control={control}
                          label="Select Sport"
                          placeholder="Select Sport"
                          options={
                            assignedSportsOption && assignedSportsOption
                          }
                          multiple={true}
                          variant="outlined"
                          icon={true}
                          required={true}
                          module="rules"
                          rules={{
                            required: "Select Sport is required",
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} md={11}>
                        <CustomSwitch
                          name="multipleChoice"
                          control={control}
                          label="Multiple Choice"
                          required={false}
                        />
                      </Grid>
                      <Grid item xs={12} md={11}>
                        <CustomRadioGroup
                          name="visibility"
                          control={control}
                          label="Visibility"
                          options={[
                            { value: "all", label: "All" },
                            { value: "admin", label: "Admin" },
                            { value: "coach", label: "Coach" },
                            { value: "athlete", label: "Athlete" },
                          ]}
                          required={true}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      md={6}
                      spacing={2}
                      justifyContent={"space-between"}
                    >
                      <Typography
                        gutterBottom
                        className="typography textfield-label bukra"
                      >
                        Poll Options <span className="asterisk">*</span>
                      </Typography>
                      <Box
                        sx={{
                          width: 486,
                          borderRadius: 4,
                          border: "1px solid rgba(222, 222, 222, 1)",
                          padding: 2,
                          gap: 2,
                          display: "flex",
                          flexDirection: "column",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <Grid container spacing={2}>
                          {formData.pollsOptions.map(
                            (option: any, index: number) => (
                              <>
                                <Grid item xs={12} md={8} key={index}>
                                  <CustomTextField
                                    label={`Option ${index + 1}`}
                                    placeholder={`Option ${index + 1}`}
                                    value={option.pollsOptions}
                                    control={control}
                                    onChange={(e) =>
                                      handleChange(index, e.target.value)
                                    }
                                    name={""}
                                    rules={{
                                      pattern: {
                                        value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                                        message:
                                          "Only Alphanumberic & hypens are allowed",
                                      },
                                      maxLength: {
                                        value: 100,
                                        message:
                                          "Option cannot exceed 100 characters",
                                      },
                                    }}
                                    onKeyPress={(event) => {
                                      const regex = /^[a-zA-Z0-9\s,.:()/-]$/;
                                      if (!regex.test(event.key)) {
                                        event.preventDefault();
                                      }
                                    }}
                                  />
                                </Grid>
                                <Grid item xs={12} md={4} key={index}>
                                  {index > 1 && (
                                    <Button
                                      variant="outlined"
                                      style={{
                                        marginTop: "25px",
                                      }}
                                      color="error"
                                      className="text-capitalize"
                                      onClick={() => handleRemoveOption(index)}
                                      startIcon={<RemoveCircleOutlineIcon />}
                                    >
                                      Remove
                                    </Button>
                                  )}
                                </Grid>
                              </>
                            )
                          )}
                          <Box mt={2} ml={2}>
                            {errors.pollsOptions && (
                              <Typography
                                variant="caption"
                                className="error-message"
                              >
                                {errors.pollsOptions}
                              </Typography>
                            )}
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                              }}
                            >
                              <Button
                                variant="outlined"
                                className="text-capitalize"
                                onClick={handleAddOption}
                                startIcon={<AddBoxOutlinedIcon />}
                                style={{
                                  color: "rgba(0, 66, 106, 1)",
                                  borderColor: "rgba(0, 66, 106, 1)",
                                  border: "transparent",
                                }}
                              >
                                Add Option
                              </Button>
                            </Box>
                          </Box>
                        </Grid>
                      </Box>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginY: "1.5rem",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ mr: 1 }}
                      onClick={closeAdd}
                      className="cancel-button text-capitalize dubai-med"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize dubai-med cancel-button"
                      disabled={suggestionsAndPollsAddData.loading}
                      onClick={handleSubmit(onSubmit)}
                    >
                      {suggestionsAndPollsAddData.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : edit ? (
                        "Update"
                      ) : (
                        "Save & Publish"
                      )}
                    </Button>
                  </Box>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      )}
    </>
  );
};
export default CreatePollsForm;
