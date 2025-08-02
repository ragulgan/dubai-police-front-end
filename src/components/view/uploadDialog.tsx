import * as React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import CustomTextField from "../Fields/CustomTextField";
import {
  Box,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import { FileUploader } from "react-drag-drop-files";
import _ from "lodash";
import CustomSnackbar from "../CustomSnackbar";
import { SnackbarCloseReason } from "@mui/material/Snackbar";
import { singleFileUpload } from "@/redux/slices/fileupload/singleFileUpload";
import { useDispatch, useSelector } from "react-redux";
import { singleFileUploadDispatch } from "@/redux/store";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));
const fileTypes = ["JPG", "PNG", "pdf", "doc"];

interface AlertDialog {
  onFileChange: () => void;
  module: string;
}

const AlertDialog: React.FC<AlertDialog> = ({ onFileChange, module }) => {
  const [open, setOpen] = React.useState(false);
  const [formData, setFormData] = React.useState<any>({
    file: "",
    modulename: "Staff",
    moduleid: "1",
    section: "",

    description: "",
  });
  const DocumentType = [
    { value: "Passport", label: "Passport" },
    { value: "IDDocument", label: "Emirates ID" },
    { value: "Certificate", label: "License Details" },
    { value: "ContractDocument", label: "Contract Document" },
    { value: "Level", label: "Education" },
    { value: "Others", label: "Others" },
  ];
  const [errors, setErrors] = React.useState<any>({});
  const [snackbarStatus, setSnackbarStatus] = React.useState<string>("");
  const [snackbarOpen, setSnackbarOpen] = React.useState<boolean>(false);
  const dispatch: singleFileUploadDispatch = useDispatch();
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const router = useRouter();
  const { id } = router.query;
  const staffID = id;

  const handleClickOpen = (e: any) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({});
  };

  const qualifyChange = (event: any) => {
    setFormData({ ...formData, section: event.target.value });
    setErrors({});
  };

  const handleDescription = (e: any) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleUpload = () => {
    if (
      (formData && _.isEmpty(formData?.file?.name)) ||
      (formData && _.isEmpty(formData.section))
    ) {
      const newErrors: any = {};
      newErrors.file = "File is required";
      newErrors.section = "Document Type is required";
      setErrors(newErrors);
    } else {
      const data = new FormData();
      data.append("file", formData.file);
      data.append("modulename", module);
      data.append("moduleid", String(staffID));
      data.append("section", formData.section);
      data.append("description", formData.description);
      dispatch(singleFileUpload(data));
    }
  };

  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      description: "",
    },
  });

  const handleChange = (file: any) => {
    if (file) {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      const uploadedFileSize = file.size;
      const fileSizeLimit = 25 * 1024 * 1024;
      if (fileType === "image/jpeg" || fileName.endsWith(".jfif")) {
        setSnackbarOpen(true);
        setSnackbarStatus("error");
      } else {
        if (uploadedFileSize < fileSizeLimit) {
          setFormData({ ...formData, file: file });
          setErrors({ ...errors, file: "" });
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

  const handleFileUpload = () => {
    document.getElementById("file")?.click();
  };

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  React.useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (snackbarOpen) {
      timeoutId = setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [snackbarOpen]);

  React.useEffect(() => {
    if (singleUploadData?.code === 200) {
      setSnackbarOpen(true);
      setSnackbarStatus("success");
      setTimeout(() => {
        setOpen(false);
      }, 1500);
      setFormData({});
      onFileChange();
    }
  }, [singleUploadData]);

  return (
    <React.Fragment>
      <Tooltip title="Manage documents">
        <Button
          variant="outlined"
          startIcon={<FileUploadOutlinedIcon />}
          sx={{ mr: 1 }}
          className="dubai-med text-capitalize"
          onClick={(e) => handleClickOpen(e)}
        >
          Upload
        </Button>
      </Tooltip>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className="dialog-width"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DialogTitle
          sx={{ m: 0, p: 2 }}
          id="customized-dialog-title"
          className="bukra dialogBox-title"
        >
          File Upload
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Box p={2}>
            <Box className="upload-outline" position={"relative"}>
              <FileUploader
                handleChange={handleChange}
                name="file"
                types={fileTypes}
                className="upload-outline"
                label={"Click or drag file to this area to select"}
                uploadedLabel={
                  formData && formData.file === ""
                    ? "Please try again"
                    : formData?.file?.name
                }
                disabled={singleUploadData.loading}
              />
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
            </Box>
            {errors.file && (
              <Typography variant="caption" className="error-message" mb={2}>
                {errors.file}
              </Typography>
            )}
            <Typography
              className="dubai-med secondary-color format-text"
              mt={2}
              mb={0.5}
            >
              Formats accepted are .pdf, .doc, .docx, .txt (max size 25 MB)
            </Typography>
            <Typography
              gutterBottom
              className="typography textfield-label bukra"
              mt={2}
            >
              Document Type <span className="asterisk">*</span>
            </Typography>
            <FormControl
              variant="outlined"
              fullWidth
              className="selectFieldContainer"
              sx={{ mb: 4 }}
            >
              <Select
                value={formData.section}
                onChange={qualifyChange}
                displayEmpty
                className="Text-field-customise"
                id="section"
              >
                <MenuItem value="" disabled>
                  <Typography
                    style={{
                      height: 27,
                      fontSize: "16px",
                      fontWeight: 500,
                      lineHeight: "25.01px",
                      textAlign: "left",
                      marginLeft: 4,
                      color: "#58585B",
                    }}
                    className="dubai-med"
                  >
                    Select Document type
                  </Typography>
                </MenuItem>
                {DocumentType.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      className="dubai-med"
                    >
                      {option.label}
                    </Typography>
                  </MenuItem>
                ))}
              </Select>
              {errors.section && (
                <Typography variant="caption" className="error-message" mb={2}>
                  {errors.section}
                </Typography>
              )}
            </FormControl>
            <CustomTextField
              name="description"
              value={formData && formData.description}
              onChange={handleDescription}
              label="Short Description"
              placeholder="Enter a short description of the uploaded document..."
              textarea={true}
              control={control}
              inputProps={{
                maxLength: 250,
              }}
            />
            <Typography
              className="dubai-med secondary-color format-text"
              mt={1}
              textAlign={"end"}
            >
              {formData && formData?.description?.length}/250
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ m: 1, mx: 2 }}>
          <Button
            autoFocus
            onClick={handleClose}
            color="error"
            variant="outlined"
            className="dubai-med text-capitalize"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            className="dubai-med text-capitalize"
            onClick={handleUpload}
            disabled={singleUploadData.loading}
          >
            {singleUploadData.loading ? (
              <CircularProgress size="20px" color="inherit" />
            ) : (
              "Upload"
            )}
          </Button>
        </DialogActions>
        {snackbarStatus !== "" && (
          <CustomSnackbar
            message={
              snackbarStatus === "success"
                ? "File uploaded successfully!"
                : "Uploaded file is not a valid type."
            }
            severity={snackbarStatus === "success" ? "success" : "error"}
            open={snackbarOpen}
            onClose={handleCloseSnackbar}
          />
        )}
      </BootstrapDialog>
    </React.Fragment>
  );
};

export default AlertDialog;
