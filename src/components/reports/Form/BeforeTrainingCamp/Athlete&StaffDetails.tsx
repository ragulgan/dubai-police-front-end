"use client";
import CustomSnackbar from "@/components/CustomSnackbar";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";
import { clearReportAddDataState, clearReportAddState } from "@/redux/slices/reports/reportAddSlice";
import { clearAllReportUpdateState, clearReportUpdateState, updateReport } from "@/redux/slices/reports/reportUpdateSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  DeparatmentOptions,
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
  levelTableOptions,
  PermissionType,
  SportCategory,
  StatusOptions
} from "@/utils/constants";
import { getLocalStorage } from "@/utils/helper";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Fade,
  Grid,
  SnackbarCloseReason,
  Typography
} from "@mui/material";
import { isEmpty } from "lodash";
import moment from "moment";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TeamsTable from "../../teamsTable";
import DeleteDialog from "@/components/DeleteDialog";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import FileUpload from "@/utils/dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import StaticFoodImage from "../../../../../public/staticFoodImage.svg";
import { editTrainingCamp } from "@/redux/slices/trainingCamp/trainingCampEditSlice";
import {
  addTrainingCamp,
  clearAddState,
} from "@/redux/slices/trainingCamp/trainingCampAddSlice";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { updateTrainingCamp, clearUpdateState } from "@/redux/slices/trainingCamp/trainingCampUpdateSlice";


interface AthleteFormProps {
  field: any; // Use correct type if available
  index: number | null;
  // currentIndex: number;
  control: any;
}


interface Athlete {
  athleteId: string;
  medicalTestDate: string;
  medicalTestStatus: string;
  medicalPerformanceLevel: string;
  performanceTestDate: string;
  performanceTestResult: string;
  performanceExpectedResult: string;
  workPermissionType: string;
  workPermissionStartDate: string;
  workPermissionEndDate: string;
  workPermissionNotes: string;
  createdAt?: any;
  modifiedAt?: any;
}
interface Staff {
  staffId: string;
  medicalTestDate: string,
  medicalTestStatus: string,
  medicalTestNotes: string,
  permissionType: string,
  permissionDate: string,
  permissionResult: string,
  createdAt?: any;
  modifiedAt?: any;
}

