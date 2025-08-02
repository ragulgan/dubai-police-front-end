import { Chip } from "@mui/material";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Pending from "../../../public/pending.svg";
import ClearIcon from '@mui/icons-material/Clear';
import CheckIcon from '@mui/icons-material/Check';

interface TestStatusChipProps {
  status: string;
}

const SuggestionStatusChip: React.FC<TestStatusChipProps> = ({ status }) => {
  if (!status) return null; // Handle undefined/null case

  if (status.toLowerCase() === "pending")
    return <Chip className="dubai-med text-capitalize status-chip" label="Pending" variant="outlined" sx={{ color: "rgba(252, 138, 0, 1)", borderColor: "rgba(252, 138, 0, 1)", backgroundColor: 'rgba(255, 248, 240, 1)', padding: 1 }} icon={<Pending />} />

  if (status.toLowerCase() === "approved")
    return <Chip className="dubai-med text-capitalize status-chip" label="Approved" variant="outlined" sx={{ color: "rgba(0, 135, 85, 1)", borderColor: "rgba(0, 135, 85, 1)", backgroundColor: 'rgba(229, 255, 246, 1)', padding: 1 }} 
  icon={<CheckIcon sx={{ color: "rgba(0, 135, 85, 1) !important" }} />}     />

  if (status.toLowerCase() === "rejected")
    return <Chip className="dubai-med text-capitalize status-chip" label="Rejected" variant="outlined" sx={{ color: "rgba(228, 0, 43, 1)", borderColor: "rgba(228, 0, 43, 1)", backgroundColor: 'rgba(254, 245, 247, 1)', padding: 1 }} icon={<ClearIcon sx={{ color: "rgba(228, 0, 43, 1) !important" }} />} 
    />
  if (status.toLowerCase() === "ended")
    return <Chip className="dubai-med text-capitalize status-chip" label="Ended" variant="outlined" sx={{ color: "rgba(88, 88, 91, 1)", borderColor: "rgba(88, 88, 91, 1)", backgroundColor: 'rgba(254, 245, 249, 1)', padding: 1 }} icon={<ClearIcon sx={{
      color: "rgba(88, 88, 91, 1) !important"
    }} />} 
    />
  if (status.toLowerCase() === "voted")
    return <Chip className="dubai-med text-capitalize status-chip" label="Voted" variant="outlined" sx={{ color: "rgba(0, 135, 85, 1)", borderColor: "rgba(0, 135, 85, 1)", backgroundColor: 'rgba(229, 255, 246, 1)', padding: 1 }} icon={<CheckIcon sx={{ color: "rgba(0, 135, 85, 1) !important" }} />} />

  return <Chip className="dubai-med text-capitalize status-chip" label="Unknown" variant="outlined" sx={{ padding: 1 }} icon={<HelpOutlineIcon />} />
}

export default SuggestionStatusChip;