"use client";
import { useEffect, useRef, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Fade,
  CircularProgress,
  SnackbarCloseReason,
  Divider,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { getLocalStorage } from "@/utils/helper";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment, { Moment } from "moment";
import { useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { useRouter } from "next/router";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";
import { usePathname } from "next/navigation";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import AddMore from "@/components/trainingCamp/add/addMore/strategyAddMore";
import {
  addTrainingCamp,
  clearAddState,
} from "@/redux/slices/trainingCamp/trainingCampAddSlice";
import { addTrainingCampCompetition } from "@/redux/slices/trainingCamp/trainingCampCompetition";
import dayjs from "dayjs";
import CustomSnackbar from "@/components/CustomSnackbar";
import FileUpload from "@/utils/dropzone";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
} from "@/utils/constants";
import {
  trainingCampFileUpload,
  clearState,
} from "@/redux/slices/fileupload/trainingCampFileUpload";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import {
  updateTrainingCamp,
  clearUpdateState,
} from "@/redux/slices/trainingCamp/trainingCampUpdateSlice";
import StaticFoodImage from "../../../../public/staticFoodImage.svg";
import UploadFileSvg from "../../../../public/UploadIcon.svg";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";
import CustomTagInput from "@/components/trainingCamp/customTagInput";
import { singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";
import CustomPhoneInput from "@/components/Fields/CustomPhoneInput";
import { FileUploader } from "react-drag-drop-files";
import Uploadtravel from "../../../../public/travelUpload.svg";
import { addReport, clearReportAddDataState, clearReportAddState } from "@/redux/slices/reports/reportAddSlice";
import { clearAllReportUpdateState, clearReportUpdateState, updateReport } from "@/redux/slices/reports/reportUpdateSlice";
import { uploadFileReport } from "@/redux/slices/reports/reportFileUploadSlice";

const StrategyCompetitionInfo = (props: any) => {
  const {
    setActiveStep,
    setAllData,
    setDialogOpen,
    showCancelButton,
    edit,
    onClose,
    trainingCampEditData,
    id,
    setIsUpdated,
    setResetForm,
    resetForm,
    reportID,
    data,
  } = props;
  console.log({ data }, 'datadatadata');

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [minEndDate, setMinEndDate] = useState<Moment | null>(moment());
  const isMinEndDateValid = minEndDate?.isValid() ?? false;
  const [staffDataOption, setStaffDataOption] = useState<any>("");
  const [NationalityOption, setNationalityOption] = useState<any>("");
  const [athleteDataOption, setAthleteDataOption] = useState<any>("");
  const [competitionData, setCompetitionData] = useState<any>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [formData, setFormData] = useState<any>({

  });

  // const [trainingCampID, setTrainingCampID] = useState<any>(id ? id : null);
  const externalClubCertificateRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<any>("");
  const [imageData, setImageData] = useState<any>({
    ProfileImage: "",
  });
  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        venue: '',
        raceName: '',
        classification: '',
        importanceLevel: '',
        organizerName: '',
        organizerEmail: '',
        organizerPhone: '',
        sportDiscipline: '',
        objectives: '',
        websiteLink: '',
        liveLink: '',
        resultLink: '',
        startDate: null,
        endDate: null,
        country: null,
        city: null,
      },
    });
  const campStartDate = watch("startDate");
  const campEndDate = watch("endDate");
  const athletes = watch("athletes");
  const staffs = watch("staffs");
  const others = watch("others");
  const savedData: any = getLocalStorage("addTrainingCampData");
  const parsedData = JSON.parse(savedData);
  const currentNav = usePathname();
  const teamID = currentNav?.split("/")[2];
  const getNationality = useSelector(
    (state: any) => state.listNationality && state.listNationality?.data
  );
  const reportAddResponse = useSelector((state: RootState) => state.addReport);
  const reportUpdateResponse = useSelector((state: RootState) => state.updateReport);
  const raceID = useSelector((state: RootState) => !state?.addReport?.error ? state?.addReport?.data?.reportId : null);
  console.log({ reportAddResponse, raceID, reportUpdateResponse });
  const raceStartDate = !isEmpty(reportAddResponse?.data) ? moment(reportAddResponse.data?.race?.startDate) : !isEmpty(reportUpdateResponse?.data) ? moment(reportUpdateResponse?.data?.race.startDate) : null;
  const raceEndDate = !isEmpty(reportAddResponse?.data) ? moment(reportAddResponse.data?.race?.endDate) : !isEmpty(reportUpdateResponse?.data) ? moment(reportUpdateResponse?.data?.race.endDate) : null;

  const trainindAddData = useSelector(
    (state: RootState) => state.addTrainingCamp
  );
  const trainingCampUpload = useSelector((state: any) => state.singleUpload);
  const trainingUpdateData = useSelector(
    (state: RootState) => state.updateTrainingCamp
  );

  const getDefaultOption = (NationalityList: any) => {
    const defaultOptions = [];
    for (const item in NationalityList) {
      defaultOptions.push({
        label: NationalityList[item].countryName,
        value: NationalityList[item].countryName,
        // value: NationalityList[item].countryId,
      });
    }
    return defaultOptions;
  };

  const handleCampImage = () => {
    if (externalClubCertificateRef.current) {
      externalClubCertificateRef.current.click();
    }
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

  const onSubmit = (formData: any) => {
    console.log({ data }, 'dataaaaaaaa 1st step data');
    const payload = {
      ...formData,
      startDate: dayjs(formData?.startDate).format("YYYY-MM-DD"),
      // startDate: moment(formData.startDate).format(''),
      endDate: dayjs(formData?.endDate).format("YYYY-MM-DD"),
    }

    if (data?.finalReport?.reportId) {
      const getRaceID = data?.finalReport?.reportId
      dispatch(updateReport({ url: `/Reports/${teamID}/Race/${reportID}/${getRaceID}`, payload: payload }));
      dispatch(clearReportAddDataState());
    }
    else {
      dispatch(addReport({ url: `/Reports/${teamID}/Race/${reportID}`, payload: payload }));
    }
    // setActiveStep(1)

    // const payload: any = {
    //   sportID: Number(teamID),
    //
    //   campName: data?.campName,
    //   campStartDate: dayjs(data?.campStartDate).format("DD/MM/YYYY"),
    //   campEndDate: dayjs(data?.campEndDate).format("DD/MM/YYYY"),
    //   Country: String(data?.Country),
    //   City: data?.City,
    //   athletesCount: Number(data?.athletesCount),
    //   athletes: data?.athletes?.join(","),
    //   staffsCount: Number(data?.staffsCount),
    //   staffs: data?.staffs?.join(","),
    //   othersCount: Number(data?.othersCount),
    //   others: data?.others.join(","),
    //   mainLongTermGoals: data?.mainLongTermGoals,
    //   mainShortTermGoals: data?.mainShortTermGoals,
    //   mainStrategy: data?.mainStrategy,
    //   reasonsForRequestingCamp: data?.reasonsForRequestingCamp,
    //   otherActivities: data?.otherActivities,
    // };
    // if (trainingCampID) {
    //   const data = {
    //     ...payload,
    //     section: "campDetails",
    //     trainingCampID: trainingCampID && trainingCampID,
    //   };
    //   dispatch(
    //     updateTrainingCamp({
    //       url: "/UpdateTrainingCampByID",
    //       payload: data,
    //     })
    //   );
    // } else {
    //   dispatch(
    //     addTrainingCamp({ url: "/InsertTrainingCamp", payload: payload })
    //   );
    // }
  };

  useEffect(() => {
    if (campStartDate) {
      const minimumEndDate = moment(campStartDate).add(1, "day");
      setMinEndDate(minimumEndDate);
    } else {
      setMinEndDate(null);
    }
  }, [campStartDate]);

  useEffect(() => {
    if (!isEmpty(reportAddResponse?.data?.race)
    ) {
      console.log({ reportAddResponse }, '/innnnnnnnnn');

      setValue("raceName", reportAddResponse.data && reportAddResponse.data?.race?.raceName);
      setValue("startDate", reportAddResponse.data && reportAddResponse.data?.race?.startDate);
      setValue("endDate", reportAddResponse.data && moment(reportAddResponse.data.race.endDate));
      setValue("country", reportAddResponse.data && reportAddResponse.data?.race?.country);
      setValue("city", reportAddResponse.data && reportAddResponse.data?.race?.city);
      setValue("venue", reportAddResponse.data && reportAddResponse.data?.race?.venue);
      setValue("classification", reportAddResponse.data && reportAddResponse.data?.race?.classification);
      setValue("importanceLevel", reportAddResponse.data && reportAddResponse.data?.race?.importanceLevel);
      setValue("organizerName", reportAddResponse.data && reportAddResponse.data?.race?.organizerName);
      setValue("organizerEmail", reportAddResponse.data && reportAddResponse.data?.race?.organizerEmail);
      setValue("organizerPhone", reportAddResponse.data && reportAddResponse.data?.race?.organizerPhone);
      setValue("sportDiscipline", reportAddResponse.data && reportAddResponse.data?.race?.sportDiscipline);
      setValue("objectives", reportAddResponse.data && reportAddResponse.data?.race?.objective);
      setValue("website", reportAddResponse.data && reportAddResponse.data?.race?.website);
      setValue("liveLink", reportAddResponse.data && reportAddResponse.data?.race?.liveLink);
      setValue("resultLink", reportAddResponse.data && reportAddResponse.data?.race?.resultLink);
    }
    else if (!isEmpty(reportUpdateResponse?.data?.race)) {
      setValue("raceName", reportUpdateResponse.data && reportUpdateResponse.data?.race?.raceName);
      setValue("startDate", reportUpdateResponse.data && reportUpdateResponse.data?.race?.startDate);
      setValue("endDate", reportUpdateResponse.data && moment(reportUpdateResponse.data.race.endDate));
      setValue("country", reportUpdateResponse.data && reportUpdateResponse.data?.race?.country);
      setValue("city", reportUpdateResponse.data && reportUpdateResponse.data?.race?.city);
      setValue("venue", reportUpdateResponse.data && reportUpdateResponse.data?.race?.venue);
      setValue("classification", reportUpdateResponse.data && reportUpdateResponse.data?.race?.classification);
      setValue("importanceLevel", reportUpdateResponse.data && reportUpdateResponse.data?.race?.importanceLevel);
      setValue("organizerName", reportUpdateResponse.data && reportUpdateResponse.data?.race?.organizerName);
      setValue("organizerEmail", reportUpdateResponse.data && reportUpdateResponse.data?.race?.organizerEmail);
      setValue("organizerPhone", reportUpdateResponse.data && reportUpdateResponse.data?.race?.organizerPhone);
      setValue("sportDiscipline", reportUpdateResponse.data && reportUpdateResponse.data?.race?.sportDiscipline);
      setValue("objectives", reportUpdateResponse.data && reportUpdateResponse.data?.race?.objectives);
      setValue("website", reportUpdateResponse.data && reportUpdateResponse.data?.race?.website);
      setValue("liveLink", reportUpdateResponse.data && reportUpdateResponse.data?.race?.liveLink);
      setValue("resultLink", reportUpdateResponse.data && reportUpdateResponse.data?.race?.resultLink);
    }
    else if (!isEmpty(data?.planning?.race)) {
      setValue("raceName", data?.planning && data?.planning?.race?.raceName);
      setValue("startDate", data?.planning && moment(data?.planning?.race?.startDate));
      setValue("endDate", data?.planning && moment(data?.planning.race.endDate));
      setValue("country", data?.planning && data?.planning?.race?.country);
      setValue("city", data?.planning && data?.planning?.race?.city);
      setValue("venue", data?.planning && data?.planning?.race?.venue);
      setValue("classification", data?.planning && data?.planning?.race?.classification);
      setValue("importanceLevel", data?.planning && data?.planning?.race?.importanceLevel);
      setValue("organizerName", data?.planning && data?.planning?.race?.organizerName);
      setValue("organizerEmail", data?.planning && data?.planning?.race?.organizerEmail);
      setValue("organizerPhone", data?.planning && data?.planning?.race?.organizerPhone);
      setValue("sportDiscipline", data?.planning && data?.planning?.race?.sportDiscipline);
      setValue("objectives", data?.planning && data?.planning?.race?.objectives);
      setValue("website", data?.planning && data?.planning?.race?.website);
      setValue("liveLink", data?.planning && data?.planning?.race?.liveLink);
      setValue("resultLink", data?.planning && data?.planning?.race?.resultLink);
    }

  }, [reportAddResponse, reportUpdateResponse, data])

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (resetForm) {
      reset({
        venue: '',
        raceName: 'Add test dev',
        classification: '',
        importanceLevel: '',
        organizerName: '',
        organizerEmail: '',
        organizerPhone: '',
        sportDiscipline: '',
        objectives: '',
        websiteLink: '',
        liveLink: '',
        resultLink: '',
        startDate: null,
        endDate: null,
        country: "",
        city: "",

      });
      setImageData({});
      setTimeout(() => {
        setResetForm(false);
      }, 1000);
    }
  }, [resetForm]);
  console.log({ formData });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
        if (snackbarStatus !== 'error') {
          setActiveStep(1)
        }
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  useEffect(() => {
    if (
      (reportAddResponse &&
        reportAddResponse.code === 200 &&
        reportAddResponse.status === "succeeded") ||
      (reportUpdateResponse &&
        reportUpdateResponse.code === 200 &&
        reportUpdateResponse.status === "succeeded")
    ) {
      const getRaceID = !isEmpty(reportAddResponse.data) ? reportAddResponse.data.reportId : !isEmpty(reportUpdateResponse.data) ? reportUpdateResponse.data.reportId : null;
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      // setActiveStep(1)
      dispatch(clearReportAddState());
      dispatch(clearReportUpdateState());
      console.log({ formData, getRaceID });
      if (getRaceID && !isEmpty(formData)) {
        console.log('in file uploadd-------');

        const data = new FormData();
        data.append("BannerImage", formData.file);
        dispatch(uploadFileReport({ url: `/Reports/${teamID}/Race/${reportID}/${getRaceID}/Banner`, payload: data }));
      }

    } else if (
      (reportAddResponse &&
        reportAddResponse.code === 500 &&
        reportAddResponse.status === "failed") ||
      (reportAddResponse &&
        reportAddResponse.status === "failed")
      ||
      (reportUpdateResponse &&
        reportUpdateResponse.code === 500 &&
        reportUpdateResponse.status === "failed") ||
      (reportUpdateResponse &&
        reportUpdateResponse.status === "failed")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearReportAddState());
      dispatch(clearReportUpdateState());
    }
  }, [reportAddResponse, reportUpdateResponse]);

  // useEffect(() => {
  //   if (teamID) {
  //     const payload = {
  //       searchText: "",
  //       filteredBy: "",
  //       paginationIndex: 0,
  //       paginationCount: 0,
  //       sportID: Number(teamID),
  //     };
  //     dispatch(viewStaff({ url: "/GetStaffsList", payload }));
  //     dispatch(getAthleteListAPI(payload));
  //   }
  // }, [teamID]);

  useEffect(() => {
    const nationality: any = getDefaultOption(getNationality);
    setNationalityOption(nationality);
  }, [getNationality]);

  const closeAdd = () => {
    setDialogOpen(false);
    dispatch(clearReportAddDataState())
    dispatch(clearAllReportUpdateState())
    router.push(`/teams/${teamID}/reports`);
  };

  const handleChange = (file: any) => {
    if (file) {
      // setValue("uploadDocuments", "");
      const fileName = file.name.toLowerCase();
      const uploadedFileSize = file.size;
      const fileSizeLimit = 25 * 1024 * 1024;
      console.log({ file, fileName });

      if (fileName.endsWith(".jfif")) {
        setSnackbarOpen(true);
        setSnackbarStatus("error");
      } else {
        if (uploadedFileSize < fileSizeLimit) {
          setFormData({ ...formData, file: file });
          // const data = new FormData();
          // data.append("file", formData.file);
          // data.append("modulename", "Research");
          // data.append("moduleid", String(researchID));
          // data.append("section", "ResearchImage");
          // data.append("loggedUserID", "1");
        } else {
          setSnackbarOpen(true);
          setSnackbarStatus(
            `File size must below ${fileSizeLimit / 1048576
            } MB!. You file size is : ${Math.round(uploadedFileSize / 1024)}KB`
          );
        }
      }
    }
  };
  const handleFileUpload = () => {
    document.getElementById("file")?.click();
  };
  const uploadDocuments = watch("uploadDocuments");
  console.log({ uploadDocuments }, 'uploadDocumentsuploadDocuments');

  return (
    <>
      {trainingCampEditData && trainingCampEditData?.loading ? (
        <EditFieldSkeleton isAvatar={true} />
      ) : (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={0}>
            {snackbarStatus !== "" && (
              <CustomSnackbar
                message={
                  snackbarStatus === "success"
                    ? `Race Report ${!isEmpty(reportAddResponse.data) ? "Update" : "Added"
                    } successfully!`
                    : "Something went wrong"
                }
                severity={snackbarStatus === "success" ? "success" : "error"}
                open={snackbarOpen}
                onClose={handleSnackBarClose}
              />
            )}
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              display="flex"
              justifyContent="center"
              alignItems={{ xs: "top", md: "center" }}
              sx={{
                paddingX: "2rem",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box width="100%">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2} justifyContent={"space-between"}>
                    <Grid item xs={12} md={12}>
                      <Typography
                        gutterBottom
                        className="typography textfield-label bukra"
                      >
                        Competition Image
                      </Typography>
                      <Box
                        position={"relative"}
                        sx={{
                          width: "100%",
                          border: "1px dashed #B1DACB",
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
                              border: "1px dashed #B1DACB",
                              borderRadius: "8px",
                              height: "250px",
                              cursor: "pointer",
                            }}
                            className="static-image"
                            onClick={handleCampImage}
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
                          onClick={handleCampImage}
                        >
                          {imageData?.ProfileImage ? "Change" : "Add Image"}
                          <FileUpload
                            onFileChange={(
                              file: any,
                              flag: any,
                              modulename: any,
                              moduleId: any
                            ) =>
                              handleFileChange(file, flag, modulename, moduleId)
                            }
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
                    </Grid>
                    <Grid item xs={12} md={12} marginTop={2}>
                      <Typography
                        variant="titleStyle"
                        sx={{ fontSize: "14px" }}
                        className="typography textfield-label bukra"
                      // mt={0.5}
                      // mb={0.5}
                      >
                        Competitions Details
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={12} marginBottom={2}>
                      <Divider />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="raceName"
                        label="Competition Name"
                        placeholder="Enter New Competition Name"
                        control={control}
                        // required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z0-9() /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message:
                              "Competition Name cannot exceed 100 characters",
                          },
                          // required: "Competition Name is required",
                        }}
                        disabled={true}
                      />
                    </Grid>
                    <Grid container item xs={12} md={5.75} spacing={2}>
                      <Grid item xs={6}>
                        <TrainingCampCustomDatePicker
                          control={control}
                          name="startDate"
                          label="Start Date"
                          boxmb={0.8}
                          required={true}
                          defaultValue={raceStartDate}
                          minDate={moment()}
                          maxDate={
                            campEndDate
                              ? moment(campEndDate).add(1, "day")
                              : moment().add(10, "years")
                          }
                          // maxDate={
                          //   campEndDate
                          //     ? moment(campEndDate).add(1, "day")
                          //     : moment().add(10, "years")
                          // }
                          className="Text-field-customise"
                          rules={{
                            required: "Start Date is required",
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TrainingCampCustomDatePicker
                          control={control}
                          name="endDate"
                          label="End Date"
                          boxmb={0.8}
                          required={true}
                          minDate={minEndDate}
                          // disabled={!minEndDate.isValid()}
                          defaultValue={raceEndDate}
                          // minDate={moment()}
                          // maxDate={moment().add(10, "years")}
                          // maxDate={moment().add(10, "years")}
                          className="Text-field-customise"
                          rules={
                            isMinEndDateValid ? { required: "End Date is required" } : { required: "" }
                          }
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <DropDown
                        name="country"
                        control={control}
                        label="Counrtry"
                        placeholder="Select Country"
                        options={NationalityOption && NationalityOption}
                        multiple={false}
                        variant="outlined"
                        required={true}
                        rules={{
                          required: "Country is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="city"
                        label="City"
                        placeholder="Enter New City"
                        control={control}
                        required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message: "City Name cannot exceed 100 characters",
                          },
                          required: "City is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="venue"
                        label="Venue"
                        placeholder="Enter New Venue"
                        control={control}
                        required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z0-9\/\- ]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message: "Venue Name cannot exceed 100 characters",
                          },
                          required: "Venue is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="classification"
                        label="Competition Classification"
                        placeholder="Enter Competition Classification"
                        control={control}
                        required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z0-9\/\- ]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message:
                              "Competition Classification cannot exceed 100 characters",
                          },
                          required: "Competition Classification is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="importanceLevel"
                        label="Importance Level for Participation"
                        placeholder="Enter Importance Level for Participation"
                        control={control}
                        required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message:
                              "Importance Level for Participation cannot exceed 100 characters",
                          },
                          required:
                            "Importance Level for Participation is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      {/* <CustomTextField
                        name="participation"
                        label="Competition's Official Organizer Name"
                        placeholder="Enter Competition's Official Organizer Name"
                        control={control}
                        required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message: "Competition's Official Organizer Name cannot exceed 100 characters",
                          },
                          required: "Competition's Official Organizer Name is required",
                        }}
                      /> */}
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="organizerName"
                        label="Competition's Official Organizer Name"
                        placeholder="Enter Competition's Official Organizer Name"
                        control={control}
                        // required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message:
                              "Competition's Official Organizer Name cannot exceed 100 characters",
                          },
                          // required: "Competition's Official Organizer Name is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="organizerEmail"
                        label="Competition's Official Organizer Email"
                        placeholder="Enter Competition's Official Organizer Email"
                        control={control}
                        // required={true}
                        rules={{
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message:
                              "Competition's Official Organizer Email cannot exceed 100 characters",
                          },
                          // required: "Competition's Official Organizer Email is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomPhoneInput
                        name="organizerPhone"
                        control={control}
                        label="Competition's Official Organizer Phone"
                        placeholder="Enter Organizer Phone"
                        // rules={{ required: "Emergency contact number is required" }}
                        // onChangeFormatted={handleEmergencyNumberChange} // Pass the handler
                        rules={{
                          // required: "Competition's Official Organizer Phone",
                          pattern: {
                            value: /^[0-9]+$/,
                            message:
                              "Organizer Phone number must contain only digits (eg: 154450123).",
                          },
                          maxLength: {
                            value: 15,
                            message:
                              "Organizer Phone number must contain only digits (eg: 154450123).",
                          },
                          validate: {
                            isNumeric: (value) =>
                              /^\d+$/.test(value) ||
                              "Organizer Phone number must contain only digits (eg: 154450123).",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="sportDiscipline"
                        label="Sport Discipline/s"
                        placeholder="Enter Sport Discipline/s"
                        control={control}
                        required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message:
                              "Sport Discipline/s cannot exceed 100 characters",
                          },
                          required: "Sport Discipline/s is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      {/* <CustomTextField
          name="objectives"
          control={control}
          label="Objectives/ Goals for Participation"
          textarea={true}
          placeholder={"To prepare the team for upcoming competitions and improve team coordination."}
          rules={{
            required: "Objectives/ Goals for Participation is required",
            pattern: {
              value: /^[a-zA-Z0-9\s.-]+$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 300,
              message: "Objectives/ Goals for Participation cannot exceed 300 characters",
            },
          }}
        /> */}
                      <FormWithSunEditor
                        name="objectives"
                        control={control}
                        minHeight={"200px"}
                        label="Objectives/ Goals for Participation"
                        rules={{
                          required:
                            "Objectives/ Goals for Participation is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}></Grid>

                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="websiteLink"
                        label="Competition Website Link"
                        placeholder="Enter Competition Website Link"
                        control={control}
                        // required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message:
                              "Competition Website Link cannot exceed 100 characters",
                          },
                          // required: "Competition Website Link is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="liveLink"
                        label="Link for Live Race Coverage / Live Results"
                        placeholder="Enter Link for Live Race Coverage / Live Results"
                        control={control}
                        // required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message:
                              "Link for Live Race Coverage / Live Results cannot exceed 100 characters",
                          },
                          // required: "Link for Live Race Coverage / Live Results is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <Typography
                        variant="titleStyle"
                        sx={{ fontSize: "14px" }}
                        className="typography textfield-label bukra"
                        mt={0.5}
                        mb={0.5}
                      >
                        TEAM RESULTS & OFFICIAL RANKING
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                    // marginY={3}
                    >
                      <Divider />
                    </Grid>

                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="resultLink"
                        label="Link of the Official Result"
                        placeholder="Enter Link of the Official result provided by the event organizer"
                        control={control}
                        // required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message:
                              "Link for Live Race Coverage / Live Results cannot exceed 100 characters",
                          },
                          // required: "Link for Live Race Coverage / Live Results is required",
                        }}
                      />
                      <Grid item xs={12} md={12}>
                        <Divider sx={{ position: "relative", marginY: 2 }}>
                          <Box
                            sx={{
                              backgroundColor: "white",
                              borderRadius: "50%",
                              border: "1px solid #ccc",
                              width: "30px",
                              height: "30px",
                              fontWeight: "bold",
                              display: "flex", // Center the content
                              alignItems: "center", // Vertically center
                              justifyContent: "center", // Horizontally center
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontSize: "12px", fontWeight: "bold" }} // Ensure text is bold if needed
                              className="typography textfield-label bukra"
                            >
                              (or)
                            </Typography>
                          </Box>
                        </Divider>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={5.75}></Grid>
                    {/* <Grid item xs={12} md={5.75}  marginY={1}>
                    <Divider/>
                    </Grid> */}

                    <Grid item xs={12} md={5.75} marginTop={-3}>
                      {/* <Grid
                            item
                            xs={12}
                            md={12}
                            borderTop={"1px solid #008755"}
                            sx={{ mt: 5, ml: 2 }}
                          /> */}
                      <Grid item xs={12} md={12}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontSize: "14px" }}
                          className="typography textfield-label bukra"
                          mt={1.5}
                          mb={0.5}
                        >
                          Upload of the Official Result Provided By the Event
                          Organizer
                        </Typography>
                        <Box
                          border={"1px dashed #008755"}
                          bgcolor={"rgba(0, 135, 85, 0.03)"}
                          className="upload-travel"
                          position={"relative"}
                          borderRadius={"8px"}
                        >
                          <FileUploader
                            handleChange={handleChange}
                            name="file"
                            types={["pdf"]}
                            className="upload-outline"
                            label={"Click or drag file to this area to upload"}
                            uploadedLabel={
                              // isEmpty(formData) true
                              true
                                ? "Click or drag file to this area to upload"
                                : formData && formData.file === ""
                                  ? "Upload failed! Please try again"
                                  : null
                            }
                          // disabled={singleUploadData.loading}
                          />
                          <Uploadtravel
                            style={{
                              position: "absolute",
                              top: "49%",
                              left: "10%",
                              cursor: "pointer",
                              height: "50px",
                              width: "50px",
                            }}
                            onClick={handleFileUpload}
                          />
                          {/* {(formData &&
                          formData.file &&
                          formData.file.name) ||
                          (uploadDocuments && uploadDocuments) ? (
                          <DeleteOutlinedIcon
                            style={{
                              position: "absolute",
                              top: "49%",
                              right: "30%",
                              cursor: "pointer",
                              height: "20px",
                              width: "20px",
                            }} */}
                          {/* onClick={handleDeleteFile} */}
                          {/* />
                        ) : null} */}
                          <Box
                            textAlign={"center"}
                            position={"absolute"}
                            bottom={"30%"}
                            right={
                              uploadDocuments ||
                                (formData &&
                                  formData?.file &&
                                  formData?.file?.name)
                                ? "25%"
                                : "30%"
                            }
                            className="dubai-regular secondary-color webkit-line-clamp webkit-1"
                            fontWeight={600}
                            fontSize={"14px"}
                            width={"40%"}
                          >
                            {(uploadDocuments && uploadDocuments) ||
                              (formData &&
                                formData?.file &&
                                formData?.file?.name) ? (
                              <Typography
                                className="dubai-med primary-color"
                                sx={{ fontSize: "16px", fontWeight: "600" }}
                              >
                                {
                                  // {uploadDocuments.split("/").pop() ||
                                  formData?.file?.name
                                }
                              </Typography>
                            ) : (
                              "Supported formats: PDF, DOC"
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginY: "1.5rem",
                      gap: 1,
                    }}
                  >
                    {!showCancelButton && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        // sx={{ mr: 1 }}
                        onClick={
                          closeAdd

                        }
                        sx={{ fontSize: "16px", weight: 500, paddingX: 2 }}
                        // onClick={() => {
                        //   if (edit) {
                        //     onClose();
                        //   } else {
                        //     closeAdd();
                        //   }
                        // }}
                        className="cancel-button text-capitalize dubai-med"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize dubai-med"
                      disabled={
                        trainindAddData.loading ||
                        trainingUpdateData.loading ||
                        trainingCampEditData?.loading
                      }
                      onClick={handleSubmit(onSubmit)}
                      sx={{ fontSize: "16px", weight: 500, paddingX: 2 }}
                    >
                      Update
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize dubai-med"
                      disabled={
                        trainindAddData.loading ||
                        trainingUpdateData.loading ||
                        trainingCampEditData?.loading
                      }
                      onClick={handleSubmit(onSubmit)}
                      sx={{ fontSize: "16px", weight: 500, paddingX: 2 }}
                    >
                      {trainindAddData.loading ||
                        trainingUpdateData.loading ||
                        trainingCampEditData?.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        "Update & Continue"
                      )}
                    </Button>
                  </Box>
                </form>
              </Box>
            </Grid>
          </Grid>
        </Fade>
      )}
    </>
  );
};
export default StrategyCompetitionInfo;
