// components/Fields/FileUploadField.tsx
import React, { useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import FileUploadIcon from '../../../public/svg/FileUpload.svg';
import { singleFileUpload } from '@/redux/slices/fileupload/singleFileUpload';
import { useDispatch } from 'react-redux';
import { singleFileUploadDispatch } from '@/redux/store';

interface FileUploadFieldProps {
  label: string;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onFileChange: (file: any, flag: any) => void;
  formatType: string;
  type: string;
  maxFileSize: number;
  flag: string;
  moduleName: string;
  moduleId: string;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  formData,
  setFormData,
  onFileChange,
  formatType,
  type,
  maxFileSize,
  flag,
  moduleName,
  moduleId,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const dispatch: singleFileUploadDispatch = useDispatch();
  const handleContainerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (file) {
        onFileChange(file, flag);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('modulename', moduleName);
        formData.append('moduleid', moduleId);
        formData.append('section', flag);
        dispatch(singleFileUpload(formData));
      }
    }
  };
  return (
    <Box sx={{ marginTop: '15px' }} >
      <Typography gutterBottom className="typography textfield-label bukra">
        {label}
      </Typography>
      <Box className="upload-container" sx={{
        width: '100% !important'
      }}
        onClick={handleContainerClick}
      >
        <Box className="upload-inner">
          <Box className="upload-icon">
            <IconButton
              className="attach-file-button"
              component="label"
              aria-label="attach-file"
              sx={{
                marginLeft: '-10px',
                '&:hover': {
                  backgroundColor: 'transparent !important', // Disable hover background
                }
              }}
            >
              <FileUploadIcon width={25} height={25} />
            </IconButton>
            <span className="upload-text dubai-med">
              {formData.uploadCertificate ? (
                <>{formData.uploadCertificate}</>
              ) : (
                <>Upload (PDF, DOC, DOCX)</>
              )}
            </span>
          </Box>
        </Box>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept={formatType} // Ensure file type filtering
        />
      </Box>
    </Box>
  );
};

export default FileUploadField;
