"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import DropDown from "@/components/Fields/DropDown";
import CustomTextField from "@/components/Fields/CustomTextField";
import CustomRadioGroup from "../../Fields/CustomRadioGroup";
import TrainingCampCustomDatePicker from "../../../components/trainingCamp/trainingCampCustomDatePicker";
import moment from "moment";
import FormWithSunEditor from "@/components/useFormSunEditor";
import {
  Button,
  FormControl,
  MenuItem,
  Select,
  Typography,
  CircularProgress,
  IconButton,
  InputAdornment,
  Fade,
} from "@mui/material";
import { FileUploader } from "react-drag-drop-files";
import Uploadtravel from "../../../../public/travelUpload.svg";
import _, { isEmpty } from "lodash";
import dayjs from "dayjs";
import { getLocalStorage } from "@/utils/helper";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  addTeamRequirement,
  clearAddState,
} from "@/redux/slices/teamRequirement/teamRequirementAddSlice";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getListForTypeDropDownAPI } from "@/redux/slices/teamRequirement/getListForTypeDropDown";
import {
  singleFileUpload,
  clearState,
} from "@/redux/slices/fileupload/singleFileUpload";
import { getTeamRequirementListAPI } from "@/redux/slices/teamRequirement/getTeamRequirementListSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import {
  clearTeamRequirementUpdateState,
  updateTeamRequirement,
} from "@/redux/slices/teamRequirement/teamRequirementUpdateSlice";
import CloseIcon from "@mui/icons-material/Close";
import TeamRequirementEditFieldSkeleton from "../skeleton/teamRequirementEditSkeleton";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const TeamRequirementsAdd = (props: any) => {
  const { edit, getTeamRequirementByIDData, id, onClose, setIsUpdated } = props;
  const router = useRouter();
  const [errors, setErrors] = useState<any>({});
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const fileTypes = ["JPG", "PNG", "pdf", "doc"];
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<any>();
  const dispatch: AppDispatch = useDispatch();
  const [formData, setFormData] = useState<any>({
    type: "",
    customType: "",
    requiredName: "",
    teamAssigned: null,
    quantity: "",
    priorityLevel: null,
    requiredOn: null,
    justification: null,
    description: null,
  });

  const [formData1, setFormData1] = useState<any>({
    file: "",
    modulename: "teamrequirement",
    moduleid: "1",
    section: "",

    description: "",
  });

  const [isDisabled, setIsDisabled] = useState(false);
  const { teamID } = router.query;
  const getCurrentSport: any = getLocalStorage("sport");
  const [fileName, setFileName] = useState("");
  const [showBanner, setShowBanner] = useState(false);

  const getSportList = useSelector((state: any) => {
    return state.getSportList;
  });

  const getListForTypeDropDown = useSelector((state: any) => {
    return state.getListForTypeDropDown;
  });

  const TeamRequirementAdd = useSelector(
    (state: RootState) => state?.addTeamRequirement
  );

  const TeamRequirementUpdateData = useSelector(
    (state: any) => state && state.updateTeamRequirement
  );

  const handleCancel = () => {
    if (edit) {
      onClose();
    } else {
      router.push(`/teams/${getCurrentSport}/teamRequirements`);
    }
  };

  const getDefaultOption1 = (requirementTypeNames: any) => {
    const defaultOptions = [];
    for (const item in requirementTypeNames) {
      defaultOptions.push({
        label: requirementTypeNames[item].typeValue,
        value: requirementTypeNames[item].typeID,
      });
    }
    return defaultOptions;
  };

  const typeDropDownOption = getDefaultOption1(getListForTypeDropDown.data);

  useEffect(() => {
    if (!_.isEmpty(teamID)) {
      const payloads = {};
      dispatch(getListForTypeDropDownAPI(payloads));
    }
  }, [teamID]);

  useEffect(() => {
    if (teamID && getSportList?.data?.length) {
      const matchedSport = getSportList.data.find(
        (sport: any) => sport.sportID === Number(teamID)
      );
      if (matchedSport) {
        setValue("teamAssigned", matchedSport.sportName);
        setIsDisabled(true);
      } else {
        setIsDisabled(false);
      }
    }
  }, [teamID, getSportList]);

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

  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        type: "",
        customType: "",
        requiredName: "",
        teamAssigned: null,
        quantity: "",
        priorityLevel: null,
        requiredOn: null,
        justification: null,
        description: null,
        uploadBudget: "",
      },
    });

  const uploadBudget = watch("uploadBudget");
  const type = watch("type");

  const clearData = () => {
    reset({
      type: "",
      customType: "",
      requiredName: "",
      quantity: "",
      priorityLevel: null,
      requiredOn: null,
      justification: null,
      description: null,
      uploadBudget: "",
    });
    setFormData1({});
  };

  const timeChange = (event: any) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      type: value,
    });
    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    if (getTeamRequirementByIDData?.data[0]?.typeValue === "Custom") {
      setIsCustom(true);
    } else {
      setIsCustom(false);
    }
  }, [edit, getTeamRequirementByIDData]);

  useEffect(() => {
    if (
      type ===
      typeDropDownOption.find((option) => option.label === "Custom")?.value
    ) {
      setIsCustom(true);
      setValue("type", type);
    }
  }, [type, setValue]);

  const onSubmit = (data: any) => {
    if (edit) {
      const payload: any = {
        teamRequirementID: Number(id),
        sportID: Number(teamID),
        type:
          Array.isArray(type) && type.length > 0
            ? String(type[0])
            : String(type),
        requirementName: data?.requiredName,
        teamAssigned: data?.teamAssigned,
        quantityRequired: data?.quantity,
        priorityLevel: data?.priorityLevel,
        requiredDate: dayjs(data?.requiredOn).format("DD-MM-YYYY"),
        justification: data?.justification,
        description: data?.description,
        customType: data?.customType,
      };

      dispatch(
        updateTeamRequirement({ url: "/UpdateTeamRequirementsByID", payload })
      );
    } else {
      const payload: any = {
        sportID: Number(teamID),
        type: data?.type?.toString() || type,
        requirementName: data?.requiredName,
        teamAssigned: data?.teamAssigned,
        quantityRequired: data?.quantity,
        priorityLevel: data?.priorityLevel,
        requiredDate: dayjs(data?.requiredOn).format("DD-MM-YYYY"),
        justification: data?.justification,
        description: data?.description,
        customType: data?.customType,
      };
      dispatch(addTeamRequirement({ url: "/InsertTeamRequirements", payload }));
    }
  };

  useEffect(() => {
    if (
      (TeamRequirementAdd && TeamRequirementAdd.code === 200) ||
      (TeamRequirementUpdateData && TeamRequirementUpdateData.code === 200)
    ) {
      setShowBanner(true);
      setSnackbarStatus("success");
      clearData();
      if (formData1 && formData1.file && formData1.file.name) {
        const data = new FormData();
        data.append("file", formData1.file);
        data.append("modulename", "teamrequirement");
        data.append(
          "moduleid",
          (TeamRequirementAdd &&
            TeamRequirementAdd.data &&
            TeamRequirementAdd.data?.teamRequirementID) ||
            (TeamRequirementUpdateData &&
              TeamRequirementUpdateData.data &&
              TeamRequirementUpdateData.data?.teamRequirementID)
        );
        data.append("section", "budget");
        dispatch(singleFileUpload(data));
      }
      dispatch(clearTeamRequirementUpdateState());
      dispatch(clearAddState());

      setTimeout(() => {
        if (edit) {
          setIsUpdated(true);
          onClose();
          setTimeout(() => {
            setIsUpdated(false);
          }, 1000);
        } else {
          router.push(`/teams/${teamID}/teamRequirements`);
        }
      }, 1000);
    } else if (
      (TeamRequirementAdd && TeamRequirementAdd.code === 500) ||
      (TeamRequirementUpdateData && TeamRequirementUpdateData.code === 500)
    ) {
      setShowBanner(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearTeamRequirementUpdateState());
        dispatch(clearAddState());
        setShowBanner(false);
      }, 3000);
    }
  }, [TeamRequirementAdd, TeamRequirementUpdateData]);

  const handleFileUpload = () => {
    document.getElementById("file")?.click();
  };

  const handleFileChange = (file: any) => {
    if (file) {
      setValue("uploadBudget", "");
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      const uploadedFileSize = file.size;
      const fileSizeLimit = 25 * 1024 * 1024;
      if (fileName.endsWith(".jfif")) {
        setSnackbarOpen(true);
        setSnackbarStatus("error");
      } else {
        if (uploadedFileSize < fileSizeLimit) {
          setFormData1({ ...formData1, file: file });
          setErrors({ ...errors, file: "" });
          setFileName(file.name);
        } else {
          setSnackbarOpen(true);
          setSnackbarStatus(
            `File size must below ${
              fileSizeLimit / 1048576
            } MB!. You file size is : ${Math.round(uploadedFileSize / 1024)}KB`
          );
        }
      }
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setShowBanner(false);
  };

  useEffect(() => {
    if (getTeamRequirementByIDData && getTeamRequirementByIDData.code === 200) {
      setValue(
        "type",
        getTeamRequirementByIDData &&
          getTeamRequirementByIDData?.data[0] &&
          isEmpty(getTeamRequirementByIDData?.data[0].type)
          ? ""
          : getTeamRequirementByIDData?.data[0]?.type?.split(",").map(Number)
      );
      setValue(
        "customType",
        getTeamRequirementByIDData &&
          getTeamRequirementByIDData?.data[0] &&
          getTeamRequirementByIDData?.data[0].customType
      );
      setValue(
        "requiredName",
        getTeamRequirementByIDData &&
          getTeamRequirementByIDData?.data[0] &&
          getTeamRequirementByIDData?.data[0].requirementName
      );
      setValue(
        "teamAssigned",
        getTeamRequirementByIDData &&
          getTeamRequirementByIDData?.data[0] &&
          getTeamRequirementByIDData?.data[0].teamAssigned
      );

      setValue(
        "quantity",
        getTeamRequirementByIDData &&
          getTeamRequirementByIDData?.data[0] &&
          getTeamRequirementByIDData?.data[0].quantityRequired
      );
      setValue(
        "priorityLevel",
        getTeamRequirementByIDData &&
          getTeamRequirementByIDData?.data[0] &&
          getTeamRequirementByIDData?.data[0].priorityLevel
      );
      setValue(
        "requiredOn",
        getTeamRequirementByIDData?.data[0]?.requiredDate === "-"
          ? null
          : moment(
              getTeamRequirementByIDData?.data[0]?.requiredDate,
              "DD/MM/YYYY"
            )
      );
      setValue(
        "justification",
        getTeamRequirementByIDData &&
          getTeamRequirementByIDData?.data[0] &&
          getTeamRequirementByIDData?.data[0].justification
      );
      setValue(
        "description",
        getTeamRequirementByIDData &&
          getTeamRequirementByIDData?.data[0] &&
          getTeamRequirementByIDData?.data[0].description
      );
      setValue(
        "uploadBudget",
        getTeamRequirementByIDData &&
          getTeamRequirementByIDData?.data[0] &&
          getTeamRequirementByIDData?.data[0].budgetFilePath
      );
      setFormData1({
        ...formData1,
        file:
          getTeamRequirementByIDData &&
          getTeamRequirementByIDData?.data[0] &&
          getTeamRequirementByIDData?.data[0].budgetFilePath,
      });
    }
  }, [getTeamRequirementByIDData]);

  const handleCloseCustomType = () => {
    setIsCustom(false);
    setValue("customType", "");
    setValue("type", "");
  };

  return (
    <>
      {getTeamRequirementByIDData && getTeamRequirementByIDData?.loading ? (
        <TeamRequirementEditFieldSkeleton isAvatar={true} />
      ) : (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={0}>
            {showBanner && (
              <CustomSnackbar
                message={
                  snackbarStatus === "success"
                    ? `Team Requirement ${
                        edit ? "Updated" : "Added"
                      } successfully!`
                    : (TeamRequirementAdd && TeamRequirementAdd?.message) ||
                      (TeamRequirementUpdateData &&
                        TeamRequirementUpdateData?.message)
                }
                severity={snackbarStatus === "success" ? "success" : "error"}
                open={showBanner}
                onClose={handleClose}
              />
            )}
            <Box sx={{ width: "100%", p: 5 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                {edit ? null : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <Button
                      variant="outlined"
                      color="secondary"
                      sx={{ height: "48px" }}
                      onClick={() => {
                        clearData();
                      }}
                      className="text-capitalize dubai-med"
                    >
                      Clear form
                    </Button>
                  </Box>
                )}
                <Grid
                  container
                  item
                  xs={12}
                  md={12}
                  spacing={2}
                  justifyContent={"space-between"}
                  component={"form"}
                >
                  <Grid item xs={12} md={5.75} mt={0.5}>
                    {!isCustom && (
                      <>
                        <Typography
                          gutterBottom
                          className="typography textfield-label bukra"
                        >
                          Type
                          <span style={{ color: "#E4002B", marginLeft: "4px" }}>
                            *
                          </span>
                        </Typography>

                        <FormControl
                          variant="outlined"
                          fullWidth
                          className="selectFieldContainer"
                        >
                          <Controller
                            name="type"
                            control={control}
                            defaultValue=""
                            rules={{
                              required: "Type is required",
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <Select
                                  {...field}
                                  displayEmpty
                                  className="Text-field-customise"
                                  IconComponent={() => (
                                    <ExpandMoreIcon
                                      style={{
                                        marginRight: "10px",
                                        color: "#b6afaf",
                                      }}
                                    />
                                  )}
                                  onChange={(e) => {
                                    field.onChange(e);
                                    timeChange(e);
                                  }}
                                >
                                  <MenuItem value="" disabled>
                                    <Typography
                                      style={{
                                        color: error ? "#d32f2f" : "#b6afaf",
                                        height: 27,
                                        fontSize: "16px",
                                        fontWeight: 500,
                                        lineHeight: "25.01px",
                                        textAlign: "left",
                                        marginLeft: 0,
                                      }}
                                      className="dubai-med"
                                    >
                                      Select Type
                                    </Typography>
                                  </MenuItem>
                                  {typeDropDownOption.map((option: any) => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      <Typography
                                        style={{
                                          height: 27,
                                          fontSize: "16px",
                                          fontWeight: 500,
                                          lineHeight: "25.01px",
                                          textAlign: "left",
                                          marginLeft: 10,
                                        }}
                                        className="dubai-med"
                                      >
                                        {option.label}
                                      </Typography>
                                    </MenuItem>
                                  ))}
                                </Select>
                                {error && (
                                  <Typography
                                    sx={{
                                      color: "#d32f2f",
                                      fontSize: "12px",
                                      marginTop: "4px !important",
                                    }}
                                    className="dubai-med"
                                  >
                                    Type is Required
                                  </Typography>
                                )}
                              </>
                            )}
                          />
                        </FormControl>
                      </>
                    )}
                    {isCustom && (
                      <Box sx={{ width: "100%" }}>
                        <Typography
                          gutterBottom
                          className="typography textfield-label bukra"
                        >
                          Custom Type
                          <span style={{ color: "#E4002B", marginLeft: "4px" }}>
                            *
                          </span>
                        </Typography>
                        <Box sx={{ display: "flex" }}>
                          <CustomTextField
                            name="customType"
                            placeholder="Enter Custom Type"
                            control={control}
                            required={true}
                            fullWidth
                            sx={{ flexGrow: 1, mr: 17 }}
                            rules={{
                              pattern: {
                                value: /^[a-zA-Z ()&-]+$/,
                                message:
                                  "Only alphabets, parentheses, hyphens, and ampersands are allowed",
                              },
                              maxLength: {
                                value: 100,
                                message:
                                  "Custom Type cannot exceed 100 characters",
                              },
                              required: "Custom Type is required",
                            }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={handleCloseCustomType}
                                    size="small"
                                  >
                                    <CloseIcon />
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Box>
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={5.75}>
                    <CustomTextField
                      name="requiredName"
                      label="Requirement Name"
                      placeholder="Enter Requirement Name"
                      control={control}
                      required={true}
                      rules={{
                        pattern: {
                          value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                          message: "Only Alphanumberic & hypens are allowed",
                        },
                        maxLength: {
                          value: 50,
                          message:
                            "Requirement Name cannot exceed 50 characters",
                        },
                        required: "Requirement Name is required",
                      }}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={5.75}
                    sx={{
                      pb: 1,
                    }}
                  >
                    <CustomTextField
                      name="teamAssigned"
                      label="Team Assigned"
                      placeholder="Team Assigned"
                      control={control}
                      disabled={isDisabled}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <CustomTextField
                      name="quantity"
                      label="Quantity Required"
                      placeholder="Enter how many items are needed."
                      control={control}
                      // required={true}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      inputProps={{ maxLength: 10 }}
                      rules={{
                        pattern: {
                          value: /^[1-9][0-9]{0,9}$/,
                          message:
                            "Quantity Required accepts only numbers and cannot start with 0.",
                        },
                        maxLength: {
                          value: 10,
                          message: "Quantity Required cannot exceed 10 digits",
                        },
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <CustomRadioGroup
                      name="priorityLevel"
                      control={control}
                      label="Priority Level"
                      options={[
                        { value: "High", label: "High" },
                        { value: "Medium", label: "Medium" },
                        { value: "Low", label: "Low" },
                      ]}
                      required={true}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <TrainingCampCustomDatePicker
                      control={control}
                      name="requiredOn"
                      label="Required On"
                      boxmb={0.8}
                      required={true}
                      minDate={moment().add(15, "days")}
                      maxDate={moment().add(10, "years")}
                      className="Text-field-customise"
                      rules={{
                        required: "Required On is required",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <FormWithSunEditor
                      name="justification"
                      control={control}
                      minHeight={"200px"}
                      label="Justification"
                      placeholder="Enter Text"
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <FormWithSunEditor
                      name="description"
                      control={control}
                      minHeight={"200px"}
                      label="Description"
                      placeholder="Enter details of the required item( eg: like size, material, brand)"
                    />
                  </Grid>
                  <Grid item xs={12} md={5.75}>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: "14px" }}
                      className="typography textfield-label bukra"
                      mt={1.5}
                      mb={0.5}
                    >
                      Upload Document
                    </Typography>
                    <Box
                      border={"1px dashed #008755"}
                      bgcolor={"rgba(0, 135, 85, 0.03)"}
                      className="upload-travel"
                      position={"relative"}
                    >
                      <FileUploader
                        key={fileName}
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
                          top: "20%",
                          bottom: 0,
                          left: "45%",
                          right: 0,
                          cursor: "pointer",
                          height: "50px",
                          width: "50px",
                        }}
                        onClick={handleFileUpload}
                      />
                      <Box>
                        {(uploadBudget && uploadBudget) ||
                        (formData1 &&
                          formData1?.file &&
                          formData1?.file?.name) ? (
                          <Typography
                            className={
                              id &&
                              formData &&
                              formData?.file &&
                              formData?.file?.name
                                ? "dubai-med webkit-line-clamp webkit-1 primary-color"
                                : "dubai-med webkit-line-clamp webkit-1"
                            }
                            position={"absolute"}
                            bottom={"25%"}
                            textAlign={"center"}
                            fontWeight={600}
                            fontSize={"16px"}
                            width={"100%"}
                          >
                            {uploadBudget.split("/").pop() ||
                              formData1?.file?.name}
                          </Typography>
                        ) : (
                          <Typography
                            textAlign={"center"}
                            position={"absolute"}
                            bottom={"30%"}
                            fontWeight={600}
                            fontSize={"14px"}
                            width={"100%"}
                          >
                            "Supported formats: JPEG, PNG, PDF, Word"
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginY: "1.5rem",
                  }}
                >
                  <Button
                    variant="outlined"
                    color="secondary"
                    sx={{
                      mr: 1,
                      fontSize: "16px",
                      width: "112px",
                      height: "48px",
                      borderRadius: "4px",
                      gap: "0px",
                    }}
                    onClick={handleCancel}
                    className="cancel-button text-capitalize dubai-med"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className="text-capitalize dubai-med cancel-button"
                    sx={{
                      fontSize: "16px",
                      width: "112px",
                      height: "48px",
                      borderRadius: "4px",
                      gap: "0px",
                    }}
                    disabled={
                      TeamRequirementAdd.loading || TeamRequirementAdd?.loading
                    }
                    onClick={handleSubmit(onSubmit)}
                  >
                    {TeamRequirementAdd.loading ||
                    TeamRequirementAdd?.loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : edit ? (
                      "Update"
                    ) : (
                      "Save"
                    )}
                  </Button>
                </Box>
              </form>
            </Box>
          </Grid>
        </Fade>
      )}
    </>
  );
};
export default TeamRequirementsAdd;
