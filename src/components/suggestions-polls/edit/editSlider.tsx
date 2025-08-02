import React from "react";
import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import CreatePollsForm from "../create/CreatePolls";
import CreateSuggestionForm from "../create/createSuggestions";

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  isEditData?: any;
  setIsUpdated?: any;
  module?: any;
}

const EditPollsSlider: React.FC<any> = ({
  open,
  onClose,
  isEditData,
  setIsUpdated,
  module,
}) => {
  const suggestionsAndPolls = useSelector((state: any) => {
    return state.suggestionsAndPollsEdit;
  });
  const pollsEditData = suggestionsAndPolls?.data?.[0] ?? null;

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
          Edit {module === "suggestion" ? "Suggestion" : "Polls"}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box sx={{ marginY: 2 }} />
      <Box px={4}>
        {module === "suggestion" ? (
          <CreateSuggestionForm
            edit={true}
            suggestionEditData={pollsEditData}
            id={isEditData}
            onClose={onClose}
            setIsUpdated={setIsUpdated}
          />
        ) : (
          <CreatePollsForm
            edit={true}
            pollsEditData={pollsEditData}
            id={isEditData}
            onClose={onClose}
            setIsUpdated={setIsUpdated}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default EditPollsSlider;
