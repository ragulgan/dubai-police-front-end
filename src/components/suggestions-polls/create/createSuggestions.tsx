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
import FormWithSunEditor from "@/components/useFormSunEditor";
import CustomSnackbar from "@/components/CustomSnackbar";
import { useRouter } from "next/router";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";
import DropDown from "@/components/Fields/DropDown";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
import {
  addSuggestionsAndPolls,
  clearSuggestionsAndPollsAddState,
} from "@/redux/slices/suggestionsAndPolls/SuggestionsAndPollsAddSlice";
import AppAlertDialog from "@/components/AppAlertDialog";
import { getTokenData } from "@/utils/helper";
import ScoreboardOutlinedIcon from "@mui/icons-material/ScoreboardOutlined";
import MultiSelect from "@/components/Fields/MultiSelect";
import { SelectChangeEvent } from "@mui/material";

const CreateSuggestionForm = (props: any) => {
  const {
    edit,
    suggestionEditData,
    id,
    onClose,
    setIsUpdated,
    setBackPop,
    backpop,
  } = props;
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [assignedSportsOption, setAssignedSportsOption] = useState<any>("");
  const [selectedSport, setSelectedSport] = useState<any>([0]);

  const suggestionsAndPollsAddData = useSelector(
    (state: RootState) => state.suggestionsAndPollsAdd
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const getSportList = useSelector((state: any) => {
    return state.getSportList && state.getSportList?.data;
  });
  const loginData = getTokenData()

  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      selectSport: "",
      Suggestion: "",
      assignedSports: "",
      visibility: "",
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

  const onSubmit = (data: any) => {
    if (edit) {
      const updatePayload: any = {
        section: "suggestions",
        suggestion: data?.suggestion,
        selectSport: String(data?.selectSport),
        visibility: data?.visibility,
        suggestionsID: Number(id),
        createdByModule: loginData?.roleModule,
      };
      dispatch(
        addSuggestionsAndPolls({
          url: "/UpdatePollsAndSuggestionsByID",
          payload: updatePayload,
        })
      );
    } else {
      const payload: any = {
        section: "suggestions",
        suggestion: data?.suggestion,
        selectSport: String(data?.selectSport),
        visibility: data?.visibility,
        createdByModule: loginData?.roleModule,
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
      title: "",
      assignedSports: null,
      paragraph: null,
      shortDescription: "",
      uploadDocuments: "",
    });
  };

  const getSportModify = [
    // {
    //   sportID: 0,
    //   sportName: "All",
    //   categoryType: "All",
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
      dispatch(clearSuggestionsAndPollsAddState());
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
    if (suggestionEditData) {
      setValue(
        "suggestion",
        suggestionEditData && suggestionEditData.suggestion
      );
      setValue(
        "selectSport",
        suggestionEditData && isEmpty(suggestionEditData?.selectSport)
          ? ""
          : suggestionEditData?.selectSport.split(",").map(Number)
      );
      setValue(
        "visibility",
        suggestionEditData && suggestionEditData?.visibility
      );
    }
  }, [suggestionEditData]);

  const handleCancel = () => {
    if (edit) {
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
      {suggestionEditData && suggestionEditData?.loading ? (
        <EditFieldSkeleton isAvatar={true} />
      ) : (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={0}>
            {snackbarStatus !== "" && (
              <CustomSnackbar
                message={
                  snackbarStatus === "success"
                    ? `Suggestions ${edit ? "Updated" : "Added"} successfully!`
                    : suggestionsAndPollsAddData &&
                    suggestionsAndPollsAddData?.message
                }
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
                        <Grid item xs={12} md={5.75}>
                          <FormWithSunEditor
                            name="suggestion"
                            control={control}
                            minHeight={"200px"}
                            label="Suggestion"
                            module={"Suggestion"}
                            rules={{
                              required: "Suggestion is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
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
                        <Grid item xs={12} md={5.75}>
                          <DropDown
                            name="selectSport"
                            control={control}
                            label="Select Sport"
                            placeholder="Select Sport"
                            options={
                              assignedSportsOption && assignedSportsOption
                            }
                            multiple={true}
                            required={true}
                            variant="outlined"
                            icon={true}
                            module="rules"
                            rules={{
                              required: "Select Sport is required",
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
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ mr: 1 }}
                      onClick={handleCancel}
                      className="dubai-med cancel-button text-capitalize"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="dubai-med text-capitalize cancel-button"
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
export default CreateSuggestionForm;
