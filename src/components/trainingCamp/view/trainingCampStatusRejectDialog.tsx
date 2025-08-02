"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Box, CircularProgress, SnackbarCloseReason } from "@mui/material";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _, { isEmpty } from "lodash";
import { useEffect } from "react";
import CustomTextField from "@/components/Fields/CustomTextField";
import { useForm } from "react-hook-form";
import CustomSnackbar from "@/components/CustomSnackbar";
import { updateStatusTrainingCamp } from "@/redux/slices/trainingCamp/updateTrainingCampStatusSlice";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const TrainingCampStatusRejectDialog: React.FC<any> = ({ trainingCampData, status }) => {
  const [open, setOpen] = React.useState(false);
  const dispatch: AppDispatch = useDispatch();
  const [snackbarDialogOpen, setSnackbarDialogOpen] =
    React.useState<boolean>(false);
  const [snackbarDialogStatus, setSnackbarDialogStatus] =
    React.useState<string>("");
  const { handleSubmit, control, setValue, reset } = useForm({
    defaultValues: {
      rejectedReason: "",
    },
  });
  const UpdateTrainingCampStatusData = useSelector(
    (state: RootState) => state.updateTrainingCampStatus
  );

  const handleClickOpen = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    reset({
      rejectedReason: ""
    })
    setOpen(false);
  };

  const onSubmit = (data: any) => {
    const payload = {
      trainingCampID: trainingCampData && trainingCampData?.trainingCampID,
      status: 2,
      rejectedReason: data && data?.rejectedReason,
    };
    dispatch(
      updateStatusTrainingCamp({ url: "/UpdateTrainingCampStatus", payload: payload })
    );
  };

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarDialogOpen(false);
  };

  useEffect(() => {
    if (UpdateTrainingCampStatusData && UpdateTrainingCampStatusData?.code === 200) {
      handleClose();
    }
  }, [UpdateTrainingCampStatusData, trainingCampData]);

  useEffect(() => {
    if (
      !isEmpty(
        trainingCampData &&
        trainingCampData?.data &&
        trainingCampData?.data[0] &&
        trainingCampData?.data[0]?.rejectedReason
      )
    ) {
      setValue(
        "rejectedReason",
        trainingCampData &&
        trainingCampData?.data &&
        trainingCampData?.data[0] &&
        trainingCampData?.data[0]?.rejectedReason
      );
    }
  }, [trainingCampData]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarDialogOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarDialogOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarDialogOpen]);

  return (
    <React.Fragment>
      {status === "Reject" ? (
        <Typography
          className="bukra tertiary-color"
          fontSize={"12px"}
          mt={2}
          sx={{
            textDecoration: "underline",
            cursor: "pointer",
          }}
          onClick={(e) => handleClickOpen(e)}
        >
          Rejected Reason
        </Typography>
      ) : (
        <Button
          variant="contained"
          className="text-capitalize dubai-regular"
          sx={{
            fontSize: "16px",
            bgcolor: "#FFFFFF",
            color: "#58585B",
            height: "48px",
          }}
          onClick={(e) => handleClickOpen(e)}
        >
          Reject
        </Button>
      )}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="dialog-width"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {snackbarDialogStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarDialogStatus === "reasonSuccess"
                ? `Reject reason for training camp status updated successfully!`
                : snackbarDialogStatus === "success"
                  ? `Training Camp status updated successfully!`
                  : `Training Camp status updated failed.`
            }
            severity={
              snackbarDialogStatus === "success"
                ? "success"
                : snackbarDialogStatus === "reasonSuccess"
                  ? "success"
                  : "error"
            }
            open={snackbarDialogOpen}
            onClose={handleSnackBarClose}
          />
        )}
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          className="bukra dialogBox-delete-title"
        >
          Confirm Training Camp Rejection
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <>
            <Box p={1}>
              <Typography
                className="dubai-regular"
                sx={{
                  color: "#58585B",
                  fontSize: "16px",
                  lineHeight: "28px",
                }}
              >
                Are you sure you want to reject this Training Camp? This action cannot
                be undone.
              </Typography>
              <Typography
                className="bukra primary-color webkit-line-clamp webkit-1"
                sx={{ fontSize: "24px", mb: 1 }}
              >
                {/* Need to change budgetName*/}
                {trainingCampData &&
                  trainingCampData?.data &&
                  trainingCampData?.data[0] &&
                  trainingCampData?.data[0]?.budgetName}
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CustomTextField
                  name="rejectedReason"
                  control={control}
                  label={"Reason for Rejection"}
                  textarea={true}
                  disabled={
                    trainingCampData &&
                    trainingCampData?.data &&
                    trainingCampData?.data[0] &&
                    trainingCampData?.data[0]?.rejectedReason
                  }
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                      message: "Only Alphanumberic & hypens are allowed",
                    },
                    maxLength: {
                      value: 500,
                      message:
                        "Reason for Rejection cannot exceed 500 characters",
                    },
                  }}
                />
              </form>
            </Box>
            {!isEmpty(
              trainingCampData &&
              trainingCampData?.data &&
              trainingCampData?.data[0] &&
              trainingCampData?.data[0]?.rejectedReason
            ) ? null : (
              <Box sx={{ m: 1, mx: 2, textAlign: "end" }}>
                <Button
                  autoFocus
                  onClick={handleSubmit(onSubmit)}
                  color="error"
                  variant="outlined"
                  className="dubai-regular text-capitalize"
                  sx={{ mr: 1 }}
                  disabled={UpdateTrainingCampStatusData.loading}
                >
                  {UpdateTrainingCampStatusData.loading ? (
                    <CircularProgress color="error" size="25px" />
                  ) : trainingCampData &&
                    trainingCampData?.data &&
                    trainingCampData?.data[0] &&
                    trainingCampData?.data[0]?.statusText === "Rejected" ? (
                    "Update Reject Reason"
                  ) : (
                    "Yes, Reject"
                  )}
                </Button>
                <Button
                  variant="contained"
                  className="dubai-regular text-capitalize"
                  onClick={handleClose}
                  disabled={UpdateTrainingCampStatusData.loading}
                >
                  No, Cancel
                </Button>
              </Box>
            )}
          </>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default TrainingCampStatusRejectDialog;