const AthleteStaffDetails = (props: any) => {
  const {
    setActiveStep,
    setAllData,
    setDialogOpen,
    showCancelButton,
    edit,
    onClose,
    // trainingCampEditData,
    id,
    setIsUpdated,
    setResetForm,
    resetForm,
    reportID,
    data
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
  const [formData, setFormData] = useState<any>({

  });
  const [trainingCampID, setTrainingCampID] = useState<any>(id ? id : null);
  const externalClubCertificateRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<any>("");
  const [athletesData, setAthletes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [staffDeleteIndex, setStaffDeleteIndex] = useState<number | null>(null);
  const [staffCurrentIndex, setStaffCurrentIndex] = useState(null);

  const [imageData, setImageData] = useState<any>({
    ProfileImage: "",
  });
  console.log({ athleteDataOption });
  const trainingCampEditData = useSelector(
    (state: RootState) => state.editTraningCamp
  );


  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        athlete: [
          {
            athleteId: "",
            medicalTestDate: null,
            medicalTestStatus: "",
            medicalPerformanceLevel: "",
            performanceTestDate: null,
            performanceTestResult: "",
            performanceExpectedResult: "",
            workPermissionType: "",
            workPermissionStartDate: null,
            workPermissionEndDate: null,
            workPermissionNotes: ""
          }
        ],
        staff: [
          {
            staffId: "",
            medicalTestDate: null,
            medicalTestStatus: "",
            medicalTestNotes: "",
            permissionType: "",
            permissionDate: null,
            permissionResult: ""
          }


        ],
        mainLongTermGoals: "",
        mainShortTermGoals: "",
        mainStrategy: "",
        reasonsForRequestingCamp: "",
        otherActivities: "",
      },
    });
  const { fields, append, update, remove } = useFieldArray({
    control,
    name: "athlete",
  });
  const { fields: staffFields, append: addStaff, update: updateStaff, remove: removeStaff } = useFieldArray({
    control,
    name: "staff",
  });
  const campStartDate = watch("campStartDate");
  const campEndDate = watch("campEndDate");
  const athletes = watch("athlete");
  console.log({ athletes }, '==========');

  const staffs = watch("staff");
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
  console.log({ trainindAddData });

  const trainingCampUpload = useSelector((state: any) => state.singleUpload);
  const trainingUpdateData = useSelector(
    (state: RootState) => state.updateTrainingCamp
  );
  const rolesListData = useSelector((state: RootState) => state.rolesList);
  const reportAddResponse = useSelector((state: RootState) => state.addReport);
  const reportUpdateResponse = useSelector((state: RootState) => state.updateReport);

  const RaceID = useSelector((state: RootState) => !state?.addReport?.error ? state?.addReport?.data?.reportId : null);
  // const mergedAthletes = mergeAthletes(athletes, getAthleteList);
  const mergedStaff = mergeStaff(staffs, staffList);
  // console.log({ mergedStaff, mergedAthletes });

  const currentField = currentIndex !== null && fields[currentIndex] || null;
  const staffCurrentField = staffCurrentIndex !== null && fields[staffCurrentIndex] || null;
  const [isDeleteOpen, setDeleteOpen] = useState(false);
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
        // value:  athleteList[item].firstName +
        // " " +
        // athleteList[item].middleName +
        // " " +
        // athleteList[item].surName,
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
        // value:  athleteList[item].firstName +
        // " " +
        // athleteList[item].middleName +
        // " " +
        // athleteList[item].surName,
      });
    }
    return defaultOptions;
  };

  const rolesOptions =
    rolesListData?.data
      ?.filter((role: any) => role.moduleName === "Staff") // Filter roles by moduleName
      .map((role: any) => ({
        label: role.roleName,
        value: role.roleName,
      })) || [];

  useEffect(() => {
    const athlete: any = getDefaultAthleteOption(getAthleteList);
    setAthleteDataOption(athlete);
  }, [getAthleteList]);

  useEffect(() => {
    const staff: any = getDefaultStaffOption(staffList);
    setStaffDataOption(staff);
  }, [staffList]);

  useEffect(() => {
    if (resetForm) {
      reset({
        startDate: null,
        endDate: null,
        country: null,
        city: null,
        athlete: [{
          athleteId: '',
          athlete_rank: "",
          athlete_department: "",
          athlete_category: "",
          athlete_role: "",
          finalGeneralRanking: "",
          final_category_ranking: "",
          individual_result: 0,
          total_participants: 10,
          injury_status: false,
          performance_aspects_comment: "",
          behavioral_aspects_comment: "",
        }],
        staff: [
          {
            staffId: "",
            staff_rank: "",
            staff_department: "",
            staff_role: "",
            participationNotes: "",
          },
        ],
        generalSeasonalRanking: "",

      });
      setImageData({});
      setTimeout(() => {
        setResetForm(false);
      }, 1000);
    }
  }, [resetForm]);



  // const onSubmit = (formData: any) => {
  //   // const getRaceID = !isEmpty(reportUpdateResponse?.data) ? reportUpdateResponse?.data.reportId : RaceID
  //   const getRaceID = data?.finalReport?.reportId
  //   console.log({ data, getRaceID }, 'dataaaaaaaa 1st step data');

  //   // setActiveStep(1)
  //   dispatch(updateReport({ url: `/Reports/${teamID}/Race/${reportID}/${getRaceID}/AthleteStaff`, payload: formData }));
  // };


  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
  };

  const onSubmit = (formData: any) => {
    // const getRaceID = !isEmpty(reportUpdateResponse?.data) ? reportUpdateResponse?.data.reportId : RaceID
    // const formattedData = athletes.map((item: Athlete) => ({
    //   ...item,
    //   medicalTestDate: formatDate(item.medicalTestDate),
    //   performanceTestDate: formatDate(item.performanceTestDate),
    //   workPermissionStartDate: formatDate(item.workPermissionStartDate),
    //   workPermissionEndDate: formatDate(item.workPermissionEndDate),
    //   createdAt: formatDate(item.createdAt),
    //   modifiedAt: formatDate(item.modifiedAt)
    // }));
    // const formattedStaffData = staffs.map((item: Staff) => ({
    //   ...item,
    //   medicalTestDate: formatDate(item.medicalTestDate),
    //   permissionDate: formatDate(item.permissionDate),

    //   createdAt: formatDate(item.createdAt),
    //   modifiedAt: formatDate(item.modifiedAt)
    // }));

    // const payload = {
    //   ...data,
    //   athlete: formattedData,
    //   staff: formattedStaffData,
    //   userId: 1
    // }
    const payload = {
      sportID: teamID,
      campName: formData.campName,
      campStartDate: formData.campStartDate ? moment(formData.campStartDate).format("DD/MM/YYYY") : "", // uses moment
      campEndDate: formData.campEndDate ? moment(formData.campStartDate).format("DD/MM/YYYY") : "",
      country: String(formData.country),
      city: formData.city,
      // athletes: athletes?.map(a => a.athleteID).join(",") || "",
      athletes: (athletes ?? []).map((a: any) => a.athleteID).join(","),
      athletesCount: athletes.length,
      staffs: (staffs ?? []).map((s: any) => s.staffID).join(","),
      // staffs: staffs?.map(s => s.staffID).join(",") || "",
      staffsCount: staffs.length,
      mainLongTermGoals: formData.mainLongTermGoals,
      mainShortTermGoals: formData.mainShortTermGoals,
      mainStrategy: formData.mainStrategy,
      reasonsForRequestingCamp: formData.reasonsForRequestingCamp,
      otherActivities: formData.otherActivities,
      section: "campDetails",
      trainingCampID: reportID,
      "othersCount": 0,
      "others": "",
    }

    // dispatch(updateReport({ url: `/Sports/${teamID}/Race/${reportID}/AthleteStaff`, payload: payload }));
    dispatch(updateTrainingCamp({ url: "/UpdateTrainingCampByID", payload: payload }));
    // dispatch(addTrainingCamp({ url: "/InsertTrainingCamp", payload: payload }));

    // dispatch(updateReport({ url: `/Sports/${teamID}/Race/${raceID}/AthleteStaff`, payload: payload }));
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
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
        setIsUpdated(true);
        if (snackbarStatus !== 'error') {
          setActiveStep((prevStep: number) => prevStep + 1)
        }
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        // setIsUpdated(false);
      }
    };
  }, [snackbarOpen]);


  // useEffect(())



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







  function mergeAthletes(athleteSelect: any, athleteList: any) {
    console.log({ athleteSelect, athleteList });

    return !isEmpty(athleteSelect) && athleteSelect.map((athlete: any) => {
      // Find matching athlete in AthleteList
      const matchedAthlete = !isEmpty(athleteList) && athleteList.find((a: any) => a.athleteID === athlete.athleteId);
      console.log({ matchedAthlete });

      // Merge only if found, otherwise keep existing values
      return {
        ...athlete,
        athlete_name: matchedAthlete && `${matchedAthlete.rank} ${matchedAthlete.firstName} ${matchedAthlete.middleName} ${matchedAthlete.surName}`,
        avatar: matchedAthlete?.profileImage || null, // Keep null if avatar is missing
      };
    });
  };
  function mergeStaff(staffSelect: any, staffList: any) {

    return !isEmpty(staffSelect) && staffSelect.map((staff: any) => {
      // Find matching staff in AthleteList
      const matchedAthlete = !isEmpty(staffList) && staffList.find((a: any) => a.staffID === staff.staffId);
      console.log({ matchedAthlete });

      // Merge only if found, otherwise keep existing values
      return {
        ...staff,
        athlete_name: matchedAthlete && `${matchedAthlete.rank} ${matchedAthlete.firstName} ${matchedAthlete.middleName} ${matchedAthlete.surName}`,
        avatar: matchedAthlete?.profileImage || null, // Keep null if avatar is missing
      };
    });
  };
  console.log(mergeAthletes(athletes, getAthleteList), 'mergggggggggg');


  // useEffect(() => {
  //   if (reportID) {
  //     const payload = {
  //       sportID: Number(teamID),
  //       trainingCampID: Number(reportID),

  //     };
  //     dispatch(
  //       editTrainingCamp({ url: "/GetTrainingCampByID", payload: payload })
  //     );
  //   }
  // }, []);

  useEffect(() => {
    console.log({ trainingCampEditData });

    if (trainingCampEditData && trainingCampEditData.code === 200 && !isEmpty(trainingCampEditData?.data[0])) {
      console.log('ssssssssssssssssssss trainingCampEditDatatrainingCampEditData', trainingCampEditData);

      setValue("campName", trainingCampEditData?.data[0].campName);
      setValue("campStartDate", moment(trainingCampEditData?.data[0].campStartDate));
      setValue("campEndDate", moment(trainingCampEditData?.data[0].campEndDate));
      setValue("country", trainingCampEditData?.data[0].campCountry);
      setValue("city", trainingCampEditData?.data[0].campCity);
      setValue("athletesCount", trainingCampEditData?.data[0].athletesCount);
      setValue("athletes", trainingCampEditData?.data[0].athleteList);
      setValue("staffs", trainingCampEditData?.data[0].staffs);
      setValue("mainLongTermGoals", trainingCampEditData?.data[0].mainLongTermGoals);
      setValue("mainShortTermGoals", trainingCampEditData?.data[0].mainShortTermGoals);
      setValue("reasonsForRequestingCamp", trainingCampEditData?.data[0].reasonsForRequestingCamp);
      setValue("mainStrategy", trainingCampEditData?.data[0].mainStrategy);
      setValue("otherActivities", trainingCampEditData?.data[0].otherActivities);
      setValue('athlete', trainingCampEditData?.data[0].athleteList)
      setValue('staff', trainingCampEditData?.data[0].staffList)
    }



  }, [trainingCampEditData])

  const handleUpdateAthlete = (index: any, updatedData: any) => {
    console.log({ updatedData, index }, 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
    const updateData = watch('athlete')[index]
    console.log({ updateData });

    update(index, updateData);
    setCurrentIndex(null)
  };
  const handleUpdateStaff = (index: number, updatedData: any) => {
    console.log({ updatedData, index }, 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');

    updateStaff(index, updatedData);
    setStaffCurrentIndex(null)
  };

  const AthleteForm: React.FC<AthleteFormProps> = ({
    field,
    index,
    // currentIndex,
    control,
  }) => {
    if (index !== currentIndex) return null; // Render only the selected index
    console.log({ field }, 'fieldfield');
    // setValue(`athlete.${currentIndex}.medicalTestDate`, moment(field.medicalTestDate));
    // setValue(`athlete.${currentIndex}.performanceTestDate`, moment(field.performanceTestDate));
    // setValue(`athlete.${currentIndex}.workPermissionStartDate`, moment(field.workPermissionStartDate));
    // setValue(`athlete.${currentIndex}.workPermissionEndDate`, moment(field.workPermissionEndDate))
    return (
      <>
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
            // marginTop:20
          }}
        >
          <Grid container spacing={2}   >
            <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
              <Grid item xs={12} md={6} rowSpacing={4}>
                <DropDown
                  // name="athlete_name"
                  name={`athlete.${currentIndex}.athleteID`}
                  control={control}
                  label="Athlete"
                  placeholder="Select Athlete"
                  options={athleteDataOption && athleteDataOption}
                  variant="outlined"
                  required={true}
                  rules={{
                    required: "Athlete is required",
                  }}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DropDown
                  name={`athlete.${currentIndex}.athlete_rank`}
                  // name="athlete_rank"
                  control={control}
                  label="Rank"
                  placeholder="Select Rank"
                  options={NationalityOption && NationalityOption}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Rank is required",
                // }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <DropDown
                  name={`athlete.${currentIndex}.athlete_department`}
                  // name="athlete_department"
                  control={control}
                  label="Department"
                  placeholder="Select Department"
                  options={DeparatmentOptions && DeparatmentOptions}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DropDown
                  name={`athlete.${currentIndex}.athlete_category`}
                  // name="athlete_category"
                  control={control}
                  label="Category"
                  placeholder="Select Category"
                  options={SportCategory && SportCategory}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <DropDown
                  name={`athlete.${currentIndex}.athlete_role`}
                  // name="athlete_role"
                  control={control}
                  label="Role"
                  placeholder="Select Role"
                  options={rolesOptions && rolesOptions}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>

            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                {/* <Grid item xs={12} md={6} marginTop={2}> */}
                <Typography
                  variant="titleStyle"
                  sx={{ fontSize: "14px" }}
                  className="typography textfield-label bukra"
                // mt={0.5}
                // mb={0.5}
                >
                  Health /Medical Test
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />


              </Grid>
              <Grid item xs={12} md={6}>
                {/* <Grid item xs={12} md={6} marginTop={2}> */}
                <Typography
                  variant="titleStyle"
                  sx={{ fontSize: "14px" }}
                  className="typography textfield-label bukra"
                // mt={0.5}
                // mb={0.5}
                >
                  Last Performance Test
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

              </Grid>

            </Grid>
            <Grid container md={5.75} spacing={2}>
              <Grid item xs={6}>
                <TrainingCampCustomDatePicker
                  control={control}
                  name={`athlete.${currentIndex}.medicalTestDate`}
                  label="Date"
                  boxmb={0.8}
                  // required={true}
                  defaultValue={null}
                  minDate={moment()}
                  disabled={true}
                  // maxDate={
                  //   campEndDate
                  //     ? moment(campEndDate).add(1, "day")
                  //     : moment().add(10, "years")
                  // }
                  className="Text-field-customise"
                // rules={{
                //   required: "Start Date is required",
                // }}
                />
              </Grid>
              <Grid item xs={6}>
                <DropDown
                  name={`athlete.${currentIndex}.medicalTestStatus`}
                  // name="athlete_role"
                  control={control}
                  label="Status"
                  placeholder="Select Status"
                  options={StatusOptions}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>
              <Grid item xs={12}>
                <DropDown
                  name={`athlete.${currentIndex}.medicalPerformanceLevel`}
                  // name="athlete_role"
                  control={control}
                  label="Performance Level (1 To 3)"
                  placeholder="Select Performance Level"
                  options={levelTableOptions}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>
            </Grid>
            <Grid container md={5.75} spacing={2} sx={{ marginLeft: 5 }}>
              <Grid item xs={6}>
                <TrainingCampCustomDatePicker
                  control={control}
                  name={`athlete.${currentIndex}.performanceTestDate`}
                  label="Date"
                  boxmb={0.8}
                  // required={true}
                  defaultValue={null}
                  minDate={moment()}
                  disabled={true}
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
                <CustomTextField
                  name={`athlete.${currentIndex}.performanceTestResult`}
                  label="Result"
                  placeholder="Enter New Result"
                  control={control}
                  // required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z /]*$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 100,
                      message: "Result Name cannot exceed 100 characters",
                    },
                    // required: "Result is required",
                  }}
                  disabled={true}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <CustomTextField
                  name={`athlete.${currentIndex}.performanceExpectedResult`}
                  label="Result Expected"
                  placeholder="Enter Expected Result"
                  control={control}
                  // required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z /]*$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 100,
                      message: "Result Name cannot exceed 100 characters",
                    },
                    // required: "Result is required",
                  }}
                />
              </Grid> */}
              <Grid item xs={12} md={12}>
                {/* <Grid item xs={12} md={6} marginTop={2}> */}
                <Typography
                  variant="titleStyle"
                  sx={{ fontSize: "14px" }}
                  className="typography textfield-label bukra"
                // mt={0.5}
                // mb={0.5}
                >
                  Expiry Date of Official Docs
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

              </Grid>

              <Grid container md={12} spacing={2} marginLeft={0}>

                <Grid item xs={6}>
                  <TrainingCampCustomDatePicker
                    control={control}
                    name={`athlete.${currentIndex}.passportDate`}
                    label="Passport"
                    boxmb={0.8}
                    // required={true}
                    defaultValue={null}
                    minDate={moment()}
                    disabled={true}
                    // maxDate={
                    //   campEndDate
                    //     ? moment(campEndDate).add(1, "day")
                    //     : moment().add(10, "years")
                    // }
                    className="Text-field-customise"
                  // rules={{
                  //   required: "Start Date is required",
                  // }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TrainingCampCustomDatePicker
                    control={control}
                    name={`athlete.${currentIndex}.sportsLicence`}
                    label="Sports Licence"
                    boxmb={0.8}
                    // required={true}
                    defaultValue={null}
                    minDate={moment()}
                    disabled={true}
                    // maxDate={
                    //   campEndDate
                    //     ? moment(campEndDate).add(1, "day")
                    //     : moment().add(10, "years")
                    // }
                    className="Text-field-customise"
                  // rules={{
                  //   required: "Start Date is required",
                  // }}
                  />
                </Grid>

              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
              <Grid item xs={12} md={12}>
                {/* <Grid item xs={12} md={6} marginTop={2}> */}
                <Typography
                  variant="titleStyle"
                  sx={{ fontSize: "14px" }}
                  className="typography textfield-label bukra"
                // mt={0.5}
                // mb={0.5}
                >
                  Details of the Last Race
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

              </Grid>
              <Grid item xs={5.75}>
                <CustomTextField
                  name={`athlete.${currentIndex}.raceName`}
                  label="Race Name"
                  placeholder="Enter New Race Name"
                  control={control}
                  // required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z /]*$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 100,
                      message: "Race Name cannot exceed 100 characters",
                    },
                    // required: "Race Name is required",
                  }}
                  disabled={true}
                />
              </Grid>



            </Grid>
            <Grid container md={5.75} spacing={2}>
              <Grid item xs={6}>
                <TrainingCampCustomDatePicker
                  control={control}
                  name={`athlete.${currentIndex}.raceDate`}
                  label="Date"
                  boxmb={0.8}
                  // required={true}
                  defaultValue={null}
                  minDate={moment()}
                  // maxDate={
                  //   campEndDate
                  //     ? moment(campEndDate).add(1, "day")
                  //     : moment().add(10, "years")
                  // }
                  className="Text-field-customise"
                  // rules={{
                  //   required: "Start Date is required",
                  // }}
                  disabled={true}
                />
              </Grid>
              <Grid item xs={6}>
                <DropDown
                  name={`athlete.${currentIndex}.raceStatus`}
                  // name="athlete_role"
                  control={control}
                  label="Status"
                  placeholder="Select Status"
                  options={StatusOptions}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>

            </Grid>
            {/* <Grid container md={5.75} spacing={2} marginLeft={3}>
              <Grid item xs={6}>
                <DropDown
                  name={`athlete.${currentIndex}.medicalPerformanceLevel`}
                  // name="athlete_role"
                  control={control}
                  label="Performance Level (1 To 3)"
                  placeholder="Select Performance Level"
                  options={levelTableOptions}
                  variant="outlined"
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>

            </Grid> */}

            <Grid container spacing={2} sx={{ my: 2 }}>
              <Grid item xs={12} md={12}>
                {/* <Grid item xs={12} md={6} marginTop={2}> */}
                <Typography
                  variant="titleStyle"
                  sx={{ fontSize: "14px" }}
                  className="typography textfield-label bukra"
                // mt={0.5}
                // mb={0.5}
                >
                  Work Permission
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />


              </Grid>
            </Grid>
            <Grid container md={5.75} spacing={2} >
              <Grid item xs={12}>
                <DropDown
                  name={`athlete.${currentIndex}.workPermissionType`}
                  // name="athlete_role"
                  control={control}
                  label="Permission Type"
                  placeholder="Select Permission Type"
                  options={PermissionType}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>

            </Grid>
            <Grid container md={5.75} spacing={2} sx={{ marginLeft: 5 }}>
              <Grid item xs={6}>
                <TrainingCampCustomDatePicker
                  control={control}
                  name={`athlete.${currentIndex}.workPermissionStartDate`}
                  label="From Date"
                  boxmb={0.8}
                  // required={true}
                  defaultValue={null}
                  minDate={moment()}
                  // maxDate={
                  //   campEndDate
                  //     ? moment(campEndDate).add(1, "day")
                  //     : moment().add(10, "years")
                  // }
                  className="Text-field-customise"
                  disabled={true}
                // rules={{
                //   required: "From Date is required",
                // }}
                />
              </Grid>
              <Grid item xs={6}>
                <TrainingCampCustomDatePicker
                  control={control}
                  name={`athlete.${currentIndex}.workPermissionEndDate`}
                  label="To Date"
                  boxmb={0.8}
                  // required={true}
                  defaultValue={null}
                  minDate={moment()}
                  disabled={true}
                  // maxDate={
                  //   campEndDate
                  //     ? moment(campEndDate).add(1, "day")
                  //     : moment().add(10, "years")
                  // }
                  className="Text-field-customise"
                // rules={{
                //   required: "From Date is required",
                // }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ my: 1 }}>
              <Grid item xs={12} md={6} >
                <CustomTextField
                  name={`athlete.${currentIndex}.workPermissionNotes`}
                  // name="behavioral_aspects_omment"
                  control={control}
                  label="Notes"
                  textarea={true}
                  placeholder={"Enter Notes"}
                  rules={{
                    // required: "Notes is required",
                    pattern: {
                      value: /^[a-zA-Z0-9\s.-]+$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 300,
                      message: "Notes cannot exceed 300 characters",
                    },
                  }}
                  disabled={true}
                />
              </Grid>


            </Grid>


            <Box
              sx={{ display: 'flex', gap: 1, mt: 4, mb: 4, justifyContent: 'flex-end', width: '100%', }}
            >
              <Button
                onClick={() => setCurrentIndex(null)}
                variant="outlined"
                color="secondary"
                className="text-capitalize dubai-med"
                sx={{ height: "48px", fontSize: "16px", px: 2 }}

              >
                Cancel
              </Button>
              <Button
                // type="submit"
                variant="contained"
                color="primary"
                className="text-capitalize dubai-med"
                // disabled={singleUpload.loading}
                sx={{ height: "48px", fontSize: "16px", px: 2 }}
                // onClick={handleUpdateAthlete}
                onClick={() => handleUpdateAthlete(index, field)}
              >
                Update Athlete
              </Button>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };
  const StaffForm: React.FC<any> = ({
    field,
    index,
    // currentIndex,
    // control,
  }) => {
    if (index !== currentIndex) return null; // Render only the selected index

    return (
      <>
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
            // marginTop:20
          }}
        >
          <Grid container spacing={2}   >
            <Grid container spacing={2} sx={{ mb: 2, mt: 2 }}>
              <Grid item xs={12} md={6} rowSpacing={4}>
                <DropDown
                  // name="athlete_name"
                  name={`staff.${staffCurrentIndex}.staffID`}
                  control={control}
                  label="Staff"
                  placeholder="Select Staff"
                  options={staffDataOption && staffDataOption}
                  variant="outlined"
                  required={true}
                  disabled={true}
                  rules={{
                    required: "Staff is required",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DropDown
                  name={`staff.${staffCurrentIndex}.staff_rank`}
                  // name="athlete_rank"
                  control={control}
                  label="Rank"
                  placeholder="Select Rank"
                  options={NationalityOption && NationalityOption}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Rank is required",
                // }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <DropDown
                  name={`staff.${staffCurrentIndex}.staff_department`}
                  // name="athlete_department"
                  control={control}
                  label="Department"
                  placeholder="Select Department"
                  options={DeparatmentOptions && DeparatmentOptions}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DropDown
                  name={`staff.${staffCurrentIndex}.staff_role`}
                  // name="athlete_category"
                  control={control}
                  label="Role"
                  placeholder="Select Role"
                  options={rolesOptions && rolesOptions}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                {/* <Grid item xs={12} md={6} marginTop={2}> */}
                <Typography
                  variant="titleStyle"
                  sx={{ fontSize: "14px" }}
                  className="typography textfield-label bukra"
                // mt={0.5}
                // mb={0.5}
                >
                  Health /Medical Test
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />


              </Grid>
              <Grid item xs={12} md={6}>
                {/* <Grid item xs={12} md={6} marginTop={2}> */}
                <Typography
                  variant="titleStyle"
                  sx={{ fontSize: "14px" }}
                  className="typography textfield-label bukra"
                // mt={0.5}
                // mb={0.5}
                >
                  Last Performance Test
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

              </Grid>

            </Grid>
            <Grid container md={5.75} spacing={2}>
              <Grid item xs={6}>
                <TrainingCampCustomDatePicker
                  control={control}
                  name={`athlete.${currentIndex}.medicalTestDate`}
                  label="Date"
                  boxmb={0.8}
                  // required={true}
                  defaultValue={null}
                  minDate={moment()}
                  disabled={true}
                  // maxDate={
                  //   campEndDate
                  //     ? moment(campEndDate).add(1, "day")
                  //     : moment().add(10, "years")
                  // }
                  className="Text-field-customise"
                // rules={{
                //   required: "Start Date is required",
                // }}
                />
              </Grid>
              <Grid item xs={6}>
                <DropDown
                  name={`athlete.${currentIndex}.medicalTestStatus`}
                  // name="athlete_role"
                  control={control}
                  label="Status"
                  placeholder="Select Status"
                  options={StatusOptions}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>
              <Grid item xs={12}>
                <DropDown
                  name={`athlete.${currentIndex}.medicalPerformanceLevel`}
                  // name="athlete_role"
                  control={control}
                  label="Performance Level (1 To 3)"
                  placeholder="Select Performance Level"
                  options={levelTableOptions}
                  variant="outlined"
                  disabled={true}
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
              </Grid>
            </Grid>
            <Grid container md={5.75} spacing={2} sx={{ marginLeft: 5 }}>
              <Grid item xs={6}>
                <TrainingCampCustomDatePicker
                  control={control}
                  name={`athlete.${currentIndex}.performanceTestDate`}
                  label="Date"
                  boxmb={0.8}
                  // required={true}
                  defaultValue={null}
                  minDate={moment()}
                  disabled={true}
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
                <CustomTextField
                  name={`athlete.${currentIndex}.performanceTestResult`}
                  label="Result"
                  placeholder="Enter New Result"
                  control={control}
                  disabled={true}
                  // required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z /]*$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 100,
                      message: "Result Name cannot exceed 100 characters",
                    },
                    // required: "Result is required",
                  }}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <CustomTextField
                  name={`athlete.${currentIndex}.performanceExpectedResult`}
                  label="Result Expected"
                  placeholder="Enter Expected Result"
                  control={control}
                  // required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z /]*$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 100,
                      message: "Result Name cannot exceed 100 characters",
                    },
                    // required: "Result is required",
                  }}
                />
              </Grid> */}
              <Grid item xs={12} md={12}>
                {/* <Grid item xs={12} md={6} marginTop={2}> */}
                <Typography
                  variant="titleStyle"
                  sx={{ fontSize: "14px" }}
                  className="typography textfield-label bukra"
                // mt={0.5}
                // mb={0.5}
                >
                  Expiry Date of Official Docs
                </Typography>
                <Divider sx={{ marginBottom: 2 }} />

              </Grid>

              <Grid container md={12} spacing={2} marginLeft={0}>

                <Grid item xs={6}>
                  <TrainingCampCustomDatePicker
                    control={control}
                    name={`athlete.${currentIndex}.medicalTestDate`}
                    label="Passport"
                    boxmb={0.8}
                    // required={true}
                    defaultValue={null}
                    minDate={moment()}
                    disabled={true}
                    // maxDate={
                    //   campEndDate
                    //     ? moment(campEndDate).add(1, "day")
                    //     : moment().add(10, "years")
                    // }
                    className="Text-field-customise"
                  // rules={{
                  //   required: "Start Date is required",
                  // }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TrainingCampCustomDatePicker
                    control={control}
                    name={`athlete.${currentIndex}.medicalTestDate`}
                    label="Sports Licence"
                    boxmb={0.8}
                    // required={true}
                    defaultValue={null}
                    minDate={moment()}
                    disabled={true}
                    // maxDate={
                    //   campEndDate
                    //     ? moment(campEndDate).add(1, "day")
                    //     : moment().add(10, "years")
                    // }
                    className="Text-field-customise"
                  // rules={{
                  //   required: "Start Date is required",
                  // }}
                  />
                </Grid>

              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name={`staff.${staffCurrentIndex}.participationNotes`}
                  // name="performance_aspects_comment"
                  control={control}
                  label="Notes"
                  textarea={true}
                  placeholder={"Enter Notes"}
                  disabled={true}
                  rules={{
                    // required: "Notes is required",
                    pattern: {
                      value: /^[a-zA-Z0-9\s.-]+$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 300,
                      message: "Notes cannot exceed 300 characters",
                    },
                  }}
                />
              </Grid>

            </Grid>
            <Box
              sx={{ display: 'flex', gap: 1, mt: 4, mb: 4, justifyContent: 'flex-end', width: '100%', }}
            >
              <Button
                onClick={() => setStaffCurrentIndex(null)}
                variant="outlined"
                color="secondary"
                className="text-capitalize dubai-med"
                sx={{ height: "48px", fontSize: "16px", px: 2 }}

              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className="text-capitalize dubai-med"
                // disabled={singleUpload.loading}
                sx={{ height: "48px", fontSize: "16px", px: 2 }}
                // onClick={handleUpdateStaff}
                onClick={() => handleUpdateAthlete(index, field)}
              >
                Update Staff
              </Button>
            </Box>
          </Grid>
        </Grid>
      </>
    );
  };

  const RenderForm = useMemo(() => {
    return currentField ? (
      <AthleteForm key={currentIndex} field={currentField}
        index={currentIndex}
        control={control}
      />
    ) : null;
  }, [currentField, currentIndex, control]);
  const RenderStaffForm = useMemo(() => {
    return staffCurrentField ? (
      <StaffForm field={staffCurrentField} index={currentIndex} />
    ) : null;
  }, [staffCurrentField, staffCurrentIndex]);
  console.log({ trainingUpdateData });

  useEffect(() => {
    if (
      (trainingUpdateData &&
        trainingUpdateData.code === 200 &&
        trainingUpdateData.status === "succeeded")
      ||
      (trainindAddData &&
        trainindAddData.code === 200 &&
        trainindAddData.status === "succeeded")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      // setActiveStep(1)
      dispatch(clearAddState());
      dispatch(clearUpdateState());

    } else if (

      (trainingUpdateData &&
        trainingUpdateData.code === 500 &&
        trainingUpdateData.status === "failed") ||
      (trainingUpdateData &&
        trainingUpdateData.status === "failed")
      ||
      (trainindAddData &&
        trainindAddData.code === 500 &&
        trainindAddData.status === "failed") ||
      (trainindAddData &&
        trainindAddData.status === "failed")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearAddState());
      dispatch(clearUpdateState());
    }
  }, [trainingUpdateData, trainindAddData]);

  const handleDelete = () => {
    if (deleteIndex !== null) {
      remove(deleteIndex);
    }
    if (staffDeleteIndex !== null) {
      removeStaff(staffDeleteIndex);
    }
    setDeleteOpen(false)
  }

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
                    ? `Athlete & Staff Details  "Update" 
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
                          // onClick={handleCampImage}
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
                        // onClick={handleCampImage}
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
                        Camp Details
                      </Typography>
                    </Grid>

                    <Grid item xs={12} md={12}
                      marginBottom={2}
                    >
                      <Divider />
                    </Grid>
                    <Grid item xs={12} md={6}>

                      <CustomTextField
                        name="campName"
                        label="Camp Name"
                        placeholder="Enter New Camp Name"
                        control={control}
                        // required={true}
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
                    <Grid container item xs={12} md={6} spacing={2}>
                      <Grid item xs={6}>
                        <TrainingCampCustomDatePicker
                          control={control}
                          name="campStartDate"
                          label="Start Date"
                          boxmb={0.8}
                          required={true}
                          defaultValue={null}
                          // minDate={moment()}
                          // maxDate={
                          //   campEndDate
                          //     ? moment(campEndDate).add(1, "day")
                          //     : moment().add(10, "years")
                          // }
                          className="Text-field-customise"
                        // rules={{
                        //   required: "Start Date is required",
                        // }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TrainingCampCustomDatePicker
                          control={control}
                          name="campEndDate"
                          label="End Date"
                          boxmb={0.8}
                          required={true}
                          defaultValue={null}
                          // minDate={minEndDate}
                          // disabled={!minEndDate.isValid()}
                          // maxDate={moment().add(10, "years")}
                          className="Text-field-customise"
                        // rules={
                        //   !minEndDate.isValid()
                        //     ? { required: "" }
                        //     : { required: "End Date is required" }
                        // }
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <DropDown
                        name="country"
                        control={control}
                        label="Counrtry"
                        placeholder="Select Country"
                        options={NationalityOption && NationalityOption}
                        variant="outlined"
                        required={true}
                        rules={{
                          required: "Country is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
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






                    <Grid item xs={12} md={12} sx={{

                    }} >
                      <Box
                        sx={{
                          border: "1px solid #E0E0E0", borderRadius: "8px",
                          width: "103%",
                          paddingX: 2,
                          marginLeft: -2



                        }}
                      >
                        <Box py={2} borderBottom={"1px solid #E0E0E0"} minWidth={'103%'}
                          marginBottom={2}
                          marginLeft={'-17px !important'}
                        >
                          <Typography className="typography textfield-label bukra"
                            sx={{
                              marginLeft: '18px !important'
                            }}
                          >
                            ATHLETES PARTICIPATING IN THE TRANING CAMP
                          </Typography>
                        </Box>
                        <Box marginY={2}>
                          {!isEmpty(athletes) && athletes[0].athleteID !== '' &&
                            <TeamsTable
                              headers={[
                                "No",
                                "Name",
                                "Department",
                                "Indv. Result in numbers",
                                "Injury Status",
                                "Actions",
                              ]}
                              module="athlete"
                              data={athletes}
                              // data={mergedAthletes}

                              setEdit={setCurrentIndex}
                              RenderForm={RenderForm}
                              currentIndex={currentIndex}
                              isSetOpen={() => setDeleteOpen(true)}
                              isLoading={false}
                              setDeleteIndex={setDeleteIndex}
                            />
                          }
                        </Box>
                      </Box>

                    </Grid>
                    <Grid item xs={12} md={12} sx={{

                    }} >
                      <Box
                        sx={{
                          border: "1px solid #E0E0E0", borderRadius: "8px",
                          width: "103%",
                          paddingX: 2,
                          marginLeft: -2



                        }}
                      >
                        <Box py={2} borderBottom={"1px solid #E0E0E0"} minWidth={'103%'}
                          marginBottom={2}
                          marginLeft={'-17px !important'}
                        >
                          <Typography className="typography textfield-label bukra"
                            sx={{
                              marginLeft: '18px !important'
                            }}
                          >
                            STAFF PARTICIPATING IN THE COMPETITION
                          </Typography>
                        </Box>
                        <Box marginY={2}>
                          {!isEmpty(staffs) && staffs[0].staffId !== '' &&
                            <TeamsTable
                              headers={[
                                "No",
                                "Name",
                                "Department",
                                "Role",
                                "Actions",
                              ]}
                              module="staff"
                              // data={mergedStaff}
                              data={staffs}
                              setEdit={setStaffCurrentIndex}
                              RenderForm={RenderStaffForm}
                              currentIndex={staffCurrentIndex}
                              // remove={removeStaff}
                              isLoading={false}
                              setDeleteIndex={setStaffDeleteIndex}

                              isSetOpen={() => setDeleteOpen(true)}


                            />
                          }
                        </Box>

                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {/* <CustomTextField
                        name="mainLongTermGoals"
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
                      /> */}
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
                    <Grid item xs={12} md={6}>
                      {/* <CustomTextField
                        name="mainShortTermGoals"
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
                      /> */}
                      <FormWithSunEditor
                        name="mainShortTermGoals"
                        control={control}
                        minHeight={"200px"}
                        label="Main Short-Term Goals Of The Team (Current Season)"
                        rules={{
                          required:
                            "Main Short-Term Goals Of The Team (Current Season) is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {/* <CustomTextField
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
                      /> */}
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
                    <Grid item xs={12} md={6}>
                      {/* <CustomTextField
                        name="reasonsForRequestingCamp"
                        control={control}
                        label="Reasons for requesting the training camp (objectives)"
                        textarea={true}
                        placeholder={"To prepare the team for upcoming competitions and improve team coordination."}
                        rules={{
                          required: "Reasons for requesting the training camp (objectives) is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Reasons for requesting the training camp (objectives) cannot exceed 300 characters",
                          },
                        }}
                      /> */}
                      <FormWithSunEditor
                        name="reasonsForRequestingCamp"
                        control={control}
                        minHeight={"200px"}
                        label="Reasons for requesting the training camp (objectives)"
                        rules={{
                          required:
                            "Reasons for requesting the training camp (objectives) is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={12}>
                      {/* <Grid item xs={12} md={6} marginTop={2}> */}
                      <Typography
                        variant="titleStyle"
                        sx={{ fontSize: "14px" }}
                        className="typography textfield-label bukra"
                      // mt={0.5}
                      // mb={0.5}
                      >
                        Competition(s) the team will participate during the camp
                      </Typography>
                      <Divider sx={{ marginBottom: 2 }} />

                    </Grid>
                    <Grid item xs={12} md={6}>

                      <CustomTextField
                        name="competitionName"
                        label="Name"
                        placeholder="Enter New Name"
                        control={control}
                        // required={true}
                        rules={{
                          pattern: {
                            value: /^[a-zA-Z0-9() /]*$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message: "Name cannot exceed 100 characters",
                          },
                          // required: "Competition Name is required",
                        }}
                      />
                    </Grid>
                    <Grid container item xs={12} md={6} spacing={2}>
                      <Grid item xs={6}>
                        <TrainingCampCustomDatePicker
                          control={control}
                          name="competitionStartDate"
                          label="Start Date"
                          boxmb={0.8}
                          // required={true}
                          defaultValue={null}
                          // minDate={moment()}
                          // maxDate={
                          //   campEndDate
                          //     ? moment(campEndDate).add(1, "day")
                          //     : moment().add(10, "years")
                          // }
                          className="Text-field-customise"
                        // rules={{
                        //   required: "Start Date is required",
                        // }}
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <TrainingCampCustomDatePicker
                          control={control}
                          name="competitionEndDate"
                          label="End Date"
                          boxmb={0.8}
                          // required={true}
                          defaultValue={null}
                          // minDate={minEndDate}
                          // disabled={!minEndDate.isValid()}
                          // maxDate={moment().add(10, "years")}
                          className="Text-field-customise"
                        // rules={
                        //   !minEndDate.isValid()
                        //     ? { required: "" }
                        //     : { required: "End Date is required" }
                        // }
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      {/* <CustomTextField
                        name="otherActivities"
                        control={control}
                        label="Other activities planned for training camp"
                        textarea={true}
                        placeholder={"Team-building exercises, strategy workshops, and public relations training."}
                        rules={{
                          required: "Other activities planned for training camp is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "Other activities planned for training camp cannot exceed 300 characters",
                          },
                        }}
                      /> */}
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
                      gap: 1
                    }}
                  >
                    {!showCancelButton && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        // sx={{ mr: 1 }}
                        onClick={closeAdd
                        }
                        // onClick={() => {
                        //   if (edit) {
                        //     onClose();
                        //   } else {
                        //     closeAdd();
                        //   }
                        // }}
                        sx={{ fontSize: "16px", weight: 500, paddingX: 2 }}
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
      <DeleteDialog
        open={isDeleteOpen}
        setOpen={setDeleteOpen}
        isDelete={handleDelete}
      />
    </>
  );
};
export default AthleteStaffDetails;
