import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { editStaffDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editTestAndMedicalChecks } from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";
import CreateFitness from "@/components/testAndMedicalChecks/add/AddTestAndMedicalChecks";

const FitnessSlideDialog: React.FC<any> = ({
  open,
  onClose,
  id,
  testType,
  isEditSportId,
}) => {
  const dispatch: editStaffDispatch = useDispatch();
  const editTestAndMedicalsData = useSelector(
    (state: RootState) => state?.getTestAndMedicalChecksByID
  );

  useEffect(() => {
    if (id) {
      const payload: any = {
        testAndMedicalChecksID: id,
        sportID: Number(isEditSportId),
      };
      dispatch(editTestAndMedicalChecks(payload));
    }
  }, [id]);
  const editData =
    editTestAndMedicalsData && editTestAndMedicalsData?.data?.length > 0
      ? editTestAndMedicalsData?.data[0]
      : "";
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
          Edit Fitness
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box>
        <Box mt={2} px={4}>
          <CreateFitness
            teamId={isEditSportId}
            editTestAndMedicalsData={editData}
            onClose={onClose}
            id={id}
            testType={testType}
            module="fitness"
            isEditSportId={isEditSportId}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default FitnessSlideDialog;
