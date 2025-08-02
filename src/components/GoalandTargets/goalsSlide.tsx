import React, { useEffect, useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { editStaffDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import CustomTextField from "../Fields/CustomTextField";
import { useForm } from "react-hook-form";
import { UpdateSeason } from "@/redux/slices/season/SeasonUpdateSlice";
import _ from "lodash";

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  module?: string;
  selectSeason: any;
  seasonID: any;
  editSeasonData: any;
  setGoalModule: any;
  setIsGoalOpen: any;
}

const GoalsSlideDialog: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  module,
  selectSeason,
  seasonID,
  editSeasonData,
  setGoalModule,
  setIsGoalOpen,
}) => {
  const dispatch: editStaffDispatch = useDispatch();
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      longtermGoals: "",
    },
  });

  const longtermGoals = watch("longtermGoals");

  const onSubmit = (data: any) => {
    const payload = {
      seasonID: seasonID,
      goalSection:
        module === "Edit Long-term Goals" ? "longTermGoals" : "seasonsMainGoal",
      goalSectionText: data.longtermGoals,

    };
    dispatch(UpdateSeason(payload));
  };

  useEffect(() => {
    if (editSeasonData) {
      setValue(
        "longtermGoals",
        module === "Edit Long-term Goals" || module === "View Long-term Goals"
          ? editSeasonData.longTermGoals || ""
          : editSeasonData.seasonsMainGoal || ""
      );
    }
  }, [editSeasonData, module, setValue]);

  const handleViewEdit = () => {
    onClose(false);
    setIsGoalOpen(true);
    setGoalModule(module?.replace("View", "Edit"));
  };

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
          {module}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box p={4}>
        {module === "View Long-term Goals" ||
          module === "View Season's Main Goal" ? (
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
            <Button
              onClick={handleViewEdit}
              variant="outlined"
              color="primary"
              className="text-capitalize"
            >
              Edit
            </Button>
          </Box>
        ) : null}
        <form onSubmit={handleSubmit(onSubmit)}>
          <CustomTextField
            name="longtermGoals"
            control={control}
            // label={module}
            textarea={true}
            disabled={
              module === "View Long-term Goals" ||
              module === "View Season's Main Goal"
            }
          />
          {module === "View Long-term Goals" ||
            module === "View Season's Main Goal" ? (
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
              <Button
                onClick={() => onClose(false)}
                variant="outlined"
                color="primary"
                className="text-capitalize dubai-med"
                sx={{ height: "48px", fontSize: "16px" }}
              >
                Close
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 4,
              }}
            >
              <Button
                onClick={() => onClose(false)}
                variant="outlined"
                color="secondary"
                className="text-capitalize dubai-med"
                sx={{ height: "48px", fontSize: "16px", paddingX: "16px" }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="text-capitalize dubai-med"
                sx={{ height: "48px", fontSize: "16px", paddingX: "16px" }}
                disabled={_.isEmpty(longtermGoals)}
              >
                Update
              </Button>
            </Box>
          )}
        </form>
      </Box>
    </Drawer>
  );
};

export default GoalsSlideDialog;
