import React, { useState } from 'react'
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Tabs,
  Tab,
  styled,
  Stack,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';
import CloseIcon from "@mui/icons-material/Close";
import { RootState } from '@/redux/store';
import CustomTextField from '@/components/Fields/CustomTextField';
import { useForm } from 'react-hook-form';
import ParticipationAndEngagement from '@/components/commander-shield-department/update-scores/ParticipationAndEngagement';
import WomenEmpowerment from '@/components/commander-shield-department/update-scores/WomenEmpowerment';
import { Menu, MenuItem } from '@mui/material';

const StyledTab = styled(Tab)<{ selected: boolean }>(
  ({ selected, disabled }) => ({
    flexGrow: 1,
    backgroundColor: selected ? "#008755" : "white",
    color: selected ? "#fff !important" : "#58585B99",
    fontFamily: "29LT Bukra !important",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
    pointerEvents: disabled ? "none" : "auto",
    opacity: disabled ? 0.6 : 1,
    borderRight: selected ? 0 : "0.5px solid #BCBCBD",
    "&:hover": {
      backgroundColor: selected ? "#006b43" : "#f0f0f0",
    },
  })
);

interface SlideDialogProps {
  open: boolean;
  onClose: any;
  module?: string;
  isEditData?: any;
}

const DepartmentDrawer: React.FC<SlideDialogProps> = ({
  open,
  onClose,
  module,
  isEditData,
}) => {
  const dispatch: any = useDispatch();
  const router = useRouter();
  const currentNav = usePathname();
  const [tabValue, setTabValue] = useState(0);
  const [isUpdated, setIsUpdated] = useState(false);
  const trainingCampEditData = useSelector(
    (state: RootState) => state.editTraningCamp
  );
  const [allData, setAllData] = useState<any>({});
  const [isDisabled, setIsDisabled] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMoreOptionClick = (option: string) => {
    console.log('Selected:', option); // implement switching logic if needed
    handleMenuClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "700px",
          py: 2,
        },
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="titleStyle" sx={{ px: 2 }} className="bukra">
          Update Scores
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ mr: 2 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Box>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            backgroundColor: "white",
            borderTop: `1px solid #58585B66`,
            borderBottom: `1px solid #58585B66`,
            "& .MuiTabs-indicator": { backgroundColor: "transparent" },
          }}
        >
          <StyledTab
            label="Participation & Engagement"
            selected={tabValue === 0}
            className="text-capitalize bukra stepper-label-view"
          />
          <StyledTab
            label={"Woman Empowerment"}
            selected={tabValue === 1}
            className="text-capitalize bukra stepper-label-view"
          />
          <StyledTab
            label={"More"}
            selected={tabValue === 2}
            className="text-capitalize bukra stepper-label-view"
            onClick={handleMoreClick}
          />
        </Tabs>
        <Box mt={2} px={4}>
          {tabValue === 0 ? (
            <ParticipationAndEngagement />
          ) : tabValue === 1 ? (
            <WomenEmpowerment />
          ) : (
            <Box>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem
                  className="text-capitalize bukra stepper-label-view"
                  sx={{
                    color: "#58585B"
                  }}
                  onClick={() => handleMoreOptionClick('Physical Readiness')}>
                  Physical Readiness
                </MenuItem>
                <MenuItem
                  className="text-capitalize bukra stepper-label-view"
                  sx={{
                    color: "#58585B"
                  }}
                  onClick={() => handleMoreOptionClick('Assistance and Motivation')}>
                  Assistance and Motivation
                </MenuItem>
                <MenuItem
                  className="text-capitalize bukra stepper-label-view"
                  sx={{
                    color: "#58585B"
                  }}
                  onClick={() => handleMoreOptionClick('Conduct & Compliance')}>
                  Conduct & Compliance
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>
      </Box>
    </Drawer>
  )
}

export default DepartmentDrawer;