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
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { getLocalStorage } from "@/utils/helper";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import moment from "moment";
import { useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { useRouter } from "next/router";
import { viewStaff } from "@/redux/slices/staff/staffListSlice";
import { usePathname } from "next/navigation";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import AddMore from "./addMore/strategyAddMore";
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
import TrainingCampCustomDatePicker from "../trainingCampCustomDatePicker";
import {
  updateTrainingCamp,
  clearUpdateState,
} from "@/redux/slices/trainingCamp/trainingCampUpdateSlice";
import StaticFoodImage from "../../../../public/staticFoodImage.svg";
import EditFieldSkeleton from "../skeleton/editSkeletont";
import CustomTagInput from "../customTagInput";
import { singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";
import { clearReportAddDataState } from "@/redux/slices/reports/reportAddSlice";
import { clearAllReportUpdateState, clearReportUpdateState } from "@/redux/slices/reports/reportUpdateSlice";

const StrategyCampDetails = (props: any) => {
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
  } = props;
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const [minEndDate, setMinEndDate] = useState(moment());
  const [staffDataOption, setStaffDataOption] = useState<any>("");
  const [NationalityOption, setNationalityOption] = useState<any>("");
  const [athleteDataOption, setAthleteDataOption] = useState<any>("");
  const [competitionData, setCompetitionData] = useState<any>([]);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [trainingCampID, setTrainingCampID] = useState<any>(id ? id : null);
  const externalClubCertificateRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<any>("");
  const [imageData, setImageData] = useState<any>({
    ProfileImage: "",
  });
  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        campName: null,
        campStartDate: null,
        campEndDate: null,
        country: null,
        city: null,
        athletesCount: null,
        athletes: null,
        staffs: null,
        staffsCount: null,
        others: [],
        othersCount: null,
        mainLongTermGoals: null,
        mainShortTermGoals: null,
        reasonsForRequestingCamp: null,
        mainStrategy: null,
        otherActivities: null,
        competitions: [
          {
            competitionName: "",
            competitionStartDate: null,
            competitionEndDate: null,
            competitionOtherDetails: "",
          },
        ],
      },
    });
  const campStartDate = watch("campStartDate");
  const campEndDate = watch("campEndDate");
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
  const staffList = useSelector(
    (state: RootState) => state.staffList && state.staffList?.data
  );
  const getAthleteList = useSelector((state: any) => {
    return state.getAthleteList?.data;
  });
  const trainindAddData = useSelector(
    (state: RootState) => state.addTrainingCamp
  );
  const trainingCampUpload = useSelector((state: any) => state.singleUpload);
  const trainingUpdateData = useSelector(
    (state: RootState) => state.updateTrainingCamp
  );

  const getDefaultAthleteOption = (athleteList: any) => {
    const defaultOptions = [];
    for (const item in athleteList) {
      defaultOptions.push({
        label:
          athleteList[item].firstName +
          " " +
          athleteList[item].middleName +
          " " +
          athleteList[item].surName,
        value: athleteList[item].athleteID,
      });
    }
    return defaultOptions;
  };

  const getDefaultOption = (NationalityList: any) => {
    const defaultOptions = [];
    for (const item in NationalityList) {
      defaultOptions.push({
        label: NationalityList[item].countryName,
        value: NationalityList[item].countryId,
      });
    }
    return defaultOptions;
  };

  const getDefaultStaffOption = (staffList: any) => {
    const defaultOptions = [];
    for (const item in staffList) {
      defaultOptions.push({
        label:
          staffList[item].firstName +
          " " +
          staffList[item].middleName +
          " " +
          staffList[item].surName,
        value: staffList[item].staffID,
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

  const onSubmit = (data: any) => {
    const payload: any = {
      sportID: Number(teamID),

      campName: data?.campName,
      campStartDate: dayjs(data?.campStartDate).format("DD/MM/YYYY"),
      campEndDate: dayjs(data?.campEndDate).format("DD/MM/YYYY"),
      country: String(data?.country),
      city: data?.city,
      athletesCount: Number(data?.athletesCount),
      athletes: data?.athletes?.join(","),
      staffsCount: Number(data?.staffsCount),
      staffs: data?.staffs?.join(","),
      othersCount: Number(data?.othersCount),
      others: data?.others.join(","),
      mainLongTermGoals: data?.mainLongTermGoals,
      mainShortTermGoals: data?.mainShortTermGoals,
      mainStrategy: data?.mainStrategy,
      reasonsForRequestingCamp: data?.reasonsForRequestingCamp,
      otherActivities: data?.otherActivities,
    };
    if (trainingCampID) {
      const data = {
        ...payload,
        section: "campDetails",
        trainingCampID: trainingCampID && trainingCampID,
      };
      dispatch(
        updateTrainingCamp({
          url: "/UpdateTrainingCampByID",
          payload: data,
        })
      );
    } else {
      dispatch(
        addTrainingCamp({ url: "/InsertTrainingCamp", payload: payload })
      );
    }
  };

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
        campName: "",
        campStartDate: null,
        campEndDate: null,
        country: null,
        city: "",
        athletesCount: "",
        athletes: null,
        staffs: null,
        staffsCount: "",
        others: [],
        othersCount: null,
        mainLongTermGoals: null,
        mainShortTermGoals: null,
        reasonsForRequestingCamp: null,
        mainStrategy: null,
        otherActivities: null,
        competitions: [
          {
            competitionName: "",
            competitionStartDate: null,
            competitionEndDate: null,
            competitionOtherDetails: "",
          },
        ],
      });
      setImageData({});
      setTimeout(() => {
        setResetForm(false);
      }, 1000);
    }
  }, [resetForm]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  useEffect(() => {
    if (teamID) {
      const payload = {
        searchText: "",
        filteredBy: "",
        paginationIndex: 0,
        paginationCount: 0,
        sportID: Number(teamID),
      };
      dispatch(viewStaff({ url: "/GetStaffsList", payload }));
      dispatch(getAthleteListAPI(payload));
    }
  }, [teamID]);

  useEffect(() => {
    setMinEndDate(moment(campStartDate, "DD/MM/YYYY"));
    if (athletes && athletes.length > 0) {
      setValue("athletesCount", String(athletes && athletes.length));
    } else if (athletes && athletes.length === 0) {
      setValue("athletesCount", "");
    }
    if (staffs && staffs.length > 0) {
      setValue("staffsCount", String(staffs && staffs.length));
    } else if (staffs && staffs.length === 0) {
      setValue("staffsCount", "");
    }
    if (others && others.length > 0) {
      setValue("othersCount", String(others && others.length));
    } else if (others && others.length === 0) {
      setValue("othersCount", "");
    }
  }, [campStartDate, athletes, staffs, others]);

  useEffect(() => {
    const nationality: any = getDefaultOption(getNationality);
    setNationalityOption(nationality);
  }, [getNationality]);

  useEffect(() => {
    const staff: any = getDefaultStaffOption(staffList);
    setStaffDataOption(staff);
  }, [staffList]);

  useEffect(() => {
    const athlete: any = getDefaultAthleteOption(getAthleteList);
    setAthleteDataOption(athlete);
  }, [getAthleteList]);

  const closeAdd = () => {
    setDialogOpen(false);
    clearReportAddDataState();
    // clearReportAddState();
    clearReportUpdateState();
    clearAllReportUpdateState();
    router.push(`/teams/${teamID}/reports`);

  };

  useEffect(() => {
    if (
      (trainindAddData && trainindAddData.code === 200) ||
      (trainingUpdateData && trainingUpdateData.code === 200)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      if (id) {
        setIsUpdated(true);
      }
      setTimeout(() => {
        setActiveStep(1);
        if (id) {
          setIsUpdated(false);
        }
      }, 1000);
      dispatch(clearAddState());
      dispatch(clearUpdateState());
      const formattedCompetitions =
        competitionData &&
        competitionData.map((comp: any) => ({
          ...comp,
          competitionStartDate: dayjs(comp.competitionStartDate).format(
            "DD/MM/YYYY hh:mm:ss A"
          ),
          competitionEndDate: dayjs(comp.competitionEndDate).format(
            "DD/MM/YYYY hh:mm:ss A"
          ),
        }));
      const payload: any = {
        trainingCampID: trainindAddData.data.trainingCampID || trainingCampID,
        sportID: Number(teamID),

        trainingCampCompetition: formattedCompetitions && formattedCompetitions,
      };
      dispatch(
        addTrainingCampCompetition({
          url: trainingCampID
            ? "/UpdateTrainingCampCompetitionID"
            : "/InsertTrainingCampCompetition",
          payload: payload,
        })
      );
      const fileFlags = ["ProfileImage"];
      fileFlags.forEach((flag) => {
        const fileData = image?.[flag as keyof typeof image];
        if (fileData && fileData.file) {
          const formData = new FormData();
          formData.append("file", fileData.file);
          formData.append("modulename", "TrainingCamp");
          formData.append(
            "moduleid",
            trainindAddData.data.trainingCampID ||
            trainingUpdateData.data.trainingCampID
          );
          formData.append("section", "ProfileImage");
          dispatch(singleFileUpload(formData));
        }
      });
      const value = getValues();
      setAllData((prevFormData: any) => ({
        ...prevFormData,
        StrategyDetails: value,
        trainingCampID:
          trainindAddData.data.trainingCampID ||
          trainingUpdateData.data.trainingCampID,
        imageData: imageData,
      }));
    } else if (
      (trainindAddData && trainindAddData.code === 500) ||
      (trainingUpdateData && trainingUpdateData.code === 500)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearAddState());
      dispatch(clearUpdateState());
    } else if (
      (trainindAddData && trainindAddData.code === 409) ||
      (trainingUpdateData && trainingUpdateData.code === 409)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearAddState());
      dispatch(clearUpdateState());
    }
  }, [trainindAddData, trainingUpdateData]);

  useEffect(() => {
    if (trainingCampEditData && trainingCampEditData.code === 200) {
      setValue(
        "campName",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].campName
      );
      setValue(
        "campStartDate",
        moment(
          trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].campStartDate,
          "DD/MM/YYYY"
        )
      );
      setValue(
        "campEndDate",
        moment(
          trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].campEndDate,
          "DD/MM/YYYY"
        )
      );
      setValue(
        "country",
        Number(
          trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].campCountry
        )
      );
      setValue(
        "city",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].campCity
      );
      setValue(
        "athletesCount",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].athletesCount
      );
      setValue(
        "athletes",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].athletes.split(",").map(Number)
      );
      setValue(
        "staffs",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].staffs.split(",").map(Number)
      );
      setValue(
        "staffsCount",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].staffsCount
      );
      const othersData =
        trainingCampEditData?.data[0]?.others?.split(",").map(String) || [];

      if (!_.isEqual(othersData, [""])) {
        setValue("others", othersData);
      } else {
        setValue("others", []);
      }
      setValue(
        "othersCount",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].othersCount
      );
      setValue(
        "mainLongTermGoals",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].mainLongTermGoals
      );
      setValue(
        "mainShortTermGoals",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].mainShortTermGoals
      );
      setValue(
        "reasonsForRequestingCamp",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].reasonsForRequestingCamp
      );
      setValue(
        "mainStrategy",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].mainStrategy
      );
      setValue(
        "otherActivities",
        trainingCampEditData &&
        trainingCampEditData?.data[0] &&
        trainingCampEditData?.data[0].otherActivities
      );
      setValue(
        "competitions",
        (
          (trainingCampEditData &&
            trainingCampEditData?.data[0] &&
            trainingCampEditData?.data[0]?.competitionList) ||
          []
        )
          .map((comp: any) => ({
            competitionName: comp.competitionName,
            competitionStartDate: moment(
              comp.competitionStartDate,
              "DD/MM/YYYY hh:mm:ss A"
            ),
            competitionEndDate: moment(
              comp.competitionEndDate,
              "DD/MM/YYYY hh:mm:ss A"
            ),
            competitionOtherDetails: comp && comp.competitionOtherDetails,
          }))
          .reverse()
      );
      setImageData({
        ProfileImage:
          trainingCampEditData &&
          trainingCampEditData?.data[0] &&
          trainingCampEditData?.data[0].profileFilePath,
      });
    } else if (parsedData.StrategyDetails) {
      const formData: any = parsedData.StrategyDetails;
      setValue("campName", formData.campName);
      setValue("campStartDate", moment(formData.campStartDate));
      setValue("campEndDate", moment(formData.campEndDate));
      setValue("country", formData.country);
      setValue("city", formData.city);
      setValue("athletesCount", formData.athletesCount);
      setValue("athletes", formData.athletes);
      setValue("staffs", formData.staffs);
      setValue("staffsCount", formData.staffsCount);
      setValue("others", formData.others);
      setValue("othersCount", formData.othersCount);
      setValue("mainLongTermGoals", formData.mainLongTermGoals);
      setValue("mainShortTermGoals", formData.mainShortTermGoals);
      setValue("reasonsForRequestingCamp", formData.reasonsForRequestingCamp);
      setValue("mainStrategy", formData.mainStrategy);
      setValue("otherActivities", formData.otherActivities);
      setValue(
        "competitions",
        (formData?.competitions || []).map((comp: any) => ({
          competitionName: comp.competitionName,
          competitionStartDate: moment(comp.competitionStartDate),
          competitionEndDate: moment(comp.competitionEndDate),
          competitionOtherDetails: comp && comp.competitionOtherDetails,
        }))
      );
      setImageData(parsedData && parsedData?.imageData);
      setTrainingCampID(parsedData.trainingCampID);
    }
  }, [trainingCampEditData]);

  useEffect(() => {
    if (trainingCampUpload.code === 200) {
      dispatch(clearState());
    }
  }, [trainingCampUpload]);

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
                    ? `Training Camp ${trainingCampID ? "Update" : "Added"
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
                        Camp Image
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
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="campName"
                        label="Camp Name"
                        placeholder="Enter New Camp Name"
                        control={control}
                        required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z0-9() /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message: "Camp Name cannot exceed 100 characters",
                          },
                          required: "Camp Name is required",
                        }}
                      />
                    </Grid>
                    <Grid container item xs={12} md={5.75} spacing={2}>
                      <Grid item xs={6}>
                        <TrainingCampCustomDatePicker
                          control={control}
                          name="campStartDate"
                          label="Start Date"
                          boxmb={0.8}
                          required={true}
                          minDate={moment()}
                          maxDate={
                            campEndDate
                              ? moment(campEndDate).add(1, "day")
                              : moment().add(10, "years")
                          }
                          className="Text-field-customise"
                          rules={{
                            required: "Start Date is required",
                          }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TrainingCampCustomDatePicker
                          control={control}
                          name="campEndDate"
                          label="End Date"
                          boxmb={0.8}
                          required={true}
                          minDate={minEndDate}
                          disabled={!minEndDate.isValid()}
                          maxDate={moment().add(10, "years")}
                          className="Text-field-customise"
                          rules={
                            !minEndDate.isValid()
                              ? { required: "" }
                              : { required: "End Date is required" }
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
                    <Grid container item xs={12} md={5.75} spacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          variant="titleStyle"
                          sx={{ fontSize: "14px" }}
                          className="typography textfield-label bukra"
                          mt={1.5}
                          mb={0.5}
                        >
                          Total Number of Athletes
                          <span style={{ color: "#E4002B", marginLeft: "4px" }}>
                            *
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={2} className="padding-card-top">
                        <CustomTextField
                          name="athletesCount"
                          placeholder="0"
                          control={control}
                          disabled={true}
                          rules={{
                            required: "Please select an Athlete",
                          }}
                          errorDisplay={"no-wrap"}
                        />
                      </Grid>
                      <Grid item xs={10} className="padding-card-top">
                        <DropDown
                          name="athletes"
                          control={control}
                          placeholder="Select Athletes"
                          options={athleteDataOption && athleteDataOption}
                          multiple={true}
                          variant="outlined"
                          required={true}
                        />
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} md={5.75} spacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          variant="titleStyle"
                          sx={{ fontSize: "14px" }}
                          className="typography textfield-label bukra"
                          mt={1.5}
                          mb={0.5}
                        >
                          Total Number of Staff
                          <span style={{ color: "#E4002B", marginLeft: "4px" }}>
                            *
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={2} className="padding-card-top">
                        <CustomTextField
                          name="staffsCount"
                          placeholder="0"
                          control={control}
                          rules={{
                            required: "Please select an Staff",
                          }}
                          errorDisplay={"no-wrap"}
                          disabled={true}
                        />
                      </Grid>
                      <Grid item xs={10} className="padding-card-top">
                        <DropDown
                          name="staffs"
                          control={control}
                          placeholder="Select Staff"
                          options={staffDataOption && staffDataOption}
                          multiple={true}
                          variant="outlined"
                          required={true}
                        />
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} md={5.75} spacing={2}>
                      <Grid item xs={12}>
                        <Typography
                          variant="titleStyle"
                          sx={{ fontSize: "14px" }}
                          className="typography textfield-label bukra"
                          mt={1.5}
                          mb={0.5}
                        >
                          Others
                        </Typography>
                      </Grid>
                      <Grid item xs={2} className="padding-card-top">
                        <CustomTextField
                          name="othersCount"
                          placeholder="0"
                          control={control}
                          disabled={true}
                        />
                      </Grid>
                      <Grid item xs={10} className="padding-card-top">
                        <CustomTagInput
                          control={control}
                          name="others"
                          placeholder="Enter Others..."
                        />
                      </Grid>
                      <Grid item xs={12} mt={-2}>
                        <Typography
                          sx={{ fontSize: "14px", color: "grey" }}
                          className="dubai-med"
                        >
                          Note: Please enter name and press tab.
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={5.75} />
                    <Grid item xs={12} md={5.75}>
                      <FormWithSunEditor
                        name="mainLongTermGoals"
                        control={control}
                        minHeight={"200px"}
                        label="Main Long-Term Goals Of The Team"
                        rules={{
                          required:
                            "Main Long-Term Goals Of The Team is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <FormWithSunEditor
                        name="mainShortTermGoals"
                        control={control}
                        minHeight={"200px"}
                        label="Main Short-Term Goals Of The Team (Current Season)"
                        rules={{
                          required:
                            "Main Short-Term Goals Of The Team is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <FormWithSunEditor
                        name="mainStrategy"
                        control={control}
                        minHeight={"200px"}
                        label="Main Strategy For Achieving The Goals"
                        rules={{
                          required:
                            "Main Strategy For Achieving The Goals is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <FormWithSunEditor
                        name="reasonsForRequestingCamp"
                        control={control}
                        minHeight={"200px"}
                        label="Reasons for requesting the training camp (objectives)"
                        rules={{
                          required:
                            "Reasons for requesting the training camp is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontSize: "14px",
                          borderTop: "1px solid #E0E0E0",
                        }}
                        className="typography textfield-label bukra"
                        mt={1.5}
                        mb={0.5}
                        pt={3}
                      >
                        Competition(s) the team will participate during the camp
                      </Typography>
                    </Grid>
                    <AddMore
                      setCompetitionData={setCompetitionData}
                      competitionData={competitionData}
                      campStartDate={campStartDate}
                      campEndDate={campEndDate}
                      control={control}
                      watch={watch}
                    />
                    <Grid item xs={12} md={5.75}>
                      <FormWithSunEditor
                        name="otherActivities"
                        control={control}
                        minHeight={"200px"}
                        label="Other activities planned for training camp"
                        rules={{
                          required:
                            "Other activities planned for training camp is required",
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginY: "1.5rem",
                    }}
                  >
                    {!showCancelButton && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        sx={{ mr: 1 }}
                        onClick={

                          closeAdd
                        }
                        className="cancel-button text-capitalize dubai-med"
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize dubai-med cancel-button"
                      disabled={
                        trainindAddData.loading ||
                        trainingUpdateData.loading ||
                        trainingCampEditData?.loading
                      }
                      onClick={handleSubmit(onSubmit)}
                      sx={{ fontSize: "16px", weight: 500 }}
                    >
                      {trainindAddData.loading ||
                        trainingUpdateData.loading ||
                        trainingCampEditData?.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : edit ? (
                        "Update"
                      ) : (
                        "Save & Continue"
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
export default StrategyCampDetails;
