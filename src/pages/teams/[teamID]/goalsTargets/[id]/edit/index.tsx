import React, { useEffect } from "react";
import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editGoalsTargets } from "@/redux/slices/goalsTargets/goalsTargetsEditSlice";
import EditLongTermGoals from "./editLongTermGoals";
import _ from "lodash";
import IndividualMilestoneSlider from "../../view/individualMilestoneSlider";
import { usePathname } from "next/navigation";
import FieldSkeleton from "@/components/Forms/FieldSkeleton";

interface SlideDialogProps {
  open: boolean;
  onClose: () => void;
  id: any;
  module?: string;
  seasonID: any;
}

const Edit: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  id,
  module,
  seasonID,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const editGoalsTargetsData = useSelector(
    (state: RootState) => state.editGoalsTargets
  );
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];

  useEffect(() => {
    if (id && module === "edit" && seasonID) {
      const payload: any = {
        goalsAndTargetsID: id,
        sportID: teamId,
        seasonID: seasonID,
        
      };
      dispatch(editGoalsTargets(payload));
    }
  }, [id]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: 550,
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
          {module === "edit"
            ? "Edit Goal"
            : module === "milestone" && id === null
            ? "Add Individual Milestone"
            : "Update Individual Milestone"}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box>
        {module === "edit" ? (
          <>
            {editGoalsTargetsData?.loading ? (
              <Box p={5}>
                <FieldSkeleton isAvatar={false} />
              </Box>
            ) : (
              <EditLongTermGoals
                editGoalsTargetsData={editGoalsTargetsData}
                id={id}
                onClose={onClose}
                seasonID={seasonID}
              />
            )}
          </>
        ) : (
          <IndividualMilestoneSlider
            editGoalsTargetsData={editGoalsTargetsData}
            id={id}
            onClose={onClose}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default Edit;
