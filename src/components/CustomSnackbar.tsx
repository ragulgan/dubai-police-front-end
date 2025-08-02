import React from "react";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert, { AlertColor } from "@mui/material/Alert";
import SuccessAlert from "../../public/svg/SuccesAlert.svg";
import { Typography } from "@mui/material";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
interface CustomSnackbarProps {
  message: string;
  severity: AlertColor;
  open: boolean;
  onClose: (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => void;
  duration?: number; // Optional duration in milliseconds
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  message,
  severity,
  open,
  onClose,
  duration = 6000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ zIndex: 999 }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          background: severity === "success" ? "#26D07C" : "#E4002B99",
        }}
        icon={severity === "success" ? <SuccessAlert /> : <ErrorOutline />}
      >
        <Typography
          sx={{
            fontSize: "14px",
            lineHeight: "24px",
            color: "#fff",
          }}
          className="bukra-semi-bold"
        >
          {message}
        </Typography>
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
