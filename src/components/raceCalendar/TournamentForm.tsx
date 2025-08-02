import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { FileUploader } from "react-drag-drop-files";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import { useDispatch, useSelector } from "react-redux";
import _, { forInRight, isEmpty, values } from "lodash";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CustomDatePicker from "@/components/Fields/CustomDatePicker";
import CustomRadioGroup from "@/components/Fields/CustomRadioGroup";
import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import { formatDate, getLocalStorage, getSportIDByName } from "@/utils/helper";
import {
  addRaceCalendar,
  clearAddRaceCalendarState,
} from "@/redux/slices/raceCalendar/raceCalendarAddSlice";
import { AppDispatch } from "@/redux/store";
import { isUpdatedFunc } from "@/redux/slices/appSplice";
import CustomSnackbar from "@/components/CustomSnackbar";
import {
  CircularProgress,
  Grid,
  IconButton,
  SnackbarCloseReason,
} from "@mui/material";
import { useRouter } from "next/router";
import {
  clearUpdateRaceCalendarState,
  updateRaceCalendar,
} from "@/redux/slices/raceCalendar/updateRaceCalendarSlice";
import { clearGetRaceCalendarByIDState } from "@/redux/slices/raceCalendar/getRaceCalendarIDSlice";
import moment from "moment";
import { singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";
import { REGEX } from "@/utils/constants";
import DeleteIcon from "@mui/icons-material/Delete";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

interface Props {
  onClose: any;
  editData: any;
  date: any;
}

type FormErrors = {
  tournamentImage?: string;
  tournamentName?: string;
  selectSport?: string;
  tournamentType?: string;
  trainingStartDate?: string | null;
  trainingEndDate?: string | null;
  organizerName?: string;
  organizerEmail?: string;
  organizerContact?: string;
  description?: string;
};

const TournamentForm: React.FC<Props> = ({ onClose, editData, date }) => {
  const fileTypes = ["JPG", "PNG"];
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();
  const { teamID } = router.query;
  const AddRaceCalendarResponse = useSelector(
    (state: any) => state.addRaceCalendar
  );
  const UpdateRaceCalendarResponse = useSelector(
    (state: any) => state.updateRaceCalendar
  );
  const [isDisabled, setIsDisabled] = useState(false);
  const [formDatas, setFormDatas] = React.useState<any>({
    file: "",
    modulename: "calendar",
    moduleid: "",
    section: "",

    description: "",
    organizerContact: "",
    organizerContactCountryCode: "",
  });
  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });
  const getDefaultOption = (teamsNames: any) => {
    const defaultOptions = [];
    for (const item in teamsNames) {
      defaultOptions.push({
        label: teamsNames[item].sportName,
        value: teamsNames[item].sportName,
      });
    }
    return defaultOptions;
  };

  const sportsOption = getDefaultOption(getSportList.data);
  const [image, setImage] = useState<any>(null);
  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      tournamentImage: "",
      tournamentName: "",
      selectSport: "",
      tournamentType: "",
      trainingStartDate: null,
      trainingEndDate: null,
      organizerName: "",
      organizerEmail: "",
      organizerContact: "",
      description: "",
    },
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setDateError] = useState({});
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const trainingStartDateValue = watch("trainingStartDate");
  const trainingEndDateValue = watch("trainingEndDate");
  const [endDate, setEndDate] = useState<any>(moment(date).add(1, "day"));
  const onSubmit: SubmitHandler<FieldValues> = (formData: any) => {
    const validationErrors: any = {};
    if (_.isEmpty(formData.selectSport)) {
      validationErrors.selectSport = "Sport is required";
    }
    if (_.isEmpty(formData.tournamentType)) {
      validationErrors.tournamentType = "tournamentType is required";
    }
    const postBody: any = {
      ...formData,
      section: "tournament",
      trainingStartDate: moment(
        formData.trainingStartDate,
        "DD/MM/YYYY"
      ).format("DD/MM/YYYY"),
      trainingEndDate: moment(formData.trainingEndDate, "DD/MM/YYYY").format(
        "DD/MM/YYYY"
      ),

      sportID:
        router.pathname === "/competition-calendar"
          ? getSportIDByName(getSportList.data, formData.selectSport)
          : Number(teamID),
      organizerContact: formDatas.organizerContact || "",
      organizerContactCountryCode: formDatas.organizerContactCountryCode || "",
    };

    setErrors(validationErrors);
    if (!isEmpty(editData) && editData.tournamentID) {
      const updateBody: any = {
        ...formData,
        trainingStartDate: moment(
          formData.trainingStartDate,
          "DD/MM/YYYY"
        ).format("DD/MM/YYYY"),
        trainingEndDate: moment(formData.trainingEndDate, "DD/MM/YYYY").format(
          "DD/MM/YYYY"
        ),
        section: "tournament",

        sportID:
          router.pathname === "/competition-calendar"
            ? getSportIDByName(getSportList.data, formData.selectSport)
            : Number(teamID),
        tournamentID: editData.tournamentID,
        organizerContact: formDatas.organizerContact || "",
        organizerContactCountryCode:
          formDatas.organizerContactCountryCode || "",
      };
      dispatch(updateRaceCalendar(updateBody));
    } else {
      dispatch(addRaceCalendar(postBody));
    }
  };

  const handleChange = (file: any) => {
    if (file) {
      setImage(URL.createObjectURL(file));
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      const uploadedFileSize = file.size;
      const fileSizeLimit = 25 * 1024 * 1024;
      // if (fileType === "image/jpeg" || fileName.endsWith(".jfif") || fileType === "image/jpg") {
      //   setSnackbarOpen(true);
      //   setSnackbarStatus("error");
      // } else {
      if (uploadedFileSize < fileSizeLimit) {
        setFormDatas({ ...formDatas, file: file });
        setErrors({});
      } else {
        setSnackbarOpen(true);
        setSnackbarStatus(
          `File size must below ${
            fileSizeLimit / 1048576
          } MB!. You file size is : ${Math.round(uploadedFileSize / 1024)}KB`
        );
      }
      // }
    }
  };

  const handleFileUpload = () => {
    document.getElementById("file")?.click();
  };

  const trainingStartDateChange = (data: any) => {
    const value = data.value;
    const name = data.name;
    setValue(name, value);
  };

  const trainingEndDateChange = (data: any) => {
    const value = data.value;
    const name = data.name;
    setValue(name, value);
    // if (moment(value).isBefore(trainingStartDateValue)) {
    //   setDateError({ message: "The date cannot be earlier than the start date." });
    // } else {
    //   setDateError({});
    // }
  };
  const fileUpload = (id: any) => {
    const formData = new FormData();
    formData.append("file", formDatas.file);
    formData.append("modulename", formDatas.modulename);
    formData.append("moduleid", id);
    formData.append("section", "tournament");
    dispatch(singleFileUpload(formData));
  };
  useEffect(() => {
    if (
      (AddRaceCalendarResponse &&
        AddRaceCalendarResponse.code === 200 &&
        AddRaceCalendarResponse.status === "succeeded") ||
      (UpdateRaceCalendarResponse &&
        UpdateRaceCalendarResponse.code === 200 &&
        UpdateRaceCalendarResponse.status === "succeeded")
    ) {
      dispatch(isUpdatedFunc(true));
      setSnackbarOpen(true);
      const id = isEmpty(editData)
        ? AddRaceCalendarResponse.data.tournamentID
        : editData.tournamentID;
      if (formDatas.file !== "" && id) {
        fileUpload(id);
      }
      setSnackbarStatus("success");
      dispatch(clearAddRaceCalendarState());
      dispatch(clearUpdateRaceCalendarState());
      dispatch(clearGetRaceCalendarByIDState());
    } else if (
      (AddRaceCalendarResponse &&
        AddRaceCalendarResponse.code === 500 &&
        AddRaceCalendarResponse.status === "failed") ||
      (UpdateRaceCalendarResponse &&
        UpdateRaceCalendarResponse.code === 500 &&
        UpdateRaceCalendarResponse.status === "failed")
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearAddRaceCalendarState());
      dispatch(clearUpdateRaceCalendarState());
      dispatch(clearGetRaceCalendarByIDState());
    }
  }, [AddRaceCalendarResponse, UpdateRaceCalendarResponse]);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        onClose(false);
        setSnackbarOpen(false);
      }, 1000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId); // Cleanup to prevent memory leaks
      }
    };
  }, [snackbarOpen]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if ((!isEmpty(editData) && editData.tournamentID) || date) {
      setValue("selectSport", editData && editData.selectSport);
      setValue("tournamentType", editData && editData.tournamentType);
      setValue("organizerContact", editData && editData.organizerContact);
      setValue(
        "trainingStartDate",
        (editData && editData.trainingStartDate) ||
          moment(date).format("DD/MM/YYYY")
      );
      setValue("trainingEndDate", editData && editData.trainingEndDate);
      if (!isEmpty(editData)) {
        setValue("organizerName", editData && editData.organizerName);
        setValue("organizerEmail", editData && editData.organizerEmail);
        setValue("tournamentName", editData && editData.tournamentName);
        setValue("description", editData && editData.description);
      }
      if (editData && editData.tournamentImage !== "") {
        setImage(editData.tournamentImage);
      }
      setFormDatas((formData: any) => ({
        ...formData,
        organizerContact: editData?.organizerContact || "",
        organizerContactCountryCode:
          editData?.organizerContactCountryCode || "",
      }));
    }
  }, [editData, date]);

  const handleDelete = () => {
    setImage(null);
    setFormDatas({ ...formDatas, file: "" });
  };

  useEffect(() => {
    if (teamID && getSportList?.data?.length) {
      const matchedSport = getSportList.data.find(
        (sport: any) => sport.sportID === Number(teamID)
      );
      if (matchedSport) {
        setValue("selectSport", matchedSport.sportName);
        setIsDisabled(true);
      }
    }
  }, [teamID, getSportList, setValue]);

  useEffect(() => {
    if (trainingStartDateValue && !endDate) {
      setEndDate(moment(trainingStartDateValue).add(1, "day"));
    } else if (endDate) {
      setEndDate(moment(trainingStartDateValue, "DD/MM/YYYY"));
    }
  }, [trainingStartDateValue, endDate, date]);

  const handlePhoneNoChange = (value: string, country: any, event: any) => {
    const dialCode = country.dialCode;
    const phoneWithoutDialCode = value.slice(dialCode.length);
    setFormDatas((prevData: any) => ({
      ...prevData,
      organizerContact: phoneWithoutDialCode,
      organizerContactCountryCode: dialCode,
    }));
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="titleStyle"
            sx={{ fontSize: "14px" }}
            className="typography textfield-label bukra"
            mt={1.5}
          >
            Tournament Image
          </Typography>
          {image !== null && (
            <IconButton onClick={handleDelete}>
              <DeleteIcon sx={{ fontSize: "20px", color: "#05868E" }} />
            </IconButton>
          )}
        </Box>
        <Box className="upload-outline" position={"relative"}>
          {formDatas.file === "" && image === null ? (
            <FileUploader
              handleChange={handleChange}
              name="file"
              types={fileTypes}
              className="upload-outline"
              label={
                formDatas && formDatas.file
                  ? "Drag & drop or click here to change a file"
                  : "Drag & drop or click here to select a file"
              }
              uploadedLabel={"Drag & drop or click here to change a file"}
              disabled={singleUploadData.loading}
            />
          ) : (
            <Box
              component="img"
              sx={{
                width: "480px",
                height: "160px",
                border: "1px dashed #B1DACB",
                display: "block",
                borderRadius: "8px",
              }}
              // className="upload-outline"
              alt="Touranment Image"
              src={image}
            />
          )}

          {formDatas.file === "" && image === null && (
            <BackupOutlinedIcon
              sx={{
                position: "absolute",
                top: "30%",
                bottom: 0,
                left: "45%",
                right: 0,
                cursor: "pointer",
              }}
              onClick={handleFileUpload}
            />
          )}
        </Box>
      </Box>
      <CustomTextField
        name="tournamentName"
        placeholder="Enter Tournament Name"
        control={control}
        label="Tournament Name"
        rules={{ required: "Tournament Name is required" }}
        onKeyPress={(e) => {
          if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
            e.preventDefault();
          }
        }}
        inputProps={{ maxLength: 50 }}
      />
      <DropDown
        name="selectSport"
        label="Select Sport"
        control={control}
        defaultValue={editData && editData.selectSport}
        options={sportsOption}
        variant="outlined"
        required={true}
        disabled={isDisabled}
      />
      {errors.selectSport && (
        <Typography variant="caption" color="error">
          {errors.selectSport}
        </Typography>
      )}
      <Box mt={1.5}>
        <CustomRadioGroup
          name="tournamentType"
          control={control}
          label="Tournament Type"
          options={[
            { value: "internal", label: "Internal" },
            { value: "local", label: "Local" },
            { value: "international", label: "International" },
          ]}
          required={true}
        />
      </Box>
      <Box mt={1.5}>
        <CustomDatePicker
          control={control}
          name="trainingStartDate"
          label="Training Start Date"
          required={true}
          boxmb={0.8}
          onChange={trainingStartDateChange}
          defaultValue={(editData && editData.trainingStartDate) || date}
          rules={{
            required: "Training Start Date is required",
          }}
          minDate={moment().startOf("day")}
          maxDate={moment().add(10, "years")}
          setErrors={setDateError}
        />
      </Box>
      <Box mt={1.5}>
        <CustomDatePicker
          control={control}
          name="trainingEndDate"
          label="Training End Date"
          required={true}
          boxmb={0.8}
          onChange={trainingEndDateChange}
          defaultValue={editData && editData.trainingEndDate}
          rules={{
            required: "Training End Date is required",
          }}
          minDate={endDate}
          setErrors={setDateError}
        />
        {errors && errors.trainingEndDate ? (
          <Typography variant="caption" className="error-message">
            {errors.trainingEndDate}
          </Typography>
        ) : null}
      </Box>
      <CustomTextField
        name="organizerName"
        control={control}
        label="Organizer Name"
        onKeyPress={(e) => {
          if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
            e.preventDefault();
          }
        }}
      />
      <CustomTextField
        name="organizerEmail"
        control={control}
        label="Organizer Email"
        rules={{
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
            message: "Enter a valid email address",
          },
          maxLength: {
            value: 100,
            message: "Organizer Email cannot exceed 100 characters",
          },
        }}
      />

      <Grid item xs={12} md={12} mt={2}>
        <Typography gutterBottom className="typography textfield-label bukra">
          Organizer Contact Number
        </Typography>
        <Box className="Text-field-customise">
          <PhoneInput
            country={"ae"}
            value={`${formDatas.organizerContactCountryCode || ""}${
              formDatas.organizerContact || ""
            }`}
            onChange={handlePhoneNoChange}
            searchPlaceholder="Organizer Contact Number"
            autoFormat={false}
          />
        </Box>
      </Grid>
      <CustomTextField
        name="description"
        control={control}
        label="Description"
        textarea={true}
        onKeyPress={(e) => {
          if (!REGEX.ALPHA_NUMERIC.test(e.key)) {
            e.preventDefault();
          }
        }}
      />
      {snackbarStatus !== "" && (
        <CustomSnackbar
          message={
            snackbarStatus === "success"
              ? "Tournament  Added Successfully!"
              : "Something went wrong"
          }
          severity={snackbarStatus === "success" ? "success" : "error"}
          open={snackbarOpen}
          onClose={handleClose}
        />
      )}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 4 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          color="secondary"
          className="text-capitalize dubai-med"
          sx={{ height: "48px", fontSize: "16px" }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="text-capitalize dubai-med"
          sx={{ height: "48px", fontSize: "16px" }}
          disabled={
            (AddRaceCalendarResponse && AddRaceCalendarResponse?.loading) ||
            (UpdateRaceCalendarResponse && UpdateRaceCalendarResponse?.loading)
          }
        >
          {(AddRaceCalendarResponse && AddRaceCalendarResponse.loading) ||
          (UpdateRaceCalendarResponse &&
            UpdateRaceCalendarResponse?.loading) ? (
            <CircularProgress size={24} color="primary" />
          ) : !isEmpty(editData) && editData.tournamentID ? (
            "Update"
          ) : (
            "Save"
          )}
        </Button>
      </Box>
    </Box>
  );
};
export default TournamentForm;
