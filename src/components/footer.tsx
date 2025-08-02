import { getCurrentDateString } from "@/utils/datetime";
import { Box } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Box
      className="dubai-med secondary-color footer"
      p={2}
      textAlign={"end"}
      zIndex={5}
    >
      {`© Copyright ${getCurrentDateString(
        "YYYY"
      )} iSportz, Inc. All Rights Reserved.`}
    </Box>
  );
};

export default Footer;
