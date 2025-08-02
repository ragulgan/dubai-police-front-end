import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import { editResearchAndFacilities } from "@/redux/slices/researchFacilities/researchFacilitiesEditSlice";
import RenderHtmlContent from "../common/RenderHtmlContent";
import CustomButton from "../buttons/CustomButton";
import EditIcon from "../../../public/EditSVG.svg";
import { checkAccess, checkUserEditAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

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
  facilityID: any;
  onCancelClicked: () => void;
  onEditClicked: (id: number) => void;
}

const FacilityViewPage: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  facilityID,
  onCancelClicked,
  onEditClicked
}) => {
  const dispatch: any = useDispatch();

  const editResearchFacilitiesData = useSelector((state: any) => {
    return state.editResearchAndFacilities.data[0];
  });

  useEffect(() => {
    if (open && facilityID) {
      const payload = {
        facilityID: Number(facilityID),

      };
      dispatch(
        editResearchAndFacilities({ url: "/GetFacilitiesByID", payload: payload })
      );
    }
  }, [open, facilityID]);

  const handleClose = () => {
    onClose();
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle
          className="bukra"
          sx={{
            m: 0,
            p: 2,
            fontSize: "16px",
            lineHeight: "19.2px",
            fontWeight: 500,
            color: "#000000"
          }}
          id="customized-dialog-title">
          View Facilities
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers >
          <Box sx={{
            padding: "10px",
            width: "550px"
          }}>
            {checkAccess(USER_PERMISSION.ResearchFacilitiesEdit) &&
              editResearchFacilitiesData?.status?.toLowerCase() !== "pending" &&
              editResearchFacilitiesData?.status?.toLowerCase() !== "rejected" &&
              editResearchFacilitiesData?.status?.toLowerCase() !== "cancelled"
              ?
              (<CustomButton
                sx={{
                  position: "absolute",
                  right: 10,
                  marginRight: 1,
                  backgroundColor: "#FFFFFF",
                  fontSize: "16px",
                  fontWeight: 500,
                }}
                label="Edit"
                variant="outlined"
                size="large"
                ButtonIcon={EditIcon}
                iconPosition="start"
                onClick={(e: any) => {
                  e.stopPropagation();
                  onEditClicked(facilityID);
                }}
                module="news"
              />)
              : null}
            <Box sx={{
              pb: "10px"
            }}>
              <Typography
                className="bukra facilities-view-title">
                Facility Type
              </Typography>
              <Typography
                className="dubai-med facilities-view-subtitle">
                {
                  editResearchFacilitiesData?.facilityTypeText === "Others"
                    ? editResearchFacilitiesData?.othersFacility || "--"
                    : editResearchFacilitiesData?.facilityTypeText || "--"
                }
              </Typography>
            </Box>

            <Box sx={{
              pb: "10px"
            }}>
              <Typography
                className="bukra facilities-view-title">
                Date
              </Typography>
              <Typography
                className="dubai-med facilities-view-subtitle">
                {editResearchFacilitiesData?.facilityDate ? editResearchFacilitiesData?.facilityDate : "--"}
              </Typography>
            </Box>

            <Box sx={{
              pb: "10px"
            }}>
              <Typography
                className="bukra facilities-view-title">
                Time
              </Typography>
              <Typography
                className="dubai-med facilities-view-subtitle">
                {editResearchFacilitiesData?.startTime && editResearchFacilitiesData?.endTime
                  ? `${editResearchFacilitiesData.startTime} - ${editResearchFacilitiesData.endTime}`
                  : "--"}

              </Typography>
            </Box>

            <Box sx={{
              pb: "10px"
            }}>
              <Typography
                className="bukra facilities-view-title">
                Purpose of Facility
              </Typography>
              <Typography
                className="dubai-med facilities-view-subtitle">
                {editResearchFacilitiesData?.purposeOfFacility ? editResearchFacilitiesData?.purposeOfFacility : "--"}
              </Typography>
            </Box>

            {editResearchFacilitiesData?.status === "Rejected" ? <Box sx={{
              pb: "10px"
            }}>
              <Typography
                className="bukra facilities-view-title">
                Rejected Reason
              </Typography>
              <Typography
                className="dubai-med facilities-view-subtitle">
                <RenderHtmlContent content={editResearchFacilitiesData?.rejectReason} />

              </Typography>
            </Box> : null}

            {editResearchFacilitiesData?.cancelbyID > 0 ? <Box sx={{
              pb: "10px"
            }}>
              <Typography
                className="bukra facilities-view-title">
                Cancelled Reason
              </Typography>
              <Typography
                className="dubai-med facilities-view-subtitle">
                <RenderHtmlContent content={editResearchFacilitiesData?.cancelReason} />
              </Typography>
            </Box> : null}
          </Box>
          {checkAccess(USER_PERMISSION.FacilitiesApproveReject) && (
            editResearchFacilitiesData?.status?.toLowerCase() === "approved" && !editResearchFacilitiesData?.cancelbyID ?
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <Button
                  className="dubai-med"
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    width: 145,
                    height: 48,
                    borderRadius: "4px",
                    borderWidth: 1,
                    padding: "14px 16px",
                    color: "#58585B",
                    backgroundColor: "#FFFFFF",
                    borderColor: "#58585B",
                    fontSize: "16px",
                    fontWeight: 500
                  }}
                  onClick={onCancelClicked}
                >
                  Cancel Booking
                </Button>
              </Box> : null)}
        </DialogContent>
      </BootstrapDialog>
    </>
  );
};

export default FacilityViewPage;