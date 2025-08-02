import { Chip } from "@mui/material";
import YetToStart from "../../../public/goalStatus/YetToStart.svg";
import InProgress from "../../../public/goalStatus/InProgress.svg";
import Completed from "../../../public/goalStatus/Completed.svg";

type GoalStatusChipProps = {
  status: string;
}

const GoalStatusChip: React.FC<GoalStatusChipProps> = ({ status }) => {
  const roleLowerCase = status ? status.toLowerCase() : "";
  if (roleLowerCase === "inprogress")
    return (
      <Chip
        className="dubai-regular text-capitalize status-chip"
        label="In Progress"
        variant="outlined"
        sx={{
          padding: 1,
          color: "#00205B",
          borderColor: "#00205B",
          backgroundColor: "#F6F8FE",
        }}
        icon={<InProgress />}
      />
    );

  if (roleLowerCase === "completed")
    return (
      <Chip
        className="dubai-regular text-capitalize status-chip"
        label="Completed"
        variant="outlined"
        sx={{
          padding: 1,
          color: "#008755",
          borderColor: "#008755",
          backgroundColor: "#E5FFF6",
        }}
        icon={<Completed />}
      />
    );

  return (
    <Chip
      className="dubai-regular text-capitalize status-chip"
      label="Yet To Start"
      variant="outlined"
      sx={{
        padding: 1,
        color: "#A60A3D",
        borderColor: "#A60A3D",
        backgroundColor: "#FFF7F8",
      }}
      icon={<YetToStart />}
    />
  );
}

export default GoalStatusChip;