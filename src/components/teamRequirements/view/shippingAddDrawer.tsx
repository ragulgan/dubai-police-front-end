import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShippingDetailsAdd from "../add/shippingDetailsAdd";

interface ShippingAddProps {
  open: boolean;
  onClose: any;
  mode?: any;
  teamRequirementID?: any;
  getTeamRequirementByIDDta?: any;
  setIsUpdated?: any
}

const ShippingAddDrawer: React.FC<ShippingAddProps> = ({
  open,
  onClose,
  mode,
  teamRequirementID,
  getTeamRequirementByIDDta,
  setIsUpdated
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "30%",
          paddingTop: "7px",
          paddingBottom: "20px",
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          backgroundColor: "white",
          color: "#58585B",
          boxShadow: "none",
          borderBottom: "1px solid #ddd",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingRight: "10px",
        }}
      >
        <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
          {mode === "Create" ? "Create Shipping" : "Shipping Update"}
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{mr: 2}}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          boxShadow: "none",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingRight: "10px",
        }}
      >
        <ShippingDetailsAdd
          teamRequirementID={teamRequirementID}
          getTeamRequirementByIDDta={getTeamRequirementByIDDta}
          mode={mode}
          setIsUpdated={setIsUpdated}
          onClose={onClose}
        />
      </Box>
    </Drawer>
  );
};

export default ShippingAddDrawer;
