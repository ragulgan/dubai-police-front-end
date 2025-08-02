import { Menu, MenuItem, styled, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';

const StyledTab = styled(Tab, {
  shouldForwardProp: (prop) => prop !== 'selected',
})<{ selected: boolean }>(({ selected, disabled }) => ({
  backgroundColor: selected ? "#008755" : "#E3FFF1",
  color: selected ? "#fff !important" : "#58585B",
  fontFamily: "Dubai",
  fontWeight: "500 !important",
  fontSize: "14px",
  lineHeight: "100%",
  pointerEvents: disabled ? "none" : "auto",
  opacity: disabled ? 0.6 : 1,
  "&:hover": {
    backgroundColor: selected ? "#006b43" : "#E3FFF1",
  },
}));

interface CustomTabProps {
  tabValue: number;
  setTabValue: (value: number) => void;
}

export default function CustomTab({ setTabValue, tabValue }: CustomTabProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("Training Plans");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setTabValue(4);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (menuItem: string, newTabValue: number) => {
    setSelectedMenuItem(menuItem);
    setTabValue(newTabValue);
    setAnchorEl(null);
  };

  return (
    <>
      <Tabs
        value={tabValue >= 4 ? false : tabValue} // Let us control "Other Reports" selection
        onChange={handleTabChange}
        sx={{
          backgroundColor: "white",
          "& .MuiTabs-indicator": { backgroundColor: "transparent" },
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
        }}
      >
        <StyledTab
          value={0}
          label="Race Reports"
          selected={tabValue === 0}
          className="text-capitalize"
        />
        <StyledTab
          value={1}
          label="Training Camp Reports"
          selected={tabValue === 1}
          className="text-capitalize"
        />
        <StyledTab
          value={2}
          label="Athlete Reports"
          selected={tabValue === 2}
          className="text-capitalize"
        />
        <StyledTab
          value={3}
          label="Staff Reports"
          selected={tabValue === 3}
          className="text-capitalize"
        />
        <StyledTab
          value={false}
          label={"Other Reports"}
          selected={tabValue === 4 || tabValue === 5}
          onClick={handleMenuOpen}  
          className="text-capitalize"
        />
      </Tabs>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        MenuListProps={{ "aria-labelledby": "basic-button" }}
        PaperProps={{
          sx: {
            backgroundColor: "#E3FFF1",
          },
        }}
      >
        <MenuItem
          onClick={() => handleMenuItemClick("Training Plans", 4)}
          className="dubai-med"
        >
          Training Plans
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick("Test Reports", 5)}
          className="dubai-med"
        >
          Test Reports
        </MenuItem>
      </Menu>
    </>
  );
}
