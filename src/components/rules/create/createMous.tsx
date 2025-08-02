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
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import _, { isEmpty } from "lodash";
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
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import Uploadtravel from "../../../../public/travelUpload.svg";
import {
  addRules,
  clearRulesAddState,
} from "@/redux/slices/rules/RulesAddSlice";
import {
  updateRules,
  clearRulesUpdateState,
} from "@/redux/slices/rules/RulesUpdateSlice";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import moment from "moment";
import PartyAddMore from "./addMore/partyAddMore";
import dayjs from "dayjs";
import { addParty } from "@/redux/slices/rules/PartyAddSlice";
import {
  deleteFile,
  clearDeletFileState,
} from "@/redux/slices/fileupload/deleteFile";

const CreateMousForm = (props: any) => {
  const { edit, editRulesData, id, onClose, setIsUpdated } = props;
  const fileTypes = ["PDF"];
  const tablePartyHeaders = [
    "Party Name",
    "Party Address",
    "Representative",
    "Designation",
    "Actions",
  ];
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [minEndDate, setMinEndDate] = useState(moment());
  const [partyData, setPartyData] = useState<any>([]);
  const [addPartyData, setAddPartyData] = useState<any>([]);
  const [showPartyData, setShowPartyData] = useState<any>(false);
  const [partySelectedData, setPartySelectedData] = useState<any>({});
  const [resetForm, setResetForm] = useState(false);
  const rulesAddData = useSelector((state: RootState) => state.rulesAdd);
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const rulesUpdateData = useSelector(
    (state: any) => state && state.rulesUpdate
  );
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
      intentOfMou: null,
      fromDate: null,
      toDate: null,
      disclaimers: null,
      risksSharing: null,
      financialsIfAny: null,
      paragraph: null,
      uploadDocuments: "",
    },
  });
  const uploadDocuments = watch("uploadDocuments");
  const fromDate = watch("fromDate");
  const toDate = watch("toDate");

  const onSubmit = (data: any) => {
    if (edit) {
      setValue("uploadDocuments", "");
      const updatePayload: any = {
        title: data?.title,
        intentOfMou: data?.intentOfMou,
        fromDate: dayjs(data?.fromDate).format("DD/MM/YYYY"),
        toDate: dayjs(data?.toDate).format("DD/MM/YYYY"),
        disclaimers: data?.disclaimers,
        risksSharing: data?.risksSharing,
        financialsIfAny: data?.financialsIfAny,
        paragraph: data?.paragraph,
        mouAndPartnershipID: Number(id),
        section: "mou",
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
        intentOfMou: data?.intentOfMou,
        fromDate: dayjs(data?.fromDate).format("DD/MM/YYYY"),
        toDate: dayjs(data?.toDate).format("DD/MM/YYYY"),
        disclaimers: data?.disclaimers,
        risksSharing: data?.risksSharing,
        financialsIfAny: data?.financialsIfAny,
        paragraph: data?.paragraph,
        section: "mou",
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
    setValue("uploadDocuments", "");
    if (file) {
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
      intentOfMou: "",
      fromDate: null,
      toDate: null,
      disclaimers: null,
      risksSharing: null,
      financialsIfAny: null,
      paragraph: null,
      uploadDocuments: "",
    });
    setFormData({});
    setResetForm(true);
  };

  const handleCancel = () => {
    if (edit) {
      onClose();
    } else {
      router.back();
    }
  };

  const handleDeleteTraining = (item: any) => {
    setPartyData(
      partyData &&
        partyData.filter((party: any) => party.partyName !== item?.partyName)
    );
    setPartySelectedData(
      partyData &&
        partyData.filter((party: any) => party.partyName === item?.partyName)
    );
  };

  const handleDeleteFile = () => {
    if (uploadDocuments && uploadDocuments) {
      const data = {
        moduleName: "RulesAndAgreement",
        moduleID: Number(id && id),
        docSection: "Mou",

        fileID:
          editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].mouFileID,
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
    setMinEndDate(moment(fromDate, "DD/MM/YYYY"));
  }, [fromDate]);

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
          rulesAddData.data?.mouAndPartnershipID) ||
          (rulesUpdateData &&
            rulesUpdateData.data &&
            rulesUpdateData.data?.mouAndPartnershipID)
      );
      data.append("section", "Mou");
      if (formData && formData.file && formData.file.name) {
        dispatch(singleFileUpload(data));
      }
      dispatch(clearRulesUpdateState());
      dispatch(clearRulesAddState());
      const payload: any = {
        mouAndPartnershipID:
          (rulesAddData &&
            rulesAddData.data &&
            rulesAddData.data?.mouAndPartnershipID) ||
          id,

        rulesAndAgreementParty:
          partyData?.length > 0 ? partyData : addPartyData,
      };
      dispatch(
        addParty({
          url:
            id && id
              ? "/UpdateRulesAndAgreementPartyByID"
              : "/InsertRulesAndAgreementParty",
          payload: payload,
        })
      );
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
        "intentOfMou",
        editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].intentOfMou
      );
      setValue(
        "fromDate",
        moment(
          editRulesData &&
            editRulesData?.data[0] &&
            editRulesData?.data[0].fromDate,
          "DD/MM/YYYY"
        )
      );
      setValue(
        "toDate",
        moment(
          editRulesData &&
            editRulesData?.data[0] &&
            editRulesData?.data[0].toDate,
          "DD/MM/YYYY"
        )
      );
      setValue(
        "disclaimers",
        editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].disclaimers
      );
      setValue(
        "risksSharing",
        editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].risksSharing
      );
      setValue(
        "financialsIfAny",
        editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].financialsIfAny
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
          editRulesData?.data[0].mouFilePath
      );
      setFormData({
        ...formData,
        file:
          editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].mouFilePath,
      });
      setPartyData(
        editRulesData &&
          editRulesData?.data[0] &&
          editRulesData?.data[0].rulesAndAgreementPartyList
      );
    }
  }, [editRulesData]);

  useEffect(() => {
    if (partyData && partyData.length > 0) {
      setShowPartyData(true);
    }
  }, [partyData]);

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
                    ? `MOUs & Partnership ${
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
                                value: /^[a-zA-Z0-9\s,.:()/-]*$/,
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
                        <Grid item xs={12} md={5.75} />
                        <Grid item xs={12} md={5.75}>
                          <CustomTextField
                            name="intentOfMou"
                            label="Intent of MoU"
                            placeholder="Enter New Intent OF MOU"
                            control={control}
                            required={true}
                            rules={{
                              pattern: {
                                value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                                message:
                                  "Only Alphanumberic & hypens are allowed",
                              },
                              maxLength: {
                                value: 100,
                                message:
                                  "Intent OF MOU cannot exceed 100 characters",
                              },
                              required: "Intent OF MOU is required",
                            }}
                          />
                        </Grid>
                        <Grid container item xs={12} md={5.75} spacing={2}>
                          <Grid item xs={6}>
                            <TrainingCampCustomDatePicker
                              control={control}
                              name="fromDate"
                              label="From Date"
                              boxmb={0.8}
                              required={true}
                              minDate={moment().subtract(1, "years")}
                              maxDate={
                                toDate
                                  ? moment(toDate)
                                  : moment().add(10, "years")
                              }
                              className="Text-field-customise"
                              rules={{
                                required: "From Date is required",
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TrainingCampCustomDatePicker
                              control={control}
                              name="toDate"
                              label="To Date"
                              boxmb={0.8}
                              required={true}
                              minDate={minEndDate}
                              disabled={!minEndDate.isValid()}
                              maxDate={moment().add(10, "years")}
                              className="Text-field-customise"
                              rules={
                                !minEndDate.isValid()
                                  ? { required: "" }
                                  : { required: "To Date is required" }
                              }
                            />
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={12} textAlign={"end"}>
                          <Typography
                            py={1}
                            className="dubai-regular"
                            fontSize={"16px"}
                          >
                            <span style={{ color: "#E4002B" }}>*</span> Please
                            add at least one party.
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={12}
                          md={12}
                          ml={2}
                          borderTop={"1px solid #008755"}
                        />
                        <Grid item xs={12} md={12}>
                          <Box>
                            {partyData && partyData.length > 0 ? (
                              <TableContainer
                                sx={{
                                  border: "1px solid rgba(88, 88, 91, 0.2)",
                                  borderRadius: "4px",
                                  mb: 2,
                                }}
                              >
                                <Table stickyHeader aria-label="team table">
                                  <TableHead>
                                    <TableRow>
                                      {tablePartyHeaders.map((header: any) => (
                                        <TableCell
                                          key={header}
                                          align={"left"}
                                          sx={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            fontWeight: "bold",
                                            color: "#58585B",
                                            width:
                                              header ===
                                              "Afternoon Training Plan"
                                                ? "50%"
                                                : "auto",
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
                                    {partyData &&
                                      partyData.length > 0 &&
                                      partyData.map((item: any, index: any) => (
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
                                                color: "#58585B",
                                                textTransform: "capitalize",
                                              }}
                                              className="dubai-regular"
                                            >
                                              {item?.partyName}
                                            </Typography>
                                          </TableCell>
                                          <TableCell sx={{ p: 1.25 }}>
                                            <Typography
                                              sx={{
                                                fontWeight: 400,
                                                fontSize: "16px",
                                                lineHeight: "24px",
                                                color: "#58585B",
                                              }}
                                              className="dubai-regular"
                                            >
                                              {item?.partyAddress}
                                            </Typography>
                                          </TableCell>
                                          <TableCell sx={{ p: 1.25 }}>
                                            <Typography
                                              sx={{
                                                fontWeight: 400,
                                                fontSize: "16px",
                                                lineHeight: "24px",
                                                color: "#58585B",
                                              }}
                                              className="dubai-regular"
                                            >
                                              {item?.representative}
                                            </Typography>
                                          </TableCell>
                                          <TableCell sx={{ p: 1.25 }}>
                                            <Typography
                                              sx={{
                                                fontWeight: 400,
                                                fontSize: "16px",
                                                lineHeight: "24px",
                                                color: "#58585B",
                                              }}
                                              className="dubai-regular"
                                            >
                                              {item?.designation}
                                            </Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              whiteSpace: "nowrap",
                                              p: 1.25,
                                            }}
                                          >
                                            <Tooltip title={"Delete"}>
                                              <Button
                                                variant="text"
                                                sx={{
                                                  minWidth: "0",
                                                  width: "30px",
                                                  height: "30px",
                                                  color: "#05868E",
                                                }}
                                                onClick={() =>
                                                  handleDeleteTraining(item)
                                                }
                                                disabled={
                                                  partySelectedData &&
                                                  partySelectedData.length === 1
                                                }
                                              >
                                                <DeleteOutlinedIcon />
                                              </Button>
                                            </Tooltip>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            ) : null}
                            <Grid container item xs={12} md={12} spacing={2}>
                              {partyData && (
                                <>
                                  <PartyAddMore
                                    getPartyData={partyData}
                                    setPartyData={setPartyData}
                                    setShowPartyData={setShowPartyData}
                                    partyData={partyData}
                                    partySelectedData={partySelectedData}
                                    setPartySelectedData={setPartySelectedData}
                                    resetForm={resetForm}
                                    setResetForm={setResetForm}
                                    setAddPartyData={setAddPartyData}
                                  />
                                </>
                              )}
                            </Grid>
                          </Box>
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <FormWithSunEditor
                            name="disclaimers"
                            control={control}
                            minHeight={"200px"}
                            label="Disclaimers"
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <FormWithSunEditor
                            name="risksSharing"
                            control={control}
                            minHeight={"200px"}
                            label="Risks Sharing"
                          />
                        </Grid>
                        <Grid item xs={12} md={5.75}>
                          <FormWithSunEditor
                            name="financialsIfAny"
                            control={control}
                            minHeight={"200px"}
                            label="Financials (If any)"
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
                        rulesAddData?.loading ||
                        rulesUpdateData?.loading ||
                        !showPartyData
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
export default CreateMousForm;
