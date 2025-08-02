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
  DROPZONE_IMAGE_FLAG,
  DROPZONE_IMAGE_NAME_TYPES,
  FILE_FORMAT_TYPE,
  levelOptions,
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
import AthleteStaffTeamTable from "../../tables/AthleteStaffTeamTable";
import DeleteDialog from "@/components/DeleteDialog";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import { getAthleteID } from "@/redux/slices/athlete/getAthleteIDSlice";
import dayjs from "dayjs";
import StaticFoodImage from "../../../../../public/staticFoodImage.svg";
import FileUpload from "@/utils/dropzone";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

interface AthleteFormProps {
  field: any; // Use correct type if available
  index: number;
  // currentIndex: number;
  // control: any;
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
  medicalTestDate:string,
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
    reportID
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
  const[isDeleteOpen,setDeleteOpen] = useState(false);
  const [athleteArray,setAthleteArray] = useState<Athlete[]>([])
  const [staffArray,setStaffArray] = useState<Staff[]>([])
  console.log({ currentIndex }, '=============');

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
            performanceExpectedResult: "check",
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
  const athletesID = watch("athlete[0].athleteId");
console.log({athletesID,athleteArray});

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
  const reportUpdateResponse = useSelector((state: RootState) => state.updateReport);
  // const RaceID = useSelector((state: RootState) => !state?.addReport?.error ? state?.addReport?.data?.reportId : null);
  const raceID = useSelector((state: RootState) => !state?.updateReport?.error  ? state?.updateReport?.data?.raceId : null);
  console.log({raceID});
  
  
  const mergedAthletes = mergeAthletes(athleteArray, getAthleteList);
  function mergeAthletes(athleteSelect:any, athleteList:any) {
    return !isEmpty(athleteSelect) && athleteSelect.map((athlete:any) => {
      // Find matching athlete in AthleteList
      const matchedAthlete = !isEmpty(athleteList) && athleteList.find((a:any) => a.athleteID === athlete.athleteId);

      // Merge only if found, otherwise keep existing values
      return {
        ...athlete,
        athlete_name: matchedAthlete && `${matchedAthlete.rank} ${matchedAthlete.firstName} ${matchedAthlete.middleName} ${matchedAthlete.surName}`,
        avatar: matchedAthlete?.profileImage || null, // Keep null if avatar is missing
      };
    });
  };
  console.log({staffArray, staffList});
  
  const mergedStaffData = mergeStaff(staffArray, staffList);
  function mergeStaff(staffSelect:any, List:any) {
    console.log({staffSelect,List});
    
    return !isEmpty(staffSelect) && staffSelect.map((staff:any) => {
      // Find matching staff in AthleteList
      const matchedStaff = !isEmpty(List) && List.find((a:any) => a.staffID === staff.staffId);

      // Merge only if found, otherwise keep existing values
      return {
        ...staff,
        athlete_name: matchedStaff && `${matchedStaff.rank} ${matchedStaff.firstName} ${matchedStaff.middleName} ${matchedStaff.surName}`,
        avatar: matchedStaff?.profileImage || null, // Keep null if avatar is missing
      };
    });
  };
  // const mergedStaff = mergeStaff(staffs, staffList);
  // const currentField = fields[currentIndex] || null;
  // const staffCurrentField = fields[staffCurrentIndex] || null;

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

  
  const formatDate = (dateStr:string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date.toISOString().split('T')[0];
  };


