import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import CreateResearchForm from "../add/createReasearchForm";
import CreateFacilitiesForm from "../add/createFacilitiesForm";

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  isEditData?: any;
  setIsUpdated?: any;
  module?: any;
}

const EditResearchFacilitiesSlider: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  isEditData,
  setIsUpdated,
  module,
}) => {
  const editResearchFacilitiesData = useSelector((state: any) => {
    return state.editResearchAndFacilities;
  });

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
          {`Edit ${
            module === "research" ? "Research" : "Facilities"
          }`}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box px={4}>
        {module === "research" ? (
          <CreateResearchForm
            edit={true}
            editResearchFacilitiesData={editResearchFacilitiesData}
            id={isEditData}
            onClose={onClose}
            setIsUpdated={setIsUpdated}
          />
        ) : (
          <CreateFacilitiesForm
            edit={true}
            editResearchFacilitiesData={editResearchFacilitiesData}
            id={isEditData}
            onClose={onClose}
            setIsUpdated={setIsUpdated}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default EditResearchFacilitiesSlider;
