import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface AppAlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  onAgree?: () => void;
  onDisagree?: () => void;
  agreeLabel?: string;
  disagreeLabel?: string;
}

const AppAlertDialog: React.FC<AppAlertDialogProps> = ({
  open,
  onClose,
  title,
  description,
  onAgree,
  onDisagree,
  agreeLabel = "Agree",
  disagreeLabel = "Disagree",
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" className="bukra">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className="dubai-med">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          className="save-continue-button text-capitalize dubai-med"
          color="error"
          onClick={onDisagree || onClose}
        >
          {disagreeLabel}
        </Button>
        <Button
          className="cancel-button text-capitalize dubai-med"
          variant="outlined"
          color="error"
          onClick={onAgree || onClose}
          autoFocus
        >
          {agreeLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppAlertDialog;
