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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonalInfoForm from "./Forms/PersonalInfoForm";
import ContactInfoForm from "./Forms/ContactInfoForm";
import EmploymentInfoForm from "./Forms/EmploymentInfoForm";
import CertificateLicense from "./Forms/certificateLicense";
import EducationalInfoForm from "./Forms/EducationalInfoForm";
import { editStaffDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { editStaff } from "@/redux/slices/staff/staffEditSlice";
import isEmpty from "lodash/isEmpty";
import { getAthleteID } from "@/redux/slices/athlete/getAthleteIDSlice";
import ProfessionalInfo from "./Forms/ProfessionalInfo";
import PhysicalAndMedicalInfoForm from "./Forms/PhysicalAndMedicalInfoForm";
import AdditionalDetailsInfo from "./Forms/AdditionalDetailsInfo";
import FieldSkeleton from "./Forms/FieldSkeleton";

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
  onClose: any;
  id: number;
  module?: string;
}

const SlideDialog: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  id,
  module,
}) => {
  const dispatch: editStaffDispatch = useDispatch();
  const router = useRouter();
  const { teamID } = router.query;

  const editStaffData = useSelector((state: RootState) => {
    return state &&
      state.staffEdit &&
      !isEmpty(state?.staffEdit?.data) &&
      !isEmpty(state?.staffEdit?.data[0])
      ? state.staffEdit.data[0]
      : null;
  });
  const getAthleteByIDLoading = useSelector((state: RootState) => {
    return (
      state && !isEmpty(state?.getAthleteByID) && state.getAthleteByID.loading
    );
  });
  const getAthleteByIDError = useSelector((state: RootState) => {
    return (
      state &&
      !isEmpty(state?.getAthleteByID) &&
      state.getAthleteByID.code === 500
    );
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

  const editAthleteData = useSelector((state: RootState) => {
    return state &&
      state.getAthleteByID &&
      !isEmpty(state?.getAthleteByID?.data) &&
      !isEmpty(state?.getAthleteByID?.data[0])
      ? state.getAthleteByID.data[0]
      : null;
  });
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>(
    "Contact Information"
  );
  const [moreTabContent, setMoreTabContent] = useState<React.ReactNode | null>(
    null
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    if (selectedMenuItem === "Contact Information") {
      setTabValue(1);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (
    content: string,
    tabIndex: number,
    Component: React.ReactNode
  ) => {
    setSelectedMenuItem(content);
    setTabValue(tabIndex);
    setMoreTabContent(Component);
    handleMenuClose();
  };

  const handleContactInformation = () => {
    setSelectedMenuItem("Contact Information");
    setTabValue(1);
    handleMenuClose();
  };

  useEffect(() => {
    if (id && open) {
      if (module === "staff") {
        const payload: any = {
          staffID: Number(id),
          sportID: Number(teamID),

        };
        dispatch(editStaff(payload));
      } else {
        const payload: any = {
          athleteID: Number(id),
          sportID: Number(teamID),
        };
        dispatch(getAthleteID(payload));
      }
    }
  }, [id, open]);

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
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
          {module === "staff" ? "Edit Staff" : "Edit Athlete"}
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
            label="Personal Information"
            selected={tabValue === 0}
            className="text-capitalize bukra stepper-label-view"
            disabled={(module === "staff" && (iseditStaffDataLoading || iseditStaffError)) || (module === "athlete" && (getAthleteByIDLoading || getAthleteByIDError))}
          />
          <StyledTab
            label={selectedMenuItem}
            selected={tabValue === 1}
            className="text-capitalize bukra stepper-label-view"
            disabled={(module === "staff" && (iseditStaffDataLoading || iseditStaffError)) || (module === "athlete" && (getAthleteByIDLoading || getAthleteByIDError))}
          />
          <StyledTab
            label={"More"}
            selected={tabValue === 1}
            onClick={handleMenuOpen}
            className="text-capitalize bukra stepper-label-view"
            disabled={(module === "staff" && (iseditStaffDataLoading || iseditStaffError)) || (module === "athlete" && (getAthleteByIDLoading || getAthleteByIDError))}
          />
        </Tabs>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          MenuListProps={{ "aria-labelledby": "basic-button" }}
        >
          {selectedMenuItem !== "Contact Information" ? (
            <MenuItem onClick={handleContactInformation} className="dubai-med">
              Contact Information
            </MenuItem>
          ) : null}
          {/* module ==='staff' ? "Employee Information"  : 'Professional Details' */}
          {module === "staff" && selectedMenuItem !== "Employee Information" ? (
            <MenuItem
              onClick={() =>
                handleMenuItemClick(
                  "Employee Information",
                  1,
                  <EmploymentInfoForm
                    id={id}
                    onClose={onClose}
                    editStaffData={editStaffData}
                  />
                )
              }
              className="dubai-med"
            >
              Employee Information
            </MenuItem>
          ) : (
            module === "athlete" &&
            selectedMenuItem !== "Professional Details" && (
              <MenuItem
                onClick={() =>
                  handleMenuItemClick(
                    "Professional Details",
                    1,
                    <ProfessionalInfo
                      id={id}
                      onClose={onClose}
                      editData={editAthleteData}
                      module="athlete"
                    />
                  )
                }
                className="dubai-med"
              >
                Professional Details
              </MenuItem>
            )
          )}
          {module === "staff" &&
            selectedMenuItem !== "Education & Experience" ? (
            <MenuItem
              onClick={() =>
                handleMenuItemClick(
                  "Education & Experience",
                  1,
                  <EducationalInfoForm
                    id={id}
                    onClose={onClose}
                    editStaffData={editStaffData}
                  />
                )
              }
              className="dubai-med"
            >
              Education & Experience
            </MenuItem>
          ) : (
            module === "athlete" && (
              <MenuItem
                onClick={() =>
                  handleMenuItemClick(
                    "Physical & Medical Attributes",
                    1,
                    <PhysicalAndMedicalInfoForm
                      id={id}
                      onClose={onClose}
                      editData={editAthleteData}
                    />
                  )
                }
                className="dubai-med"
              >
                Physical & Medical Attributes
              </MenuItem>
            )
          )}
          {module === "staff" &&
            selectedMenuItem !== "Certifications & Licenses" ? (
            <MenuItem
              onClick={() =>
                handleMenuItemClick(
                  "Certifications & Licenses",
                  1,
                  <CertificateLicense
                    id={id}
                    onClose={onClose}
                    editStaffData={editStaffData}
                  />
                )
              }
              className="dubai-med"
            >
              Certifications & Licenses
            </MenuItem>
          ) : (
            module === "athlete" &&
            selectedMenuItem !== "Additional Details" && (
              <MenuItem
                onClick={() =>
                  handleMenuItemClick(
                    "Additional Details",
                    1,
                    <AdditionalDetailsInfo
                      id={id}
                      onClose={onClose}
                      editData={editAthleteData}
                      module="athlete"
                    />
                  )
                }
                className="dubai-med"
              >
                Additional Details
              </MenuItem>
            )
          )}
        </Menu>
        <Box mt={2} px={4}>
          {/* Main Tab Content */}

          {module === "staff" && !iseditStaffDataLoading && iseditStaffError ?
            <Stack spacing={1} alignItems="flex-start">
              <Alert className="dubai-med" severity="error">
                {`Unable to load ${module} details to edit!`}
              </Alert>
            </Stack>
            : null}

          {module === "athlete" && !getAthleteByIDLoading && getAthleteByIDError ?
            <Stack spacing={1} alignItems="flex-start">
              <Alert className="dubai-med" severity="error">
                {`Unable to load ${module} details to edit!`}
              </Alert>
            </Stack>
            : null}

          {(module === "staff" && iseditStaffDataLoading) || (module === "athlete" && getAthleteByIDLoading) ? <FieldSkeleton isAvatar={true} /> : null}

          {
            !iseditStaffDataLoading && !getAthleteByIDLoading && ((module === "staff" && !iseditStaffError) || (module === "athlete" && !getAthleteByIDError)) ? (
              tabValue === 0 ? (
                // {!iseditStaffError && !getAthleteByIDError ?  !iseditStaffDataLoading && !iseditStaffError || !getAthleteByIDLoading && !getAthleteByIDError ? tabValue === 0 ? (
                <PersonalInfoForm
                  id={id}
                  onClose={onClose}
                  editData={
                    module === "staff" ? editStaffData : editAthleteData
                  }
                  module={module}
                />
              ) : selectedMenuItem === "Contact Information" &&
                tabValue === 1 ? (
                <ContactInfoForm
                  id={id}
                  onClose={onClose}
                  editData={
                    module === "staff" ? editStaffData : editAthleteData
                  }
                  module={module}
                />
              ) : moreTabContent ? (
                moreTabContent
              ) : (
                <EmploymentInfoForm
                  id={id}
                  onClose={onClose}
                  editStaffData={editStaffData}
                />
              )
            ) : null}

        </Box>
      </Box>
    </Drawer>
  );
};

export default SlideDialog;
