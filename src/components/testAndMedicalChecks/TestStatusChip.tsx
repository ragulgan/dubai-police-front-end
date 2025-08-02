import { Chip } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FitToPlayIcon from "../../../public/FitToPlayIcon.svg";
import NotFitIcon from "../../../public/NotFitIcon.svg";
import RecoveringIcon from "../../../public/RecoveringIcon.svg";
import InjuredIcon from "../../../public/InjuredIcon.svg";

interface TestStatusChipProps {
  status: string;
}

const TestStatusChip: React.FC<TestStatusChipProps> = ({ status }) => {

  if (status.toLowerCase() === "fittoplay")
    return <Chip className="dubai-med text-capitalize status-chip" label="Fit To Play" variant="outlined" sx={{ color: "#008755", borderColor: "#008755", padding: 1 }} icon={<FitToPlayIcon />} />

  if (status.toLowerCase() === "notfit")
    return <Chip className="dubai-med text-capitalize status-chip" label="Not Fit" variant="outlined" sx={{ color: "#00205B", borderColor: "#00205B", padding: 1 }} icon={<NotFitIcon />} />

  if (status.toLowerCase() === "recovering")
    return <Chip className="dubai-med text-capitalize status-chip" label="Recovering" variant="outlined" sx={{ color: "#05868E", borderColor: "#05868E", padding: 1 }} icon={<RecoveringIcon />} />

  if (status.toLowerCase() === "injured")
    return <Chip className="dubai-med text-capitalize status-chip" label="Injured" variant="outlined" sx={{ color: "#E4002B", borderColor: "#E4002B", padding: 1 }} icon={<InjuredIcon />} />

  return <Chip className="dubai-med text-capitalize status-chip" label="Unknown" variant="outlined" sx={{ padding: 1 , color: "#616161", borderColor: "#616161",}} icon={<HelpOutlineIcon />} />
}

export default TestStatusChip;