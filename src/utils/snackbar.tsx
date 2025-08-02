import { Snackbar, Alert } from '@mui/material';
import React, { useState } from 'react';

// Define a type for Snackbar message information
interface SnackbarInfo {
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info' | undefined;
}

// Create a container for Snackbar
const SnackbarContainer: React.FC<SnackbarInfo & { onClose: () => void }> = ({ message, severity, onClose }) => {
  return (
    <Snackbar
      open={!!message}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={onClose} severity={severity} variant="filled" className="dubai-med">
        {message}
      </Alert>
    </Snackbar>
  );
};

let showSnackbarFunc: ((info: SnackbarInfo) => void) | undefined;

// Function to set Snackbar display
export const showSnackbar = (message: string, severity: 'success' | 'error' | 'warning' | 'info' | undefined) => {

  if (showSnackbarFunc) {
    showSnackbarFunc({ message, severity });
  }
};

// Function to handle Snackbar state
export const useSnackbar = () => {
  const [snackbarInfo, setSnackbarInfo] = useState<SnackbarInfo>({ message: '', severity: undefined });

  showSnackbarFunc = setSnackbarInfo;

  const handleClose = () => {
    setSnackbarInfo({ message: '', severity: undefined });
  };

  return (
    <>
      <SnackbarContainer
        message={snackbarInfo.message}
        severity={snackbarInfo.severity}
        onClose={handleClose}
      />
    </>
  );
};
