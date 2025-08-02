import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  styled,
  Menu,
  MenuItem,
  Stack,
  Alert,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { editStaffDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import isEmpty from "lodash/isEmpty";
import { getAthleteID } from "@/redux/slices/athlete/getAthleteIDSlice";
import GeneralInformation from "../../../../../components/trainingPlans/edit/GeneralInformation";
import TrainingDetails from "../../../../../components/trainingPlans/edit/TrainingDetails";
import { editTrainingPlans } from "@/redux/slices/trainingPlans/TrainingPlansEditSlice";
import FieldSkeleton from "@/components/Forms/FieldSkeleton";
import { iconMapping } from "@/utils/constants";
import { viewTrainingPlans } from "@/redux/slices/trainingPlans/TrainingPlansListSlice";

const StyledTab = styled(Tab)<{ selected: boolean }>(
  ({ selected, disabled }) => ({
    flexGrow: 1,
    backgroundColor: selected ? "#008755" : "white",
    color: selected ? "#fff !important" : "#58585B99",
    fontFamily: "29LT Bukra !important",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
    pointerEvents: disabled ? "none" : "auto",
    opacity: disabled ? 0.6 : 1,
    "&:hover": {
      backgroundColor: selected ? "#006b43" : "#f0f0f0",
    },
  })
);

const SlideDialog: React.FC<any> = ({ open, onClose, id, setisEditData }) => {
  const dispatch: editStaffDispatch = useDispatch();
  const router = useRouter();
  const pathName = router?.pathname.split("/")[4];
  const { teamID } = router.query;
  const editTrainingPlansData = useSelector(
    (state: RootState) => state?.TrainingPlansEdit
  );
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");
  const TrainingPlansAddData: any = useSelector(
    (state: RootState) => state.TrainingPlansAdd
  );
  const [showBanner, setShowBanner] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>(
    "General Information"
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleContactInformation = () => {
    setSelectedMenuItem("General Information");
    setTabValue(1);
    handleMenuClose();
  };

  useEffect(() => {
    if (id) {
      const payload: any = {
        trainingPlanID: id,
        sportID: Number(teamID),
        
      };
      dispatch(editTrainingPlans(payload));
    }
  }, [id]);

  useEffect(() => {
    if (
      TrainingPlansAddData &&
      TrainingPlansAddData.code === 200
      // && pathName !== "view"
    ) {
      setAlertType("success");
      setAlertMessage("Training Plan updated successfully!");
      setShowBanner(true);
      setTimeout(() => {
        // onClose()
        const payload: any = {
          searchText: "",
          filteredBy: "",
          paginationIndex: 0,
          paginationCount: 0,
          sportID: Number(teamID),
          
        };
        if (pathName === "trainingTemplate") {
          dispatch(
            viewTrainingPlans({ url: "/GetTrainingPlanDraftList", payload })
          );
        } else {
          dispatch(viewTrainingPlans({ url: "/GetTrainingPlanList", payload }));
        }
        setShowBanner(false);
      }, 2000);
    } else if (TrainingPlansAddData && TrainingPlansAddData.code === 500) {
      setAlertType("error");
      setAlertMessage(TrainingPlansAddData && TrainingPlansAddData.error);
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
      }, 2000);
    }
  }, [TrainingPlansAddData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
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
      {showBanner && (
        <Snackbar
          open={showBanner}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            icon={iconMapping[alertType]}
            onClose={handleClose}
            severity={alertType}
            variant="filled"
            className="dubai-med"
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      )}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
          Edit Training Plan
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            backgroundColor: "white",
            borderTop: `1px solid #58585B66`,
            borderBottom: `1px solid #58585B66`,
            "& .MuiTabs-indicator": { backgroundColor: "transparent" },
          }}
        >
          <StyledTab
            label="General Information"
            selected={tabValue === 0}
            className="text-capitalize bukra stepper-label-view"
            disabled={editTrainingPlansData.loading}
          />
          <StyledTab
            label="Training Details"
            selected={tabValue === 1}
            className="text-capitalize bukra stepper-label-view"
            disabled={editTrainingPlansData.loading}
          />
        </Tabs>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{ "aria-labelledby": "basic-button" }}
        >
          {selectedMenuItem === "General Information" ? (
            <MenuItem
              onClick={handleContactInformation}
              className="dubai-med"
            ></MenuItem>
          ) : null}
          {selectedMenuItem === "Training Details" ? (
            <MenuItem
              onClick={handleContactInformation}
              className="dubai-med"
            ></MenuItem>
          ) : null}
        </Menu>
        <Box mt={2} px={5}>
          {editTrainingPlansData.loading ? (
            <FieldSkeleton isAvatar={true} />
          ) : tabValue === 0 ? (
            <GeneralInformation
              teamId={teamID}
              editTrainingPlansData={
                editTrainingPlansData && editTrainingPlansData?.data
              }
              onClose={onClose}
              id={id}
              setTabValue={setTabValue}
            />
          ) : tabValue === 1 ? (
            <TrainingDetails
              teamId={teamID}
              editTrainingPlansData={
                editTrainingPlansData && editTrainingPlansData?.data
              }
              onClose={onClose}
              id={id}
              setTabValue={setTabValue}
            />
          ) : (
            <Stack spacing={1} alignItems="flex-start">
              <Alert className="dubai-med" severity="error">
                Something went wrong
              </Alert>
            </Stack>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default SlideDialog;
