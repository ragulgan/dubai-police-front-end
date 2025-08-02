import React, { useEffect, useRef, useState } from "react";
import { Grid, Alert, Snackbar } from "@mui/material";
import _ from "lodash";
import { DROPZONE_IMAGE_NAME_TYPES, DROPZONE_MESSAGES } from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { singleFileUploadDispatch } from "@/redux/store";
import {
  clearState,
  singleFileUpload,
} from "@/redux/slices/fileupload/singleFileUpload";

interface FileUploadProps {
  onFileChange?: (
    file: File,
    flag: string,
    modulename: string,
    moduleId: string
  ) => void;
  onFilesChange?: (files: File[]) => void;
  multiple?: boolean;
  type: string;
  maxFileSize?: number;
  formatType?: string[];
  flag: string;
  moduleId: string;
  modulename: string;
  setData: object;
  formData: object;
}

const FileUpload: React.FC<any> = (props) => {
  const {
    onFileChange,
    onFilesChange,
    multiple = false,
    type,
    maxFileSize = 25,
    formatType = [],
    flag,
    moduleId,
    modulename,
    setData,
    formData,
    fileInputRef,
    fetchDataApi,
    isNoapicall,
  } = props;

  // const [files, setFiles] = useState<File[]>([]);
  // const [totalSize, setTotalSize] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState(false);
  const dispatch: singleFileUploadDispatch = useDispatch();
  const singleUploadData = useSelector((state: any) => state.singleUpload);
  const hasExecuted = useRef(false);

  const setFormatTypeError = (
    type: string,
    setStatus: React.Dispatch<React.SetStateAction<string>>
  ) => {
    switch (type) {
      case DROPZONE_IMAGE_NAME_TYPES.IMAGE:
        return setStatus(DROPZONE_MESSAGES.IMAGE_INVALID);
      case DROPZONE_IMAGE_NAME_TYPES.VIDEO:
        return setStatus(DROPZONE_MESSAGES.VIDEO_INVALID);
      case DROPZONE_IMAGE_NAME_TYPES.AUDIO:
        return setStatus(DROPZONE_MESSAGES.AUDIO_INVALID);
      case DROPZONE_IMAGE_NAME_TYPES.DOCUMENTS:
        return setStatus(DROPZONE_MESSAGES.DOCUMENT_INVALID);
    }
  };

  const handleFiles = (
    event: React.ChangeEvent<HTMLInputElement>,
    flag: string
  ) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles) return;
    setError(false);
    setStatus("Uploading...");
    const formData = new FormData();
    const validFiles: File[] = [];
    const fileSizeLimit = maxFileSize * 1024 * 1024;
    Array.from(selectedFiles).forEach((file) => {
      const fileType = file.type;
      const fileName = file.name.toLowerCase();
      const uploadedFileSize = file.size;
      const isValidFileFormat = _.includes(formatType, fileType);
      if (fileType === "image/jpeg" && fileName.endsWith(".jfif")) {
        setError(true);
        setStatus(DROPZONE_MESSAGES.IMAGE_INVALID);
        return;
      }
      if (isValidFileFormat) {
        if (uploadedFileSize < fileSizeLimit) {
          formData.append("file_to_upload", file);
          validFiles.push(file);
        } else {
          setError(true);
          setStatus(
            `File size must below ${
              fileSizeLimit / 1048576
            } MB!. You file size is : ${Math.round(uploadedFileSize / 1024)}KB`
          );
        }
      } else {
        setError(true);
        setFormatTypeError(type, setStatus);
      }
    });
    if (multiple && onFilesChange) {
      onFilesChange(validFiles);
    } else if (onFileChange) {
      onFileChange(validFiles[0], flag, modulename, moduleId);
      if (moduleId && validFiles[0]) {
        const files = validFiles[0];
        const formData = new FormData();
        formData.append("file", files);
        formData.append("modulename", modulename);
        formData.append("moduleid", moduleId);
        formData.append("section", flag);
        dispatch(singleFileUpload(formData));
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
    setError(false);
  };

  useEffect(() => {
    let timer: any;
    if (error) {
      timer = setTimeout(() => {
        setError(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (singleUploadData?.code === 200 && !hasExecuted.current) {
      if (fetchDataApi && typeof fetchDataApi === "function") {
        if (!isNoapicall) {
          fetchDataApi();
        }
      }
      clearState();
      hasExecuted.current = true;
    }
    return () => {
      hasExecuted.current = false;
    };
  }, [singleUploadData]);

  return (
    <Grid container spacing={0} justifyContent="start" alignItems="center">
      {error && (
        <Snackbar
          open={error}
          autoHideDuration={4000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity="error"
            variant="filled"
            className="dubai-med"
          >
            {status}
          </Alert>
        </Snackbar>
      )}
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept={type}
        multiple={multiple}
        onChange={(e) => {
          handleFiles(e, flag);
          (e.target as HTMLInputElement).value = "";
        }}
      />
    </Grid>
  );
};

export default FileUpload;
