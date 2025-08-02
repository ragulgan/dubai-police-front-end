"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  TextField,
  Button,
  Typography,
  styled,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  MenuItem,
  Select,
  Divider,
  InputAdornment,
  OutlinedInput,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";
import moment from "moment";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import { useForm } from "react-hook-form";
import { REGEX } from "@/utils/constants";
import CustomSnackbar from "@/components/CustomSnackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import { getTestName, trimFormData } from "@/utils/helper";
import TextSunEditor from "@/components/SunEditor";
import CustomTimePicker from "@/components/Fields/CustomTimePicker";
import { getSportsListAPI } from "@/redux/slices/sportsMenu/getSportsListSlice";
import { FileUploader } from "react-drag-drop-files";
import Uploadtravel from "../../../../public/travelUpload.svg";
import {
  singleFileUpload,
  clearState,
} from "@/redux/slices/fileupload/singleFileUpload";
import AppAlertDialog from "@/components/AppAlertDialog";
import ReactSelect from "@/components/Fields/ReactSelect";
import { getAthleteListAPI } from "@/redux/slices/athlete/getAthleteListSlice";
import {
  AnotherTestFormValidation,
  MedicalOnlyFormValidation,
  MedicalsFormValidation,
} from "@/utils/testAndMedicals/validation";
import {
  addTestAndMedicalChecks,
  clearTestAndMedical,
} from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksAddSlice";
import DeleteDialog from "@/components/dialogs/DeleteDialog";
import {
  addAcademicQualification,
  clearAddAcademicState,
} from "@/redux/slices/athlete/athleteAcademicQualification";
import {
  DeleteAcademicQualificationByID,
  clearAcademicQualificationDeleteState,
} from "@/redux/slices/athlete/deleteAcademicQualification";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import { editTestAndMedicalChecks } from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksEditSlice";
import { viewTestAndMedicalChecks } from "@/redux/slices/testAndMedicalChecks/TestAndMedicalChecksListSlice";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { getMedicalTestKpiList } from "@/redux/slices/kpi/GetMedicalTestKpiList";

const CustomTextField = styled(TextField)(({ theme }) => ({
  height: "40px",
  borderRadius: "4px 0px 0px 0px",
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#00875508",
    "& fieldset": {
      borderColor: "#40a377",
    },
    "&:hover fieldset": {
      borderColor: "#40a377",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#40a377",
    },
  },
  "& input": {
    fontFamily: "Roboto",
    paddingLeft: "10px",
    color: "#000000",
    height: "8px",
  },
  "& input::placeholder": {
    color: "#8D9093",
    opacity: 1,
  },
  "& .Mui-error": {
    "& fieldset": {
      borderColor: "red",
    },
  },
}));

