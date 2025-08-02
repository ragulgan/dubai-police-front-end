import React from "react";
import { Box, CircularProgress } from "@mui/material";

interface LoadingOverlayProps {
  loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ loading }) => {
  return (
    <>
      {loading && (
        <>
          <Box
         sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 1300,
          pointerEvents: "auto",
        }}
          />
          <Box
               sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                zIndex: 1400,
              }}
          >
            <CircularProgress />
          </Box>
        </>
      )}
    </>
  );
};

export default LoadingOverlay;
