"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Step,
  StepLabel,
  Stepper,
  Grid,
  Typography,
  StepIconProps,
  Stack,
  Divider,
  Button,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@/utils/helper";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import AppAlertDialog from "@/components/AppAlertDialog";
import LoadingOverlay from "@/components/Loading";
import SubMenuLayout from "../layout";
import StrategyCampDetails from "@/components/trainingCamp/add/strategyCampDetails";
import TrainingNutritionPlan from "@/components/trainingCamp/add/trainingNutritionPlan";
import TravelCost from "@/components/trainingCamp/add/travelCost";
import BenchmarkAcknowledgment from "@/components/trainingCamp/add/benchmarkAcknowledgement";
import { deleteTrainingCamp } from "@/redux/slices/trainingCamp/trainingCampDeleteSlice";
import { editTrainingCamp } from "@/redux/slices/trainingCamp/trainingCampEditSlice";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import StepperProgress from "../../../../../../public/svg/StepperProgress.svg";

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
    <StepperProgress style={{ fontSize: "40px", color: "#008755" }} />
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

const steps = [
  "Strategy & Camp Details",
  "Events Plan & Meal Schedule",
  "Travel & Costs",
  "Benchmark & Acknowledgment",
];

const StepperForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);
  const [resetForm, setResetForm] = useState(false);
  const [allData, setAllData] = useState<any>({});
  const lastStaffIDRef = useRef(null);
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const router = useRouter();
  const [disableRouting, setDisableRouting] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [routeHandel, setRouteHandel] = useState(true);
  const [navigate, setNavigate] = useState<any>();
  const isTab = useMediaQuery("(min-width:768px)");
  const isLaptop = useMediaQuery("(min-width:1024px)");
  const isLaptopL = useMediaQuery("(min-width:1440px)");
  const is2K = useMediaQuery("(min-width:1535px)");
  const is3K = useMediaQuery("(min-width:1700px)");
  const isFullHD = useMediaQuery("(min-width:1920px)");
  const is4K = useMediaQuery("(min-width:2560px)");

  const getPageContentHeight = () => {
    if (is4K) return "71vh";
    if (isFullHD) return "72vh";
    if (is3K) return "71vh";
    if (is2K) return "65vh";
    if (isLaptopL) return "71vh";
    if (isLaptop) return "71vh";
    if (isTab) return "67vh";
    return "71vh";
  };

  const trainingCampEditData = useSelector(
    (state: RootState) => state.editTraningCamp
  );
  const editPayload: any = {
    trainingCampID: allData.trainingCampID,
    sportID: teamId,
  };

  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.TrainingCampAdd)) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    setLocalStorage("addTrainingCampData", JSON.stringify(allData));
    if (
      allData.trainingCampID &&
      allData.trainingCampID !== lastStaffIDRef.current
    ) {
      const payload: any = {
        trainingCampID: allData.trainingCampID,
        sportID: teamId,
      };
      dispatch(
        editTrainingCamp({ url: "/GetTrainingCampByID", payload: payload })
      );
      lastStaffIDRef.current = allData.trainingCampID;
    }
  }, [allData]);

  useEffect(() => {
    return () => {
      removeLocalStorage("addTrainingCampData");
    };
  }, []);

  const deletePayload: any = {
    trainingCampID: allData.trainingCampID,
  };

  const handleDialogAgree = () => {
    setDisableRouting(false);
    setDialogOpen(false);
    removeLocalStorage("addTrainingCampData");
    setResetForm(true);
    setTimeout(() => {
      setResetForm(false);
    }, 2000);
    if (allData.trainingCampID) {
      setLoading(true);
      dispatch(
        deleteTrainingCamp({
          url: "/DeleteTrainingCampByID",
          payload: deletePayload,
        })
      );
      setTimeout(() => {
        router.push(`/teams/${getCurrentSport}/trainingCamp`);
        setLoading(false);
      }, 2000);
    } else {
      router.push(
        navigate ? navigate : `/teams/${getCurrentSport}/trainingCamp`
      );
    }
  };

  const handleDialogDisagree = () => {
    setDialogOpen(false);
  };

  const handleRouteChange = (url: any) => {
    if (disableRouting) {
      setDialogOpen(true);
      return false;
    }
    return true;
  };

  useEffect(() => {
    if (routeHandel) {
      const onRouteChangeStart = (url: any) => {
        setNavigate(url);
        if (!handleRouteChange(url)) {
          router.events.emit("routeChangeError");
          throw "Route change aborted by user";
        }
      };
      if (disableRouting) {
        router.events.on("routeChangeStart", onRouteChangeStart);
      }
      return () => {
        router.events.off("routeChangeStart", onRouteChangeStart);
      };
    }
  }, [disableRouting]);

  const renderStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <StrategyCampDetails
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            setDialogOpen={setDialogOpen}
            resetForm={resetForm}
            setResetForm={setResetForm}
          />
        );
      case 1:
        return (
          <TrainingNutritionPlan
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            resetForm={resetForm}
            setResetForm={setResetForm}
          />
        );
      case 2:
        return (
          <TravelCost
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            resetForm={resetForm}
            setResetForm={setResetForm}
            trainingCampEditData={trainingCampEditData}
          />
        );
      case 3:
        return (
          <BenchmarkAcknowledgment
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            setDisableRouting={setDisableRouting}
            setRouteHandel={setRouteHandel}
            resetForm={resetForm}
            setResetForm={setResetForm}
            payload={editPayload}
            trainingCampEditData={trainingCampEditData}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: "/teams/trainingCamp",
      currentPage: false,
      disabled: true,
    },
    {
      title: "Training Camp",
      route: `/teams/${getCurrentSport}/trainingCamp`,
      currentPage: false,
      disabled: true,
    },
    {
      title: "Add Training Camp",
      route: "/teams/trainingCamp/add",
      currentPage: true,
      disabled: true,
    },
  ];

  return (
    <Grid container spacing={1}>
      <AppAlertDialog
        open={dialogOpen}
        onClose={handleDialogDisagree}
        title="Discard Changes"
        description="You have unsaved changes. Do you really want to leave this page?"
        onAgree={handleDialogAgree}
        onDisagree={handleDialogDisagree}
        agreeLabel="Discard"
        disagreeLabel="Cancel"
      />
      {loading && <LoadingOverlay loading={loading} />}
      <Grid item xs={12} md={12}>
        <Box p={1.5} className="bg-white" borderRadius={1}>
          <BasicBreadcrumbs routes={breadcrumbRoutes} setOpen={setDialogOpen} />
        </Box>
      </Grid>
      <Grid item xs={12} md={12}>
        <Box className="bg-white" borderRadius={1}>
          <Box p={2}>
            <Box>
              <Typography
                sx={{
                  fontSize: "18px",
                  lineHeight: "19.2px",
                  textAlign: "left",
                }}
                className="bukra-semi-bold"
              >
                Create Training Camp
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Stack
            sx={{
              width: "100%",
              height: getPageContentHeight(),
              overflowY: "scroll",
            }}
            spacing={4}
            mt={2}
          >
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<ColorlibConnector />}
            >
              {steps.map((label, key) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={ColorlibStepIcon}>
                    <Typography className="stepper-number dubai-med">
                      Step {key + 1}
                    </Typography>
                    <Typography
                      className={`dubai-med ${activeStep === key
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
            <Box
              px={5}
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Box>
                <Typography className="dubai-med stepper-header">
                  Step {activeStep + 1} of 4
                </Typography>
                <Typography className="dubai-med stepper-header">
                  Estimated Time: 1 minute(s)
                </Typography>
              </Box>
              <Button
                variant="outlined"
                className="text-capitalize dubai-med"
                color="secondary"
                sx={{ height: "48px", fontSize: "16px", fontWeight: 500 }}
                onClick={() => setResetForm(true)}
              >
                Clear form
              </Button>
            </Box>
            <Box>{renderStepContent(activeStep)}</Box>
          </Stack>
        </Box>
      </Grid>
    </Grid>
  );
};

StepperForm.getLayout = (page: React.ReactNode) => (
  <SubMenuLayout>{page}</SubMenuLayout>
);
export default StepperForm;
