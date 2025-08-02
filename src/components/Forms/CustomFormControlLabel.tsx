// src/components/CustomFormControlLabel.tsx
import React from 'react';
import { FormControlLabel, FormControlLabelProps } from '@mui/material';
import { styled } from '@mui/material/styles';

// Define the reusable styled component
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  margin: 0,
  padding: 0, // Adjust the padding as needed
  '& .MuiFormControlLabel-label': {
    fontSize: '14px', // Adjust the font size as needed
    color: '#58585B'
  },
}));

interface CustomFormControlLabelProps extends FormControlLabelProps { }

const CustomFormControlLabel: React.FC<CustomFormControlLabelProps> = (props) => {
  return <StyledFormControlLabel {...props} />;
};

export default CustomFormControlLabel;
