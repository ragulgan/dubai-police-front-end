"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import PersonalInformation from "../../../../../components/staff/personalInformation";
import { styled } from "@mui/material/styles";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import Brightness1Icon from "@mui/icons-material/Brightness1";
import ContactDetails from "../../../../../components/staff/contactDetails";
import EmploymentInformation from "../../../../../components/staff/employmentInformation";
import EducationandExperience from "../../../../../components/staff/educationandExperience";
import CertificationsAndLicenses from "../../../../../components/staff/certificationsAndLicenses";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@/utils/helper";
import BasicBreadcrumbs from "@/components/nav/BasicBreadcrumbs";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { clearStaffEditState } from "@/redux/slices/staff/staffEditSlice";
import _ from "lodash";
import SubMenuLayout from "../layout";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { deleteCustomerById } from "@/redux/slices/staff/staffDeleteSlice";
import AppAlertDialog from "@/components/AppAlertDialog";
import LoadingOverlay from "@/components/Loading";
import { BreadcrumbRoutes } from "@/interfaces/AppInterfaces";
import {
  clearStaffAndAthleteIdState,
  StaffAndAthleteId,
} from "@/redux/slices/staffAndAthlete/StaffAndAthleteIdSlice";
import CustomButton from "@/components/buttons/CustomButton";
import StepperProgress from "../../../../../../public/svg/StepperProgress.svg";
import StepperInProgress from "../../../../../../public/svg/StepperInProgress.svg";

import { checkAccess } from "@/utils/acessscheck";
import { USER_PERMISSION } from "@/utils/constants";

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

const steps = [
  "Personal Information",
  "Contact Details",
  "Employment Information",
  "Education & Experience",
  "Certifications & Licenses",
];
const Layout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isRegistrationPage = router.asPath.includes("/registration/");

  return !isRegistrationPage ? (
    <SubMenuLayout>{children}</SubMenuLayout>
  ) : (
    <>{children}</>
  );
};

