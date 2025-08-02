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
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { getLocalStorage, removeLocalStorage } from "@/utils/helper";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { clearEditState } from "@/redux/slices/trainingPlans/TrainingPlansEditSlice";
import _ from "lodash";
import SubMenuLayout from "../layout";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import AppAlertDialog from "@/components/AppAlertDialog";
import LoadingOverlay from "@/components/Loading";
import GeneralInformation from "../../../../../components/trainingPlans/add/GeneralInformation";
import TrainingDetails from "../../../../../components/trainingPlans/add/TrainingDetails";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";
import StepperProgress from "../../../../../../public/svg/StepperProgress.svg";
import StepperInProgress from "../../../../../../public/svg/StepperInProgress.svg";

const getCurrentSport = getLocalStorage("sport");
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
    <StepperProgress style={{ fontSize: "40px", color: "#9BE3BF" }} />
  ) : (
    <StepperInProgress style={{ fontSize: "40px", color: "#9BE3BF" }} />
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

const steps = ["General Information", "Training Details"];

const StepperForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const editTrainingPlansData = useSelector(
    (state: RootState) => state?.TrainingPlansEdit?.data
  );
  const [activeStep, setActiveStep] = useState(0);
  const [allData, setAllData] = useState<any>({});
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const router = useRouter();
  const [disableRouting, setDisableRouting] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [routeHandel, setRouteHandel] = useState(true);
  const { id } = router.query;
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

  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.TrainingPlanAdd)) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    dispatch(clearEditState());
  }, []);

  const isRenderedOnce = useRef(false);

  useEffect(() => {
    if (!isRenderedOnce.current && !_.isEmpty(editTrainingPlansData) && id) {
      setActiveStep(editTrainingPlansData.trainingSectionStage === 1 ? 0 : 1);
      isRenderedOnce.current = true;
    }
  }, [editTrainingPlansData]);

  const editPayload: any = {
    trainingPlanID: allData.trainingPlanID,
    sportID: teamId,
  };

  const deletePayload: any = {
    trainingPlanID: allData.trainingPlanID,
  };

  const handleDialogAgree = () => {
    setDisableRouting(false);
    setDialogOpen(false);
    removeLocalStorage("addAthleteData");
    if (allData?.trainingPlanID) {
      setLoading(true);
      setTimeout(() => {
        router.push(navigate);
        setLoading(false);
      }, 2000);
    } else {
      router.push(navigate);
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
          <GeneralInformation
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            teamId={teamId}
            editTrainingPlansData={editTrainingPlansData}
            editPayload={editPayload}
            setDialogOpen={setDialogOpen}
            setRouteHandel={setRouteHandel}
            setDisableRouting={setDisableRouting}
            setLoading={setLoading}
          />
        );
      case 1:
        return (
          <TrainingDetails
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            teamId={teamId}
            editTrainingPlansData={editTrainingPlansData}
            editPayload={editPayload}
            setRouteHandel={setRouteHandel}
            setDisableRouting={setDisableRouting}
            setLoading={setLoading}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: activeStep === 1 ? `/teams/${getCurrentSport}/trainingPlans` : "",
      currentPage: false,
      disabled: true,
    },
    {
      title: "TrainingPlans",
      route: activeStep === 1 ? `/teams/${getCurrentSport}/trainingPlans` : "",
      currentPage: false,
      disabled: true,
    },
    {
      title: "Add TrainingPlans",
      route: `/teams/${getCurrentSport}/trainingPlans/add`,
      currentPage: true,
      disabled: true,
    },
  ];

  return (
    <Grid container spacing={1} sx={{ mt: { xs: 0.1, sm: 0 } }}>
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
                {id ? "Update" : "Create"} Training Plan
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
