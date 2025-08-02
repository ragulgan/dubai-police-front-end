import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import CreateRulesForm from "../create/createRules";
import CreateMousForm from "../create/createMous";

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  isEditData?: any;
  setIsUpdated?: any;
  module?: any;
}

const EditSlider: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  isEditData,
  setIsUpdated,
  module,
}) => {
  const editRulesData = useSelector((state: any) => {
    return state.rulesEdit;
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
        borderBottom={"1px solid #DEE2ED"}
      >
        <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
          {`Edit ${
            module === "mou" ? "MOUs & Partnership" : "Rules & Agreements"
          }`}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box px={4}>
        {module === "mou" ? (
          <CreateMousForm
            edit={true}
            editRulesData={editRulesData}
            id={isEditData}
            onClose={onClose}
            setIsUpdated={setIsUpdated}
          />
        ) : (
          <CreateRulesForm
            edit={true}
            editRulesData={editRulesData}
            id={isEditData}
            onClose={onClose}
            setIsUpdated={setIsUpdated}
          />
        )}
      </Box>
    </Drawer>
  );
};

export default EditSlider;
