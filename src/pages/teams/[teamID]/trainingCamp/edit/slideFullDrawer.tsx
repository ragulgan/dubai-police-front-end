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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { editStaffDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import StrategyCampDetails from "../../../../../components/trainingCamp/add/strategyCampDetails";
import TrainingNutritionPlan from "../../../../../components/trainingCamp/add/trainingNutritionPlan";
import TravelCost from "../../../../../components/trainingCamp/add/travelCost";
import BenchmarkAcknowledgment from "../../../../../components/trainingCamp/add/benchmarkAcknowledgement";
import { editTrainingCamp } from "@/redux/slices/trainingCamp/trainingCampEditSlice";
import { usePathname } from "next/navigation";

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
    borderRight: selected ? 0 : "0.5px solid #BCBCBD",
    "&:hover": {
      backgroundColor: selected ? "#006b43" : "#f0f0f0",
    },
  })
);

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  module?: string;
  isEditData?: any;
}

const SlideFullDrawer: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  module,
  isEditData,
}) => {
  const dispatch: editStaffDispatch = useDispatch();
  const router = useRouter();
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];
  const [tabValue, setTabValue] = useState(0);
  const [isUpdated, setIsUpdated] = useState(false);
  const trainingCampEditData = useSelector(
    (state: RootState) => state.editTraningCamp
  );
  const [allData, setAllData] = useState<any>({});

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (isEditData || isUpdated) {
      const payload = {
        sportID: Number(teamID),
        trainingCampID: Number(isEditData),

      };
      dispatch(
        editTrainingCamp({ url: "/GetTrainingCampByID", payload: payload })
      );
    }
  }, [isEditData, isUpdated]);

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
          Edit
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ mr: 2 }}>
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
            label="Strategy & Camp Details"
            selected={tabValue === 0}
            className="text-capitalize bukra stepper-label-view"
            disabled={trainingCampEditData && trainingCampEditData?.loading}
          />
          <StyledTab
            label={"Events Plan & Meal Schedule"}
            selected={tabValue === 1}
            className="text-capitalize bukra stepper-label-view"
            disabled={trainingCampEditData && trainingCampEditData?.loading}
          />
          <StyledTab
            label={"Travel & Costs"}
            selected={tabValue === 2}
            className="text-capitalize bukra stepper-label-view"
            disabled={trainingCampEditData && trainingCampEditData?.loading}
          />
          <StyledTab
            label={"Benchmark & Acknowledgment"}
            selected={tabValue === 2}
            className="text-capitalize bukra stepper-label-view"
            disabled={trainingCampEditData && trainingCampEditData?.loading}
          />
        </Tabs>
        <Box mt={2} px={4}>
          {tabValue === 0 ? (
            <StrategyCampDetails
              activeStep={tabValue}
              setActiveStep={setTabValue}
              edit={true}
              onClose={onClose}
              trainingCampEditData={trainingCampEditData}
              id={isEditData}
              setAllData={setAllData}
              setIsUpdated={setIsUpdated}
            />
          ) : tabValue === 1 ? (
            <TrainingNutritionPlan
              activeStep={tabValue}
              setActiveStep={setTabValue}
              edit={true}
              trainingCampEditData={trainingCampEditData}
              id={isEditData}
              setAllData={setAllData}
              setIsUpdated={setIsUpdated}
            />
          ) : tabValue === 2 ? (
            <TravelCost
              activeStep={tabValue}
              edit={true}
              setActiveStep={setTabValue}
              trainingCampEditData={trainingCampEditData}
              id={isEditData}
              setAllData={setAllData}
              setIsUpdated={setIsUpdated}
            />
          ) : (
            <BenchmarkAcknowledgment
              activeStep={tabValue}
              setActiveStep={setTabValue}
              edit={true}
              trainingCampEditData={trainingCampEditData}
              id={isEditData}
              setAllData={setAllData}
              setIsUpdated={setIsUpdated}
              onClose={onClose}
            />
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default SlideFullDrawer;
