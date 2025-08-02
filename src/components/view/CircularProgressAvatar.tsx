import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CameraSVG from "../../../public/CameraSVG.svg";

interface CircularProgressAvatarProps {
  progress: number;
  avatarSrc: string;
}

const CircularProgressAvatar: React.FC<CircularProgressAvatarProps> = ({ progress, avatarSrc }) => (
  <Box position="relative" display="inline-flex">
    <CircularProgress
      variant="determinate"
      value={100}
      thickness={2}
      size={120}
      style={{ color: '#26D07C4D' }}
    />
    <CircularProgress
      variant="determinate"
      value={progress}
      thickness={2}
      size={120}
      style={{ position: 'absolute', color: '#26D07C' }}
    />
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Avatar alt="Avatar" src={avatarSrc} style={{ width: 110, height: 110 }} />
      <Box
        position="absolute"
        bottom={0}
        right={0}
        bgcolor="#26D07C"
        borderRadius="50%"
        p={0.5}
        sx={{ cursor: 'pointer', width: 26, height: 26 }}
      >
        <CameraSVG style={{ width: 19, height: 19 }} />
      </Box>
    </Box>
  </Box>
);

export default CircularProgressAvatar;
