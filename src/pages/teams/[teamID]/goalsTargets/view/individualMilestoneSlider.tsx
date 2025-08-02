"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  styled,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { AppDispatch } from "@/redux/store";
import { usePathname } from "next/navigation";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import { REGEX } from "@/utils/constants";
import CustomSnackbar from "@/components/CustomSnackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import ReactSelect from "@/components/Fields/ReactSelect";
import {
  dateSorting,
  formatDate,
  formatDates,
  trimFormData,
} from "@/utils/helper";
import {
  addIndividualMilestone,
  clearAddState,
} from "@/redux/slices/goalsTargets/individualMilestoneAddSlice";
import { editGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsEditSlice";
import {
  UpdateIndividualMilestone,
  clearUpdateState,
} from "@/redux/slices/goalsTargets/individualMilestoneEditSlice";
import { listChart } from "@/redux/slices/goalsTargets/chartListSlice";
import { useRouter } from "next/router";

const CustomTextField = styled(TextField)(({ theme }) => ({
  height: "40px",
  borderRadius: "4px 0px 0px 0px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#00875508",
    "& fieldset": {
      borderColor: "#40a377",
    },
    "&:hover fieldset": {
      borderColor: "#40a377",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#40a377",
    },
  },
  "& input": {
    fontFamily: "Roboto",
    paddingLeft: "10px",
    color: "#000000",
    height: "8px",
  },
  "& input::placeholder": {
    color: "#58585B",
    opacity: 1,
  },
  "& .Mui-error": {
    "& fieldset": {
      borderColor: "red",
    },
  },
}));

