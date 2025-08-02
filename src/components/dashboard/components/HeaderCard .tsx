import React from 'react';
import { Box, Typography, Button, Menu, MenuItem } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const HeaderCard = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedYear, setSelectedYear] = React.useState("2025"); 
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectYear = (year: string) => {
    setSelectedYear(year); 
    handleClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: 2,
        padding: 2,
        background: 'linear-gradient(130deg, #C6E17E 0%, #00A87E 50%,rgb(75, 114, 177) 100%)',
        color: '#fff',
        overflow: 'hidden',
      }}
    >
      <Box display="flex" alignItems="center">
        <Box
          component="img"
          src="/commander/commanderShield.svg"
          alt="Commander’s Shield Logo"
          sx={{ height: 160, mr: 10 }}
        />
        <Box sx={{ height: 100, mr: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: 'black' }}>
            Commander's Shield<br />
            Races & Tournaments
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'black' }}>
            {selectedYear} 
          </Typography>
        </Box>
      </Box>

      <Box>
        <Button
          variant="contained"
          onClick={handleClick}
          endIcon={<ArrowDropDownIcon />}
          sx={{
            backgroundColor: '#00754A',
            '&:hover': {
              backgroundColor: '#005F3A',
            },
            borderRadius: 1,
            minWidth: 80,
            textTransform: 'none',
          }}
        >
          {selectedYear}
        </Button>
        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem onClick={() => handleSelectYear("2024")}>2024</MenuItem>
          <MenuItem onClick={() => handleSelectYear("2025")}>2025</MenuItem>
          <MenuItem onClick={() => handleSelectYear("2026")}>2026</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default HeaderCard;
