import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";

import React   from "react";

import CloseIcon from "@mui/icons-material/Close";
interface EditRequestDialogProps {
  openDialog: boolean;
  handleClose: (
    event: object,
    reason: "backdropClick" | "escapeKeyDown" | "closeButtonClick"
  ) => void;
  onSubmit: () => void;
}

const EditRequestDialog: React.FC<EditRequestDialogProps> = ({
  openDialog,
  handleClose,
  onSubmit,
}) => {
  return (
    <>
      <Dialog
        open={openDialog}
        onClose={handleClose}
       sx={{
        "& .MuiDialog-paper": {
          borderRadius: "8px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
        },
      }}
      >
        <DialogTitle
          className="table-list-header bukra header-border-right"
            boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
        borderBottom="1px solid #eee"
          sx={{
            fontWeight: 600,
            fontSize: "20px",
            pr: 5,
            
          }}
        >
          Edit Request
          <IconButton
              onClick={(e) => handleClose(e, "closeButtonClick")}
            sx={{
              position: "absolute",
              right: 12,
              top: 12,
              color: "grey.500",
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            display="flex"
            flexDirection="column"
            mt={1}
            mb={1}
            alignItems="center"
          >
            <Box display="flex" justifyContent="center" flexWrap="wrap" gap={1}>
              <DialogContent>
                <Box textAlign="center">
                  <Typography variant="h6" color="primary"   gutterBottom>
                    Are you sure you want to proceed with edit request?
                  </Typography>
                  <Typography variant="body2"  px={9} color="secondary">
                   You are requesting approval to edit this activity and notify the relevant authority 
                  </Typography>
                </Box>
              </DialogContent>
              <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
                <Button variant="outlined" color="secondary"  sx={{textTransform: "none"}} onClick={(e) => handleClose(e, "closeButtonClick")}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={onSubmit}
                  sx={{ ml: 2 ,textTransform: "none"}}
                >
                 Send Request
                </Button>
              </DialogActions>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditRequestDialog;