const IndividualMilestoneSlider = (props: any) => {
  const { editGoalsTargetsData, id, onClose } = props;
  const { handleSubmit, control } = useForm();
  const router = useRouter();
  const { seasonID } = router.query;
  const dispatch: AppDispatch = useDispatch();
  const individualMilestoneData = useSelector(
    (state: any) => state.individualMilestone
  );
  const individualMilestoneEditData = useSelector(
    (state: any) => state.individualMilestoneEdit
  );
  const goalsTargetsUpdateData = useSelector(
    (state: any) => state.updatedGoalsTargets
  );
  const editgoalsTargetsUpdateData =
    editGoalsTargetsData &&
    editGoalsTargetsData.data &&
    editGoalsTargetsData.data[0];

  const [formData, setFormData] = useState<any>({
    goal: "",
    milestonePercentage: "",
    status: "",
    description: "",
    milestoneStartDate: "",
    milestoneEndDate: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>();
  const status = [
    { label: "Yet to Start", value: "notStarted" },
    { label: "In Progress", value: "inprogress" },
    { label: "Completed", value: "completed" },
  ];
  const [SelectedAthletesOption, setSelectedAthletesOption] = useState("");
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const goalId = currentNav?.split("/")[5];
  const sortedMilestoneData: any = dateSorting(
    editGoalsTargetsData &&
      editGoalsTargetsData?.data &&
      editGoalsTargetsData?.data[0]?.mileStoneList
  );

  useEffect(() => {
    const data =
      editGoalsTargetsData &&
      editGoalsTargetsData.data &&
      editGoalsTargetsData.data[0];
    if (!_.isEmpty(data)) {
      setFormData({
        goal: "",
        completedDate: "",
        milestonePercentage: "",
        status: "",
        description: "",
      });
    }
  }, [editGoalsTargetsData]);

  const minPercentage =
    sortedMilestoneData &&
    sortedMilestoneData[sortedMilestoneData.length - 1]?.milestonePercentage;
  const maxPercentage =
    sortedMilestoneData &&
    sortedMilestoneData?.findIndex(
      (item: any) => item.individualMileStoneID === id?.individualMileStoneID
    );
  const minDate: any = moment(
    sortedMilestoneData &&
      sortedMilestoneData[sortedMilestoneData.length - 1]?.completedDate,
    "DD/MM/YYYY"
  ).add(1, "days");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const dateChange = (data: any) => {
    setFormData({ ...formData, [data.name]: data.value });
    setErrors({
      ...errors,
      [data.name]: "",
    });
  };

  const onSubmit = () => {
    const validationErrors: any = {};
    if (_.isEmpty(formData.status)) {
      validationErrors.status = "Status is required";
      document.getElementById("status")?.focus();
    }

    if (_.isEmpty(formData.milestoneStartDate)) {
      validationErrors.milestoneStartDate = "Start Date is required";
      document.getElementById("milestoneStartDate")?.focus();
    } else {
      const startDate = moment(
        formData.milestoneStartDate,
        "DD/MM/YYYY"
      ).startOf("day");
      const minStartDate = editgoalsTargetsUpdateData?.startDate
        ? moment(editgoalsTargetsUpdateData.startDate, "DD/MM/YYYY").startOf(
            "day"
          )
        : moment().startOf("day");
      const minEndDate = editgoalsTargetsUpdateData.endDate
        ? moment(editgoalsTargetsUpdateData.endDate, "DD/MM/YYYY").startOf(
            "day"
          ) // End Date should be after or same as Start Date
        : moment().startOf("day");

      if (startDate.isBefore(minStartDate)) {
        validationErrors.milestoneStartDate = `Start Date cannot be before ${minStartDate.format(
          "DD/MM/YYYY"
        )}`;
        document.getElementById("startDate")?.focus();
      }

      if (startDate.isAfter(minEndDate)) {
        validationErrors.milestoneStartDate = `Start Date cannot be after ${minEndDate.format(
          "DD/MM/YYYY"
        )}`;
        document.getElementById("startDate")?.focus();
      }
    }
    if (_.isEmpty(formData.milestoneEndDate)) {
      validationErrors.milestoneEndDate = "End Date is required";
      document.getElementById("milestoneEndDate")?.focus();
    } else {
      const endDate = moment(formData.milestoneEndDate, "DD/MM/YYYY").startOf(
        "day"
      );
      const minEndDate = formData.milestoneStartDate
        ? moment(formData.milestoneStartDate, "DD/MM/YYYY").startOf("day")
        : moment().subtract(50, "years");

      const maxEndDate = editgoalsTargetsUpdateData?.endDate
        ? moment(editgoalsTargetsUpdateData.endDate, "DD/MM/YYYY").startOf(
            "day"
          )
        : moment().endOf("day");

      if (endDate.isBefore(minEndDate)) {
        validationErrors.milestoneEndDate =
          "End Date cannot be before Start Date";
        document.getElementById("milestoneEndDate")?.focus();
      } else if (endDate.isAfter(maxEndDate)) {
        validationErrors.milestoneEndDate = `End Date cannot be after ${maxEndDate.format(
          "DD/MM/YYYY"
        )}`;
        document.getElementById("milestoneEndDate")?.focus();
      }
    }
    if (_.isEmpty(formData.milestonePercentage.toString())) {
      validationErrors.milestonePercentage = "Percentage is required";
      document.getElementById("milestonePercentage")?.focus();
    } else if (isNaN(formData.milestonePercentage)) {
      validationErrors.milestonePercentage = "Percentage must be a number";
      document.getElementById("milestonePercentage")?.focus();
    } else if (formData.milestonePercentage < 0) {
      validationErrors.milestonePercentage = "Percentage cannot be less than 0";
      document.getElementById("milestonePercentage")?.focus();
    } else if (id === null && +formData.milestonePercentage <= +minPercentage) {
      validationErrors.milestonePercentage =
        "Percentage must be greater than the previous milestone";
      document.getElementById("milestonePercentage")?.focus();
    } else if (
      id &&
      +formData.milestonePercentage <=
        +sortedMilestoneData[maxPercentage - 1]?.milestonePercentage
    ) {
      validationErrors.milestonePercentage =
        "Percentage must be greater than the previous milestone";
      document.getElementById("milestonePercentage")?.focus();
    } else if (
      id &&
      +formData.milestonePercentage >=
        +sortedMilestoneData[maxPercentage + 1]?.milestonePercentage
    ) {
      validationErrors.milestonePercentage =
        "Percentage must be lesser than the next milestone";
      document.getElementById("milestonePercentage")?.focus();
    } else if (formData.milestonePercentage > 100) {
      validationErrors.milestonePercentage = "Percentage cannot exceed 100";
      document.getElementById("milestonePercentage")?.focus();
    }
    if (_.isEmpty(formData.goal)) {
      validationErrors.goal = "Goal is required";
      document.getElementById("goal")?.focus();
    }
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const { athleteName, ...rest } = formData;
      if (id === null) {
        const trimmedRest = trimFormData(rest);
        const data = {
          ...trimmedRest,
          milestoneStartDate: moment(
            formData.milestoneStartDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),
          milestoneEndDate: moment(
            formData.milestoneEndDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),
          sportID: +teamId,
          
          milestonePercentage: +formData?.milestonePercentage,
          goalsAndTargetsID: goalId,
        };
        dispatch(
          addIndividualMilestone({ url: "/InsertMilestone", payload: data })
        );
      } else {
        const trimmedRest = trimFormData(rest);
        const data = {
          ...trimmedRest,
          milestoneStartDate: moment(
            formData.milestoneStartDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),
          milestoneEndDate: moment(
            formData.milestoneEndDate,
            "DD/MM/YYYY"
          ).format("DD/MM/YYYY"),
          individualMilestoneID: id?.individualMileStoneID,
          
          milestonePercentage: +formData?.milestonePercentage,
          goalsAndTargetsID: goalId,
        };
        dispatch(UpdateIndividualMilestone(data));
      }
    }
  };

  const tabClose = () => {
    onClose();
  };

  useEffect(() => {
    if (
      (individualMilestoneData && individualMilestoneData.code === 200) ||
      (individualMilestoneEditData && individualMilestoneEditData.code === 200)
    ) {
      setShowBanner(true);
      setSnackbarStatus(
        individualMilestoneData.code || individualMilestoneEditData.code
      );
      setTimeout(() => {
        tabClose();
        dispatch(clearAddState());
        dispatch(clearUpdateState());
        setShowBanner(false);
      }, 2000);
      const payload: any = {
        goalsAndTargetsID: goalId,
        sportID: teamId,
        seasonID: seasonID,
        
      };
      dispatch(editGoalsTargets(payload));
      const dataPayload: any = {
        goalsAndTargetsID: goalId,
        sportID: teamId,
        seasonID: seasonID,
        
      };
      dispatch(listChart(dataPayload));
    } else if (
      (individualMilestoneData && individualMilestoneData.code === 500) ||
      (individualMilestoneEditData && individualMilestoneEditData.code === 500)
    ) {
      setShowBanner(true);
      setSnackbarStatus(
        individualMilestoneData.code || individualMilestoneEditData.code
      );
      setTimeout(() => {
        dispatch(clearAddState());
        dispatch(clearUpdateState());
        setShowBanner(false);
      }, 3000);
    }
  }, [individualMilestoneData, individualMilestoneEditData]);

  useEffect(() => {
    if (!_.isEmpty(id)) {
      setFormData({
        goal: id?.goal || "",
        milestoneStartDate: formatDates(id.milestoneStartDate),
        milestoneEndDate: formatDates(id.milestoneEndDate),
        milestonePercentage: id?.milestonePercentage || "",
        status: id?.status || "",
        description: id?.description || "",
      });
    }
  }, [id]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const handleChangeStatus = (selectedOption: any | null): void => {
    if (selectedOption) {
      setSelectedAthletesOption(selectedOption);
      setFormData({
        ...formData,
        status: selectedOption.value,
      });
      setErrors({
        ...errors,
        status: "",
      });
    }
  };

  useEffect(() => {
    if (id) {
      const selOption: any = _.filter(status, (x: any) => {
        return (
          x.value &&
          typeof x.value !== "undefined" &&
          _.includes(id?.status, x.value.toString())
        );
      });
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        status: selOption[0]?.value,
      }));
      setSelectedAthletesOption(selOption);
    }
  }, []);

  return (
    <Grid container spacing={0}>
      {showBanner && (
        <CustomSnackbar
          message={
            snackbarStatus === 200
              ? `Individual Milestone ${
                  id === null ? "Added" : "Updated"
                } successfully!`
              : "Something went wrong"
          }
          severity={snackbarStatus === 200 ? "success" : "error"}
          open={showBanner}
          onClose={handleClose}
        />
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
          mt: 2,
        }}
      >
        <Box width="100%" px={{ xs: 5, sm: 5, md: 2, lg: 3, xl: 5 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} justifyContent={"space-between"}>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Goal <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="goal"
                  id="goal"
                  placeholder="Enter Goal"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.goal}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 50 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.goal && (
                  <Typography variant="caption" className="error-message">
                    {errors.goal}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Percentage <span className="asterisk">*</span>
                </Typography>
                <CustomTextField
                  name="milestonePercentage"
                  id="milestonePercentage"
                  placeholder="Enter Percentage"
                  type="text"
                  variant="outlined"
                  fullWidth
                  value={formData.milestonePercentage}
                  onChange={handleChange}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 3 }}
                  onKeyPress={(e) => {
                    if (!REGEX.NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.milestonePercentage && (
                  <Typography variant="caption" className="error-message">
                    {errors.milestonePercentage}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Status <span className="asterisk">*</span>
                </Typography>
                <ReactSelect
                  name="status"
                  id="status"
                  handleChangeReactSelect={handleChangeStatus}
                  options={status}
                  value={SelectedAthletesOption}
                  isDisabled={!status || formData.goalType === "team"}
                  placeholder={"Select Status"}
                />
                {errors.status && (
                  <Typography variant="caption" className="error-message">
                    {errors.status}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Start Date <span className="asterisk">*</span>
                </Typography>
                <CustomDatePicker
                  control={control}
                  hidden={true}
                  name="milestoneStartDate"
                  id="milestoneStartDate"
                  label=" Start Date"
                  boxmb={0.8}
                  required={true}
                  minDate={
                    editgoalsTargetsUpdateData?.milestoneStartDate
                      ? moment(
                          editgoalsTargetsUpdateData.milestoneStartDate,
                          "DD/MM/YYYY"
                        ).startOf("day")
                      : moment().startOf("day")
                  }
                  maxDate={
                    editgoalsTargetsUpdateData?.endDate
                      ? moment(
                          editgoalsTargetsUpdateData.endDate,
                          "DD/MM/YYYY"
                        ).startOf("day")
                      : moment().endOf("day")
                  }
                  onChange={dateChange}
                  defaultValue={formData && formData.milestoneStartDate}
                  className="Text-field-customise"
                />
                {errors.milestoneStartDate && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mt={2}
                  >
                    {errors.milestoneStartDate}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={12}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  End Date <span className="asterisk">*</span>
                </Typography>
                <CustomDatePicker
                  control={control}
                  hidden={true}
                  name="milestoneEndDate"
                  id="milestoneEndDate"
                  label="End Date"
                  boxmb={0.8}
                  required={true}
                  minDate={
                    formData?.milestoneStartDate
                      ? moment(formData.milestoneStartDate)
                      : moment().subtract(50, "years")
                  }
                  maxDate={
                    editgoalsTargetsUpdateData?.endDate
                      ? moment(
                          editgoalsTargetsUpdateData.endDate,
                          "DD/MM/YYYY"
                        ).startOf("day")
                      : moment().endOf("day")
                  }
                  onChange={dateChange}
                  defaultValue={formData && formData.milestoneEndDate}
                  className="Text-field-customise"
                />
                {errors.milestoneEndDate && (
                  <Typography
                    variant="caption"
                    className="error-message"
                    mt={2}
                  >
                    {errors.milestoneEndDate}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={12} mb={11}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Description
                </Typography>
                <CustomTextField
                  name="description"
                  placeholder="Enter Description"
                  type="text"
                  variant="outlined"
                  multiline
                  rows={2}
                  fullWidth
                  value={formData.description}
                  onChange={handleChange}
                  error={Boolean(errors.description)}
                  helperText={errors.description || ""}
                  className="Text-field-customise"
                  inputProps={{ maxLength: 500 }}
                  onKeyPress={(e) => {
                    if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Grid>
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "6rem",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 1 }}
                onClick={() => {
                  tabClose();
                }}
                className="cancel-button text-capitalize dubai-med"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                size="small"
                loading={
                  individualMilestoneData.loading ||
                  individualMilestoneEditData.loading
                }
                variant="contained"
                className="save-continue-button text-capitalize save dubai-med"
              >
                {individualMilestoneData.loading ||
                individualMilestoneEditData.loading ? (
                  <CircularProgress sx={{ color: "#FFFFFF" }} size="20px" />
                ) : id === null ? (
                  "Add"
                ) : (
                  "Update"
                )}
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default IndividualMilestoneSlider;
