import React from "react";
import { Tabs, Tab, Box, SxProps, Theme } from "@mui/material";

interface CalendarViewSwitchButtonsProps {
  currentTab: number;
  handleTabChange: any;
  module?: any;
  sx?: SxProps<Theme>;
}

const CalendarViewSwitchButtons: React.FC<CalendarViewSwitchButtonsProps> = ({
  currentTab,
  handleTabChange,
  sx
}) => {
  return (
    <Box>
      <Tabs
        value={currentTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        centered
        variant="fullWidth"
        sx={{
          backgroundColor: "rgba(141, 144, 147, 0.2)",
          borderRadius: "7px",
          px: 2,
          py: 0.4,
          minHeight: "0px",
          ...sx
        }}
        className="calendar-tab-header"
      >
        <Tab
          label="Day"
          className="text-capitalize dubai-med"
          sx={{
            minHeight: "32px",
            minWidth: "0px",
            p: 1,
            px: 2,
            "&.Mui-selected": {
              backgroundColor: "#008755",
              color: "#FFFFFF",
              borderRadius: "6px",
              p: 1,
              px: 2,
            },
          }}
        />
        <Tab
          label="Week"
          className="text-capitalize dubai-med"
          sx={{
            minHeight: "32px",
            minWidth: "0px",
            p: 1,
            px: 2,
            "&.Mui-selected": {
              backgroundColor: "#008755",
              color: "#FFFFFF",
              borderRadius: "6px",
              p: 1,
              px: 2,
            },
          }}
        />
        <Tab
          label="Month"
          className="text-capitalize dubai-med"
          sx={{
            minHeight: "32px",
            minWidth: "0px",
            p: 1,
            px: 2,
            "&.Mui-selected": {
              backgroundColor: "#008755",
              color: "#FFFFFF",
              borderRadius: "6px",
              p: 1,
              px: 2,
            },
          }}
        />
        <Tab
          label="Year"
          className="text-capitalize dubai-med"
          sx={{
            minHeight: "32px",
            minWidth: "0px",
            p: 1,
            px: 2,
            "&.Mui-selected": {
              backgroundColor: "#008755",
              color: "#FFFFFF",
              borderRadius: "6px",
              p: 1,
              px: 2,
            },
          }}
        />
      </Tabs>
    </Box>
  );
};

export default CalendarViewSwitchButtons;
