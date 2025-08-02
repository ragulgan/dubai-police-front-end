"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { Box, Typography, Button, CircularProgress, Fade } from "@mui/material";
import Grid from "@mui/material/Grid";
import CustomTextField from "@/components/Fields/CustomTextField";
import TrainingCampCustomDatePicker from "@/components/trainingCamp/trainingCampCustomDatePicker";
import moment from "moment";
import { FileUploader } from "react-drag-drop-files";
import Uploadtravel from "../../../../public/travelUpload.svg";
import _ from "lodash";
import dayjs from "dayjs";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  clearShippingUpdateState,
  updateShipping,
} from "@/redux/slices/teamRequirement/updateShippingSlice";
import CustomSnackbar from "@/components/CustomSnackbar";
import {
  singleFileUpload,
  clearState,
} from "@/redux/slices/fileupload/singleFileUpload";
import TeamRequirementShippingFieldSkeleton from "../skeleton/teamRequirementShippingSkeleton";

const ShippingDetailsAdd: any = (props: any) => {
  const router = useRouter();
  const {
    teamRequirementID,
    getTeamRequirementByIDDta,
    mode,
    setIsUpdated,
    onClose,
  } = props;
  const dispatch: AppDispatch = useDispatch();
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarStatus, setSnackbarStatus] = useState<string>("");
  const [errors, setErrors] = useState<any>({});
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const fileTypes = ["JPG", "PNG", "pdf", "doc"];
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState<any>({
    file: "",
    modulename: "shipping",
    moduleid: "1",
    section: "",

    description: "",
  });
  const [showBanner, setShowBanner] = useState(false);

  const updateShippingData = useSelector(
    (state: RootState) => state?.shippingUpdate
  );

  const { handleSubmit, control, setValue, watch, getValues, reset } =
    useForm<any>({
      defaultValues: {
        vendorName: "",
        vendorWebsite: "",
        deliveryDate: null,
        remarks: "",
        invoice: "",
      },
    });

  const invoice = watch("invoice");

  const clearData = () => {
    reset({
      vendorName: "",
      vendorWebsite: "",
      deliveryDate: null,
      remarks: "",
      invoice: "",
    });
    setFormData({});
  };

  const onSubmit = (data: any) => {
    const payload: any = {
      vendorName: data?.vendorName,
      vendorWebsite: data?.vendorWebsite,
      deliveryDate: dayjs(data?.deliveryDate).format("DD-MM-YYYY"),
      remarks: data?.remarks,
      teamRequirementID: Number(teamRequirementID),
    };
    dispatch(updateShipping({ url: "/UpdateShippingByID", payload }));
  };

  useEffect(() => {
    if (updateShippingData && updateShippingData.code === 200) {
      setShowBanner(true);
      setSnackbarStatus("success");
      clearData();
      if (formData && formData.file && formData.file.name) {
        const data = new FormData();
        data.append("file", formData.file);
        data.append("modulename", "shipping");
        data.append(
          "moduleid",
          updateShippingData &&
            updateShippingData.data &&
            updateShippingData.data?.teamRequirementID
        );
        data.append("section", "invoice");
        dispatch(singleFileUpload(data));
      }
      dispatch(clearShippingUpdateState());
      setTimeout(() => {
        setIsUpdated(true);
        onClose();
        setTimeout(() => {
          setIsUpdated(false);
        }, 1000);
      }, 1000);
    } else if (updateShippingData && updateShippingData.code === 500) {
      setShowBanner(true);
      setSnackbarStatus("error");
      setTimeout(() => {
        dispatch(clearShippingUpdateState());

        setShowBanner(false);
      }, 3000);
    }
  }, [updateShippingData]);

  const handleFileUpload = () => {
    document.getElementById("file")?.click();
  };

  const handleFileChange = (file: any) => {
    if (file) {
      setValue("invoice", "");
      const fileType = file.type;
      const fileName = file.name.toLowerCase();

      const uploadedFileSize = file.size;
      const fileSizeLimit = 25 * 1024 * 1024;
      if (fileName.endsWith(".jfif")) {
        setSnackbarOpen(true);
        setSnackbarStatus("error");
      } else {
        if (uploadedFileSize < fileSizeLimit) {
          setFormData({ ...formData, file: file });
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
    if (mode === "Edit") {
      setValue(
        "vendorName",
        getTeamRequirementByIDDta &&
          getTeamRequirementByIDDta?.data[0] &&
          getTeamRequirementByIDDta?.data[0].vendorName
      );
      setValue(
        "vendorWebsite",
        getTeamRequirementByIDDta &&
          getTeamRequirementByIDDta?.data[0] &&
          getTeamRequirementByIDDta?.data[0].vendorWebsite
      );
      setValue(
        "remarks",
        getTeamRequirementByIDDta &&
          getTeamRequirementByIDDta?.data[0] &&
          getTeamRequirementByIDDta?.data[0].remarks
      );
      setValue(
        "deliveryDate",
        getTeamRequirementByIDDta?.data[0]?.deliveryDate === "-"
          ? null
          : moment(
              getTeamRequirementByIDDta?.data[0]?.deliveryDate,
              "DD/MM/YYYY"
            )
      );
      setValue(
        "invoice",
        getTeamRequirementByIDDta &&
          getTeamRequirementByIDDta?.data[0] &&
          getTeamRequirementByIDDta?.data[0].invoiceFilePath
      );
      setFormData({
        ...formData,
        file:
          getTeamRequirementByIDDta &&
          getTeamRequirementByIDDta?.data[0] &&
          getTeamRequirementByIDDta?.data[0].invoiceFilePath,
      });
    }
  }, [getTeamRequirementByIDDta]);

  return (
    <>
      {getTeamRequirementByIDDta && getTeamRequirementByIDDta?.loading ? (
        <TeamRequirementShippingFieldSkeleton isAvatar={true} />
      ) : (
        <Fade in={true} timeout={1000}>
          <Grid container spacing={0}>
            {showBanner && (
              <CustomSnackbar
                message={
                  snackbarStatus === "success"
                    ? `Shipping Details ${
                        mode === "Edit" ? "Updated" : "Added"
                      } successfully!`
                    : updateShippingData && updateShippingData?.message
                }
                severity={snackbarStatus === "success" ? "success" : "error"}
                open={showBanner}
                onClose={handleClose}
              />
            )}
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                px={4}
                py={2}
                component={"form"}
              >
                <Grid item xs={12}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CustomTextField
                      name="vendorName"
                      label="Vendor Name"
                      placeholder="Enter Vendor Name"
                      control={control}
                      required={true}
                      rules={{
                        pattern: {
                          value: /^[a-zA-Z0-9\s,.:()/-]*$/,
                          message: "Only Alphanumberic & hypens are allowed",
                        },
                        maxLength: {
                          value: 50,
                          message: "Vendor Name cannot exceed 50 characters",
                        },
                        required: "Vendor Name is required",
                      }}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    pb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CustomTextField
                      name="vendorWebsite"
                      label="Vendor Website"
                      placeholder="Enter Website Name"
                      control={control}
                      rules={{
                        pattern: {
                          value:
                            /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/[\w.-]*)*(\?[\w=&%-]*)?$/,
                          message: "Invalid URL format",
                        },
                        maxLength: {
                          value: 500,
                          message:
                            "Vendor website cannot exceed 500 characters",
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    pb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <TrainingCampCustomDatePicker
                      control={control}
                      name="deliveryDate"
                      label="Delivery Date"
                      boxmb={0.8}
                      required={true}
                      minDate={moment()}
                      maxDate={moment().add(10, "years")}
                      className="Text-field-customise"
                      rules={{
                        required: "Delivery Date is required",
                      }}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    pb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <CustomTextField
                      name="remarks"
                      label="Remarks"
                      placeholder="Enter Remarks"
                      control={control}
                      rules={{
                        maxLength: {
                          value: 100,
                          message: "Remarks cannot exceed 100 characters",
                        },
                      }}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    pb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      sx={{ fontSize: "14px" }}
                      className="typography textfield-label bukra"
                      mt={1.5}
                      mb={0.5}
                    >
                      Invoice
                    </Typography>
                    <Box
                      border={"1px dashed #008755"}
                      bgcolor={"rgba(0, 135, 85, 0.03)"}
                      className="upload-travel-sd"
                      position={"relative"}
                      textAlign={"center"}
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
                      <Box
                        textAlign={"center"}
                        position={"absolute"}
                        bottom={"30%"}
                        className="dubai-regular secondary-color"
                        fontWeight={600}
                        fontSize={"14px"}
                        width={"100%"}
                      >
                        {(invoice && invoice) ||
                        (formData && formData?.file && formData?.file?.name) ? (
                          <Typography
                            className={
                              teamRequirementID &&
                              formData &&
                              formData?.file &&
                              formData?.file?.name
                                ? "dubai-med webkit-line-clamp webkit-1 primary-color"
                                : "dubai-med webkit-line-clamp webkit-1"
                            }
                            marginBottom={"-24px"}
                            textAlign={"center"}
                            fontWeight={600}
                            fontSize={"16px"}
                            width={"100%"}
                          >
                            {invoice.split("/").pop() || formData?.file?.name}
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
                  </Box>
                </Grid>
                <Grid item md={12} direction="column">
                  <Box display="flex" gap={1} justifyContent={"end"} pb={0}>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{
                        width: "112px",
                        height: "48px",
                        borderRadius: "4px",
                      }}
                      onClick={() => {
                        onClose();
                      }}
                      className="cancel-button text-capitalize"
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      className="text-capitalize cancel-button"
                      sx={{
                        width: "112px",
                        height: "48px",
                        borderRadius: "4px",
                        gap: "0px",
                      }}
                      // disabled={trainingUpdateData.loading}
                      onClick={handleSubmit(onSubmit)}
                    >
                      {getTeamRequirementByIDDta.loading ||
                      getTeamRequirementByIDDta?.loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : mode === "Edit" ? (
                        "Update"
                      ) : (
                        "Save"
                      )}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Grid>
        </Fade>
      )}
    </>
  );
};

export default ShippingDetailsAdd;
