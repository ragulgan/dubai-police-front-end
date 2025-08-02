import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  styled,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { editStaffDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import TeamRequirementsAdd from "@/components/teamRequirements/add/teamRequirementsAdd";
import { getTeamRequirementByID } from "@/redux/slices/teamRequirement/getTeamRequirementByIdSlice";

const StyledTab = styled(Tab)<{ selected: boolean }>(
  ({ selected, disabled }) => ({
    flexGrow: 1,
    backgroundColor: selected ? "#008755" : "white",
    color: selected ? "#fff !important" : "#58585B99",
    fontFamily: "29LT Bukra !important",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
    pointerEvents: disabled ? "none" : "auto",
    opacity: disabled ? 0.6 : 1,
    borderRight: selected ? 0 : "0.5px solid #BCBCBD",
    "&:hover": {
      backgroundColor: selected ? "#006b43" : "#f0f0f0",
    },
  })
);

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  isEditData?: any;
  setIsUpdated?: any;
}

const SlideTeamRequirementDrawer: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  isEditData,
  setIsUpdated
}) => {
  const dispatch: editStaffDispatch = useDispatch();
  const router = useRouter();
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];

  const getTeamRequirementByIDData = useSelector((state: RootState) => {
    return state &&
      state.getTeamRequirementByID
  });

  useEffect(() => {
    if (!isEditData) return;
    const payload: any = {
      teamRequirementID: Number(isEditData),
      sportID: Number(teamID),
      
    };
    dispatch(getTeamRequirementByID(payload));
  }, [isEditData]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "80%",
          py: 2,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
          Edit Requirement
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box>
        <Box mt={2} px={4}>
          <TeamRequirementsAdd
            edit={true}
            getTeamRequirementByIDData={getTeamRequirementByIDData}
            id={isEditData}
            setIsUpdated={setIsUpdated}
            onClose={onClose}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default SlideTeamRequirementDrawer;
