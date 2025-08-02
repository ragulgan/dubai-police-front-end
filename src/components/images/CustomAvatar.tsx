import React from 'react';
import Avatar from '@mui/material/Avatar';
import { SxProps, Theme } from '@mui/system';

interface CustomAvatarProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  mb?: number;
  sx?: SxProps<Theme>;
}

const CustomAvatar: React.FC<CustomAvatarProps> = ({ src, alt, width = 50, height = 50, mb = 2, sx }) => (
  <Avatar
    src={src}
    alt={alt}
    sx={{
      width: width,
      height: height,
      mb: mb,
      ...sx,
    }}
  />
);

export default CustomAvatar;
