"use client";
import CustomSnackbar from "@/components/CustomSnackbar";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";
import { clearReportAddDataState, clearReportAddState } from "@/redux/slices/reports/reportAddSlice";
import { clearReportUpdateState, updateReport } from "@/redux/slices/reports/reportUpdateSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  DeparatmentOptions,
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
    trainingCampEditData,
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

        ]
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
  const trainingCampUpload = useSelector((state: any) => state.singleUpload);
  const trainingUpdateData = useSelector(
    (state: RootState) => state.updateTrainingCamp
  );
  const rolesListData = useSelector((state: RootState) => state.rolesList);
  const reportAddResponse = useSelector((state: RootState) => state.addReport);
  const reportUpdateResponse = useSelector((state: RootState) => state.updateReport);
  const RaceID = useSelector((state: RootState) => !state?.addReport?.error ? state?.addReport?.data?.reportId : null);
  const mergedAthletes = mergeAthletes(athletes, getAthleteList);
  const mergedStaff = mergeStaff(staffs, staffList);
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

  const onSubmit = (data: any) => {
    // const getRaceID = !isEmpty(reportUpdateResponse?.data) ? reportUpdateResponse?.data.reportId : RaceID
    const formattedData = athletes.map((item: Athlete) => ({
      ...item,
      medicalTestDate: formatDate(item.medicalTestDate),
      performanceTestDate: formatDate(item.performanceTestDate),
      workPermissionStartDate: formatDate(item.workPermissionStartDate),
      workPermissionEndDate: formatDate(item.workPermissionEndDate),
      createdAt: formatDate(item.createdAt),
      modifiedAt: formatDate(item.modifiedAt)
    }));
    const formattedStaffData = staffs.map((item: Staff) => ({
      ...item,
      medicalTestDate: formatDate(item.medicalTestDate),
      permissionDate: formatDate(item.permissionDate),

      createdAt: formatDate(item.createdAt),
      modifiedAt: formatDate(item.modifiedAt)
    }));

    const payload = {
      ...data,
      athlete: formattedData,
      staff: formattedStaffData,
      userId: 1
    }
    // setActiveStep(1)
    dispatch(updateReport({ url: `/Sports/${teamID}/Race/${reportID}/AthleteStaff`, payload: payload }));
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
        if (snackbarStatus !== 'error') {
          setActiveStep((prevStep: number) => prevStep + 1)
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
    const nationality: any = getDefaultOption(getNationality);
    setNationalityOption(nationality);
  }, [getNationality]);



  const closeAdd = () => {
    setDialogOpen(false);
    if (!isEmpty(parsedData.StrategyDetails)) {
      setDialogOpen(true);
    } else {
      router.push(`/teams/${teamID}/reports`);
    }
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


  useEffect(() => {
    console.log({ data }, '2 nd step');
    // const listData = data?.finalReport?.athlete && data?.finalReport?.staff ? data?.finalReport  : data?.planning?.athlete && data?.planning?.staff ?  data?.planning : null
    const listData = !isEmpty(data?.finalReport?.athlete?.list) && !isEmpty(data?.finalReport?.staff?.list) ? data?.finalReport : data?.planning?.athlete?.list && data?.planning?.staff?.list ? data?.planning : null
    console.log({ listData });

    // if(reportUpdateResponse.data?.athlete && reportUpdateResponse.data?.staff){

    //   setValue("athlete", reportUpdateResponse.data && reportUpdateResponse.data?.athlete?.list);
    //   setValue("staff", reportUpdateResponse.data && reportUpdateResponse.data?.staff?.list);
    // }
    if (reportUpdateResponse.data?.athlete && !isEmpty(reportUpdateResponse.data?.athlete?.list) && reportUpdateResponse.data?.staff && !isEmpty(reportUpdateResponse.data?.staff?.list)) {
      if (reportUpdateResponse.data?.athlete && !isEmpty(reportUpdateResponse.data?.athlete?.list)) {
        console.log({ reportUpdateResponse }, '/innnnnnnnnn');


        setValue("athlete", reportUpdateResponse.data && reportUpdateResponse.data?.athlete?.list);
      }
      if (reportUpdateResponse.data?.staff && !isEmpty(reportUpdateResponse.data?.staff?.list)) {
        console.log({ reportUpdateResponse }, '/stffffffffffffff');

        setValue("staff", reportUpdateResponse.data && reportUpdateResponse.data?.staff?.list);

      }
    }

    else if (!isEmpty(listData)) {

      setValue('athlete', listData?.athlete.list)
      setValue('staff', listData?.staff.list)
    }


  }, [reportAddResponse, reportUpdateResponse])

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
    setValue(`athlete.${currentIndex}.medicalTestDate`, moment(field.medicalTestDate));
    setValue(`athlete.${currentIndex}.performanceTestDate`, moment(field.performanceTestDate));
    setValue(`athlete.${currentIndex}.workPermissionStartDate`, moment(field.workPermissionStartDate));
    setValue(`athlete.${currentIndex}.workPermissionEndDate`, moment(field.workPermissionEndDate))
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
                  name={`athlete.${currentIndex}.athleteId`}
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
                />
              </Grid>
              <Grid item xs={12}>
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
              </Grid>
            </Grid>

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
                  name={`staff.${staffCurrentIndex}.staffId`}
                  control={control}
                  label="Staff"
                  placeholder="Select Athlete"
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
                <CustomTextField
                  name={`staff.${staffCurrentIndex}.participationNotes`}
                  // name="performance_aspects_comment"
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
  console.log(watch("athlete"), 'wwwwwwwwwwwwwwwwwwwwatchh');

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

  useEffect(() => {
    if (
      (reportUpdateResponse &&
        reportUpdateResponse.code === 200 &&
        reportUpdateResponse.status === "succeeded")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      // setActiveStep(1)
      dispatch(clearReportAddState());
      dispatch(clearReportAddDataState());
      dispatch(clearReportUpdateState());

    } else if (

      (reportUpdateResponse &&
        reportUpdateResponse.code === 500 &&
        reportUpdateResponse.status === "failed") ||
      (reportUpdateResponse &&
        reportUpdateResponse.status === "failed")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearReportAddState());
      dispatch(clearReportAddDataState());
      dispatch(clearReportUpdateState());
    }
  }, [reportUpdateResponse]);

  const handleDelete = () => {
    if (deleteIndex !== null) {
      remove(deleteIndex);
    }
    if (staffDeleteIndex !== null) {
      removeStaff(staffDeleteIndex);
    }
    setDeleteOpen(false)
  }

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
                    ? `Race Report Athlete & Staff Details Updated 
                    Successfully!`
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
                            INDIVIDUAL RESULTS OF THE ATHLETES PARTICIPATING IN THE COMPETITION
                          </Typography>
                        </Box>
                        <Box marginY={2}>
                          {!isEmpty(getAthleteList) && !isEmpty(athletes) && athletes[0].athleteId !== '' &&
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
                              data={mergedAthletes}

                              setEdit={setCurrentIndex}
                              RenderForm={RenderForm}
                              currentIndex={currentIndex}
                              isSetOpen={() => setDeleteOpen(true)}
                              isLoading={false}
                              setDeleteIndex={setDeleteIndex}
                              before={'before'}
                            />
                          }
                        </Box>
                      </Box>

                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTextField
                        name="generalSeasonalRanking"
                        control={control}
                        label="General Seasonal Ranking (Post -Competition)"
                        textarea={true}
                        placeholder={"Enter Comments of the coach/ team manager on performance aspects"}
                        rules={{
                          // required: "General Seasonal Ranking (Post -Competition) is required",
                          pattern: {
                            value: /^[a-zA-Z0-9\s.-]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 300,
                            message: "General Seasonal Ranking (Post -Competition) cannot exceed 300 characters",
                          },
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
                            STAFF PARTICIPATING IN THE COMPETITION
                          </Typography>
                        </Box>
                        <Box marginY={2}>
                          {!isEmpty(staffList) && !isEmpty(staffs) && staffs[0].staffId !== '' &&
                            <TeamsTable
                              headers={[
                                "No",
                                "Name",
                                "Department",
                                "Role",
                                "Actions",
                              ]}
                              module="staff"
                              data={mergedStaff}
                              setEdit={setStaffCurrentIndex}
                              RenderForm={RenderStaffForm}
                              currentIndex={staffCurrentIndex}
                              // remove={removeStaff}
                              isLoading={false}
                              setDeleteIndex={setStaffDeleteIndex}

                              isSetOpen={() => setDeleteOpen(true)}
                              before={'before'}


                            />
                          }
                        </Box>
                        {/* <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} md={6}>

                            <DropDown
                              name="staffId"
                              control={control}
                              label="Staff"
                              placeholder="Select Staff"
                              options={NationalityOption && NationalityOption}
                              multiple={false}
                              variant="outlined"
                              required={true}
                              rules={{
                                required: "Staff is required",
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>

                            <DropDown
                              name="staff_rank"
                              control={control}
                              label="Rank"
                              placeholder="Select Rank"
                              options={NationalityOption && NationalityOption}
                              multiple={false}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} md={6}>

                            <DropDown
                              name="staff_department"
                              control={control}
                              label="Department"
                              placeholder="Select Department"
                              options={NationalityOption && NationalityOption}
                              multiple={false}
                              variant="outlined"
                            // required={true}
                            // rules={{
                            //   required: "Department is required",
                            // }}
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>

                            <DropDown
                              name="staff_role"
                              control={control}
                              label="Role"
                              placeholder="Select Role"
                              options={NationalityOption && NationalityOption}
                              multiple={false}
                              variant="outlined"
                            />
                          </Grid>
                        </Grid>
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} md={6}>
                            <CustomTextField
                              name="staff_notes"
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
                            />
                          </Grid>
                        </Grid>
                        <Box
                          sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4, mb: 4 }}
                        >
                          <Button
                            // onClick={handleClose}
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

                          >
                            Add Staff
                          </Button>
                        </Box> */}
                      </Box>
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
                        onClick={() =>
                          setActiveStep((prevStep: number) => prevStep - 1)

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
                        Back
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
