import React from "react";
import { Grid, IconButton, Typography, Box } from "@mui/material";
import AttachFileSharpIcon from "@mui/icons-material/AttachFileSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import FileUpload from "@/utils/dropzone";

interface FileUploaderProps {
  fileKey: string; // Key for formData
  fileLabel: string; // Label for UI
  formatType: any;
  fileType: string;
  flag: string;
  moduleName: string;
  moduleId: number;
  fileInputRef: any;
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
  handleFileChange: (file: any, flag: any) => void;
  handleDeleteFile: (
    moduleName: string,
    moduleId: number,
    fileKey: string
  ) => void;
  handleFileClick: () => void;
  required: boolean;
}

const FileUploader: React.FC<any> = ({
  fileKey,
  fileLabel,
  formatType,
  fileType,
  flag,
  moduleName,
  moduleId,
  fileInputRef,
  formData,
  setFormData,
  errors,
  handleFileChange,
  handleDeleteFile,
  handleFileClick,
  required,
}) => {
  return (
    <>
      <Grid
        container
        spacing={1}
        justifyContent="start"
        alignItems="center"
        mt={1}
      >
        <Grid alignItems="flex-start" p={0}>
          <FileUpload
            onFileChange={(file: any, flag: any) =>
              handleFileChange(file, flag)
            }
            formatType={formatType}
            type={fileType}
            flag={flag}
            setData={setFormData}
            formData={formData}
            modulename={moduleName}
            moduleId={moduleId}
            fileInputRef={fileInputRef}
          />
        </Grid>
        <Grid>
          <Box display="flex" alignItems="center">
            {/* <IconButton
            className="attachFileButton"
            component="label"
            aria-label="attach-file"
            sx={{
              "&:hover": { backgroundColor: "rgba(0, 66, 106, 0.2)" }, // Darker on hover
              color: "#00426A",
              borderRadius: "50%",
            }}
            onClick={handleFileClick}
          > */}
            <AttachFileSharpIcon
              sx={{
                color: "#00426A",
                fontSize: "1.5rem",
                cursor: "pointer",
                marginRight: "5px",
                "@media (min-width: 1536px) and (max-width: 1576px)": {
                  fontSize: "1.2rem",
                  marginRight: "3px",
                },
                "@media (min-width: 1920px)": {
                  fontSize: "1.4rem",
                  marginRight: "4px",
                },
              }}
              onClick={handleFileClick}
            />
            {/* </IconButton> */}
            <Typography
              align="left"
              className="dubai-med upload-label"
              onClick={handleFileClick}
              style={{ cursor: "pointer", color: "#00426A" }}
            >
              {formData[fileKey] ? (
                <Typography
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "200px",
                    display: "inline-block",
                    verticalAlign: "middle",
                  }}
                  className="dubai-med upload-label"
                  title={formData[fileKey]}
                >
                  {formData[fileKey]}
                </Typography>
              ) : (
                <>
                  {fileLabel}
                  {required ? (
                    <span
                      className="asterisk"
                      style={{ color: "#d32f2f", fontSize: "19px" }}
                    >
                      *
                    </span>
                  ) : null}
                </>
              )}
            </Typography>
            {formData[fileKey] && (
              <IconButton
                className="deleteIconButton"
                aria-label="delete"
                onClick={() => handleDeleteFile(moduleName, moduleId, fileKey)}
                sx={{
                  color: "#ef0a0a",
                  "&:hover": { backgroundColor: "rgba(255, 0, 0, 0.1)" },
                  padding: 1,
                }}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>
      {errors[fileKey] && (
        <Typography variant="caption" className="error-message" ml={2}>
          {errors[fileKey]}
        </Typography>
      )}
    </>
  );
};

export default FileUploader;
