import { styled, Switch, Typography, FormControl, FormHelperText } from '@mui/material';
import { color } from 'html2canvas/dist/types/css/types/color';
import { values } from 'lodash';
import React from 'react';
import { Controller, Control } from 'react-hook-form';

interface CustomAntSwitchProps {
  label?: string;
  name: string;
  control: Control<any>;
  error?: string;
}

const AntSwitch = styled(Switch, {
  shouldForwardProp: (prop) => prop !== 'checked',
})<{ checked: boolean }>(({ theme, checked }) => ({
  width: 36,
  height: 20,
  padding: 0,
  display: 'flex',
  alignItems: 'center',
  '& .MuiSwitch-switchBase': {
    padding: 2,
    top: '50%',
    transform: 'translateY(-50%)', // Center vertically
    '&.Mui-checked': {
      transform: 'translateX(16px) translateY(-50%)', // Centered when toggled
      color: '#008755',
      '& + .MuiSwitch-track': {
        backgroundColor: '#ffffff',
        border: '2px solid #008755',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    width: 14,
    height: 14,
    borderRadius: '50%',
    backgroundColor: checked ? '#008755' : '#A0A0A0',
    border: checked ? '2px solid #008755' : '2px solid #A0A0A0',
    transition: theme.transitions.create(['background-color', 'border'], {
      duration: 200,
    }),
    position: 'relative',
  },
  '& .MuiSwitch-track': {
    borderRadius: 10,
    backgroundColor: 'transparent',
    border: checked ? '2px solid #008755' : '2px solid #A0A0A0',
    opacity: 1,
    boxSizing: 'border-box',
  },
}));



const CustomAntSwitch: React.FC<CustomAntSwitchProps> = ({ label = "Status", name, control, error }) => {
  return (
    <FormControl component="fieldset" error={!!error} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', gap: '5px' }}>
      <Typography variant="body1" sx={{ fontSize: '14px' }} className="typography textfield-label bukra">
        {label}
      </Typography>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AntSwitch checked={field.value} onChange={field.onChange} inputProps={{ 'aria-label': label }} />
            <Typography sx={{ fontWeight: 500, color: field.value ? '#008755' : '#A0A0A0' }} className="dubai-med">
              {field.value === 1 ? 'Active' : 'Inactive'}
            </Typography>
          </div>
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default CustomAntSwitch;
