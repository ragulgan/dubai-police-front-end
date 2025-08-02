import React, { useEffect } from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import CreateFacilitiesForm from "../add/createFacilitiesForm";
import { editResearchAndFacilities } from "@/redux/slices/researchFacilities/researchFacilitiesEditSlice";

interface EditFacilitiesSliderProps {
  open: boolean;
  onClose: any;
  facilityID: number;
  setIsUpdated?: any;
  module?: any;
}

const EditFacilitiesSlider: React.FC<EditFacilitiesSliderProps> = ({
  open,
  onClose,
  facilityID,
  setIsUpdated
}) => {

  const dispatch: any = useDispatch();

  const editResearchFacilitiesData = useSelector((state: any) => {
    return state.editResearchAndFacilities;
  });

  useEffect(() => {
    if (open) {
      const payload = {
        facilityID: Number(facilityID),
        
      };
      dispatch(
        editResearchAndFacilities({ url: "/GetFacilitiesByID", payload: payload })
      );
    }
  }, [open]);

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
          {`Edit Facilities`}
        </Typography>
        <IconButton data-testid="button-close" onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box px={4}>
        <CreateFacilitiesForm
          edit={true}
          editResearchFacilitiesData={editResearchFacilitiesData}
          id={facilityID}
          onClose={onClose}
          setIsUpdated={setIsUpdated}
        />
      </Box>
    </Drawer>
  );
};

export default EditFacilitiesSlider;
