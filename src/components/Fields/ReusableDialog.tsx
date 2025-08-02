import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface ReusableDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
}

const ReusableDialog: React.FC<ReusableDialogProps> = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = "sm",
}) => {
  return (
    <Dialog
      onClose={onClose}
      open={open}
      maxWidth={maxWidth}
      fullWidth
      aria-labelledby="customized-dialog-title"
      className="dialog-width"
      onClick={(e) => e.stopPropagation()}
      style={{ zIndex: 10010 }}
    >
      {title && (
        <DialogTitle sx={{ m: 0, p: 2 }} 
        id="customized-dialog-title"
        className="bukra dialogBox-delete-title"
        >
          {title}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent dividers>{children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

export default ReusableDialog;
