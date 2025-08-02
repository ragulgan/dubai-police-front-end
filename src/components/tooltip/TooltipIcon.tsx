import { IconButton, styled } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';

type TooltipIconProps = {
  tooltipMsg: string;
};

export const TooltipIcon: React.FC<TooltipIconProps> = ({ tooltipMsg }) => {
  return (
    <Tooltip title={tooltipMsg} placement="right">
      <IconButton
        color="primary"
        sx={{ borderBottom: "1px solid #DEE2ED", borderRadius: "0px" }}
      >
        <InfoIcon />
      </IconButton>
    </Tooltip>
  );
};

export const CustomTooltip = styled(({ className, ...props }: any) => (
  <Tooltip
    {...props}
    arrow
    classes={{ popper: className }}
    placement="bottom-start"
    PopperProps={{
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 0],
          },
        },
      ],
    }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'transparent',
    padding: 0,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: 'white',
    '&::before': {
      boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
    },
  },
}));