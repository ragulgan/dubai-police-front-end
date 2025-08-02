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
  styled,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { usePathname } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";
import { capitalizeFirstLetter, trimFormData } from "@/utils/helper";
import CustomSnackbar from "@/components/CustomSnackbar";
import { REGEX } from "@/utils/constants";
import {
  clearUpdateTrainingPerformanceResults,
  UpdateTrainingPerformanceResults,
} from "@/redux/slices/results/UpdateResultsSlice";
import { editResults } from "@/redux/slices/results/ResultEditSlice";
import { viewTeamPerformance } from "@/redux/slices/results/TeamPerformanceList";

const CustomTextField = styled(TextField)(({}) => ({
  height: "40px",
  borderRadius: "4px 0px 0px 0px",
  // opacity: 0,
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
  "& .MuiFormHelperText-root": {
    color: "red",
    fontSize: "12px",
    fontWeight: "bold",
    marginTop: "4px",
  },
}));

const UpdateTrainingPerformanceSlider: React.FC<any> = ({
  open,
  onClose,
  id,
  TrainingPerformanceData,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const [formData, setFormData] = useState<any>({
    teamASpeed: "",
    teamBSpeed: "",
    teamAEndurance: "",
    teamBEndurance: "",
    teamAAccuracy: "",
    teamBAccuracy: "",
    teamATeamwork: "",
    teamBTeamwork: "",
    teamAStrategy: "",
    teamBStrategy: "",
  });

  const [errors, setErrors] = useState<any>({});
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");
  const trainingPerformanceResult = useSelector(
    (state: any) => state.updateTrainingPerformance
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
    const trimmedRest = trimFormData(formData);
    const specialCharRegex: any = /[^0-9\s]/;
    const validationErrors: any = {};
    Object.entries(trimmedRest).forEach(([key, value]) => {
      if (typeof value === "string" && value.trim()) {
        if (specialCharRegex.test(value)) {
          validationErrors[key] = `${capitalizeFirstLetter(
            key
          )} should not contain special characters and characters.`;
        } else if (value.length > 3) {
          validationErrors[key] = `${capitalizeFirstLetter(
            key
          )} should not exceed 3 characters.`;
        }
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const payload = {
      ...trimmedRest,
      
      resultID: Number(id),
      teamPerformanceID: TrainingPerformanceData?.teamPerformanceID,
    };
    dispatch(
      UpdateTrainingPerformanceResults({
        url:
          TrainingPerformanceData?.teamPerformanceID > 0
            ? "/UpdateTeamPerformanceByID"
            : "/InsertTeamPerformance",
        payload,
      })
    );
  };

  useEffect(() => {
    if (trainingPerformanceResult && trainingPerformanceResult.code === 200) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      dispatch(clearUpdateTrainingPerformanceResults());
      setTimeout(() => {
        onClose();
      }, 2000);
      const payload: any = {
        resultID: id,
        sportID: Number(teamId),
        
      };
      dispatch(editResults(payload));
      const chartpayload: any = {
        resultID: id,
        
      };
      dispatch(viewTeamPerformance(chartpayload));
    } else if (
      trainingPerformanceResult &&
      trainingPerformanceResult.code === 500
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearUpdateTrainingPerformanceResults());
        setSnackbarOpen(false);
      }, 2000);
    }
  }, [trainingPerformanceResult]);

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
    if (!_.isEmpty(TrainingPerformanceData)) {
      setFormData((prevFormData: any) => ({
        ...prevFormData, // Preserve existing values
        teamASpeed: TrainingPerformanceData?.teamASpeed || "",
        teamBSpeed: TrainingPerformanceData?.teamBSpeed || "",
        teamAEndurance: TrainingPerformanceData?.teamAEndurance || "",
        teamBEndurance: TrainingPerformanceData?.teamBEndurance || "",
        teamAAccuracy: TrainingPerformanceData?.teamAAccuracy || "",
        teamBAccuracy: TrainingPerformanceData?.teamBAccuracy || "",
        teamATeamwork: TrainingPerformanceData?.teamATeamwork || "",
        teamBTeamwork: TrainingPerformanceData?.teamBTeamwork || "",
        teamAStrategy: TrainingPerformanceData?.teamAStrategy || "",
        teamBStrategy: TrainingPerformanceData?.teamBStrategy || "",
      }));
    }
  }, [TrainingPerformanceData]);

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
                ? "Team Performance Updated successfully!"
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
            Team Performance
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box px={3} py={1.5}>
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            mb={2}
            mt={2}
          >
            <Grid item xs={2} md={2} />
            <Grid item xs={5} md={5}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography
                  variant="titleStyle"
                  sx={{ px: 2 }}
                  className="bukra"
                >
                  Team A
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5} md={5}>
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography
                  variant="titleStyle"
                  sx={{ px: 2 }}
                  className="bukra"
                >
                  Team B
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent={"space-between"} mt={2}>
            <Grid item xs={2} md={2}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
                sx={{ marginTop: "10px" }}
              >
                Speed
              </Typography>
            </Grid>
            <Grid item xs={5} md={5}>
              <CustomTextField
                name="teamASpeed"
                id="teamASpeed"
                placeholder="Enter Value"
                type="text"
                variant="outlined"
                fullWidth
                value={formData.teamASpeed}
                onChange={handleChange}
                className="Text-field-customise"
                inputProps={{ maxLength: 3 }}
                onKeyPress={(e) => {
                  if (!REGEX.NUMERIC_CHARS.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.teamASpeed && (
                <Typography variant="caption" className="error-message">
                  {errors.teamASpeed}
                </Typography>
              )}
            </Grid>
            <Grid item xs={5} md={5}>
              <CustomTextField
                name="teamBSpeed"
                id="teamBSpeed"
                placeholder="Enter Value"
                type="text"
                variant="outlined"
                fullWidth
                value={formData.teamBSpeed}
                onChange={handleChange}
                className="Text-field-customise"
                inputProps={{ maxLength: 3 }}
                onKeyPress={(e) => {
                  if (!REGEX.NUMERIC_CHARS.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.teamBSpeed && (
                <Typography variant="caption" className="error-message">
                  {errors.teamBSpeed}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent={"space-between"} mt={2}>
            <Grid item xs={2} md={2}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
                sx={{ marginTop: "10px" }}
              >
                Endurance
              </Typography>
            </Grid>
            <Grid item xs={5} md={5}>
              <CustomTextField
                name="teamAEndurance"
                id="teamAEndurance"
                placeholder="Enter Value"
                type="text"
                variant="outlined"
                fullWidth
                value={formData.teamAEndurance}
                onChange={handleChange}
                className="Text-field-customise"
                inputProps={{ maxLength: 3 }}
                onKeyPress={(e) => {
                  if (!REGEX.NUMERIC_CHARS.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.teamAEndurance && (
                <Typography variant="caption" className="error-message">
                  {errors.teamAEndurance}
                </Typography>
              )}
            </Grid>
            <Grid item xs={5} md={5}>
              <CustomTextField
                name="teamBEndurance"
                id="teamBEndurance"
                placeholder="Enter Value"
                type="text"
                variant="outlined"
                fullWidth
                value={formData.teamBEndurance}
                onChange={handleChange}
                className="Text-field-customise"
                inputProps={{ maxLength: 3 }}
                onKeyPress={(e) => {
                  if (!REGEX.NUMERIC_CHARS.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.teamBEndurance && (
                <Typography variant="caption" className="error-message">
                  {errors.teamBEndurance}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent={"space-between"} mt={2}>
            <Grid item xs={2} md={2}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
                sx={{ marginTop: "10px" }}
              >
                Accuracy
              </Typography>
            </Grid>
            <Grid item xs={5} md={5}>
              <CustomTextField
                name="teamAAccuracy"
                id="teamAAccuracy"
                placeholder="Enter Value"
                type="text"
                variant="outlined"
                fullWidth
                value={formData.teamAAccuracy}
                onChange={handleChange}
                className="Text-field-customise"
                inputProps={{ maxLength: 3 }}
                onKeyPress={(e) => {
                  if (!REGEX.NUMERIC_CHARS.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.teamAAccuracy && (
                <Typography variant="caption" className="error-message">
                  {errors.teamAAccuracy}
                </Typography>
              )}
            </Grid>
            <Grid item xs={5} md={5}>
              <CustomTextField
                name="teamBAccuracy"
                id="teamBAccuracy"
                placeholder="Enter Value"
                type="text"
                variant="outlined"
                fullWidth
                value={formData.teamBAccuracy}
                onChange={handleChange}
                className="Text-field-customise"
                inputProps={{ maxLength: 3 }}
                onKeyPress={(e) => {
                  if (!REGEX.NUMERIC_CHARS.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.teamBAccuracy && (
                <Typography variant="caption" className="error-message">
                  {errors.teamBAccuracy}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent={"space-between"} mt={2}>
            <Grid item xs={2} md={2}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
                sx={{ marginTop: "10px" }}
              >
                Teamwork
              </Typography>
            </Grid>
            <Grid item xs={5} md={5}>
              <CustomTextField
                name="teamATeamwork"
                id="teamATeamwork"
                placeholder="Enter Value"
                type="text"
                variant="outlined"
                fullWidth
                value={formData.teamATeamwork}
                onChange={handleChange}
                className="Text-field-customise"
                inputProps={{ maxLength: 3 }}
                onKeyPress={(e) => {
                  if (!REGEX.NUMERIC_CHARS.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.teamATeamwork && (
                <Typography variant="caption" className="error-message">
                  {errors.teamATeamwork}
                </Typography>
              )}
            </Grid>
            <Grid item xs={5} md={5}>
              <CustomTextField
                name="teamBTeamwork"
                id="teamBTeamwork"
                placeholder="Enter Value"
                type="text"
                variant="outlined"
                fullWidth
                value={formData.teamBTeamwork}
                onChange={handleChange}
                className="Text-field-customise"
                inputProps={{ maxLength: 3 }}
                onKeyPress={(e) => {
                  if (!REGEX.NUMERIC_CHARS.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.teamBTeamwork && (
                <Typography variant="caption" className="error-message">
                  {errors.teamBTeamwork}
                </Typography>
              )}
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent={"space-between"} mt={2}>
            <Grid item xs={2} md={2}>
              <Typography
                gutterBottom
                className="typography textfield-label bukra"
                sx={{ marginTop: "10px" }}
              >
                Strategy
              </Typography>
            </Grid>
            <Grid item xs={5} md={5}>
              <CustomTextField
                name="teamAStrategy"
                id="teamAStrategy"
                placeholder="Enter Value"
                type="text"
                variant="outlined"
                fullWidth
                value={formData.teamAStrategy}
                onChange={handleChange}
                className="Text-field-customise"
                inputProps={{ maxLength: 3 }}
                onKeyPress={(e) => {
                  if (!REGEX.NUMERIC_CHARS.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.teamAStrategy && (
                <Typography variant="caption" className="error-message">
                  {errors.teamAStrategy}
                </Typography>
              )}
            </Grid>
            <Grid item xs={5} md={5}>
              <CustomTextField
                name="teamBStrategy"
                id="teamBStrategy"
                placeholder="Enter Value"
                type="text"
                variant="outlined"
                fullWidth
                value={formData.teamBStrategy}
                onChange={handleChange}
                className="Text-field-customise"
                inputProps={{ maxLength: 3 }}
                onKeyPress={(e) => {
                  if (!REGEX.NUMERIC_CHARS.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              {errors.teamBStrategy && (
                <Typography variant="caption" className="error-message">
                  {errors.teamBStrategy}
                </Typography>
              )}
            </Grid>
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
                loading={trainingPerformanceResult.loading}
                variant="contained"
                className="text-capitalize dubai-med"
                disabled={
                  trainingPerformanceResult.loading ||
                  !Object.values(formData).some((val) => val)
                }
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

export default UpdateTrainingPerformanceSlider;
