import React from "react";
import { Box, Typography, Button } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { useRouter } from "next/navigation";

const AccessDeniedPage = () => {
const router = useRouter();

const routing = () => {
  router.push("/dashboard");
}
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height="100vh"
      textAlign="center"
      bgcolor="#f5f5f5"
      px={2}
    >
      <LockOutlinedIcon sx={{ fontSize: 80, color: "#e53935", mb: 2 }} />
      <Typography variant="h4" gutterBottom className="bukra-semi-bold">
        Access Denied
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3} className="bukra-semi-bold">
        You do not have permission to view this page.
      </Typography>
      <Button variant="outlined" color="primary" className="bukra-semi-bold" onClick={() => {routing()}}>
        Go to Dashboard
      </Button>
    </Box>
  );
};

export default AccessDeniedPage;
