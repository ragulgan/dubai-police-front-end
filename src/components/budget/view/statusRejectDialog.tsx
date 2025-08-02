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
import {
  updateStatusBudget,
  clearBudgetUpdateStatusState,
} from "@/redux/slices/budget/budgetUpdateStatusSlice";
import CustomSnackbar from "@/components/CustomSnackbar";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const StatusRejectDialog: React.FC<any> = ({ budgetEditData, status }) => {
  const [open, setOpen] = React.useState(false);
  const dispatch: AppDispatch = useDispatch();
  const [snackbarDialogOpen, setSnackbarDialogOpen] =
    React.useState<boolean>(false);
  const [snackbarDialogStatus, setSnackbarDialogStatus] =
    React.useState<string>("");
  const { handleSubmit, control, setValue } = useForm({
    defaultValues: {
      rejectedReason: "",
    },
  });
  const budgetsUpdateStatus = useSelector(
    (state: RootState) => state.budgetsUpdateStatus
  );

  const handleClickOpen = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (data: any) => {
    const payload = {
      budgetID:
        budgetEditData &&
        budgetEditData?.data &&
        budgetEditData?.data[0] &&
        budgetEditData?.data[0]?.budgetID,
      status: 2,
      rejectedReason: data && data?.rejectedReason,
    };
    dispatch(
      updateStatusBudget({ url: "/UpdateBudgetStatus", payload: payload })
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
    if (
      budgetEditData &&
      budgetEditData?.data &&
      budgetEditData?.data[0] &&
      budgetEditData?.data[0]?.statusText === "Rejected" &&
      budgetsUpdateStatus &&
      budgetsUpdateStatus?.code === 200
    ) {
      setSnackbarDialogOpen(true);
      setSnackbarDialogStatus("reasonSuccess");
      dispatch(clearBudgetUpdateStatusState());
      handleClose();
    } else if (budgetsUpdateStatus && budgetsUpdateStatus?.code === 200) {
      setSnackbarDialogOpen(true);
      setSnackbarDialogStatus("success");
      dispatch(clearBudgetUpdateStatusState());
    } else if (budgetsUpdateStatus && budgetsUpdateStatus?.code === 500) {
      setSnackbarDialogOpen(true);
      setSnackbarDialogStatus("error");
      dispatch(clearBudgetUpdateStatusState());
    }
  }, [budgetsUpdateStatus, budgetEditData]);

  useEffect(() => {
    if (
      !isEmpty(
        budgetEditData &&
          budgetEditData?.data &&
          budgetEditData?.data[0] &&
          budgetEditData?.data[0]?.rejectedReason
      )
    ) {
      setValue(
        "rejectedReason",
        budgetEditData &&
          budgetEditData?.data &&
          budgetEditData?.data[0] &&
          budgetEditData?.data[0]?.rejectedReason
      );
    }
  }, [budgetEditData]);

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
                ? `Reject reason for budget status updated successfully!`
                : snackbarDialogStatus === "success"
                ? `Budget status updated successfully!`
                : `Budget status updated failed.`
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
          Confirm Budget Rejection
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
                Are you sure you want to reject this Budget? This action cannot
                be undone.
              </Typography>
              <Typography
                className="bukra primary-color webkit-line-clamp webkit-1"
                sx={{ fontSize: "24px", mb: 1 }}
              >
                {budgetEditData &&
                  budgetEditData?.data &&
                  budgetEditData?.data[0] &&
                  budgetEditData?.data[0]?.budgetName}
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <CustomTextField
                  name="rejectedReason"
                  control={control}
                  label={"Reason for Rejection"}
                  textarea={true}
                  disabled={
                    budgetEditData &&
                    budgetEditData?.data &&
                    budgetEditData?.data[0] &&
                    budgetEditData?.data[0]?.rejectedReason
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
              budgetEditData &&
                budgetEditData?.data &&
                budgetEditData?.data[0] &&
                budgetEditData?.data[0]?.rejectedReason
            ) ? null : (
              <Box sx={{ m: 1, mx: 2, textAlign: "end" }}>
                <Button
                  autoFocus
                  onClick={handleSubmit(onSubmit)}
                  color="error"
                  variant="outlined"
                  className="dubai-regular text-capitalize"
                  sx={{ mr: 1 }}
                  disabled={budgetsUpdateStatus.loading}
                >
                  {budgetsUpdateStatus.loading ? (
                    <CircularProgress color="error" size="25px" />
                  ) : budgetEditData &&
                    budgetEditData?.data &&
                    budgetEditData?.data[0] &&
                    budgetEditData?.data[0]?.statusText === "Rejected" ? (
                    "Update Reject Reason"
                  ) : (
                    "Yes, Reject"
                  )}
                </Button>
                <Button
                  variant="contained"
                  className="dubai-regular text-capitalize"
                  onClick={handleClose}
                  disabled={budgetsUpdateStatus.loading}
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

export default StatusRejectDialog;
