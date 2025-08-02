"use client";
import { useEffect, useState } from "react";
import {
  Grid,
  Box,
  Button,
  Typography,
  Fade,
  SnackbarCloseReason,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty, isEqual } from "lodash";
import { RootState, AppDispatch } from "@/redux/store";
import { useForm } from "react-hook-form";
import CustomTextField from "@/components/Fields/CustomTextField";
import FormWithSunEditor from "@/components/useFormSunEditor";
import { FileUploader } from "react-drag-drop-files";
import CustomSnackbar from "@/components/CustomSnackbar";
import {
  singleFileUpload,
  clearState,
} from "@/redux/slices/fileupload/singleFileUpload";
import { useRouter } from "next/router";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";
import DropDown from "@/components/Fields/DropDown";
import Uploadtravel from "../../../../public/travelUpload.svg";
import {
  addRules,
  clearRulesAddState,
} from "@/redux/slices/rules/RulesAddSlice";
import {
  updateRules,
  clearRulesUpdateState,
} from "@/redux/slices/rules/RulesUpdateSlice";
import {
  deleteFile,
  clearDeletFileState,
} from "@/redux/slices/fileupload/deleteFile";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

const CreateRulesForm = (props: any) => {
  const { edit, editRulesData, id, onClose, setIsUpdated } = props;
  const fileTypes = ["PDF"];
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [assignedSportsOption, setAssignedSportsOption] = useState<any>("");
  const rulesAddData = useSelector((state: RootState) => state.rulesAdd);
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const rulesUpdateData = useSelector(
    (state: any) => state && state.rulesUpdate
  );
  const getSportList = useSelector((state: any) => {
    return state.getSportList && state.getSportList?.data;
  });
  const fileDelete = useSelector((state: any) => state && state.fileDelete);

  const [formData, setFormData] = useState<any>({
    file: "",
    modulename: "Staff",
    moduleid: "1",
    section: "",

    description: "",
  });

  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      title: null,
      assignedSports: "",
      paragraph: null,
      shortDescription: "",
      uploadDocuments: "",
    },
  });
  const uploadDocuments = watch("uploadDocuments");

  const onSubmit = (data: any) => {
    if (edit) {
      const updatePayload: any = {
        title: data?.title,
        assignedSports: String(data?.assignedSports),
        paragraph: data?.paragraph,
        shortDescription: data?.shortDescription,
        rulesAndAgreementsID: Number(id),
        section: "rules",
      };
      dispatch(
        updateRules({
          url: "/UpdateRulesAndAgreementsByID",
          payload: updatePayload,
        })
      );
    } else {
      const payload: any = {
        title: data?.title,
        assignedSports: String(data?.assignedSports),
        paragraph: data?.paragraph,
        shortDescription: data?.shortDescription,
        section: "rules",
      };
      dispatch(
        addRules({
          url: "/InsertRulesAndAgreements",
          payload: payload,
        })
      );
    }
  };

  const handleFileUpload = () => {
    document.getElementById("file")?.click();
  };

  const handleChange = (file: any) => {
    if (file) {
      setValue("uploadDocuments", "");
      const fileName = file.name.toLowerCase();
      const uploadedFileSize = file.size;
      const fileSizeLimit = 25 * 1024 * 1024;
      if (fileName.endsWith(".jfif")) {
        setSnackbarOpen(true);
        setSnackbarStatus("error");
      } else {
        if (uploadedFileSize < fileSizeLimit) {
          setFormData({ ...formData, file: file });
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

  const handleSnackBarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleReset = () => {
    reset({
      title: "",
      assignedSports: null,
      paragraph: null,
      shortDescription: "",
      uploadDocuments: "",
    });
    setFormData({});
  };

  const handleCancel = () => {
    if (edit) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleDeleteFile = () => {
    if (uploadDocuments && uploadDocuments) {
      const data = {
        moduleName: "RulesAndAgreement",
        moduleID: Number(id && id),
        docSection: "rules",
        fileID:
          editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].rulesFileID,
      };
      dispatch(deleteFile(data));
    } else {
      setFormData({});
    }
  };

  useEffect(() => {
    if (fileDelete && fileDelete.status === "succeeded") {
      setFormData({});
      setValue("uploadDocuments", "");
      dispatch(clearDeletFileState());
    }
  }, [fileDelete]);

  useEffect(() => {
    const assignedSports: any = getDefaultOption(getSportList);
    setAssignedSportsOption(assignedSports);
  }, [getSportList]);

  const getDefaultOption = (AssignedSports: any) => {
    const defaultOptions = [];
    for (const item in AssignedSports) {
      defaultOptions.push({
        label: AssignedSports[item].sportName,
        value: AssignedSports[item].sportID,
        icon: AssignedSports[item].sportProfile,
      });
    }
    return defaultOptions;
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

  useEffect(() => {
    if (
      (rulesAddData && rulesAddData.code === 200) ||
      (rulesUpdateData && rulesUpdateData.code === 200)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      const data = new FormData();
      data.append("file", formData.file);
      data.append("modulename", "RulesAndAgreement");
      data.append(
        "moduleid",
        (rulesAddData &&
          rulesAddData.data &&
          rulesAddData.data?.rulesAndAgreementsID) ||
          (rulesUpdateData &&
            rulesUpdateData.data &&
            rulesUpdateData.data?.rulesAndAgreementsID)
      );
      data.append("section", "Rules");
      if (formData && formData.file && formData.file.name) {
        dispatch(singleFileUpload(data));
      }
      dispatch(clearRulesUpdateState());
      dispatch(clearRulesAddState());
      setTimeout(() => {
        if (edit) {
          setIsUpdated(true);
          onClose();
          setTimeout(() => {
            setIsUpdated(false);
          }, 1000);
        } else {
          router.back();
        }
      }, 1000);
    } else if (
      (rulesAddData && rulesAddData.code === 500) ||
      (rulesUpdateData && rulesUpdateData.code === 500)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearRulesUpdateState());
      dispatch(clearRulesAddState());
    } else if (
      (rulesAddData && rulesAddData.code === 409) ||
      (rulesUpdateData && rulesUpdateData.code === 409)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearRulesUpdateState());
        dispatch(clearRulesAddState());
      }, 2000);
    }
  }, [rulesAddData, rulesUpdateData]);

  useEffect(() => {
    if (editRulesData && editRulesData.code === 200) {
      setValue(
        "title",
        editRulesData && editRulesData?.data[0] && editRulesData?.data[0].title
      );
      setValue(
        "assignedSports",
        editRulesData &&
          editRulesData?.data[0] &&
          isEmpty(editRulesData?.data[0].assignedSports)
          ? ""
          : editRulesData?.data[0].assignedSports.split(",").map(Number)
      );
      setValue(
        "shortDescription",
        editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].shortDescription
      );
      setValue(
        "paragraph",
        editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].paragraph
      );
      setValue(
        "uploadDocuments",
        editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].rulesFilePath
      );
      setFormData({
        ...formData,
        file:
          editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].rulesFilePath,
      });
    }
  }, [editRulesData]);

  useEffect(() => {
    if (singleUploadData?.code === 200) {
      dispatch(clearState());
    }
  }, [singleUploadData]);

  return (
    <>
      {editRulesData && editRulesData?.loading ? (
        <EditFieldSkeleton isAvatar={true} />
      ) : (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={0}>
            {snackbarStatus !== "" && (
              <CustomSnackbar
                message={
                  snackbarStatus === "success"
                    ? `Rules & Agreements ${
                        edit ? "Updated" : "Added"
                      } successfully!`
                    : (rulesAddData && rulesAddData?.message) ||
                      (rulesUpdateData && rulesUpdateData?.message)
                }
                severity={snackbarStatus === "success" ? "success" : "error"}
                open={snackbarOpen}
                onClose={handleSnackBarClose}
              />
            )}
            {edit ? null : (
              <Grid
                item
                xs={12}
                sx={{
                  paddingX: "2rem",
                  textAlign: "end",
                }}
              >
                <Button
                  variant="outlined"
                  className="text-capitalize dubai-med"
                  color="secondary"
                  sx={{ height: "45px" }}
                  onClick={handleReset}
                >
                  Clear form
                </Button>
              </Grid>
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
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box width="100%">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Grid container spacing={2} justifyContent={"space-between"}>
                    <Grid item xs={12} md={12}>
                      <Grid
                        container
                        item
                        xs={12}
                        md={12}
                        spacing={2}
                        justifyContent={"space-between"}
                      >
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="title"
                            label="Title"
                            placeholder="Enter New Title"
                            control={control}
                            required={true}
                            rules={{
                              pattern: {
                                value: /^[a-zA-Z0-9\s,.()/-]*$/,
                                message:
                                  "Only Alphanumberic & hypens are allowed",
                              },
                              maxLength: {
                                value: 100,
                                message: "Title cannot exceed 100 characters",
                              },
                              required: "Title is required",
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <DropDown
                            name="assignedSports"
                            control={control}
                            label="Assigned Sports"
                            placeholder="Select Sports"
                            options={
                              assignedSportsOption && assignedSportsOption
                            }
                            multiple={true}
                            variant="outlined"
                            icon={true}
                            module="rules"
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <FormWithSunEditor
                            name="shortDescription"
                            control={control}
                            minHeight={"200px"}
                            label="Short Description"
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75} />
                        <Grid
                          item
                          xs={12}
                          md={12}
                          borderTop={"1px solid #008755"}
                          sx={{ mt: 5, ml: 2 }}
                        />
                        <Grid item xs={12} md={12}>
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
                            borderRadius={"8px"}
                          >
                            <FileUploader
                              handleChange={handleChange}
                              name="file"
                              types={fileTypes}
                              className="upload-outline"
                              label={
                                formData && formData.file
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
                                top: "49%",
                                left: "30%",
                                cursor: "pointer",
                                height: "50px",
                                width: "50px",
                              }}
                              onClick={handleFileUpload}
                            />
                            {(formData &&
                              formData.file &&
                              formData.file.name) ||
                            (uploadDocuments && uploadDocuments) ? (
                              <DeleteOutlinedIcon
                                style={{
                                  position: "absolute",
                                  top: "49%",
                                  right: "30%",
                                  cursor: "pointer",
                                  height: "20px",
                                  width: "20px",
                                }}
                                onClick={handleDeleteFile}
                              />
                            ) : null}
                            <Box
                              textAlign={"center"}
                              position={"absolute"}
                              bottom={"30%"}
                              right={
                                uploadDocuments ||
                                (formData &&
                                  formData?.file &&
                                  formData?.file?.name)
                                  ? "25%"
                                  : "30%"
                              }
                              className="dubai-regular secondary-color webkit-line-clamp webkit-1"
                              fontWeight={600}
                              fontSize={"14px"}
                              width={"40%"}
                            >
                              {(uploadDocuments && uploadDocuments) ||
                              (formData &&
                                formData?.file &&
                                formData?.file?.name) ? (
                                <Typography
                                  className={
                                    id &&
                                    formData &&
                                    formData?.file &&
                                    formData?.file?.name
                                      ? "dubai-med webkit-line-clamp webkit-1 primary-color"
                                      : "dubai-med webkit-line-clamp webkit-1"
                                  }
                                  sx={{ fontSize: "16px", fontWeight: "600" }}
                                >
                                  {uploadDocuments.split("/").pop() ||
                                    formData?.file?.name}
                                </Typography>
                              ) : (
                                "Supported formats: PDF"
                              )}
                            </Box>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={12}>
                          <FormWithSunEditor
                            name="paragraph"
                            control={control}
                            minHeight={"200px"}
                            label="Paragraph"
                            module={"news"}
                          />
                        </Grid>
                      </Grid>
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
                      sx={{ mr: 1 }}
                      onClick={handleCancel}
                      className="cancel-button text-capitalize dubai-med"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize dubai-med cancel-button"
                      disabled={
                        rulesAddData.loading || rulesUpdateData?.loading
                      }
                      onClick={handleSubmit(onSubmit)}
                    >
                      {rulesAddData.loading || rulesUpdateData?.loading ? (
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
          </Grid>
        </Fade>
      )}
    </>
  );
};
export default CreateRulesForm;
