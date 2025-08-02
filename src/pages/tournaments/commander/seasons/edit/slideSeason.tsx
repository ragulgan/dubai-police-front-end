import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { editStaffDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import CreateSeasonPlanner from "@/components/tournaments/seasonPlanner/add";
import { getTeamRequirementByID } from "@/redux/slices/teamRequirement/getTeamRequirementByIdSlice";
import FieldSkeleton from "@/components/Forms/FieldSkeleton";

const SlideSeasonPlanner: React.FC<any> = ({
  open,
  onClose,
  isEditData,
  setIsUpdated,
  module,
  setModule
}) => {
  const dispatch: editStaffDispatch = useDispatch();
  const router = useRouter();
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];

  const getTeamRequirementByIDData = useSelector((state: RootState) => {
      return state &&
        state.getTeamRequirementByID
    });

  // useEffect(() => {
  //   if (!isEditData) return;
  //   const payload: any = {
  //     teamRequirementID: Number(isEditData),
  //     sportID: Number(teamID),

  //   };
  //   dispatch(getTeamRequirementByID(payload));
  // }, [isEditData]);
  

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "50%",
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
          {module === "View-season" ? "View Season Plan" : module === "Update-season" ? "Edit Season Plan" : null}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box>
        <Box mt={2} px={4}>
          {isEditData?.loading ? (
            <FieldSkeleton isAvatar={true} />
          ) : (
            <CreateSeasonPlanner
              edit={true}
              getTeamRequirementByIDData={getTeamRequirementByIDData}
              id={isEditData}
              setIsUpdated={setIsUpdated}
              onClose={onClose}
              module={module}
              setModule={setModule}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default SlideSeasonPlanner;