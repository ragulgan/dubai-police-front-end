import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector } from "react-redux";
import CreateNewsForm from "./createNewsForm";

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  isEditData?: any;
  setIsUpdated?: any;
}

const EditSlider: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  isEditData,
  setIsUpdated,
}) => {
  const editNewsData = useSelector((state: any) => {
    return state.editNews;
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
          Edit News
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box px={4}>
        <CreateNewsForm
          edit={true}
          editNewsData={editNewsData}
          id={isEditData}
          onClose={onClose}
          setIsUpdated={setIsUpdated}
        />
      </Box>
    </Drawer>
  );
};

export default EditSlider;
