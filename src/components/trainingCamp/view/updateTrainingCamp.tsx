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
import { getTrainingCampByID } from "@/redux/slices/trainingCamp/getTrainingCampByIdSlice";

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  id: any;
  module?: string;
  TrainingCampData?: any;
}

const UpdateTrainingCampSlider: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  id,
  TrainingCampData,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const [formData, setFormData] = useState<any>({
    problemsEncountered: "",
    positiveAspects: "",
    areasForImprovement: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");
  const updateTrainingResult = useSelector(
    (state: any) => state.updateTrainingCampByID
  );

  const handleSubmit = () => {
    const trimmedRest = trimFormData(formData);
    const payload = {
      ...trimmedRest,
      
      trainingCampID: Number(id),
      section: "campReport",
    };
    dispatch(
      UpdateTrainingCampByID({ url: "/UpdateTrainingCampByID", payload })
    );
  };

  React.useEffect(() => {
    if (updateTrainingResult && updateTrainingResult.code === 200) {
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
    if (!_.isEmpty(TrainingCampData)) {
      setFormData({
        ...formData,
        problemsEncountered: TrainingCampData?.problemsEncountered || "",
        positiveAspects: TrainingCampData?.positiveAspects || "",
        areasForImprovement: TrainingCampData?.areasForImprovement || "",
      });
    }
  }, [TrainingCampData]);

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
                ? "Update Overall Training Camp Report successfully!"
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
            Update Overall Training Camp Report
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        <Box px={3} py={1.5}>
          <Grid item xs={12} md={12}>
            <Typography
              gutterBottom
              className="typography textfield-label bukra"
            >
              Problems Encountered (Cons)
            </Typography>
            <TextSunEditor
              setData={setFormData}
              contentData={formData.problemsEncountered || ""}
              name="problemsEncountered"
              minHeight={"150px"}
            />
          </Grid>
          <Grid item xs={12} md={12} mt={2}>
            <Typography
              gutterBottom
              className="typography textfield-label bukra"
            >
              Positive Aspects
            </Typography>
            <TextSunEditor
              setData={setFormData}
              contentData={formData.positiveAspects || ""}
              name="positiveAspects"
              minHeight={"150px"}
            />
          </Grid>
          <Grid item xs={12} md={12} mt={2}>
            <Typography
              gutterBottom
              className="typography textfield-label bukra"
            >
              Areas For Improvement
            </Typography>
            <TextSunEditor
              setData={setFormData}
              contentData={formData.areasForImprovement || ""}
              name="areasForImprovement"
              minHeight={"150px"}
            />
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

export default UpdateTrainingCampSlider;
