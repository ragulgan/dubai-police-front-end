"use client";
import CustomSnackbar from "@/components/CustomSnackbar";
import CustomPhoneInput from "@/components/Fields/CustomPhoneInput";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import { addReport, clearReportAddDataState, clearReportAddState } from "@/redux/slices/reports/reportAddSlice";
import { uploadFileReport } from "@/redux/slices/reports/reportFileUploadSlice";
import { clearAllReportUpdateState, clearReportUpdateState, updateReport } from "@/redux/slices/reports/reportUpdateSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
} from "@/utils/constants";
import FileUpload from "@/utils/dropzone";
import { getLocalStorage } from "@/utils/helper";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  Grid,
  SnackbarCloseReason,
  Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import moment, { Moment } from "moment";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import StaticFoodImage from "../../../../../public/staticFoodImage.svg";
import Uploadtravel from "../../../../../public/travelUpload.svg";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
import dayjs from "dayjs";

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
    editData
  } = props;
  console.log({ editData }, '===========');

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
        trainingRegimen: '',
        tacticalPreparation: '',
        longTermGoal: '',
        shortTermGoal: '',
        mainStrategy: '',
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
  // const raceID = useSelector((state: RootState) => !state?.addReport?.error  ? state?.addReport?.data?.raceId : null);
  console.log({ reportAddResponse, reportUpdateResponse });
  const raceStartDate = !isEmpty(reportAddResponse?.data?.race) && reportAddResponse.data?.race?.startDate ? moment(reportAddResponse.data?.race?.startDate) : !isEmpty(reportUpdateResponse?.data) && reportUpdateResponse?.data?.race.startDate ? moment(reportUpdateResponse?.data?.race.startDate) : !isEmpty(editData?.race) ? moment(editData?.race?.startDate) : null;
  const raceEndDate = !isEmpty(reportAddResponse?.data?.race) && reportAddResponse.data?.race?.endDate ? moment(reportAddResponse.data?.race?.endDate) : !isEmpty(reportUpdateResponse?.data) && reportUpdateResponse?.data?.race.endDate ? moment(reportUpdateResponse?.data?.race.endDate) : !isEmpty(editData?.race) ? moment(editData?.race?.endDate) : null;
  console.log({ raceStartDate, raceEndDate });

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
          loggedUserID: "1",
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
      endDate: dayjs(formData?.endDate).format("YYYY-MM-DD"),
      userId: 1
    }
    const getRaceID = reportAddResponse.data.raceId ? reportAddResponse.data.raceId : reportUpdateResponse.data.raceId ? reportUpdateResponse.data.raceId : editData?.raceId ? editData?.raceId : null
    console.log({ getRaceID, reportAddResponse, reportUpdateResponse });

    if (getRaceID) {
      dispatch(updateReport({ url: `/Sports/${teamID}/Race/${getRaceID}`, payload: payload }));
      dispatch(clearReportAddDataState());
    }
    else {
      dispatch(addReport({ url: `/Sports/${teamID}/Race`, payload: payload }));
    }
    // else {
    // dispatch(addReport({ url: `/Sports/${teamID}/Race`, payload :payload }));
    // }
    // setActiveStep(1)

    // const payload: any = {
    //   sportID: Number(teamID),
    //   loggedUserID: 1,
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

    if (!isEmpty(reportUpdateResponse?.data?.race)) {
      setValue("mainStrategy", reportUpdateResponse.data && reportUpdateResponse.data?.race?.mainStrategy);
      setValue("shortTermGoal", reportUpdateResponse.data && reportUpdateResponse.data?.race?.shortTermGoal);
      setValue("longTermGoal", reportUpdateResponse.data && reportUpdateResponse.data?.race?.longTermGoal);
      setValue("tacticalPreparation", reportUpdateResponse.data && reportUpdateResponse.data?.race?.tacticalPreparation);
      setValue("trainingRegimen", reportUpdateResponse.data && reportUpdateResponse.data?.race?.trainingRegimen);
      setValue("raceName", reportUpdateResponse.data && reportUpdateResponse.data?.race?.raceName);
      setValue("startDate", reportUpdateResponse.data && moment(reportUpdateResponse.data?.race?.startDate));
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

    else if (!isEmpty(reportAddResponse?.data?.race)) {
      setValue("mainStrategy", reportAddResponse?.data && reportAddResponse?.data?.race?.mainStrategy);
      setValue("shortTermGoal", reportAddResponse?.data && reportAddResponse?.data?.race?.shortTermGoal);
      setValue("longTermGoal", reportAddResponse?.data && reportAddResponse?.data?.race?.longTermGoal);
      setValue("tacticalPreparation", reportAddResponse?.data && reportAddResponse?.data?.race?.tacticalPreparation);
      setValue("trainingRegimen", reportAddResponse?.data && reportAddResponse?.data?.race?.trainingRegimen);
      setValue("raceName", reportAddResponse?.data && reportAddResponse?.data?.race?.raceName);
      setValue("startDate", reportAddResponse?.data && moment(reportAddResponse?.data?.race?.startDate));
      setValue("endDate", reportAddResponse?.data && moment(reportAddResponse?.data.endDate));
      setValue("country", reportAddResponse?.data && reportAddResponse?.data?.race?.country);
      setValue("city", reportAddResponse?.data && reportAddResponse?.data?.race?.city);
      setValue("venue", reportAddResponse?.data && reportAddResponse?.data?.race?.venue);
      setValue("classification", reportAddResponse?.data && reportAddResponse?.data?.race?.classification);
      setValue("importanceLevel", reportAddResponse?.data && reportAddResponse?.data?.race?.importanceLevel);
      setValue("organizerName", reportAddResponse?.data && reportAddResponse?.data?.race?.organizerName);
      setValue("organizerEmail", reportAddResponse?.data && reportAddResponse?.data?.race?.organizerEmail);
      setValue("organizerPhone", reportAddResponse?.data && reportAddResponse?.data?.race?.organizerPhone);
      setValue("sportDiscipline", reportAddResponse?.data && reportAddResponse?.data?.race?.sportDiscipline);
      setValue("objectives", reportAddResponse?.data && reportAddResponse?.data?.race?.objectives);
      setValue("website", reportAddResponse?.data && reportAddResponse?.data?.race?.website);
      setValue("liveLink", reportAddResponse?.data && reportAddResponse?.data?.race?.liveLink);
      setValue("resultLink", reportAddResponse?.data && reportAddResponse?.data?.race?.resultLink);
    }
    else if (!isEmpty(editData?.race)) {
      setValue("mainStrategy", editData && editData?.race?.mainStrategy);
      setValue("shortTermGoal", editData && editData?.race?.shortTermGoal);
      setValue("longTermGoal", editData && editData?.race?.longTermGoal);
      setValue("tacticalPreparation", editData && editData?.race?.tacticalPreparation);
      setValue("trainingRegimen", editData && editData?.race?.trainingRegimen);
      setValue("raceName", editData && editData?.race?.raceName);
      setValue("startDate", editData && moment(editData?.race?.startDate));
      setValue("endDate", editData && moment(editData.endDate));
      setValue("country", editData && editData?.race?.country);
      setValue("city", editData && editData?.race?.city);
      setValue("venue", editData && editData?.race?.venue);
      setValue("classification", editData && editData?.race?.classification);
      setValue("importanceLevel", editData && editData?.race?.importanceLevel);
      setValue("organizerName", editData && editData?.race?.organizerName);
      setValue("organizerEmail", editData && editData?.race?.organizerEmail);
      setValue("organizerPhone", editData && editData?.race?.organizerPhone);
      setValue("sportDiscipline", editData && editData?.race?.sportDiscipline);
      setValue("objectives", editData && editData?.race?.objectives);
      setValue("website", editData && editData?.race?.website);
      setValue("liveLink", editData && editData?.race?.liveLink);
      setValue("resultLink", editData && editData?.race?.resultLink);
    }

  }, [reportAddResponse, reportUpdateResponse, editData])

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
        dispatch(uploadFileReport({ url: `/Reports/${teamID}/Race/${reportID}/Banner`, payload: data }));
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
    clearReportAddDataState();
    // clearReportAddState();
    clearReportUpdateState();
    clearAllReportUpdateState();
    router.push(`/teams/${teamID}/raceCalendar`);
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
                    ? `Race Report ${!isEmpty(reportAddResponse.data) ? "Added" : "Updated"
                    } Successfully!`
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
                        Strategy & Goals
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={12}
                      marginBottom={2}
                    >
                      <Divider />
                    </Grid>
                    <Grid item xs={12} md={5.75}>

                      <CustomTextField
                        name="longTermGoal"
                        control={control}
                        label="Main Long-Term Goals Of The Team"
                        textarea={true}
                        placeholder={"Achieve top ranking in international police championships by 2030."}
                        rules={{
                          required: "Main Long-Term Goals Of The Team is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Main Long-Term Goals Of The Team cannot exceed 300 characters",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>

                      <CustomTextField
                        name="shortTermGoal"
                        control={control}
                        label="Main Short-Term Goals Of The Team (Current Season)"
                        textarea={true}
                        placeholder={"Improve tactical training and win national championships this season."}
                        rules={{
                          required: "Main Short-Term Goals Of The Team (Current Season) is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Main Short-Term Goals Of The Team (Current Season) cannot exceed 300 characters",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>

                      <CustomTextField
                        name="mainStrategy"
                        control={control}
                        label="Main Strategy For Achieving The Goals"
                        textarea={true}
                        placeholder={"Focused training sessions with external consultants."}
                        rules={{
                          required: "Main Strategy For Achieving The Goals is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Main Strategy For Achieving The Goals cannot exceed 300 characters",
                          },
                        }}
                      />
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

                    <Grid item xs={12} md={12}
                      marginBottom={2}
                    >
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
                            message: "Competition Name cannot exceed 100 characters",
                          },
                          // required: "Competition Name is required",
                        }}
                      // disabled={true}                 
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
                            value: /^[a-zA-Z /]*$/,
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
                            message: "Competition Classification cannot exceed 100 characters",
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
                            message: "Importance Level for Participation cannot exceed 100 characters",
                          },
                          required: "Importance Level for Participation is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      {/* <CustomRadioGroup
          name="gender"
          control={control}
          label="Competition Type"
          options={[
            { value: "internal", label: "Internal" },
            { value: "local", label: "Local" },
            { value: "international", label: "International" },
            // { value: "other", label: "Other" },
          ]}
          // required={true}
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
                            message: "Competition's Official Organizer Name cannot exceed 100 characters",
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
                            message: "Competition's Official Organizer Email cannot exceed 100 characters",
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
                            message: "Organizer Phone number must contain only digits (eg: 154450123).",
                          },
                          maxLength: {
                            value: 15,
                            message: "Organizer Phone number must contain only digits (eg: 154450123).",
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
                        // required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message: "Sport Discipline/s cannot exceed 100 characters",
                          },
                          // required: "Sport Discipline/s is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
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
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>

                    </Grid>

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
                            message: "Competition Website Link cannot exceed 100 characters",
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
                            message: "Link for Live Race Coverage / Live Results cannot exceed 100 characters",
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
                        TRAINING APPROACH OVERVIEW
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={12}
                    // marginY={3}
                    >
                      <Divider />
                    </Grid>


                    <Grid item xs={12} md={5.75}>

                      <CustomTextField
                        name="trainingRegimen"
                        control={control}
                        label="Training Regimen"
                        textarea={true}
                        placeholder={"Enter details of Training Plan/N.of sessions/ Monitoring System"}
                        rules={{
                          required: "Training Regimen is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Training Regimen cannot exceed 300 characters",
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>

                      <CustomTextField
                        name="tacticalPreparation"
                        control={control}
                        label="Tactical Preparation"
                        textarea={true}
                        placeholder={"Enter tactical preparation details"}
                        rules={{
                          required: "Tactical Preparation is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Tactical Preparation cannot exceed 300 characters",
                          },
                        }}
                      />
                    </Grid>

                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginY: "1.5rem",
                      gap: 1
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
                      ) : 'Update & Continue'}
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
