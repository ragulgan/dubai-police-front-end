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
  Divider,
  Stack,
  Stepper,
  StepLabel,
  Step,
  Button,
  Grid,
  StepConnector,
  useMediaQuery,
  stepConnectorClasses,
  StepIconProps,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { editStaffDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editTrainingCamp } from "@/redux/slices/trainingCamp/trainingCampEditSlice";
import { usePathname } from "next/navigation";
import { getLocalStorage } from "@/utils/helper";
// import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import InProgressSvgIcon from '@/../../public/svg/Inprogress.svg'
import Brightness1Icon from "@mui/icons-material/Brightness1";

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
  isEditData?: any;
  activeStep?: any;
  setActiveStep?: any;
  resetForm:any;
  renderStepContent:any;
  steps?:any;
  setResetForm?:any;
  module?:any
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  left: "calc(-50% + 16px) !important",
  right: "calc(50% + 16px) !important",
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#008755",
      color: "#008755",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundColor: "#008755",
      color: "#008755",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: "#eaeaf0",
    borderRadius: 1,
  },
}));
const getCurrentSport = getLocalStorage("sport");
const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(() => ({
  zIndex: 1,
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active = false, completed = false, className } = props;
  const iconToDisplay = completed ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="35px"
      height="35px"
      viewBox="0 0 40 40"
      style={{ objectFit: "contain" }}
      className={className}
    >
      <circle cx="20" cy="20" r="20" fill="#008755" />
      <path
        d="M12 20l5 5 10-10"
        fill="none"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : active ? (
    <InProgressSvgIcon style={{ fontSize: "40px", color: "red" }} />
  ) : (
    <Brightness1Icon style={{ fontSize: "40px", color: "#DEDEDE" }} />
  );

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {iconToDisplay}
    </ColorlibStepIconRoot>
  );
}

const SlideFullDrawer: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  isEditData,
  activeStep,
  setActiveStep,
  renderStepContent,
  steps,
  setResetForm,
  module
}) => {
  const dispatch: editStaffDispatch = useDispatch();
  const router = useRouter();
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];
  const [tabValue, setTabValue] = useState(0);
  const [isUpdated, setIsUpdated] = useState(false);
  
  
    const is2K = useMediaQuery("(min-width:1535px)");
    const is3K = useMediaQuery("(min-width:1700px)");
  const trainingCampEditData = useSelector(
    (state: RootState) => state.editTraningCamp
  );
  const [allData, setAllData] = useState<any>({});




  // const renderStepContent = (step: any) => {
  //   switch (step) {
  //     case 0:
  //       return (
  //         <StrategyCampDetails
  //           setActiveStep={setActiveStep}
  //           setAllData={setAllData}
  //           // setDialogOpen={setDialogOpen}
  //           resetForm={resetForm}
  //           setResetForm={setResetForm}
  //         />
  //       );
  //     case 1:
  //       return (
  //         <TrainingNutritionPlan
  //           activeStep={activeStep}
  //           setActiveStep={setActiveStep}
  //           setAllData={setAllData}
  //           resetForm={resetForm}
  //           setResetForm={setResetForm}
  //         />
  //       );
  //     case 2:
  //       return (
  //         <TravelCost
  //           activeStep={activeStep}
  //           setActiveStep={setActiveStep}
  //           setAllData={setAllData}
  //           resetForm={resetForm}
  //           setResetForm={setResetForm}
  //           trainingCampEditData={trainingCampEditData}
  //         />
  //       );
  //     case 3:
  //       return (
  //         <BenchmarkAcknowledgment
  //           activeStep={activeStep}
  //           setActiveStep={setActiveStep}
  //           setAllData={setAllData}
  //           // setDisableRouting={setDisableRouting}
  //           // setRouteHandel={}
  //           resetForm={resetForm}
  //           setResetForm={setResetForm}
  //           payload={[]}
  //           trainingCampEditData={trainingCampEditData}
  //         />
  //       );
  //     default:
  //       return <Typography>Unknown step</Typography>;
  //   }
  // };


  // useEffect(() => {
  //   if (isEditData || isUpdated) {
  //     const payload = {
  //       sportID: Number(teamID),
  //       trainingCampID: Number(isEditData),
  //       
  //     };
  //     dispatch(
  //       editTrainingCamp({ url: "/GetTrainingCampByID", payload: payload })
  //     );
  //   }
  // }, [isEditData, isUpdated]);

  const handleReset = (): void => {
    setResetForm(true);
  };
  
  return (
    <Drawer
    anchor="right"
    open={open}
    onClose={onClose}
    sx={{
      "& .MuiDrawer-paper": {
        width: "80%",
        padding: "0 !important",
        margin: "0 !important",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
    
      },
    }}
  >
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={0} // Ensure no bottom margin
      sx={{ padding: 0, margin: 0 }}
    >
      <Box p={2}>
        <Typography
          sx={{
            fontSize: "18px",
            lineHeight: "19.2px",
            textAlign: "left",
          }}
          className="bukra-semi-bold"
        >
          {`Submit Competition ${module} Reports`}
        </Typography>
      </Box>
      <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
        <CloseIcon />
      </IconButton>
    </Box>
  
    <Grid item xs={12} md={12} sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Box className="bg-white" borderRadius={1} sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Divider />
        <Stack
          sx={{
            width: "100%",
            flex: 1, // Ensures full height
            overflow: "auto", // Prevents unwanted padding issues
          }}
          spacing={4}
          mt={2}
        >
          <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
            {steps.map((label: string, key: number) => (
              <Step key={label}>
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  <Typography className="stepper-number dubai-med">Step {key + 1}</Typography>
                  <Typography
                    className={`dubai-med ${
                      activeStep === key
                        ? "stepper-label-active"
                        : key < activeStep
                        ? "stepper-label-active"
                        : "stepper-label dubai-med"
                    }`}
                  >
                    {label}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
  
          <Box px={5} display="flex" alignItems="center" justifyContent="flex-end">
            <Button
              variant="outlined"
              className="text-capitalize dubai-med"
              color="secondary"
              sx={{ height: "48px", fontSize: "16px", fontWeight: 500 }}
              onClick={handleReset}
            >
              Clear form
            </Button>
          </Box>
  
          <Box sx={{ paddingBottom: "0 !important", flex: 1 }}>{renderStepContent(activeStep)}</Box>
        </Stack>
      </Box>
    </Grid>
  </Drawer>
  
  );
};

export default SlideFullDrawer;