const TestAndMedicalChecks = (props: any) => {
  const {
    id,
    onClose,
    testType,
    editTestAndMedicalsData,
    cancelDialog,
    setCancelDialog,
    module,
    isEditSportId,
    clearEditData,
  } = props;
  const { control, setValue } = useForm({
    defaultValues: {
      testTime: null,
    },
  });
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const addTestAndMedicalChecksData = useSelector(
    (state: RootState) => state.addTestAndMedicalChecks
  );
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const fileTypes = ["JPG", "PNG", "pdf", "doc", "docx"];
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<any>({
    athleteName: "",
    dob: "",
    height: "",
    weight: "",
    heightUnit: "CM",
    weightUnit: "KG",
    sports: "",
    injuryHistory: "",
    testDate: "",
    testTime: "",
    testName: "",
    kpiName: "",
    kpiPoint: "",
    location: "",
    conductingStaff: "",
    testResult: "",
    medicalClearanceStatus: "",
    recoveryPlan: "",
    comments: "",
    unitOfMeasurement: "",
    customUnitOfMeasurement: "",
  });
  const [errors, setErrors] = useState<any>({});
  const [showBanner, setShowBanner] = useState(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>();
  const [fileName, setFileName] = useState("");
  const currentNav = usePathname();
  const teamId = currentNav?.split("/")[2];
  const { validate } = MedicalsFormValidation(formData, setErrors);
  const { validateTest } = AnotherTestFormValidation(formData, setErrors);
  const { validateMedicalOnly } = MedicalOnlyFormValidation(
    formData,
    setErrors
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const sportId: any = urlParams.get("sportID");
  const [AthletesOption, setAthletesOption] = useState<any>();
  const [SelectedAthletesOption, setSelectedAthletesOption] = useState<any>("");
  const getAthleteList = useSelector((state: any) => state.getAthleteList);
  const [SportsOption, setSportsOption] = useState<any>();
  const [SelectedSportsOption, setSelectedSportsOption] = useState<any>("");
  const [navigate, setNavigate] = useState(false);
  const [edit, setEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [selectedSport, setSelectedSport] = useState<any>([]);
  const [kpiOption, setkpiOption] = useState<any>([]);
  const [editId, setEditId] = useState(false);
  const [isAddAnotherTest, setIsAddAnotherTest] = useState(false);
  const testPointOption = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
  ];
  const anotherTestData = useSelector(
    (state: RootState) => state.addAcademicQualification
  );
  const deleteAcademicQualificationData = useSelector(
    (state: RootState) => state.deleteAcademicQualification
  );
  const getMedicalTestKpi = useSelector(
    (state: RootState) => state.GetMedicalTestKpiList
  );
  const [fileShow, setFileShow] = useState(false);
  const [updateTestID, setUpdateTestId] = useState("");

  useEffect(() => {
    if (isEmpty(SelectedSportsOption)) {
      setSelectedSportsOption([0]);
    }
  }, [SelectedSportsOption]);

  useEffect(() => {
    const payload: any = {};
    dispatch(
      getMedicalTestKpiList({ url: "/GetMedicalTestKpiList", payload: payload })
    );
  }, []);

  useEffect(() => {
    const payloads = {
      searchText: "",
      filteredBy: "",
      paginationCount: 0,
      paginationIndex: 0,
      sportID: Number(teamId) || selectedSport.join(","),
    };
    dispatch(getAthleteListAPI(payloads));
  }, [teamId, selectedSport]);

  useEffect(() => {
    const payload = {
      searchText: "",
    };
    dispatch(getSportsListAPI(payload));
  }, []);

  useEffect(() => {
    if (id) {
      setEdit(true);
    }
  }, [id]);

  useEffect(() => {
    if (cancelDialog) {
      setDialogOpen(true);
    }
  }, [cancelDialog]);

  const KpiData = getMedicalTestKpi && getMedicalTestKpi?.data;

  useEffect(() => {
    const medicalTestKpiName: any = getDefaultOption(KpiData);
    setkpiOption(medicalTestKpiName);
  }, [getMedicalTestKpi]);

  const getDefaultOption = (KpiDataList: any) => {
    const defaultOptions = [];
    for (const item in KpiDataList) {
      defaultOptions.push({
        label: KpiDataList[item].kpiName,
        value: String(KpiDataList[item].kpiID),
      });
    }
    return defaultOptions;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const dateChange = (data: any) => {
    setFormData({ ...formData, [data.name]: data.value });
    setErrors({
      ...errors,
      [data.name]: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNavigate(true);
    setIsAddAnotherTest(false);
    if (errors.file) {
      return;
    }
    const validationErrors =
      editTestAndMedicalsData &&
        editTestAndMedicalsData?.anotherTestList.length > 0
        ? validateMedicalOnly()
        : validate();
    setErrors(validationErrors);
    if (_.isEmpty(validationErrors)) {
      setShowAdd(true);
      const {
        file,
        testDate,
        testTime,
        testName,
        location,
        conductingStaff,
        testResult,
        medicalClearanceStatus,
        recoveryPlan,
        comments,
        customValue,
        kpiName,
        kpiPoint,
        ...rest
      } = formData;
      const trimmedRest = trimFormData(rest);
      const dobFormatted = formData.dob
        ? moment(formData.dob, "DD/MM/YYYY").format("DD/MM/YYYY")
        : null;
      const data = {
        ...trimmedRest,
        dob: dobFormatted,
        sportID: +teamId || Number(selectedSport[0]) || Number(sportId),
        testAndMedicalChecksID: id ? id : editId,
        section: testType,
        isCompleted: 1,
      };

      dispatch(
        addTestAndMedicalChecks({
          url: edit
            ? "/UpdateTestAndMedicalChecksByID"
            : "/InsertTestAndMedicalChecks",
          payload: data,
        })
      );
    }
  };

  const clearFormData: any = () => {
    setFormData({
      athleteName: "",
      dob: "",
      height: "",
      weight: "",
      heightUnit: "CM",
      weightUnit: "KG",
      sports: "",
      injuryHistory: "",
      testDate: "",
      testTime: null,
      testName: "",
      kpiName: "",
      kpiPoint: "",
      location: "",
      conductingStaff: "",
      testResult: "",
      medicalClearanceStatus: "",
      recoveryPlan: "",
      comments: "",
      unitOfMeasurement: "",
      customUnitOfMeasurement: "",
      file: "",
    });
    setFileName("");
    setValue("testTime", null);
    setUpdateTestId("");
    setSelectedAthletesOption("");
    if (testType == "fitness") {
      setSelectedSportsOption("");
    }
    clearEditData();
  };

  const testClearFormData: any = () => {
    setFormData({
      ...formData,
      testDate: "",
      testTime: null,
      testName: "",
      kpiName: "",
      kpiPoint: "",
      location: "",
      conductingStaff: "",
      testResult: "",
      medicalClearanceStatus: "",
      recoveryPlan: "",
      comments: "",
      file: "",
      customUnitOfMeasurement: "",
      unitOfMeasurement: "",
    });
    setValue("testTime", null);
    setFileName("");
    setUpdateTestId("");
  };

  useEffect(() => {
    if (getSportList?.data && teamId && !editTestAndMedicalsData) {
      const data: any = getDefaultOptions(teamsNames, "sportName", "sportID");
      const selOption: any = _.filter(
        data,
        (x: any) => x.value && _.includes(teamId.split(","), x.value.toString())
      );
      setSelectedSportsOption(selOption);
      const selectedValues = Array.isArray(selOption)
        ? selOption.map((option: any) => option.value)
        : [];
      setFormData({
        ...formData,
        sports: selectedValues.join(","),
      });
    }
  }, [getSportList?.data, teamId]);

  useEffect(() => {
    if (id && editTestAndMedicalsData) {
      const sport = editTestAndMedicalsData?.selectSports || "";
      const selectedSportIds = sport ? sport.split(",") : [];
      const selOption: any = _.filter(
        SportsOption,
        (x: any) => x.value && _.includes(selectedSportIds, x.value.toString())
      );
      setSelectedSportsOption(selOption);
      setFormData((prevData: any) => ({
        ...prevData,
        athleteName: editTestAndMedicalsData?.athleteID || "",
        dob: editTestAndMedicalsData?.dob || "",
        height: editTestAndMedicalsData?.height || "",
        weight: editTestAndMedicalsData?.weight || "",
        heightUnit: editTestAndMedicalsData?.heightUnit || "",
        weightUnit: editTestAndMedicalsData?.weightUnit || "KG",
        sports: editTestAndMedicalsData?.sportID || "",
        injuryHistory: editTestAndMedicalsData?.injuryHistory || "",
      }));
      setSelectedAthletesOption({
        label: editTestAndMedicalsData?.athleteFirstName,
        value: editTestAndMedicalsData?.athleteID,
      });
      const fileName: any = extractFilename(
        editTestAndMedicalsData?.fileList?.[0]?.fileName || ""
      );
      setFileName(fileName);
    }
  }, [id, editTestAndMedicalsData, getSportList]);

  const payload: any = {
    searchText: "",
    filteredBy: "",
    paginationIndex: 0,
    paginationCount: 0,
    sportID: Number(teamId) || 0,

    section: testType,
  };
  const editParams: any = {
    section: testType,
    sportID:
      testType === "fitness"
        ? isEditSportId
          ? Number(isEditSportId)
          : Number(selectedSport[0])
        : teamId,

    testAndMedicalChecksID: editTestAndMedicalsData?.testAndMedicalChecksID
      ? editTestAndMedicalsData?.testAndMedicalChecksID
      : addTestAndMedicalChecksData?.data?.testAndMedicalChecksID,
  };

  useEffect(() => {
    if (
      addTestAndMedicalChecksData &&
      addTestAndMedicalChecksData.code === 200
    ) {
      setEdit(true);
      setEditId(addTestAndMedicalChecksData?.data?.testAndMedicalChecksID);
      const {
        testDate,
        testTime,
        testName,
        kpiName,
        kpiPoint,
        location,
        conductingStaff,
        testResult,
        medicalClearanceStatus,
        recoveryPlan,
        comments,
        customUnitOfMeasurement,
        unitOfMeasurement,
      } = formData;
      const updateData = {
        testDate: formData.testDate
          ? moment(formData.testDate, "DD/MM/YYYY").format("DD/MM/YYYY")
          : "",
        testTime: formData.testTime
          ? moment(formData.testTime, "hh:mm A").format("hh:mm A")
          : "",
        testName,
        kpiID: kpiName,
        kpiPoint,
        location,
        conductingStaff,
        testResult,
        medicalClearanceStatus,
        recoveryPlan,
        comments,
        customUnitOfMeasurement,
        section: testType,
        testAndMedicalChecksID:
          addTestAndMedicalChecksData?.data?.testAndMedicalChecksID,
        unitOfMeasurement,
      };
      const trimmedRest = trimFormData(updateData);
      if (
        showAdd &&
        !_.isEmpty(trimmedRest.testName) &&
        !_.isEmpty(trimmedRest.testDate)
      ) {
        const data = {
          testAndMedicalChecksID:
            addTestAndMedicalChecksData?.data?.testAndMedicalChecksID,

          anotherTest: [trimmedRest],
        };
        const UpdateData = {
          ...trimmedRest,

          anotherTestID: updateTestID,
          isCompleted: 1,
        };
        dispatch(
          addAcademicQualification({
            url: updateTestID ? "/UpdateAnotherTestByID" : "/InsertAnotherTest",
            payload: updateTestID ? UpdateData : data,
          })
        );
      }
      dispatch(
        viewTestAndMedicalChecks({
          url: "/GetTestAndMedicalCheckstList",
          payload,
        })
      );
      clearTestAndMedical();
      setTimeout(() => {
        setShowAdd(false);
        dispatch(editTestAndMedicalChecks(editParams));
        testClearFormData();
        dispatch(clearTestAndMedical());
        setShowBanner(false);
        setIsAddAnotherTest(false);
        if (navigate && !id) {
          const routePath =
            testType === "fitness"
              ? "/fitness-and-nutrition?module=fitness"
              : `/teams/${teamId}/testAndMedicalChecks/${testType}`;
          router.push(routePath);
        }
        if (id) {
          onClose();
        }
        clearState();
      }, 2000);
      if (!isAddAnotherTest) {
        setShowBanner(true);
        setSnackbarStatus(addTestAndMedicalChecksData.code);
      }
    } else if (
      addTestAndMedicalChecksData &&
      addTestAndMedicalChecksData.code === 500
    ) {
      setShowBanner(true);
      setSnackbarStatus(addTestAndMedicalChecksData.code);
      setTimeout(() => {
        dispatch(clearTestAndMedical());
        setShowBanner(false);
      }, 3000);
    }
  }, [addTestAndMedicalChecksData]);

  useEffect(() => {
    if (anotherTestData && anotherTestData.code === 200) {
      dispatch(editTestAndMedicalChecks(editParams)); //--> after Add and fileUpload
      if (formData.file) {
        const data = new FormData();
        data.append("file", formData.file);
        data.append("modulename", "TestAndMedicalChecks");
        data.append("moduleID", anotherTestData?.data?.anotherTestID);
        data.append("section", testType);
        dispatch(singleFileUpload(data));
      }
      dispatch(clearAddAcademicState());
      setUpdateTestId("");
      testClearFormData();
      setTimeout(() => {
        if (id) {
          dispatch(editTestAndMedicalChecks(editParams));
        }
      }, 2000);
    } else if (
      (anotherTestData && anotherTestData.code === 500) ||
      anotherTestData.code === 409
    ) {
      setShowBanner(true);
      setTimeout(() => {
        setShowBanner(false);
        dispatch(clearAddAcademicState());
      }, 2000);
    }
  }, [anotherTestData]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  const selectWinnerChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const kpiNameChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
      unit: "",
    }));
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const testPointChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const timeChange = (data: any) => {
    const value = data.value;
    const name = data.name;
    setFormData({ ...formData, [name]: value });
    setErrors({
      ...errors,
      [name]: "",
    });
  };
  const unitOfMeasurements = [
    ...(testType === "medical"
      ? [
        { label: "mmHg", value: "mmHg" },
        { label: "bpm", value: "bpm" },
        { label: "Custom", value: "custom" },
      ]
      : [
        { label: "Time", value: "time" },
        { label: "Distance", value: "distance" },
        { label: "Reps", value: "reps" },
        { label: "% Score", value: "score" },
        { label: "Custom", value: "custom" },
      ]),
  ];

  const handleFileUpload = () => {
    document.getElementById("file")?.click();
  };

  const handleFileChange = (file: any) => {
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    const uploadedFileSize = file.size;
    const fileSizeLimit = 25 * 1024 * 1024;
    const allowedTypes = fileTypes.map((type) => type.toLowerCase());

    let errorMessage = "";

    if (!allowedTypes.includes(fileExtension)) {
      errorMessage = `Invalid file type. Allowed types: ${fileTypes
        .join(", ")
        .toUpperCase()}`;
    } else if (uploadedFileSize > fileSizeLimit) {
      errorMessage = `File size must be below ${fileSizeLimit / 1048576
        } MB! Your file size is: ${Math.round(uploadedFileSize / 1024)} KB`;
    }

    if (errorMessage) {
      setErrors({ ...errors, file: errorMessage });
      setFormData({ ...formData, file: "" });
      setFileName(file.name);
      return;
    }

    if (fileName.endsWith(".jfif")) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
    } else {
      setFormData({ ...formData, file });
      setErrors({ ...errors, file: "" });
      setFileName(file.name);
    }
  };

  const closeAdd = () => {
    if (testType !== "fitness") {
      setDialogOpen(true);
    } else {
      router.push(`/fitness-and-nutrition?module=fitness`);
    }
    if (id) {
      onClose();
    }
  };

  const handleDialogDisagree = () => {
    setDialogOpen(false);
    setCancelDialog(false);
  };

  const handleDialogAgree = () => {
    setDialogOpen(false);
    setCancelDialog(false);
    if (id) {
      onClose();
    } else {
      if (testType === "fitness") {
        router.push(`/fitness-and-nutrition?module=fitness`);
      } else {
        router.push(`/teams/${teamId}/testAndMedicalChecks/${testType}`);
      }
    }
  };

  const handleChangeAthletes = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      const selectedAthlete = getAthleteList?.data?.find(
        (athlete: any) => athlete.athleteID === selectedValues[0]
      );
      setSelectedAthletesOption(selectedOption);
      setFormData({
        ...formData,
        athleteName: selectedAthlete?.athleteID || "",
        height: selectedAthlete?.height || "",
        weight: selectedAthlete?.weight || "",
        dob: selectedAthlete?.dob || "",
        injuryHistory: selectedAthlete?.previousInjuries || "",
      });
      setErrors({
        ...errors,
        athleteName: "",
      });
    }
  };

  const handleChangeSports = (selectedOption: any | null): void => {
    if (selectedOption) {
      const selectedValues = Array.isArray(selectedOption)
        ? selectedOption.map((option: any) => option.value)
        : [selectedOption.value];
      setSelectedSportsOption(selectedOption);
      setSelectedSport(selectedValues);
      setSelectedAthletesOption("");
      setFormData({
        ...formData,
        sports: selectedValues.join(","),
      });
      setErrors({
        ...errors,
        sports: "",
      });
    }
  };

  const getDefaultOptions = (
    list: any[],
    labelKey: string,
    valueKey: string
  ) => {
    if (!Array.isArray(list)) return [];
    return list.map((item) => ({
      label: item[labelKey],
      value: item[valueKey],
    }));
  };

  const teamsNames = getSportList?.data;
  useEffect(() => {
    setSportsOption(getDefaultOptions(teamsNames, "sportName", "sportID"));
  }, [teamsNames]);

  const athleteList = getAthleteList?.data;
  useEffect(() => {
    setAthletesOption(getDefaultOptions(athleteList, "firstName", "athleteID"));
  }, [athleteList]);

  useEffect(() => {
    if (
      deleteAcademicQualificationData &&
      deleteAcademicQualificationData.code === 200
    ) {
      const editParams: any = {
        section: testType,
        sportID:
          testType === "fitness"
            ? isEditSportId
              ? Number(isEditSportId)
              : Number(selectedSport[0])
            : Number(selectedSport[0]) || Number(sportId) || teamId,

        testAndMedicalChecksID: editTestAndMedicalsData?.testAndMedicalChecksID
          ? editTestAndMedicalsData?.testAndMedicalChecksID
          : addTestAndMedicalChecksData?.data?.testAndMedicalChecksID,
      };
      dispatch(editTestAndMedicalChecks(editParams));
      testClearFormData();
    }
  }, [deleteAcademicQualificationData]);

  useEffect(() => {
    if (testType === "fitness") return;
    if (singleUploadData && singleUploadData.code === 200) {
      const editParams: any = {
        section: testType,
        sportID:
          testType === "fitness"
            ? isEditSportId
              ? Number(isEditSportId)
              : Number(selectedSport[0])
            : Number(selectedSport[0]) || Number(sportId) || teamId,

        testAndMedicalChecksID: editTestAndMedicalsData?.testAndMedicalChecksID
          ? editTestAndMedicalsData?.testAndMedicalChecksID
          : addTestAndMedicalChecksData?.data?.testAndMedicalChecksID,
      };
      dispatch(editTestAndMedicalChecks(editParams)); //--> after Add and fileUpload
      clearState();
    }
  }, [singleUploadData]);

  const tableHeaders = [
    "Test Name",
    "Date",
    "Conducting Staff",
    "Result",
    "Actions",
  ];

  const handleAddTest = () => {
    setIsAddAnotherTest(true);
    setNavigate(false);
    if (editTestAndMedicalsData?.testAndMedicalChecksID) {
      setFileShow(false);
      const validationErrors = validateTest();
      setErrors(validationErrors);
      if (_.isEmpty(validationErrors)) {
        const {
          testDate,
          testTime,
          testName,
          kpiName,
          kpiPoint,
          location,
          conductingStaff,
          testResult,
          medicalClearanceStatus,
          recoveryPlan,
          comments,
          customUnitOfMeasurement,
          unitOfMeasurement,
        } = formData;
        const updateData = {
          testDate: formData.testDate
            ? moment(formData.testDate, "DD/MM/YYYY").format("DD/MM/YYYY")
            : "",
          testTime: formData.testTime
            ? moment(formData.testTime, "hh:mm A").format("hh:mm A")
            : "",
          testName,
          kpiID: kpiName,
          kpiPoint,
          location,
          conductingStaff,
          testResult,
          medicalClearanceStatus,
          recoveryPlan,
          comments,
          section: testType,
          customUnitOfMeasurement,
          unitOfMeasurement,
          testAndMedicalChecksID:
            editTestAndMedicalsData?.testAndMedicalChecksID,
        };
        const trimmedRest = trimFormData(updateData);
        const data = {
          testAndMedicalChecksID:
            editTestAndMedicalsData?.testAndMedicalChecksID,

          anotherTest: [trimmedRest],
          anotherTestID: updateTestID,
          isCompleted: 0,
        };
        const UpdateData = {
          ...trimmedRest,

          anotherTestID: updateTestID,
          isCompleted: 1,
        };
        dispatch(
          addAcademicQualification({
            url: updateTestID ? "/UpdateAnotherTestByID" : "/InsertAnotherTest",
            payload: updateTestID ? UpdateData : data,
          })
        );
      }
    } else {
      const validationErrors = validate();
      setErrors(validationErrors);
      if (_.isEmpty(validationErrors)) {
        setShowAdd(true);
        const {
          file,
          testDate,
          testTime,
          testName,
          location,
          conductingStaff,
          testResult,
          medicalClearanceStatus,
          recoveryPlan,
          comments,
          ...rest
        } = formData;
        const trimmedRest = trimFormData(rest);
        const data = {
          ...trimmedRest,
          dob: formData.dob
            ? moment(formData.dob, "DD/MM/YYYY").format("DD/MM/YYYY")
            : "",
          sportID: +teamId || Number(selectedSport[0]),
          testAndMedicalChecksID: id ? id : editId,
          section: testType,
          isCompleted: 0,
        };
        dispatch(
          addTestAndMedicalChecks({
            url: id
              ? "/UpdateTestAndMedicalChecksByID"
              : "/InsertTestAndMedicalChecks",
            payload: data,
          })
        );
      }
    }
  };

  const editTest = (data: any) => {
    setFormData({
      ...formData,
      testDate: data.testDate || "",
      testTime: data.testTime || "",
      testName: data.testName || "",
      kpiName: data.kpiID || "",
      kpiPoint: data.kpiPoint || "",
      location: data.location || "",
      conductingStaff: data.conductingStaff || "",
      testResult: data.testResult || "",
      medicalClearanceStatus: data.medicalClearanceStatus || "",
      recoveryPlan: data.recoveryPlan || "",
      comments: data.comments || "",
      file: data.file || "",
      unitOfMeasurement: data?.unitOfMeasurement || "",
      customUnitOfMeasurement: data?.customUnitOfMeasurement || "",
    });
    setUpdateTestId(data.anotherTestID);
    const fileName: any = extractFilename(data.testFilePath);
    setFileName(fileName);
  };

  function extractFilename(filePath: any) {
    return filePath.replace(/^.*[\\\/]/, "");
  }

  return (
    <Grid
      container
      sx={{
        padding: "2rem",
        position: "relative",
        overflow: "auto",
      }}
    >
      {showBanner && (
        <CustomSnackbar
          message={
            snackbarStatus === 200
              ? testType === "fitness"
                ? id
                  ? "Fitness Updated successfully!"
                  : "Fitness Added successfully!"
                : `${getTestName(String(testType))} ${id ? "Updated" : "Added"
                } successfully!`
              : "Something went wrong"
          }
          severity={snackbarStatus === 200 ? "success" : "error"}
          open={showBanner}
          onClose={handleClose}
        />
      )}
      {dialogOpen && (
        <AppAlertDialog
          open={dialogOpen}
          onClose={handleDialogDisagree}
          title="Discard Changes"
          description="You have unsaved changes. Do you really want to leave this page?"
          onAgree={handleDialogAgree}
          onDisagree={handleDialogDisagree}
          agreeLabel="Discard"
          disagreeLabel="Cancel"
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
      >
        <Box width="100%">
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} justifyContent={"space-between"}>
              {!id && (
                <Grid
                  item
                  xs={12}
                  sx={{ display: "flex", justifyContent: "flex-end" }}
                  mb={2}
                >
                  <Button
                    variant="outlined"
                    className="text-capitalize dubai-med"
                    color="secondary"
                    sx={{ height: "48px" }}
                    onClick={clearFormData}
                  >
                    Clear form
                  </Button>
                </Grid>
              )}

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Sport <span className="asterisk">*</span>
                </Typography>
                <ReactSelect
                  isMulti={false}
                  name="sport"
                  className="select2"
                  classNamePrefix="select"
                  handleChangeReactSelect={handleChangeSports}
                  options={SportsOption}
                  value={SelectedSportsOption}
                  isDisabled={module !== "fitness" || Boolean(id)}
                  placeholder="Select Sport"
                />
                {errors.sports && (
                  <Typography variant="caption" className="error-message">
                    {errors.sports}
                  </Typography>
                )}
              </Grid>

              <Grid
                item
                xs={12}
                md={5.75}
                sx={{ opacity: formData.goalType === "team" ? 0.5 : null }}
              >
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Athlete <span className="asterisk">*</span>
                </Typography>
                <ReactSelect
                  name="validationErrors"
                  id="athleteName"
                  classNamePrefix="select"
                  handleChangeReactSelect={handleChangeAthletes}
                  options={AthletesOption}
                  value={SelectedAthletesOption}
                  isDisabled={!AthletesOption || Boolean(id)}
                  placeholder={"Select Athlete"}
                />
                {errors.athleteName && (
                  <Typography variant="caption" className="error-message">
                    {errors.athleteName}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} md={5.75}>
                <CustomDatePicker
                  control={control}
                  name="dob"
                     id="dob"
                  label="Date of Birth"
                  defaultValue={formData.dob}
                  boxmb={0.8}
                  required={false}
                  minDate={moment().subtract(50, "years")}
                  maxDate={moment().subtract(18, "years")}
                  onChange={dateChange}
                  className="Text-field-customise"
                  disabled={true}
                />
                {errors.dob && (
                  <Typography variant="caption" className="error-message">
                    {errors.dob}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Height
                </Typography>
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <OutlinedInput
                    sx={{
                      flexGrow: 1,
                      height: "40px",
                      backgroundColor: "rgba(241, 235, 156, 0.2)",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 12px",
                        "::placeholder": {
                          color: "#58585B",
                          opacity: 1,
                        },
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#00875508",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                    }}
                    placeholder="Enter Height"
                    className="custom-outlined-input Text-field-customise"
                    type="text"
                    fullWidth
                    name="height"
                    disabled={true}
                    value={formData.height}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (!REGEX.WEIGHT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{ maxLength: 5 }}
                    endAdornment={
                      <InputAdornment position="end">
                        <Select
                          defaultValue="CM"
                          className="Text-field-customise"
                          sx={{
                            borderLeft: "1px solid grey",
                            minWidth: "10ch",
                            borderRadius: "0",
                            height: "100%",
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-select": {
                              paddingLeft: "8px",
                              display: "flex",
                              alignItems: "center",
                            },
                          }}
                          disableUnderline
                          name="heightUnit"
                          value={formData.heightUnit}
                          disabled={true}
                          onChange={(e: any) =>
                            setFormData({
                              ...formData,
                              heightUnit: e.target.value,
                            })
                          }
                        >
                          <MenuItem value="CM" className="dubai-med">
                            CM
                          </MenuItem>
                          <MenuItem value="MM" className="dubai-med">
                            MM
                          </MenuItem>
                        </Select>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {errors.height && (
                  <Typography variant="caption" className="error-message">
                    {errors.height}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                >
                  Weight
                </Typography>
                <FormControl
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <OutlinedInput
                    sx={{
                      flexGrow: 1,
                      height: "40px",
                      backgroundColor: "rgba(241, 235, 156, 0.2)",
                      "& .MuiOutlinedInput-input": {
                        padding: "8px 12px",
                        "::placeholder": {
                          color: "#58585B",
                          opacity: 1,
                        },
                      },
                      "& .MuiOutlinedInput-root": {
                        backgroundColor: "#00875508",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#40a377",
                      },
                    }}
                    placeholder="Enter Weight"
                    className="custom-outlined-input Text-field-customise"
                    type="text"
                    name="weight"
                    disabled={true}
                    fullWidth
                    value={formData.weight}
                    onChange={handleChange}
                    onKeyPress={(e) => {
                      if (!REGEX.WEIGHT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    inputProps={{ maxLength: 5 }}
                    endAdornment={
                      <InputAdornment position="end">
                        <Select
                          className="Text-field-customise"
                          defaultValue="KG"
                          sx={{
                            borderLeft: "1px solid grey",
                            minWidth: "10ch",
                            height: "100%",
                            borderRadius: "0",
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                            "& .MuiSelect-select": {
                              paddingLeft: "8px",
                              display: "flex",
                              alignItems: "center",
                            },
                          }}
                          disableUnderline
                          name="weightUnit"
                          value={formData.weightUnit}
                          disabled={true}
                        >
                          <MenuItem value="KG" className="dubai-med">
                            KG
                          </MenuItem>
                        </Select>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {errors.weight && (
                  <Typography variant="caption" className="error-message">
                    {errors.weight}
                  </Typography>
                )}
              </Grid>

              <Grid item xs={12} md={5.75}>
                <Typography
                  gutterBottom
                  className="typography textfield-label bukra"
                  mt={2}
                >
                  Injury History
                </Typography>
                {/* For Future use */}
                {/* <TextSunEditor
                  setData={setFormData}
                  contentData={formData.injuryHistory}
                  name="injuryHistory"
                  minHeight={"250px"}
                  isDisable={true}
                /> */}
                <textarea
                  name="injuryHistory"
                  value={formData.injuryHistory}
                  onChange={(e) => setFormData({ ...formData, injuryHistory: e.target.value })}
                  style={{
                    minHeight: "250px", width: "100%",
                    background: 'rgba(241, 235, 156, 0.2)',
                    border: "1px solid rgba(88, 88, 91, 0.2)",
                    borderRadius: "4px",
                    paddingLeft: "20px",
                    paddingTop: "20px",
                    paddingRight: "20px"
                  }}
                  disabled={true}
                />
              </Grid>

              <Grid item xs={12} md={12} mb={2} mt={2}>
                <Divider />
              </Grid>

              {editTestAndMedicalsData &&
                editTestAndMedicalsData?.anotherTestList?.length > 0 ? (
                <TableContainer
                  sx={{
                    height: {
                      border: "1px solid rgba(88, 88, 91, 0.2)",
                      borderRadius: "4px",
                    },
                    overflowX: "auto",
                  }}
                >
                  <Table stickyHeader aria-label="team table">
                    <TableHead>
                      <TableRow>
                        {tableHeaders.map((header: any) => (
                          <TableCell
                            key={header}
                            align={header === "Name" ? "center" : "left"}
                            sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontWeight: "bold",
                              width:
                                header === "Name"
                                  ? "240px"
                                  : header === "Role"
                                    ? "97px"
                                    : header === "Actions"
                                      ? "60px"
                                      : "164px",
                              p: 1.25,
                            }}
                            className="bukra"
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {editTestAndMedicalsData &&
                        editTestAndMedicalsData?.anotherTestList?.length > 0 &&
                        editTestAndMedicalsData.anotherTestList.map(
                          (row: any, index: any) => (
                            <TableRow
                              key={index}
                              sx={{
                                "&:nth-of-type(even)": {
                                  backgroundColor: "#EFFAF9",
                                },
                              }}
                            >
                              <TableCell sx={{ p: 1.25 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    color: "rgba(141, 144, 147, 1)",
                                    textTransform: "capitalize",
                                  }}
                                  className="dubai-med"
                                >
                                  {row.testName || "--"}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ p: 1.25 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    color: "rgba(141, 144, 147, 1)",
                                  }}
                                  className="dubai-med"
                                >
                                  {row.testDate || "--"}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ p: 1.25 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    color: "rgba(141, 144, 147, 1)",
                                  }}
                                  className="dubai-med"
                                >
                                  {row.conductingStaff || "--"}
                                </Typography>
                              </TableCell>
                              <TableCell sx={{ p: 1.25 }}>
                                <Typography
                                  sx={{
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    lineHeight: "24px",
                                    color: "rgba(141, 144, 147, 1)",
                                  }}
                                  className="dubai-med"
                                >
                                  {row.testResult || "--"}
                                </Typography>
                              </TableCell>
                              <TableCell
                                sx={{
                                  whiteSpace: "nowrap",
                                  p: 1.25,
                                  textAlign: "center",
                                  verticalAlign: "middle",
                                }}
                              >
                                <Tooltip title={"View"}>
                                  <IconButton
                                    aria-label="view"
                                    size="small"
                                    sx={{ width: "16px", height: "16px" }}
                                  >
                                    <VisibilityIcon
                                      onClick={() => editTest(row)}
                                      sx={{ color: "#05868E" }}
                                    />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title={"Edit"}>
                                  <IconButton
                                    aria-label="edit"
                                    size="small"
                                    onClick={() => editTest(row)}
                                    sx={{
                                      width: "16px",
                                      height: "16px",
                                      mx: 1,
                                      color: "#05868E",
                                    }}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                                <DeleteDialog
                                  data={row}
                                  dispatchDelete={
                                    DeleteAcademicQualificationByID
                                  }
                                  deleteResponse={
                                    deleteAcademicQualificationData
                                  }
                                  clearDelete={
                                    clearAcademicQualificationDeleteState
                                  }
                                  module={"anotherTestID"}
                                  title={row.testName}
                                  getCurrentSport={teamId}
                                  deleteUrl={"/DeleteAnotherTestByID"}
                                  secodId={row.testAndMedicalChecksID}
                                />
                              </TableCell>
                            </TableRow>
                          )
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : null}
              <Grid
                container
                mt={2}
                spacing={2}
                justifyContent={"space-between"}
                ml={id ? 0 : 2}
                sx={{
                  borderRadius: "8px",
                  borderWidth: 1,
                  borderStyle: "solid",
                  borderColor: "rgba(222, 222, 222, 1)", // Tertiary Gray 20
                  padding: "16px 24px 24px 24px",
                  background: "rgba(253, 253, 253, 1)",
                }}
              >
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Test Name <span className="asterisk">*</span>
                  </Typography>
                  <CustomTextField
                    name="testName"
                    id="testName"
                    placeholder="Test Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.testName}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.testName && (
                    <Typography variant="caption" className="error-message">
                      {errors.testName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <CustomDatePicker
                        control={control}
                        name="testDate"
                        id="testDate"
                        label="Test Date"
                        boxmb={0.8}
                        required
                        minDate={moment().subtract(12, "months")}
                        maxDate={moment()}
                        onChange={dateChange}
                        defaultValue={formData?.testDate}
                        className="Text-field-customise"
                      />
                      {errors.testDate && (
                        <Typography
                          variant="caption"
                          className="error-message"
                          mt={2}
                        >
                          {errors.testDate}
                        </Typography>
                      )}
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <CustomTimePicker
                        control={control}
                        name="testTime"
                        id="testTime"
                        label="Time"
                        boxmb={0.8}
                        onChange={timeChange}
                        defaultValue={formData.testTime || ""}
                        maxwidth="100%"
                      />
                      {errors.testTime && (
                        <Typography variant="caption" className="error-message">
                          {errors.testTime}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    KPI Name <span className="asterisk">*</span>
                  </Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className="selectFieldContainer"
                  >
                    <Select
                      value={formData.kpiName}
                      onChange={kpiNameChange}
                      name="kpiName"
                      displayEmpty
                      className="Text-field-customise"
                      renderValue={(selected) => {
                        const selectedOption = kpiOption?.find(
                          (option: any) => option.value === selected
                        );
                        return selectedOption ? (
                          selectedOption.label
                        ) : (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{
                              height: 27,
                              fontFamily: "Dubai",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "25.01px",
                              textAlign: "left",
                              marginLeft: 10,
                            }}
                          >
                            Select KPI Name
                          </Typography>
                        );
                      }}
                    >
                      {kpiOption.map((option: any) => (
                        <MenuItem key={option.label} value={option.value}>
                          <Typography
                            variant="body1"
                            color="textPrimary"
                            style={{
                              height: 27,
                              fontFamily: "Dubai",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "25.01px",
                              textAlign: "left",
                              marginLeft: 10,
                            }}
                          >
                            {option.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.kpiName && (
                    <Typography variant="caption" className="error-message">
                      {errors.kpiName}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    KPI Point <span className="asterisk">*</span>
                  </Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className="selectFieldContainer"
                  >
                    <Select
                      value={formData.kpiPoint}
                      onChange={testPointChange}
                      name="kpiPoint"
                      displayEmpty
                      className="Text-field-customise"
                      renderValue={(selected) => {
                        const selectedOption = testPointOption?.find(
                          (option: any) => option.value === selected
                        );
                        return selectedOption ? (
                          selectedOption.label
                        ) : (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{
                              height: 27,
                              fontFamily: "Dubai",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "25.01px",
                              textAlign: "left",
                              marginLeft: 10,
                            }}
                          >
                            Select KPI Point
                          </Typography>
                        );
                      }}
                    >
                      {testPointOption.map((option: any) => (
                        <MenuItem key={option.label} value={option.value}>
                          <Typography
                            variant="body1"
                            color="textPrimary"
                            style={{
                              height: 27,
                              fontFamily: "Dubai",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "25.01px",
                              textAlign: "left",
                              marginLeft: 10,
                            }}
                          >
                            {option.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.kpiPoint && (
                    <Typography variant="caption" className="error-message">
                      {errors.kpiPoint}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Conducting Staff
                  </Typography>
                  <CustomTextField
                    name="conductingStaff"
                    id="conductingStaff"
                    placeholder="Enter (Physician, Physiotherapist)"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.conductingStaff}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      if (!REGEX.TEXT.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.conductingStaff && (
                    <Typography variant="caption" className="error-message">
                      {errors.conductingStaff}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Location
                  </Typography>
                  <CustomTextField
                    name="location"
                    id="location"
                    placeholder="Enter Clinic, Hospital, Facility"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.location}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                  />
                  {errors.location && (
                    <Typography variant="caption" className="error-message">
                      {errors.location}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Unit Of Measurement
                  </Typography>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    className="selectFieldContainer"
                  >
                    <Select
                      value={formData.unitOfMeasurement}
                      onChange={selectWinnerChange}
                      name="unitOfMeasurement"
                      displayEmpty
                      className="Text-field-customise"
                      renderValue={(selected) => {
                        const selectedOption = unitOfMeasurements.find(
                          (option) => option.value === selected
                        );
                        return selectedOption ? (
                          selectedOption.label
                        ) : (
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            style={{
                              height: 27,
                              fontFamily: "Dubai",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "25.01px",
                              textAlign: "left",
                              marginLeft: 10,
                            }}
                          >
                            Select Unit
                          </Typography>
                        );
                      }}
                    >
                      {unitOfMeasurements.map((option) => (
                        <MenuItem key={option.label} value={option.value}>
                          <Typography
                            variant="body1"
                            color="textPrimary"
                            style={{
                              height: 27,
                              fontFamily: "Dubai",
                              fontSize: "16px",
                              fontWeight: 500,
                              lineHeight: "25.01px",
                              textAlign: "left",
                              marginLeft: 10,
                            }}
                          >
                            {option.label}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {formData.unitOfMeasurement === "custom" ? (
                    <>
                      <CustomTextField
                        name="customUnitOfMeasurement"
                        id="customUnitOfMeasurement"
                        placeholder="Unit Of Measurement"
                        type="text"
                        variant="outlined"
                        fullWidth
                        value={formData.customUnitOfMeasurement}
                        onChange={handleChange}
                        className="Text-field-customise"
                        inputProps={{ maxLength: 50 }}
                        onKeyPress={(e) => {
                          const VALID_TEST_RESULT_REGEX =
                            /^[a-zA-Z0-9\s.,<>=/:%+-]*$/;
                          if (!VALID_TEST_RESULT_REGEX.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        style={{ marginTop: 10 }}
                      />

                      {errors.customUnitOfMeasurement && (
                        <Typography variant="caption" className="error-message">
                          {errors.customUnitOfMeasurement}
                        </Typography>
                      )}
                    </>
                  ) : null}
                </Grid>

                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Test Result
                  </Typography>
                  <CustomTextField
                    name="testResult"
                    id="testResult"
                    placeholder="Enter Test Result"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.testResult}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                    onKeyPress={(e) => {
                      const VALID_TEST_RESULT_REGEX =
                        /^[a-zA-Z0-9\s.,<>=/:%+-]*$/;
                      if (!VALID_TEST_RESULT_REGEX.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                  />
                  {errors.testResult && (
                    <Typography variant="caption" className="error-message">
                      {errors.testResult}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Medical Clearance Status
                  </Typography>
                  <FormControl component="fieldset">
                    <RadioGroup
                      name="medicalClearanceStatus"
                      id="medicalClearanceStatus"
                      value={formData.medicalClearanceStatus}
                      onChange={handleChange}
                      row
                    >
                      <FormControlLabel
                        className="dubai-med textfield-label"
                        value="fitToPlay"
                        control={<Radio />}
                        label="Fit to Play"
                      />
                      <FormControlLabel
                        className="dubai-med textfield-label"
                        value="notFit"
                        control={<Radio />}
                        label="Not fit"
                        defaultChecked={true}
                      />
                      <FormControlLabel
                        className="dubai-med textfield-label"
                        value="recovering"
                        control={<Radio />}
                        label="Recovering"
                        defaultChecked={true}
                      />
                      <FormControlLabel
                        className="dubai-med textfield-label"
                        value="injured"
                        control={<Radio />}
                        label="Injured"
                        defaultChecked={true}
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                  >
                    Recovery Plan
                  </Typography>
                  <CustomTextField
                    name="recoveryPlan"
                    id="recoveryPlan"
                    placeholder="Enter Recovery Plan"
                    type="text"
                    variant="outlined"
                    fullWidth
                    value={formData.recoveryPlan}
                    onChange={handleChange}
                    className="Text-field-customise"
                    inputProps={{ maxLength: 50 }}
                  />
                  {errors.recoveryPlan && (
                    <Typography variant="caption" className="error-message">
                      {errors.recoveryPlan}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={12} md={5.75}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: "14px" }}
                    className="typography textfield-label bukra"
                    mt={1.5}
                    mb={2}
                  >
                    Upload Supporting Documents
                  </Typography>
                  <Box
                    sx={{
                      width: "100%",
                      height: "136px",
                      borderRadius: "10px",
                      border: "1px dashed #008755",
                      gap: "8px",
                      paddingTop: "20px",
                      // paddingBottom: "30px",
                      backgroundColor: "rgba(0, 135, 85, 0.03)",
                      position: "relative",
                    }}
                    className="upload-medical"
                  >
                    <FileUploader
                      handleChange={handleFileChange}
                      name="file"
                      types={fileTypes}
                      className="upload-outline"
                      label={
                        fileName
                          ? "Drag & drop or click here to change a file"
                          : "Drag & drop or click here to select a file"
                      }
                      uploadedLabel={
                        "Drag & drop or click here to change a file"
                      }
                      disabled={singleUploadData.loading}
                    />
                    <Uploadtravel
                      style={{
                        position: "absolute",
                        top: "25%",
                        bottom: 0,
                        left: "10%",
                        right: 0,
                        cursor: "pointer",
                        height: "50px",
                        width: "50px",
                      }}
                      onClick={handleFileUpload}
                    />
                    <Box
                      textAlign={"center"}
                      position={"absolute"}
                      bottom={"35%"}
                      className="dubai-regular secondary-color"
                      fontWeight={600}
                      fontSize={"14px"}
                      width={"100%"}
                    >
                      {fileName ? (
                        <Tooltip title={fileName} arrow>
                          <Typography
                            className={
                              id && fileName
                                ? "dubai-med webkit-line-clamp webkit-1 primary-color"
                                : "dubai-med webkit-line-clamp webkit-1"
                            }
                            sx={{
                              fontSize: "16px",
                              fontWeight: "600",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              ml: "40px",
                            }}
                          >
                            {fileName.length > 30
                              ? `${fileName.substring(
                                0,
                                25
                              )}...${fileName.substring(fileName.length - 7)}`
                              : fileName}
                          </Typography>
                        </Tooltip>
                      ) : (
                        "Supported formats: JPEG, PNG, PDF, Word"
                      )}
                    </Box>
                  </Box>
                  {errors.file && (
                    <Typography
                      variant="caption"
                      color="error"
                      className="error-message"
                    >
                      {errors.file}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={5.75}>
                  <Typography
                    gutterBottom
                    className="typography textfield-label bukra"
                    mt={2}
                  >
                    {testType === "fitness" ? "Final Comments" : "Comments"}
                  </Typography>
                  <TextSunEditor
                    setData={setFormData}
                    contentData={formData.comments}
                    name="comments"
                    minHeight={"250px"}
                  />
                </Grid>
                {updateTestID ? (
                  <Grid item xs={12} md={12}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginTop: "2rem",
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ mr: 1 }}
                        onClick={testClearFormData}
                        className="cancel-button text-capitalize dubai-med season-goal-btn"
                      >
                        Clear
                      </Button>
                      <LoadingButton
                        size="small"
                        onClick={handleAddTest}
                        loading={anotherTestData.loading}
                        variant="contained"
                        className="text-capitalize dubai-med season-goal-btn"
                      >
                        {anotherTestData.loading ? "" : "Update Test"}
                      </LoadingButton>
                    </Box>
                  </Grid>
                ) : null}
              </Grid>
              {!updateTestID && (
                <Grid item xs={12} md={12}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                    }}
                  >
                    <Button
                      variant="text"
                      className="text-capitalize dubai-med"
                      onClick={handleAddTest}
                      disabled={anotherTestData.loading}
                      startIcon={<AddBoxOutlinedIcon />}
                      style={{
                        color: "rgba(0, 66, 106, 1)",
                        borderColor: "rgba(0, 66, 106, 1)",
                      }}
                    >
                      {anotherTestData.loading
                        ? "Loading..."
                        : "Add Another Test "}
                    </Button>
                  </Box>
                </Grid>
              )}
            </Grid>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "6rem",
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mr: 1, paddingX: "16px" }}
                onClick={closeAdd}
                className="cancel-button text-capitalize dubai-med season-goal-btn"
              >
                Cancel
              </Button>
              <LoadingButton
                type="submit"
                size="small"
                loading={addTestAndMedicalChecksData.loading}
                variant="contained"
                className="save-continue-button text-capitalize save dubai-med season-goal-btn"
                sx={{ paddingX: "16px" }}
              >
                {addTestAndMedicalChecksData.loading
                  ? "Loading..."
                  : id
                    ? "Update"
                    : "Save"}
              </LoadingButton>
            </Box>
          </form>
        </Box>
      </Grid>
    </Grid>
  );
};
export default TestAndMedicalChecks;

