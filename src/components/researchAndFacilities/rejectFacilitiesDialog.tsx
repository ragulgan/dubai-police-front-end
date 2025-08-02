import React from "react";
import {  Box, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { useForm } from "react-hook-form";
import FormWithSunEditor from "../useFormSunEditor";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
 '& .MuiDialogContent-root': {
  padding: theme.spacing(2),
 },
 '& .MuiDialogActions-root': {
  padding: theme.spacing(1),
 },
}));

interface SlideDialogProps {
 open: boolean;
 onClose: any;
 onReject: (reason: string) => void;
 facilityID: any;
 setSelectedFacilityId: any
}

const FacilityRejectDialogPage: React.FC<SlideDialogProps> = ({
 open,
 onClose,
 onReject,
 facilityID,
 setSelectedFacilityId
}) => {
 const handleClose = () => {
  reset();
  onClose();
};

 const { handleSubmit, control, reset } = useForm<any>({
  defaultValues: {
   reasonForReject: ""
  },
 });

 const onSubmit = (data: any) => {
  onReject(data.reasonForReject);
  setSelectedFacilityId(facilityID)
  reset();
  onClose();
 }

 return (
  <>
   <BootstrapDialog
     onClose={handleClose}
    open={open}
    aria-labelledby="cancel-dialog-title"
    sx={{
     borderRadius: "16px",
     "& .MuiPaper-root": { 
      width: "550px",
      height: "422px",
      borderRadius: "16px"
     }
    }}
   >
    <DialogTitle
     className="bukra"
     sx={{ m: 0, p: 2, fontSize: "16px", lineHeight: "19.2px", fontWeight: 500, color: "#000000" }}
    >
     Reject Reason
    </DialogTitle>
    <IconButton
     aria-label="close"
     onClick={handleClose}
     sx={{ position: "absolute", right: 8, top: 8, color: "grey" }}
    >
     <CloseIcon />
    </IconButton>
    <DialogContent dividers>
     <form onSubmit={handleSubmit(onSubmit)}>
      <FormWithSunEditor
       name="reasonForReject"
       control={control}
       minHeight={"200px"}
       placeholder="Enter Reject Reason"
      />
     </form>
     <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
      <Button
       className="dubai-med"
       variant="contained"
       sx={{
        textTransform: "none",
        backgroundColor: "#58585B",
        color: "#FFFFFF",
        width: "140px",
        height: "48px",
        gap: "8px",
        borderRadius: "4px",
        padding: "12px 15px",
        fontSize: "16px",
        fontWeight: 500
       }}
       onClick={handleSubmit(onSubmit)}
      >
       Reject
      </Button>
     </Box>
    </DialogContent>
   </BootstrapDialog>
  </>
 );
};

export default FacilityRejectDialogPage;