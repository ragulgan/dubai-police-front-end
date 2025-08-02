import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { editStaffDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import FieldSkeleton from "@/components/Forms/FieldSkeleton";
import TestAndMedicalChecks from "@/components/testAndMedicalChecks/add/AddTestAndMedicalChecks";
import {
  clearTestAndMedicalChecksEditState,
  editTestAndMedicalChecks,
} from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";

const TestAndMedicalsSlideResultDialog: React.FC<any> = ({
  open,
  onClose,
  id,
  testType,
}) => {
  const dispatch: editStaffDispatch = useDispatch();
  const router = useRouter();
  const { teamID } = router.query;
  const editTestAndMedicalsData = useSelector(
    (state: RootState) => state?.getTestAndMedicalChecksByID
  );
  useEffect(() => {
    if (id) {
      const payload: any = {
        testAndMedicalChecksID: id,
        sportID: Number(teamID),
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
          Edit Result
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ mr: 2 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box>
        <Box mt={2} px={4}>
          {
            // editTestAndMedicalsData.loading ? (
            //   <FieldSkeleton isAvatar={true} />
            // ) :
            <TestAndMedicalChecks
              teamId={teamID}
              editTestAndMedicalsData={editData}
              onClose={onClose}
              id={id}
              testType={testType}
            />
          }
        </Box>
      </Box>
    </Drawer>
  );
};

export default TestAndMedicalsSlideResultDialog;
