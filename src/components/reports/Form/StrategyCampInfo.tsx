"use client";
import CustomSnackbar from "@/components/CustomSnackbar";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";
import { addReport, clearReportAddDataState, clearReportAddState } from "@/redux/slices/reports/reportAddSlice";
import { clearAllReportUpdateState, clearReportUpdateState, updateReport } from "@/redux/slices/reports/reportUpdateSlice";
import { AppDispatch, RootState } from "@/redux/store";
import {
  DeparatmentOptions,
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
  SportCategory
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
import TeamsTable from "../teamsTable";
import DeleteDialog from "@/components/DeleteDialog";
import StaticFoodImage from "../../../../public/staticFoodImage.svg";
import FileUploadField from "@/components/Fields/FileUploadField";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import FileUpload from "@/utils/dropzone";
import FormWithSunEditor from "@/components/useFormSunEditor";
import dayjs from "dayjs";

interface AthleteFormProps {
  field: any; // Use correct type if available
  index: number | null;
  // currentIndex: number;
  // control: any;
}

const StrategyCampInfo = (props: any) => {
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
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  console.log({ currentIndex });

  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [staffCurrentIndex, setStaffCurrentIndex] = useState(null);

  const [imageData, setImageData] = useState<any>({
    ProfileImage: "",
  });


  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        campName: 'Test dev',
        startDate: null,
        endDate: null,
        country: '',
        city: '',
        longTermGoal: "",
        shortTermGoal: "",
        mainStrategy: "",
        campReason: "",
        athlete: [{
          athleteId: '',
          athlete_rank: "",
          athlete_department: "",
          athlete_category: "",
          athlete_role: "",
          finalGeneralRanking: "",
          finalCategoryRanking: "",
          individualResult: 0,
          totalParticipants: 10,
          injuryStatus: false,
          performanceComment: "",
          behavioralComment: "",
        }],
        staff: [
          {
            staffId: "",
            staff_rank: "",
            staff_department: "",
            staff_role: "",
            notes: "",
          },
        ],
        generalSeasonalRanking: "",
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
  const campDefaultStartDate = !isEmpty(reportAddResponse?.data) ? moment(reportAddResponse.data?.trainingCamp?.startDate) : !isEmpty(reportUpdateResponse?.data) ? moment(reportUpdateResponse?.data?.trainingCamp.startDate) : null;
  const campDefaultEndDate = !isEmpty(reportAddResponse?.data) ? moment(reportAddResponse.data?.trainingCamp?.endDate) : !isEmpty(reportUpdateResponse?.data) ? moment(reportUpdateResponse?.data?.trainingCamp.endDate) : null;
  const handleCampImage = () => {
    if (externalClubCertificateRef.current) {
      externalClubCertificateRef.current.click();
    }
  };

  const getDefaultOption = (NationalityList: any) => {
    const defaultOptions = [];
    for (const item in NationalityList) {
      defaultOptions.push({
        label: NationalityList[item].countryName,
        value: NationalityList[item].countryName,
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
          finalCategoryRanking: "",
          individualResult: 0,
          totalParticipants: 10,
          injuryStatus: false,
          performanceComment: "",
          behavioralComment: "",
        }],
        staff: [
          {
            staffId: "",
            staff_rank: "",
            staff_department: "",
            staff_role: "",
            notes: "",
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



  const onSubmit = (formData: any) => {

    const formattedData = athletes.map((item: any) => ({
      ...item,
      injuryStatus: item.injuryStatus === 'yes' ? 1 : 0,
      finalGeneralRanking: item.finalGeneralRanking ? item.finalGeneralRanking : '',
      finalCategoryRanking: item.finalCategoryRanking ? item.finalCategoryRanking : '',
      individualResult: item.individualResult ? item.individualResult : '',
      totalParticipants: item.totalParticipants ? Number(item.totalParticipants) : 0,
      performanceComment: item.performanceComment ? item.performanceComment : '',
      behavioralComment: item.behavioralComment ? item.behavioralComment : '',

    }));
    const formattedStaffData = staffs.map((item: any) => ({
      ...item,
    }));
    console.log({ formattedData, athletes });


    const payload = {
      ...formData,
      athlete: formattedData,
      staff: formattedStaffData,
      startDate: dayjs(formData?.startDate).format("YYYY-MM-DD"),
      endDate: dayjs(formData?.endDate).format("YYYY-MM-DD"),
      userId: 1
    }

    // const payload ={
    //      ...formData,
    //      startDate:moment(formData.startDate).utc().format(),
    //      endDate:moment(formData.endDate).utc().format(),
    //    }
    if (data?.finalReport?.reportId) {
      const getRaceID = data?.finalReport?.reportId
      dispatch(updateReport({ url: `/Reports/${teamID}/TrainingCamp/${reportID}/${getRaceID}`, payload: payload }));
      dispatch(clearReportAddDataState());
    }
    else {
      dispatch(addReport({ url: `/Reports/${teamID}/TrainingCamp/${reportID}`, payload: payload }));
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
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
        if (snackbarStatus !== 'error') {
          setActiveStep((prev: number) => prev + 1)
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
    dispatch(clearReportAddDataState())
    dispatch(clearAllReportUpdateState())
    router.push(`/teams/${teamID}/reports`);

  };







  function mergeAthletes(athleteSelect: any, athleteList: any) {
    return !isEmpty(athleteSelect) && athleteSelect.map((athlete: any) => {
      // Find matching athlete in AthleteList
      const matchedAthlete = !isEmpty(athleteList) && athleteList.find((a: any) => a.athleteID === athlete.athleteId);

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

      // Merge only if found, otherwise keep existing values
      return {
        ...staff,
        athlete_name: matchedAthlete && `${matchedAthlete.rank} ${matchedAthlete.firstName} ${matchedAthlete.middleName} ${matchedAthlete.surName}`,
        avatar: matchedAthlete?.profileImage || null, // Keep null if avatar is missing
      };
    });
  };

  // useEffect(() => {
  //   const fetchAthleteData = async () => {
  //     // Simulated API response
  //     const apiResponse = [
  //       {
  //         athleteId: 281,
  //         athlete_rank: "1",
  //         athlete_department: "IT",
  //         athlete_category: "Elite",
  //         athlete_role: "Runner",
  //         finalGeneralRanking: "Gold",
  //         finalCategoryRanking: "1st",
  //         individualResult: "9.58s",
  //         totalParticipants: "8",
  //         injuryStatus: 0,
  //         performanceComment: "Excellent sprint finish.",
  //         behavioralComment: "Great teamwork and attitude.",
  //       },
  //       {
  //         athleteId: 254,
  //         athlete_rank: "5",
  //         athlete_department: "Police Headquater",
  //         athlete_category: "Junior",
  //         athlete_role: "Swimmer",
  //         finalGeneralRanking: "Silver",
  //         finalCategoryRanking: "2nd",
  //         individualResult: "52.0s",
  //         totalParticipants: "10",
  //         injuryStatus: 1,
  //         performanceComment: "Strong endurance but needs better turns.",
  //         behavioralComment: "Highly motivated and disciplined.",
  //       },
  //       {
  //         athleteId: 270,
  //         athlete_rank: "5",
  //         athlete_department: "Head Officer",
  //         athlete_category: "Amature",
  //         athlete_role: "Swimmer",
  //         finalGeneralRanking: "Silver",
  //         finalCategoryRanking: "2nd",
  //         individualResult: "52.0s",
  //         totalParticipants: "10",
  //         injuryStatus: 1,
  //         performanceComment: "Strong endurance but needs better turns.",
  //         behavioralComment: "Highly motivated and disciplined.",
  //       },
  //       {
  //         athleteId: 263,
  //         athlete_rank: "2",
  //         athlete_department: "Police Headquater",
  //         athlete_category: "Junior",
  //         athlete_role: "Swimmer",
  //         finalGeneralRanking: "Silver",
  //         finalCategoryRanking: "2nd",
  //         individualResult: "52.0s",
  //         totalParticipants: "10",
  //         injuryStatus: 0,
  //         performanceComment: "Strong endurance but needs better turns.",
  //         behavioralComment: "Highly motivated and disciplined.",
  //       },
  //     ]
  //     const staffApiResponse = [
  //         {
  //           staffId: 38,
  //           staff_department: "Police",
  //           staff_role: "Team Admin Staff",
  //           staff_rank: 'Sergeant',
  //           notes: 'Test dev'
  //         },
  //         {
  //           staffId: 28,
  //           staff_department: "IT",
  //           staff_role: 'Volunteer',
  //           staff_rank: 'General',
  //           notes: 'Test dev2'
  //         },

  //       ]


  //     reset({ athlete: apiResponse, staff: staffApiResponse });
  //   };
  //   console.log('is caledddddddddddddddddd==================================================================================dddddddd');

  //   fetchAthleteData();
  // }, [reset]);

  const handleUpdateAthlete = (index: any, updatedData: any) => {
    if (index !== null) {

      update(index, updatedData);
    }
    setCurrentIndex(null)
  };
  const handleUpdateStaff = (index: any, updatedData: any) => {
    console.log({ updatedData, index }, 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
    if (index !== null) {

      updateStaff(index, updatedData);
    }
    setStaffCurrentIndex(null)
  };

  const AthleteForm: React.FC<AthleteFormProps> = ({
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
              <Grid item xs={12} md={6}>

                <CustomTextField
                  // {...field}
                  name={`athlete.${currentIndex}.finalGeneralRanking`}
                  // name="final_general_ranking"
                  label="Final General Ranking"
                  placeholder="Enter New Final General Ranking"
                  control={control}
                  // required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z0-9 /]*$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 100,
                      message: "Final General Ranking cannot exceed 100 characters",
                    },
                    // required: "Final General Ranking is required",
                  }}

                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>

                <CustomTextField
                  name={`athlete.${currentIndex}.finalCategoryRanking`}
                  // name="finalCategoryRanking"
                  label="Final Category Ranking"
                  placeholder="Enter New Final Category Ranking"
                  control={control}
                  // required={true}
                  rules={{
                    required: "Final Category Ranking is required",
                    pattern: {
                      value: /^[a-zA-Z\u0600-\u06FF\s]+$/,
                      message: "Only letters and spaces are allowed",
                    },
                    maxLength: {
                      value: 50,
                      message: "Final Category Ranking cannot exceed 50 characters",
                    },
                  }}

                />
              </Grid>
              <Grid item xs={12} md={6}>

                <CustomTextField
                  name={`athlete.${currentIndex}.individualResult`}
                  // name="individualResult"
                  label="Indv. Result in Numbers"
                  placeholder="Enter Indv. Result in numbers"
                  control={control}
                  // required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z0-9 /]*$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 100,
                      message: "Indv. Result in Numbers cannot exceed 100 characters"
                    },
                    // required: "Final Category Ranking is required",
                  }}

                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>

                <CustomTextField
                  name={`athlete.${currentIndex}.totalParticipants`}
                  // name="totalParticipants"
                  label="no. Total Participants at the Competition"
                  placeholder="Enter no. Total Participants at the Competition"
                  control={control}
                  // required={true}
                  rules={{
                    pattern: {
                      value: /^[a-zA-Z0-9() /]*$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 100,
                      message: "no. Total Participants at the Competition cannot exceed 100 characters",
                    },
                    // required: "Final Category Ranking is required",
                  }}

                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomRadioGroup
                  name={`athlete.${currentIndex}.injuryStatus`}
                  // name="injuryStatus"
                  control={control}
                  label="Injury"
                  options={[
                    { value: 'yes', label: "Yes" },
                    { value: 'no', label: "No" },
                  ]}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name={`athlete.${currentIndex}.behavioralComment`}
                  // name="behavioral_aspects_omment"
                  control={control}
                  label="Comment of the Coach/Team Manager on Behavioral Aspects"
                  textarea={true}
                  placeholder={"Comment of the coach/team manager on behavioral aspects"}
                  rules={{
                    // required: "Comment of the Coach/Team Manager on Behavioral Aspects is required",
                    pattern: {
                      value: /^[a-zA-Z0-9\s.-]+$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 300,
                      message: "Comment of the Coach/Team Manager on Behavioral Aspects cannot exceed 300 characters",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <CustomTextField
                  name={`athlete.${currentIndex}.performanceComment`}
                  // name="performanceComment"
                  control={control}
                  label="Coach's Feedback on Performance During Training Camp"
                  textarea={true}
                  placeholder={"Comment of the coach on performance aspects achieved during the training camp"}
                  rules={{
                    // required: "Coach's Feedback on Performance During Training Camp is required",
                    pattern: {
                      value: /^[a-zA-Z0-9\s.-]+$/,
                      message: "Invalid Format",
                    },
                    maxLength: {
                      value: 300,
                      message: "Coach's Feedback on Performance During Training Camp cannot exceed 300 characters",
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
                type="submit"
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
                  name={`staff.${staffCurrentIndex}.notes`}
                  // name="performanceComment"
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
                onClick={() => handleUpdateStaff(index, field)}
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
    return currentField !== null ? (
      <AthleteForm key={currentIndex} field={currentField} index={currentIndex} />
    ) : null;
  }, [currentField, currentIndex]);
  const RenderStaffForm = useMemo(() => {
    return staffCurrentField ? (
      <StaffForm key={currentIndex} field={staffCurrentField} index={currentIndex} />
    ) : null;
  }, [staffCurrentField, staffCurrentIndex]);

  useEffect(() => {
    if (
      ((reportAddResponse &&
        reportAddResponse.code === 200 &&
        reportAddResponse.status === "succeeded") ||
        reportUpdateResponse &&
        reportUpdateResponse.code === 200 &&
        reportUpdateResponse.status === "succeeded")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      // setActiveStep(1)
      dispatch(clearReportAddState());
      // dispatch(clearReportAddDataState());
      dispatch(clearReportUpdateState());

    } else if (
      (reportAddResponse &&
        reportAddResponse.code === 500 &&
        reportAddResponse.status === "failed") ||
      (reportUpdateResponse &&
        reportUpdateResponse.code === 500 &&
        reportUpdateResponse.status === "failed") ||
      (reportUpdateResponse &&
        reportUpdateResponse.status === "failed")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearReportAddState());
      // dispatch(clearReportAddDataState());
      dispatch(clearReportUpdateState());
    }
  }, [reportUpdateResponse, reportAddResponse]);

  useEffect(() => {
    console.log({ data });

    if (!isEmpty(reportAddResponse?.data?.trainingCamp)
    ) {
      console.log({ reportAddResponse }, '/innnnnnnnnn');

      setValue("campName", reportAddResponse.data && reportAddResponse.data?.trainingCamp?.campName);
      setValue("startDate", reportAddResponse.data && moment(reportAddResponse.data?.trainingCamp?.startDate));
      setValue("endDate", reportAddResponse.data && moment(reportAddResponse.data.trainingCamp.endDate));
      setValue("country", reportAddResponse.data && reportAddResponse.data?.trainingCamp?.country);
      setValue("city", reportAddResponse.data && reportAddResponse.data?.trainingCamp?.city);
      setValue("longTermGoal", reportAddResponse.data && reportAddResponse.data?.trainingCamp?.longTermGoal);
      setValue("shortTermGoal", reportAddResponse.data && reportAddResponse.data?.trainingCamp?.shortTermGoal);
      setValue("mainStrategy", reportAddResponse.data && reportAddResponse.data?.trainingCamp?.mainStrategy);
      setValue("campReason", reportAddResponse.data && reportAddResponse.data?.trainingCamp?.campReason);
      setValue("athlete", reportAddResponse.data && reportAddResponse.data?.athlete);
      setValue("staff", reportAddResponse.data && reportAddResponse.data?.staff);
    }
    else if (!isEmpty(reportUpdateResponse?.data?.trainingCamp)) {
      setValue("campName", reportUpdateResponse.data && reportUpdateResponse.data?.trainingCamp?.campName);
      setValue("startDate", reportUpdateResponse.data && reportUpdateResponse.data?.trainingCamp?.startDate);
      setValue("endDate", reportUpdateResponse.data && moment(reportUpdateResponse.data.trainingCamp.endDate));
      setValue("country", reportUpdateResponse.data && reportUpdateResponse.data?.trainingCamp?.country);
      setValue("city", reportUpdateResponse.data && reportUpdateResponse.data?.trainingCamp?.city);
      setValue("longTermGoal", reportUpdateResponse.data && reportUpdateResponse.data?.trainingCamp?.longTermGoal);
      setValue("shortTermGoal", reportUpdateResponse.data && reportUpdateResponse.data?.trainingCamp?.shortTermGoal);
      setValue("mainStrategy", reportUpdateResponse.data && reportUpdateResponse.data?.trainingCamp?.mainStrategy);
      setValue("campReason", reportUpdateResponse.data && reportUpdateResponse.data?.trainingCamp?.campReason);
      setValue("athlete", reportUpdateResponse.data && reportUpdateResponse.data?.athlete);
      setValue("staff", reportUpdateResponse.data && reportUpdateResponse.data?.staff);
    }

    else if (!isEmpty(data?.planning?.trainingCamp)) {
      setValue("campName", data?.planning?.trainingCamp && data?.planning?.trainingCamp?.campName);
      setValue("startDate", data?.planning?.trainingCamp && moment(data?.planning?.trainingCamp?.startDate));
      setValue("endDate", data?.planning?.trainingCamp && moment(data?.planning?.trainingCamp.endDate));
      setValue("country", data?.planning?.trainingCamp && data?.planning?.trainingCamp?.country);
      setValue("city", data?.planning?.trainingCamp && data?.planning?.trainingCamp?.city);
      setValue("longTermGoal", data?.planning?.trainingCamp && data?.planning?.trainingCamp?.longTermGoal);
      setValue("shortTermGoal", data?.planning?.trainingCamp && data?.planning?.trainingCamp?.shortTermGoal);
      setValue("mainStrategy", data?.planning?.trainingCamp && data?.planning?.trainingCamp?.mainStrategy);
      setValue("campReason", data?.planning?.trainingCamp && data?.planning?.competition?.campReason);
      setValue('athlete', data?.planning?.athlete)
      setValue('staff', data?.planning?.staff)
    }


  }, [reportAddResponse, reportUpdateResponse])

  const handleDelete = () => {
    if (deleteIndex !== null) {

      remove(deleteIndex)
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
                          // required: "Competition Name is required",
                        }}
                        disabled={true}
                      />
                    </Grid>
                    <Grid container item xs={12} md={6} spacing={2}>
                      <Grid item xs={6}>
                        <TrainingCampCustomDatePicker
                          control={control}
                          name="startDate"
                          label="Start Date"
                          boxmb={0.8}
                          required={true}
                          defaultValue={campDefaultStartDate}
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
                          name="endDate"
                          label="End Date"
                          boxmb={0.8}
                          required={true}
                          defaultValue={campDefaultEndDate}
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
                              // data={athletes}
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
                    {/* <Grid item xs={12} md={6}>
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
                    </Grid> */}
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
                            STAFF PARTICIPATING IN THE TRANING CAMP
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
                              setDeleteIndex={setDeleteIndex}
                              before={'before'}
                            />
                          }
                        </Box>

                      </Box>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      {/* <CustomTextField
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
                      /> */}
                      <FormWithSunEditor
                        name="longTermGoal"
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
                      /> */}
                      <FormWithSunEditor
                        name="shortTermGoal"
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
                        name="campReason"
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
                        name="campReason"
                        control={control}
                        minHeight={"200px"}
                        label="Reasons for requesting the training camp (objectives)"
                        rules={{
                          required:
                            "Reasons for requesting the training camp (objectives) is required",
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
export default StrategyCampInfo;
