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
import { getDefaultOptions, getLocalStorage } from "@/utils/helper";
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
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";


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
  const [imageData, setImageData] = useState<any>({
    ProfileImage: "",
  });
  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        athlete:'',
        athlete_rank:'',
        athlete_department:'',
        category:'',
        athlete_role:'',
        final_general_ranking:'',
        final_category_ranking:'',
        individual_result:0,
        total_participants:0,
        injury_status:'no',
        performance_aspects:'',
        behavioral_aspects:'',
        seasonal_ranking:'',
        staff:'',
        staff_rank:'',
        staff_department:'',
        staff_role:'',
        staff_notes:'',

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

  const onSubmit = (data: any) => {
    console.log({data});
    setActiveStep(2)
    // const payload: any = {
    //   sportID: Number(teamID),
    //   loggedUserID: 1,
    //   campName: data?.campName,
    //   campStartDate: dayjs(data?.campStartDate).format("DD/MM/YYYY"),
    //   campEndDate: dayjs(data?.campEndDate).format("DD/MM/YYYY"),
    //   country: String(data?.country),
    //   city: data?.city,
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
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

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
    if (!isEmpty(parsedData.StrategyDetails)) {
      setDialogOpen(true);
    } else {
      router.push(`/teams/${teamID}/reports`);
    }
  };






  const handleChange = (file: any) => {
    if (file) {
      // setValue("uploadDocuments", "");
      const fileName = file.name.toLowerCase();
      const uploadedFileSize = file.size;
      const fileSizeLimit = 25 * 1024 * 1024;
      console.log({file,fileName});
      
      if (fileName.endsWith(".jfif")) {
        setSnackbarOpen(true);
        setSnackbarStatus("error");
      } else {
        if (uploadedFileSize < fileSizeLimit) {
          setFormData({ ...formData, file: file });
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
console.log({uploadDocuments});

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
                    ? `Training Camp ${
                        trainingCampID ? "Update" : "Added"
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
                  
                    <Grid item xs={12} md={12} marginTop={2}>
                    <Typography
            variant="titleStyle"
            sx={{ fontSize: "14px" }}
            className="typography textfield-label bukra"
            // mt={0.5}
            // mb={0.5}
          >
           INDIVIDUAL RESULTS OF THE ATHLETES PARTICIPATING IN THE COMPETITION
          </Typography>
                    </Grid>
                 
                    <Grid item xs={12} md={12} 
                    marginBottom={2}
                    >
                    <Divider/>
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    
                    <DropDown
                        name="athlete"
                        control={control}
                        label="Athlete"
                        placeholder="Select Athlete"
                        options={athleteDataOption && athleteDataOption}
                        multiple={false}
                        variant="outlined"
                        required={true}
                        rules={{
                          required: "Athlete is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    
                    <DropDown
                        name="athlete_rank"
                        control={control}
                        label="Rank"
                        placeholder="Select Rank"
                        options={NationalityOption && NationalityOption}
                        multiple={false}
                        variant="outlined"
                        // required={true}
                  
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    
                    <DropDown
                        name="athlete_department"
                        control={control}
                        label="Department"
                        placeholder="Select Department"
                        options={NationalityOption && NationalityOption}
                        multiple={false}
                        variant="outlined"
                        // required={true}
                  
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    
                    <DropDown
                        name="category"
                        control={control}
                        label="Category"
                        placeholder="Select Category"
                        options={NationalityOption && NationalityOption}
                        multiple={false}
                        variant="outlined"
                        // required={true}
                  
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    
                    <DropDown
                        name="athlete_role"
                        control={control}
                        label="Role"
                        placeholder="Select Role"
                        options={NationalityOption && NationalityOption}
                        multiple={false}
                        variant="outlined"
                        // required={true}
                  
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    
                
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="final_general_ranking"
                        label="Final General Ranking"
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
                            message: "Final General Ranking cannot exceed 100 characters",
                          },
                        //   required: "Final General Ranking is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="final_category_ranking"
                        label="Final Category Ranking"
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
                            message: "Final Category Ranking cannot exceed 100 characters",
                          },
                        //   required: "Final Category Ranking is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="individual_result"
                        label="Indv. Result in numbers"
                        placeholder="Enter Indv. Result in numbers"
                        control={control}
                        // required={true}
                        rules={{
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message: "Indv. Result in numbers cannot exceed 100 characters",
                          },
                        //   required: "Final Category Ranking is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                      <CustomTextField
                        name="total_participants"
                        label="No. Total participants at the competition"
                        placeholder="Enter No. Total participants at the competition"
                        control={control}
                        // required={true}
                        rules={{
                          pattern: {
                            value: /^[0-9]+$/,
                            message: "Invalid Format",
                          },
                          maxLength: {
                            value: 100,
                            message: "No. Total participants at the competition cannot exceed 100 characters",
                          },
                        //   required: "Final Category Ranking is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    <CustomRadioGroup
          name="injury_status"
          control={control}
          label="Injury Status"
          options={[
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
            // { value: "other", label: "Other" },
          ]}          
        />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    <CustomTextField
          name="performance_aspects"
          control={control}
          label="Performance aspects Comment"
          textarea={true}
          placeholder={"Enter Comments of the coach/ team manager on performance aspects"}
          rules={{
            required: "Performance aspects Comment is required",
            pattern: {
              value: /^[a-zA-Z0-9\s.-]+$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 300,
              message: "Performance aspects Comment cannot exceed 300 characters",
            },
          }}
        />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    <CustomTextField
          name="behavioral_aspects"
          control={control}
          label="Behavioral aspects Comment"
          textarea={true}
          placeholder={"Enter Comments of the coach/ team manager on behavioral aspects"}
          rules={{
            required: "Behavioral aspects Comment is required",
            pattern: {
              value: /^[a-zA-Z0-9\s.-]+$/,
              message: "Invalid Format",
            },
            maxLength: {
              value: 300,
              message: "Behavioral aspects Comment cannot exceed 300 characters",
            },
          }}
        />
         <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: 1,
          }}
        >
          <Button
            variant="outlined"
            className="text-capitalize"
            // onClick={handleAcadamicQualification}
            // disabled={academicQualificationData.loading}
            startIcon={<AddBoxOutlinedIcon />}
            style={{
              color: "rgba(0, 66, 106, 1)",
              borderColor: "rgba(0, 66, 106, 1)",
            }}
          >
            {"Add Athlete"}
            {/* {academicQualificationData.loading ? "Loading..." : "Add"} */}
          </Button>
        </Box>
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    <CustomTextField
          name="seasonal_ranking"
          control={control}
          label="General Seasonal Ranking (Post -Competition)"
          textarea={true}
          placeholder={"Enter GENERAL SEASONAL RANKING UPDATES (Post -Competition)"}
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
                    <Grid item xs={12} md={5.75}>
                   
        </Grid>
        <Grid item xs={12} md={12} marginTop={2}>
                    <Typography
            variant="titleStyle"
            sx={{ fontSize: "14px" }}
            className="typography textfield-label bukra"
            // mt={0.5}
            // mb={0.5}
          >
           STAFF PARTICIPATING IN THE COMPETITION
          </Typography>
                    </Grid>
                 
                    <Grid item xs={12} md={12} 
                    marginBottom={2}
                    >
                    <Divider/>
                    </Grid>
                   
                    <Grid item xs={12} md={5.75}>
                    
                    <DropDown
                        name="staff"
                        control={control}
                        label="Staff"
                        placeholder="Select Staff"
                        options={staffDataOption && staffDataOption}
                        multiple={false}
                        variant="outlined"
                        required={true}
                        rules={{
                          required: "Staff is required",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    
                    <DropDown
                        name="staff_rank"
                        control={control}
                        label="Rank"
                        placeholder="Select Rank"
                        options={NationalityOption && NationalityOption}
                        multiple={false}
                        variant="outlined"
                        // required={true}
                        // rules={{
                        //   required: "Rank is required",
                        // }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    
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
                    <Grid item xs={12} md={5.75}>
                    
                    <DropDown
                        name="staff_role"
                        control={control}
                        label="Role"
                        placeholder="Select Role"
                        options={NationalityOption && NationalityOption}
                        multiple={false}
                        variant="outlined"
                        // required={true}
                        // rules={{
                        //   required: "Role is required",
                        // }}
                      />
                    </Grid>
                    <Grid item xs={12} md={5.75}>
                    <CustomTextField
          name="staff_notes"
          control={control}
          label="Notes"
          textarea={true}
          placeholder={"Enter Comments of the coach/ team manager on performance aspects"}
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
         <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            marginTop: 1,
          }}
        >
          <Button
            variant="outlined"
            className="text-capitalize"
            // onClick={handleAcadamicQualification}
            // disabled={academicQualificationData.loading}
            startIcon={<AddBoxOutlinedIcon />}
            style={{
              color: "rgba(0, 66, 106, 1)",
              borderColor: "rgba(0, 66, 106, 1)",
            }}
          >
            {"Add Staff"}
            {/* {academicQualificationData.loading ? "Loading..." : "Add"} */}
          </Button>
        </Box>
                    </Grid>
                  </Grid>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginY: "1.5rem",
                  gap:1
                    }}
                  >
                    {!showCancelButton && (
                      <Button
                        variant="outlined"
                        color="secondary"
                        // sx={{ mr: 1 }}
                        onClick={
                            ()=> setActiveStep(0)
                          
                        }
                        // onClick={() => {
                        //   if (edit) {
                        //     onClose();
                        //   } else {
                        //     closeAdd();
                        //   }
                        // }}
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
                      sx={{ fontSize: "16px", weight: 500 }}
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
                      sx={{ fontSize: "16px", weight: 500 }}
                    >
                      {trainindAddData.loading ||
                      trainingUpdateData.loading ||
                      trainingCampEditData?.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : 'Update & Continue' }
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
export default AthleteStaffDetails;
