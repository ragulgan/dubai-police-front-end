import { IconButton, Tooltip } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

type TooltipIconProps = {
  tooltipMsg: string;
};

const TooltipIcon: React.FC<TooltipIconProps> = ({ tooltipMsg }) => {
  return (
    <Tooltip title={tooltipMsg} placement="bottom">
      <IconButton
        color="primary"
        sx={{ borderBottom: "1px solid #DEE2ED", borderRadius: "0px" }}
      >
        <InfoIcon />
      </IconButton>
    </Tooltip>
  );
};

export default TooltipIcon;