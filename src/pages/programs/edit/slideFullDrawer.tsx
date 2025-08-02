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
import { editTrainingCamp } from "@/redux/slices/trainingCamp/trainingCampEditSlice";
import { usePathname } from "next/navigation";
import ProgramsAdd from "@/components/programs/add/Programs";
import { GetProgramByID } from "@/redux/slices/program/getRaceCalendarIDSlice";

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
  module?: string;
  isEditData?: any;
}

const SlideFullDrawer: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  module,
  isEditData,
}) => {
  const dispatch: editStaffDispatch = useDispatch();
  const router = useRouter();
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];
  const [isUpdated, setIsUpdated] = useState(false);
  const GetProgramEditData = useSelector(
    (state: RootState) => state.GetProgramById
  );
  const progranEditdata = GetProgramEditData && GetProgramEditData?.data[0];
  useEffect(() => {
    if (isEditData || isUpdated) {
      const payload: any = {
        programID: Number(isEditData),
      };
      dispatch(GetProgramByID(payload));
    }
  }, [isEditData, isUpdated]);

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
          Edit Programs
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box>
        <Box mt={2} px={4}>
          <ProgramsAdd
            edit={true}
            GetProgramEditData={progranEditdata}
            id={isEditData}
            setIsUpdated={setIsUpdated}
            onClose={onClose}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default SlideFullDrawer;
