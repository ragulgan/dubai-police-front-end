import React, { useEffect, useRef, useState } from "react";
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
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import isEmpty from "lodash/isEmpty";
import FieldSkeleton from "@/components/Forms/FieldSkeleton";
import CertificationsAndLicenses from "@/components/staff/certificationsAndLicenses";
import { usePathname } from "next/navigation";
import { removeLocalStorage, setLocalStorage } from "@/utils/helper";
import _ from "lodash";
import {
  clearEditAtheleteState,
  editAthlete,
} from "@/redux/slices/athlete/athleteEditSlice";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import PersonalInformation from "@/components/athlete/personalInformation";
import ContactDetails from "@/components/athlete/contactDetails";
import EmploymentInformation from "@/components/athlete/employmentInformation";
import ProfessionalDetails from "@/components/athlete/professionalDetails";
import PhysicalAndMedical from "@/components/athlete/physicalAndMedical";

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

interface SlideDialogProps {
  open: boolean;
  onClose: () => void;
  id: number;
  module?: string;
}

const AthleteSlideDialog: React.FC<any> = ({
  open,
  onClose,
  id,
  module,
  isView,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { teamID } = router.query;
  const staffAndAthleteIdData = useSelector(
    (state: RootState) => state.staffAndAthleteIdList?.data?.[0] ?? null
  );
  const [activeStep, setActiveStep] = useState(0);
  const [allData, setAllData] = useState<any>({});
  const lastathleteIDRef = useRef(null);
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const [disableRouting, setDisableRouting] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showField, setShowField] = useState(false);
  const [routeHandel, setRouteHandel] = useState(true);
  const [navigate, setNavigate] = useState<any>();
  const editAthleteData = useSelector((state: RootState) => {
    return state &&
      state.athleteEdit &&
      !isEmpty(state?.athleteEdit?.data) &&
      !isEmpty(state?.athleteEdit?.data[0])
      ? state.athleteEdit.data[0]
      : null;
  });
  const iseditAthleteDataLoading = useSelector((state: RootState) => {
    return (
      state &&
      state.athleteEdit &&
      !isEmpty(state?.athleteEdit) &&
      state.athleteEdit.loading
    );
  });
  const iseditAthleteError = useSelector((state: RootState) => {
    return state && state.athleteEdit && state.athleteEdit.code === 500;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveStep(newValue);
  };

  useEffect(() => {
    if (id && open) {
      const payload: any = {
        athleteID: Number(id),
        sportID: Number(teamID),
      };
      dispatch(editAthlete(payload));
    }
  }, [id, open, module, teamID]);

  const isLoading = module === "athelete" ? iseditAthleteDataLoading : false;
  const hasError = module === "athelete" ? iseditAthleteError : false;
  const editPayload: any = {
    athleteID: id,
    sportID: teamId,
  };

  useEffect(() => {
    const empNum = editAthleteData?.dpEmployeeNumber;
    if (typeof empNum === "string" && empNum.trim() !== "") {
      setShowField(true);
    } else {
      setShowField(false);
    }
  }, [editAthleteData]);

  useEffect(() => {
    setLocalStorage("addAthleteData", JSON.stringify(allData));
    if (allData.athleteID && allData.athleteID !== lastathleteIDRef.current) {
      const payload: any = {
        athleteID: allData.athleteID,
        sportID: teamId,
      };
      lastathleteIDRef.current = allData.athleteID;
    }
  }, [allData]);

  useEffect(() => {
    if (editAthleteData && !_.isEmpty(editAthleteData?.attachmentList)) {
      const profileImageAttachment = _.find(
        editAthleteData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "profileimage"
      );
      const passportAttachment = _.find(
        editAthleteData.attachmentList,
        (attachment) => attachment.documentSection.toLowerCase() === "passport"
      );
      const iDDocumentAttachment = _.find(
        editAthleteData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "iddocument"
      );
      const certificateAttachment = _.find(
        editAthleteData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "certificate"
      );
      const profileFullImageAttachment = _.find(
        editAthleteData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "profilefullimage"
      );
      const contractDocumentAttachment = _.find(
        editAthleteData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "contractdocument"
      );
      const licenseAttachment = _.find(
        editAthleteData.attachmentList,
        (attachment) => attachment.documentSection.toLowerCase() === "license"
      );
      const externalClubsContractAttachment = _.find(
        editAthleteData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "externalclubscontract"
      );
      const IndividaulPlansAttachment = _.find(
        editAthleteData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "individualplans"
      );
      const acknowledgementDoc = _.find(
        editAthleteData.attachmentList,
        (attachment) =>
          attachment.documentSection.toLowerCase() === "acknowledgement"
      );
      const pledgeDoc = _.find(
        editAthleteData.attachmentList,
        (attachment) => attachment.documentSection.toLowerCase() === "pledge"
      );
      const certificateOfGoodConductDoc = _.find(
        editAthleteData.attachmentList,
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
        ProfileFullImage: profileFullImageAttachment?.filePath || "",
        contractDocument: contractDocumentAttachment?.fileName || "",
        license: licenseAttachment?.fileName || "",
        externalClubsContract: externalClubsContractAttachment?.fileName || "",
        IndividaulPlans: IndividaulPlansAttachment?.fileName || "",
        acknowledgementDoc: acknowledgementDoc?.fileName || "",
        pledgeDoc: pledgeDoc?.fileName || "",
        certificateOfGoodConductDoc:
          certificateOfGoodConductDoc?.fileName || "",
      }));
    }
  }, [editAthleteData]);

  useEffect(() => {
    return () => {
      removeLocalStorage("addAthleteData");
      const payload = {
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),
      };
      dispatch(getAthleteListAPI(payload));
      if (isView) {
        const payload: any = {
          athleteID: Number(id),
          sportID: Number(teamID),
        };
        dispatch(editAthlete(payload));
      } else {
        dispatch(clearEditAtheleteState());
      }
    };
  }, []);

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
    athleteID: allData?.athleteID || "",
    sportID: teamId,
  };

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
          {module === "staff" ? "Edit Staff" : "Edit Athlete"}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ mr: 2 }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Tabs
        value={activeStep}
        onChange={handleTabChange}
        sx={{
          backgroundColor: "white",
          borderTop: `1px solid #58585B66`,
          borderBottom: `1px solid #58585B66`,
          "& .MuiTabs-indicator": { backgroundColor: "transparent" },
        }}
      >
        <StyledTab
          label="Personal Information"
          selected={activeStep === 0}
          className="text-capitalize bukra stepper-label-view"
          disabled={isLoading || hasError}
        />
        <StyledTab
          label="Contact Details"
          selected={activeStep === 1}
          className="text-capitalize bukra stepper-label-view"
          disabled={isLoading || hasError}
        />
        <StyledTab
          label="Employment Details"
          selected={activeStep === 2}
          className="text-capitalize bukra stepper-label-view"
          disabled={isLoading || hasError}
        />
        <StyledTab
          label="Professional Details"
          selected={activeStep === 3}
          className="text-capitalize bukra stepper-label-view"
          disabled={isLoading || hasError}
        />
        <StyledTab
          label="Physical & Medical Atrributes"
          selected={activeStep === 4}
          className="text-capitalize bukra stepper-label-view"
          disabled={isLoading || hasError}
        />
      </Tabs>
      {/* {
        isLoading ? (
          <FieldSkeleton />
        ) : null
      } */}

      <Box sx={{ p: 2 }}>
        {
          <>
            {activeStep === 0 && (
              <PersonalInformation
                athleteEditId={id}
                onClose={onClose}
                editAthleteData={editAthleteData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setAllData={setAllData}
                allData={allData}
                filepayload={filepayload}
                teamId={teamId}
                setDialogOpen={setDialogOpen}
                staffAndAthleteIdData={staffAndAthleteIdData}
                editPayload={editPayload}
              />
            )}
            {activeStep === 1 && (
              <ContactDetails
                athleteEditId={id}
                onClose={onClose}
                editAthleteData={editAthleteData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setAllData={setAllData}
                allData={allData}
                staffAndAthleteIdData={staffAndAthleteIdData}
                editPayload={editPayload}
                teamId={teamId}
              />
            )}
            {activeStep === 2 && (
              <EmploymentInformation
                athleteEditId={id}
                onClose={onClose}
                editAthleteData={editAthleteData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setAllData={setAllData}
                allData={allData}
                filepayload={filepayload}
                showField={showField}
                staffAndAthleteIdData={staffAndAthleteIdData}
                editPayload={editPayload}
                teamId={teamId}
              />
            )}
            {activeStep === 3 && (
              <ProfessionalDetails
                athleteEditId={id}
                onClose={onClose}
                editAthleteData={editAthleteData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setAllData={setAllData}
                allData={allData}
                filepayload={filepayload}
                editPayload={editPayload}
                staffAndAthleteIdData={staffAndAthleteIdData}
                teamId={teamId}
              />
            )}
            {activeStep === 4 && (
              <PhysicalAndMedical
                athleteEditId={id}
                onClose={onClose}
                editAthleteData={editAthleteData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setAllData={setAllData}
                allData={allData}
                filepayload={filepayload}
                teamId={teamId}
                setLoading={setLoading}
                setRouteHandel={setRouteHandel}
                setDisableRouting={setDisableRouting}
                editPayload={editPayload}
                staffAndAthleteIdData={staffAndAthleteIdData}
              />
            )}
          </>
        }
      </Box>
    </Drawer>
  );
};

export default AthleteSlideDialog;
