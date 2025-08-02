"use client"
import React from 'react';
import Slider from '@mui/material/Slider';
import { styled } from '@mui/system';

interface SliderPros {
  value: number;
}

const CustomSlider = styled(Slider)({
  '& .MuiSlider-thumb': {
    display: 'none',
    pointerEvents: 'none',
  },
  '& .MuiSlider-track': {
    pointerEvents: 'none',
  },
  '& .MuiSlider-rail': {
    pointerEvents: 'none',
  },
});

const AppSlider: React.FC<SliderPros> = ({ value }) => {
  return (
    <CustomSlider defaultValue={value} />
  );
};

export default AppSlider;
