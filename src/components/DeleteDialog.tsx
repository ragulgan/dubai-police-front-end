"use client";
import { AppDispatch } from "@/redux/store";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useDispatch } from "react-redux";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const DeleteDialog: React.FC<any> = ({
  title,
  open,
  setOpen,
  isDelete
}) => {

  
  // const [open, setOpen] = React.useState(false);
  const dispatch: AppDispatch = useDispatch();

 

  const handleClose = () => {
    setOpen(false)
  };





  return (
    <React.Fragment>
 
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="dialog-width"
   
      >
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
          { 
           (
            <>
              <Box p={2} textAlign={"center"}>
                <Typography
                  className="dubai-med"
                  sx={{
                    color: "#E4002B",
                    fontSize: "20px",
                    fontWeight: 500,
                    lineHeight: "28px",
                  }}
                >
                  Are you sure,
                  <br /> Do you want to delete the {title} from this list?
                </Typography>
        
                <Typography className="dubai-med secondary-color format-text">
                  Once the {title} is deleted, you cannot not revert.
                </Typography>
              </Box>
              <Box sx={{ m: 1, mx: 2, textAlign: "center" }}>
                <Button
                  autoFocus
                  onClick={isDelete}
                  color="error"
                  variant="outlined"
                  className="dubai-med text-capitalize"
                  sx={{ mr: 1 }}
                  // disabled={deleteResponse.loading}
                >
                  {
                    "Yes, delete"
                  }
                </Button>
                <Button
                  variant="contained"
                  className="dubai-med text-capitalize"
                  onClick={handleClose}
                  // disabled={deleteResponse.loading}
                >
                  No, I want to Keep
                </Button>
              </Box>
            </>
          )}
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default DeleteDialog;