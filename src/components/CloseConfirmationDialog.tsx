"use client";
import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { Box, CircularProgress } from "@mui/material";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

interface CloseConfirm {
  setOpen: any;
  open: boolean;
  module: string;
  closeConfirm: any;
}

const CloseConfirmationDialog: React.FC<CloseConfirm> = ({
  setOpen,
  open,
  module,
  closeConfirm,
}) => {
  const handleClickOpen = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    closeConfirm();
  };
  const handleCancel = () => {
    setOpen(false);
  };
  const labelText = `Edit ${module === "staff" ? "Staff" : "Athlete"}`;
  return (
    <React.Fragment>
      <BootstrapDialog
        onClose={closeConfirm}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="dialog-width"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          className="bukra dialogBox-delete-title"
        >
          Close Staff
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
            <Box p={2} textAlign={"center"}>
              <Typography className="dubai-med secondary-color format-text">
                Do you want to Close?
              </Typography>
              <Typography
                className="bukra delete-dialog-name"
                sx={{ color: "#E4002B" }}
                my={2}
              >
                {labelText}
              </Typography>
            </Box>
            <Box sx={{ m: 1, mx: 2, textAlign: "center" }}>
              <Button
                variant="contained"
                className="dubai-med text-capitalize"
                onClick={handleCancel}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
              <Button
                autoFocus
                onClick={handleClose}
                color="error"
                variant="outlined"
                className="dubai-med text-capitalize"
              >
                Close
              </Button>
            </Box>
          </>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default CloseConfirmationDialog;
