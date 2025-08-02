import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Button,
  DialogActions,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import _, { isEmpty } from "lodash";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { useForm } from "react-hook-form";

interface RejectRequirementDialogDialogProps {
  open: boolean;
  onClose: () => void;
  onReject: (reason: string) => void;
  getTeamRequirementByIDData: any;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  fullWidth?: boolean;
}

const rejectRequirementDialog: React.FC<RejectRequirementDialogDialogProps> = ({
  open,
  onClose,
  onReject,
  getTeamRequirementByIDData,
  maxWidth = "xl",
  fullWidth = true,
}) => {
  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      reasonForRejection: "",
    },
  });

  const onSubmit = (data: any) => {
    onReject(data.reasonForRejection);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const resetDialog = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth={"sm"}
        fullWidth={fullWidth}
        style={{ zIndex: 10000 }}
        sx={{ "& .MuiPaper-root": { borderRadius: "10px" } }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: "59px",
            background: "#FFFFFF",
            boxShadow: "0px 3px 6px 0px #B1B1B129",
            borderBottom: "1px solid #E6E6E6",
            padding: "0 24px",
          }}
        >
          <Typography
            className="bukra dialogBox-delete-title"
            sx={{
              fontWeight: 500,
            }}
          >
            Confirm Requirement Rejection
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                color: "#58585B",
                paddingTop: "23px",
              }}
              className="dubai-med"
            >
              Are you sure you want to reject this requirement? This action
              cannot be undone.
            </Typography>
            <Typography
              fontSize={"24px"}
              fontWeight={500}
              color={"#008755"}
              className="bukra"
              mt={1}
            >
              {getTeamRequirementByIDData?.requirementName}
            </Typography>
            <FormWithSunEditor
              name="reasonForRejection"
              control={control}
              minHeight={"200px"}
              label="Reason for Rejection"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", paddingTop: "15px" }}>
              <Button
                type="submit"
                variant="outlined"
                sx={{ mr: 1, height: "48px" }}
                className="text-capitalize dubai-med"
                color="error"
                onClick={handleSubmit(onSubmit)}
              >
                Yes, Reject
              </Button>
              <Button
                className="save-continue-button text-capitalize dubai-med"
                variant="contained"
                color="error"
                onClick={resetDialog}
              >
                No, Cancel
              </Button>
            </Box>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default rejectRequirementDialog;
