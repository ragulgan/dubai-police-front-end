import React, { useEffect } from "react";
import { Drawer, Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RewardsAdd from "@/components/rewards/add/rewardsAdd";
import { AppDispatch } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editRewards } from "@/redux/slices/rewards/rewardsEditSlice";
import { useRouter } from "next/router";

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  isEditData?: any;
  setIsUpdated?: any;
}

const SlideRewardDrawer: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  isEditData,
  setIsUpdated,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { teamID } = router.query;

  const rewardsEditresponse = useSelector((state: any) => {
    return state.rewardsEdit;
  });

  useEffect(() => {
    if (isEditData && teamID) {
      const payload = {
        rewardsID: Number(isEditData),
        sportID: Number(teamID),
        
      };
      dispatch(editRewards({ url: "/GetRewardsByID", payload: payload }));
    }
  }, [isEditData]);

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
          Edit Rewards
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <Box>
        <Box px={1}>
          <RewardsAdd
            edit={true}
            id={isEditData}
            onClose={onClose}
            setIsUpdated={setIsUpdated}
            rewardsEditresponse={rewardsEditresponse}
          />
        </Box>
      </Box>
    </Drawer>
  );
};

export default SlideRewardDrawer;