  const onSubmit = (data: any) => {
    // const getRaceID = !isEmpty(reportUpdateResponse?.data) ? reportUpdateResponse?.data.reportId : RaceID
    console.log({ data, raceID }, 'dataaaaaaaa 1st step data');
    const formattedData = athleteArray.map(item => ({
      ...item,
      medicalTestDate: formatDate(item.medicalTestDate),
      performanceTestDate: formatDate(item.performanceTestDate),
      workPermissionStartDate: formatDate(item.workPermissionStartDate),
      workPermissionEndDate: formatDate(item.workPermissionEndDate),
      createdAt: formatDate(item.createdAt),
      modifiedAt: formatDate(item.modifiedAt)
    }));
    const formattedStaffData = staffArray.map(item => ({
      ...item,
      medicalTestDate: formatDate(item.medicalTestDate),
      permissionDate: formatDate(item.permissionDate),
  
      createdAt: formatDate(item.createdAt),
      modifiedAt: formatDate(item.modifiedAt)
    }));
  
    const payload = {
      ...data,
      athlete:formattedData,
      staff:formattedStaffData,
      userId:1
    }
    // setActiveStep(1)
    dispatch(updateReport({ url: `/Sports/${teamID}/Race/${raceID}/AthleteStaff`, payload: payload }));
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
        if(snackbarStatus !=='error'){
          setActiveStep((prevStep:number)=> prevStep +1)
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







  // function mergeAthletes(athleteSelect, athleteList) {
  //   return athleteSelect.map((athlete) => {
  //     // Find matching athlete in AthleteList
  //     const matchedAthlete = !isEmpty(athleteList) && athleteList.find((a) => a.athleteID === athlete.athleteId);
  //     console.log({ matchedAthlete });

  //     // Merge only if found, otherwise keep existing values
  //     return {
  //       ...athlete,
  //       athlete_name: matchedAthlete && `${matchedAthlete.rank} ${matchedAthlete.firstName} ${matchedAthlete.middleName} ${matchedAthlete.surName}`,
  //       avatar: matchedAthlete?.profileImage || null, // Keep null if avatar is missing
  //     };
  //   });
  // };
  // function mergeStaff(staffSelect, staffList) {

  //   return staffSelect.map((staff) => {
  //     // Find matching staff in AthleteList
  //     const matchedAthlete = !isEmpty(staffList) && staffList.find((a) => a.staffID === staff.staffId);
  //     console.log({ matchedAthlete });

  //     // Merge only if found, otherwise keep existing values
  //     return {
  //       ...staff,
  //       athlete_name: matchedAthlete && `${matchedAthlete.rank} ${matchedAthlete.firstName} ${matchedAthlete.middleName} ${matchedAthlete.surName}`,
  //       avatar: matchedAthlete?.profileImage || null, // Keep null if avatar is missing
  //     };
  //   });
  // };
  // console.log(mergeAthletes(athletes,getAthleteList),'mergggggggggg');


console.log({athleteArray});

  const handleUpdateAthlete = () => {
    console.log({ athletes }, 'rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
    if (athletes.length > 0) {
    setAthleteArray((prevAthletes:any) => [
      ...prevAthletes, // Keep existing athletes
      {
        athleteId: athletes[0].athleteId, // New athlete data
        medicalTestDate:  dayjs(athletes[0]?.medicalTestDate).format("YYYY-MM-DD"),
        // medicalTestDate: athletes[0].medicalTestDate,
        medicalTestStatus: athletes[0].medicalTestStatus,
        medicalPerformanceLevel: athletes[0].medicalPerformanceLevel,
        performanceTestDate:  dayjs(athletes[0]?.performanceTestDate).format("YYYY-MM-DD"),
        performanceTestResult: athletes[0].performanceTestResult,
        performanceExpectedResult: athletes[0].performanceExpectedResult,
        workPermissionType: athletes[0].workPermissionType,
        workPermissionStartDate:  dayjs(athletes[0]?.workPermissionStartDate).format("YYYY-MM-DD"),
        workPermissionEndDate:  dayjs(athletes[0]?.workPermissionEndDate).format("YYYY-MM-DD"),
        workPermissionNotes: athletes[0].workPermissionNotes
      }
    ]);
  }
    // reset({
    //   athlete: [] // Reset athlete array to empty
    // });

  };
console.log({staffArray});


  const handleUpdateStaff = () => {
    setStaffArray((prevStaff:any) => [
      ...prevStaff, // Keep existing athletes
      {
        staffId: staffs[0].staffId, // New athlete data
        medicalTestDate: dayjs(staffs[0]?.medicalTestDate).format("YYYY-MM-DD"),
        medicalTestStatus: staffs[0].medicalTestStatus,
        medicalTestNotes: staffs[0].medicalTestNotes,
        permissionType: staffs[0].permissionType,
        permissionDate: dayjs(staffs[0]?.permissionDate).format("YYYY-MM-DD"),
        permissionResult: staffs[0].permissionResult,
      }
    ]);

    // reset({
    //   staff: [] // Reset athlete array to empty
    // });
  };


//   const ParentComponent = () => {
//   const handleSubmit = useCallback(() => console.log("Submitted"), []);
//   return <AthleteForm onSubmit={handleSubmit} />;
// };
const AthleteForm: React.FC<any> = ({
  // field,
  // index,
  // currentIndex,
  // control,
}) => {
  // if (index !== currentIndex) return null; // Render only the selected index

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
                name={`athlete[0].athleteId`}
                control={control}
                label="Athlete"
                placeholder="Select Athlete"
                options={athleteDataOption && athleteDataOption}
                variant="outlined"
                required={true}
                rules={{
                  required: "Athlete is required",
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DropDown
                name={`athlete[0].athlete_rank`}
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
                name={`athlete[0].athlete_department`}
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
                name={`athlete[0].athlete_category`}
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
                name={`athlete[0].athlete_role`}
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
        <Divider sx={{marginBottom:2}} />
  

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
        <Divider sx={{marginBottom:2}} />
   
            </Grid>
        
          </Grid>
          <Grid container   md={5.75} spacing={2}>
                    <Grid item xs={6}>
                      <TrainingCampCustomDatePicker
                        control={control}
                        name={`athlete[0].medicalTestDate`}
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
                name={`athlete[0].medicalTestStatus`}
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
                name={`athlete[0].medicalPerformanceLevel`}
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
          <Grid container   md={5.75} spacing={2} sx={{marginLeft:5}}>
                    <Grid item xs={6}>
                      <TrainingCampCustomDatePicker
                        control={control}
                        name="athlete[0].performanceTestDate"
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
                      name="athlete[0].performanceTestResult"
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
                      name="athlete[0].performanceExpectedResult"
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

                  <Grid container spacing={2} sx={{ my:2}}>
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
        <Divider sx={{marginBottom:2}} />
  

            </Grid>
            </Grid>
            <Grid container   md={5.75} spacing={2} >
            <Grid item xs={12}>
                    <DropDown
                name={`athlete[0].workPermissionType`}
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
              <Grid container   md={5.75} spacing={2} sx={{marginLeft:5}}>
                    <Grid item xs={6}>
                      <TrainingCampCustomDatePicker
                        control={control}
                        name="athlete[0].workPermissionStartDate"
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
                        name="athlete[0].workPermissionEndDate"
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
                    
          <Grid container spacing={2} sx={{ my:1}}>
            <Grid item xs={12} md={6} >
              <CustomTextField
                name={`athlete[0].workPermissionNotes`}
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
              onClick={handleUpdateAthlete}
            // onClick={()=>handleUpdateAthlete(index,field)}
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
    // field,
    // index,
    // currentIndex,
    // control,
  }) => {
    // if (index !== currentIndex) return null; // Render only the selected index

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
                  name={`staff[0].staffId`}
                  control={control}
                  label="Staff"
                  placeholder="Select Staff"
                  options={staffDataOption && staffDataOption}
                  variant="outlined"
                  required={true}
                  // disabled={true}
                  rules={{
                    required: "Staff is required",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DropDown
                  name={`staff[0].staff_rank`}
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
                  name={`staff[0].staff_department`}
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
                  name={`staff[0].staff_role`}
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


            {/* <Grid container spacing={2} sx={{ mb: 2 }}>
       
              

            </Grid> */}
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
          <Divider sx={{marginBottom:2}} />
    
  
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
         Expirt Date of Officals Docs
          </Typography>
          <Divider sx={{marginBottom:2}} />
     
              </Grid>
              <Grid container   md={5.75} spacing={2} marginLeft={0.2}>
                      <Grid item xs={6}>
                        <TrainingCampCustomDatePicker
                          control={control}
                          name="staff[0].medicalTestDate"
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
                  name={`staff[0].medicalTestStatus`}
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
                      <CustomTextField
                  name={`staff[0].medicalTestNotes`}
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
              <Grid container   md={5.75} spacing={2} marginLeft={2} >
              <Grid item xs={12}>
                      <DropDown
                  name={`staff[0].permissionType`}
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
                      
                      <Grid item xs={6}>
                        <TrainingCampCustomDatePicker
                          control={control}
                          name="staff[0].permissionDate"
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
                  name={`staff[0].permissionResult`}
                  // name="athlete_role"
                  control={control}
                  label="Status"
                  placeholder="Select Status"
                  options={rolesOptions && rolesOptions}
                  variant="outlined"
                // required={true}
                // rules={{
                //   required: "Deparatment is required",
                // }}
                />
                      </Grid>
                 
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
                // type="submit"
                variant="contained"
                color="primary"
                className="text-capitalize dubai-med"
                // disabled={singleUpload.loading}
                sx={{ height: "48px", fontSize: "16px", px: 2 }}
                onClick={handleUpdateStaff}
              // onClick={()=>handleUpdateAthlete(index,field)}
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
    return (
      <AthleteForm />
    )
  }, [athleteDataOption]);
  // const RenderStaffForm = useMemo(() => {
  //   return staffCurrentField ? (
  //     <StaffForm key={staffCurrentField.id} field={staffCurrentField} index={currentIndex} />
  //   ) : null;
  // }, [staffCurrentField, staffCurrentIndex]);

  useEffect(() => {
    const athlete = athleteArray.find(a => a.athleteId === currentIndex);
    console.log({athlete},'========');
    
    if (athlete) {
      Object.entries(athlete).forEach(([key, value]) => {
        console.log({key,value},'key,valuekey,valuekey,value');
        setValue("athlete[0].athleteId", athlete.athleteId);
        setValue("athlete[0].medicalTestDate", moment(athlete.medicalTestDate));
        setValue("athlete[0].medicalTestStatus", athlete.medicalTestStatus);
        setValue("athlete[0].medicalPerformanceLevel", athlete.medicalPerformanceLevel);
        setValue("athlete[0].performanceTestDate", moment(athlete.performanceTestDate));
        setValue("athlete[0].performanceTestResult", athlete.performanceTestResult);
        setValue("athlete[0].performanceExpectedResult", athlete.performanceExpectedResult);
        setValue("athlete[0].workPermissionType", athlete.workPermissionType);
        setValue("athlete[0].workPermissionStartDate", moment(athlete.workPermissionStartDate));
        setValue("athlete[0].workPermissionEndDate", moment(athlete.workPermissionEndDate));
        setValue("athlete[0].workPermissionNotes", athlete.workPermissionNotes);
      });
    }
  }, [currentIndex, setValue]);

  useEffect(()=>{
    console.log({athletesID});
    
if(athletesID && typeof athletesID === 'number' && athletesID !== 0){
     const payload: any = {
            athleteID: Number(athletesID),
            sportID: Number(teamID),
            loggedUserID: 1,
          };
          dispatch(getAthleteID(payload));
}
  },[athletesID])

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


  useEffect(()=>{
     if(!isEmpty(reportUpdateResponse?.data)){
   console.log({reportUpdateResponse});
   if(reportUpdateResponse.data?.athlete && !isEmpty(reportUpdateResponse.data?.athlete?.list)){

    //  setValue("athlete", reportUpdateResponse.data && reportUpdateResponse.data?.athlete.list);
    setAthleteArray(reportUpdateResponse.data?.athlete.list)
   }
   if(reportUpdateResponse.data?.staff &&  !isEmpty(reportUpdateResponse.data?.staff?.list)){
    setStaffArray(reportUpdateResponse.data?.staff.list)
   }
    }
 
    },[reportUpdateResponse])

const handleDelete = ()=>{
  if (deleteIndex !== null) {
    console.log({deleteIndex},'===========sdsd');
    
    // remove(deleteIndex);
    setAthleteArray(prev => prev.filter(item => Number(item.athleteId) !== deleteIndex));
    
  }
  else if(staffDeleteIndex !== null) {
    console.log({staffDeleteIndex},'===========sdsd');
    
    // remove(staffDeleteIndex);
    setStaffArray(prev => prev.filter(item => Number(item.staffId) !== staffDeleteIndex));
    
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
                          required: "Camp Name Name is required",
                        }}
                        // disabled={true}                 
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
                          defaultValue={null}
                          // defaultValue={campDefaultStartDate}
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
                            ATHLETES PARTICIPATING IN THE Training Camp
                          </Typography>
                        </Box>
                        <Box marginY={2}>
                          {!isEmpty(getAthleteList) && !isEmpty(athleteArray) && athleteArray[0].athleteId !== '' &&
                            <AthleteStaffTeamTable
                              headers={[
                                "No",
                                "Name",
                                "Role",
                                "Performance Level",
                                "Permission Type",
                                "Actions",
                              ]}
                              module="athlete"
                              data={mergedAthletes}
                              setEdit={setCurrentIndex}
                              currentIndex={currentIndex}
                              isSetOpen={()=>setDeleteOpen(true)}
                              setDeleteIndex={setDeleteIndex}
                            />
                          }
                       <AthleteForm />
                       {/* {RenderForm} */}
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
                        {!isEmpty(staffList) && !isEmpty(staffArray) && staffArray[0].staffId !== '' &&
                            <AthleteStaffTeamTable
                              headers={[
                                "No",
                                "Name",
                                "Role",
                                "Permission Type",
                                "Actions",
                              ]}
                              module="staff"
                              data={mergedStaffData}
                              setEdit={setStaffCurrentIndex}
                              // setEdit={setCurrentIndex}
                              currentIndex={staffCurrentIndex}
                              isSetOpen={()=>setDeleteOpen(true)}
                              setDeleteIndex={setStaffDeleteIndex}
                            />
                          }
                        <StaffForm/>
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
                          setActiveStep((prev:number)=> prev -1)

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
