import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { editStaffDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import FieldSkeleton from "@/components/Forms/FieldSkeleton";
import AddResults from "@/components/results/add/AddResults";
import { editResults } from "@/redux/slices/results/ResultEditSlice";
import { isEmpty } from "lodash";

const SlideResultDialogs: React.FC<any> = ({
  open,
  onClose,
  id,
  setisEditData,
  sportId,
}) => {
  const dispatch: editStaffDispatch = useDispatch();
  const router = useRouter();
  const { teamID } = router.query;

  const editData = useSelector((state: RootState) => {
    return state &&
      state?.getResultByID &&
      !isEmpty(state?.getResultByID?.data) &&
      !isEmpty(state?.getResultByID?.data[0])
      ? state.getResultByID.data[0]
      : null;
  });

  useEffect(() => {
    if (id) {
      const payload: any = {
        resultID: id,
        sportID: Number(teamID) || sportId,
      };
      dispatch(editResults(payload));
    }
  }, [id]);

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
          Update Result
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box>
        <Box mt={2} px={4}>
          {editData?.loading ? (
            <FieldSkeleton isAvatar={true} />
          ) : (
            <AddResults
              teamId={teamID}
              editResultData={editData}
              onClose={onClose}
              id={id}
              sportIdEdit={sportId}
              module="latest-results"
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default SlideResultDialogs;
