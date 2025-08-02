"use client";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import { useForm } from "react-hook-form";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import moment from "moment";
import CustomTimePicker from "@/components/Fields/CustomTimePicker";
import StaticFoodImage from "../../../../public/staticFoodImage.svg";
import FileUpload from "@/utils/dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
} from "@/utils/constants";
import AddMore from "./addMore";
import CustomCheckBox from "@/components/Fields/CustomCheckBox";

function AddTraining() {
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
    if (is2K) return "76vh";
    if (isLaptopL) return "70vh";
    if (isLaptop) return "70vh";
    if (isTab) return "66vh";
    return "70vh";
  };
  const organizingRequirementsOptions: any = [
    { label: "Sport Equipment", value: "sportEquipment" },
    { label: "Sportswear", value: "sportswear" },
    {
      label: "Health & Safety Requirements",
      value: "healthAndSafetyRequirements",
    },
    { label: "Other", value: "other" },
    { label: "None", value: "none" },
  ];
  const router = useRouter();
  const externalClubCertificateRef = useRef<HTMLInputElement>(null);
  const [imageData, setImageData] = useState<any>({
    ProfileImage: "",
  });
  const [eventInformationData, setEventInformationData] = useState<any>([]);
  const [image, setImage] = useState<any>("");
  const [checkboxValue, setCheckboxValue] = useState<any>("");
  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      activityName: "",
      activityClassification: "",
      dueTime: null,
      registrationEndDate: null,
      gender: "",
      proficiencyLevel: "",
      employeeType: "",
      eventInformation: [
        {
          eventLocation: "",
          venue: "",
          eventCoordinatorEmail: "",
          eventCoordinatorName: "",
          locationUrl: "",
        },
      ],
      organizingRequirements: "",
    },
  });
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const handleTournamentImage = () => {
    if (externalClubCertificateRef.current) {
      externalClubCertificateRef.current.click();
    }
  };

  const handleCheckbox = (role: any) => {
    setCheckboxValue(role);
  };

  const handleFileChange = (
    file: any,
    flag: any,
    modulename: any,
    moduleId: any
  ) => {
    if (file) {
      setImage((prevData: any) => ({
        ...prevData,
        [flag]: {
          file,
          modulename,
          moduleId,
          section: flag,
        },
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImageData((prevData: any) => ({
          ...prevData,
          ProfileImage:
            flag === DROPZONE_IMAGE_FLAG.PROFILES
              ? result
              : prevData.ProfileImage,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: any) => {
    console.log("============>", data);
  };

  useEffect(() => {
    if (startDate && endDate) {
      const diffInDays = endDate.diff(startDate, "days");
      setValue("activityDateDuration", diffInDays);
    } else {
      setValue("activityDateDuration", "");
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (startTime && endTime) {
      console.log(startTime, endTime);
      const diffInDays = endTime.diff(startTime, "minutes");
      setValue("activityTimeDuration", diffInDays);
    } else {
      setValue("activityTimeDuration", "");
    }
  }, [startTime, endTime]);

  return (
    <>
      <Box p={3} sx={{ height: getPageContentHeight, overflowY: "scroll" }}>
        <Box
          position={"relative"}
          sx={{
            width: "100%",
            border: "1px solid #E3E3E3",
            borderRadius: "8px",
            height: "250px",
          }}
        >
          {imageData?.ProfileImage ? (
            <img
              src={imageData?.ProfileImage}
              alt="Upload Camp"
              style={{
                width: "100%",
                objectFit: "cover",
                borderRadius: "8px",
                height: "250px",
              }}
            />
          ) : (
            <StaticFoodImage
              style={{
                width: "100%",
                border: "1px solid #E3E3E3",
                borderRadius: "8px",
                height: "250px",
                cursor: "pointer",
              }}
              className="static-image"
              onClick={handleTournamentImage}
            />
          )}
          <Button
            variant="contained"
            className="dubai-med text-capitalize"
            sx={{
              position: "absolute",
              right: 20,
              top: 20,
              borderRadius: "30px",
              border: "1px solid #FFFFFF",
              fontSize: "18px",
              whiteSpace: "nowrap",
            }}
            startIcon={<EditOutlinedIcon />}
            onClick={handleTournamentImage}
          >
            {imageData?.ProfileImage ? "Change" : "Add Image"}
            <FileUpload
              onFileChange={(
                file: any,
                flag: any,
                modulename: any,
                moduleId: any
              ) => handleFileChange(file, flag, modulename, moduleId)}
              formatType={FILE_FORMAT_TYPE}
              type={DROPZONE_IMAGE_NAME_TYPES.IMAGE}
              flag={DROPZONE_IMAGE_FLAG.PROFILES}
              modulename={"trainingCamp"}
              setData={setImageData}
              formData={imageData}
              fileInputRef={externalClubCertificateRef}
            />
          </Button>
        </Box>
        <Accordion
          sx={{ border: "1px solid #DFE2E2", borderRadius: "6px" }}
          defaultExpanded
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography
              component="span"
              className="dubai-med"
              sx={{ fontSize: "18px" }}
            >
              General Information
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ borderTop: "1px solid #DFE2E2" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid
                container
                item
                xs={12}
                md={12}
                spacing={2}
                justifyContent={"space-between"}
                sx={{ py: 2 }}
              >
                <Grid item xs={12} md={5.75}>
                  <CustomTextField
                    name="activityName"
                    label="Activity Name"
                    placeholder="Enter New Activity Name"
                    control={control}
                    required={true}
                    rules={{
                      maxLength: {
                        value: 100,
                        message: "Activity Name cannot exceed 100 characters",
                      },
                      required: "Activity Name is required",
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <DropDown
                    name="activityClassification"
                    control={control}
                    label="Activity classification (MOI)"
                    placeholder="Activity classification"
                    options={[{ label: "test", value: "test" }]}
                    multiple={false}
                    variant="outlined"
                    required={true}
                    rules={{
                      required: "Activity classification is required",
                    }}
                  />
                </Grid>
                <Grid container item xs={12} md={5.75} spacing={2}>
                  <Grid item xs={6}>
                    <TrainingCampCustomDatePicker
                      control={control}
                      name="registrationEndDate"
                      label="Registration End Date"
                      boxmb={0.8}
                      minDate={moment()}
                      maxDate={moment().add(10, "years")}
                      className="Text-field-customise"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <CustomTimePicker
                      control={control}
                      name="dueTime"
                      label="Due Time"
                      boxmb={0.7}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} my={2}>
                  <Typography className="typography textfield-label bukra">
                    Target Audience
                  </Typography>
                  <Box borderTop={"1px solid #DFE2E2"} mt={1.5} />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <CustomCheckBox
                    // checkboxValue={checkboxValue}
                    options={["Male", "Female", "All"]}
                    name="gender"
                    control={control}
                    label="Gender"
                    required={true}
                    // handleCheckbox={handleCheckbox}
                  />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <CustomCheckBox
                    // checkboxValue={checkboxValue}
                    options={["Professionals", "Amateurs/ beginners", "Open"]}
                    name="proficiencyLevel"
                    control={control}
                    label="Proficiency Level"
                    required={true}
                    // handleCheckbox={handleCheckbox}
                  />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <CustomCheckBox
                    // checkboxValue={checkboxValue}
                    options={["Military", "Civilians", "Academy Cadets", "All"]}
                    name="employeeType"
                    control={control}
                    label="Employee Type"
                    required={true}
                    // handleCheckbox={handleCheckbox}
                  />
                </Grid>
                <Grid item xs={12} md={5.75} />
                <Grid item xs={12} my={2}>
                  <Typography className="typography textfield-label bukra">
                    Event Information
                  </Typography>
                  <Box borderTop={"1px solid #DFE2E2"} mt={1.5} />
                </Grid>
                <AddMore
                  control={control}
                  setEventInformationData={setEventInformationData}
                  eventInformationData={eventInformationData}
                  watch={watch}
                />
                <Grid item xs={12} my={2}>
                  <Typography className="typography textfield-label bukra">
                    Requirements Details
                  </Typography>
                  <Box borderTop={"1px solid #DFE2E2"} mt={1.5} />
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <DropDown
                    name="organizingRequirements"
                    control={control}
                    label="Organizing Requirements"
                    placeholder="Select Organizing Requirements"
                    options={organizingRequirementsOptions}
                    multiple={false}
                    variant="outlined"
                    required={true}
                    rules={{
                      required: "Organizing Requirements is required",
                    }}
                  />
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "7rem",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    //   onClick={() => {
                    //     handleBack();
                    //   }}
                    className="text-capitalize dubai-med"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className="save-continue-button text-capitalize dubai-med"
                    //   disabled={staffAddcertificateData.loading}
                    sx={{ mx: 1 }}
                  >
                    Save As Draft
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className="save-continue-button text-capitalize dubai-med"
                    //   disabled={staffAddcertificateData.loading}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Submit For Approval
                  </Button>
                </Box>
              </Grid>
            </form>
          </AccordionDetails>
        </Accordion>
      </Box>
    </>
  );
}
export default AddTraining;
