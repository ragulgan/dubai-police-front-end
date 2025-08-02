"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Alert,
  Grid,
  Button,
  SnackbarCloseReason,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { editAthlete } from "@/redux/slices/athlete/athleteEditSlice";
import _ from "lodash";
import moment from "moment";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import FieldSkeleton from "../../Forms/FieldSkeleton";
import ReactSelect from "../../Fields/ReactSelect";
import CustomTextField from "../../Fields/CustomTextField";
import LoadingButton from "@mui/lab/LoadingButton";
import CustomDatePicker from "../../Fields/CustomDatePicker";
import {
  editNutrition,
  clearEditState,
} from "@/redux/slices/nutrition/NutritionEditSlice";
import { getPlanListAPI } from "@/redux/slices/planMenu/getPlanListSlice";
import {
  clearUpdateState,
  UpdateNutrition,
} from "@/redux/slices/nutrition/NutritionUpdateSlice";
import { listNutrition } from "@/redux/slices/nutrition/NutritionListSlice";
import CustomSnackbar from "@/components/CustomSnackbar";

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  id: number;
  module?: string;
  setIsOpen?: any;
}

const EditNutrition: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  id,
  module,
  setIsOpen,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { teamID } = router.query;
  const [AthletesOption, setAthletesOption] = useState();
  const [planOption, setPlanOption] = useState<any[]>([]);
  const [SelectedAthletesOption, setSelectedAthletesOption] =
    useState<any>(null);
  const [SelectedPlanNameOption, setSelectedPlanNameOption] =
    useState<any>(null);
  const [errors, setErrors] = useState<any>({});
  const [minEndDate, setMinEndDate] = useState(moment());
  const [heightUnit, setHeightUnit] = useState<any>(null);
  const [weightUnit, setWeightUnit] = useState<any>(null);
  const [athleteEdit, setAthleteEdit] = useState<any>(false);
  const getAthleteList = useSelector((state: any) => state.getAthleteList);
  const athleteData = getAthleteList && getAthleteList?.data;
  const getPlanList = useSelector((state: any) => state.getPlanList);
  const planData = getPlanList && getPlanList?.data;
  const athleteEditData = useSelector((state: any) => state.athleteEdit?.data);
  const athleteEditDataLoading = useSelector(
    (state: any) => state.athleteEdit?.loading
  );
  const nutritionEditDataLoading = useSelector(
    (state: any) => state.nutritionEdit?.loading
  );
  const editNutritionData = useSelector(
    (state: RootState) => state.editNutrition
  );
  const nutritionUpdateData = useSelector(
    (state: any) => state.updatedNutrition
  );
  const editData: any = editNutritionData && editNutritionData.data;
  const [snackbarStatus, setSnackbarStatus] = useState<any>();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);

  const { handleSubmit, reset, control, setValue, watch } = useForm<any>({
    defaultValues: {
      athletes: null,
      plan: null,
      weight: "",
      height: "",
      startDate: null,
      endDate: null,
      nutritionistComment: "",
    },
  });
  const startDate = watch("startDate");

  useEffect(() => {
    if (id) {
      const payload: any = {
        nutritionID: id,
        sportID: Number(teamID),
      };
      dispatch(editNutrition(payload));
    }
  }, [id]);

  const getDefaultOptions = (AthleteList: any) => {
    const defaultOptions = [];
    for (const item in AthleteList) {
      defaultOptions.push({
        label: AthleteList[item].firstName,
        value: AthleteList[item].athleteID,
      });
    }
    return defaultOptions;
  };

  const getDefaultPlanOption = (planNames: any) => {
    const defaultOptions = [];
    for (const item in planNames) {
      defaultOptions.push({
        label: planNames[item].nutritionplanName,
        value: planNames[item].nutritionplanID,
      });
    }
    return defaultOptions;
  };

  useEffect(() => {
    setMinEndDate(moment(startDate, "DD/MM/YYYY"));
  }, [startDate]);

  const handleChangeAthletes = (selectedOption: any | null): void => {
    if (
      selectedOption &&
      selectedOption.label === SelectedAthletesOption?.label
    ) {
      setSelectedAthletesOption("");
    } else {
      setSelectedAthletesOption(selectedOption);
      setErrors({ ...errors, athletes: "" });
      const payload: any = {
        athleteID: selectedOption && selectedOption.value,
        sportID: teamID,
      };
      dispatch(editAthlete(payload));
      setAthleteEdit(true);
    }
  };

  const handleChangePlanName = (selectedOption: any | null): void => {
    if (
      selectedOption &&
      selectedOption.label === SelectedPlanNameOption?.label
    ) {
      setSelectedPlanNameOption("");
    } else {
      setSelectedPlanNameOption(selectedOption);
      setErrors({ ...errors, plan: "" });
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = (formData: any) => {
    const validationErrors: any = {};
    if (_.isEmpty(formData.endDate)) {
      validationErrors.endDate = "Please select an end date.";
      document.getElementById("endDate")?.focus();
    }
    if (_.isEmpty(formData.startDate)) {
      validationErrors.startDate = "Please select an start date.";
      document.getElementById("startDate")?.focus();
    }
    if (_.isEmpty(formData.plan)) {
      validationErrors.plan = "Please select an plan name.";
      document.getElementById("plan")?.focus();
    }
    if (_.isEmpty(formData.athletes)) {
      validationErrors.athletes = "Please select an athlete.";
      document.getElementById("athletes")?.focus();
    }
    setErrors(validationErrors);

    if (_.isEmpty(validationErrors)) {
      const data = {
        nutritionID: id,
        athleteID: SelectedAthletesOption?.value,
        planID: SelectedPlanNameOption?.value,
        weight: formData?.weight,
        height: formData?.height,
        startDate: moment(formData?.startDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        endDate: moment(formData?.endDate, "DD/MM/YYYY").format("DD/MM/YYYY"),
        nutritionistComment: formData?.nutritionistComment,
      };
      dispatch(UpdateNutrition(data));
    }
  };

  useEffect(() => {
    if (nutritionUpdateData && nutritionUpdateData.code === 200) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      setTimeout(() => {
        dispatch(clearUpdateState());
        setSnackbarOpen(false);
        setIsOpen(false);
      }, 2000);
    } else if (nutritionUpdateData && nutritionUpdateData.code === 500) {
      setSnackbarOpen(true);
      setSnackbarStatus(nutritionUpdateData.code);
      setTimeout(() => {
        dispatch(clearUpdateState());
        setSnackbarOpen(false);
      }, 3000);
    }
  }, [nutritionUpdateData]);

  useEffect(() => {
    const athletes: any = getDefaultOptions(athleteData);
    setAthletesOption(athletes);
  }, [athleteData]);

  useEffect(() => {
    const plan: any = getDefaultPlanOption(planData);
    setPlanOption(plan);
  }, [planData]);

  useEffect(() => {
    if (!_.isEmpty(teamID)) {
      const payloads = {
        searchText: "",
        filteredBy: "",
        paginationCount: 0,
        paginationIndex: 0,
        sportID: Number(teamID),
      };
      dispatch(getAthleteListAPI(payloads));
    }
  }, [teamID]);

  useEffect(() => {
    if (!_.isEmpty(teamID)) {
      const payloads = {
        sportID: Number(teamID),
      };
      dispatch(getPlanListAPI(payloads));
    }
  }, [teamID]);

  useEffect(() => {
    if (!_.isEmpty(editData) && !athleteEdit) {
      setValue("athletes", editData?.athleteFirstName);
      setValue("plan", editData?.planName);
      setValue("weight", editData?.weight);
      setValue("height", editData?.height);
      setWeightUnit(editData && editData?.weightUnit);
      setHeightUnit(editData && editData?.heightUnit);
      setValue("startDate", editData?.startDate);
      setValue("endDate", editData?.endDate);
      setValue("nutritionistComment", editData?.nutritionistComment);
      setSelectedAthletesOption({
        label: editData?.athleteFirstName || "",
        value: editData?.athleteID || "",
      });
      setSelectedPlanNameOption({
        label: editData?.planName || "",
        value: editData?.planID || "",
      });
    } else if (!_.isEmpty(athleteEditData) && athleteEdit) {
      setValue("athletes", editData?.athleteFirstName);
      setValue("plan", editData?.planName);
      setValue("weight", athleteEditData[0]?.weight);
      setValue("height", athleteEditData[0]?.height);
      setWeightUnit(athleteEditData[0]?.weightUnit);
      setHeightUnit(athleteEditData[0]?.heightUnit);
      setValue("startDate", editData?.startDate);
      setValue("endDate", editData?.endDate);
      setValue("nutritionistComment", editData?.nutritionistComment);
      setSelectedPlanNameOption({
        label: editData?.planName || "",
        value: editData?.planID || "",
      });
    }
  }, [editData, athleteEditData]);

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        reset({
          athletes: null,
          plan: null,
          weight: "",
          height: "",
          startDate: null,
          endDate: null,
          nutritionistComment: "",
        });
        setSnackbarOpen(false);
        dispatch(clearUpdateState());
        const payload = {
          searchText: "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 0,
          sportID: Number(teamID),
        };
        dispatch(listNutrition({ url: "/GetNutritionList", payload }));
      }, 1500);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => {
        onClose();
        reset({
          athletes: null,
          plan: null,
          weight: "",
          height: "",
          startDate: null,
          endDate: null,
          nutritionistComment: "",
        });
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: 550,
          py: 2,
        },
      }}
    >
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? `Nutrition Plan ${"Updated"} successfully!`
              : "Something went wrong"
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleSnackBarClose}
        />
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
        borderBottom={"1px solid rgba(88, 88, 91, 0.4)"}
        pb={1.5}
      >
        <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
          Edit Nutrition
        </Typography>
        <IconButton
          onClick={() => {
            onClose();
            reset({
              athletes: null,
              plan: null,
              weight: "",
              height: "",
              startDate: null,
              endDate: null,
              nutritionistComment: "",
            });
            dispatch(clearEditState());
          }}
          size="small"
          sx={{mr: 2}}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box>
        <Box px={5}>
          {!nutritionEditDataLoading ? (
            !nutritionEditDataLoading ? (
              <Grid
                container
                columnSpacing={5}
                rowSpacing={3}
                component={"form"}
                mt={2}
              >
                <Grid item sm={12} lg={12}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Athlete Name
                    <span style={{ color: "#E4002B", marginLeft: "4px" }}>
                      *
                    </span>
                  </Typography>
                  <ReactSelect
                    control={control}
                    name="athletes"
                    id="athletes"
                    classNamePrefix="select"
                    handleChangeReactSelect={handleChangeAthletes}
                    options={AthletesOption}
                    value={
                      SelectedAthletesOption &&
                      SelectedAthletesOption.label === ""
                        ? null
                        : SelectedAthletesOption
                    }
                    isDisabled={!AthletesOption}
                    placeholder={"Select Athlete Name"}
                    isClearable={false}
                  />
                  {errors.athletes && (
                    <Typography variant="caption" color="error">
                      {errors.athletes}
                    </Typography>
                  )}
                </Grid>
                <Grid item sm={12} lg={12}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Plan Name
                    <span style={{ color: "#E4002B", marginLeft: "4px" }}>
                      *
                    </span>
                  </Typography>
                  <ReactSelect
                    control={control}
                    name="plan"
                    id="plan"
                    classNamePrefix="select"
                    handleChangeReactSelect={handleChangePlanName}
                    options={planOption}
                    value={
                      SelectedPlanNameOption &&
                      SelectedPlanNameOption.label === ""
                        ? null
                        : SelectedPlanNameOption
                    }
                    isDisabled={!planOption}
                    placeholder={"Select Plan Name"}
                    isClearable={false}
                  />
                  {errors.plan && (
                    <Typography variant="caption" color="error">
                      {errors.plan}
                    </Typography>
                  )}
                </Grid>
                <Grid item sm={12} lg={12}>
                  <CustomTextField
                    name="weight"
                    label={`Weight (${weightUnit ? weightUnit : "KG"})`}
                    placeholder="Weight is auto-filled"
                    control={control}
                    disabled={true}
                  />
                </Grid>
                <Grid item sm={12} lg={12}>
                  <CustomTextField
                    control={control}
                    name="height"
                    label={`Height (${heightUnit ? heightUnit : "CM"})`}
                    placeholder="Height is auto-filled"
                    disabled={true}
                  />
                </Grid>
                <Grid item sm={12} lg={12}>
                  <CustomDatePicker
                    control={control}
                    label="Start Date"
                    name="startDate"
                    required={true}
                    minDate={moment()}
                    maxDate={moment().add(10, "years")}
                    setErrors={setErrors}
                    errors={errors}
                    module="nutrition"
                    defaultValue={editData && editData.startDate}
                  />
                  {errors.startDate && (
                    <Typography variant="caption" color="error">
                      {errors.startDate}
                    </Typography>
                  )}
                </Grid>
                <Grid item sm={12} lg={12}>
                  <CustomDatePicker
                    control={control}
                    label="End Date"
                    name="endDate"
                    required={true}
                    minDate={minEndDate}
                    maxDate={moment().add(10, "years")}
                    setErrors={setErrors}
                    errors={errors}
                    module="nutrition"
                    defaultValue={editData && editData.endDate}
                  />
                  {errors.endDate && (
                    <Typography variant="caption" color="error">
                      {errors.endDate}
                    </Typography>
                  )}
                </Grid>
                <Grid item sm={12} lg={12}>
                  <CustomTextField
                    name="nutritionistComment"
                    label="Nutritionist Comment"
                    placeholder="Enter Nutritionist Comment"
                    control={control}
                    textarea={true}
                    rules={{
                      pattern: {
                        value: /^[a-zA-Z0-9 %.,/'"()-:;!?&\n]*$/,
                        message: "Invalid Format",
                      },
                      maxLength: {
                        value: 2000,
                        message:
                          "Nutritionist Comment cannot exceed 2000 characters",
                      },
                      required: false,
                    }}
                  />
                </Grid>
                <Grid item sm={12} lg={12} textAlign={"end"} mt={5}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{ mr: 1 }}
                    disabled={
                      nutritionEditDataLoading || athleteEditDataLoading
                    }
                    onClick={() => {
                      onClose();
                      reset({
                        athletes: null,
                        plan: null,
                        weight: "",
                        height: "",
                        startDate: null,
                        endDate: null,
                        nutritionistComment: "",
                      });
                      dispatch(clearEditState());
                    }}
                    className="cancel-button text-capitalize dubai-med"
                  >
                    Back
                  </Button>
                  <LoadingButton
                    type="submit"
                    onClick={handleSubmit(onSubmit)}
                    loading={
                      nutritionUpdateData.loading || athleteEditDataLoading
                    }
                    variant="contained"
                    className="cancel-button text-capitalize dubai-med"
                    disabled={nutritionEditDataLoading}
                  >
                    Update
                  </LoadingButton>
                </Grid>
              </Grid>
            ) : (
              <FieldSkeleton isAvatar={false} />
            )
          ) : (
            <Stack spacing={1} alignItems="flex-start">
              <Alert className="dubai-med" severity="error">
                Something went wrong
              </Alert>
            </Stack>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default EditNutrition;