const StaffStepperForm = (props: any) => {
  const { registration } = props;
  const dispatch: AppDispatch = useDispatch();
  const editStaffData = useSelector(
    (state: RootState) =>
      state.staffEdit && state.staffEdit.data && state.staffEdit.data[0]
  );
  const [activeStep, setActiveStep] = useState(0);
  const [allData, setAllData] = useState<any>({});
  const lastStaffIDRef = useRef(null);
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const router = useRouter();
  const [disableRouting, setDisableRouting] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showField, setShowField] = useState(false);
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
    if (is4K) return "70vh";
    if (isFullHD) return "72vh";
    if (is3K) return "70vh";
    if (is2K) return "66vh";
    if (isLaptopL) return "70vh";
    if (isLaptop) return "70vh";
    if (isTab) return "66vh";
    return "70vh";
  };
  const { selectedEmployee } = router.query;
  const [dialog, setDialog] = useState(false);
  const staffAndAthleteIdData = useSelector(
    (state: RootState) => state.staffAndAthleteIdList?.data?.[0] ?? null
  );
  const editPayload: any = {
    staffID: allData.staffID,
    sportID: teamId,
  };

  useEffect(() => {
    if (!checkAccess(USER_PERMISSION.StaffAdd)) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    setLocalStorage("addStaffData", JSON.stringify(allData));
    if (allData.staffID && allData.staffID !== lastStaffIDRef.current) {
      const payload: any = {
        staffID: allData.staffID,
        sportID: teamId,
      };
      lastStaffIDRef.current = allData.staffID;
    }
  }, [allData]);

  useEffect(() => {
    if (selectedEmployee) {
      setShowField(true);
      const payload: any = {
        employeeID: selectedEmployee,
      };
      dispatch(StaffAndAthleteId(payload));
    }
  }, [selectedEmployee]);

  useEffect(() => {
    if (editStaffData && !_.isEmpty(editStaffData.attachmentList)) {
      const profileImageAttachment = _.find(
        editStaffData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "profileimage"
      );
      const passportAttachment = _.find(
        editStaffData.attachmentList,
        (attachment) => attachment.documentSection.toLowerCase() === "passport"
      );
      const iDDocumentAttachment = _.find(
        editStaffData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "iddocument"
      );
      const certificateAttachment = _.find(
        editStaffData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "certificate"
      );
      const contractDocumentAttachment = _.find(
        editStaffData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "contractdocument"
      );
      const uploadCertificateAttachment = _.find(
        editStaffData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "certificate"
      );
      const heroImageAttachment = _.find(
        editStaffData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "profilefullimage"
      );
      const acknowledgementDoc = _.find(
        editStaffData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "acknowledgement"
      );
      const pledgeDoc = _.find(
        editStaffData.attachmentList,
        (attachment) => attachment.documentSection.toLowerCase() === "pledge"
      );
      const certificateOfGoodConductDoc = _.find(
        editStaffData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() ===
          "certificateofgoodconductdoc"
      );
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        iDdocumentImage: iDDocumentAttachment?.fileName || "",
        passportPdf: passportAttachment?.fileName || "",
        profileImage: profileImageAttachment?.filePath || "",
        certificate: certificateAttachment?.fileName || "",
        contract: contractDocumentAttachment?.fileName || "",
        uploadCertificate: uploadCertificateAttachment?.fileName || "",
        heroImage: heroImageAttachment?.filePath || "",
        acknowledgementDoc: acknowledgementDoc?.fileName || "",
        pledgeDoc: pledgeDoc?.fileName || "",
        certificateOfGoodConductDoc:
          certificateOfGoodConductDoc?.fileName || "",
      }));
    }
  }, [editStaffData]);

  useEffect(() => {
    return () => {
      removeLocalStorage("addStaffData");
      dispatch(clearStaffAndAthleteIdState());
      dispatch(clearStaffEditState());
    };
  }, []);

  const deletePayload: any = {
    staffID: allData.staffID,
  };

  const handleDialogAgree = () => {
    setDisableRouting(false);
    setDialogOpen(false);
    removeLocalStorage("addStaffData");
    if (allData.staffID) {
      setLoading(true);
      dispatch(deleteCustomerById(deletePayload));
      setTimeout(() => {
        if (navigate) {
          router.push(navigate);
        } else {
          router.push(navigate ? navigate : `/teams/${getCurrentSport}/staffs`);
        }
        setLoading(false);
      }, 2000);
    } else {
      router.push(navigate ? navigate : `/teams/${getCurrentSport}/staffs`);
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

  const filepayload: any = {
    staffID: allData?.staffID || "",
    sportID: teamId,
  };

  const renderStepContent = (step: any) => {
    switch (step) {
      case 0:
        return (
          <PersonalInformation
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            editStaffData={editStaffData}
            filepayload={filepayload}
            teamId={teamId}
            setDialogOpen={setDialogOpen}
            staffAndAthleteIdData={staffAndAthleteIdData}
            regSportID={teamId}
          />
        );
      case 1:
        return (
          <ContactDetails
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            staffAndAthleteIdData={staffAndAthleteIdData}
            regSportID={teamId}
            editStaffData={editStaffData}
          />
        );
      case 2:
        return (
          <EmploymentInformation
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            editStaffData={editStaffData}
            filepayload={filepayload}
            showField={showField}
            staffAndAthleteIdData={staffAndAthleteIdData}
            regSportID={teamId}
          />
        );
      case 3:
        return (
          <EducationandExperience
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            editStaffData={editStaffData}
            filepayload={filepayload}
            editPayload={editPayload}
            staffAndAthleteIdData={staffAndAthleteIdData}
            regSportID={teamId}
          />
        );
      case 4:
        return (
          <CertificationsAndLicenses
            activeStep={activeStep}
            setActiveStep={setActiveStep}
            setAllData={setAllData}
            allData={allData}
            editStaffData={editStaffData}
            filepayload={filepayload}
            teamId={teamId}
            setLoading={setLoading}
            setRouteHandel={setRouteHandel}
            setDisableRouting={setDisableRouting}
            editPayload={editPayload}
            staffAndAthleteIdData={staffAndAthleteIdData}
            regSportID={teamId}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  const breadcrumbRoutes: BreadcrumbRoutes[] = [
    {
      title: "Sports",
      route: "/teams/staffs",
      currentPage: false,
      disabled: true,
    },
    {
      title: "Staff",
      route: `/teams/${getCurrentSport}/staffs`,
      currentPage: false,
      disabled: true,
    },
    {
      title: "Add Staff",
      route: "/teams/staffs/addStaff",
      currentPage: true,
      disabled: true,
    },
  ];

  const back = () => {
    setDialog(true);
  };

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
      {!registration && (
        <Grid item xs={12} md={12}>
          <Box
            p={1.5}
            className="bg-white"
            borderRadius={1}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <BasicBreadcrumbs
              routes={breadcrumbRoutes}
              setOpen={setDialogOpen}
            />
          </Box>
        </Grid>
      )}
      <Grid item xs={12} md={12}>
        <Box className="bg-white" borderRadius={1}>
          <Box p={2}>
            <Box>
              <Typography
                sx={{
                  fontSize: "16px",
                  lineHeight: "19.2px",
                  textAlign: "left",
                }}
                className="bukra"
              >
                Add Staff
              </Typography>
            </Box>
          </Box>
          <Divider />
          <Stack
            sx={{
              width: "100%",
              height: getPageContentHeight(),
              overflow: "scroll",
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
                    <Typography className="stepper-number dubai-regular">
                      Step {key + 1}
                    </Typography>
                    <Typography
                      className={`dubai-bold ${
                        activeStep === key
                          ? "stepper-label-active"
                          : key < activeStep
                          ? "stepper-label-active"
                          : "stepper-label dubai-bold"
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

StaffStepperForm.getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;
export default StaffStepperForm;
