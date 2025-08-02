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
import { editStaffDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  clearStaffEditState,
  editStaff,
} from "@/redux/slices/staff/staffEditSlice";
import isEmpty from "lodash/isEmpty";
import ContactDetails from "@/components/staff/contactDetails";
import EmploymentInformation from "@/components/staff/employmentInformation";
import EducationandExperience from "@/components/staff/educationandExperience";
import PersonalInformation from "@/components/staff/personalInformation";
import FieldSkeleton from "@/components/Forms/FieldSkeleton";
import CertificationsAndLicenses from "@/components/staff/certificationsAndLicenses";
import { usePathname } from "next/navigation";
import { removeLocalStorage, setLocalStorage } from "@/utils/helper";
import { StaffAndAthleteId } from "@/redux/slices/staffAndAthlete/StaffAndAthleteIdSlice";
import _ from "lodash";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";

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

const StaffSlideDialog: React.FC<any> = ({
  open,
  onClose,
  id,
  module,
  isView,
}) => {
  const dispatch: editStaffDispatch = useDispatch();
  const router = useRouter();
  const { teamID } = router.query;
  const staffAndAthleteIdData = useSelector(
    (state: RootState) => state.staffAndAthleteIdList?.data?.[0] ?? null
  );
  const [activeStep, setActiveStep] = useState(0);
  const [allData, setAllData] = useState<any>({});
  const lastStaffIDRef = useRef(null);
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const [disableRouting, setDisableRouting] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showField, setShowField] = useState(false);
  const [routeHandel, setRouteHandel] = useState(true);
  const [navigate, setNavigate] = useState<any>();
  const editStaffData = useSelector((state: RootState) => {
    return state &&
      state.staffEdit &&
      !isEmpty(state?.staffEdit?.data) &&
      !isEmpty(state?.staffEdit?.data[0])
      ? state.staffEdit.data[0]
      : null;
  });
  const iseditStaffDataLoading = useSelector((state: RootState) => {
    return (
      state &&
      state.staffEdit &&
      !isEmpty(state?.staffEdit) &&
      state.staffEdit.loading
    );
  });
  const iseditStaffError = useSelector((state: RootState) => {
    return state && state.staffEdit && state.staffEdit.code === 500;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveStep(newValue);
  };

  useEffect(() => {
    if (id && open) {
      if (module === "staff") {
        const payload: any = {
          staffID: Number(id),
          sportID: Number(teamID),
        };
        dispatch(editStaff(payload));
      }
    }
  }, [id, open, module, teamID]);

  const isLoading = module === "staff" ? iseditStaffDataLoading : false;
  const hasError = module === "staff" ? iseditStaffError : false;
  const editPayload: any = {
    staffID: id,
    sportID: teamId,
  };

  useEffect(() => {
    const empNum = editStaffData?.dpEmployeeNumber;
    if (typeof empNum === "string" && empNum.trim() !== "") {
      setShowField(true);
    } else {
      setShowField(false);
    }
  }, [editStaffData]);

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
      const payload = {
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),
      };
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
      if (isView) {
        const payload: any = {
          staffID: Number(id),
          sportID: Number(teamID),
        };
        dispatch(editStaff(payload));
      } else {
        dispatch(clearStaffEditState());
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
    staffID: allData?.staffID || "",
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
          label="Employment Information"
          selected={activeStep === 2}
          className="text-capitalize bukra stepper-label-view"
          disabled={isLoading || hasError}
        />
        <StyledTab
          label="Education & Experience"
          selected={activeStep === 3}
          className="text-capitalize bukra stepper-label-view"
          disabled={isLoading || hasError}
        />
        <StyledTab
          label="Certifications & Licenses"
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
                staffEditId={id}
                onClose={onClose}
                editStaffData={editStaffData}
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
                staffEditId={id}
                onClose={onClose}
                editStaffData={editStaffData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setAllData={setAllData}
                allData={allData}
                staffAndAthleteIdData={staffAndAthleteIdData}
                editPayload={editPayload}
              />
            )}
            {activeStep === 2 && (
              <EmploymentInformation
                staffEditId={id}
                onClose={onClose}
                editStaffData={editStaffData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setAllData={setAllData}
                allData={allData}
                filepayload={filepayload}
                showField={showField}
                staffAndAthleteIdData={staffAndAthleteIdData}
              />
            )}
            {activeStep === 3 && (
              <EducationandExperience
                staffEditId={id}
                onClose={onClose}
                editStaffData={editStaffData}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                setAllData={setAllData}
                allData={allData}
                filepayload={filepayload}
                editPayload={editPayload}
                staffAndAthleteIdData={staffAndAthleteIdData}
              />
            )}
            {activeStep === 4 && (
              <CertificationsAndLicenses
                staffEditId={id}
                onClose={onClose}
                editStaffData={editStaffData}
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
          // )}
        }
      </Box>
    </Drawer>
  );
};

export default StaffSlideDialog;
