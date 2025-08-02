import CustomTextField from "@/components/Fields/CustomTextField";
import DropDown from "@/components/Fields/DropDown";
import FormWithSunEditor from "@/components/useFormSunEditor";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Uploadtravel from "../../../../public/travelUpload.svg";
import { AppDispatch, RootState } from "@/redux/store";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import {
  addResearchAndFacilities,
  clearResearchAndFacilitiesAddState,
} from "@/redux/slices/researchFacilities/researchFacilitiesAddSlice";
import {
  singleFileUpload,
  clearState,
} from "@/redux/slices/fileupload/singleFileUpload";
import { useRouter } from "next/router";
import CustomSnackbar from "@/components/CustomSnackbar";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import {
  clearResearchAndFacilitiesUpdateState,
  updateResearchAndFacilities,
} from "@/redux/slices/researchFacilities/researchFacilitiesUpdateSlice";
import { CircularProgress, Fade } from "@mui/material";
import EditFieldSkeleton from "@/components/trainingCamp/skeleton/editSkeletont";

const CreateResearchForm = (props: any) => {
  const dispatch: AppDispatch = useDispatch();
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const getSportList = useSelector((state: any) => {
    return state.getSportList && state.getSportList?.data;
  });
  const researchAddData = useSelector(
    (state: RootState) => state.addResearchAndFacilities
  );
  const researchUpdateData = useSelector(
    (state: RootState) => state.updateResearchAndFacilities
  );
  const router = useRouter();
  const { edit, editResearchFacilitiesData, id, onClose, setIsUpdated } = props;
  const { handleSubmit, control, reset, setValue, watch } = useForm<any>({
    defaultValues: {
      researchTitle: null,
      assignedSports: "",
      shortDescription: "",
      uploadDocuments: "",
      paragraph: null,
    },
  });

  const [assignedSportsOption, setAssignedSportsOption] = useState<any>("");
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const fileTypes = ["PDF", "doc"];

  const [formData, setFormData] = useState<any>({
    file: "",
    modulename: "Research",
    moduleid: "1",
    section: "",

    description: "",
  });

  const uploadDocuments = watch("uploadDocuments");

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
            `File size must below ${fileSizeLimit / 1048576
            } MB!. You file size is : ${Math.round(uploadedFileSize / 1024)}KB`
          );
        }
      }
    }
  };

  const onSubmit = (data: any) => {
    if (edit) {
      const updatePayload: any = {
        researchID: Number(id),
        researchTitle: data?.researchTitle,
        assignedSports: String(data?.assignedSports),
        shortDescription: data?.shortDescription,
        paragraph: data?.paragraph,
      };
      dispatch(
        updateResearchAndFacilities({
          url: "/UpdateResearchByID",
          payload: updatePayload,
        })
      );
    } else {
      const payload: any = {
        researchTitle: data?.researchTitle,
        assignedSports: String(data?.assignedSports),
        shortDescription: data?.shortDescription,
        paragraph: data?.paragraph,
      };
      dispatch(
        addResearchAndFacilities({
          url: "/InsertResearch",
          payload: payload,
        })
      );
    }
  };

  const doFileUpload = (researchID: number) => {
    const data = new FormData();
    data.append("file", formData.file);
    data.append("modulename", "Research");
    data.append("moduleid", String(researchID));
    data.append("section", "ResearchImage");
    if (formData && formData.file && formData.file.name) {
      dispatch(singleFileUpload(data));
    }
  };

  useEffect(() => {
    if (
      (researchAddData && researchAddData.code === 200) ||
      (researchUpdateData && researchUpdateData.code === 200)
    ) {
      // handling response for add flow
      if (researchAddData && researchAddData.code === 200) {
        setSnackbarOpen(true);
        setSnackbarStatus("success");
        doFileUpload(
          researchAddData &&
          researchAddData.data &&
          researchAddData.data?.researchID
        );
        setTimeout(() => {
          dispatch(clearResearchAndFacilitiesAddState());
          router.push(`/researchAndFacilities?module=research`);
        }, 3000);
      } else if (
        edit &&
        researchUpdateData &&
        researchUpdateData.code === 200
      ) {
        setSnackbarOpen(true);
        setSnackbarStatus("success");
        doFileUpload(
          researchUpdateData &&
          researchUpdateData.data &&
          researchUpdateData.data?.researchID
        );
        setTimeout(() => {
          dispatch(clearResearchAndFacilitiesUpdateState());
          setIsUpdated(true);
          onClose();
        }, 3000);
        setTimeout(() => {
          setIsUpdated(false);
        }, 4000);
      }
    } else if (
      (researchAddData && researchAddData.code === 500) ||
      (researchUpdateData && researchUpdateData.code === 500)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      dispatch(clearResearchAndFacilitiesUpdateState());
      dispatch(clearResearchAndFacilitiesAddState());
    } else if (
      (researchAddData && researchAddData.code === 409) ||
      (researchUpdateData && researchUpdateData.code === 409)
    ) {
      setSnackbarOpen(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearResearchAndFacilitiesUpdateState());
        dispatch(clearResearchAndFacilitiesAddState());
      }, 2000);
    }
  }, [researchAddData, researchUpdateData]);

  useEffect(() => {
    if (editResearchFacilitiesData && editResearchFacilitiesData.code === 200) {
      setValue(
        "researchTitle",
        editResearchFacilitiesData &&
        editResearchFacilitiesData?.data[0] &&
        editResearchFacilitiesData?.data[0].researchTitle
      );
      setValue(
        "assignedSports",
        editResearchFacilitiesData &&
          editResearchFacilitiesData?.data[0] &&
          isEmpty(editResearchFacilitiesData?.data[0].assignedSports)
          ? ""
          : editResearchFacilitiesData?.data[0].assignedSports
            .split(",")
            .map(Number)
      );
      setValue(
        "shortDescription",
        editResearchFacilitiesData &&
        editResearchFacilitiesData?.data[0] &&
        editResearchFacilitiesData?.data[0].shortDescription
      );
      setValue(
        "paragraph",
        editResearchFacilitiesData &&
        editResearchFacilitiesData?.data[0] &&
        editResearchFacilitiesData?.data[0].paragraph
      );
      setValue(
        "uploadDocuments",
        editResearchFacilitiesData &&
        editResearchFacilitiesData?.data[0] &&
        editResearchFacilitiesData?.data[0].researchFilePath
      );
      setFormData({
        ...formData,
        file:
          editResearchFacilitiesData &&
          editResearchFacilitiesData?.data[0] &&
          editResearchFacilitiesData?.data[0].researchFilePath,
      });
    }
  }, [editResearchFacilitiesData]);

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
      researchTitle: "",
      assignedSports: [],
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
      router.push(`/researchAndFacilities`);
    }
  };

  return (
    <>
      {editResearchFacilitiesData && editResearchFacilitiesData?.loading ? (
        <EditFieldSkeleton isAvatar={true} />
      ) : (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={0}>
            {snackbarStatus !== "" && (
              <CustomSnackbar
                message={
                  snackbarStatus === "success"
                    ? `Research ${edit ? "Updated" : "Added"} successfully!`
                    : (researchAddData && researchAddData?.message) ||
                    (researchUpdateData && researchUpdateData?.message)
                }
                severity={snackbarStatus === "success" ? "success" : "error"}
                open={snackbarOpen}
                onClose={handleSnackBarClose}
              />
            )}
            <Grid container spacing={0}>
              {edit ? null : (
                <Grid
                  item
                  xs={12}
                  sx={{
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
                    <Grid
                      container
                      spacing={2}
                      justifyContent={"space-between"}
                    >
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
                              name="researchTitle"
                              label="Research Title"
                              placeholder="Enter Research Title"
                              control={control}
                              required={true}
                              rules={{
                                pattern: {
                                  value: /^[a-zA-Z0-9\s,.()/:-]*$/,
                                  message:
                                    "Only Alphanumberic & hypens are allowed",
                                },
                                maxLength: {
                                  value: 100,
                                  message:
                                    "Research Title cannot exceed 100 characters",
                                },
                                required: "Research Title is required",
                              }}
                            />
                          </Grid>
                          <Grid item xs={12} md={5.75}>
                            <DropDown
                              name="assignedSports"
                              control={control}
                              label="Assigned Sports"
                              placeholder="Select Sports"
                              options={assignedSportsOption}
                              multiple={true}
                              variant="outlined"
                              icon={true}
                              module="research"
                            />
                          </Grid>
                          <Grid item xs={12} md={5.75}>
                            <CustomTextField
                              name="shortDescription"
                              label="Short Description"
                              placeholder="Enter Short Description"
                              control={control}
                              required={true}
                              rules={{
                                pattern: {
                                  value: /^[a-zA-Z0-9\s,.()/:-]*$/,
                                  message:
                                    "Only Alphanumberic & hypens are allowed",
                                },
                                maxLength: {
                                  value: 100,
                                  message:
                                    "Short Description cannot exceed 100 characters",
                                },
                                required: "Short Description is required",
                              }}
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
                              {/* {(formData &&
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
                            }} */}
                              {/* onClick={handleDeleteFile} */}
                              {/* />
                        ) : null} */}
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
                                        ? "dubai-med primary-color"
                                        : "dubai-med"
                                    }
                                    sx={{ fontSize: "16px", fontWeight: "600" }}
                                  >
                                    {uploadDocuments.split("/").pop() ||
                                      formData?.file?.name}
                                  </Typography>
                                ) : (
                                  "Supported formats: PDF, DOC"
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
                        sx={{ mr: 1, paddingX: "16px" }}
                        onClick={handleCancel}
                        className="cancel-button text-capitalize dubai-med"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        className="text-capitalize dubai-med cancel-button"
                        sx={{ paddingX: "16px" }}
                        disabled={
                          researchAddData.loading || researchUpdateData?.loading
                        }
                        onClick={handleSubmit(onSubmit)}
                      >
                        {researchAddData.loading ||
                          researchUpdateData?.loading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : edit ? (
                          "Update"
                        ) : (
                          "Save & Publish"
                        )}
                      </Button>
                    </Box>
                  </form>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Fade>
      )}
    </>
  );
};
export default CreateResearchForm;
