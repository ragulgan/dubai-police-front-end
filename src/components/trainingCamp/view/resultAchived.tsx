import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Button,
  SnackbarCloseReason,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { usePathname } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";
import { trimFormData } from "@/utils/helper";
import {
  UpdateTrainingCampByID,
  clearUpdateTrainingCamp,
} from "@/redux/slices/trainingCamp/UpdateTrainingCampSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import TextSunEditor from "@/components/SunEditor";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import moment from "moment";
import { useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import { REGEX } from "@/utils/constants";
import { getTrainingCampByID } from "@/redux/slices/trainingCamp/getTrainingCampByIdSlice";

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  id: any;
  module?: string;
  TrainingCampData?: any;
  resultId?: any;
}

const ResultAchivedCampSlider: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  id,
  TrainingCampData,
  resultId,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { control } = useForm();
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const [formData, setFormData] = useState<any>({
    achievementDate: "",
    achievementType: "",
    achievementDetails: "",
    scorePoints: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");
  const updateTrainingResult = useSelector(
    (state: any) => state.updateTrainingCampByID
  );

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

  const handleSubmit = () => {
    const validationErrors: any = {};
    if (_.isEmpty(formData.achievementDate)) {
      validationErrors.achievementDate =
        "Achievement Date is required or Invalid date.";
      document.getElementById("achievementDate")?.focus();
    } else {
      const achievementMoment = moment(formData.achievementDate, "DD/MM/YYYY");
      if (
        achievementMoment.isBefore(
          moment(TrainingCampData?.campStartDate, "DD/MM/YYYY"),
          "day"
        )
      ) {
        validationErrors.achievementDate = `Date cannot be earlier than ${TrainingCampData?.campStartDate}`;
        document.getElementById("achievementDate")?.focus();
      } else if (
        achievementMoment.isAfter(
          moment(TrainingCampData?.campEndDate, "DD/MM/YYYY"),
          "day"
        )
      ) {
        validationErrors.achievementDate = `Date cannot be greater than ${TrainingCampData?.campEndDate}`;
        document.getElementById("achievementDate")?.focus();
      }
    }

    if (_.isEmpty(formData.achievementType)) {
      validationErrors.achievementType = "Type is required";
      document.getElementById("achievementType")?.focus();
    }
    if (!formData.scorePoints && formData.scorePoints !== 0) {
      validationErrors.scorePoints = "Score Points is required";
      document.getElementById("scorePoints")?.focus();
    } else if (isNaN(Number(formData.scorePoints))) {
      validationErrors.scorePoints = "Score Points must be a valid number";
      document.getElementById("scorePoints")?.focus();
    }
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      const trimmedRest = trimFormData(formData);
      const payload = {
        ...trimmedRest,
        scorePoints: Number(formData.scorePoints),
        achievementDate: moment(formData.achievementDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        
        trainingCampID: Number(id),
        section: "resultAchived",
        trainingCampresultAchievedID:
          resultId && resultId.trainingCampresultAchievedID
            ? resultId.trainingCampresultAchievedID
            : null,
      };
      if (resultId && resultId.trainingCampresultAchievedID) {
        dispatch(
          UpdateTrainingCampByID({
            url: "/UpdateResultAchivedById",
            payload,
          })
        );
      } else {
        dispatch(
          UpdateTrainingCampByID({ url: "/InsertResultAchived", payload })
        );
      }
    }
  };

  useEffect(() => {
    if (
      updateTrainingResult &&
      updateTrainingResult.code === 200 &&
      updateTrainingResult.status === "succeeded"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      dispatch(clearUpdateTrainingCamp());
      setTimeout(() => {
        onClose();
      }, 2000);
      const payload: any = {
        trainingCampID: id,
        sportID: Number(teamId),
        
      };
      dispatch(getTrainingCampByID(payload));
    } else if (
      updateTrainingResult &&
      updateTrainingResult.code === 500 &&
      updateTrainingResult.status === "succeeded"
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearUpdateTrainingCamp());
        setSnackbarOpen(false);
      }, 2000);
    }
  }, [updateTrainingResult]);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (resultId && resultId.trainingCampID) {
      setFormData({
        ...formData,
        achievementDate: resultId?.achievementDate || "",
        achievementType: resultId?.achievementType || "",
        achievementDetails: resultId?.achievementDetails || "",
        scorePoints: resultId?.scorePoints || "",
      });
    }
  }, [resultId]);

  const dateChange = (data: any) => {
    setFormData((prevData: any) => ({
      ...prevData,
      achievementDate: data.value,
    }));
    setErrors({
      ...errors,
      [data.name]: "",
    });
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
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
                ? `${
                    resultId && resultId.trainingCampID ? "Update" : "Add"
                  } Results Achieved successfully!`
                : "Something went wrong"
            }
            severity={snackbarStatus === "success" ? "success" : "error"}
            open={snackbarOpen}
            onClose={handleSnackbarClose}
          />
        )}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
            {resultId && resultId.trainingCampID ? "Update" : "Add"} Results
            Achieved
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box px={3} py={1.5}>
          <Grid item xs={12} md={12}>
            <Box>
              <CustomDatePicker
                control={control}
                name="achievementDate"
                label="Achievement Date"
                defaultValue={formData.achievementDate}
                boxmb={0.8}
                required={true}
                minDate={moment(TrainingCampData?.campStartDate, "DD/MM/YYYY")}
                maxDate={moment(TrainingCampData?.campEndDate, "DD/MM/YYYY")}
                onChange={dateChange}
                className="Text-field-customise"
              />
            </Box>
            {errors.achievementDate && (
              <Typography variant="caption" className="error-message">
                {errors.achievementDate}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={12} mt={2}>
            <Typography
              gutterBottom
              className="typography textfield-label bukra"
            >
              Type <span className="asterisk">*</span>
            </Typography>
            <CustomTextField
              control={control}
              name="achievementType"
              placeholder="Enter Type"
              type="text"
              variant="outlined"
              fullWidth
              value={formData.achievementType}
              onChange={handleChange}
              className="Text-field-customise"
              inputProps={{ maxLength: 100 }}
              onKeyPress={(e) => {
                if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.achievementType && (
              <Typography variant="caption" className="error-message">
                {errors.achievementType}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12} md={12} mt={2}>
            <Typography
              gutterBottom
              className="typography textfield-label bukra"
            >
              Details
            </Typography>
            <TextSunEditor
              setData={setFormData}
              contentData={formData.achievementDetails || ""}
              name="achievementDetails"
              minHeight={"150px"}
            />
          </Grid>

          <Grid item xs={12} md={12} mt={2}>
            <Typography
              gutterBottom
              className="typography textfield-label bukra"
            >
              Score Points <span className="asterisk">*</span>
            </Typography>
            <CustomTextField
              control={control}
              name="scorePoints"
              placeholder="Enter Score Points"
              type="text"
              variant="outlined"
              fullWidth
              value={formData.scorePoints}
              onChange={handleChange}
              className="Text-field-customise"
              inputProps={{ maxLength: 100 }}
              onKeyPress={(e) => {
                if (!REGEX.NUMERIC.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
            {errors.scorePoints && (
              <Typography variant="caption" className="error-message">
                {errors.scorePoints}
              </Typography>
            )}
          </Grid>
          <Grid container spacing={2} justifyContent={"space-between"}>
            <Grid
              item
              xs={12}
              md={12}
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.5rem",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 1 }}
                onClick={() => {
                  onClose();
                }}
                className="cancel-button text-capitalize dubai-med"
              >
                Cancel
              </Button>
              <LoadingButton
                onClick={handleSubmit}
                loading={updateTrainingResult.loading}
                variant="contained"
                className="save-continue-button text-capitalize dubai-med"
                disabled={updateTrainingResult.loading}
                type="submit"
              >
                Update
              </LoadingButton>
            </Grid>
          </Grid>
        </Box>
      </Drawer>
    </>
  );
};

export default ResultAchivedCampSlider;
