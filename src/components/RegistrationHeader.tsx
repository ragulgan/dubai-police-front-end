"use client";
import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Image from "next/image";
import Logo from "../../public/LogoPng.png";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AccountCircle } from "@mui/icons-material";

const RegistrationHeader: React.FC = () => {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        color: "black",
        boxShadow: "none",
        borderBottom: "1px solid #ddd",
      }}
    >
      <Toolbar sx={{ height: "64px" }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-start"
          sx={{ width: "100%" }}
          spacing={5}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <AccountCircle
              sx={{ width: "48px", height: "48px", color: "primary.main" }}
            />
            <Stack direction="column" alignItems="flex-start">
              <Typography
                variant="body1"
                component="div"
                color="primary"
                sx={{ fontWeight: "bold" }}
                className="app-bar-menu-name bukra"
              >
                Dubai Police
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <Box sx={{ paddingTop: 1 }}>
          <Image src={Logo} alt="Logo" width={130} height={47} />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default RegistrationHeader;
